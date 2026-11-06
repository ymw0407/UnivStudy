import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";
import { CodeTabs } from "../components/CodeTabs";
import { TranslationPendingBanner } from "../components/TranslationPendingBanner";

export function Step5Types() {
  return (
    <Layout
      kicker="Step 5 · 4월 21일"
      title="Structs · Enums · Pattern Matching · Traits"
      subtitle="Rust의 데이터 모델링과 인터페이스 추상화를 4개 모듈로 익힙니다"
    >
      <TranslationPendingBanner />
      <Lede>
        이 회차를 마치면 구조체와 열거형으로 데이터를 모델링하고,
        패턴 매칭으로 분기하고, 트레이트로 공통 행동을 추상화할 수 있게 됩니다.
      </Lede>

      {/* ===== M1: 구조체(Struct) ===== */}
      <Module badge="M1" title="구조체(Struct)">
        <Lede>여러 값을 하나의 이름 아래 묶어 의미 있는 데이터 단위를 만드는 방법을 배웁니다.</Lede>

        <p>
          프로그램이 커지면 관련 있는 값들을 하나로 묶어야 할 때가 옵니다.
          예를 들어 사용자 정보를 다룰 때 이름, 이메일, 활성 상태를 따로따로 변수로 관리하면 실수가 잦아집니다.
          <strong>구조체(Struct)</strong>는 이런 값들을 하나의 타입으로 묶어주는 Rust의 기본 데이터 구조입니다.
        </p>

        <h3>구조체 정의와 필드</h3>
        <p>
          <code>struct</code> 키워드 뒤에 이름을 쓰고, 중괄호 안에 필드 이름과 타입을 나열합니다.
        </p>
        <CodeBlock>{`struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}`}</CodeBlock>

        <h3>impl 블록: 메서드와 연관 함수</h3>
        <p>
          <strong>메서드(Method)</strong>는 구조체 인스턴스에 점(<code>.</code>)을 찍어 호출하는 함수입니다.
          첫 번째 매개변수가 <code>&self</code>(또는 <code>&mut self</code>, <code>self</code>)입니다.
          <strong>연관 함수(Associated Function)</strong>는 <code>self</code>를 받지 않고{" "}
          <code>타입이름::함수이름()</code> 형태로 호출합니다. 대표적인 예가 <code>Self::new</code> 패턴입니다.
        </p>

        <h3>구조체 갱신 문법</h3>
        <p>
          기존 인스턴스의 값을 대부분 유지하면서 일부만 바꿀 때 <code>..other</code> 문법을 사용합니다.
        </p>

        <h3>🆚 Rust의 struct는 Java의 class와 무엇이 다른가</h3>
        <p>
          겉보기에 <code>struct User</code>는 Java의 <code>class User</code>와 비슷해 보입니다.
          그러나 내부 모델은 전혀 다릅니다 — 이 차이를 모르고 Rust를 쓰면 "왜 안 되지?"가 끝없이 나옵니다.
        </p>
        <CodeBlock lang="java">{`// Java — class는 데이터 + 행동 + 상속 + 아이덴티티를 한 덩어리로 묶는다
class User {
    private String username;
    private String email;
    public User(String u, String e) { ... }
    public String summary() { ... }    // 메서드가 클래스 안에 있음
}

class AdminUser extends User { ... }  // 상속 가능`}</CodeBlock>
        <ul>
          <li>
            <strong>상속(inheritance)이 없다.</strong> Rust의 <code>struct</code>는 <code>extends</code>가 없습니다.
            "코드 재사용은 트레이트(trait)로, 데이터 재사용은 컴포지션(필드로 다른 struct를 가짐)으로" 하는 것이 Rust의 원칙입니다.
            Java가 20년간 겪은 "상속 지옥(fragile base class, 다중 상속 혼란)"을 처음부터 배제했습니다.
          </li>
          <li>
            <strong>데이터와 메서드가 분리</strong>되어 있습니다. <code>struct</code>는 데이터 레이아웃만,
            <code>impl</code> 블록이 행동을 정의합니다. 같은 타입에 여러 <code>impl</code> 블록을 만들 수도 있고,
            <strong>다른 파일에서</strong> 기존 타입에 메서드를 추가할 수도 있습니다(트레이트를 통해).
          </li>
          <li>
            <strong>아이덴티티가 없다.</strong> Java의 객체는 "이 객체가 같은 객체인가?"(<code>==</code> vs <code>.equals</code>)라는 개념이 있지만,
            Rust의 struct는 C 구조체처럼 <em>값</em>입니다. 같은 필드를 가지면 같은 값입니다.
            힙 할당도 기본이 아닙니다 — <code>let u = User {"{ .. }"};</code>는 스택에 생성되고, 힙이 필요하면 <code>Box&lt;User&gt;</code>를 씁니다.
          </li>
          <li>
            <strong>가시성은 필드 단위</strong>입니다. Java의 <code>private</code>/<code>public</code>과 달리,
            Rust는 필드마다 <code>pub</code>을 붙입니다. 기본값은 "같은 모듈 내부에서만 보임"입니다.
          </li>
        </ul>

        <h3>self, &self, &mut self의 의미</h3>
        <p>
          메서드 첫 인자가 왜 Java처럼 그냥 <code>this</code>가 아니라 <code>&self</code>, <code>&mut self</code>, <code>self</code> 중 하나인지는
          Step 4의 소유권과 직결됩니다.
        </p>
        <ul>
          <li><code>fn read(&self)</code> — 인스턴스를 <em>빌려서 읽기만</em>. 호출 후에도 인스턴스 사용 가능. Java의 일반 메서드와 가장 비슷.</li>
          <li><code>fn update(&mut self)</code> — 인스턴스를 <em>가변으로 빌려</em> 수정. 호출자 쪽 변수는 <code>let mut</code>여야 함.</li>
          <li><code>fn consume(self)</code> — 인스턴스의 <em>소유권을 가져감</em>. 호출 후 원본은 사용 불가. 빌더 패턴이나 파괴적 변환에 사용.</li>
        </ul>
        <p>
          Java에서는 "이 메서드가 객체 상태를 바꾸는가?"를 알려면 메서드 본문을 읽어 봐야 합니다.
          Rust는 시그니처만 봐도 알 수 있고, 컴파일러가 이를 강제합니다.
        </p>

        <h3>따라하기</h3>
        <p>
          아래 코드 전체를 <code>src/main.rs</code>에 저장하고 <code>cargo run</code>을 실행하세요.
          이 예제는 <code>cargo run</code>만으로 바로 실행할 수 있는 완전한 프로그램입니다.
        </p>
        <CodeBlock>{`struct User {
    username: String,
    email: String,
    active: bool,
    sign_in_count: u64,
}

impl User {
    // 연관 함수 — Self::new 패턴
    fn new(username: &str, email: &str) -> Self {
        Self {
            username: username.to_string(),
            email: email.to_string(),
            active: true,
            sign_in_count: 0,
        }
    }

    // 메서드 — &self를 받으므로 인스턴스에 점(.)을 찍어 호출
    fn summary(&self) -> String {
        format!("{} <{}> (로그인 {}회)", self.username, self.email, self.sign_in_count)
    }

    // &mut self를 받아 내부 상태를 변경하는 메서드
    fn login(&mut self) {
        self.sign_in_count += 1;
    }
}

fn main() {
    let mut user1 = User::new("ferris", "ferris@example.com");
    user1.login();
    user1.login();
    println!("user1: {}", user1.summary());

    // 구조체 갱신 문법 — user1의 나머지 필드를 재사용
    let user2 = User {
        username: String::from("crab"),
        ..user1
    };
    println!("user2: {}", user2.summary());
}`}</CodeBlock>
        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <Checklist
          items={[
            <><code>struct</code>로 필드를 가진 타입을 정의할 수 있다</>,
            <><code>impl</code> 블록 안에서 메서드(<code>&self</code>)와 연관 함수(<code>Self::new</code>)를 구분할 수 있다</>,
            <><code>..other</code> 갱신 문법으로 기존 인스턴스를 재활용할 수 있다</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch05-00-structs.html", text: "Rust Book 한국어판 — 5장 구조체" },
            { href: "https://doc.rust-kr.org/ch05-03-method-syntax.html", text: "Rust Book 한국어판 — 5.3 메서드 문법" },
          ]}
        />
      </Module>

      {/* ===== M2: 열거형(Enum)과 Option<T> ===== */}
      <Module badge="M2" title="열거형(Enum)과 Option<T>">
        <Lede>하나의 타입이 여러 가지 형태를 가질 수 있도록 열거형을 정의하고, null 없는 안전한 설계를 배웁니다.</Lede>

        <p>
          구조체가 "여러 필드를 하나로 묶는" 것이라면,{" "}
          <strong>열거형(Enum)</strong>은 "여러 가능한 형태 중 하나를 선택하는" 타입입니다.
          각 <strong>배리언트(Variant)</strong>에는 데이터를 첨부할 수 있어서,
          C 스타일의 단순 열거형보다 훨씬 표현력이 뛰어납니다.
        </p>

        <h3>열거형 정의</h3>
        <CodeBlock>{`enum Shape {
    Circle(f64),           // 반지름
    Rectangle(f64, f64),   // 가로, 세로
    Triangle { base: f64, height: f64 },  // 이름 있는 필드도 가능
}`}</CodeBlock>

        <h3>Option&lt;T&gt; — null 없는 설계 철학</h3>
        <p>
          Rust에는 <code>null</code>이 없습니다.
          대신 표준 라이브러리의 <strong>Option&lt;T&gt;</strong> 열거형이 "값이 있을 수도 없을 수도 있음"을 표현합니다.
        </p>
        <CodeBlock>{`enum Option<T> {
    Some(T),
    None,
}`}</CodeBlock>
        <p>
          <code>Some(T)</code>는 값이 있는 경우, <code>None</code>은 값이 없는 경우입니다.
          컴파일러가 <code>None</code> 케이스를 반드시 처리하도록 강제하기 때문에,
          다른 언어에서 흔한 "null 참조 에러"가 원천적으로 차단됩니다.
        </p>

        <h3>🆚 Java의 enum vs Rust의 enum — 완전히 다른 것</h3>
        <p>
          이름이 같아서 혼동하기 쉽지만, Java의 <code>enum</code>과 Rust의 <code>enum</code>은 표현력이 전혀 다릅니다.
        </p>
        <CodeTabs
          caption="Shape enum을 어떻게 표현할까"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — enum은 '이름 붙은 상수 집합'
enum ShapeKind {
    CIRCLE, RECTANGLE, TRIANGLE;
}

// 각 종류마다 다른 데이터를 붙이려면 별도 필드를 두거나...
class Shape {
    ShapeKind kind;
    double radius;    // CIRCLE일 때만 의미 있음
    double width;     // RECTANGLE일 때만 의미 있음
    double height;    // RECTANGLE/TRIANGLE일 때만 의미 있음
    double base;      // TRIANGLE일 때만 의미 있음
}
// → 어느 필드가 유효한지는 주석이나 암묵적 규약에 의존. 버그의 온상.

// Java 17+ sealed class를 써야 비로소 비슷한 표현이 가능해진다.
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double r) implements Shape {}
record Rectangle(double w, double h) implements Shape {}
record Triangle(double base, double height) implements Shape {}`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — enum은 처음부터 'Sum Type(합 타입)'
enum Shape {
    Circle(f64),                          // 반지름 하나
    Rectangle(f64, f64),                  // 두 개의 f64
    Triangle { base: f64, height: f64 },  // 이름 있는 필드
}

// 각 배리언트는 서로 다른 데이터를 가질 수 있고,
// 어떤 데이터가 있는지는 타입 자체로 명시된다.
// "CIRCLE인데 radius에 접근 안 했네?" 같은 실수가 불가능하다.`,
            },
          ]}
        />
        <p>
          Rust의 <code>enum</code>은 <strong>타입 이론에서 말하는 sum type</strong>입니다 —
          "이 값은 A이거나 B이거나 C인데, 각 경우마다 다른 데이터를 가질 수 있다"를 한 타입으로 표현합니다.
          Java에서 같은 일을 하려면 추상 클래스 + 여러 서브클래스 + <code>instanceof</code> 체크 또는
          Java 17의 sealed class + pattern matching을 써야 하는데, Rust는 이걸 언어의 1급 기능으로 만들었습니다.
        </p>

        <h3>🆚 왜 Rust에는 null이 없을까? — 10억 달러짜리 실수</h3>
        <p>
          null 참조를 만든 Tony Hoare는 이것을 "10억 달러짜리 실수(The Billion Dollar Mistake)"라고 공개 사과했습니다.
          null은 거의 모든 언어에서 "모든 참조 타입에 몰래 끼어드는 특별한 값"이기 때문입니다.
        </p>
        <CodeTabs
          caption="값이 없을 수도 있는 경우를 어떻게 표현할까"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 모든 객체 타입에 null이 숨어 있다
String name = getName(); // null을 반환할 수도 있음 (시그니처엔 표시 없음)
int len = name.length(); // 💥 NullPointerException (런타임)

// 시그니처만 봐서는 null 여부를 알 수 없다.
// @Nullable 어노테이션이 있긴 하지만 '약속'일 뿐 컴파일러는 강제하지 않는다.
// Optional<String>을 쓸 수 있지만, 일반 참조 옆에 공존하므로 null은 여전히 남는다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — null 없음. "없을 수도 있다"는 것은 타입에 드러난다
fn get_name() -> Option<String> { None } // 시그니처가 말해준다

let name = get_name();
// let len = name.len();   // ← 컴파일 에러: Option에는 len() 없음
//                            "먼저 꺼내라"고 강제된다

match name {
    Some(n) => println!("{}", n.len()), // 여기서만 n은 String
    None    => println!("이름 없음"),
}
// 또는 단축 문법
let len = name.map(|n| n.len()).unwrap_or(0);`,
            },
          ]}
        />
        <p>
          핵심은 "null 체크를 빼먹을 수 없다"는 점입니다.
          Rust 컴파일러는 <code>Option&lt;T&gt;</code>에서 <code>T</code>를 꺼내기 전까지는 아예 사용할 수 없게 막습니다.
          Java 8의 <code>Optional&lt;T&gt;</code>도 비슷한 아이디어지만, <em>일반 참조 옆에 공존</em>하므로 null은 여전히 남아 있습니다.
          Rust는 null이라는 개념 자체가 언어에 없어서, "Optional을 쓸지 말지" 선택의 여지조차 없습니다.
        </p>

        <Callout title="💡 그런데 ?. 같은 널 안전 문법은?">
          Kotlin/Swift의 <code>?.</code>, <code>?:</code>, Optional의 <code>.map/.flatMap</code> 같은 연산자들은
          Rust에서도 대부분 대응물이 있습니다 — <code>Option::map</code>, <code>Option::and_then</code>, <code>unwrap_or</code>,
          그리고 이후 Step 7에서 배울 <code>?</code> 연산자입니다.
          다른 점은, Rust에서는 이것들이 <em>특수 문법</em>이 아니라 <em>일반 메서드</em>라는 것입니다.
        </Callout>

        <h3>따라하기</h3>
        <CodeBlock>{`fn find_user(id: u32) -> Option<String> {
    if id == 1 {
        Some(String::from("ferris"))
    } else {
        None
    }
}

fn main() {
    let result = find_user(1);
    match result {
        Some(name) => println!("찾았습니다: {}", name),
        None       => println!("사용자를 찾을 수 없습니다"),
    }

    let missing = find_user(99);
    // unwrap_or: None이면 기본값을 사용
    let name = missing.unwrap_or(String::from("익명"));
    println!("결과: {}", name);
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>enum</code>의 각 배리언트에 서로 다른 데이터를 첨부할 수 있다</>,
            <><code>Option&lt;T&gt;</code>가 <code>Some(T)</code>과 <code>None</code>으로 구성된다는 것을 이해했다</>,
            <>Rust에 <code>null</code>이 없는 이유를 설명할 수 있다</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch06-01-defining-an-enum.html", text: "Rust Book 한국어판 — 6.1 열거형 정의하기" },
          ]}
        />
      </Module>

      {/* ===== M3: 패턴 매칭(Pattern Matching) ===== */}
      <Module badge="M3" title="패턴 매칭(Pattern Matching)">
        <Lede>match 표현식으로 열거형의 모든 경우를 빠짐없이 처리하고, if let으로 간결하게 분기합니다.</Lede>

        <p>
          열거형을 정의했으면 각 배리언트별로 다른 동작을 수행해야 합니다.{" "}
          <strong>패턴 매칭(Pattern Matching)</strong>은 값의 구조를 분해하면서 동시에 분기하는 Rust의 핵심 제어 흐름입니다.
        </p>

        <h3>match — Exhaustiveness(완전 검사)</h3>
        <p>
          <code>match</code> 표현식은 가능한 모든 경우를 처리해야 합니다.
          하나라도 빠뜨리면 컴파일러가 에러를 발생시킵니다.
          이 성질을 <strong>exhaustiveness</strong>(완전 검사)라고 합니다.
        </p>

        <h3>🆚 Java의 switch vs Rust의 match — 왜 match가 더 안전한가</h3>
        <CodeTabs
          caption="enum 배리언트를 빠뜨렸을 때"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — switch는 누락을 허용한다 (버그의 원천)
double area(Shape shape) {
    switch (shape.kind) {
        case CIRCLE:    return Math.PI * shape.r * shape.r;
        case RECTANGLE: return shape.w * shape.h;
        // TRIANGLE을 깜빡함!
        // → default가 없으면 0.0 반환. 컴파일러는 말해주지 않는다.
    }
    return 0.0;
}

// 나중에 Pentagon 배리언트를 추가하면?
// 이 switch는 조용히 통과되고, 모든 호출자가 0.0을 돌려받는다.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — match는 모든 배리언트를 반드시 처리해야 한다
fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r)       => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h) => w * h,
        // Triangle을 빠뜨리면 ↓ 컴파일 에러
        // error[E0004]: non-exhaustive patterns:
        //               \`&Triangle { .. }\` not covered
    }
}

// 나중에 Pentagon 배리언트를 추가하면?
// 이 enum을 다루는 모든 match가 즉시 컴파일 에러를 낸다.
// 컴파일러가 수정할 곳을 친절하게 알려준다.`,
            },
          ]}
        />
        <p>
          이 차이는 실무에서 <strong>가장 강력한 안전망 중 하나</strong>입니다.
          enum에 새 배리언트(<code>Pentagon</code>)를 추가했다고 상상해 보세요.
          Java에서는 컴파일러가 조용히 통과시키고, <code>switch</code>를 사용하는 모든 코드가 "잘못된 기본값"을 반환하게 됩니다.
          Rust에서는 <em>해당 enum을 다루는 모든 <code>match</code>가 즉시 컴파일 에러를 냅니다</em>.
          어느 코드를 고쳐야 하는지 컴파일러가 목록으로 알려줍니다.
        </p>
        <p>
          게다가 Rust의 패턴은 단순한 값 비교가 아니라 <strong>구조 분해</strong>를 겸합니다 —
          <code>Shape::Circle(r)</code>라고 쓰는 순간 <code>r</code>이 바로 바인딩됩니다.
          Java 17의 pattern matching for switch가 비슷한 기능을 가져왔지만, Rust는 2015년부터 1급 기능이었습니다.
        </p>

        <h3>가드(Guard), 범위 패턴, 바인딩</h3>
        <CodeBlock>{`match value {
    0 => "영",
    1..=9 => "한 자리",          // 범위 패턴
    n if n < 0 => "음수",        // 가드: 조건부 분기
    n @ 10..=99 => "두 자리",     // @ 바인딩 + 범위
    _ => "많음",
}`}</CodeBlock>
        <p>
          Java의 <code>switch</code>에는 가드가 제한적이고, 범위를 한 번에 쓰는 문법도 없습니다.
          Rust는 <code>match</code>를 "제어 흐름 + 구조 분해 + exhaustiveness"를 한번에 하는 도구로 만들었습니다.
        </p>

        <h3>if let / while let — 간단한 분기</h3>
        <p>
          하나의 패턴만 검사하고 나머지는 무시할 때는 <code>if let</code>이 편리합니다.{" "}
          <code>while let</code>은 패턴이 매칭되는 동안 반복합니다.
        </p>

        <h3>구조 분해(Destructuring)</h3>
        <p>
          <strong>구조 분해(Destructuring)</strong>는 구조체, 열거형, 튜플 등의 내부 값을 꺼내어 변수에 바인딩하는 기법입니다.{" "}
          <code>match</code> 팔(arm) 안에서 자연스럽게 사용됩니다.
        </p>

        <h3>따라하기</h3>
        <CodeBlock>{`enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle(r)          => std::f64::consts::PI * r * r,
        Shape::Rectangle(w, h)    => w * h,
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle(3.0),
        Shape::Rectangle(4.0, 5.0),
        Shape::Circle(1.5),
    ];

    for s in &shapes {
        println!("넓이: {:.2}", area(s));
    }

    // if let — Circle일 때만 반지름 출력
    let my_shape = Shape::Circle(2.5);
    if let Shape::Circle(radius) = &my_shape {
        println!("원의 반지름: {}", radius);
    }

    // 구조 분해 — 튜플
    let (x, y) = (10, 20);
    println!("x={}, y={}", x, y);
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>match</code>가 모든 경우를 처리해야 한다는 exhaustiveness를 이해했다</>,
            <><code>if let</code>으로 하나의 패턴만 간결하게 검사할 수 있다</>,
            <>구조 분해로 열거형이나 튜플의 내부 값을 꺼낼 수 있다</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch06-02-match.html", text: "Rust Book 한국어판 — 6.2 match 제어 흐름" },
            { href: "https://doc.rust-kr.org/ch06-03-if-let.html", text: "Rust Book 한국어판 — 6.3 if let을 사용한 간결한 제어 흐름" },
            { href: "https://doc.rust-kr.org/ch18-00-patterns.html", text: "Rust Book 한국어판 — 18장 패턴과 매칭" },
          ]}
        />
      </Module>

      {/* ===== M4: 트레이트(Trait) ===== */}
      <Module badge="M4" title="트레이트(Trait)">
        <Lede>트레이트로 공통 행동을 정의하고, 서로 다른 타입이 같은 인터페이스를 공유하도록 만듭니다.</Lede>

        <p>
          구조체와 열거형이 "데이터를 어떻게 구성할까"에 대한 답이라면,{" "}
          <strong>트레이트(Trait)</strong>는 "타입이 어떤 행동을 할 수 있는가"를 정의하는 도구입니다.
          다른 언어의 인터페이스(interface)와 비슷하지만,
          기본 구현을 제공할 수 있고, 기존 타입에도 트레이트를 구현할 수 있다는 점이 다릅니다.
        </p>

        <h3>트레이트 정의와 구현</h3>
        <p>
          <code>trait</code> 키워드로 메서드 시그니처를 선언합니다.
          각 타입은 <code>impl 트레이트 for 타입</code> 블록에서 메서드를 구현합니다.
        </p>

        <h3>기본 구현(Default Implementation)</h3>
        <p>
          <strong>기본 구현(Default Implementation)</strong>은 트레이트 정의 안에서 메서드 본문을 미리 작성하는 것입니다.
          구현 타입이 해당 메서드를 재정의하지 않으면 기본 구현이 사용됩니다.
        </p>

        <h3>트레이트 객체(dyn Trait) — 동적 디스패치</h3>
        <p>
          <strong>트레이트 객체(dyn Trait)</strong>를 사용하면
          서로 다른 타입의 값을 하나의 컬렉션에 담거나, 함수의 반환 타입을 추상화할 수 있습니다.
          이때 메서드 호출은 런타임에 결정되며, 이를 <strong>동적 디스패치(Dynamic Dispatch)</strong>라고 합니다.
        </p>

        <h3>🆚 Java interface와 Rust trait, 세 가지 결정적 차이</h3>
        <p>
          "트레이트는 인터페이스와 비슷하다"는 말은 절반만 맞습니다. 실무에서 가장 크게 체감되는 차이 세 가지를 짚어봅니다.
        </p>

        <p><strong>① 기존 타입에 나중에 구현을 추가할 수 있다 (Orphan Rule)</strong></p>
        <CodeTabs
          caption="표준 타입(String)에 내 인터페이스/트레이트를 구현할 수 있는가"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 불가능.
interface Greet {
    String greet();
}

// String은 표준 라이브러리 클래스다. 소스를 수정할 수 없으므로
// String이 Greet를 구현하도록 만들 방법이 없다.

// 우회책: 어댑터 클래스
class GreetableString implements Greet {
    private final String s;
    public GreetableString(String s) { this.s = s; }
    public String greet() { return "Hello, " + s + "!"; }
}
// 원본 String을 쓰는 코드와 섞이지 않는다. 불편함의 연속.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 가능. '확장 트레이트(extension trait)' 패턴.
trait Greet {
    fn greet(&self) -> String;
}

impl Greet for String {    // ← 표준 타입 + 내 trait = OK
    fn greet(&self) -> String {
        format!("Hello, {}!", self)
    }
}

fn main() {
    let name = String::from("Alice");
    println!("{}", name.greet());  // "Hello, Alice!"
}

// 단, 'orphan rule': 트레이트와 타입 중 최소 하나는 내 크레이트 것이어야 한다.
// (남의 trait를 남의 type에 구현하면 크레이트끼리 충돌하니까)`,
            },
          ]}
        />
        <p>
          이 기능을 <strong>확장 트레이트(extension trait)</strong> 패턴이라고 합니다.
          단 충돌을 막기 위한 <strong>orphan rule</strong>(고아 규칙)이 있습니다 — "트레이트 또는 타입 중 최소 하나는 내 크레이트 것이어야 한다."
          남의 트레이트를 남의 타입에 구현할 수는 없습니다(그렇게 하면 두 크레이트가 서로 충돌할 수 있으니까).
        </p>

        <p><strong>② 상속이 없다 — 컴포지션과 트레이트 바운드로 대체</strong></p>
        <p>
          Java/C++의 클래스 상속은 "데이터 + 동작 + 타입 관계"를 한 번에 묶어서, 나중에 풀기 어려운 의존성을 만들어냅니다.
          Rust는 상속을 제공하지 않고 두 도구로 대체합니다 —
          <strong>데이터 재사용은 필드 컴포지션</strong>으로, <strong>다형성은 트레이트</strong>로.
        </p>

        <p><strong>③ 제네릭 monomorphization vs vtable(가상 함수 테이블) — 성능 모델이 다르다</strong></p>
        <CodeBlock>{`// 정적 디스패치 (monomorphization) — impl Trait 또는 제네릭
fn print_one<T: Animal>(a: &T) {
    println!("{}", a.introduce());  // 컴파일러가 T마다 전용 코드 생성
}
// → vtable 없음, 인라인 가능, 최대 성능. 대신 바이너리 크기가 커짐.

// 동적 디스패치 — &dyn Trait
fn print_many(animals: &[&dyn Animal]) {
    for a in animals {
        println!("{}", a.introduce());  // vtable 조회 → 런타임에 메서드 결정
    }
}
// → Java 인터페이스 메서드 호출과 같은 모델. 유연하지만 인라인 불가.`}</CodeBlock>
        <p>
          Java는 기본이 항상 동적 디스패치입니다(<code>final</code>이나 JIT가 역최적화하지 않는 한).
          C++은 <code>virtual</code>을 쓴 함수만 vtable을 거칩니다.
          Rust는 <strong>당신이 선택</strong>합니다 — <code>T: Trait</code>은 정적, <code>dyn Trait</code>은 동적.
          "zero-cost abstraction"이라는 슬로건은 이 선택권에서 나옵니다.
          기본적으로는 정적 디스패치를 쓰되, 이기종 컬렉션이 정말로 필요할 때만 <code>dyn</code>을 쓰는 게 관용적입니다.
        </p>

        <Callout title="💡 왜 &dyn Trait는 '두 개의 포인터'인가">
          <code>&dyn Trait</code>는 내부적으로 <em>데이터 포인터 + vtable 포인터</em>의 쌍(일명 fat pointer)입니다.
          그래서 <code>Box&lt;dyn Trait&gt;</code>의 크기는 일반 포인터의 두 배입니다.
          C++의 <code>virtual</code> 테이블이 객체 안에 숨어있는 것과 대비됩니다 —
          Rust는 트레이트 객체 '쪽'에 vtable을 붙여서, 원본 타입은 순수한 데이터로 유지합니다.
        </Callout>

        <h3>따라하기</h3>
        <CodeBlock>{`trait Animal {
    fn name(&self) -> &str;
    fn sound(&self) -> &str;

    // 기본 구현 — 재정의하지 않으면 이 버전이 사용됨
    fn introduce(&self) -> String {
        format!("저는 {}이고, {}라고 울어요.", self.name(), self.sound())
    }
}

struct Dog {
    name: String,
}

impl Animal for Dog {
    fn name(&self) -> &str {
        &self.name
    }
    fn sound(&self) -> &str {
        "멍멍"
    }
}

struct Cat {
    name: String,
}

impl Animal for Cat {
    fn name(&self) -> &str {
        &self.name
    }
    fn sound(&self) -> &str {
        "야옹"
    }
    // introduce()는 기본 구현을 그대로 사용
}

// 트레이트 객체(dyn Trait)를 사용한 동적 디스패치
fn print_all(animals: &[&dyn Animal]) {
    for animal in animals {
        println!("{}", animal.introduce());
    }
}

fn main() {
    let dog = Dog { name: String::from("바둑이") };
    let cat = Cat { name: String::from("나비") };

    // 트레이트 객체로 서로 다른 타입을 하나의 슬라이스에 담기
    let animals: Vec<&dyn Animal> = vec![&dog, &cat];
    print_all(&animals);
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>trait</code>로 공통 메서드 시그니처를 정의할 수 있다</>,
            <>기본 구현이 무엇인지 이해하고, 필요할 때 재정의할 수 있다</>,
            <><code>dyn Trait</code>를 사용하여 서로 다른 타입을 하나의 컬렉션에 담을 수 있다</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-kr.org/ch10-02-traits.html", text: "Rust Book 한국어판 — 10.2 트레이트: 공유 행위를 정의하기" },
            { href: "https://doc.rust-kr.org/ch17-02-trait-objects.html", text: "Rust Book 한국어판 — 17.2 트레이트 객체를 사용하여 다른 타입의 값 허용하기" },
          ]}
        />
      </Module>

      <Callout title="💡 다음 단계로 가기 전에">
        구조체로 데이터를 묶고, 열거형으로 여러 형태를 표현하고, match로 빠짐없이 처리하고,
        트레이트로 공통 행동을 추상화하는 흐름이 자연스럽게 느껴진다면 충분합니다.
        다음 Step 7에서는 제네릭, 에러 처리, 클로저, 반복자를 다룹니다.
      </Callout>

      <PageNav prev={{ to: "/step/4" }} next={{ to: "/step/7" }} />
    </Layout>
  );
}
