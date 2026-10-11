[CmdletBinding()]
param(
    [string]$Package = 'release\OneHub',
    [int]$WaitSeconds = 12
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$packagePath = if ([System.IO.Path]::IsPathRooted($Package)) { $Package } else { Join-Path $root $Package }
$exe = Join-Path $packagePath 'OneHub 桌面版.exe'
if (-not (Test-Path -LiteralPath $exe)) { Write-Host "[验证] 缺少 $exe" -ForegroundColor Red; exit 1 }

$webViewBefore = @(Get-Process msedgewebview2 -ErrorAction SilentlyContinue).Count
$process = Start-Process -FilePath $exe -WorkingDirectory $packagePath -PassThru
try {
    Start-Sleep -Seconds $WaitSeconds
    $process.Refresh()
    if ($process.HasExited) { throw "桌面外壳提前退出，退出码 $($process.ExitCode)。" }
    $webViewAfter = @(Get-Process msedgewebview2 -ErrorAction SilentlyContinue).Count
    $result = [ordered]@{
        shell_running = $true
        window_title = $process.MainWindowTitle
        webview2_processes = $webViewAfter
        webview2_started = $webViewAfter -gt $webViewBefore
    }
    Write-Host ("[验证] " + ($result | ConvertTo-Json -Compress)) -ForegroundColor Green
    if (-not $result.webview2_started) { Write-Host '[验证] 未检测到 WebView2 子进程。' -ForegroundColor Yellow }
}
finally {
    if (-not $process.HasExited) { Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue }
}
