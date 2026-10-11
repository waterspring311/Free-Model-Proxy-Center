# OneHub

把 OpenCode Zen / Go 和 WorkBuddy / CodeBuddy 接入到同一个本地 API 网关与管理后台。

控制台提供渠道状态、账号管理、OAuth 授权、JSON 导入、渠道管理、模型目录、模型别名、客户端 API Key 权限、限流、请求日志和用量统计。两个原有反代引擎负责协议转换与账号池调度，OneHub 负责统一入口和访问控制。

“渠道状态”页面每 15 秒自动刷新（可关闭），展示各渠道的在线状态、健康检查耗时、并发占用、今日请求、成功率、平均耗时、首字节、Token 用量、今日 24 小时请求分布以及最近一次异常，并提供托管引擎的重启入口。数据来自 `requests` 表按北京时间当天聚合，不会调用上游额外接口。

## 启动

需要 Windows x64、Node.js 24 或更新版本、Python 3.11 或更新版本，以及安装时的网络连接。

```powershell
npm install
npm run setup
npm run build
npm start
```

也可以直接双击项目根目录的 `一键启动.bat`，原来的 `start-onehub.bat` 使用同一个启动流程。脚本检查 Node.js 24+ 和 Python 3.11+，缺少项目依赖或引擎时自动安装，前端有更新时自动构建，再启动 OneHub、OpenCode 和 WorkBuddy 并打开管理后台。首次准备需要网络连接。

服务在后台运行，启动窗口关闭后仍可使用。再次双击会直接打开已经运行的管理后台，不会重复启动；端口被其他程序占用时会提示原因。启动日志写入 `data/logs/onehub.stdout.log` 和 `data/logs/onehub.stderr.log`，两个引擎的日志也保存在该目录。

控制台：`http://127.0.0.1:3000/`  
API Base URL：`http://127.0.0.1:3000/v1`

首次访问时创建管理员，密码至少 10 位。此版本监听回环地址，面向本机单管理员使用。

## 接入账号

- OpenCode：在“账号管理”添加 Zen 或 Go Key，支持每行一个批量添加。公开匿名通道默认启用，可以停用。
- WorkBuddy：选择国际版或国内版，获取 OAuth 授权链接，在浏览器完成授权后自动加入账号池。
- 也可以手动导入 WorkBuddy 导出的 JSON 对象或数组。重复账号默认跳过，导入结果显示新增、跳过及无效数量。
- WorkBuddy 账号支持启停、刷新凭据和查询额度；调度、模型冷却与会话黏性由原引擎处理。

账号不会自动从已安装的桌面客户端导入。自动签到、奖励任务保持关闭。

## 客户端调用

在“API Keys”创建客户端 Key，配置 Base URL，并从模型目录复制完整模型 ID：

```text
opencode/<上游模型 ID>
workbuddy/<上游模型 ID>
codebuddy/<上游模型 ID>
```

相同模型名通过前缀区分。可以创建 `my-default` 等别名，指向完整模型 ID。别名不会自动跨渠道故障切换。

模型目录保存到 SQLite 的 `models` 和 `model_catalogs` 表，包括上游 ID、完整元数据、免费标记、支持的接口和同步时间。访问目录时按设置中的缓存有效期刷新，也可以在“模型管理”点击“同步模型”立即拉取并写入数据库。重启后保留目录；上游同步失败时保留上次成功的数据，并在后台标记为过期。成功同步时移除上游不再列出的模型，不影响已设置的启停和别名。

在“设置 → 模型费用”开启“仅允许免费模型”后，模型目录和数据库只保留确认免费的模型，API 同时拒绝付费、未知及未列出的模型，别名也受同一策略限制。策略保存在 SQLite，重启和同步后继续生效。WorkBuddy 按接入账号所在区域的实时产品配置核对 `credits` 倍率，零倍率才算免费；内置目录中的历史价格不会作为免费依据。价格同步失败时保留目录并标记过期，暂停该渠道的免费模型调用，直至价格核验恢复。上游改为收费后，下次同步自动移除。

免费与当前额度分开处理：例如 Hy4 preview 免费版的 ID 为 `hy4-preview-f`，即使账号暂时限额，也保留在目录中，由上游返回限额状态。模型详情显示倍率与价格核验时间，并保存协议限制，例如仅支持 `/v1/systemone` 的模型不能当作聊天模型使用。未开启免费策略时，可以使用“仅免费模型”筛选查看免费条目。

支持以下接口，具体协议能力仍取决于上游模型和原引擎：

```text
GET  /v1/models
POST /v1/chat/completions
POST /v1/responses
POST /v1/messages
POST /v1/messages/count_tokens  # WorkBuddy；估算值
POST /v1/systemone             # OpenCode
```

认证支持 `Authorization: Bearer <OneHub Key>` 和 `x-api-key`。OneHub 会转换模型前缀、使用对应引擎的内部认证，并转发请求正文和 SSE。OpenCode Responses 请求中的 `custom` 工具和 `namespace` 工具会转换为上游接受的函数工具；返回时恢复原始工具类型、命名空间和流式事件，工具调用历史也会转换。

### Codex CLI

在 Codex 配置中添加以下提供商，模型从 OneHub 目录复制。这里以公开免费模型为例：

```toml
model_provider = "onehub"
model = "opencode/mimo-v2.6-flash-free"
web_search = "disabled"

[model_providers.onehub]
name = "OneHub"
base_url = "http://127.0.0.1:3000/v1"
wire_api = "responses"
env_key = "ONEHUB_API_KEY"
requires_openai_auth = false
```

启动 CLI 前设置 `ONEHUB_API_KEY` 为后台创建的客户端 Key。不要使用两个引擎的内部认证 Key。通过 3000 端口接入，才能使用免费策略和 Codex 工具转换。OpenCode 不提供内置服务端 `web_search` 执行器，因此示例关闭该内置工具；自定义函数工具仍然可用。未支持的内置工具会返回明确错误，不会被静默删除。

使用 CC Switch 时，在 Codex 页编辑 `onehub` 供应商，把 `web_search = "disabled"` 放在配置顶层，即第一个 `[model_providers.…]` 段之前。保存后启用 `onehub`，退出已经运行的 Codex CLI，再重新启动。

临时关闭搜索也可以在启动命令中指定：

```powershell
codex -c 'web_search="disabled"'
```

原有的模型、供应商和其他启动参数可以一起使用；移除启用内置搜索的 `--search` 参数。

## 打包便携版 exe

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-portable.ps1
```

脚本会构建前端、复制服务端与两个上游引擎、下载官方 Python 嵌入式运行时，把 Node.js 24 运行时和启动器打包成 `release\OneHub\OneHub.exe`（约 89 MB），再用系统自带的 C# 编译器生成原生窗口外壳 `OneHub 桌面版.exe`，最后生成 `release\OneHub-portable-<日期>.zip`（约 49 MB）。构建需要本机 Node.js 24 和网络连接（首次下载 Python 运行时、postject 与 WebView2 SDK）。

产物结构：

```text
OneHub 桌面版.exe      原生窗口外壳，双击即用（WebView2，和 CC Switch 同一种渲染方式）
OneHub.exe            启动器（内含 Node.js 运行时），后台启动并用浏览器打开
desktop\              WebView2 组件
app\                  服务端、管理后台、OpenCode 与 WorkBuddy 引擎
python\               内置 Python 运行时，供 WorkBuddy 引擎使用
data\                 首次启动时创建，保存数据库、凭据和日志
停止 OneHub.bat        停止后台服务
控制台模式.bat         前台运行并显示日志
```

双击 `OneHub 桌面版.exe` 会在原生窗口中打开控制台，窗口关闭时最小化到托盘，托盘菜单可显示主界面、用浏览器打开、退出或停止服务并退出。它只依赖系统已安装的 WebView2 运行时（Windows 10/11 随 Edge 预装），不需要 .NET SDK、Node.js 或 Python。`OneHub.exe` 仍保留纯后台模式：`--status` 查看状态，`--stop` 停止服务，`--console` 前台运行。

可用参数：`-Output` 自定义输出目录（必须位于 `release` 下），`-SkipBuild` 复用已有前端构建，`-SkipPython` 不下载 Python，`-SkipDesktop` 不生成桌面外壳，`-IncludeData` 连同当前 `data` 目录一起复制，`-NoZip` 跳过压缩包。桌面外壳也可以单独重建：`scripts\build-desktop.ps1`。打包后可用 `scripts\verify-portable.ps1`（3100 / 8899 端口）和 `scripts\verify-desktop.ps1` 做隔离自检，都不会影响正在运行的服务。

注意：注入启动器后 exe 的原始数字签名会失效，Windows 可能提示未知发布者；`data` 目录包含上游凭据与加密主密钥，分发压缩包前请确认没有把 `-IncludeData` 的产物发给他人。

Windows 下若工具返回 `windows sandbox failed: helper_unknown_error: setup refresh had errors`，检查 `%USERPROFILE%\.codex\.sandbox\sandbox.*.log`。这是本机沙箱启动错误。例如运行中的 `node_repl.exe` 被占用，会使 `elevated` 模式的运行时权限检查失败；shell 和电脑控制工具可能一起受影响。模型发出工具调用后，命令由本机 Codex 执行。

需要使用备用沙箱时，可以在配置中设置：

```toml
[windows]
sandbox = "unelevated"
```

已有 `[windows]` 段时修改其中的 `sandbox`，不要重复添加段名。`unelevated` 保留文件访问限制，但网络隔离比 `elevated` 弱。通过 CC Switch 接入时，把设置保存到 `onehub` 供应商配置，重新启用并重启 Codex CLI。也可以临时使用 `codex -c 'windows.sandbox="unelevated"'` 验证。旧会话需要重启才能加载新的设置。

Key 可以限制渠道、模型白名单（支持 `opencode/*` 等后缀通配）、每分钟请求数、到期时间及每日 Token 软上限。软上限按北京时间统计已完成请求的上报用量，并发及未上报用量可能导致超过限额。日志明确区分未上报用量，不将其伪装为精确的零用量。费用计费、多用户、套餐分组及分布式部署尚未实现。

## 数据与备份

- `data/onehub.sqlite`：SQLite 数据库，保存管理员、上游 Key、渠道、Key 哈希、模型目录及同步记录、模型别名、请求日志和操作记录。
- `data/master.key`：OneHub 上游 Key 加密密钥，丢失后无法解密原凭据。
- `data/opencode/`：OpenCode 运行配置，含引擎启动所需的凭据。
- `data/workbuddy/`：WorkBuddy 账号和引擎状态，采用原引擎存储格式。
- `data/logs/`：两个引擎的本地日志。

备份前停止服务，并保存完整 `data` 目录。运行配置和账号文件含敏感数据。不要提交到版本控制或公开分享。

## 本地端口与配置

| 服务 | 端口 |
| --- | --- |
| OneHub 控制台和 API | 3000 |
| OpenCode API | 8080 |
| OpenCode 内部管理端 | 8081 |
| WorkBuddy API 与内部管理端 | 8788 |

全部监听 `127.0.0.1`。端口占用会在渠道状态中显示；OneHub 不接管已有进程。

可选环境变量：

| 变量 | 用途 |
| --- | --- |
| `ONEHUB_PORT` | 网关端口，默认 3000 |
| `ONEHUB_DATA_DIR` | 数据目录 |
| `ONEHUB_PYTHON` | Python 可执行文件路径 |
| `ONEHUB_OPENCODE_BIN` | OpenCode 可执行文件路径 |
| `ONEHUB_NO_ENGINES=1` | 不启动内置引擎，用于开发或测试 |

## 验证与开发

```powershell
npm run check
npm test
npm run build
npm run test:ui
npm run dev
```

`npm test` 使用独立临时数据库和本地模拟上游，验证认证、路由、国内/国际区域、别名权限、SSE 透传、并发释放、限流、用量、账号管理和重启持久化。模拟测试不会消耗真实模型额度。

`npm run test:ui` 使用独立临时工作空间，操作真实后台页面，验证初始化、批量账号、模拟 OAuth、JSON 导入、模型别名、Key 权限和编辑、日志、设置、密码更新及手机布局。截图写入 `artifacts/ui/`。优先使用本机 Chrome / Edge；也可以通过 `ONEHUB_BROWSER` 指定浏览器可执行文件，或运行 `npx playwright install chromium` 安装测试浏览器。

OpenCode 引擎固定安装 `v1.3.7` 并校验发布包 SHA-256。`upstream/` 保留原项目及其许可证。两个引擎运行在各自子进程中。
