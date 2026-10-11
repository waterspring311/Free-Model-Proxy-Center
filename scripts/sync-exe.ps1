[CmdletBinding()]
param(
    [switch]$Build,
    [switch]$Desktop,
    [switch]$ForceRestart,
    [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$env:ONEHUB_NO_BROWSER = '1'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
function Write-Step([string]$Message) { Write-Host "[同步] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[同步] $Message" -ForegroundColor Red; exit 1 }

$packagePath = Join-Path $root 'release\OneHub'
$launcher = Join-Path $packagePath 'OneHub.exe'
$desktopExe = Join-Path $packagePath 'OneHub 桌面版.exe'
if (-not (Test-Path -LiteralPath $launcher)) { Fail '还没有发布目录，请先运行 scripts\build-portable.ps1。' }

function Get-TreeHash([string[]]$Paths) {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $parts = foreach ($item in $Paths) {
            if (-not (Test-Path -LiteralPath $item)) { continue }
            Get-ChildItem -LiteralPath $item -Recurse -File | Sort-Object FullName | ForEach-Object {
                $_.FullName.Substring($root.Length) + '=' + (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
            }
        }
        return [BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes(($parts -join '|')))).Replace('-', '')
    } finally { $sha.Dispose() }
}

if ($Build) {
    Write-Step '构建管理后台'
    & npm run build
    if ($LASTEXITCODE -ne 0) { Fail '前端构建失败。' }
}

$watched = @((Join-Path $packagePath 'app\server'), (Join-Path $packagePath 'app\scripts'),
    (Join-Path $packagePath 'app\upstream'))
$before = Get-TreeHash $watched

# The desktop window locks its own exe, so close it before replacing files.
if ($Desktop) {
    Write-Step '关闭桌面窗口以便替换文件'
    Get-Process -Name 'OneHub 桌面版' -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 900
}

Write-Step '同步到桌面版目录'
$arguments = @('-NoZip')
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'update-package.ps1') @arguments
if ($LASTEXITCODE -ne 0) { Fail '同步失败。' }

if ($Desktop) {
    Write-Step '重新编译桌面外壳'
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'build-desktop.ps1') -Package $packagePath -NoZip
    if ($LASTEXITCODE -ne 0) { Fail '桌面外壳编译失败。' }
}

$after = Get-TreeHash $watched
$restart = $ForceRestart -or ($before -ne $after)
if (-not $restart) {
    # A gateway that cannot answer /api/version is running pre-sync code.
    try { Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/version' -TimeoutSec 4 | Out-Null }
    catch { $restart = $true }
}
if ($restart) {
    Write-Step '重启网关（服务端代码有变化）'
    # Start-Process keeps the launcher's console away from this script's stdout,
    # otherwise the detached gateway keeps the pipeline open. Do not pass
    # -Wait: it would also wait for the long-lived gateway child.
    Start-Process -FilePath $launcher -ArgumentList '--stop' -WorkingDirectory $packagePath -WindowStyle Hidden | Out-Null
    Start-Sleep -Seconds 2
    Start-Process -FilePath $launcher -WorkingDirectory $packagePath -WindowStyle Hidden | Out-Null
    $timer = [Diagnostics.Stopwatch]::StartNew()
    $ready = $false
    while ($timer.Elapsed.TotalSeconds -lt 90) {
        try {
            if ((Invoke-RestMethod -Uri 'http://127.0.0.1:3000/healthz' -TimeoutSec 3).service -eq 'onehub') { $ready = $true; break }
        } catch { }
        Start-Sleep -Milliseconds 1000
    }
    if (-not $ready) { Fail '网关重启后未就绪，请查看 data\logs。' }
} else {
    Write-Step '仅前端变化，网关无需重启（桌面窗口会自动刷新）'
}

if ($Desktop) {
    Write-Step '重启桌面窗口'
    Start-Process -FilePath $desktopExe -WorkingDirectory $packagePath | Out-Null
}

$version = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/version' -TimeoutSec 5
Write-Host ("[同步] 完成 · build={0} · 网关已重启={1} · 桌面窗口已重启={2}" -f $version.build, $restart, [bool]$Desktop) -ForegroundColor Green
Write-Host '[同步] 桌面窗口会在 8 秒内自动刷新到最新界面。' -ForegroundColor Green
