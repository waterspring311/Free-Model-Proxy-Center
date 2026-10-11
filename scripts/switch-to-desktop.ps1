[CmdletBinding()]
param(
    [string]$Package = 'release\OneHub',
    [string]$DataDirectory = '',
    [int]$TimeoutSeconds = 120
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$packagePath = if ([System.IO.Path]::IsPathRooted($Package)) { $Package } else { Join-Path $root $Package }
$launcher = Join-Path $packagePath 'OneHub.exe'
$desktop = Join-Path $packagePath 'OneHub 桌面版.exe'
foreach ($file in $launcher, $desktop) {
    if (-not (Test-Path -LiteralPath $file)) { Write-Host "[切换] 缺少 $file" -ForegroundColor Red; exit 1 }
}

if (-not $DataDirectory) { $DataDirectory = Join-Path $root 'data' }
$DataDirectory = [System.IO.Path]::GetFullPath($DataDirectory)
if (-not (Test-Path -LiteralPath $DataDirectory)) { Write-Host "[切换] 数据目录不存在：$DataDirectory" -ForegroundColor Red; exit 1 }
Set-Content -LiteralPath (Join-Path $packagePath 'data-dir.txt') -Value $DataDirectory -Encoding UTF8
Write-Host "[切换] 桌面版数据目录：$DataDirectory"

function Test-Health([int]$Port = 3000) {
    try {
        $result = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/healthz" -TimeoutSec 3
        return $result.service -eq 'onehub'
    } catch { return $false }
}

function Wait-Health([int]$Port, [int]$Seconds) {
    $timer = [Diagnostics.Stopwatch]::StartNew()
    while ($timer.Elapsed.TotalSeconds -lt $Seconds) {
        if (Test-Health $Port) { return $true }
        Start-Sleep -Milliseconds 1000
    }
    return $false
}

# 1. Stop whatever currently serves the gateway and its engines.
$listeners = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object LocalPort -in 3000, 8080, 8081, 8788 | Select-Object -ExpandProperty OwningProcess -Unique)
foreach ($id in $listeners) {
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $id" -ErrorAction SilentlyContinue
    if (-not $process) { continue }
    $owned = $process.ExecutablePath -eq 'E:\nodejs\node.exe' -or
        $process.CommandLine -match '免费模型反代白嫖' -or
        $process.ExecutablePath -match 'OneHub' -or
        $process.Name -eq 'opencode2api.exe'
    if ($owned) {
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
        Write-Host "[切换] 已停止 $($process.Name) (PID $id)"
    } else {
        Write-Host "[切换] 跳过非本项目进程 $($process.Name) (PID $id)" -ForegroundColor Yellow
    }
}
Start-Sleep -Seconds 3
$busy = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object LocalPort -in 3000, 8080, 8081, 8788)
if ($busy.Count) { Write-Host "[切换] 端口仍被占用，等待释放……" -ForegroundColor Yellow; Start-Sleep -Seconds 4 }

# 2. Desktop shell starts the gateway itself (shared data directory).
Write-Host '[切换] 启动桌面版'
Start-Process -FilePath $desktop -WorkingDirectory $packagePath | Out-Null

if (-not (Wait-Health 3000 $TimeoutSeconds)) {
    Write-Host '[切换] 桌面版未能拉起网关，回退到一键启动脚本。' -ForegroundColor Yellow
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'start-onehub.ps1') -NoBrowser
    if (-not (Wait-Health 3000 60)) { Write-Host '[切换] 网关仍未就绪，请检查 data\logs。' -ForegroundColor Red; exit 1 }
}

$ports = @(Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object LocalPort -in 3000, 8080, 8081, 8788 | Select-Object -ExpandProperty LocalPort | Sort-Object -Unique)
$result = [ordered]@{
    gateway = (Test-Health 3000)
    listening = ($ports -join ',')
    data = $DataDirectory
    desktop_running = [bool](Get-Process -Name 'OneHub 桌面版' -ErrorAction SilentlyContinue)
}
Write-Host ("[切换] 完成：" + ($result | ConvertTo-Json -Compress)) -ForegroundColor Green
