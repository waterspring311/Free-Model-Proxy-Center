[CmdletBinding()]
param(
    [string]$Package = 'release\OneHub',
    [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
function Write-Step([string]$Message) { Write-Host "[更新] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[更新] $Message" -ForegroundColor Red; exit 1 }

$packagePath = if ([System.IO.Path]::IsPathRooted($Package)) { $Package } else { Join-Path $root $Package }
if (-not (Test-Path -LiteralPath (Join-Path $packagePath 'OneHub.exe'))) {
    Fail "没有找到 $packagePath\OneHub.exe，请先运行 scripts\build-portable.ps1 生成完整包。"
}

if (-not (Test-Path -LiteralPath (Join-Path $root 'dist\index.html'))) { Fail '缺少 dist，请先运行 npm run build。' }

Write-Step '同步管理后台'
$distTarget = Join-Path $packagePath 'app\dist'
if (Test-Path -LiteralPath $distTarget) { Remove-Item -LiteralPath $distTarget -Recurse -Force }
Copy-Item -LiteralPath (Join-Path $root 'dist') -Destination $distTarget -Recurse -Force

Write-Step '同步服务端代码'
$serverTarget = Join-Path $packagePath 'app\server'
if (Test-Path -LiteralPath $serverTarget) { Remove-Item -LiteralPath $serverTarget -Recurse -Force }
Copy-Item -LiteralPath (Join-Path $root 'server') -Destination $serverTarget -Recurse -Force

Write-Step '同步 WorkBuddy 引擎'
Copy-Item -LiteralPath (Join-Path $root 'scripts\workbuddy-entry.py') -Destination (Join-Path $packagePath 'app\scripts') -Force
$engineSource = Join-Path $root 'upstream\workbuddy2api-hub'
$engineTarget = Join-Path $packagePath 'app\upstream\workbuddy2api-hub'
Get-ChildItem -LiteralPath $engineSource -File | Where-Object { $_.Name -notlike '*.log' } |
    Copy-Item -Destination $engineTarget -Force

if (-not $NoZip) {
    $releaseRoot = [System.IO.Path]::GetFullPath((Join-Path $root 'release'))
    $zip = Join-Path $releaseRoot ("OneHub-portable-" + (Get-Date -Format 'yyyyMMdd') + '.zip')
    Get-ChildItem -LiteralPath $releaseRoot -Filter 'OneHub-portable-*.zip' -File |
        Where-Object { $_.FullName -ne $zip } | Remove-Item -Force
    if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
    Write-Step '更新压缩包'
    # Stage a copy first: while the desktop app runs its WebView2 DLLs and the
    # WebView2 profile stay open, and runtime state should not ship anyway.
    $stageRoot = Join-Path $releaseRoot '.stage'
    if (Test-Path -LiteralPath $stageRoot) { Remove-Item -LiteralPath $stageRoot -Recurse -Force }
    $stage = Join-Path $stageRoot 'OneHub'
    New-Item -ItemType Directory -Path $stage -Force | Out-Null
    Get-ChildItem -LiteralPath $packagePath -Force | Where-Object { $_.Name -ne 'data' } | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination $stage -Recurse -Force
    }
    Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zip -CompressionLevel Optimal
    Remove-Item -LiteralPath $stageRoot -Recurse -Force
    Write-Host "[更新] 压缩包：$zip" -ForegroundColor Green
}

Write-Host '[更新] 完成。正在运行的网关需要重启后才会使用新代码：' -ForegroundColor Green
Write-Host '       OneHub.exe --stop  然后  OneHub.exe' -ForegroundColor Green
