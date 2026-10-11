[CmdletBinding()]
param(
    [string]$Package = 'release\OneHub',
    [int]$GatewayPort = 3100,
    [int]$EnginePort = 8899
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
$packagePath = [System.IO.Path]::GetFullPath((Join-Path $root $Package))
$exe = Join-Path $packagePath 'OneHub.exe'
$python = Join-Path $packagePath 'python\python.exe'
$entry = Join-Path $packagePath 'app\scripts\workbuddy-entry.py'

foreach ($file in $exe, $python, $entry) {
    if (-not (Test-Path -LiteralPath $file)) { Write-Host "[验证] 缺少 $file" -ForegroundColor Red; exit 1 }
}

function Wait-Port([int]$PortNumber, [int]$Seconds = 20) {
    $timer = [Diagnostics.Stopwatch]::StartNew()
    while ($timer.Elapsed.TotalSeconds -lt $Seconds) {
        $client = New-Object System.Net.Sockets.TcpClient
        try { if ($client.ConnectAsync('127.0.0.1', $PortNumber).Wait(300) -and $client.Connected) { return $true } }
        catch { }
        finally { $client.Dispose() }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

function Get-Json([string]$Url, [hashtable]$Headers = @{}) {
    try { return Invoke-RestMethod -Uri $Url -Headers $Headers -TimeoutSec 5 } catch { return $null }
}

$temp = Join-Path ([System.IO.Path]::GetTempPath()) ('onehub-verify-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $temp -Force | Out-Null
$results = [ordered]@{}
$engineProcess = $null

try {
    # 1. Gateway without engines, isolated data directory.
    $env:ONEHUB_DATA_DIR = Join-Path $temp 'data'
    $env:ONEHUB_PORT = [string]$GatewayPort
    $env:ONEHUB_NO_ENGINES = '1'
    & $exe | Out-Null
    if ($LASTEXITCODE -ne 0) { throw '启动器返回失败。' }
    $health = Get-Json "http://127.0.0.1:$GatewayPort/healthz"
    if (-not $health -or $health.service -ne 'onehub') { throw "网关 $GatewayPort 未就绪。" }
    $page = Invoke-WebRequest -Uri "http://127.0.0.1:$GatewayPort/" -UseBasicParsing -TimeoutSec 5
    $results.gateway = "ok:$($page.StatusCode)"
    $status = & $exe --status | ConvertFrom-Json
    $results.status_command = [bool]$status.running
    $results.bundled_python_detected = [bool]$status.python

    # 2. Bundled Python must run the WorkBuddy engine.
    $accounts = Join-Path $temp 'wb\accounts'
    $usage = Join-Path $temp 'wb\usage'
    New-Item -ItemType Directory -Path $accounts, $usage -Force | Out-Null
    $env:ACCOUNTS_DIR = $accounts
    $env:API_KEY = 'portable-verify-key'
    $env:ONEHUB_WB_PANEL_PASSWORD = 'portable-verify-panel'
    $engineProcess = Start-Process -FilePath $python `
        -ArgumentList @($entry, '--host', '127.0.0.1', '--port', [string]$EnginePort,
            '--accounts-dir', $accounts, '--usage-dir', $usage) `
        -WorkingDirectory (Join-Path $packagePath 'app') -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $temp 'engine.log') -RedirectStandardError (Join-Path $temp 'engine.err.log')
    if (-not (Wait-Port $EnginePort)) { throw "内置 Python 未能启动引擎（端口 $EnginePort）。" }
    $engineHealth = Get-Json "http://127.0.0.1:$EnginePort/health" @{ Authorization = 'Bearer portable-verify-key' }
    if (-not $engineHealth -or -not $engineHealth.ok) { throw '引擎健康检查失败。' }
    $results.bundled_python_engine = "ok:accounts=$($engineHealth.accounts)"

    # 3. Clean shutdown releases both ports.
    & $exe --stop | Out-Null
    Start-Sleep -Seconds 2
    $results.gateway_stopped = -not (Wait-Port $GatewayPort 2)
    Write-Host ("[验证] 通过：" + ($results | ConvertTo-Json -Compress)) -ForegroundColor Green
}
finally {
    if ($engineProcess -and -not $engineProcess.HasExited) { Stop-Process -Id $engineProcess.Id -Force -ErrorAction SilentlyContinue }
    $env:ONEHUB_NO_ENGINES = $null
    $resolved = [System.IO.Path]::GetFullPath($temp)
    $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
    if ($resolved.StartsWith($tempRoot) -and (Split-Path -Leaf $resolved) -like 'onehub-verify-*') {
        Remove-Item -LiteralPath $resolved -Recurse -Force -ErrorAction SilentlyContinue
    }
}
