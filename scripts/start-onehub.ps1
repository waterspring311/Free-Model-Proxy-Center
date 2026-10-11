[CmdletBinding()]
param(
    [switch]$NoBrowser,
    [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Stop-WithMessage([string]$Message) {
    Write-Host "[OneHub] $Message" -ForegroundColor Red
    exit 1
}

trap {
    Stop-WithMessage $_.Exception.Message
}

function Find-Executable([string[]]$Candidates) {
    foreach ($candidate in $Candidates) {
        if ([string]::IsNullOrWhiteSpace($candidate)) {
            continue
        }
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            return (Resolve-Path -LiteralPath $candidate).Path
        }
    }
    return $null
}

function Test-OneHub {
    try {
        $health = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 1
        return $health.service -eq 'onehub'
    } catch {
        return $false
    }
}

function Test-Listening([int]$PortNumber) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $connection = $client.ConnectAsync('127.0.0.1', $PortNumber)
        return $connection.Wait(300) -and $client.Connected
    } catch {
        return $false
    } finally {
        $client.Dispose()
    }
}

function Open-OneHub {
    if (-not $NoBrowser -and -not $CheckOnly) {
        Start-Process $url | Out-Null
    }
}

$port = 3000
if ($env:ONEHUB_PORT -and (-not [int]::TryParse($env:ONEHUB_PORT, [ref]$port) -or $port -lt 1 -or $port -gt 65535)) {
    Stop-WithMessage 'ONEHUB_PORT 必须是 1 到 65535 之间的端口号。'
}
$env:ONEHUB_PORT = [string]$port
$url = "http://127.0.0.1:$port/"
$healthUrl = $url + 'healthz'

if (Test-OneHub) {
    Write-Host "[OneHub] 已经在运行：$url" -ForegroundColor Green
    Open-OneHub
    exit 0
}

# Serialize simultaneous double-clicks, including installation and build steps.
$hash = [System.Security.Cryptography.SHA256]::Create()
$lockId = [BitConverter]::ToString($hash.ComputeHash([Text.Encoding]::UTF8.GetBytes("$projectRoot|$port"))).Replace('-', '')
$hash.Dispose()
$launchMutex = New-Object System.Threading.Mutex($false, "Local\OneHubLaunch_$lockId")
$ownsMutex = $false
try {
    try {
        $ownsMutex = $launchMutex.WaitOne(0)
    } catch [System.Threading.AbandonedMutexException] {
        $ownsMutex = $true
    }
    if (-not $ownsMutex) {
        Stop-WithMessage '另一个启动窗口正在准备 OneHub，请等待它完成。'
    }
    # Another launch may have finished between the initial check and the lock.
    if (Test-OneHub) {
        Write-Host "[OneHub] 已经在运行：$url" -ForegroundColor Green
        Open-OneHub
        exit 0
    }
    if (Test-Listening $port) {
        Stop-WithMessage "端口 $port 已被其他程序占用，请先释放端口或设置 ONEHUB_PORT。"
    }

$nodeFromPath = (Get-Command node.exe -ErrorAction SilentlyContinue | Select-Object -First 1).Source
$node = Find-Executable @(
    $nodeFromPath,
    (Join-Path ${env:ProgramFiles} 'nodejs\node.exe'),
    'E:\nodejs\node.exe'
)
if (-not $node) {
    Stop-WithMessage '没有找到 Node.js。请安装 Node.js 24 或更新版本。'
}

$nodeVersion = (& $node --version 2>$null | Select-Object -First 1).Trim()
if ($nodeVersion -notmatch '^v(\d+)\.') {
    Stop-WithMessage '无法读取 Node.js 版本。'
}
$nodeMajor = [int]$Matches[1]
if ($nodeMajor -lt 24) {
    Stop-WithMessage "当前 Node.js 为 $nodeVersion，需要 24 或更新版本。"
}

$npmFromPath = (Get-Command npm.cmd -ErrorAction SilentlyContinue | Select-Object -First 1).Source
$npm = Find-Executable @(
    (Join-Path (Split-Path -Parent $node) 'npm.cmd'),
    $npmFromPath
)
if (-not $npm) {
    Stop-WithMessage '没有找到 npm.cmd。请确认 Node.js 安装完整。'
}

Write-Host "[OneHub] 项目目录：$projectRoot" -ForegroundColor Cyan
Write-Host "[OneHub] Node.js：$nodeVersion" -ForegroundColor DarkCyan

$useEngines = $env:ONEHUB_NO_ENGINES -ne '1'
if ($useEngines) {
    if ($port -in @(8080, 8081, 8788)) {
        Stop-WithMessage '网关端口不能与引擎端口 8080、8081、8788 相同。'
    }
    foreach ($enginePort in @(8080, 8081, 8788)) {
        if (Test-Listening $enginePort) {
            Stop-WithMessage "引擎端口 $enginePort 已被占用，请先关闭旧的反代服务。"
        }
    }
    $pythonFromPath = (Get-Command python.exe -ErrorAction SilentlyContinue | Select-Object -First 1).Source
    $python = if ($env:ONEHUB_PYTHON) {
        Find-Executable @($env:ONEHUB_PYTHON, (Get-Command $env:ONEHUB_PYTHON -ErrorAction SilentlyContinue | Select-Object -First 1).Source)
    } else {
        Find-Executable @($pythonFromPath, 'E:\cwj\Python\Python311\python.exe')
    }
    if (-not $python) {
        Stop-WithMessage '没有找到 Python 3.11 或更新版本，请安装或设置 ONEHUB_PYTHON。'
    }
    & $python -c "import sys; print('Python ' + sys.version.split()[0]); sys.exit(0 if sys.version_info >= (3, 11) else 1)"
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage 'WorkBuddy 需要 Python 3.11 或更新版本。'
    }
    $env:ONEHUB_PYTHON = $python
}

$needsInstall = @('react', 'react-dom', 'lucide-react', 'vite') | Where-Object {
    -not (Test-Path -LiteralPath (Join-Path $projectRoot "node_modules\$_\package.json"))
}
if ($needsInstall) {
    if ($CheckOnly) {
        Stop-WithMessage '依赖尚未安装，双击一键启动.bat 会自动安装。'
    }
    Write-Host '[OneHub] 首次运行，正在安装依赖……' -ForegroundColor Yellow
    & $npm install --no-fund --no-audit
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage 'npm install 失败。'
    }
}

$openCodeBinary = if ($env:ONEHUB_OPENCODE_BIN) {
    [System.IO.Path]::GetFullPath($env:ONEHUB_OPENCODE_BIN)
} else {
    Join-Path $projectRoot 'runtime\opencode2api_v1.3.7_windows_amd64\opencode2api.exe'
}
$workBuddySource = Join-Path $projectRoot 'upstream\workbuddy2api-hub\wb_proxy.py'
if ($useEngines -and (-not (Test-Path -LiteralPath $openCodeBinary) -or -not (Test-Path -LiteralPath $workBuddySource))) {
    if ($CheckOnly -or $env:ONEHUB_OPENCODE_BIN) {
        Stop-WithMessage '引擎文件不存在，请检查 ONEHUB_OPENCODE_BIN 或运行 npm run setup。'
    }
    Write-Host '[OneHub] 正在准备 OpenCode / WorkBuddy 引擎……' -ForegroundColor Yellow
    & $npm run setup
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage '引擎准备失败。'
    }
}

$builtIndex = Join-Path $projectRoot 'dist\index.html'
$needsBuild = -not (Test-Path -LiteralPath $builtIndex)
if (-not $needsBuild) {
    $buildTime = (Get-Item -LiteralPath $builtIndex).LastWriteTimeUtc
    $inputs = @(Get-ChildItem -LiteralPath (Join-Path $projectRoot 'src'), (Join-Path $projectRoot 'public') -File -Recurse)
    $inputs += Get-Item -LiteralPath (Join-Path $projectRoot 'index.html'), (Join-Path $projectRoot 'vite.config.mjs'), (Join-Path $projectRoot 'package.json'), (Join-Path $projectRoot 'package-lock.json')
    $needsBuild = [bool]($inputs | Where-Object LastWriteTimeUtc -gt $buildTime | Select-Object -First 1)
}
if ($needsBuild) {
    if ($CheckOnly) {
        Stop-WithMessage '管理后台需要构建，双击一键启动.bat 会自动构建。'
    }
    Write-Host '[OneHub] 正在构建管理后台……' -ForegroundColor Yellow
    & $npm run build
    if ($LASTEXITCODE -ne 0) {
        Stop-WithMessage '前端构建失败。'
    }
}

if ($CheckOnly) {
    Write-Host '[OneHub] 环境检查通过，当前服务未启动。' -ForegroundColor Green
    exit 0
}

Write-Host '[OneHub] 正在启动网关和两个上游引擎……' -ForegroundColor Yellow
$dataDirectory = if ($env:ONEHUB_DATA_DIR) {
    [System.IO.Path]::GetFullPath($env:ONEHUB_DATA_DIR)
} else {
    Join-Path $projectRoot 'data'
}
$logDirectory = Join-Path $dataDirectory 'logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
$server = Start-Process `
    -FilePath $node `
    -ArgumentList @('server\main.mjs') `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logDirectory 'onehub.stdout.log') `
    -RedirectStandardError (Join-Path $logDirectory 'onehub.stderr.log') `
    -PassThru

$ready = $false
$timer = [Diagnostics.Stopwatch]::StartNew()
while ($timer.Elapsed.TotalSeconds -lt 45) {
    Start-Sleep -Seconds 1
    $server.Refresh()
    if ($server.HasExited) {
        Stop-WithMessage "OneHub 进程已退出（退出码 $($server.ExitCode)），请查看 $logDirectory。"
    }
    if (Test-OneHub) {
        $ready = -not $useEngines -or ((Test-Listening 8080) -and (Test-Listening 8081) -and (Test-Listening 8788))
        if ($ready) {
            break
        }
    }
}

if (-not $ready) {
    Stop-WithMessage "等待服务启动超时，请查看 $logDirectory；网关地址为 $url。"
}

Write-Host "[OneHub] 启动成功：$url" -ForegroundColor Green
Write-Host "[OneHub] API 地址：http://127.0.0.1:$port/v1" -ForegroundColor DarkCyan
Write-Host '[OneHub] 服务在后台运行，关闭本窗口后仍可使用。' -ForegroundColor DarkCyan
Open-OneHub
} finally {
    if ($ownsMutex) {
        $launchMutex.ReleaseMutex()
    }
    $launchMutex.Dispose()
}
exit 0
