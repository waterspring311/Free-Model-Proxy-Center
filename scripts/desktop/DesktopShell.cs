// OneHub desktop shell: a native window around the local console.
// Compiled with the .NET Framework csc.exe that ships with Windows, so the
// project does not need a .NET SDK. Rendering uses the WebView2 runtime that
// Windows already installs alongside Edge.
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace OneHub.Desktop
{
    internal static class Program
    {
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern bool SetDllDirectory(string path);

        [STAThread]
        private static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            string exeDir = Path.GetDirectoryName(Application.ExecutablePath);
            string dependencies = Path.Combine(exeDir, "desktop");
            if (Directory.Exists(dependencies)) SetDllDirectory(dependencies);
            AppDomain.CurrentDomain.AssemblyResolve += delegate(object sender, ResolveEventArgs arguments)
            {
                string simple = new AssemblyName(arguments.Name).Name;
                string file = Path.Combine(dependencies, simple + ".dll");
                return File.Exists(file) ? Assembly.LoadFrom(file) : null;
            };
            try
            {
                Application.Run(new MainForm(exeDir));
            }
            catch (Exception error)
            {
                MessageBox.Show(error.Message, "OneHub", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }

    internal sealed class MainForm : Form
    {
        private readonly string exeDir;
        private readonly string baseUrl;
        private readonly string launcher;
        private readonly Label status;
        private readonly WebView2 view;
        private NotifyIcon tray;
        private bool exiting;
        private System.Windows.Forms.Timer watcher;
        private string currentBuild;
        private bool gatewayDown;

        public MainForm(string directory)
        {
            exeDir = directory;
            launcher = Path.Combine(exeDir, "OneHub.exe");
            string port = Environment.GetEnvironmentVariable("ONEHUB_PORT");
            if (string.IsNullOrEmpty(port)) port = "3000";
            baseUrl = "http://127.0.0.1:" + port + "/";

            Text = "OneHub · API 控制台";
            Width = 1340;
            Height = 880;
            MinimumSize = new Size(960, 640);
            StartPosition = FormStartPosition.CenterScreen;
            BackColor = Color.FromArgb(245, 244, 239);
            Font = new Font("Microsoft YaHei UI", 9F);
            try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); }
            catch (Exception) { }

            status = new Label();
            status.Dock = DockStyle.Fill;
            status.TextAlign = ContentAlignment.MiddleCenter;
            status.Font = new Font("Microsoft YaHei UI", 12F);
            status.ForeColor = Color.FromArgb(111, 109, 103);
            status.Text = "正在启动 OneHub……";

            view = new WebView2();
            view.Dock = DockStyle.Fill;
            view.Visible = false;

            Controls.Add(view);
            Controls.Add(status);
            BuildTray();
            watcher = new System.Windows.Forms.Timer();
            watcher.Interval = 8000;
            watcher.Tick += delegate { Watch(); };
            watcher.Start();
        }

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            Log("window shown");
            Thread worker = new Thread(StartGateway);
            worker.IsBackground = true;
            worker.Start();
        }

        private void BuildTray()
        {
            ContextMenuStrip menu = new ContextMenuStrip();
            menu.Items.Add("显示主界面", null, delegate { Restore(); });
            menu.Items.Add("重新启动服务", null, delegate { RestartService(); });
            menu.Items.Add("在浏览器中打开", null, delegate { OpenBrowser(); });
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add("退出（保留后台服务）", null, delegate { Exit(false); });
            menu.Items.Add("停止服务并退出", null, delegate { Exit(true); });
            tray = new NotifyIcon();
            tray.Text = "OneHub API 控制台";
            try { tray.Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); }
            catch (Exception) { tray.Icon = SystemIcons.Application; }
            tray.ContextMenuStrip = menu;
            tray.Visible = true;
            tray.DoubleClick += delegate { Restore(); };
        }

        private bool Healthy()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(baseUrl + "healthz");
                request.Timeout = 2000;
                request.ReadWriteTimeout = 2000;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    return reader.ReadToEnd().IndexOf("onehub", StringComparison.OrdinalIgnoreCase) >= 0;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        private void StartGateway()
        {
            if (!Healthy())
            {
                try
                {
                    ProcessStartInfo info = new ProcessStartInfo(launcher);
                    info.WorkingDirectory = exeDir;
                    info.UseShellExecute = false;
                    info.CreateNoWindow = true;
                    info.EnvironmentVariables["ONEHUB_NO_BROWSER"] = "1";
                    Process.Start(info);
                }
                catch (Exception error)
                {
                    SetStatus("无法启动服务：" + error.Message);
                    return;
                }
            }
            for (int attempt = 0; attempt < 90; attempt++)
            {
                if (Healthy())
                {
                    BeginInvoke(new Action(LoadConsole));
                    return;
                }
                Thread.Sleep(1000);
            }
            SetStatus("启动超时。请查看 data\\logs 目录中的日志，然后重新打开。");
        }

        private void SetStatus(string message)
        {
            if (IsDisposed) return;
            BeginInvoke(new Action(delegate
            {
                status.Text = message;
                status.Visible = true;
                view.Visible = false;
            }));
        }

        private void LoadConsole()
        {
            status.Text = "正在加载管理后台……";
            InitializeAsync();
        }

        private async void InitializeAsync()
        {
            try
            {
                string profile = Path.Combine(exeDir, "data", "webview2");
                Directory.CreateDirectory(profile);
                CoreWebView2Environment environment = await CoreWebView2Environment.CreateAsync(null, profile, null);
                await view.EnsureCoreWebView2Async(environment);
                view.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                view.CoreWebView2.Settings.IsStatusBarEnabled = false;
                view.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;
                view.CoreWebView2.NewWindowRequested += OnNewWindowRequested;
                view.CoreWebView2.NavigationCompleted += OnNavigationCompleted;
                view.Source = new Uri(baseUrl);
            }
            catch (Exception error)
            {
                status.Text = "WebView2 初始化失败：" + error.Message
                    + "\n\n请确认已安装 Microsoft Edge WebView2 运行时。";
            }
        }

        private void OnNavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            if (!e.IsSuccess)
            {
                status.Text = "页面加载失败：" + e.WebErrorStatus;
                status.Visible = true;
                view.Visible = false;
                return;
            }
            status.Visible = false;
            view.Visible = true;
        }

        private void OnNewWindowRequested(object sender, CoreWebView2NewWindowRequestedEventArgs e)
        {
            e.Handled = true;
            try { Process.Start(e.Uri); }
            catch (Exception) { }
        }

        private void OpenBrowser()
        {
            try { Process.Start(baseUrl); }
            catch (Exception) { }
        }

        // Polls the gateway so a synced frontend or a restarted service shows up
        // without the user touching the tray menu.
        private void Watch()
        {
            Thread worker = new Thread(delegate()
            {
                string build = FetchBuild();
                if (build == null)
                {
                    gatewayDown = true;
                    return;
                }
                bool recovered = gatewayDown;
                gatewayDown = false;
                if (currentBuild == null)
                {
                    currentBuild = build;
                    return;
                }
                if (!recovered && build == currentBuild) return;
                currentBuild = build;
                string target = baseUrl + "?build=" + build;
                Log((recovered ? "gateway recovered, reload build=" : "frontend updated, reload build=") + build);
                try { BeginInvoke(new Action(delegate { Reload(target); })); }
                catch (Exception) { /* window is closing */ }
            });
            worker.IsBackground = true;
            worker.Start();
        }

        private string FetchBuild()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(baseUrl + "api/version");
                request.Timeout = 4000;
                request.ReadWriteTimeout = 4000;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    string body = reader.ReadToEnd();
                    int index = body.IndexOf("\"build\":\"", StringComparison.Ordinal);
                    if (index < 0) return null;
                    int start = index + 9, end = body.IndexOf('"', start);
                    return end > start ? body.Substring(start, end - start) : null;
                }
            }
            catch (Exception) { return null; }
        }

        private void Reload(string target)
        {
            if (view.CoreWebView2 != null) view.CoreWebView2.Navigate(target);
        }

        private void Log(string message)
        {
            try
            {
                string directory = Path.Combine(exeDir, "data", "logs");
                Directory.CreateDirectory(directory);
                File.AppendAllText(Path.Combine(directory, "desktop.log"),
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " " + message + Environment.NewLine);
            }
            catch (Exception) { /* logging must never break the shell */ }
        }

        // Restarts the gateway through the launcher so a stopped service can be
        // brought back without leaving the desktop window.
        private void RestartService()
        {
            status.Text = "正在重新启动服务……";
            status.Visible = true;
            view.Visible = false;
            Thread worker = new Thread(delegate()
            {
                try
                {
                    RunLauncher("--stop", 15000);
                    RunLauncher(string.Empty, 20000);
                    for (int attempt = 0; attempt < 60; attempt++)
                    {
                        if (Healthy())
                        {
                            BeginInvoke(new Action(delegate
                            {
                                status.Visible = false;
                                view.Visible = true;
                                if (view.CoreWebView2 != null) view.CoreWebView2.Navigate(baseUrl);
                            }));
                            return;
                        }
                        Thread.Sleep(1000);
                    }
                    SetStatus("服务重启超时，请查看 data\\logs 中的日志。");
                }
                catch (Exception error)
                {
                    SetStatus("服务重启失败：" + error.Message);
                }
            });
            worker.IsBackground = true;
            worker.Start();
        }

        private void RunLauncher(string arguments, int timeoutMs)
        {
            ProcessStartInfo info = new ProcessStartInfo(launcher, arguments);
            info.WorkingDirectory = exeDir;
            info.UseShellExecute = false;
            info.CreateNoWindow = true;
            info.EnvironmentVariables["ONEHUB_NO_BROWSER"] = "1";
            using (Process process = Process.Start(info))
            {
                process.WaitForExit(timeoutMs);
            }
        }

        private void Restore()
        {
            Show();
            WindowState = FormWindowState.Normal;
            Activate();
        }

        private void Exit(bool stopService)
        {
            exiting = true;
            if (stopService)
            {
                try
                {
                    ProcessStartInfo info = new ProcessStartInfo(launcher, "--stop");
                    info.WorkingDirectory = exeDir;
                    info.UseShellExecute = false;
                    info.CreateNoWindow = true;
                    Process.Start(info);
                }
                catch (Exception) { }
            }
            if (tray != null) tray.Visible = false;
            if (watcher != null) watcher.Stop();
            Close();
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (!exiting && e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true;
                Hide();
                if (tray != null) tray.ShowBalloonTip(2500, "OneHub 仍在后台运行",
                    "双击托盘图标可重新打开窗口，右键可停止服务。", ToolTipIcon.Info);
                return;
            }
            base.OnFormClosing(e);
        }
    }
}
