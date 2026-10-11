param([string]$Version = "v1.3.7")
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Runtime = Join-Path $Root "runtime"
New-Item -ItemType Directory -Force -Path $Runtime | Out-Null
if (!(Test-Path -LiteralPath (Join-Path $Root "upstream/opencode2api/go.mod"))) {
    git clone --depth 1 https://github.com/jasonxu114514/opencode2api.git (Join-Path $Root "upstream/opencode2api")
    if ($LASTEXITCODE -ne 0) { throw "OpenCode source clone failed." }
}
if (!(Test-Path -LiteralPath (Join-Path $Root "upstream/workbuddy2api-hub/wb_proxy.py"))) {
    git clone --depth 1 https://github.com/ardeyouxipianyi/workbuddy2api-hub.git (Join-Path $Root "upstream/workbuddy2api-hub")
    if ($LASTEXITCODE -ne 0) { throw "WorkBuddy source clone failed." }
}
$Package = "opencode2api_${Version}_windows_amd64"
$Archive = Join-Path $Runtime "$Package.zip"
$Base = "https://github.com/jasonxu114514/opencode2api/releases/download/$Version/$Package.zip"
if (!(Test-Path -LiteralPath (Join-Path $Runtime "$Package/opencode2api.exe"))) {
    Write-Host "Downloading OpenCode $Version..."
    Invoke-WebRequest -Uri $Base -OutFile $Archive -TimeoutSec 180
    $Checksum = (Invoke-WebRequest -Uri "$Base.sha256" -TimeoutSec 30).Content
    if ($Checksum -is [byte[]]) { $Checksum = [System.Text.Encoding]::UTF8.GetString($Checksum) }
    $Expected = ([string]$Checksum).Trim().Split()[0]
    $Actual = (Get-FileHash -LiteralPath $Archive -Algorithm SHA256).Hash
    if ($Actual -ine $Expected) { throw "OpenCode archive checksum mismatch." }
    Expand-Archive -LiteralPath $Archive -DestinationPath $Runtime -Force
}
Write-Host "Engine installed. Run npm install, npm run build, then start-onehub.bat."
