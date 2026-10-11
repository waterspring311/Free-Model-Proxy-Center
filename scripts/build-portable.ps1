[CmdletBinding()]
param(
    [string]$Output = 'release\OneHub',
    [string]$PythonVersion = '3.11.9',
    [switch]$SkipBuild,
    [switch]$SkipPython,
    [switch]$SkipDesktop,
    [switch]$IncludeData,
    [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

function Write-Step([string]$Message) { Write-Host "[打包] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[打包] $Message" -ForegroundColor Red; exit 1 }

$node = (Get-Command node.exe -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if (-not $node) { Fail '没有找到 Node.js 24 或更新版本。' }
$nodeVersion = (& $node --version).Trim()
if ($nodeVersion -notmatch '^v(\d+)\.' -or [int]$Matches[1] -lt 24) { Fail "需要 Node.js 24 或更新版本，当前 $nodeVersion。" }
$npx = (Get-Command npx.cmd -ErrorAction SilentlyContinue | Select-Object -First 1).Source
if (-not $npx) { Fail '没有找到 npx（随 Node.js 一起安装）。' }

$releaseRoot = [System.IO.Path]::GetFullPath((Join-Path $root 'release'))
$outPath = [System.IO.Path]::GetFullPath((Join-Path $root $Output))
if (-not $outPath.StartsWith($releaseRoot + [System.IO.Path]::DirectorySeparatorChar)) {
    Fail "输出目录必须位于 $releaseRoot 内。"
}
$buildDir = Join-Path $releaseRoot '.build'

Write-Step "输出目录：$outPath"
if (Test-Path -LiteralPath $outPath) {
    Write-Step '清理旧输出'
    Remove-Item -LiteralPath $outPath -Recurse -Force
}
if (Test-Path -LiteralPath $buildDir) {
    Remove-Item -LiteralPath $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $outPath, $buildDir -Force | Out-Null

if (-not $SkipBuild) {
    Write-Step '构建管理后台'
    & npm run build
    if ($LASTEXITCODE -ne 0) { Fail '前端构建失败。' }
}
if (-not (Test-Path -LiteralPath (Join-Path $root 'dist\index.html'))) { Fail '缺少 dist，先运行 npm run build。' }

Write-Step '复制程序文件'
$app = Join-Path $outPath 'app'
New-Item -ItemType Directory -Path $app -Force | Out-Null
foreach ($item in 'server', 'dist') {
    Copy-Item -LiteralPath (Join-Path $root $item) -Destination $app -Recurse -Force
}
New-Item -ItemType Directory -Path (Join-Path $app 'scripts') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root 'scripts\workbuddy-entry.py') -Destination (Join-Path $app 'scripts') -Force

$runtimeSource = Get-ChildItem -LiteralPath (Join-Path $root 'runtime') -Directory -ErrorAction SilentlyContinue |
    Where-Object Name -like 'opencode2api_*' | Sort-Object Name -Descending | Select-Object -First 1
if (-not $runtimeSource) { Fail '没有找到 OpenCode 引擎，先运行 npm run setup。' }
New-Item -ItemType Directory -Path (Join-Path $app 'runtime') -Force | Out-Null
Copy-Item -LiteralPath $runtimeSource.FullName -Destination (Join-Path $app 'runtime') -Recurse -Force

$engineSource = Join-Path $root 'upstream\workbuddy2api-hub'
if (-not (Test-Path -LiteralPath (Join-Path $engineSource 'wb_proxy.py'))) { Fail '缺少 WorkBuddy 引擎源码，先运行 npm run setup。' }
$engineTarget = Join-Path $app 'upstream\workbuddy2api-hub'
New-Item -ItemType Directory -Path $engineTarget -Force | Out-Null
Get-ChildItem -LiteralPath $engineSource -File | Where-Object { $_.Name -notlike '*.log' } |
    Copy-Item -Destination $engineTarget -Force
foreach ($folder in 'docs', 'pricing', 'wrt') {
    $source = Join-Path $engineSource $folder
    if (Test-Path -LiteralPath $source) { Copy-Item -LiteralPath $source -Destination $engineTarget -Recurse -Force }
}

Copy-Item -LiteralPath (Join-Path $root 'package.json') -Destination $app -Force
Copy-Item -LiteralPath (Join-Path $root 'README.md') -Destination $app -Force

Write-Step '生成 OneHub.exe'
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'portable\launcher.cjs') -Destination (Join-Path $buildDir 'launcher.cjs') -Force
@{
    main = (Join-Path $buildDir 'launcher.cjs')
    output = (Join-Path $buildDir 'sea-prep.blob')
    disableExperimentalSEAWarning = $true
} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $buildDir 'sea-config.json') -Encoding UTF8
Push-Location $buildDir
try {
    & $node --experimental-sea-config sea-config.json
    if ($LASTEXITCODE -ne 0) { Fail '生成 SEA 描述失败。' }
} finally { Pop-Location }
$exe = Join-Path $outPath 'OneHub.exe'
Copy-Item -LiteralPath $node -Destination $exe -Force
& $npx --yes postject $exe NODE_SEA_BLOB (Join-Path $buildDir 'sea-prep.blob') --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
if ($LASTEXITCODE -ne 0) { Fail '注入启动器失败（postject）。' }

if (-not $SkipPython) {
    Write-Step "准备 Python $PythonVersion 运行时"
    $cache = Join-Path $root '.cache\python'
    New-Item -ItemType Directory -Path $cache -Force | Out-Null
    $archive = Join-Path $cache "python-$PythonVersion-embed-amd64.zip"
    if (-not (Test-Path -LiteralPath $archive)) {
        $source = "https://www.python.org/ftp/python/$PythonVersion/python-$PythonVersion-embed-amd64.zip"
        Write-Step "下载 $source"
        Invoke-WebRequest -Uri $source -OutFile $archive -TimeoutSec 600
    }
    $pythonDir = Join-Path $outPath 'python'
    Expand-Archive -LiteralPath $archive -DestinationPath $pythonDir -Force
    $pythonExe = Join-Path $pythonDir 'python.exe'
    & $pythonExe -c "import ssl, ctypes, sqlite3, urllib.request, http.server, json; print('python runtime ok')"
    if ($LASTEXITCODE -ne 0) { Fail '内置 Python 运行时自检失败。' }
}

if ($IncludeData) {
    Write-Step '复制现有 data 目录（含账号与密钥）'
    Copy-Item -LiteralPath (Join-Path $root 'data') -Destination (Join-Path $outPath 'data') -Recurse -Force
}

Write-Step '写入说明与快捷方式'
$readme = @"
OneHub 便携版
=============

双击「OneHub 桌面版.exe」：在原生窗口中打开控制台，网关和两个上游引擎
在后台运行。关闭窗口会最小化到托盘，右键托盘图标可以停止服务。

双击 OneHub.exe：不打开窗口，仅后台启动服务并用默认浏览器打开控制台。
再次双击不会重复启动。

停止 OneHub.bat  停止后台服务（同时停止两个引擎）
控制台模式.bat   前台运行并显示日志，关闭窗口即停止

目录说明
  OneHub 桌面版.exe  原生窗口外壳（使用系统 WebView2 运行时）
  desktop\           WebView2 组件，请勿删除
  OneHub.exe         后台启动器，内含 Node.js 运行时
  app\               服务端、管理后台、两个上游引擎
  python\            内置 Python 运行时（WorkBuddy 引擎使用）
  data\              数据库、账号凭据、运行日志，首次启动自动创建

运行要求
  Windows x64，需要 Microsoft Edge WebView2 运行时（Windows 10/11 通常
  随 Edge 预装）。除本目录外不需要安装 Node.js 或 Python。

常用命令
  OneHub.exe --status   查看运行状态
  OneHub.exe --stop     停止服务
  OneHub.exe --console  前台运行

注意
  data 目录包含上游凭据与加密主密钥，复制或备份时请妥善保管。
  端口被占用时可通过环境变量 ONEHUB_PORT 指定其他端口。
"@
Set-Content -LiteralPath (Join-Path $outPath 'README-便携版.txt') -Value $readme -Encoding UTF8
Set-Content -LiteralPath (Join-Path $outPath '停止 OneHub.bat') -Encoding OEM -Value @"
@echo off
cd /d "%~dp0"
"%~dp0OneHub.exe" --stop
pause
"@
Set-Content -LiteralPath (Join-Path $outPath '控制台模式.bat') -Encoding OEM -Value @"
@echo off
cd /d "%~dp0"
"%~dp0OneHub.exe" --console
pause
"@

Remove-Item -LiteralPath $buildDir -Recurse -Force

if (-not $SkipDesktop) {
    Write-Step '构建桌面版外壳'
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'build-desktop.ps1') -Package $outPath -NoZip
    if ($LASTEXITCODE -ne 0) { Fail '桌面版外壳构建失败。' }
}

if (-not $IncludeData -and (Test-Path -LiteralPath (Join-Path $outPath 'data'))) {
    Write-Step '清理自检产生的 data 目录'
    Remove-Item -LiteralPath (Join-Path $outPath 'data') -Recurse -Force
}

if (-not $NoZip) {
    Write-Step '生成压缩包'
    $zip = Join-Path $releaseRoot ("OneHub-portable-" + (Get-Date -Format 'yyyyMMdd') + '.zip')
    if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
    Compress-Archive -Path (Join-Path $outPath '*') -DestinationPath $zip -CompressionLevel Optimal
    Write-Host "[打包] 压缩包：$zip" -ForegroundColor Green
}

$size = [math]::Round(((Get-ChildItem -LiteralPath $outPath -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 1)
Write-Host "[打包] 完成：$outPath（$size MB）" -ForegroundColor Green
Write-Host '[打包] 双击 OneHub.exe 即可启动。' -ForegroundColor Green
