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
