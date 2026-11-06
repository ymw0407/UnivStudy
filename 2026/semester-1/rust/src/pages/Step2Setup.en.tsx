import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { OsTabs } from "../components/OsTabs";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step2SetupEn() {
  return (
    <Layout
      kicker="Step 2 · Apr 9"
      title="Setting up your environment — Cargo · Toolchain · Debugger"
      subtitle="From installing rustup to the VS Code debugger, with per-OS guides"
    >
      <Lede>
        By the end of this session you'll be able to write, compile, and step through
        Rust code line by line on your own machine. Follow the guide below and you'll
        get as far as printing "Hello, Rust!".
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="Installing rustup · cargo and running Hello World">
        <Lede>Install the Rust toolchain, create your first project, and run it.</Lede>

        <p>
          Rust is installed through an official installer called <strong>rustup</strong>.
          Installing rustup pulls in the compiler (<code>rustc</code>), the package
          manager (<code>cargo</code>), and the standard library all at once. Installation
          differs by operating system — pick your OS in the tabs below.
        </p>

        <h3>🔧 Install Rust</h3>

        <OsTabs
          tabs={[
            {
              id: "mac",
              label: "🍎 macOS",
              content: (
                <div>
                  <p>Open a terminal and run the command below. <code>curl</code> is a command-line tool for downloading data from a URL.</p>
                  <CodeBlock lang="bash">{`# Option 1: the official script (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Option 2: via Homebrew
brew install rustup-init
rustup-init -y`}</CodeBlock>
                  <p>After installation, open a fresh terminal window so the environment variables are picked up.</p>
                  <p>Verify the install with:</p>
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
                  <p>First install the build tools that the linker needs, then install rustup.</p>
                  <CodeBlock lang="bash">{`# Ubuntu / Debian
sudo apt update
sudo apt install -y build-essential curl

# Fedora
sudo dnf groupinstall "Development Tools"

# Arch
sudo pacman -S base-devel`}</CodeBlock>
                  <p><code>build-essential</code> provides the C linker (<code>cc</code>) that Rust needs when producing the final binary.</p>
                  <p>Now install rustup:</p>
                  <CodeBlock lang="bash">{`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"`}</CodeBlock>
                  <p>Verify:</p>
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
                  <p>Open PowerShell and run the command below. <code>winget</code> is the default Windows package manager.</p>
                  <CodeBlock lang="bash">{`# Option 1: winget (Windows 10+)
winget install Rustlang.Rustup

# Option 2: download the installer directly
# Grab rustup-init.exe from https://rustup.rs and run it.`}</CodeBlock>
                  <p>The installer will prompt you to also install the <strong>Visual Studio Build Tools (C++ build tools)</strong>. Do follow this step — without the build tools you'll get linker errors.</p>
                  <p>Once installation finishes, open a new PowerShell window and verify:</p>
                  <CodeBlock lang="bash">{`rustc --version
cargo --version`}</CodeBlock>
                </div>
              ),
            },
          ]}
        />

        <Callout title="⚠️ Windows: avoid non-ASCII username paths">
          If your Windows username contains non-ASCII characters (for example{" "}
          <code>C:\Users\홍길동\</code>), some crates may fail to build. Keep your
          projects somewhere like <code>C:\dev\</code>.
        </Callout>

        <Callout title="⚠️ Windows: MSVC build tools are required">
          Without the MSVC build tools (C++ Build Tools), you will get linker errors.
          Follow the steps in the rustup-init installer. In the Visual Studio Installer,
          choose the "Desktop development with C++" workload.
        </Callout>

        <Callout title="⚠️ If the install gets blocked on a campus network">
          Some campus networks block <code>sh.rustup.rs</code>. In that case download
          the installer directly from{" "}
          <a href="https://rustup.rs" target="_blank" rel="noreferrer">https://rustup.rs</a>.
        </Callout>

        <h3>🚀 Create your first project</h3>

        <p>Use <code>cargo new</code> to create a new project. <code>cargo</code> is Rust's build system and package manager.</p>

        <CodeBlock lang="bash">{`cargo new hello_rust
cd hello_rust`}</CodeBlock>

        <p><code>cd</code> changes the working directory. The command above moves you into the <code>hello_rust</code> folder.</p>

        <p>The generated <code>src/main.rs</code> already contains a Hello World. Run it:</p>

        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <p>If you see <code>Hello, world!</code> in the terminal, you're set.</p>

        <p>The most common cargo commands:</p>

        <table>
          <tbody>
            <tr><td><code>cargo new NAME</code></td><td>Create a new project</td></tr>
            <tr><td><code>cargo build</code></td><td>Compile (debug mode)</td></tr>
            <tr><td><code>cargo run</code></td><td>Compile and run</td></tr>
            <tr><td><code>cargo check</code></td><td>Type-check only (fast)</td></tr>
            <tr><td><code>cargo test</code></td><td>Run tests</td></tr>
          </tbody>
        </table>

        <h3>🧩 Install the VS Code extensions</h3>

        <p>Install the three extensions below in VS Code. Open the Extensions panel (<code>Ctrl+Shift+X</code>) and search by name.</p>

        <ol>
          <li><strong>rust-analyzer</strong> — autocompletion, inlay type hints, and live error reporting.</li>
          <li><strong>CodeLLDB</strong> — lets you step through Rust code in the debugger.</li>
          <li><strong>Even Better TOML</strong> — syntax highlighting and autocomplete for <code>Cargo.toml</code>.</li>
        </ol>

        <p>Those three are enough.</p>

        <Checklist
          items={[
            <><code>rustc --version</code> and <code>cargo --version</code> both print a version.</>,
            <><code>cargo run</code> prints "Hello, world!" in the terminal.</>,
            <>rust-analyzer, CodeLLDB, and Even Better TOML are installed in VS Code.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch01-01-installation.html", text: "The Rust Book — 1.1 Installation" },
            { href: "https://doc.rust-lang.org/book/ch01-02-hello-world.html", text: "The Rust Book — 1.2 Hello, World!" },
            { href: "https://doc.rust-lang.org/book/ch01-03-hello-cargo.html", text: "The Rust Book — 1.3 Hello, Cargo!" },
            { href: "https://rustup.rs/", text: "rustup official site" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="Hands-on with the CodeLLDB debugger">
        <Lede>Learn how to step through Rust code line by line in VS Code and inspect variable values.</Lede>

        <p>
          When a program isn't behaving the way you expect, dropping{" "}
          <code>println!</code> calls everywhere gets old fast. A <strong>debugger</strong>
          {" "}lets you stop the program at a line of your choice and look at the values
          of variables directly. The <strong>CodeLLDB</strong> extension you installed
          in M1 is what we'll use.
        </p>

        <h3>Hands-on — setting up launch.json</h3>

        <p>Open the project folder in VS Code, then create a debug configuration file.</p>

        <ol>
          <li>In the left sidebar, click the bug icon (Run and Debug).</li>
          <li>Click "create a launch.json file" and choose "LLDB".</li>
          <li>Edit the auto-generated <code>.vscode/launch.json</code> to match the snippet below.</li>
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

        <p>Replace <code>"--bin=hello_rust"</code> with your own project name (the <code>name</code> field under <code>[package]</code> in <code>Cargo.toml</code>).</p>

        <h3>Hands-on — running code under the debugger</h3>

        <p>Let's write a small program to debug. Save the following to <code>src/main.rs</code>:</p>

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

        <h3>🔴 Setting a breakpoint</h3>
        <p>
          In <code>src/main.rs</code>, click to the left of the line number on{" "}
          <code>let result = fibonacci(i);</code>. A red dot appears — that's a{" "}
          <strong>breakpoint</strong>. The program will stop on that line.
        </p>

        <p>Hit <code>F5</code> to start the debugger. When the program halts at the breakpoint:</p>
        <ul>
          <li><strong>Inspect variables</strong>: the left "VARIABLES" panel shows current values of <code>i</code>, <code>result</code>, and so on.</li>
          <li><strong>Call stack</strong>: the "CALL STACK" panel shows how you got here.</li>
          <li><strong>Step Over (F10)</strong>: move to the next line.</li>
          <li><strong>Step Into (F11)</strong>: step inside a function. Pressing this on <code>fibonacci(i)</code> takes you into the function body.</li>
          <li><strong>Continue (F5)</strong>: run to the next breakpoint.</li>
        </ul>

        <h3>🔍 Conditional breakpoints and Watch</h3>
        <p>
          Right-click a breakpoint and pick "Edit Breakpoint" to set a condition.
          For instance typing <code>i == 5</code> makes the breakpoint only fire when{" "}
          <code>i</code> is 5.
        </p>
        <p>
          In the "WATCH" panel, click the <code>+</code> button to add a{" "}
          <strong>watch expression</strong> — e.g. <code>a + b</code> or{" "}
          <code>i * 2</code>. The value updates automatically at every step.
        </p>

        <Checklist
          items={[
            <>The program stops at your breakpoint and you can inspect variable values.</>,
            <>Step Over (F10) moves you one line at a time.</>,
            <>Step Into (F11) enters a function body.</>,
            <>You can set a conditional breakpoint.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://github.com/vadimcn/codelldb", text: "CodeLLDB — VS Code debugger extension" },
            { href: "https://rust-analyzer.github.io/", text: "rust-analyzer official site" },
          ]}
        />
      </Module>

      <Callout title="💡 Before moving on">
        Make sure every item in the checklists above is done. If <code>cargo run</code>
        {" "}prints "Hello, world!" and you can step through code in the debugger, your
        environment is fully set up.
      </Callout>

      <PageNav prev={{ to: "/step/1" }} next={{ to: "/step/3" }} />
    </Layout>
  );
}
