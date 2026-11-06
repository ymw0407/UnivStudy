import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";
import { CodeTabs } from "../components/CodeTabs";
import { TranslationPendingBanner } from "../components/TranslationPendingBanner";

export function Step8Advanced() {
  return (
    <Layout
      kicker="Step 8 · 4월 30일"
      title="Modules · Smart Pointers · Concurrency · Async"
      subtitle="모듈 시스템부터 비동기 프로그래밍까지, Rust의 고급 기능을 학습합니다"
    >
      <TranslationPendingBanner />
      <Lede>
        이 회차를 마치면 코드를 모듈로 조직하고, 스마트 포인터를 활용하고,
        스레드와 async/await로 동시성 프로그램을 작성할 수 있게 됩니다.
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="모듈(Module) 시스템과 Cargo">
        <Lede>코드를 논리적 단위로 나누고, 외부 크레이트를 가져다 쓰는 방법입니다.</Lede>

        <p>
          프로젝트가 커지면 모든 코드를 <code>main.rs</code> 하나에 넣을 수 없습니다.
          Rust의 <strong>모듈(Module)</strong> 시스템은 코드를 논리적으로 분리하고,
          <code>pub</code> 키워드로 어떤 것을 외부에 공개할지 결정합니다.
          <strong>크레이트(Crate)</strong>는 Rust의 컴파일 단위이자 패키지입니다.
        </p>

        <h3>따라하기 — 모듈 분리</h3>
        <p>아래와 같은 구조로 코드를 분리할 수 있습니다.</p>

        <CodeBlock lang="bash">{`src/
├── main.rs
└── math.rs`}</CodeBlock>

        <p><code>src/math.rs</code> 파일을 만들고 다음 내용을 저장합니다.</p>

        <CodeBlock>{`// src/math.rs
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn multiply(a: i32, b: i32) -> i32 {
    a * b
}`}</CodeBlock>

        <p><code>src/main.rs</code>에서 이 모듈을 사용합니다.</p>

        <CodeBlock>{`// src/main.rs
mod math;

fn main() {
    let sum = math::add(3, 5);
    let product = math::multiply(4, 6);
    println!("합: {}, 곱: {}", sum, product);
}`}</CodeBlock>

        <h3>외부 크레이트 사용</h3>
        <p><code>Cargo.toml</code>의 <code>[dependencies]</code>에 크레이트를 추가하면 됩니다.</p>

        <CodeBlock lang="toml">{`[dependencies]
rand = "0.8"`}</CodeBlock>

        <p>
          <code>cargo build</code>를 실행하면{" "}
          <a href="https://crates.io/" target="_blank" rel="noreferrer">crates.io</a>에서
          자동으로 다운로드합니다.
        </p>

        <CodeBlock>{`use rand::Rng;

fn main() {
    let mut rng = rand::thread_rng();
    let n: u32 = rng.gen_range(1..=100);
    println!("랜덤 숫자: {}", n);
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>mod</code>, <code>pub</code>, <code>use</code> 키워드를 사용해 모듈을 분리할 수 있습니다.</>,
            <><code>Cargo.toml</code>에 외부 크레이트를 추가하고 사용할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html",
              text: "Rust Book 한국어판 — 7장 패키지, 크레이트, 모듈",
            },
            {
              href: "https://doc.rust-lang.org/cargo/guide/dependencies.html",
              text: "Cargo Book — 의존성 관리",
            },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="스마트 포인터(Smart Pointers)">
        <Lede>힙 할당, 참조 카운팅, interior mutability — 소유권만으로 부족할 때 쓰는 도구들입니다.</Lede>

        <p>
          일반적인 참조(<code>&amp;T</code>)는 데이터를 빌리기만 합니다.
          <strong>스마트 포인터(Smart Pointer)</strong>는 데이터를 소유하면서 추가 기능(참조 카운팅, interior mutability 등)을 제공합니다.
        </p>

        <h3>🆚 왜 Java에는 '스마트 포인터'가 없을까?</h3>
        <p>
          "Java에서는 그냥 <code>new</code>하면 되는데 Rust는 왜 이렇게 복잡하지?"라는 의문이 자연스럽게 듭니다.
          답은 단순합니다 — <strong>Java는 모든 객체가 이미 힙에 있고, GC가 모든 수명을 관리하기 때문</strong>입니다.
          Java의 <code>Object</code> 참조는 사실상 "GC 관리 스마트 포인터"와 같습니다.
          Rust는 GC가 없으므로 여러 소유 패턴을 <em>타입</em>으로 구분합니다.
        </p>
        <ul>
          <li><strong>C++의 <code>std::unique_ptr&lt;T&gt;</code></strong> ↔ Rust의 <strong><code>Box&lt;T&gt;</code></strong> — 단일 소유권, 힙 할당.</li>
          <li><strong>C++의 <code>std::shared_ptr&lt;T&gt;</code></strong> ↔ Rust의 <strong><code>Rc&lt;T&gt;</code></strong>(단일 스레드) / <strong><code>Arc&lt;T&gt;</code></strong>(멀티 스레드) — 참조 카운팅.</li>
          <li><strong>C++에는 대응물이 없는 것</strong> ↔ Rust의 <strong><code>RefCell&lt;T&gt;</code></strong> / <strong><code>Mutex&lt;T&gt;</code></strong> — 불변 참조 안에서 값을 수정할 수 있게 하는 interior mutability.</li>
        </ul>
        <p>
          C++과의 결정적 차이는 "컴파일러가 어느 포인터가 어떤 역할인지 <em>검증</em>한다"는 점입니다.
          C++에서는 <code>shared_ptr</code>와 <code>unique_ptr</code>를 섞어 써서 순환 참조나 이중 해제를 만들 수 있지만,
          Rust는 타입 시스템이 이런 혼용을 컴파일 타임에 차단합니다.
        </p>

        <h3>Box&lt;T&gt; — 힙 할당</h3>
        <p>
          <code>Box&lt;T&gt;</code>는 값을 힙에 할당합니다.
          크기를 컴파일 타임에 알 수 없는 재귀 타입이나, 큰 데이터를 스택에 복사하지 않고 이동할 때 유용합니다.
        </p>

        <CodeBlock>{`// 재귀 타입 — Box 없이는 크기를 알 수 없습니다
enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn main() {
    let list = List::Cons(1,
        Box::new(List::Cons(2,
            Box::new(List::Cons(3,
                Box::new(List::Nil))))));
    println!("리스트 생성 완료!");
}`}</CodeBlock>

        <h3>Rc&lt;T&gt; — 참조 카운팅 (단일 스레드)</h3>
        <p>
          <code>Rc&lt;T&gt;</code>는 하나의 값을 여러 소유자가 공유할 수 있게 합니다.
          마지막 소유자가 사라지면 값이 해제됩니다. 단일 스레드에서만 사용 가능합니다.
        </p>

        <h3>Arc&lt;T&gt; — 원자적 참조 카운팅 (멀티 스레드)</h3>
        <p>
          <code>Arc&lt;T&gt;</code>는 <code>Rc&lt;T&gt;</code>의 스레드 안전 버전입니다.
          여러 스레드에서 데이터를 공유해야 할 때 사용합니다. M3에서 다시 다룹니다.
        </p>

        <h3>RefCell&lt;T&gt; — Interior Mutability(내부 가변성)</h3>
        <p>
          <code>RefCell&lt;T&gt;</code>는 불변 참조를 통해서도 값을 수정할 수 있게 합니다.
          빌림 규칙을 컴파일 타임이 아니라 런타임에 검사합니다.
          규칙 위반 시 <strong>패닉(Panic)</strong>이 발생합니다.
        </p>

        <h3>Interior mutability가 왜 필요한가 — 관찰자 패턴을 예로</h3>
        <p>
          관찰자 패턴, 캐시, 그래프 자료구조처럼 "겉보기엔 불변이지만 내부적으로는 상태가 바뀌어야 하는" 경우가 있습니다.
          Java에서는 그냥 필드를 수정하면 되지만, Rust에서는 <code>&self</code>를 통해 객체를 빌린 상태에서 내부를 바꾸려면
          컴파일러가 "불변 참조를 통해 수정하려 한다"며 거부합니다. 바로 이때 <code>RefCell&lt;T&gt;</code>가 등장합니다.
        </p>
        <CodeBlock>{`use std::cell::RefCell;

struct Counter {
    // 외부에서 보기엔 &self로 접근하지만 내부 값은 바뀔 수 있다
    count: RefCell<u32>,
}

impl Counter {
    fn new() -> Self { Self { count: RefCell::new(0) } }

    // 주목: &self (불변 참조)인데도 내부 count를 증가시킬 수 있다
    fn hit(&self) {
        *self.count.borrow_mut() += 1;
    }

    fn get(&self) -> u32 { *self.count.borrow() }
}`}</CodeBlock>
        <p>
          <code>RefCell</code>의 대가는 "빌림 규칙이 컴파일 타임이 아니라 런타임에 검사된다"는 점입니다.
          같은 객체에 <code>borrow_mut()</code>를 두 번 호출하면 즉시 패닉이 납니다.
          이 트레이드오프를 Rust 문서에서는 <em>"안전성을 런타임으로 연기"</em>한다고 표현합니다.
        </p>

        <Callout title="💡 C++의 mutable 키워드와의 차이">
          C++에는 <code>mutable</code>이라는 필드 한정자가 있습니다 — const 메서드 안에서도 수정 가능한 필드를 표시할 때 씁니다.
          기능은 비슷하지만, C++의 <code>mutable</code>은 <strong>안전성 검사가 전혀 없습니다</strong>.
          같은 객체의 <code>mutable</code> 필드를 여러 스레드에서 동시에 수정해도 컴파일러는 경고하지 않습니다.
          Rust의 <code>RefCell</code>은 단일 스레드 전용이고, 멀티 스레드에서는 <code>Mutex</code>를 써야 컴파일이 통과합니다.
          "모든 안전성 레이어가 타입으로 표현된다"는 철학이 여기서도 드러납니다.
        </Callout>

        <CodeBlock>{`use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // 불변 참조인데도 내부 값을 수정할 수 있습니다
    data.borrow_mut().push(4);

    println!("{:?}", data.borrow()); // [1, 2, 3, 4]
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>Box&lt;T&gt;</code>가 언제 필요한지(재귀 타입, 힙 할당) 이해합니다.</>,
            <><code>Rc&lt;T&gt;</code>와 <code>Arc&lt;T&gt;</code>의 차이를 알고 있습니다.</>,
            <><code>RefCell&lt;T&gt;</code>의 interior mutability 개념을 이해합니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch15-00-smart-pointers.html",
              text: "Rust Book 한국어판 — 15장 스마트 포인터",
            },
            {
              href: "https://doc.rust-kr.org/ch15-01-box.html",
              text: "Rust Book 한국어판 — 15.1 Box<T>",
            },
            {
              href: "https://doc.rust-kr.org/ch15-04-rc.html",
              text: "Rust Book 한국어판 — 15.4 Rc<T>",
            },
            {
              href: "https://doc.rust-kr.org/ch15-05-interior-mutability.html",
              text: "Rust Book 한국어판 — 15.5 RefCell<T>와 내부 가변성",
            },
          ]}
        />
      </Module>

      {/* ===== M3 ===== */}
      <Module badge="M3" title="Fearless Concurrency">
        <Lede>Rust의 소유권 시스템 덕분에, 동시성 코드에서 데이터 레이스가 컴파일 타임에 차단됩니다.</Lede>

        <p>
          다른 언어에서 멀티스레드 프로그래밍은 데이터 레이스, 데드락 같은 버그로 악명 높습니다.
          Rust는 <strong>Send</strong>와 <strong>Sync</strong> 트레이트로 스레드 간 데이터 공유 규칙을 컴파일러가 검사합니다.
          이를 <strong>Fearless Concurrency</strong>라고 부릅니다.
        </p>

        <h3>🆚 Java의 스레드 모델은 왜 데이터 레이스를 못 막는가</h3>
        <p>
          Java, C++, Go 모두 멀티스레드 코드의 정확성을 <em>개발자의 규율</em>에 맡깁니다.
          코드 리뷰, 정적 분석 도구가 도와주지만, 언어 차원의 보장은 없습니다.
          그래서 "테스트는 통과했는데 고부하 상태에서 한 달에 한 번 희귀한 버그가 터진다"는 악명 높은 현상이 생깁니다.
          Rust는 <strong>Send</strong>와 <strong>Sync</strong>라는 두 마커 트레이트로 이 문제를 타입 시스템에 녹여냈습니다.
        </p>
        <ul>
          <li><strong>Send</strong>: "이 타입의 소유권을 다른 스레드로 넘겨도 안전하다" (<code>Rc</code>는 Send가 <em>아니다</em>).</li>
          <li><strong>Sync</strong>: "이 타입의 공유 참조(<code>&T</code>)를 여러 스레드가 동시에 가져도 안전하다" (<code>RefCell</code>은 Sync가 <em>아니다</em>).</li>
        </ul>
        <CodeTabs
          caption="참조 카운팅 객체를 다른 스레드에서 쓰기"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 컴파일은 문제없이 되지만 데이터 레이스
class Counter {
    private int count = 0;           // synchronized 없이 그냥 int
    public void inc() { count++; }   // 여러 스레드가 호출하면 racy
}

// Java 메모리 모델은 개발자가 synchronized/volatile/AtomicInteger를
// '골라 쓰도록' 요구한다. 컴파일러는 검사하지 않는다.
// 테스트로 잡기 어려운, 가장 악명 높은 버그 클래스.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — shared_ptr의 참조 카운트는 원자적이지만,
// 내부 T의 동시 수정은 여전히 개발자 책임
#include <memory>
#include <thread>

auto data = std::make_shared<std::vector<int>>(
    std::vector<int>{1, 2, 3});

std::thread t([data]() {
    data->push_back(4);  // 💥 다른 스레드도 수정 중이면 UB
});
// ThreadSanitizer로 잡을 수는 있지만 언어가 막아주진 않는다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 컴파일 에러로 막힌다
use std::rc::Rc;
use std::thread;

let data = Rc::new(vec![1, 2, 3]);
let d = data.clone();
thread::spawn(move || {
    println!("{:?}", d);
    // error[E0277]: \`Rc<Vec<i32>>\` cannot be sent
    //               between threads safely
    // help: the trait \`Send\` is not implemented for \`Rc<...>\`
});

// Rc는 비원자적 카운터라서 스레드 간 공유가 위험한데,
// 그 사실이 '타입에 새겨져' 있어 컴파일이 거부한다.
// 해결: Arc<Mutex<T>>로 바꾸면 컴파일러가 통과시켜 준다.
use std::sync::{Arc, Mutex};
let data = Arc::new(Mutex::new(vec![1, 2, 3]));`,
            },
          ]}
        />

        <h3>따라하기 — 스레드와 채널</h3>
        <p>다음 코드를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.</p>

        <CodeBlock>{`use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    // 채널(Channel) 생성 — 메시지를 보내는 쪽(tx)과 받는 쪽(rx)
    let (tx, rx) = mpsc::channel();

    // 새 스레드에서 메시지를 보냅니다
    thread::spawn(move || {
        let messages = vec!["안녕", "Rust에서", "보냅니다"];
        for msg in messages {
            tx.send(msg).unwrap();
            thread::sleep(Duration::from_millis(300));
        }
    });

    // 메인 스레드에서 메시지를 받습니다
    for received in rx {
        println!("수신: {}", received);
    }
}`}</CodeBlock>

        <h3>Mutex&lt;T&gt; — 공유 상태 보호</h3>
        <p>
          여러 스레드가 같은 데이터를 수정해야 할 때 <code>Mutex&lt;T&gt;</code>를 사용합니다.
          <code>lock()</code>을 호출해야만 내부 데이터에 접근할 수 있습니다.
        </p>

        <CodeBlock>{`use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc: 여러 스레드에서 소유권 공유
    // Mutex: 동시 접근 방지
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("최종 카운트: {}", *counter.lock().unwrap()); // 10
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>thread::spawn</code>으로 스레드를 생성할 수 있습니다.</>,
            <>채널(<code>mpsc::channel</code>)로 스레드 간 메시지를 주고받을 수 있습니다.</>,
            <><code>Arc&lt;Mutex&lt;T&gt;&gt;</code> 패턴으로 공유 상태를 보호할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch16-00-concurrency.html",
              text: "Rust Book 한국어판 — 16장 겁 없는 동시성",
            },
            {
              href: "https://doc.rust-kr.org/ch16-01-threads.html",
              text: "Rust Book 한국어판 — 16.1 스레드",
            },
            {
              href: "https://doc.rust-kr.org/ch16-02-message-passing.html",
              text: "Rust Book 한국어판 — 16.2 메시지 패싱",
            },
            {
              href: "https://doc.rust-kr.org/ch16-03-shared-state.html",
              text: "Rust Book 한국어판 — 16.3 공유 상태 동시성",
            },
          ]}
        />
      </Module>

      {/* ===== M4 ===== */}
      <Module badge="M4" title="async/await와 tokio">
        <Lede>스레드를 직접 만들지 않고도 수천 개의 작업을 동시에 처리하는 비동기 프로그래밍입니다.</Lede>

        <p>
          스레드는 OS 자원을 소비합니다. 수천 개의 네트워크 연결을 동시에 처리해야 하는 웹 서버라면 스레드만으로는 부족합니다.
          <strong>async/await</strong>는 하나의 스레드 위에서 여러 작업을 번갈아 실행하는 방법입니다.
          Rust에서 비동기 런타임으로 가장 많이 쓰이는 것이 <strong>tokio</strong>입니다.
        </p>

        <h3>따라하기 — tokio 설정</h3>
        <p><code>Cargo.toml</code>에 tokio를 추가합니다.</p>

        <CodeBlock lang="toml">{`[dependencies]
tokio = { version = "1", features = ["full"] }`}</CodeBlock>

        <p>다음 코드를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.</p>

        <CodeBlock>{`use tokio::time::{sleep, Duration};

async fn task(name: &str, seconds: u64) {
    println!("{} 시작", name);
    sleep(Duration::from_secs(seconds)).await;
    println!("{} 완료 ({}초 후)", name, seconds);
}

#[tokio::main]
async fn main() {
    println!("비동기 작업을 동시에 실행합니다:");

    // tokio::join!으로 여러 작업을 동시에 실행
    tokio::join!(
        task("작업 A", 2),
        task("작업 B", 1),
        task("작업 C", 3),
    );

    println!("모든 작업 완료!");
}`}</CodeBlock>

        <p>
          세 작업이 동시에 시작되어, 가장 오래 걸리는 작업(3초) 기준으로 전체가 약 3초 만에 끝납니다.
          순차 실행이었다면 2+1+3=6초가 걸렸을 것입니다.
        </p>

        <h3>async fn과 Future</h3>
        <p>
          <code>async fn</code>은 <strong>Future</strong> 트레이트를 구현하는 값을 반환합니다.
          <code>.await</code>를 호출해야 실제로 실행됩니다.
          <code>#[tokio::main]</code> 매크로는 <code>main</code> 함수를 비동기 런타임 위에서 실행하도록 변환합니다.
        </p>

        <h3>🆚 Java Virtual Thread, Go goroutine, JS Promise와 Rust async의 차이</h3>
        <p>
          "비동기" 또는 "가벼운 스레드"라는 컨셉 자체는 여러 언어에 있습니다.
          구현 전략이 극적으로 다르고, 그 차이가 Rust가 왜 <code>async fn</code>이라는 독특한 모델을 택했는지 설명해 줍니다.
        </p>
        <ul>
          <li>
            <strong>Java Virtual Thread (Project Loom)</strong> — JVM이 OS 스레드를 가볍게 에뮬레이션합니다.
            개발자는 <code>Thread</code>를 그냥 쓰던 코드를 수정 없이 그대로 씁니다. 런타임 오버헤드는 있지만 코드 변경이 없는 것이 장점입니다.
          </li>
          <li>
            <strong>Go goroutine</strong> — 언어 런타임이 M:N 스케줄러를 내장합니다. <code>go f()</code> 한 줄로 고루틴을 띄웁니다.
            런타임과 GC가 한 묶음이라 "가볍고 편하지만 Go 런타임을 쓰는 프로그램만 가능"합니다.
          </li>
          <li>
            <strong>JavaScript Promise / async-await</strong> — 단일 스레드 이벤트 루프. 언어 자체가 싱글 스레드를 전제로 합니다.
          </li>
          <li>
            <strong>Rust async</strong> — 언어에는 <code>async fn</code>과 <code>Future</code> 트레이트만 있고, 실행기(runtime)는 없음.
            <code>tokio</code>, <code>async-std</code>, <code>smol</code> 같은 크레이트를 <em>골라서</em> 링크합니다.
            이 설계를 "런타임 없는 async"라고 부릅니다.
          </li>
        </ul>

        <p><strong>Rust가 런타임을 언어에서 뺀 이유</strong></p>
        <p>
          Rust는 커널, 펌웨어, 임베디드, WASM, 게임 엔진까지 타깃으로 하는 언어입니다.
          이런 환경에는 힙 할당기조차 없을 수 있고, Go처럼 M:N 스케줄러를 내장하면 그런 플랫폼에서 쓸 수가 없습니다.
          그래서 Rust는 <em>언어 차원에서는 "이 함수는 중단 가능하다"는 의미의 코루틴 변환만 제공</em>하고,
          실제 "언제 돌릴지"는 <code>tokio</code> 같은 런타임이 결정하게 했습니다.
        </p>
        <p>
          대가는 유명한 "async 생태계 분열 문제"입니다 — <code>tokio</code>용과 <code>async-std</code>용 라이브러리가 별도로 존재하고,
          하나의 프로젝트에서 두 런타임을 섞으면 문제가 생기기도 합니다.
          반대급부는 "베어메탈에서도 <code>async/await</code>를 쓸 수 있다"는 드문 이점입니다.
        </p>

        <Callout title="🧠 async fn의 실제 동작 — 상태 기계로의 변환">
          <code>async fn</code>은 컴파일러가 <strong>상태 기계(state machine)</strong>로 변환합니다.
          함수에 <code>.await</code>가 두 개 있으면, "아직 시작 전 / 첫 await 대기 중 / 두 번째 await 대기 중 / 끝남" 같은 상태를 가진 struct가 생성됩니다.
          각 <code>.await</code>는 "여기서 일시 중단하고 제어를 런타임에게 돌려줘"라는 의미입니다.
          이 구조 덕분에 Rust의 async는 스레드 스택을 쓰지 않고 힙에 작은 state struct 하나만 할당합니다 —
          그래서 수만 개의 동시 작업을 저비용으로 띄울 수 있습니다.
        </Callout>

        <Checklist
          items={[
            <>tokio를 <code>Cargo.toml</code>에 추가하고 <code>cargo run</code>으로 비동기 코드를 실행할 수 있습니다.</>,
            <><code>async fn</code>과 <code>.await</code>의 의미를 이해합니다.</>,
            <><code>tokio::join!</code>으로 여러 비동기 작업을 동시에 실행할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-lang.org/book/ch17-00-async-await.html",
              text: "Rust Book (영문) — 17장 Async and Await",
            },
            {
              href: "https://tokio.rs/tokio/tutorial",
              text: "tokio 공식 튜토리얼",
            },
          ]}
        />
      </Module>

      <Callout title="🎓 여기까지 오셨다면">
        모듈 시스템, 스마트 포인터, Fearless Concurrency, async까지 — 이 위키에서 다루는 Rust 학습 로드맵의 마지막 페이지입니다.
        여기까지 소화했다면 표준 라이브러리 문서와 실제 크레이트 소스를 직접 읽으며 성장할 수 있는 단계에 도달한 것입니다.
        막히는 개념이 생기면 언제든 앞 Step으로 돌아와 복습하세요.
      </Callout>

      <PageNav prev={{ to: "/step/7" }} />
    </Layout>
  );
}
