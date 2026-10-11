[CmdletBinding()]
param(
    [string]$Package = 'release\OneHub',
    [string]$WebView2Version = '',
    [switch]$NoZip
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
function Write-Step([string]$Message) { Write-Host "[桌面版] $Message" -ForegroundColor Cyan }
function Fail([string]$Message) { Write-Host "[桌面版] $Message" -ForegroundColor Red; exit 1 }

$csc = @(
    "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe",
    "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $csc) { Fail '没有找到 .NET Framework 编译器 csc.exe。' }

$packagePath = if ([System.IO.Path]::IsPathRooted($Package)) {
    [System.IO.Path]::GetFullPath($Package)
} else {
    [System.IO.Path]::GetFullPath((Join-Path $root $Package))
}
if (-not (Test-Path -LiteralPath (Join-Path $packagePath 'OneHub.exe'))) {
    Fail "没有找到 $packagePath\OneHub.exe，请先运行 scripts\build-portable.ps1。"
}

$cache = Join-Path $root '.cache\webview2'
New-Item -ItemType Directory -Path $cache -Force | Out-Null
if (-not $WebView2Version) {
    $index = Invoke-RestMethod -Uri 'https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/index.json' -TimeoutSec 120
    $WebView2Version = ($index.versions | Where-Object { $_ -notmatch '-' } | Select-Object -Last 1)
}
Write-Step "WebView2 SDK $WebView2Version"
$archive = Join-Path $cache "microsoft.web.webview2.$WebView2Version.nupkg"
if (-not (Test-Path -LiteralPath $archive)) {
    Invoke-WebRequest -Uri "https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/$WebView2Version/microsoft.web.webview2.$WebView2Version.nupkg" `
        -OutFile $archive -TimeoutSec 600
}
$packageDir = Join-Path $cache "package-$WebView2Version"
if (-not (Test-Path -LiteralPath (Join-Path $packageDir 'lib\net462\Microsoft.Web.WebView2.Core.dll'))) {
    if (Test-Path -LiteralPath $packageDir) { Remove-Item -LiteralPath $packageDir -Recurse -Force }
    [System.IO.Compression.ZipFile]::ExtractToDirectory($archive, $packageDir)
}
$lib = Join-Path $packageDir 'lib\net462'
$native = Join-Path $packageDir 'runtimes\win-x64\native\WebView2Loader.dll'
foreach ($file in (Join-Path $lib 'Microsoft.Web.WebView2.Core.dll'), (Join-Path $lib 'Microsoft.Web.WebView2.WinForms.dll'), $native) {
    if (-not (Test-Path -LiteralPath $file)) { Fail "WebView2 SDK 缺少 $file" }
}

Write-Step '生成应用图标'
$iconPath = Join-Path $cache 'onehub.ico'
$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::Transparent)
$shape = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 58
$shape.AddArc(0, 0, $radius, $radius, 180, 90)
$shape.AddArc(256 - $radius, 0, $radius, $radius, 270, 90)
$shape.AddArc(256 - $radius, 256 - $radius, $radius, $radius, 0, 90)
$shape.AddArc(0, 256 - $radius, $radius, $radius, 90, 90)
$shape.CloseFigure()
$graphics.FillPath((New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(217, 119, 87))), $shape)
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 16
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($pen, 128, 96, 128, 148)
$graphics.DrawLine($pen, 64, 148, 192, 148)
$graphics.DrawLine($pen, 64, 148, 64, 176)
$graphics.DrawLine($pen, 192, 148, 192, 176)
foreach ($box in @(@(96, 48), @(32, 176), @(160, 176))) {
    $rounded = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = 14
    $x = $box[0]; $y = $box[1]; $w = 64; $h = 48
    $rounded.AddArc($x, $y, $r, $r, 180, 90)
    $rounded.AddArc($x + $w - $r, $y, $r, $r, 270, 90)
    $rounded.AddArc($x + $w - $r, $y + $h - $r, $r, $r, 0, 90)
    $rounded.AddArc($x, $y + $h - $r, $r, $r, 90, 90)
    $rounded.CloseFigure()
    $graphics.FillPath($white, $rounded)
    $rounded.Dispose()
}
$graphics.Dispose()
$icon = [System.Drawing.Icon]::FromHandle($bitmap.GetHicon())
$stream = [System.IO.File]::Create($iconPath)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$bitmap.Dispose()

Write-Step '编译桌面外壳'
$target = Join-Path $packagePath 'OneHub 桌面版.exe'
$source = Join-Path $PSScriptRoot 'desktop\DesktopShell.cs'
$arguments = @(
    '/nologo', '/target:winexe', '/platform:x64', '/optimize+', '/langversion:5',
    ('/out:' + $target), ('/win32icon:' + $iconPath),
    '/r:System.dll', '/r:System.Drawing.dll', '/r:System.Windows.Forms.dll',
    ('/r:' + (Join-Path $lib 'Microsoft.Web.WebView2.Core.dll')),
    ('/r:' + (Join-Path $lib 'Microsoft.Web.WebView2.WinForms.dll')),
    $source
)
& $csc $arguments
if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $target)) { Fail '桌面外壳编译失败。' }

$dependencyDir = Join-Path $packagePath 'desktop'
New-Item -ItemType Directory -Path $dependencyDir -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $lib 'Microsoft.Web.WebView2.Core.dll') -Destination $dependencyDir -Force
Copy-Item -LiteralPath (Join-Path $lib 'Microsoft.Web.WebView2.WinForms.dll') -Destination $dependencyDir -Force
Copy-Item -LiteralPath $native -Destination $dependencyDir -Force

if (-not $NoZip) {
    $releaseRoot = [System.IO.Path]::GetFullPath((Join-Path $root 'release'))
    $zip = Join-Path $releaseRoot ("OneHub-portable-" + (Get-Date -Format 'yyyyMMdd') + '.zip')
    if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
    Write-Step '更新压缩包'
    Compress-Archive -Path (Join-Path $packagePath '*') -DestinationPath $zip -CompressionLevel Optimal
    Write-Host "[桌面版] 压缩包：$zip" -ForegroundColor Green
}

$size = [math]::Round((Get-Item -LiteralPath $target).Length / 1KB, 1)
Write-Host "[桌面版] 完成：$target（$size KB，依赖 $dependencyDir）" -ForegroundColor Green
