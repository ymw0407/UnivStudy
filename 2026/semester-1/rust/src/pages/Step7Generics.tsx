import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { ErrorExplain } from "../components/ErrorExplain";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";
import { CodeTabs } from "../components/CodeTabs";
import { TranslationPendingBanner } from "../components/TranslationPendingBanner";

export function Step7Generics() {
  return (
    <Layout
      kicker="Step 7 · 4월 28일"
      title="Generics · Error Handling · Closures · Iterators"
      subtitle="제네릭, 에러 처리, 클로저, 반복자 — 함수형 Rust의 핵심"
    >
      <TranslationPendingBanner />
      <Lede>
        이 회차를 마치면 제네릭으로 타입을 추상화하고, Result와 ?로 에러를 우아하게 처리하고,
        클로저와 반복자로 데이터를 변환할 수 있게 됩니다.
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="제네릭(Generics)">
        <Lede>타입을 매개변수로 받아 코드 중복을 없애는 방법입니다.</Lede>

        <p>
          같은 로직인데 <code>i32</code>용, <code>f64</code>용으로 함수를 따로 만드는 것은 비효율적입니다.
          <strong>제네릭(Generics)</strong>을 사용하면 타입을 매개변수로 받아 하나의 함수로 여러 타입에 대응할 수 있습니다.
          Rust의 제네릭은 <strong>monomorphization</strong>(단형화) 덕분에 런타임 비용이 전혀 없습니다 —
          컴파일러가 사용되는 구체 타입마다 전용 코드를 생성합니다.
        </p>

        <h3>따라하기</h3>
        <p>다음 코드를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.</p>

        <CodeBlock>{`use std::fmt::Display;

// 제네릭 함수 — T는 PartialOrd(비교 가능)와 Display(출력 가능)를 만족해야 합니다
fn largest<T: PartialOrd + Display>(list: &[T]) -> &T {
    let mut max = &list[0];
    for item in &list[1..] {
        if item > max {
            max = item;
        }
    }
    max
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("가장 큰 수: {}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("가장 큰 문자: {}", largest(&chars));
}`}</CodeBlock>

        <h3>트레이트 바운드(Trait Bounds)</h3>
        <p>
          <code>T: PartialOrd + Display</code>는 <strong>트레이트 바운드</strong>입니다.
          "T는 비교 가능하고 출력 가능한 타입이어야 한다"는 제약 조건입니다.
        </p>
        <p><code>impl Trait</code> 문법으로 더 간결하게 쓸 수도 있습니다.</p>

        <h3>🆚 Java Generics vs C++ Templates vs Rust Generics</h3>
        <p>
          세 언어 모두 "타입을 매개변수로 받는다"는 같은 목표를 향하지만, <strong>구현 전략이 완전히 다릅니다</strong>.
          이 차이가 실제로 어떤 문제를 만들고, Rust가 어떤 타협을 택했는지 봅시다.
        </p>

        <CodeTabs
          caption="largest() 함수를 세 언어로"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — type erasure (타입 소거)
public <T extends Comparable<T>> T largest(List<T> list) {
    T max = list.get(0);
    for (T item : list) {
        if (item.compareTo(max) > 0) max = item;
    }
    return max;
}

// 런타임에는 List<Integer>나 List<String>이나 그냥 'List'다.
// 결과: int 같은 원시 타입은 담을 수 없어 Integer 박싱 필수.
// 결과: new T()가 불가능하다 (타입 정보가 없으니까).
// 결과: new T[size]도 에러.
// → JVM 호환성을 위해 '런타임 제네릭'을 포기한 대가.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 템플릿 (덕 타이핑식 monomorphization)
template <typename T>
T largest(const std::vector<T>& list) {
    T max = list[0];
    for (const auto& item : list) {
        if (item > max) max = item;
        //   ^^^^^^^^^^^ T가 > 연산자를 지원해야 한다는 사실은
        //               템플릿 선언 시점에는 모른다.
    }
    return max;
}

// 전혀 엉뚱한 타입(>가 없는)을 넣어도 선언은 통과.
// 사용할 때 수백 줄짜리 불가해한 에러가 터진다.
// 에러 메시지에 템플릿 인스턴스화 스택이 펼쳐지는 악명 높은 현상.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 트레이트 바운드 + monomorphization
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut max = &list[0];
    for item in &list[1..] {
        if item > max { max = item; }
    }
    max
}

// '템플릿 선언 시점에' T가 PartialOrd를 구현하는지 검증한다.
// 호출부에서 바운드를 만족하지 않으면 호출한 바로 그 줄에서
// 한 줄짜리 명확한 에러가 난다.
// 그리고 C++처럼 사용된 구체 타입마다 전용 코드 생성 (monomorphization).
// → "C++의 제로 비용 성능 + Java 수준의 명확한 에러"를 동시에 노린다.`,
            },
          ]}
        />
        <p>
          Rust는 "C++의 제로 비용 성능(박싱 없음) + Java의 명확한 에러 메시지"를 동시에 얻으려고 했습니다.
          트레이트 바운드를 선언 시점에 명시하는 것이 그 대가입니다 —
          처음엔 장황해 보이지만, 나중에 "수백 줄 템플릿 에러" 없이 "이 타입은 이 바운드를 만족하지 않는다"는 한 줄 메시지를 받게 됩니다.
        </p>

        <h3>Monomorphization(단형화)의 의미</h3>
        <p>
          <code>largest::&lt;i32&gt;</code>와 <code>largest::&lt;char&gt;</code>가 호출되면,
          컴파일러는 <em>두 개의 별도 함수</em>를 생성합니다. 마치 손으로 오버로드를 두 개 쓴 것처럼요.
          그래서 런타임에는 제네릭의 흔적이 남지 않고, <code>i32</code>용 코드가 <code>char</code>용 코드와 똑같이 직접 호출됩니다.
        </p>
        <ul>
          <li><strong>장점</strong>: Java처럼 박싱 없음, 런타임 디스패치 없음, 인라인 가능, C++ 템플릿 수준의 성능.</li>
          <li><strong>단점</strong>: 사용된 타입 조합마다 코드가 복제되어 바이너리 크기가 커집니다.
            많이 쓰는 라이브러리가 "컴파일이 느리다"고 불평받는 이유 중 하나이기도 합니다.</li>
        </ul>

        <CodeBlock>{`// 매개변수에서 impl Trait
fn print_item(item: &impl Display) {
    println!("{}", item);
}

// 반환값에서 impl Trait
fn make_greeting() -> impl Display {
    String::from("안녕하세요!")
}`}</CodeBlock>

        <Checklist
          items={[
            <>제네릭 함수를 작성하고 호출할 수 있습니다.</>,
            <>트레이트 바운드의 역할을 이해합니다.</>,
            <>monomorphization이 런타임 비용 없음을 의미하는 것을 알고 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch10-01-syntax.html",
              text: "Rust Book 한국어판 — 10.1 제네릭 데이터 타입",
            },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="에러 처리(Error Handling)">
        <Lede>panic!으로 멈추거나, Result와 ?로 에러를 우아하게 전파하는 방법을 배웁니다.</Lede>

        <p>
          프로그램을 작성하다 보면 파일이 없거나, 네트워크가 끊기거나, 입력이 잘못되는 상황을 만납니다.
          Rust는 이런 에러를 두 가지로 구분합니다.
        </p>
        <ul>
          <li><strong>복구 불가능한 에러</strong> — <code>panic!</code> 매크로로 프로그램을 즉시 중단합니다. 논리적 버그에 사용합니다.</li>
          <li><strong>복구 가능한 에러</strong> — <code>Result&lt;T, E&gt;</code> 타입으로 표현하고, 호출자가 처리 방법을 결정합니다.</li>
        </ul>

        <h3>🆚 예외(Exception)는 왜 Rust에 없을까?</h3>
        <p>
          Java/C++/Python은 모두 예외를 던지고(<code>throw</code>) 잡는(<code>try/catch</code>) 방식으로 에러를 처리합니다.
          예외는 편리해 보이지만 몇 가지 구조적인 문제를 동반합니다.
        </p>
        <CodeTabs
          caption="파일을 읽어 사용자명을 얻는 함수"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 시그니처만 봐선 어떤 예외가 튈지 알 수 없다
public String readUsername() {
    // throws? IOException? unchecked? 어느 쪽?
    try {
        return Files.readString(Path.of("username.txt")).trim();
    } catch (IOException e) {
        throw new RuntimeException(e); // 흔한 회피 패턴
    }
}
// 호출자가 catch를 빼먹으면 프로그램 전체가 크래시.
// 체크드 예외는 스펙이 커질수록 boilerplate 지옥이 된다.
// 람다·스트림과 섞으면 체크드 예외를 그냥 쓸 수 없는 막다른 골목.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 어떤 함수가 예외를 던질지 시그니처에 없다
std::string read_username() {
    std::ifstream f("username.txt");
    if (!f) throw std::runtime_error("file not found");
    std::string line;
    std::getline(f, line);
    return line;
}
// throw() 명세는 C++17에서 폐기됨.
// noexcept가 있지만 '던지지 않음'만 표시할 수 있고 강제력이 약하다.
// 예외 안전성(strong/basic/nothrow)은 프로그래머가 머릿속으로 관리.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 에러는 '값'이다. 시그니처가 실패 가능성을 말해준다.
use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
    let content = fs::read_to_string("username.txt")?;
    Ok(content.trim().to_string())
}

// 호출자는 세 가지 중 하나를 반드시 선택해야 한다:
fn main() -> Result<(), io::Error> {
    let name = read_username()?;               // 에러면 이 함수도 Err 반환
    let name = read_username().unwrap_or_else( // 에러면 대체 값
        |_| String::from("익명")
    );
    let name = read_username().unwrap();       // 에러면 panic (테스트용)
    Ok(())
}`,
            },
          ]}
        />
        <p><strong>Java/C++ 예외의 구조적 문제:</strong></p>
        <ul>
          <li>
            <strong>제어 흐름이 숨어 있다</strong> — 어떤 줄에서든 예외가 튀어 함수 바깥으로 빠져나갈 수 있습니다.
            "이 함수의 이 줄까지 실행됐을 것이다"는 가정이 깨지면서 자원 누수, 일관성 깨짐이 생깁니다.
            C++에서는 예외 안전성을 보장하기 위한 RAII 패턴과 "noexcept" 키워드가 생겨났습니다.
          </li>
          <li>
            <strong>타입 시스템 바깥에 있다</strong> — 반환 타입에는 나타나지 않고, 던질 수 있는 예외 종류를 강제할 수 없습니다(C++의 <code>throw()</code> 명세는 폐기되었습니다).
            Java의 checked exception은 이를 강제하려다 과도한 boilerplate로 미움받고 결국 람다/스트림에서는 막다른 길에 부딪혔습니다.
          </li>
          <li>
            <strong>성능</strong> — 예외 throw/catch는 일반적으로 해피 패스보다 수백 배 느립니다.
            자주 발생하는 에러(파일 없음, 파싱 실패)에 쓰기에는 부담이 큽니다.
          </li>
        </ul>
        <p><strong>Rust의 접근 — 에러는 값이다</strong></p>
        <p>
          Rust는 에러를 <em>예외적 제어 흐름</em>이 아니라 <em>평범한 값</em>으로 다룹니다.
          함수의 반환 타입이 <code>Result&lt;T, E&gt;</code>이면, 이 함수는 실패할 수 있다는 것이 시그니처에 선언되어 있습니다.
          호출자는 에러를 무시할 수 없고, 컴파일러가 처리 여부를 추적합니다.
        </p>
        <CodeBlock>{`// Rust — 시그니처만 봐도 실패 가능성이 보인다
fn read_username() -> Result<String, io::Error> { ... }

// 호출자는 세 가지 중 하나를 반드시 선택해야 한다
let name = read_username()?;                 // 에러면 이 함수도 바로 Err 반환
let name = read_username().unwrap();         // 에러면 panic (테스트/예제용)
let name = read_username().unwrap_or_else(   // 에러면 대체 값 사용
    |_| String::from("익명")
);`}</CodeBlock>
        <p>
          <code>?</code> 연산자는 "예외 throw"의 간결함은 유지하면서, <em>제어 흐름이 시그니처에 드러난다</em>는 원칙은 지킵니다.
          Go의 <code>if err != nil</code> 반복보다 훨씬 간결하고, Java의 checked exception 같은 boilerplate도 없습니다.
        </p>

        <Callout title="🧠 panic과 예외는 같은가?">
          헷갈리기 쉬운 점 — Rust의 <code>panic!</code>은 "Java의 RuntimeException"에 가깝습니다.
          논리 버그(배열 out-of-bounds, 0으로 나눔, <code>unwrap()</code>을 None에 호출)에서만 발생해야 합니다.
          일반적인 실패(파일 없음, 네트워크 오류)는 <code>Result</code>로 표현해야 하며, 이 둘을 섞으면 Rust답지 않은 코드가 됩니다.
        </Callout>

        <h3>Result&lt;T, E&gt;와 ? 연산자</h3>
        <p><code>Result</code>는 성공(<code>Ok(T)</code>) 또는 실패(<code>Err(E)</code>)를 담는 열거형입니다.</p>

        <CodeBlock>{`use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
    // ? 연산자: Err이면 바로 반환, Ok이면 값을 꺼냅니다
    let content = fs::read_to_string("username.txt")?;
    Ok(content.trim().to_string())
}

fn main() {
    match read_username() {
        Ok(name) => println!("사용자: {}", name),
        Err(e) => println!("파일을 읽을 수 없습니다: {}", e),
    }
}`}</CodeBlock>

        <p>
          <strong><code>?</code> 연산자</strong>는 <code>Result</code>가 <code>Err</code>이면 현재 함수에서 즉시 반환하고,
          <code>Ok</code>이면 안의 값을 꺼내줍니다. <code>match</code>를 중첩하는 것보다 훨씬 깔끔합니다.
        </p>

        <ErrorExplain
          header={`error[E0277]: the \`?\` operator can only be used in a function that returns \`Result\` or \`Option\``}
          code={`error[E0277]: the \`?\` operator can only be used in a function
              that returns \`Result\` or \`Option\`
 --> src/main.rs:4:48
  |
1 | fn main() {
  | --------- this function should return \`Result\` or \`Option\`
  |            to accept \`?\`
...
4 |     let content = fs::read_to_string("hello.txt")?;
  |                                                    ^ cannot use the \`?\`
  |                                                      operator in a
  |                                                      function that
  |                                                      returns \`()\``}
        >
          <p>
            <strong>해석:</strong> <code>?</code> 연산자는 <code>Result</code>나 <code>Option</code>을 반환하는 함수 안에서만 사용할 수 있습니다.
            <code>main()</code>에서 <code>?</code>를 쓰려면 반환 타입을 <code>Result&lt;(), Box&lt;dyn std::error::Error&gt;&gt;</code>로 바꾸거나,
            <code>match</code>로 직접 처리해야 합니다.
          </p>
          <p>
            에러 메시지가 길어 보여도 무서워하지 마세요. rustc는 거의 항상 해결 방법까지 알려줍니다.
          </p>
        </ErrorExplain>

        <h3>panic! — 복구 불가능한 에러</h3>
        <p><code>panic!</code>은 프로그램을 즉시 중단합니다. 정상적인 에러 처리에는 사용하지 않습니다.</p>

        <CodeBlock>{`fn divide(a: f64, b: f64) -> f64 {
    if b == 0.0 {
        panic!("0으로 나눌 수 없습니다!");
    }
    a / b
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>Result&lt;T, E&gt;</code>와 <code>?</code> 연산자를 사용해 에러를 처리할 수 있습니다.</>,
            <><code>panic!</code>은 논리적 버그에만 사용해야 한다는 것을 이해합니다.</>,
            <><code>match</code>로 <code>Ok</code>와 <code>Err</code>를 분기할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch09-00-error-handling.html",
              text: "Rust Book 한국어판 — 9장 에러 처리",
            },
            {
              href: "https://doc.rust-kr.org/ch09-01-unrecoverable-errors-with-panic.html",
              text: "Rust Book 한국어판 — 9.1 panic!과 복구 불가능한 에러",
            },
            {
              href: "https://doc.rust-kr.org/ch09-02-recoverable-errors-with-result.html",
              text: "Rust Book 한국어판 — 9.2 Result와 복구 가능한 에러",
            },
          ]}
        />
      </Module>

      {/* ===== M3 ===== */}
      <Module badge="M3" title="클로저(Closure)">
        <Lede>환경을 캡처하는 익명 함수 — 데이터 변환과 콜백의 핵심 도구입니다.</Lede>

        <p>
          <strong>클로저(Closure)</strong>는 주변 환경의 변수를 캡처할 수 있는 익명 함수입니다.
          <code>|매개변수| 본문</code> 형태로 작성합니다.
          일반 함수와 달리, 클로저는 자신이 정의된 스코프의 변수에 접근할 수 있습니다.
        </p>

        <h3>따라하기</h3>
        <p>클로저의 기본 문법과 환경 캡처를 확인합니다.</p>

        <CodeBlock>{`fn main() {
    // 기본 클로저 문법
    let add = |a: i32, b: i32| -> i32 { a + b };
    println!("3 + 5 = {}", add(3, 5));

    // 타입 추론 — 대부분 타입을 생략할 수 있습니다
    let double = |x| x * 2;
    println!("4의 두 배: {}", double(4));

    // 환경 캡처 — 클로저 바깥의 변수를 사용합니다
    let greeting = String::from("안녕하세요");
    let say_hello = || println!("{}", greeting);
    say_hello();
    // greeting은 불변 빌림으로 캡처되어 이후에도 사용 가능
    println!("원래 값: {}", greeting);
}`}</CodeBlock>

        <h3>캡처 방식 — Fn, FnMut, FnOnce</h3>
        <p>클로저는 환경을 캡처하는 방식에 따라 세 가지 트레이트 중 하나를 구현합니다.</p>
        <ul>
          <li><code>Fn</code> — 불변 참조로 캡처. 여러 번 호출 가능.</li>
          <li><code>FnMut</code> — 가변 참조로 캡처. 캡처한 변수를 수정할 수 있음.</li>
          <li><code>FnOnce</code> — 소유권을 가져감. 한 번만 호출 가능.</li>
        </ul>

        <h3>🆚 Java 람다는 왜 final만 캡처할 수 있는가</h3>
        <CodeTabs
          caption="클로저에서 카운터 증가"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 람다는 'effectively final' 변수만 캡처할 수 있다
int counter = 0;
Runnable inc = () -> {
    counter++;  // 💥 컴파일 에러:
                // "local variables referenced from a lambda
                //  must be final or effectively final"
};

// 우회책: 1칸짜리 배열 트릭, 또는 AtomicInteger 같은 박싱 객체
int[] box = { 0 };
Runnable inc2 = () -> { box[0]++; };   // 이건 되는데 볼품없다

// 이유: 람다가 나중에 실행될 때 원본 지역 변수가 이미 스택에서 사라졌을 수 있음.
// Java는 "값 복사"로만 캡처를 허용해서 이 문제를 회피.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 컴파일러가 캡처 방식(참조/가변 참조/소유)을 자동 추론한다
let mut counter = 0;
let mut inc = || { counter += 1; };   // FnMut로 추론됨
inc();
inc();
println!("{}", counter);               // 2 — 지역 변수가 그대로 바뀐다

// 스레드로 넘기려면? 소유권을 가져가는 'move' 캡처로 명시
let data = vec![1, 2, 3];
let consume = move || { println!("{:?}", data); };
// 이후 data는 사용 불가.
// 라이프타임과 소유권이 수명 문제를 이미 해결했으므로,
// Java처럼 "final만 허용"하는 임시방편이 필요 없다.`,
            },
          ]}
        />
        <p>
          Rust는 "람다가 원본보다 오래 살면 어떡하나?"라는 문제를 <strong>라이프타임과 소유권</strong>으로 해결합니다.
          클로저가 지역 변수를 참조로 캡처했다면, 지역 변수보다 오래 살 수 없다고 컴파일러가 검사합니다.
          스레드로 넘기거나 반환하려면 <code>move</code>로 소유권을 가져가야 하고, 그러면 수명 문제가 원천적으로 사라집니다.
        </p>

        <h3>고차 함수(Higher-order Functions)</h3>
        <p>함수의 매개변수로 클로저를 받을 수 있습니다.</p>

        <CodeBlock>{`fn apply_twice<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}

fn main() {
    let result = apply_twice(|x| x + 3, 7);
    println!("결과: {}", result); // (7+3)+3 = 13
}`}</CodeBlock>

        <Checklist
          items={[
            <>클로저를 <code>|매개변수| 본문</code> 형태로 작성할 수 있습니다.</>,
            <>Fn, FnMut, FnOnce의 차이를 이해합니다.</>,
            <>함수의 매개변수로 클로저를 전달할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch13-01-closures.html",
              text: "Rust Book 한국어판 — 13.1 클로저: 환경을 캡처하는 익명 함수",
            },
          ]}
        />
      </Module>

      {/* ===== M4 ===== */}
      <Module badge="M4" title="반복자(Iterator)">
        <Lede>지연 평가와 체이닝으로 데이터를 효율적으로 변환하는 방법입니다.</Lede>

        <p>
          <strong>반복자(Iterator)</strong>는 연속된 요소를 하나씩 처리하는 패턴입니다.
          Rust의 반복자는 <strong>지연 평가(Lazy Evaluation)</strong>를 사용합니다 —
          <code>collect()</code> 같은 소비 메서드를 호출하기 전까지는 실제로 아무 계산도 하지 않습니다.
          <code>map</code>, <code>filter</code>, <code>fold</code>를 체인처럼 연결해서 선언적으로 데이터를 변환할 수 있습니다.
        </p>

        <h3>🆚 Java Stream이나 Python 리스트 컴프리헨션과 뭐가 다른가</h3>
        <p>
          Java 8 스트림이나 Python의 제너레이터도 "지연 평가"와 "map/filter 체인"을 지원합니다.
          겉보기엔 비슷하지만, Rust 반복자는 <strong>런타임 비용이 0에 수렴한다</strong>는 점에서 다릅니다.
        </p>
        <CodeTabs
          caption="짝수를 제곱해서 합하기"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 각 단계마다 Stream 객체, 인터페이스 호출, 박싱이 일어난다
int sum = nums.stream()
    .filter(n -> n % 2 == 0)   // Predicate<Integer> 호출 (가상 함수)
    .mapToInt(n -> n * n)      // Integer → int 언박싱
    .sum();

// JIT가 인라인해주기를 기대하지만, 보장은 없다.
// Integer 박싱이 끼어들면 힙 할당이 생기고 GC 부담이 늘어난다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 같은 코드가 컴파일 타임에 손으로 쓴 for 루프와 동일하게 압축된다
let sum: i32 = nums.iter()
    .filter(|&&n| n % 2 == 0)
    .map(|&n| n * n)
    .sum();

// LLVM 최적화 후의 어셈블리는 아래와 실질적으로 동일하다:
//
//   let mut sum = 0;
//   for &n in &nums {
//       if n % 2 == 0 { sum += n * n; }
//   }
//
// 중간 Filter/Map 객체는 monomorphization + 인라인으로 흔적 없이 사라진다.`,
            },
          ]}
        />
        <p>
          비결은 monomorphization과 인라인입니다. <code>filter</code>가 받는 클로저는 구체 타입이고,
          <code>Filter&lt;Map&lt;Iter&gt;&gt;</code>같은 중첩 타입이 컴파일 시점에 모두 드러납니다.
          LLVM이 이 체인을 보고 중간 객체를 모두 제거한 뒤 단일 루프로 접습니다.
          Java의 <code>Stream</code>은 실행 시점에 타입이 지워지고 람다가 인터페이스 호출이라, 같은 최적화가 어렵습니다.
        </p>

        <h3>반복자가 '소비(consume)'되어야 한다는 규칙</h3>
        <CodeBlock>{`// 이 코드는 아무것도 출력하지 않는다 — collect/for 같은 소비자가 없기 때문
let _ = (1..=5).map(|x| {
    println!("처리: {}", x);
    x * 2
});
// warning: unused \`Map\` that must be used
//          iterators are lazy and do nothing unless consumed`}</CodeBlock>
        <p>
          컴파일러가 이걸 경고로 알려주는 것도 Rust의 작은 친절함입니다.
          Java 스트림에서 <code>.forEach</code>를 깜빡해도 경고가 없고, 그냥 조용히 아무것도 안 하고 끝납니다.
        </p>

        <h3>따라하기</h3>
        <p>다음 코드를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.</p>

        <CodeBlock>{`fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // map: 각 요소를 변환, filter: 조건에 맞는 것만 남김
    let even_squares: Vec<i32> = numbers
        .iter()               // 반복자 생성
        .filter(|&&x| x % 2 == 0) // 짝수만
        .map(|&x| x * x)     // 제곱
        .collect();           // Vec으로 수집

    println!("짝수의 제곱: {:?}", even_squares);
    // [4, 16, 36, 64, 100]

    // fold: 누적 계산 (다른 언어의 reduce와 유사)
    let sum: i32 = numbers.iter().fold(0, |acc, &x| acc + x);
    println!("합계: {}", sum); // 55

    // 문자열 처리에도 유용합니다
    let words = vec!["hello", "world", "rust"];
    let sentence: String = words
        .iter()
        .map(|w| w.to_uppercase())
        .collect::<Vec<String>>()
        .join(" ");
    println!("{}", sentence); // "HELLO WORLD RUST"
}`}</CodeBlock>

        <h3>Iterator 트레이트</h3>
        <p>모든 반복자는 <code>Iterator</code> 트레이트를 구현하며, 핵심 메서드는 <code>next()</code> 하나입니다.</p>

        <CodeBlock>{`fn main() {
    let v = vec![10, 20, 30];
    let mut iter = v.iter();

    println!("{:?}", iter.next()); // Some(10)
    println!("{:?}", iter.next()); // Some(20)
    println!("{:?}", iter.next()); // Some(30)
    println!("{:?}", iter.next()); // None
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>iter()</code>, <code>map()</code>, <code>filter()</code>, <code>collect()</code>를 체인으로 연결할 수 있습니다.</>,
            <>지연 평가의 의미를 이해합니다.</>,
            <><code>fold()</code>로 누적 계산을 수행할 수 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            {
              href: "https://doc.rust-kr.org/ch13-02-iterators.html",
              text: "Rust Book 한국어판 — 13.2 반복자로 일련의 항목 처리하기",
            },
          ]}
        />
      </Module>

      <Callout title="💡 다음 단계로 가기 전에">
        제네릭, Result/?, 클로저, 반복자는 실제 Rust 코드에서 가장 자주 쓰이는 도구들입니다.
        이 네 가지가 손에 익으면 표준 라이브러리와 대부분의 크레이트 코드를 읽을 수 있게 됩니다.
      </Callout>

      <PageNav prev={{ to: "/step/5" }} next={{ to: "/step/8" }} />
    </Layout>
  );
}
