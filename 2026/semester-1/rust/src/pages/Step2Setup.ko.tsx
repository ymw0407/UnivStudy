import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { OsTabs } from "../components/OsTabs";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step2SetupKo() {
  return (
    <Layout
      kicker="Step 2 · 4월 9일"
      title="개발환경 구축 — Cargo · Toolchain · Debugger"
      subtitle="rustup 설치부터 VS Code 디버거까지, 호스트 OS별 가이드"
    >
      <Lede>
        이 회차를 마치면 본인의 운영체제에서 Rust 코드를 작성하고, 컴파일하고, 디버거로 한 줄씩 실행할 수 있게 됩니다.
        아래 가이드를 따라하면 "Hello, Rust!"를 출력하는 것까지 도달합니다.
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="rustup · cargo 설치 및 Hello World">
        <Lede>Rust 툴체인을 설치하고, 첫 프로젝트를 만들어 실행합니다.</Lede>

        <p>
          Rust는 <strong>rustup</strong>이라는 공식 설치 도구를 사용합니다.
          rustup을 설치하면 컴파일러(<code>rustc</code>), 패키지 매니저(<code>cargo</code>),
          표준 라이브러리가 함께 설치됩니다.
          운영체제에 따라 설치 방법이 다르므로 아래 탭에서 본인의 OS를 선택하세요.
        </p>

        <h3>🔧 Rust 설치</h3>

        <OsTabs
          tabs={[
            {
              id: "mac",
              label: "🍎 macOS",
              content: (
                <div>
                  <p>터미널을 열고 아래 명령을 실행합니다. <code>curl</code>은 URL에서 데이터를 내려받는 명령어입니다.</p>
                  <CodeBlock lang="bash">{`# 방법 1: 공식 스크립트 (권장)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 방법 2: Homebrew가 설치되어 있다면
brew install rustup-init
rustup-init -y`}</CodeBlock>
                  <p>설치가 끝나면 새 터미널 창을 열어야 환경 변수가 반영됩니다.</p>
                  <p>다음 명령으로 설치를 확인합니다.</p>
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
                  <p>먼저 링커에 필요한 빌드 도구를 설치한 뒤, rustup을 설치합니다.</p>
                  <CodeBlock lang="bash">{`# Ubuntu / Debian
sudo apt update
sudo apt install -y build-essential curl

# Fedora
sudo dnf groupinstall "Development Tools"

# Arch
sudo pacman -S base-devel`}</CodeBlock>
                  <p><code>build-essential</code>은 C 링커(<code>cc</code>)를 제공합니다. Rust가 최종 바이너리를 만들 때 필요합니다.</p>
                  <p>이제 rustup을 설치합니다.</p>
                  <CodeBlock lang="bash">{`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"`}</CodeBlock>
                  <p>설치 확인:</p>
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
                  <p>PowerShell을 열고 다음 명령을 실행합니다. <code>winget</code>은 Windows 기본 패키지 관리자입니다.</p>
                  <CodeBlock lang="bash">{`# 방법 1: winget (Windows 10 이상)
winget install Rustlang.Rustup

# 방법 2: 공식 사이트에서 직접 다운로드
# https://rustup.rs 에서 rustup-init.exe를 받아 실행하세요.`}</CodeBlock>
                  <p>설치 마법사가 <strong>Visual Studio Build Tools(C++ 빌드 도구)</strong>를 함께 설치하도록 안내합니다. 반드시 이 단계를 따르세요. 빌드 도구가 없으면 링커 에러가 발생합니다.</p>
                  <p>설치가 끝나면 새 PowerShell 창을 열고 확인합니다.</p>
                  <CodeBlock lang="bash">{`rustc --version
cargo --version`}</CodeBlock>
                </div>
              ),
            },
          ]}
        />

        <Callout title="⚠️ Windows: 한글 사용자명 경로 주의">
          Windows 사용자명에 한글이 포함된 경우(예: <code>C:\Users\홍길동\</code>) 일부 크레이트 빌드가 실패할 수 있습니다.
          프로젝트는 <code>C:\dev\</code> 같은 영문 경로에서 작업하세요.
        </Callout>

        <Callout title="⚠️ Windows: MSVC 빌드 도구 필수">
          MSVC 빌드 도구(C++ Build Tools)가 없으면 링커 에러가 납니다.
          rustup-init 설치 마법사가 안내하는 순서를 따르세요. Visual Studio Installer에서 "C++를 사용한 데스크톱 개발" 워크로드를 선택하면 됩니다.
        </Callout>

        <Callout title="⚠️ 학교 네트워크에서 설치가 안 될 때">
          학교 망에서 <code>sh.rustup.rs</code>가 차단되는 경우가 있습니다.
          <a href="https://rustup.rs" target="_blank" rel="noreferrer">https://rustup.rs</a> 에서 설치 파일을 직접 다운로드하세요.
        </Callout>

        <h3>🚀 첫 프로젝트 만들기</h3>

        <p><code>cargo new</code> 명령으로 새 프로젝트를 생성합니다. <code>cargo</code>는 Rust의 빌드 시스템이자 패키지 매니저입니다.</p>

        <CodeBlock lang="bash">{`cargo new hello_rust
cd hello_rust`}</CodeBlock>

        <p><code>cd</code>는 디렉터리를 이동하는 명령입니다. 위 명령을 실행하면 <code>hello_rust</code> 폴더 안으로 들어갑니다.</p>

        <p>생성된 <code>src/main.rs</code> 파일에 이미 Hello World 코드가 들어 있습니다. 실행해 봅니다.</p>

        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <p>터미널에 <code>Hello, world!</code>가 출력되면 성공입니다.</p>

        <p>주요 cargo 명령어를 정리합니다.</p>

        <table>
          <tbody>
            <tr><td><code>cargo new 이름</code></td><td>새 프로젝트 생성</td></tr>
            <tr><td><code>cargo build</code></td><td>컴파일 (디버그 모드)</td></tr>
            <tr><td><code>cargo run</code></td><td>컴파일 + 실행</td></tr>
            <tr><td><code>cargo check</code></td><td>컴파일 검사만 (빠름)</td></tr>
            <tr><td><code>cargo test</code></td><td>테스트 실행</td></tr>
          </tbody>
        </table>

        <h3>🧩 VS Code 확장 설치</h3>

        <p>VS Code에서 아래 확장 3개를 설치합니다. 확장 탭(<code>Ctrl+Shift+X</code>)에서 이름을 검색하면 됩니다.</p>

        <ol>
          <li><strong>rust-analyzer</strong> — 코드 자동완성, 타입 힌트, 에러 표시를 실시간으로 제공합니다.</li>
          <li><strong>CodeLLDB</strong> — Rust 코드를 한 줄씩 디버깅할 수 있게 해줍니다.</li>
          <li><strong>Even Better TOML</strong> — <code>Cargo.toml</code> 파일의 문법 강조와 자동완성을 제공합니다.</li>
        </ol>

        <p>세 개만 설치하면 충분합니다.</p>

        <Checklist
          items={[
            <><code>rustc --version</code>과 <code>cargo --version</code>이 정상 출력됩니다.</>,
            <><code>cargo run</code>으로 "Hello, world!"가 터미널에 출력됩니다.</>,
            <>VS Code에 rust-analyzer, CodeLLDB, Even Better TOML이 설치되어 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch01-01-installation.html", text: "Rust Book 한국어판 — 1.1 설치" },
            { href: "https://doc.rust-kr.org/ch01-02-hello-world.html", text: "Rust Book 한국어판 — 1.2 Hello, World!" },
            { href: "https://doc.rust-kr.org/ch01-03-hello-cargo.html", text: "Rust Book 한국어판 — 1.3 Hello, Cargo!" },
            { href: "https://rustup.rs/", text: "rustup 공식 사이트" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="CodeLLDB 디버거 실습">
        <Lede>VS Code에서 Rust 코드를 한 줄씩 실행하며 변수 값을 확인하는 방법을 배웁니다.</Lede>

        <p>
          프로그램이 예상대로 동작하지 않을 때, <code>println!</code>을 여기저기 넣는 대신 <strong>디버거(Debugger)</strong>를 사용하면
          코드를 한 줄씩 멈추고 변수 값을 직접 확인할 수 있습니다.
          M1에서 설치한 <strong>CodeLLDB</strong> 확장이 이 역할을 합니다.
        </p>

        <h3>따라하기 — launch.json 설정</h3>

        <p>VS Code에서 프로젝트 폴더를 연 뒤, 디버그 설정 파일을 만듭니다.</p>

        <ol>
          <li>왼쪽 사이드바에서 벌레 아이콘(Run and Debug)을 클릭합니다.</li>
          <li>"create a launch.json file"을 클릭하고 "LLDB"를 선택합니다.</li>
          <li>자동 생성된 <code>.vscode/launch.json</code>을 아래처럼 수정합니다.</li>
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

        <p><code>"--bin=hello_rust"</code> 부분은 여러분의 프로젝트 이름(<code>Cargo.toml</code>의 <code>[package] name</code>)으로 바꾸세요.</p>

        <h3>따라하기 — 디버거로 코드 실행</h3>

        <p>디버거 연습을 위해 간단한 코드를 작성합니다. 다음 코드를 <code>src/main.rs</code>에 저장하세요.</p>

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

        <h3>🔴 Breakpoint 설정</h3>
        <p>
          <code>src/main.rs</code>에서 <code>let result = fibonacci(i);</code> 줄의 왼쪽 여백(줄 번호 왼쪽)을 클릭하면 빨간 점이 나타납니다.
          이것이 <strong>브레이크포인트(Breakpoint)</strong>입니다. 프로그램이 이 줄에서 멈춥니다.
        </p>

        <p><code>F5</code>를 눌러 디버거를 시작합니다. 프로그램이 브레이크포인트에서 멈추면:</p>
        <ul>
          <li><strong>변수 검사(Inspect)</strong>: 왼쪽 "VARIABLES" 패널에서 <code>i</code>, <code>result</code> 등의 현재 값을 확인합니다.</li>
          <li><strong>스택 트레이스(Stack Trace)</strong>: "CALL STACK" 패널에서 현재 함수 호출 경로를 볼 수 있습니다.</li>
          <li><strong>Step Over (F10)</strong>: 다음 줄로 이동합니다.</li>
          <li><strong>Step Into (F11)</strong>: 함수 안으로 들어갑니다. <code>fibonacci(i)</code>에서 누르면 함수 내부로 이동합니다.</li>
          <li><strong>Continue (F5)</strong>: 다음 브레이크포인트까지 계속 실행합니다.</li>
        </ul>

        <h3>🔍 조건부 Breakpoint와 Watch</h3>
        <p>
          브레이크포인트를 마우스 오른쪽 버튼으로 클릭하면 "Edit Breakpoint"에서 조건을 설정할 수 있습니다.
          예를 들어 <code>i == 5</code>라고 입력하면 <code>i</code>가 5일 때만 멈춥니다.
        </p>
        <p>
          "WATCH" 패널에서 <code>+</code> 버튼을 눌러 <strong>Watch 표현식</strong>을 추가할 수 있습니다.
          예: <code>a + b</code>, <code>i * 2</code> 등. 매 스텝마다 값이 자동으로 갱신됩니다.
        </p>

        <Checklist
          items={[
            <>브레이크포인트에서 프로그램이 멈추고 변수 값을 확인할 수 있습니다.</>,
            <>Step Over(F10)로 한 줄씩 이동할 수 있습니다.</>,
            <>Step Into(F11)로 함수 내부에 진입할 수 있습니다.</>,
            <>조건부 브레이크포인트를 설정할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://github.com/vadimcn/codelldb", text: "CodeLLDB — VS Code 디버거 확장" },
            { href: "https://rust-analyzer.github.io/", text: "rust-analyzer 공식 사이트" },
          ]}
        />
      </Module>

      <Callout title="💡 다음 단계로 가기 전에">
        위 체크리스트가 모두 완료인지 확인하세요. <code>cargo run</code>으로 "Hello, world!"가 출력되고,
        디버거로 코드를 한 줄씩 실행할 수 있다면 개발환경 구축이 완료된 것입니다.
      </Callout>

      <PageNav prev={{ to: "/step/1" }} next={{ to: "/step/3" }} />
    </Layout>
  );
}
