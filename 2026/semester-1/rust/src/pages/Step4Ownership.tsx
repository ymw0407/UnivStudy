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

export function Step4Ownership() {
  return (
    <Layout
      kicker="Step 4 · 4월 16일"
      title="Ownership · Borrowing · Lifetime"
      subtitle="Rust의 핵심 — 소유권, 빌림, 라이프타임을 단계적으로 익힙니다"
    >
      <TranslationPendingBanner />
      <Lede>
        이 회차를 마치면 Rust의 소유권 규칙 3가지를 자기 말로 설명할 수 있고,
        빌림과 라이프타임이 왜 필요한지 이해하게 됩니다.
        소유권은 Rust를 Rust답게 만드는 핵심 개념입니다.
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="소유권(Ownership)">
        <Lede>모든 값에는 소유자가 하나뿐이고, 소유자가 스코프를 벗어나면 값이 자동으로 해제됩니다.</Lede>

        <p>
          C/C++에서는 프로그래머가 직접 <code>malloc</code>/<code>free</code>를 호출해 메모리를 관리합니다.
          실수로 해제를 빠뜨리면 메모리 누수가 생기고, 이미 해제한 메모리에 접근하면 프로그램이 비정상 종료됩니다.
          Rust는 <strong>소유권(Ownership)</strong> 규칙으로 이 문제를 컴파일 타임에 해결합니다.
          가비지 컬렉터 없이도 메모리 안전을 보장하는 것이 Rust의 가장 큰 특징입니다.
        </p>

        <h3>소유권 규칙 3가지</h3>
        <ol>
          <li>Rust에서 각 값은 <strong>소유자(Owner)</strong>라고 불리는 변수를 가집니다.</li>
          <li>한 번에 하나의 소유자만 존재합니다.</li>
          <li>소유자가 <strong>스코프(Scope)</strong>를 벗어나면 값은 자동으로 버려집니다(<code>drop</code>).</li>
        </ol>

        <h3>스택(Stack) vs 힙(Heap)</h3>
        <p>
          <code>i32</code>, <code>bool</code> 같은 크기가 고정된 타입은 <strong>스택(Stack)</strong>에 저장됩니다.
          스택 데이터는 빠르게 복사할 수 있어서 값을 대입하면 자동으로 복사됩니다.
          반면 <code>String</code>처럼 크기가 가변인 타입은 <strong>힙(Heap)</strong>에 저장됩니다.
          힙 데이터를 대입하면 복사가 아니라 <strong>이동(Move)</strong>이 일어납니다.
        </p>

        <h3>🆚 C++/Java는 어떻게 할까? — 그리고 Rust는 왜 다른가</h3>
        <p>
          같은 "객체 대입"이라는 동작이, 언어마다 전혀 다른 의미로 해석됩니다.
          아래 탭을 눌러가며 세 언어의 차이를 비교해 보세요. 같은 <code>s2 = s1</code> 한 줄이 전혀 다른 일을 합니다.
        </p>
        <CodeTabs
          caption="s2 = s1 의 의미 — 세 언어 비교"
          tabs={[
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 복사 생성자가 호출된다 (깊은 복사)
std::string s1 = "hello";
std::string s2 = s1;  // 힙 버퍼를 '깊게' 복사
// 둘 다 사용 가능. 그러나 포인터 필드가 있는 직접 만든 클래스에서
// 복사 생성자를 정의하지 않으면 같은 포인터를 두 객체가 가리키게 되고,
// 둘 다 소멸자에서 delete를 호출하여 '이중 해제(double free)'가 발생한다.
// 이래서 "Rule of Three/Five"라는 관용이 생겨났다.`,
            },
            {
              label: "Java",
              lang: "java",
              code: `// Java — 참조만 복사된다 (Shallow Copy)
StringBuilder s1 = new StringBuilder("hello");
StringBuilder s2 = s1;  // 둘 다 같은 객체를 가리킨다
s2.append(" world");
System.out.println(s1); // "hello world" — s1도 바뀐다!

// 이중 해제는 GC가 막아주지만 '의도치 않은 공유(aliasing)'가 생긴다.
// 멀티스레드에서 s1, s2를 서로 다른 스레드가 수정하면 바로 데이터 레이스.
// 컴파일러는 이걸 막지 않고, synchronized를 빠뜨리면 런타임에만 드러난다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 대입은 "이동(move)". 원본은 더 이상 존재하지 않는 것처럼 가려진다.
let s1 = String::from("hello");
let s2 = s1;          // s1의 소유권이 s2로 이동
// println!("{}", s1); // 컴파일 에러 (E0382: borrow of moved value)

// 하나의 힙 버퍼에 대한 소유권은 한 순간 단 하나의 변수만 가진다.
// → 이중 해제(C++ 문제)와 공유 가변 상태(Java 문제)를 동시에 차단.
// → 검증은 전부 컴파일 타임. GC도, 런타임 체크도 없다.`,
            },
          ]}
        />

        <Callout title="🧠 한 줄 정리">
          C++: "복사할까 이동할까?"를 프로그래머가 결정 → 실수하면 UB.<br/>
          Java: 항상 참조 복사 → 공유는 쉽지만 레이스 컨디션이 런타임 폭탄.<br/>
          Rust: 기본이 이동(move). 복사는 <code>Copy</code> 트레이트가 구현된 타입만, 공유는 참조(<code>&amp;</code>)로 명시.
        </Callout>

        <h3>Copy 트레이트는 무엇을 기준으로 정해지나?</h3>
        <p>
          "왜 <code>i32</code>는 복사되고 <code>String</code>은 이동되는가?"에 대한 답은 <strong>Copy 트레이트</strong>입니다.
          타입이 <code>Copy</code>를 구현하면 대입 시 비트 단위 복사가 일어나고, 아니면 이동됩니다.
          규칙은 단순합니다 — <em>힙 자원을 소유하는 타입은 Copy가 될 수 없습니다</em>.
          그렇지 않으면 다시 이중 해제 문제로 돌아가기 때문입니다.
        </p>
        <ul>
          <li><code>Copy</code>인 타입: <code>i32</code>, <code>f64</code>, <code>bool</code>, <code>char</code>,
            그리고 모든 필드가 Copy인 튜플·구조체(<code>#[derive(Copy, Clone)]</code>).</li>
          <li><code>Copy</code>가 아닌 타입: <code>String</code>, <code>Vec&lt;T&gt;</code>, <code>Box&lt;T&gt;</code>,
            <code>File</code>, 뮤텍스 등 힙/OS 자원을 소유하는 모든 타입.</li>
        </ul>

        <h3>따라하기</h3>
        <p>다음 코드를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.</p>
        <CodeBlock>{`fn main() {
    // 스택 타입(i32) — 복사(Copy)
    let x = 5;
    let y = x;  // x의 값이 복사됩니다
    println!("x = {}, y = {}", x, y); // 둘 다 사용 가능

    // 힙 타입(String) — 이동(Move)
    let s1 = String::from("hello");
    let s2 = s1;  // s1의 소유권이 s2로 이동합니다
    // println!("{}", s1); // ← 컴파일 에러! s1은 이미 이동됨
    println!("s2 = {}", s2);

    // 깊은 복사가 필요하면 clone()을 사용합니다
    let s3 = String::from("world");
    let s4 = s3.clone();
    println!("s3 = {}, s4 = {}", s3, s4); // 둘 다 사용 가능
}`}</CodeBlock>

        <p>위 코드에서 <code>let s2 = s1;</code> 이후 <code>s1</code>을 사용하려고 하면 컴파일 에러가 발생합니다. 실제로 주석을 풀어서 확인해 보세요.</p>

        <ErrorExplain
          header="error[E0382]: borrow of moved value"
          code={`error[E0382]: borrow of moved value: \`s1\`
 --> src/main.rs:9:20
  |
7 |     let s1 = String::from("hello");
  |         -- move occurs because \`s1\` has type \`String\`, which does not implement the \`Copy\` trait
8 |     let s2 = s1;
  |              -- value moved here
9 |     println!("{}", s1);
  |                    ^^ value borrowed here after move`}
        >
          <p>
            <strong>해석:</strong> <code>s1</code>의 소유권이 <code>s2</code>로 이동(move)했기 때문에,
            이후 <code>s1</code>을 다시 사용할 수 없습니다. <code>String</code>은 <code>Copy</code> 트레이트를
            구현하지 않으므로 대입은 복사가 아니라 이동입니다. <code>s1.clone()</code>으로 값을 복제하거나,
            참조(<code>&s1</code>)를 빌려주는 식으로 해결합니다.
          </p>
          <p>
            <strong>에러 메시지가 길어 보여도 무서워하지 마세요.</strong> rustc는 거의 항상 문제의 원인과 해결 방법까지 알려줍니다.
          </p>
        </ErrorExplain>

        <h3>함수와 소유권</h3>
        <p>함수에 값을 넘기면 소유권도 함께 이동합니다.</p>
        <CodeBlock>{`fn takes_ownership(s: String) {
    println!("{}", s);
} // 여기서 s가 drop됩니다

fn makes_copy(n: i32) {
    println!("{}", n);
} // i32는 Copy이므로 원래 값에 영향 없음

fn main() {
    let msg = String::from("hello");
    takes_ownership(msg);
    // println!("{}", msg); // 에러! msg의 소유권은 함수로 이동됨

    let num = 42;
    makes_copy(num);
    println!("{}", num); // OK — i32는 Copy 타입
}`}</CodeBlock>

        <Checklist
          items={[
            <>소유권 규칙 3가지를 자기 말로 설명할 수 있습니다.</>,
            <>이동(Move)과 복사(Copy)의 차이를 이해합니다.</>,
            <><code>clone()</code>이 언제 필요한지 알고 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch04-01-what-is-ownership.html", text: "Rust Book 한국어판 — 4.1 소유권이 뭔가요?" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="빌림(Borrowing)과 참조(Reference)">
        <Lede>소유권을 넘기지 않고 값을 사용하는 방법 — 참조로 빌려 쓰기.</Lede>

        <p>
          함수에 값을 넘길 때마다 소유권이 이동하면 불편합니다.
          <strong>참조(Reference)</strong>를 사용하면 소유권을 넘기지 않고 값을 <strong>빌림(Borrowing)</strong>할 수 있습니다.
          <code>&</code> 기호가 참조를 만듭니다.
        </p>

        <h3>불변 참조와 가변 참조</h3>
        <p>참조에는 두 종류가 있습니다.</p>
        <ul>
          <li><strong>불변 참조</strong> <code>&T</code> — 읽기만 가능. 동시에 여러 개 존재할 수 있습니다.</li>
          <li><strong>가변 참조</strong> <code>&mut T</code> — 읽기와 쓰기 모두 가능. 한 번에 하나만 존재할 수 있습니다.</li>
        </ul>

        <h3>배타성 규칙</h3>
        <p>Rust의 <strong>빌림 규칙</strong>은 데이터 레이스를 컴파일 타임에 방지합니다.</p>
        <ul>
          <li>불변 참조 여러 개 — OK</li>
          <li>가변 참조 하나 — OK</li>
          <li>불변 참조 + 가변 참조 동시 — 컴파일 에러</li>
        </ul>

        <h3>🆚 Java/C++에서는 왜 이게 안 될까?</h3>
        <p>
          "가변 참조는 한 번에 하나뿐"이라는 규칙이 처음엔 답답하게 느껴집니다.
          그러나 이 규칙을 강제하지 않는 언어에서 어떤 일이 벌어지는지 보면 Rust의 선택이 이해됩니다.
          "컬렉션을 순회하면서 수정하기" — 이 간단해 보이는 패턴이 세 언어에서 어떻게 실패하는지 비교해 봅시다.
        </p>
        <CodeTabs
          caption="컬렉션을 순회하면서 수정하기 — 언제 망가지나"
          tabs={[
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 컴파일은 되지만 런타임에 UB(Undefined Behavior)
std::vector<int> v = {1, 2, 3, 4};
auto it = v.begin();      // v에 대한 참조 (이터레이터)
v.push_back(5);           // v 수정 → 내부 버퍼가 재할당될 수 있음
std::cout << *it;         // 💥 이미 해제된 메모리를 읽음
                          //    — 무엇이 출력될지 아무도 모른다

// 컴파일러는 경고도 주지 않는다.
// "읽는 이터레이터"와 "쓰는 연산"의 공존을 검사할 장치가 없기 때문.`,
            },
            {
              label: "Java",
              lang: "java",
              code: `// Java — 컴파일은 되지만 런타임 예외
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4));
for (Integer n : list) {
    if (n == 2) list.remove(n);
    // 💥 ConcurrentModificationException (런타임)
}

// C++보다는 낫다 — 조용히 크래시하지는 않으니까.
// 그러나 여전히 "버그가 프로덕션에서 터진 뒤" 알게 된다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 같은 코드를 쓰려고 하면 컴파일부터 실패한다
let mut v = vec![1, 2, 3, 4];
let it = v.iter();   // &v (불변 빌림)
v.push(5);           // &mut v (가변 빌림) ← 컴파일 에러!
//   ^^^^^^^^^ cannot borrow \`v\` as mutable
//             because it is also borrowed as immutable
println!("{:?}", it);

// "데이터 레이스 방지"와 "반복자 무효화 방지"가 사실은
// 같은 규칙(공유 XOR 가변)의 다른 얼굴임을 Rust가 포착했다.
// → 프로덕션 버그 자체가 컴파일 단계에서 사라진다.`,
            },
          ]}
        />

        <Callout title="💡 핵심 통찰">
          "불변 참조 여럿 OR 가변 참조 하나"는 멀티스레드만의 규칙이 아닙니다.
          <strong>단일 스레드 프로그램</strong>에서도 반복자 무효화, use-after-free, 의도치 않은 별칭(aliasing) 버그를 동시에 막아 줍니다.
          그래서 Rust 책에서는 이 규칙을 "공유 XOR 가변(shared xor mutable)"이라고 부르기도 합니다.
        </Callout>

        <h3>따라하기</h3>
        <p>다음 코드로 참조와 빌림의 동작을 확인하세요.</p>
        <CodeBlock>{`fn calculate_length(s: &String) -> usize {
    s.len()
} // s는 참조이므로 drop되지 않습니다

fn add_world(s: &mut String) {
    s.push_str(", world!");
}

fn main() {
    let mut greeting = String::from("hello");

    // 불변 참조로 빌림
    let len = calculate_length(&greeting);
    println!("'{}'의 길이: {}", greeting, len);

    // 가변 참조로 빌림
    add_world(&mut greeting);
    println!("{}", greeting); // "hello, world!"
}`}</CodeBlock>

        <h3>댕글링 참조(Dangling Reference)</h3>
        <p>
          <strong>댕글링 참조</strong>란 이미 해제된 메모리를 가리키는 참조입니다.
          C/C++에서는 이런 참조가 허용되어 심각한 버그를 만들지만,
          Rust 컴파일러는 댕글링 참조를 만들 수 없도록 차단합니다.
        </p>

        <CodeTabs
          caption="지역 변수를 가리키는 참조 반환"
          tabs={[
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 이 코드는 컴파일된다. 경고조차 없을 수도 있다.
const std::string& dangle() {
    std::string s = "hello";
    return s;  // 지역 변수 s를 가리키는 참조 반환
}              // 함수 종료 → s는 해제됨

int main() {
    const std::string& ref = dangle();
    std::cout << ref; // 💥 use-after-free
                      //    "가끔 크래시 나는" 버그 리포트의 주범
}`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 같은 논리의 코드는 아예 컴파일되지 않는다.
fn dangle() -> &String {   // ← 라이프타임을 생략하면
    let s = String::from("hello");
    &s
}  // s는 여기서 drop. &s는 유효하지 않은 참조가 된다.

// error[E0106]: missing lifetime specifier
// help: this function's return type contains a borrowed value,
//       but there is no value for it to be borrowed from

// 해결책은 단 하나 — 소유권을 넘기는 것.
fn safe() -> String {
    String::from("hello")  // 값 자체를 반환 (move)
}`,
            },
          ]}
        />
        <p>
          C++ 컴파일러는 이 코드를 통과시키고, 프로덕션에 배포된 후에야 "가끔 크래시가 난다"는 버그 리포트로 돌아옵니다.
          Rust 컴파일러는 "이 참조가 어떤 값에서 빌려온 것인지" 추적할 수 없다고 거부합니다.
          해결책은 소유권을 넘기는 것뿐입니다 — Rust가 자연스럽게 올바른 설계로 유도하는 대표적인 예입니다.
        </p>

        <h3>슬라이스(Slice)</h3>
        <p>
          <strong>슬라이스(Slice)</strong>는 컬렉션의 일부를 참조하는 방법입니다.
          <code>&str</code>은 문자열 슬라이스, <code>&[i32]</code>는 정수 배열의 슬라이스입니다.
        </p>
        <CodeBlock>{`fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let sentence = String::from("hello world");
    let word = first_word(&sentence);
    println!("첫 단어: {}", word); // "hello"
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>&</code>(불변 참조)와 <code>&mut</code>(가변 참조)의 차이를 설명할 수 있습니다.</>,
            <>배타성 규칙(불변 참조 여러 개 OR 가변 참조 하나)을 이해합니다.</>,
            <>슬라이스(<code>&str</code>, <code>&[T]</code>)의 개념을 이해합니다.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch04-02-references-and-borrowing.html", text: "Rust Book 한국어판 — 4.2 참조와 빌림" },
            { href: "https://doc.rust-kr.org/ch04-03-slices.html", text: "Rust Book 한국어판 — 4.3 슬라이스" },
          ]}
        />
      </Module>

      {/* ===== M3 ===== */}
      <Module badge="M3" title="라이프타임(Lifetime)">
        <Lede>참조가 얼마나 오래 유효한지를 명시하는 방법 — 라이프타임 애노테이션.</Lede>

        <p>
          대부분의 경우 Rust 컴파일러가 참조의 유효 기간을 자동으로 추론합니다.
          하지만 함수가 여러 참조를 받아서 참조를 반환할 때, 컴파일러가 어떤 참조의 유효 기간을 따라야 하는지 모호해질 수 있습니다.
          이때 <strong>라이프타임(Lifetime)</strong> 애노테이션 <code>'a</code>를 사용해 관계를 명시합니다.
        </p>

        <p>
          "라이프타임"은 참조가 유효한 범위를 뜻합니다. "생명주기"라고 번역하기도 하지만,
          Rust 한국어 공식 문서에서는 <strong>라이프타임</strong>으로 표기합니다.
        </p>

        <h3>따라하기</h3>
        <p>다음 함수는 두 문자열 슬라이스 중 더 긴 것을 반환합니다. 라이프타임 애노테이션이 필요합니다.</p>
        <CodeBlock>{`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
        println!("더 긴 문자열: {}", result);
    }
    // 주의: string2가 스코프를 벗어났으므로
    // 여기서 result를 사용하면 에러가 날 수 있습니다.
}`}</CodeBlock>

        <p>
          <code>'a</code>는 "x와 y의 라이프타임 중 더 짧은 것"을 의미합니다.
          반환되는 참조는 이 더 짧은 라이프타임 동안만 유효합니다.
        </p>

        <h3>🆚 다른 언어에는 왜 라이프타임이 없을까?</h3>
        <p>
          처음 라이프타임을 보면 "왜 이런 희한한 문법이 필요하지?" 싶을 수 있습니다.
          이유는 다른 언어들이 <em>그 문제를 다른 비용을 지불해서 회피</em>하기 때문입니다.
        </p>
        <ul>
          <li>
            <strong>Java / C# / Python</strong> — 모든 객체가 힙에 있고 GC가 관리합니다.
            참조가 살아 있는 한 GC는 대상 객체를 해제하지 않으므로, "참조가 언제까지 유효한가"를 언어 차원에서 증명할 필요가 없습니다.
            대가로 GC 일시 정지, 힙 압박, 실행 시간 오버헤드가 있습니다.
          </li>
          <li>
            <strong>C / C++</strong> — 라이프타임을 언어가 추적하지 않습니다. 프로그래머가 머릿속으로 관리해야 합니다.
            대가는 위에서 본 dangling reference, use-after-free, iterator invalidation 같은 UB입니다.
          </li>
          <li>
            <strong>Rust</strong> — "참조가 가리키는 값보다 참조가 더 오래 살 수 없다"는 규칙을 컴파일러가 증명합니다.
            GC도 없고 UB도 없습니다. 대신 프로그래머가 가끔 <code>'a</code>라는 힌트를 써서 컴파일러의 증명을 돕습니다.
          </li>
        </ul>
        <p>
          즉 라이프타임 애노테이션은 <strong>"없는 기능"이 아니라 "숨겨져 있던 기능을 드러낸 것"</strong>입니다.
          다른 언어에서는 GC가 대신 처리하거나 프로그래머가 머릿속에 숨겨두던 것을, Rust는 타입 시스템에 명시합니다.
        </p>

        <h3>라이프타임 생략(Elision) 규칙</h3>
        <p>자주 나오는 패턴에서는 라이프타임을 생략할 수 있습니다. 컴파일러가 적용하는 규칙 3가지:</p>
        <ol>
          <li>각 참조 매개변수는 고유한 라이프타임을 받습니다.</li>
          <li>입력 라이프타임이 하나뿐이면, 출력 라이프타임도 그것과 같습니다.</li>
          <li>메서드에서 <code>&self</code> 또는 <code>&mut self</code>가 있으면, 출력 라이프타임은 <code>self</code>의 라이프타임과 같습니다.</li>
        </ol>
        <p>대부분의 함수에서 라이프타임을 직접 쓸 일은 드뭅니다. 컴파일러가 요구할 때만 추가하면 됩니다.</p>

        <h3>구조체에서의 라이프타임</h3>
        <p>구조체가 참조를 필드로 가질 때도 라이프타임을 명시해야 합니다.</p>
        <CodeBlock>{`struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let excerpt = ImportantExcerpt {
        part: first_sentence,
    };
    println!("발췌: {}", excerpt.part);
}`}</CodeBlock>

        <Checklist
          items={[
            <>라이프타임 애노테이션 <code>'a</code>가 왜 필요한지 설명할 수 있습니다.</>,
            <><code>longest</code> 함수의 라이프타임 의미를 이해합니다.</>,
            <>라이프타임 생략 규칙 3가지를 알고 있습니다.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch10-03-lifetime-syntax.html", text: "Rust Book 한국어판 — 10.3 라이프타임으로 참조 유효성 검증하기" },
          ]}
        />
      </Module>

      <Callout title="💡 다음 단계로 가기 전에">
        소유권 규칙 3가지를 종이에 직접 써보세요. "모든 값은 소유자가 하나, 동시에 하나, 스코프 끝에서 drop."
        이 세 줄이 Rust 메모리 관리의 전부입니다.
      </Callout>

      <PageNav prev={{ to: "/step/3" }} next={{ to: "/step/5" }} />
    </Layout>
  );
}
