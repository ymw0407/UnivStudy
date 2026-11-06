import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step1IntroKo() {
  return (
    <Layout
      kicker="Step 1 · 4월 7일"
      title="강의 개요 및 Rust를 배워야 하는 이유"
      subtitle="Rust의 탄생 배경, 다른 언어와의 비교, 그리고 10회차 학습 로드맵"
    >
      <Lede>
        첫 회차에서는 이 강의가 어떤 방식으로 진행되는지 안내하고,
        Rust가 왜 만들어졌는지, 다른 언어와 무엇이 다른지 살펴봅니다.
        10회차 전체 학습 로드맵도 함께 확인합니다.
      </Lede>

      {/* ===== 섹션 1: 강의 안내 ===== */}
      <Module title="📋 강의 안내">
        <h3>진행 방식</h3>
        <p>
          이 강의는 총 10회차로 구성되어 있습니다.
          매 회차는 이론 설명과 실습(따라하기)을 번갈아 진행하며,
          모든 코드 예제는 직접 입력하고 실행해 보는 것을 원칙으로 합니다.
        </p>
        <ul>
          <li><strong>이론</strong> — 개념을 먼저 짧게 설명합니다.</li>
          <li><strong>따라하기</strong> — 설명 직후 코드를 직접 작성하고 실행합니다.</li>
          <li><strong>체크리스트</strong> — 각 모듈 끝에서 스스로 점검합니다.</li>
        </ul>

        <h3>평가 안내</h3>
        <ul>
          <li>중간 과제: 개인 코딩 과제 (Step 5 이후 제출)</li>
          <li>출석 및 참여도</li>
        </ul>

        <h3>🌐 이 위키 사용법</h3>
        <p>
          지금 보고 있는 이 사이트가 강의 위키입니다.
          왼쪽 상단의 "← 목차로 돌아가기"를 누르면 전체 회차 목록으로 돌아갑니다.
          각 회차 페이지는 모듈(M1, M2, ...)로 나뉘어 있고,
          모듈마다 한 줄 요약, 설명, 따라하기 코드, 체크리스트, 공식 문서 링크가 제공됩니다.
        </p>
      </Module>

      {/* ===== 섹션 2: Rust는 왜 만들어졌나 ===== */}
      <Module title="🔧 Rust는 왜 만들어졌나">
        <h3>시스템 프로그래밍의 한계</h3>
        <p>
          C와 C++는 운영체제, 브라우저 엔진, 게임 엔진 등 성능이 중요한 소프트웨어에 수십 년간 사용되어 왔습니다.
          그러나 이 언어들은 메모리를 프로그래머가 직접 관리해야 합니다.
          그 결과 다음과 같은 문제가 반복적으로 발생합니다.
        </p>
        <ul>
          <li><strong>해제 후 사용(use-after-free)</strong> — 이미 해제한 메모리를 다시 읽거나 쓰는 버그</li>
          <li><strong>이중 해제(double free)</strong> — 같은 메모리를 두 번 해제하여 프로그램이 비정상 종료</li>
          <li><strong>버퍼 오버플로(buffer overflow)</strong> — 배열 범위를 넘어서 데이터를 읽거나 쓰는 보안 취약점</li>
          <li><strong>데이터 레이스(data race)</strong> — 여러 스레드가 동시에 같은 데이터를 수정하여 결과가 예측 불가능해지는 현상</li>
        </ul>
        <p>
          Microsoft는 자사 제품의 보안 취약점 중 약 70%가 메모리 안전성 문제에서 비롯된다고 발표한 바 있습니다.
          Google Chrome 팀도 비슷한 수치를 보고했습니다.
        </p>

        <h3>Mozilla와 Rust의 탄생</h3>
        <p>
          <strong>Rust</strong>는 Mozilla 재단의 개발자 Graydon Hoare가 2006년 개인 프로젝트로 시작했고,
          2009년부터 Mozilla가 공식 후원하면서 본격적으로 발전했습니다.
          목표는 명확했습니다. <em>C/C++ 수준의 성능을 유지하면서, 컴파일 시점에 메모리 안전성을 보장하는 언어를 만들자.</em>
        </p>
        <p>
          Rust는 이 목표를 달성하기 위해 <strong>소유권(Ownership)</strong> 시스템이라는 독자적인 메모리 관리 모델을 도입했습니다.
          가비지 컬렉터(GC) 없이, 컴파일러가 코드를 분석하여 메모리가 안전하게 사용되는지 검사합니다.
          규칙에 어긋나는 코드는 컴파일 자체가 되지 않으므로, 위에서 언급한 버그들이 실행 전에 차단됩니다.
        </p>
        <p>
          2015년에 Rust 1.0이 정식 출시되었고, 이후 6주 단위로 안정적인 업데이트가 이어지고 있습니다.
          현재 Rust는 Mozilla를 넘어 Rust Foundation이 독립적으로 관리하며,
          Amazon(AWS), Google, Microsoft, Meta, Huawei 등이 재단 회원으로 참여하고 있습니다.
        </p>
      </Module>

      {/* ===== 섹션 3: 성능·안전성·생산성 ===== */}
      <Module title="⚡ 성능 · 안전성 · 생산성">
        <p>
          Rust가 주목받는 세 가지 핵심 가치를 하나씩 살펴봅니다.
        </p>

        <h3>1. 성능 — Zero-Cost Abstractions</h3>
        <p>
          Rust의 추상화는 런타임 비용이 없습니다.
          <strong>Zero-Cost Abstractions</strong>(제로 비용 추상화)란
          "고수준 코드를 작성해도 직접 저수준 코드를 짠 것과 동일한 성능이 나온다"는 원칙입니다.
          예를 들어, <strong>반복자(Iterator)</strong> 체인을 사용해도
          컴파일러가 이를 최적화하여 수동 루프와 같은 기계어를 생성합니다.
        </p>
        <p>
          가비지 컬렉터가 없으므로 GC 일시 정지(pause)도 없습니다.
          이 덕분에 실시간 시스템, 임베디드, 게임 엔진 등 지연 시간에 민감한 분야에서 Rust가 선택됩니다.
        </p>

        <h3>2. 안전성 — Borrow Checker</h3>
        <p>
          Rust 컴파일러에는 <strong>Borrow Checker</strong>(빌림 검사기)가 내장되어 있습니다.
          이 검사기는 <strong>소유권(Ownership)</strong>, <strong>빌림(Borrowing)</strong>,
          <strong>라이프타임(Lifetime)</strong> 규칙을 컴파일 시점에 검증합니다.
          규칙을 위반하면 프로그램이 컴파일되지 않으므로,
          메모리 관련 버그가 실행 단계까지 넘어가지 않습니다.
        </p>
        <p>
          처음에는 컴파일러가 거부하는 코드가 많아 답답할 수 있지만,
          이는 "런타임에 터질 뻔한 버그를 미리 잡아준 것"입니다.
          Rust 컴파일러의 에러 메시지는 매우 친절하며, 대부분 해결 방법까지 제안합니다.
        </p>

        <h3>3. 생산성 — Cargo와 생태계</h3>
        <p>
          <strong>Cargo</strong>는 Rust의 공식 빌드 시스템이자 패키지 매니저입니다.
          프로젝트 생성, 의존성 관리, 빌드, 테스트, 문서 생성을 하나의 도구로 처리합니다.
        </p>
        <CodeBlock lang="bash">{`# 새 프로젝트 생성
cargo new my_project

# 빌드
cargo build

# 실행
cargo run

# 테스트
cargo test

# 문서 생성
cargo doc --open`}</CodeBlock>
        <p>
          <strong>크레이트(Crate)</strong>는 Rust의 패키지 단위입니다.
          <a href="https://crates.io" target="_blank" rel="noreferrer">crates.io</a>에는 15만 개 이상의 크레이트가 등록되어 있으며,
          <code>Cargo.toml</code> 파일에 한 줄만 추가하면 바로 사용할 수 있습니다.
        </p>
      </Module>

      {/* ===== 섹션 4: 다른 언어와의 비교 ===== */}
      <Module title="🔄 다른 언어와의 비교">
        <p>
          Rust를 C/C++, Go, Python과 비교하면 각 언어의 설계 철학 차이를 알 수 있습니다.
          아래 표는 주요 특성을 정리한 것입니다.
        </p>

        <table>
          <thead>
            <tr>
              <th>특성</th>
              <th>C/C++</th>
              <th>Go</th>
              <th>Python</th>
              <th>Rust</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>메모리 관리</td>
              <td>수동 (malloc/free)</td>
              <td>GC (가비지 컬렉터)</td>
              <td>GC (참조 카운팅)</td>
              <td>소유권 시스템 (컴파일 타임)</td>
            </tr>
            <tr>
              <td>메모리 안전성</td>
              <td>보장 안 됨</td>
              <td>보장됨 (GC)</td>
              <td>보장됨 (GC)</td>
              <td>보장됨 (borrow checker)</td>
            </tr>
            <tr>
              <td>실행 성능</td>
              <td>매우 빠름</td>
              <td>빠름</td>
              <td>느림</td>
              <td>매우 빠름</td>
            </tr>
            <tr>
              <td>GC 일시 정지</td>
              <td>없음</td>
              <td>있음</td>
              <td>있음</td>
              <td>없음</td>
            </tr>
            <tr>
              <td>동시성 안전</td>
              <td>프로그래머 책임</td>
              <td>고루틴 + 채널</td>
              <td>GIL 제약</td>
              <td>컴파일 타임 보장</td>
            </tr>
            <tr>
              <td>컴파일 속도</td>
              <td>보통</td>
              <td>매우 빠름</td>
              <td>인터프리터 (해당 없음)</td>
              <td>느린 편</td>
            </tr>
            <tr>
              <td>학습 난이도</td>
              <td>높음</td>
              <td>낮음</td>
              <td>매우 낮음</td>
              <td>높음 (소유권 개념)</td>
            </tr>
            <tr>
              <td>패키지 매니저</td>
              <td>없음 (vcpkg, conan 등 비공식)</td>
              <td>go mod</td>
              <td>pip</td>
              <td>Cargo (공식, 통합)</td>
            </tr>
            <tr>
              <td>주요 활용 분야</td>
              <td>OS, 임베디드, 게임</td>
              <td>웹 서버, 클라우드 인프라</td>
              <td>데이터 과학, 스크립트</td>
              <td>시스템, WebAssembly, CLI, 서버</td>
            </tr>
          </tbody>
        </table>

        <h3>Rust의 포지셔닝</h3>
        <p>
          Rust는 "C/C++의 성능"과 "고수준 언어의 안전성·편의성"을 동시에 추구합니다.
        </p>
        <ul>
          <li><strong>C/C++를 대체할 수 있나요?</strong> — 성능이 동등하면서 메모리 안전성이 보장되므로, 새 프로젝트에서는 충분히 대안이 됩니다. Linux 커널에도 Rust 코드가 포함되기 시작했습니다.</li>
          <li><strong>Go와 비교하면?</strong> — Go는 간결함과 빠른 컴파일을 우선시합니다. Rust는 더 세밀한 제어와 더 높은 성능을 제공하지만 학습 곡선이 가파릅니다.</li>
          <li><strong>Python과 비교하면?</strong> — Python은 빠른 프로토타이핑에 적합합니다. 성능이 필요한 부분만 Rust로 작성하고 Python에서 호출하는 방식(PyO3)도 널리 사용됩니다.</li>
        </ul>

        <h3>🧭 이 강의를 관통하는 비교 관점</h3>
        <p>
          앞으로 매 회차에서 "<strong>Java/C++에서는 이렇게 해왔다. Rust는 왜 이것을 다르게 혹은 금지하는가?</strong>"라는
          비교 관점을 자주 사용할 것입니다. Rust의 낯선 문법과 제약들은 대부분
          "다른 언어가 겪어온 구체적인 버그를 방지하려는 설계 결정"이기 때문입니다. 미리 몇 가지만 맛보면:
        </p>
        <ul>
          <li>
            <strong>변수는 기본 불변</strong> — Java/C++처럼 "기본 가변 + 필요할 때 final/const" 순서가 아니라, "기본 불변 + 필요할 때 <code>mut</code>".
            기본값을 뒤집어서 "이 변수는 어디서 바뀌는가?"라는 질문의 수를 줄였습니다.
          </li>
          <li>
            <strong>상속이 없다</strong> — Java/C++의 20년 상속 경험에서 "fragile base class", "다이아몬드 문제"의 대가를 배운 끝에,
            Rust는 "데이터는 컴포지션, 행동은 트레이트"로 갈음합니다.
          </li>
          <li>
            <strong>null이 없다</strong> — Tony Hoare의 "10억 달러짜리 실수"를 답습하지 않기 위해, <code>Option&lt;T&gt;</code>로 "없을 수도 있음"을 타입에 새깁니다.
          </li>
          <li>
            <strong>예외가 없다</strong> — Java의 checked exception 지옥, C++의 예외 안전성 문제를 피하기 위해 "에러는 값(<code>Result&lt;T, E&gt;</code>)"이라는 모델을 택합니다.
          </li>
          <li>
            <strong>가변 참조는 한 번에 하나</strong> — C++의 반복자 무효화, Java의 <code>ConcurrentModificationException</code>, 멀티스레드 데이터 레이스가 전부 이 규칙 하나로 사라집니다.
          </li>
        </ul>
        <p>
          이 관점을 계속 가져가면 "왜 이래야 하지?"라는 질문이 거의 모든 경우에 답을 얻게 됩니다.
          Rust의 제약 대부분은 <em>언어가 답하지 않으려고 했던 질문을 고객(개발자)에게 떠넘기지 않기 위한 선택</em>입니다.
        </p>
      </Module>

      {/* ===== 섹션 5: WebAssembly와 Rust ===== */}
      <Module title="🌐 WebAssembly와 Rust">
        <p>
          <strong>WebAssembly(Wasm)</strong>는 웹 브라우저에서 네이티브에 가까운 속도로 코드를 실행하는 바이너리 포맷입니다.
          C, C++, Rust 등 여러 언어로 WebAssembly 모듈을 만들 수 있지만,
          Rust는 WebAssembly 생태계에서 가장 활발하게 사용되는 언어 중 하나입니다.
        </p>

        <h3>왜 Rust + WebAssembly인가</h3>
        <ul>
          <li><strong>작은 바이너리</strong> — Rust에는 런타임이나 GC가 없으므로 생성되는 Wasm 파일이 작습니다.</li>
          <li><strong>예측 가능한 성능</strong> — GC 일시 정지가 없어 프레임 단위로 일정한 성능이 필요한 게임이나 그래픽 애플리케이션에 적합합니다.</li>
          <li><strong>wasm-pack</strong> — Rust 코드를 WebAssembly로 빌드하고 npm 패키지로 배포하는 공식 도구입니다.</li>
        </ul>

        <h3>간단한 흐름</h3>
        <CodeBlock lang="bash">{`# wasm-pack 설치
cargo install wasm-pack

# Rust 라이브러리를 Wasm으로 빌드
wasm-pack build --target web`}</CodeBlock>
        <p>
          빌드 결과물인 <code>.wasm</code> 파일과 JavaScript 바인딩을 웹 프로젝트에 포함하면,
          브라우저에서 Rust 로직을 직접 실행할 수 있습니다.
          이 강의에서는 WebAssembly를 깊이 다루지는 않지만,
          Rust의 활용 범위가 시스템 프로그래밍을 넘어 웹까지 확장된다는 점을 기억해 두세요.
        </p>
      </Module>

      {/* ===== 섹션 6: 학습 로드맵 ===== */}
      <Module title="🗺️ 학습 로드맵">
        <p>
          이 위키는 강의의 이론·실습 회차(Step 1~5, 7~8)를 다룹니다.
          아래는 학습 흐름입니다.
        </p>

        <table>
          <thead>
            <tr>
              <th>회차</th>
              <th>주제</th>
              <th>핵심 키워드</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Step 1</td>
              <td>강의 개요 및 Rust를 배워야 하는 이유</td>
              <td>탄생 배경, 비교, 로드맵</td>
            </tr>
            <tr>
              <td>Step 2</td>
              <td>개발환경 구축</td>
              <td>rustup, Cargo, VS Code, 디버거</td>
            </tr>
            <tr>
              <td>Step 3</td>
              <td>변수 · 타입 · 제어흐름 · 함수</td>
              <td>불변성, 섀도잉, 표현식, cargo test</td>
            </tr>
            <tr>
              <td>Step 4</td>
              <td>Ownership · Borrowing · Lifetime</td>
              <td>소유권, 빌림, 라이프타임, move</td>
            </tr>
            <tr>
              <td>Step 5</td>
              <td>Structs · Enums · Pattern Matching · Traits</td>
              <td>구조체, 열거형, match, 트레이트</td>
            </tr>
            <tr>
              <td>Step 7</td>
              <td>Generics · Error Handling · Closures · Iterators</td>
              <td>제네릭, Result, 클로저, 반복자</td>
            </tr>
            <tr>
              <td>Step 8</td>
              <td>Modules · Smart Pointers · Concurrency · Async</td>
              <td>크레이트, Box/Rc, 스레드, tokio</td>
            </tr>
          </tbody>
        </table>

        <h3>이 위키의 구조</h3>
        <p>
          위키의 각 Step 페이지는 강의 계획서의 모듈(M1~M4)에 대응합니다.
          모듈마다 다음 5가지 요소로 구성됩니다.
        </p>
        <ol>
          <li><strong>한 줄 요약</strong> — 이 모듈에서 무엇을 배우는지 한 문장으로 정리합니다.</li>
          <li><strong>왜 필요한가</strong> — 이 개념이 왜 중요한지 배경을 설명합니다.</li>
          <li><strong>따라하기</strong> — 코드나 명령어를 직접 실행해 봅니다.</li>
          <li><strong>체크리스트</strong> — 학습 완료 여부를 스스로 점검합니다.</li>
          <li><strong>공식 문서 링크</strong> — 더 깊이 공부하고 싶을 때 참고할 자료입니다.</li>
        </ol>
        <p>
          Step 1(이 페이지)은 개요이므로 M1~M4 모듈 구분 없이 주제별로 정리했습니다.
          Step 2부터는 모듈 단위로 진행됩니다.
        </p>
      </Module>

      {/* ===== 공식 문서 ===== */}
      <DocsRef
        links={[
          { href: "https://doc.rust-kr.org/foreword.html", text: "The Rust Programming Language 한국어판 — 들어가기에 앞서" },
          { href: "https://doc.rust-kr.org/ch00-00-introduction.html", text: "The Rust Programming Language 한국어판 — 소개" },
        ]}
      />

      <Callout title="💡 다음 단계로 가기 전에">
        이 페이지를 읽고 Rust가 왜 주목받는 언어인지 감을 잡으셨다면 충분합니다.
        다음 Step 2에서는 실제로 Rust를 설치하고 첫 프로그램을 실행합니다.
      </Callout>

      <PageNav next={{ to: "/step/2" }} />
    </Layout>
  );
}
