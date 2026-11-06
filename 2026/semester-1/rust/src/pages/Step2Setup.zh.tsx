import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { OsTabs } from "../components/OsTabs";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step2SetupZh() {
  return (
    <Layout
      kicker="Step 2 · 4月9日"
      title="开发环境搭建 — Cargo · Toolchain · Debugger"
      subtitle="从 rustup 安装到 VS Code 调试器,按操作系统提供指南"
    >
      <Lede>
        完成本节后,您将能够在自己的机器上编写、编译并逐行调试 Rust 代码。
        按照下面的指南走完,就能成功输出"Hello, Rust!"。
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="安装 rustup · cargo 并运行 Hello World">
        <Lede>安装 Rust 工具链,创建第一个项目并运行它。</Lede>

        <p>
          Rust 使用官方安装工具 <strong>rustup</strong>。
          安装 rustup 会同时安装编译器(<code>rustc</code>)、包管理器(<code>cargo</code>)
          和标准库。不同操作系统的安装方式略有不同,请在下面的标签中选择您的系统。
        </p>

        <h3>🔧 安装 Rust</h3>

        <OsTabs
          tabs={[
            {
              id: "mac",
              label: "🍎 macOS",
              content: (
                <div>
                  <p>打开终端并运行下面的命令。<code>curl</code> 是从 URL 下载数据的命令行工具。</p>
                  <CodeBlock lang="bash">{`# 方法 1: 官方脚本(推荐)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 方法 2: 通过 Homebrew
brew install rustup-init
rustup-init -y`}</CodeBlock>
                  <p>安装结束后,请重新打开一个终端窗口以加载环境变量。</p>
                  <p>使用下面的命令确认安装:</p>
                  <CodeBlock lang="bash">{`rustc --version
cargo --version`}</CodeBlock>
                </div>
              ),
            },
            {
              id: "linux",
              label: "🐧 Linux",
              content: (
                <div>
                  <p>先安装链接器所需的构建工具,再安装 rustup。</p>
                  <CodeBlock lang="bash">{`# Ubuntu / Debian
sudo apt update
sudo apt install -y build-essential curl

# Fedora
sudo dnf groupinstall "Development Tools"

# Arch
sudo pacman -S base-devel`}</CodeBlock>
                  <p><code>build-essential</code> 提供了 Rust 生成最终二进制时所需的 C 链接器(<code>cc</code>)。</p>
                  <p>接着安装 rustup:</p>
                  <CodeBlock lang="bash">{`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"`}</CodeBlock>
                  <p>确认安装:</p>
                  <CodeBlock lang="bash">{`rustc --version
cargo --version`}</CodeBlock>
                </div>
              ),
            },
            {
              id: "win",
              label: "▦ Windows",
              content: (
                <div>
                  <p>打开 PowerShell 并运行下面的命令。<code>winget</code> 是 Windows 自带的包管理器。</p>
                  <CodeBlock lang="bash">{`# 方法 1: winget(Windows 10+)
winget install Rustlang.Rustup

# 方法 2: 从官网直接下载
# 在 https://rustup.rs 下载 rustup-init.exe 并运行。`}</CodeBlock>
                  <p>安装向导会提示您一并安装 <strong>Visual Studio Build Tools(C++ 构建工具)</strong>,请务必按提示安装。没有它会出现链接器错误。</p>
                  <p>安装完成后,重新打开一个 PowerShell 窗口确认:</p>
                  <CodeBlock lang="bash">{`rustc --version
cargo --version`}</CodeBlock>
                </div>
              ),
            },
          ]}
        />

        <Callout title="⚠️ Windows: 避免非 ASCII 用户名路径">
          如果 Windows 用户名中包含中文等非 ASCII 字符(如 <code>C:\Users\홍길동\</code>),
          某些 crate 的构建可能会失败。建议把项目放在类似 <code>C:\dev\</code> 的英文路径下。
        </Callout>

        <Callout title="⚠️ Windows: 必须安装 MSVC 构建工具">
          没有 MSVC 构建工具(C++ Build Tools)会导致链接器错误。
          请按照 rustup-init 安装向导的提示操作。
          在 Visual Studio Installer 中选择"使用 C++ 的桌面开发"工作负载即可。
        </Callout>

        <Callout title="⚠️ 校园网络下无法安装时">
          有些校园网会屏蔽 <code>sh.rustup.rs</code>。此时可以直接从{" "}
          <a href="https://rustup.rs" target="_blank" rel="noreferrer">https://rustup.rs</a> 下载安装程序。
        </Callout>

        <h3>🚀 创建第一个项目</h3>

        <p>使用 <code>cargo new</code> 命令创建新项目。<code>cargo</code> 是 Rust 的构建系统兼包管理器。</p>

        <CodeBlock lang="bash">{`cargo new hello_rust
cd hello_rust`}</CodeBlock>

        <p><code>cd</code> 用于切换目录,执行完上面的命令后就进入了 <code>hello_rust</code> 文件夹。</p>

        <p>生成的 <code>src/main.rs</code> 文件里已经写好了 Hello World。运行它:</p>

        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <p>终端打印出 <code>Hello, world!</code> 就说明成功了。</p>

        <p>常用的 cargo 命令如下:</p>

        <table>
          <tbody>
            <tr><td><code>cargo new 名称</code></td><td>创建新项目</td></tr>
            <tr><td><code>cargo build</code></td><td>编译(debug 模式)</td></tr>
            <tr><td><code>cargo run</code></td><td>编译 + 运行</td></tr>
            <tr><td><code>cargo check</code></td><td>仅做编译检查(快)</td></tr>
            <tr><td><code>cargo test</code></td><td>运行测试</td></tr>
          </tbody>
        </table>

        <h3>🧩 安装 VS Code 插件</h3>

        <p>在 VS Code 中安装下面三个插件。在扩展面板(<code>Ctrl+Shift+X</code>)中按名称搜索即可。</p>

        <ol>
          <li><strong>rust-analyzer</strong> — 实时提供代码补全、类型提示与错误标注。</li>
          <li><strong>CodeLLDB</strong> — 让您能够在 VS Code 中逐行调试 Rust 代码。</li>
          <li><strong>Even Better TOML</strong> — 为 <code>Cargo.toml</code> 提供语法高亮和补全。</li>
        </ol>

        <p>安装这三个就足够了。</p>

        <Checklist
          items={[
            <><code>rustc --version</code> 和 <code>cargo --version</code> 都能正常输出版本号。</>,
            <><code>cargo run</code> 在终端打印出 "Hello, world!"。</>,
            <>VS Code 中已安装 rust-analyzer、CodeLLDB 与 Even Better TOML。</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch01-01-installation.html", text: "The Rust Book — 1.1 安装" },
            { href: "https://doc.rust-lang.org/book/ch01-02-hello-world.html", text: "The Rust Book — 1.2 Hello, World!" },
            { href: "https://doc.rust-lang.org/book/ch01-03-hello-cargo.html", text: "The Rust Book — 1.3 Hello, Cargo!" },
            { href: "https://rustup.rs/", text: "rustup 官方网站" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="CodeLLDB 调试器实操">
        <Lede>学习如何在 VS Code 中逐行运行 Rust 代码并查看变量值。</Lede>

        <p>
          当程序行为不符合预期时,与其到处写 <code>println!</code>,不如使用{" "}
          <strong>调试器(Debugger)</strong>,它能让代码在任意一行停下来,
          直接查看变量的当前值。在 M1 中安装的 <strong>CodeLLDB</strong> 插件就是为此准备的。
        </p>

        <h3>实操 — 设置 launch.json</h3>

        <p>在 VS Code 中打开项目文件夹后,创建调试配置文件。</p>

        <ol>
          <li>点击左侧边栏的小虫子图标(Run and Debug)。</li>
          <li>点击"create a launch.json file",然后选择"LLDB"。</li>
          <li>把自动生成的 <code>.vscode/launch.json</code> 修改为下面的内容。</li>
        </ol>

        <CodeBlock lang="json">{`// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "lldb",
            "request": "launch",
            "name": "Debug",
            "cargo": {
                "args": ["build", "--bin=hello_rust"]
            },
            "args": [],
            "cwd": "\${workspaceFolder}"
        }
    ]
}`}</CodeBlock>

        <p>把 <code>"--bin=hello_rust"</code> 中的名字换成您自己项目的名字(即 <code>Cargo.toml</code> 里 <code>[package]</code> 的 <code>name</code>)。</p>

        <h3>实操 — 在调试器中运行代码</h3>

        <p>为了练习调试,写一段简单的代码。将下面的代码保存到 <code>src/main.rs</code>:</p>

        <CodeBlock>{`fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    let mut a = 0;
    let mut b = 1;
    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    b
}

fn main() {
    for i in 0..10 {
        let result = fibonacci(i);
        println!("fibonacci({}) = {}", i, result);
    }
}`}</CodeBlock>

        <h3>🔴 设置断点</h3>
        <p>
          在 <code>src/main.rs</code> 中,点击 <code>let result = fibonacci(i);</code>
          {" "}所在行左侧的行号空白处,会出现一个红点。这就是<strong>断点(Breakpoint)</strong>,
          程序运行到这一行时会停下。
        </p>

        <p>按 <code>F5</code> 启动调试器。程序在断点处停下后:</p>
        <ul>
          <li><strong>查看变量(Inspect)</strong>:左侧 "VARIABLES" 面板会显示 <code>i</code>、<code>result</code> 等变量的当前值。</li>
          <li><strong>调用栈(Stack Trace)</strong>:"CALL STACK" 面板显示当前的函数调用链。</li>
          <li><strong>Step Over(F10)</strong>:跳到下一行。</li>
          <li><strong>Step Into(F11)</strong>:进入函数内部。在 <code>fibonacci(i)</code> 上按此键会进入函数体。</li>
          <li><strong>Continue(F5)</strong>:继续运行到下一个断点。</li>
        </ul>

        <h3>🔍 条件断点与 Watch</h3>
        <p>
          在断点上点击右键选择 "Edit Breakpoint" 可以设置条件。
          例如输入 <code>i == 5</code>,就只会在 <code>i</code> 等于 5 时停下。
        </p>
        <p>
          在 "WATCH" 面板点击 <code>+</code> 按钮可以添加<strong>监视表达式</strong>,
          例如 <code>a + b</code>、<code>i * 2</code> 等,每次单步执行都会自动刷新取值。
        </p>

        <Checklist
          items={[
            <>程序在断点处停住,并且可以查看变量的值。</>,
            <>可以用 Step Over(F10)逐行执行。</>,
            <>可以用 Step Into(F11)进入函数内部。</>,
            <>可以设置条件断点。</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://github.com/vadimcn/codelldb", text: "CodeLLDB — VS Code 调试器扩展" },
            { href: "https://rust-analyzer.github.io/", text: "rust-analyzer 官方网站" },
          ]}
        />
      </Module>

      <Callout title="💡 进入下一步之前">
        请确认上面每个清单项都已完成。只要 <code>cargo run</code> 能打印 "Hello, world!",
        并且能用调试器逐行执行代码,就说明开发环境已经准备好了。
      </Callout>

      <PageNav prev={{ to: "/step/1" }} next={{ to: "/step/3" }} />
    </Layout>
  );
}
