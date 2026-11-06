import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";
import { CodeTabs } from "../components/CodeTabs";

export function Step3BasicsEn() {
  return (
    <Layout
      kicker="Step 3 · Apr 14"
      title="Variables · Types · Control flow · Functions"
      subtitle="Four modules of Rust basics — from immutability to cargo test"
    >
      <Lede>
        By the end of this session you'll be able to declare variables, use data types,
        write conditionals and loops, and write your own functions in Rust. Every example
        is runnable with <code>cargo run</code>.
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="🔒 Immutability · mut · const · Shadowing">
        <Lede>Rust variables can't be changed by default. That one rule quietly prevents a lot of bugs.</Lede>

        <p>
          In most languages, variables can be reassigned freely. Rust is the opposite. A
          variable declared with <code>let</code> is <strong>immutable</strong> by default,
          and you have to say <code>let mut</code> if you want to change its value later.
          That turns "wait, could this variable change somewhere?" into a non-question.
        </p>
        <p>
          <strong><code>const</code></strong> looks similar to <code>let</code>, but it
          always requires an explicit type and the value has to be known at compile time.
          Use it for things that never change for the entire program (max score, π, etc.).
          {" "}<strong>Shadowing</strong> is re-declaring the same name with another{" "}
          <code>let</code>. Unlike <code>mut</code>, shadowing can even change the type.
        </p>

        <h3>🆚 Java/C++ default to mutable, Rust defaults to immutable — why flip it?</h3>
        <p>
          Java, C++, Python and JavaScript all give you mutable-by-default variables. If
          you want something immutable, you add an extra keyword (<code>final</code>,{" "}
          <code>const</code>). Click through the tabs below to see how the three languages
          differ.
        </p>
        <CodeTabs
          caption="The same task in three languages — mutable vs immutable"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — mutable by default
int count = 0;
count = 10;             // OK (default)

final int MAX = 100;    // Add 'final' to make it immutable
// MAX = 200;           // compile error`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — mutable by default, const is opt-in
int count = 0;
count = 10;             // OK (default)

const int MAX = 100;    // Add 'const' to make it immutable
// MAX = 200;           // compile error`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — immutable by default, mutable is opt-in
let count = 0;
// count = 10;          // ← compile error! cannot assign twice to immutable variable

let mut counter = 0;    // Add 'mut' to allow reassignment
counter = 10;           // OK`,
            },
          ]}
        />
        <p>
          It sounds like a tiny thing, but it stacks up on real code. In Java, "I forgot
          to mark it <code>final</code>" is a very common source of bugs where a variable
          gets clobbered somewhere downstream. In Rust the situation is flipped — only{" "}
          <code>mut</code> variables need suspicion, so <strong>"where does this variable
          change?" stops being a question you have to ask while reading code.</strong>{" "}
          Flipping the default to the safe side is a small but important design decision.
        </p>

        <h3>let · let mut · const — three different things</h3>
        <ul>
          <li><code>let x = 5;</code> — a value determined at runtime, can't be reassigned. Lives in its scope.</li>
          <li><code>let mut x = 5;</code> — a runtime value that can be reassigned.</li>
          <li><code>const MAX: u32 = 100;</code> — a compile-time constant. Type required, only expressions allowed, program-wide. Close to Java's <code>static final</code> and C++'s <code>constexpr</code>.</li>
        </ul>

        <h3>🧱 When to use const — "places that need a value at compile time"</h3>
        <p>
          Treating <code>const</code> as "just a global constant" only tells half the
          story. In Rust, the real job of <code>const</code> is{" "}
          <strong>supplying values to spots where the type system demands a number at
          compile time</strong>. There are four places you'll meet constantly.
        </p>

        <p><strong>① Array length — the <code>N</code> in <code>[T; N]</code> must be a const</strong></p>
        <CodeBlock>{`const BUFFER_SIZE: usize = 1024;

// The length of an array has to be fixed at compile time.
let buffer: [u8; BUFFER_SIZE] = [0; BUFFER_SIZE];

// let n = 1024;
// let buffer: [u8; n] = [0; n];
// ← Error! "attempt to use a non-constant value in a constant"
//   A regular let variable (runtime value) can't be used as array length.`}</CodeBlock>

        <p>
          This feels a bit odd the first time. "Why do I need a const just to set an
          array length?" The key is that in Rust,{" "}
          <strong>the length of an array isn't a <em>value</em>, it's <em>part of the
          type</em></strong>. Let's walk through it in three steps.
        </p>

        <p><strong>Step 1 — arrays of different lengths are "different types"</strong></p>
        <CodeBlock>{`let a: [i32; 3] = [1, 2, 3];
let b: [i32; 5] = [1, 2, 3, 4, 5];

// a and b are both 'i32 arrays' but they are 'different types'.
// This code produces a compile error:
let mut x: [i32; 3] = a;
// x = b;
// ^^^^ expected an array with a fixed size of 3 elements,
//      found one with 5 elements

fn print_three(arr: [i32; 3]) { println!("{:?}", arr); }

print_three(a);   // OK
// print_three(b); // Error! expects a 3-element array, given a 5-element one`}</CodeBlock>
        <p>
          In other words, <code>[i32; 3]</code> and <code>[i32; 5]</code> are as different
          as <code>i32</code> and <code>f64</code>. The number 3 is literally baked into
          the type name.
        </p>

        <p><strong>Step 2 — the compiler has to know the size of each variable in advance</strong></p>
        <p>
          When the Rust compiler translates a function into machine code, it reserves{" "}
          <em>upfront</em> how much room each variable will take. <code>i32</code> is
          4 bytes, <code>bool</code> is 1 byte, <code>[i32; 3]</code> is 12 bytes (4×3),{" "}
          <code>[i32; 5]</code> is 20 bytes (4×5), and so on. Only after that calculation
          finishes can the compiler decide "this function needs this much stack space"
          and emit the machine code.
        </p>
        <CodeBlock>{`fn main() {
    let x: [i32; 3] = [1, 2, 3];   // compiler: "x needs a 12-byte slot"
    let y: [i32; 5] = [1; 5];      // "y needs a 20-byte slot"
    // ...
}
// When the compiler generates machine code it already knows
// "x is 12 bytes, y is 20 bytes" — so the needed space can be
// reserved the moment the function starts executing.`}</CodeBlock>
        <p>
          Now the problem. If <code>n</code> in <code>[u8; n]</code> is{" "}
          <em>determined at runtime</em>, the compiler has no way to know how many bytes
          this variable occupies while it's generating machine code. A size that depends
          on execution is, by definition, unknown at compile time. So Rust just draws a
          hard line — "the length of an array must be known at compile time."{" "}
          <code>const</code>, literal numbers, and the results of{" "}
          <code>const fn</code> calls all count as "things the compiler can compute right
          now." Regular <code>let</code> variables don't, because their values aren't
          known until the program runs.
        </p>

        <p><strong>Step 3 — "What if I need an array whose size is decided at runtime?" → <code>Vec&lt;T&gt;</code></strong></p>
        <CodeBlock>{`fn main() {
    // Size determined at runtime, e.g. from user input
    let n: usize = read_size_from_user();

    // let buf: [u8; n] = [0; n];   // ← not allowed
    // Use Vec instead — its length is not part of the type
    let buf: Vec<u8> = vec![0; n];  // OK — allocates n bytes on the heap
    println!("size: {}", buf.len());
}

fn read_size_from_user() -> usize { 1024 }`}</CodeBlock>
        <p>
          <code>Vec&lt;T&gt;</code> doesn't carry its length in its type.{" "}
          <code>Vec&lt;u8&gt;</code> is the same type no matter how many bytes it holds.
          The length lives inside the value (as a field of the heap buffer) and is
          checked at runtime. The rule of thumb is{" "}
          <strong>"Do I need a fixed size known at compile time? → array{" "}
          <code>[T; N]</code>. Otherwise → <code>Vec&lt;T&gt;</code>."</strong>{" "}
          (We'll dig into <code>Vec</code>'s internals in Step 4 alongside ownership and
          the heap — for now, "runtime-sized array alternative" is all you need.)
        </p>

        <Callout title="💡 This is where the biggest difference from Java comes in">
          The reason <code>new int[n]</code> works so freely in Java is that every Java
          array is <em>always</em> a heap object, and its size sits in a field of the
          object header. So a Java array is much closer to Rust's <code>Vec</code>.
          Rust's <code>[T; N]</code> is more like C's <code>int arr[3];</code> — a
          low-level "this variable itself is a 12-byte contiguous region." That's why
          Rust separates the two clearly: fixed size → array, runtime size →{" "}
          <code>Vec</code>.
        </Callout>

        <p><strong>② const generics — numbers as type parameters</strong></p>
        <CodeBlock>{`// A matrix whose size is part of its type — N is a compile-time constant
struct Matrix<const ROWS: usize, const COLS: usize> {
    data: [[f64; COLS]; ROWS],
}

impl<const R: usize, const C: usize> Matrix<R, C> {
    fn new() -> Self {
        Self { data: [[0.0; C]; R] }
    }
    fn shape(&self) -> (usize, usize) { (R, C) }
}

fn main() {
    let m: Matrix<3, 4> = Matrix::new();      // 3x4 — the size is baked into the type
    let n: Matrix<2, 2> = Matrix::new();      // 2x2 — a different type!

    // This lets the compiler catch wrong multiplications as TYPE errors:
    // fn mul<const A: usize, const B: usize, const D: usize>(
    //     x: Matrix<A, B>, y: Matrix<B, D>
    // ) -> Matrix<A, D> { ... }
    // Matrix<3, 4> * Matrix<5, 2> ← compile error: B doesn't match
}`}</CodeBlock>
        <p>
          <strong>const generics</strong>, stabilized in Rust 1.51 (2021), let you pass{" "}
          <em>numbers</em> as generic arguments the same way you pass types. You can bake
          array sizes, bit widths, SIMD lane counts and the like into the type, which
          means <strong>"you can't multiply a 3x4 by a 5x2" becomes a compile-time
          proof</strong>. This plays the same role as C++'s{" "}
          <code>template&lt;std::size_t N&gt;</code>.
        </p>

        <p><strong>③ <code>const fn</code> — functions evaluated at compile time</strong></p>
        <CodeBlock>{`// A const fn is a function that can be called in const contexts
const fn square(x: usize) -> usize {
    x * x
}

// Usable both as a const and as an array length
const AREA: usize = square(16);         // evaluated at compile time to 256
let grid: [u8; square(8)] = [0; square(8)]; // [u8; 64]

// Of course you can also call it with regular runtime values
fn main() {
    let side = 5;
    println!("{}", square(side));       // runtime call is fine too — 25
}`}</CodeBlock>
        <p>
          The point is: only functions declared <code>const fn</code> can be called from
          a const context. A "const context" includes the right-hand side of a{" "}
          <code>const BUFFER_SIZE: usize = ...</code>, the <code>N</code> in{" "}
          <code>[T; N]</code>, and const-generic arguments. The standard library
          increasingly offers <code>const fn</code> methods like{" "}
          <code>u32::from_be_bytes</code>, <code>usize::pow</code>, and{" "}
          <code>Option::is_some</code> so the idiom "don't hand-calculate magic numbers —
          compute them from code and keep them as constants" becomes easy to follow.
        </p>
        <Callout title="🧠 The const fn restriction — it has to be pure">
          The body of a <code>const fn</code> has to be deterministic. No heap allocation,
          no I/O, no randomness, no threads, no touching mutable statics — nothing that
          interacts with the outside world. That's because the compiler has to be able to
          execute the function directly. Each Rust release keeps expanding what{" "}
          <code>const fn</code> allows, so some operations that used to be forbidden now
          work.
        </Callout>

        <p><strong>④ match patterns, attribute arguments, array initialization, ...</strong></p>
        <CodeBlock>{`const OK: u32 = 200;
const NOT_FOUND: u32 = 404;

fn classify(status: u32) {
    match status {
        OK        => println!("ok"),     // a const used as a pattern — behaves like a literal
        NOT_FOUND => println!("missing"),
        _         => println!("other {status}"),
    }
}

// Numeric attribute arguments like #[repr(align(N))], #[repr(C)],
// the [0u8; const expr] array init form, static array initialization —
// all of these are const contexts.`}</CodeBlock>

        <h3>🆚 What sits in the same slot in C/C++/Java?</h3>
        <CodeTabs
          caption="Array sizes and compile-time functions"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — the concept of a 'compile-time constant' is very limited
public static final int BUFFER_SIZE = 1024; // only a real compile-time constant for primitives/String

// Array lengths can even be runtime values — they're allocated dynamically on the JVM heap
byte[] buffer = new byte[BUFFER_SIZE];
int n = readFromConfig();
byte[] dyn = new byte[n];                   // OK — no need to be a compile-time constant

// There is no 'compile-time function'. If you need a complex constant,
// you initialize it in a static block or generate it via an external build script.
static final int AREA;
static { AREA = computeAtClassLoad(); }     // runs at class-load time (still runtime)`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — the closest thing to Rust's const is constexpr
constexpr std::size_t BUFFER_SIZE = 1024;

// C-style stack arrays must use a constant expression as length
std::uint8_t buffer[BUFFER_SIZE] = {};
// int n = read();
// std::uint8_t dyn[n];  // non-standard VLA. Standard C++ won't accept it.
// → Use std::vector<uint8_t>(n) for runtime-sized arrays (same role as Rust's Vec).

// Non-type template parameters
template <std::size_t R, std::size_t C>
struct Matrix { std::array<std::array<double, C>, R> data{}; };
// ↑ essentially the same feature as Rust's const generics

// constexpr functions — introduced in C++11, capabilities expanded every version
constexpr std::size_t square(std::size_t x) { return x * x; }
constexpr auto AREA = square(16);      // 256 — computed at compile time`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — const fits cleanly into every one of these slots
const BUFFER_SIZE: usize = 1024;

let buffer: [u8; BUFFER_SIZE] = [0; BUFFER_SIZE];  // stack array
// let n = read();
// let dyn: [u8; n] = ...;  // Error: can't use a runtime value
// → Use Vec::with_capacity(n) instead

// const generics
struct Matrix<const R: usize, const C: usize> {
    data: [[f64; C]; R],
}

// const fn — same role as C++'s constexpr
const fn square(x: usize) -> usize { x * x }
const AREA: usize = square(16);        // 256

// Fundamental difference from Java: Rust and C++ share
// the idea that "compile time = a resource of the type system."
// Java just does everything at runtime.`,
            },
          ]}
        />
        <p>
          In summary: in Java, a "constant" usually means "a value that doesn't change
          after the program starts running," and the JVM handles everything at runtime.
          In Rust and C++, <code>const</code>/<code>constexpr</code> lives at a higher
          level — it's{" "}
          <strong>a value the compiler can already burn into the spot where it's used</strong>,
          which is why it can appear inside array sizes, type parameters, and patterns —{" "}
          <em>parts of the type system itself</em>. The distinction is annoying at first,
          but once the world of "numbers baked into types" opens up (like const generics),
          a lot of code stops needing runtime validation.
        </p>

        <h3>A quick note — <code>const</code> vs <code>static</code></h3>
        <p>
          Rust also has a <code>static</code> keyword that looks similar enough to be
          confusing. The details can wait, but one thing is worth remembering now.
        </p>
        <ul>
          <li>
            <code>const</code> is a <em>value</em>. At each use site the compiler{" "}
            <em>copies the value in</em>. It has no memory address, so{" "}
            <code>&amp;CONST</code> may point at a fresh temporary depending on context.
          </li>
          <li>
            <code>static</code> is a fixed <em>memory location</em>. There's a single
            address for the whole program, which is what you want for data shared
            globally (log levels, caches, lazy-initialized singletons). If you need to
            mutate one, you either reach for <code>static mut</code> (unsafe) or wrap it
            in <code>OnceLock</code> / <code>Mutex</code>.
          </li>
        </ul>
        <p>
          If you just need a named number, use <code>const</code>. If you need an address,
          or the initialization is expensive, use <code>static</code>. For almost
          everything in this course, <code>const</code> is enough.
        </p>

        <h3>🔄 Shadowing — reuse of names, but done properly</h3>
        <p>
          Shadowing means <em>redeclaring the same name with another <code>let</code></em>.
          At first it looks like "isn't this just <code>mut</code> with extra steps?",
          but there are three decisive differences.
        </p>

        <p><strong>① You can change the type</strong></p>
        <CodeBlock>{`// The most common pattern — parsing: &str → number
let input = "42";              // &str
let input: u32 = input.parse().unwrap(); // u32 — same name, re-declared
println!("{}", input + 1);     // 43

// You can't do this with mut — the type is pinned
// let mut input = "42";
// input = input.parse().unwrap(); // ← type mismatch error`}</CodeBlock>
        <p>
          In Java you'd have to use different names like <code>inputStr</code> and{" "}
          <code>inputNum</code>. That creates a trap: the original string is still in
          scope, so lower in the function it looks like you can keep using it. Rust's
          shadowing makes the compiler enforce "<em>the previous name is no longer this
          name</em>," so that trap goes away.
        </p>

        <p><strong>② The result is still immutable</strong></p>
        <CodeBlock>{`let spaces = "   ";              // &str, immutable
let spaces = spaces.len();       // usize, still immutable — shadowing
// spaces = 10;                  // ← error! not mut, so can't reassign`}</CodeBlock>
        <p>
          <code>mut</code> says "this variable may keep changing later," while shadowing
          says "at this point I'm swapping it for a new value exactly once, and then it's
          immutable again." In other words, shadowing is{" "}
          <strong>a way to express a transformation pipeline without introducing
          mutability.</strong>
        </p>

        <p><strong>③ Going out of scope restores the original</strong></p>
        <CodeBlock>{`fn main() {
    let x = 5;
    println!("outer x = {x}");   // 5

    {
        let x = x * 2;             // shadowed inside an inner scope
        println!("inner x = {x}"); // 10
    }

    println!("outer x again = {x}"); // 5 — the original is untouched
}`}</CodeBlock>
        <p>
          You can't fake this with <code>mut</code>. If you reassign <code>x</code>{" "}
          with <code>mut</code>, the new value is visible in the outer scope forever
          after. Shadowing lets you encode "inside this block I want to treat{" "}
          <code>x</code> as meaning something different" directly in the type system — a
          bit like the way mathematical proofs say "within this proof block, we define{" "}
          <code>x</code> as ..."
        </p>

        <h3>🆚 Why shadowing is awkward in Java/C++</h3>
        <CodeTabs
          caption="Parsing then reusing — three languages"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — can't re-declare the same name. You have to pick different ones.
String inputStr = "42";
int input = Integer.parseInt(inputStr);
// Now both inputStr (a string) and input (a number) are visible below.
// Accidentally reusing inputStr is a common bug.
System.out.println(input + 1);`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — you can re-declare in an inner block scope only;
// in the same scope it's an error.
std::string input_str = "42";
int input = std::stoi(input_str);
// Again the original string is still alive, which muddies things.
std::cout << input + 1;`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — same name overridden; the original becomes inaccessible.
let input = "42";
let input: i32 = input.parse().unwrap();
// Below this line 'input' is only ever i32. The string version is hidden as if it never existed.
println!("{}", input + 1);`,
            },
          ]}
        />
        <Callout title="💡 mut vs shadowing — which when?">
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li><strong>Multiple updates of the same type</strong> (counters, running sums): <code>let mut</code>.</li>
            <li><strong>One transformation then back to immutable</strong> (parsing, normalization, aggregation result): shadowing.</li>
            <li><strong>When the type changes during transformation</strong> (<code>String → usize</code>): shadowing is the only idiom.</li>
            <li><strong>When you want a different meaning inside a specific block</strong>: inner-scope shadowing.</li>
          </ul>
        </Callout>

        <h3>Hands-on</h3>
        <p>Save the code below to <code>src/main.rs</code> and run it with <code>cargo run</code>.</p>
        <CodeBlock>{`fn main() {
    // 1) Immutable — assigning again is a compile error
    let x = 5;
    println!("x = {x}");
    // x = 10;  // ← uncomment to see the compile error!

    // 2) mut — mutable variable
    let mut y = 10;
    println!("y before = {y}");
    y = 20;
    println!("y after = {y}");

    // 3) const — compile-time constant (type required, SCREAMING_SNAKE_CASE)
    const MAX_SCORE: u32 = 100;
    println!("max score = {MAX_SCORE}");

    // 4) Shadowing — re-declare the same name with let (type may change too)
    let spaces = "   ";           // &str
    let spaces = spaces.len();    // now usize!
    println!("spaces count = {spaces}");
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>cargo run</code> prints <code>x = 5</code>, <code>y after = 20</code>, and the rest.</>,
            <>Uncommenting <code>x = 10;</code> causes a compile error.</>,
            <>Omitting the type on a <code>const</code> is an error.</>,
            <>You can explain the difference between shadowing (that can change the type) and <code>mut</code>.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html", text: "The Rust Book — 3.1 Variables and Mutability" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="📦 Data types · Inference · Tuples · Arrays · &str vs String">
        <Lede>Rust is statically typed, but most of the time you don't actually have to write the types.</Lede>

        <p>
          Rust's types split roughly into{" "}
          <strong>built-in primitive types</strong> and{" "}
          <strong>types from the standard library</strong>. We won't go deep on all of
          them in this session, but since these names will come up everywhere later, it's
          worth skimming the whole map once. First the category tables, then a closer
          look at the ones you'll use right away.
        </p>

        <h3>📚 A map of Rust's data types</h3>

        <p><strong>1. Scalar primitives — single-value types</strong></p>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Types</th>
              <th>Size</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Signed integers</td>
              <td><code>i8</code>, <code>i16</code>, <code>i32</code>, <code>i64</code>, <code>i128</code>, <code>isize</code></td>
              <td>1·2·4·8·16 B, pointer-width</td>
              <td>Default is <code>i32</code></td>
            </tr>
            <tr>
              <td>Unsigned integers</td>
              <td><code>u8</code>, <code>u16</code>, <code>u32</code>, <code>u64</code>, <code>u128</code>, <code>usize</code></td>
              <td>1·2·4·8·16 B, pointer-width</td>
              <td><code>usize</code> for indices and lengths</td>
            </tr>
            <tr>
              <td>Floating point</td>
              <td><code>f32</code>, <code>f64</code></td>
              <td>4 B, 8 B</td>
              <td>IEEE 754, default <code>f64</code></td>
            </tr>
            <tr>
              <td>Boolean</td>
              <td><code>bool</code></td>
              <td>1 B</td>
              <td><code>true</code> / <code>false</code></td>
            </tr>
            <tr>
              <td>Character</td>
              <td><code>char</code></td>
              <td>4 B</td>
              <td>Unicode scalar value. <code>'a'</code>, <code>'❤'</code>, <code>'가'</code></td>
            </tr>
            <tr>
              <td>Unit type</td>
              <td><code>()</code></td>
              <td>0 B</td>
              <td>Expresses "no value." Corresponds to C's <code>void</code>.</td>
            </tr>
            <tr>
              <td>Never type</td>
              <td><code>!</code></td>
              <td>—</td>
              <td>Return type of functions that never return (<code>panic!</code>, infinite loops).</td>
            </tr>
          </tbody>
        </table>

        <p><strong>2. Compound primitives — types that group values together</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Syntax</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tuple</td>
              <td><code>(T1, T2, ...)</code></td>
              <td>Fixed-size grouping of different types. Access with <code>.0</code>, <code>.1</code>, ...</td>
            </tr>
            <tr>
              <td>Array</td>
              <td><code>[T; N]</code></td>
              <td>N values of the same type, contiguous. The length is part of the type.</td>
            </tr>
            <tr>
              <td>Slice</td>
              <td><code>[T]</code> (in practice <code>&amp;[T]</code>)</td>
              <td>View into a contiguous range of an array/Vec. Pointer + length.</td>
            </tr>
            <tr>
              <td>String slice</td>
              <td><code>str</code> (in practice <code>&amp;str</code>)</td>
              <td>UTF-8 string view. A literal <code>"hello"</code> is an <code>&amp;'static str</code>.</td>
            </tr>
          </tbody>
        </table>

        <p><strong>3. References and pointers — types that point at memory</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>When to use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>&amp;T</code></td>
              <td>Shared reference (borrow)</td>
              <td>Read-only access — covered in Step 4</td>
            </tr>
            <tr>
              <td><code>&amp;mut T</code></td>
              <td>Mutable reference (exclusive borrow)</td>
              <td>Read and write access</td>
            </tr>
            <tr>
              <td><code>*const T</code>, <code>*mut T</code></td>
              <td>Raw pointers</td>
              <td>FFI / low-level work inside <code>unsafe</code> blocks</td>
            </tr>
            <tr>
              <td><code>fn(A) -&gt; B</code></td>
              <td>Function pointer</td>
              <td>Passing a function as a value (different from closures — Step 7)</td>
            </tr>
          </tbody>
        </table>

        <p><strong>4. Heap-allocated and ownership-related stdlib types (Step 4, Step 8 preview)</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>String</code></td>
              <td>Heap-owned mutable UTF-8 string</td>
            </tr>
            <tr>
              <td><code>Vec&lt;T&gt;</code></td>
              <td>Heap-backed growable array (length can change at runtime)</td>
            </tr>
            <tr>
              <td><code>Box&lt;T&gt;</code></td>
              <td>A heap-allocated value owned by a single location</td>
            </tr>
            <tr>
              <td><code>Rc&lt;T&gt;</code> / <code>Arc&lt;T&gt;</code></td>
              <td>Reference-counted shared ownership (single-threaded / multi-threaded)</td>
            </tr>
            <tr>
              <td><code>Cell&lt;T&gt;</code> / <code>RefCell&lt;T&gt;</code></td>
              <td>Mutate through a shared reference (interior mutability)</td>
            </tr>
            <tr>
              <td><code>Cow&lt;'a, T&gt;</code></td>
              <td>"Borrow read-only, clone only when modification is needed"</td>
            </tr>
          </tbody>
        </table>

        <p><strong>5. Core generic types — show up in nearly every Rust program (Step 5, Step 7)</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Option&lt;T&gt;</code></td>
              <td><code>Some(T)</code> / <code>None</code> — "maybe a value" without null</td>
            </tr>
            <tr>
              <td><code>Result&lt;T, E&gt;</code></td>
              <td><code>Ok(T)</code> / <code>Err(E)</code> — error handling (the replacement for exceptions)</td>
            </tr>
            <tr>
              <td><code>Range&lt;T&gt;</code>, <code>RangeInclusive&lt;T&gt;</code>, ...</td>
              <td>Iteration ranges like <code>0..10</code>, <code>0..=10</code></td>
            </tr>
          </tbody>
        </table>

        <p><strong>6. Collections (std::collections)</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Flavor</th>
              <th>Java equivalent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Vec&lt;T&gt;</code></td>
              <td>Dynamic array</td>
              <td><code>ArrayList</code></td>
            </tr>
            <tr>
              <td><code>VecDeque&lt;T&gt;</code></td>
              <td>Double-ended queue</td>
              <td><code>ArrayDeque</code></td>
            </tr>
            <tr>
              <td><code>LinkedList&lt;T&gt;</code></td>
              <td>Doubly linked list (rarely used)</td>
              <td><code>LinkedList</code></td>
            </tr>
            <tr>
              <td><code>HashMap&lt;K, V&gt;</code></td>
              <td>Hash-based key-value store</td>
              <td><code>HashMap</code></td>
            </tr>
            <tr>
              <td><code>BTreeMap&lt;K, V&gt;</code></td>
              <td>Ordered key-value store</td>
              <td><code>TreeMap</code></td>
            </tr>
            <tr>
              <td><code>HashSet&lt;T&gt;</code>, <code>BTreeSet&lt;T&gt;</code></td>
              <td>Sets (unordered / ordered)</td>
              <td><code>HashSet</code>, <code>TreeSet</code></td>
            </tr>
            <tr>
              <td><code>BinaryHeap&lt;T&gt;</code></td>
              <td>Priority queue (max-heap)</td>
              <td><code>PriorityQueue</code></td>
            </tr>
          </tbody>
        </table>

        <p><strong>7. Filesystem / OS / FFI string types</strong></p>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>PathBuf</code> / <code>&amp;Path</code></td>
              <td>Filesystem paths (handles platform-specific encoding)</td>
            </tr>
            <tr>
              <td><code>OsString</code> / <code>&amp;OsStr</code></td>
              <td>Native OS strings (may not be UTF-8)</td>
            </tr>
            <tr>
              <td><code>CString</code> / <code>&amp;CStr</code></td>
              <td>Null-terminated strings for C FFI</td>
            </tr>
          </tbody>
        </table>

        <p><strong>8. User-defined types (covered in depth in Step 5)</strong></p>
        <ul>
          <li><code>struct</code> — named-field struct. Tuple structs (<code>struct Point(f64, f64)</code>) and unit structs (<code>struct Marker</code>) are variations.</li>
          <li><code>enum</code> — a sum type taking one of several forms. <code>Option</code> and <code>Result</code> are enums too.</li>
          <li><code>union</code> — C-compatible union (mostly FFI / <code>unsafe</code>).</li>
          <li><code>type</code> alias — give an existing type a new name, e.g. <code>type Km = u32;</code>.</li>
          <li><code>trait</code> / <code>dyn Trait</code> / <code>impl Trait</code> — what a type can <em>do</em> (Step 5 M4).</li>
        </ul>

        <Callout title="💡 Not everything above is required memorization">
          Think of these tables as a <em>catalogue</em>. Come back when you need them.
          The things you really need to hold in your head for Step 3 are: scalars
          (integers, floats, <code>bool</code>, <code>char</code>), tuples, arrays, and{" "}
          <code>&amp;str</code> vs <code>String</code>. For the rest, "ah, this thing
          exists" is enough for now.
        </Callout>

        <h3>What to focus on at this stage</h3>
        <p>
          The rest of this module covers the parts Step 3 actually uses: scalars, tuples,
          arrays, strings, and type inference.
        </p>

        <h3>🧠 Type inference — mostly omitted, sometimes required</h3>
        <p>
          Rust is statically typed, but in practice you write type annotations far less
          often than in Java. The reason is that the Rust compiler infers types{" "}
          <strong>by looking at the entire function body</strong>. This isn't limited to
          "look at the right-hand side to decide the left-hand type" — it also takes into
          account <em>how a variable is used later</em>.
        </p>

        <p><strong>① The common case — inferred directly from a literal</strong></p>
        <CodeBlock>{`let x = 5;          // integer literal default → i32
let pi = 3.14;      // float literal default → f64
let ok = true;      // bool
let c = '❤';        // char
let s = "hello";    // &str

// If you want to write the type, add a colon
let x: i64 = 5;     // override the default to i64`}</CodeBlock>

        <p><strong>② Inference that looks "backwards" — past the declaration line</strong></p>
        <CodeBlock>{`// On this line alone, we can't tell what v is — Vec<what>?
let mut v = Vec::new();

// But the compiler looks further down and then decides:
v.push(42);
// 42 is i32 → therefore v: Vec<i32> is settled.

println!("{:?}", v); // [42]`}</CodeBlock>
        <p>
          This "look both ways" style is the biggest difference from Java's{" "}
          <code>var</code> or C++'s <code>auto</code>. Java's{" "}
          <code>var v = new ArrayList&lt;&gt;();</code> tries to decide the type from{" "}
          <em>that single line</em>, so it ends up as{" "}
          <code>ArrayList&lt;Object&gt;</code>. Rust instead notices{" "}
          <code>v.push(42)</code> further down and settles on{" "}
          <code>Vec&lt;i32&gt;</code>.
        </p>

        <p><strong>③ When inference fails — <code>parse()</code> and <code>collect()</code></strong></p>
        <CodeBlock>{`// This doesn't compile
// let n = "42".parse().unwrap();
// error[E0284]: type annotations needed
//               cannot infer type of the type parameter \`F\`
//               declared on the method \`parse\`

// Why: parse() can turn a string into any type that implements FromStr.
//      i32? u64? f64? Too many candidates, so the compiler refuses to guess.

// Three ways to fix it — any one of them is enough:

// (a) Annotate the variable
let n: i32 = "42".parse().unwrap();

// (b) Use turbofish — specify the type on the method directly
let n = "42".parse::<i32>().unwrap();

// (c) Let a downstream use provide the hint
let n = "42".parse().unwrap();
let doubled: i32 = n * 2;  // n is therefore i32`}</CodeBlock>
        <p>
          <strong>Turbofish</strong> (<code>::&lt;T&gt;</code>) is a Rust-only piece of
          syntax. You need to specify the type on the method call before the value comes
          back, and the turbofish shape is what that looks like (using{" "}
          <code>foo.parse&lt;i32&gt;()</code> without the <code>::</code> would clash
          with the less-than operator). You'll see it most often with methods where the
          caller decides the result type — <code>collect</code>, <code>parse</code>,{" "}
          <code>::from</code>, and friends.
        </p>

        <p><strong>④ The <code>_</code> wildcard — "you figure the rest out"</strong></p>
        <CodeBlock>{`// Pin the container type, let the compiler fill in the element type
let squares: Vec<_> = (1..=5).map(|n| n * n).collect();
// The compiler knows (1..=5) is i32, so n*n is i32,
// and fills the _ in Vec<_> with i32 → Vec<i32>

// Or the other way — fix the element type, leave the container flexible:
let set: std::collections::HashSet<i32> = [1, 2, 3].into_iter().collect();`}</CodeBlock>

        <p><strong>⑤ Places you always have to annotate</strong></p>
        <p>Inference is powerful, but it stays inside a function body. The following spots always need explicit types.</p>
        <ul>
          <li><strong>Function parameters and return types</strong> — <code>fn add(a: i32, b: i32) -&gt; i32</code></li>
          <li><strong>Fields of structs/enums</strong> — <code>struct User {"{ name: String, age: u32 }"}</code></li>
          <li><strong><code>const</code> and <code>static</code> declarations</strong> — <code>const MAX: u32 = 100;</code></li>
          <li><strong>Associated types on traits</strong> — you'll meet these in Steps 5–7</li>
        </ul>
        <p>
          Why the insistence on writing types in function signatures? Three reasons:
        </p>
        <ol>
          <li><strong>Public API stability</strong> — if signatures changed depending on the body, a small internal tweak could break every caller.</li>
          <li><strong>Compile time</strong> — inference that crosses function boundaries explodes in complexity. Keeping it inside one function at a time keeps it fast.</li>
          <li><strong>Documentation and error messages</strong> — explicit signatures let the compiler clearly say "expected this, got that."</li>
        </ol>

        <h3>🆚 Java <code>var</code> · C++ <code>auto</code> · Rust inference</h3>
        <CodeTabs
          caption="The limits of inference in each language"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java 10+ — var looks only at 'the right-hand side of this line'
var x = 5;                          // int
var list = new ArrayList<Integer>(); // ArrayList<Integer> — must be spelled out
var empty = new ArrayList<>();      // ArrayList<Object> — can't see anything later

// Can't use var in parameters or return types
// var f(var x) { ... }             // error

// Can't use var on fields either — local variables only`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — auto from C++11, decided by the type of the RHS
auto x = 5;                 // int
auto v = std::vector<int>{}; // std::vector<int>
auto empty = std::vector{};  // Even C++17 still needs an element type

// Return-type deduction exists in C++14+, but
// it's still based on 'the current expression' — no forward-looking inference
auto add(int a, int b) { return a + b; }  // only the return type is inferred`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — scans the whole function body, looking both directions
let x = 5;              // i32 (literal default)
let mut v = Vec::new(); // still Vec<?> — decision deferred
v.push(42);             // ← decided here as Vec<i32>

// You only need to supply one side — container or element
let v: Vec<_> = (1..=5).collect();    // compiler fills in the _
let v = (1..=5).collect::<Vec<i32>>(); // or use turbofish

// Function signatures are always explicit — the boundary of inference
fn add(a: i32, b: i32) -> i32 {
    let tmp = a + b;     // tmp is inferred (i32)
    tmp
}`,
            },
          ]}
        />

        <Callout title="💡 A practical tip">
          Beginners often feel tempted to annotate every single <code>let</code>. The
          idiom is the opposite: <strong>always annotate signatures, annotate inside the
          body as little as possible</strong>. Rust-analyzer shows inferred types inline
          so you're never in the dark while reading the code. Only add annotations when
          the compiler actually asks for them.
        </Callout>

        <h3>Strings — <code>&str</code> and <code>String</code></h3>
        <p>
          Rust has two string types: <code>&str</code> (a string slice) and{" "}
          <code>String</code> (a heap-allocated mutable string). For now just remember
          "string literals are <code>&str</code>, anything built dynamically is{" "}
          <code>String</code>." We'll dig into why in Step 4 alongside ownership.
        </p>

        <h3>🆚 Why does Rust have so many integer types?</h3>
        <p>
          In Java, the integer story is basically "use <code>int</code> (32-bit signed),
          or <code>long</code> (64-bit) if it's bigger." Rust has 12 integer types —{" "}
          <code>i8, i16, i32, i64, i128, isize</code> and{" "}
          <code>u8, u16, u32, u64, u128, usize</code>. Why?
        </p>
        <ul>
          <li>
            <strong>Unsigned integers are first class</strong> — "a length can never be
            negative" can be expressed directly in the type. Java uses <code>int length</code>
            and tracks the "must be non-negative" constraint via comments and runtime
            checks.
          </li>
          <li>
            <strong><code>usize</code>/<code>isize</code> are pointer-width</strong> —
            32 bits on 32-bit systems, 64 bits on 64-bit systems. Used for indices and
            sizes. Same role as C's <code>size_t</code>.
          </li>
          <li>
            <strong>Overflow behavior is clearly defined</strong> — in debug builds,
            integer overflow panics; in release builds, it's well-defined two's complement
            wrapping. In C/C++, signed overflow is <em>undefined behavior</em>, and
            optimizers happily "assume it doesn't happen" and generate surprising code.
            Rust removes that trap.
          </li>
        </ul>

        <h3>🆚 <code>&str</code> and <code>String</code>: why isn't Java's <code>String</code> enough?</h3>
        <p>
          Java's <code>String</code> is immutable, always lives on the heap, and has no
          notion of a "view." To get a substring you call{" "}
          <code>substring()</code>, which allocates a <em>new object</em> (as of Java
          7u6). Even string literals like <code>"hello"</code> are whole{" "}
          <code>String</code> objects that the compiler interns in the string pool.
        </p>
        <p>
          Rust splits that one concept in two: <em>the owner of the data
          (<code>String</code>)</em> and <em>someone who only borrows it
          (<code>&str</code>)</em>.
        </p>
        <ul>
          <li><code>String</code>: owns data on the heap. Mutable. Closer to Java's <code>StringBuilder</code>.</li>
          <li><code>&str</code>: a view (pointer + length) into an existing buffer. No allocation. Slicing like <code>&s[0..5]</code> doesn't copy.</li>
        </ul>
        <p>
          This means a function that takes <code>fn greet(name: &str)</code> can be
          called with a <code>String</code>, a string literal, or another{" "}
          <code>&str</code>, and <strong>no copying happens</strong>. Getting the same
          flexibility in Java requires either <code>CharSequence</code> or creating fresh{" "}
          <code>String</code> instances everywhere.
        </p>

        <h3>Hands-on</h3>
        <p>Here's an example that uses tuples and arrays. Save it to <code>src/main.rs</code> and run it.</p>
        <CodeBlock>{`fn main() {
    // Scalars
    let age: i32 = 25;
    let pi: f64 = 3.14159;
    let is_rust_fun: bool = true;
    let heart: char = '❤';
    println!("{age} years old, pi={pi}, fun={is_rust_fun}, {heart}");

    // Tuple — groups different types
    let person: (&str, i32) = ("Alice", 30);
    println!("name={}, age={}", person.0, person.1);

    // Destructuring
    let (name, score) = ("Bob", 95);
    println!("{name}'s score is {score}");

    // Array — same type, fixed length
    let nums: [i32; 5] = [1, 2, 3, 4, 5];
    println!("first = {}, length = {}", nums[0], nums.len());

    // Initialize with a repeating value
    let zeros = [0; 3]; // [0, 0, 0]
    println!("zeros = {:?}", zeros);

    // &str vs String
    let greeting: &str = "Hello";                // string slice
    let owned: String = String::from("World");   // heap-allocated
    println!("{greeting}, {owned}");
}`}</CodeBlock>

        <Checklist
          items={[
            <>You can access tuple elements with <code>.0</code>, <code>.1</code>.</>,
            <>You've tested what kind of error you get when an array index goes out of bounds.</>,
            <>You can state the difference between <code>&str</code> and <code>String</code> in one sentence.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-02-data-types.html", text: "The Rust Book — 3.2 Data Types" },
            { href: "https://doc.rust-lang.org/book/ch08-02-strings.html", text: "The Rust Book — 8.2 Strings" },
          ]}
        />
      </Module>

      {/* ===== M3 ===== */}
      <Module badge="M3" title="🔀 Control flow — if · loop · while · for, expressions vs statements">
        <Lede>In Rust, <code>if</code> is an expression, so it can return a value.</Lede>

        <p>
          In most languages, <code>if</code> is a statement. In Rust,{" "}
          <code>if</code> is an <strong>expression</strong>, which is why you can write{" "}
          <code>let x = if cond {"{"} 1 {"}"} else {"{"} 2 {"}"};</code> and have it
          assign a value directly. Once you internalize this, a lot of Rust code suddenly
          makes sense at a glance.
        </p>
        <p>
          An <strong>expression</strong> is code that produces a value; a{" "}
          <strong>statement</strong> is code that doesn't. In Rust, adding a semicolon{" "}
          <code>;</code> turns an expression into a statement. This also matters for
          function return values (covered in M4).
        </p>

        <h3>🆚 Java's <code>if</code> vs Rust's <code>if</code> — why are they different?</h3>
        <p>
          In Java, <code>if</code> is a <em>statement</em>. Since it doesn't produce a
          value, code like <code>String grade = if (...) ...</code> simply doesn't
          compile. For complex branching you declare a variable first and assign inside
          the branches, or use the ternary operator <code>?:</code> for simple cases.
          Rust's <code>if</code> is an <strong>expression</strong>, so neither workaround
          is needed.
        </p>
        <CodeTabs
          caption="Grading based on score"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — if is a statement, doesn't return a value
String grade;
if (score >= 90)      grade = "A";
else if (score >= 80) grade = "B";
else                  grade = "C";
// Or only for the simple case: String grade = (score >= 90) ? "A" : "B";
// Once you have three or more branches, nested ternaries get ugly and
// people end up back at the pattern above.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — like Java, if is a statement
std::string grade;
if      (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else                  grade = "C";
// Or only for the simple case: auto grade = (score >= 90) ? "A" : "B";`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — if returns a value, so you can bind it directly with let
let grade = if score >= 90 {
    "A"
} else if score >= 80 {
    let bonus = if extra_credit { "+" } else { "" };
    "B"  // The last expression in each branch becomes the value
} else {
    "C"
};`,
            },
          ]}
        />
        <p>
          The same philosophy applies consistently to <code>match</code>,{" "}
          <code>loop</code>, and blocks <code>{"{}"}</code>. Because "almost everything
          has a value," the classic "declare then reassign" pattern fades away, which
          pairs naturally with the immutable-by-default default.
        </p>

        <h3>🔁 <code>loop</code> — Rust's dedicated infinite-loop keyword</h3>
        <p>
          Java and C++ have no dedicated keyword for "loop forever." People write{" "}
          <code>while(true)</code> or <code>for(;;)</code> by convention. Rust fills that
          spot with its own keyword <strong><code>loop</code></strong>, and it's not just
          syntactic sugar. There are three reasons.
        </p>

        <p><strong>① The compiler can know "this loop never ends"</strong></p>
        <p>
          Syntactically, <code>while(true)</code> assumes the condition "true" could
          become false, so it doesn't help type inference. <code>loop</code> is infinite
          by definition, so it can have the <strong>Never type <code>!</code></strong> as
          its value type, which in turn lets you express "this function never returns"
          right in the type system.
        </p>
        <CodeBlock>{`fn forever() -> ! {
    loop {
        // The compiler is guaranteed to know this function never returns.
        // The Never type (!) can substitute for any other type, which is
        // why patterns like "panic on error" compose cleanly.
    }
}

fn get_or_die(x: Option<i32>) -> i32 {
    match x {
        Some(n) => n,
        None => forever(),   // ! unifies with i32, so this fits
    }
}`}</CodeBlock>

        <p><strong>② <code>loop</code> is an expression that returns a value</strong></p>
        <p>
          Unlike <code>while</code> and <code>for</code>, <code>loop</code> is an{" "}
          <em>expression</em>. Attach a value to <code>break</code> and that value
          becomes the value of the whole loop, which you can bind directly with{" "}
          <code>let</code>. This is especially clean for "retry until success" or "find
          the first value that matches a condition" patterns.
        </p>
        <CodeTabs
          caption="Find a value that satisfies a condition and return it"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — while(true) with a flag / external variable
int result = -1;
while (true) {
    int candidate = randomNumber();
    if (isPrime(candidate)) {
        result = candidate;
        break;
    }
}
// Four steps just to stash the value: declare → loop → assign → break.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — for(;;) or while(true) plus an external variable. Same shape.
int result = -1;
for (;;) {
    int candidate = random_number();
    if (is_prime(candidate)) {
        result = candidate;
        break;
    }
}
// You can also wrap it in a lambda and immediately invoke it (IIFE), but
// the same limitations apply as in Java.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — loop is an expression, bind it directly with let
let first_prime = loop {
    let candidate = random_number();
    if is_prime(candidate) {
        break candidate;    // this becomes first_prime
    }
};
// The "declare / assign / break" trio collapses into one line.
// Bonus: first_prime is immutable (let), settled on the spot.`,
            },
          ]}
        />

        <p><strong>③ It clearly states intent</strong></p>
        <p>
          When a reader sees <code>while(true)</code>, there's a flicker of "wait, could
          that condition change later?" <code>loop</code> declares "this runs until an
          internal <code>break</code>" in a single word. It sounds small, but in a large
          codebase these intent cues add up to a real readability win.
        </p>

        <h3>⏳ <code>while</code> — familiar, with two differences</h3>
        <p>
          <code>while</code> is the most familiar shape: repeat the block while the
          condition is true. Day-to-day usage is essentially the same as in Java/C++, but
          two things differ.
        </p>

        <p><strong>① There is no <code>do...while</code></strong></p>
        <CodeTabs
          caption="Keep asking until a valid input arrives"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — do-while: "run once, then check"
int n;
do {
    n = readInput();
} while (n < 0);
// n is now a valid value (>= 0).`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — same do-while as Java
int n;
do {
    n = read_input();
} while (n < 0);`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — no do-while. Replaced by loop + break.
let n = loop {
    let x = read_input();
    if x >= 0 { break x; }
};
// Honestly shorter, because loop is an expression — "keep looping until a valid
// value comes in, then bind it to a variable" happens in one step.`,
            },
          ]}
        />
        <p>
          Rust's designers dropped <code>do-while</code> because they concluded "<code>loop + break value</code>
          already does the job more cleanly." In fact the most common{" "}
          <code>do-while</code> use case — "run once then check" — is one line shorter in
          Rust.
        </p>

        <p><strong>② <code>while let</code> — loop via pattern matching</strong></p>
        <CodeBlock>{`let mut stack = vec![1, 2, 3, 4, 5];

// "while pop() returns Some" — keep going as long as the pattern matches
while let Some(top) = stack.pop() {
    println!("{}", top);
}
// Prints: 5, 4, 3, 2, 1

// Java equivalent:
// while (!stack.isEmpty()) {
//     int top = stack.pop();
//     System.out.println(top);
// }
// → "check if empty" and "pull the value" are two separate steps.`}</CodeBlock>
        <p>
          <code>while let</code> expresses "condition + pulling out the value" in one
          go. It really shines with <code>Option</code>, <code>Result</code>, and the{" "}
          <code>next()</code> method on iterators — anything shaped like "yield a value
          if there is one, stop otherwise." The Java-style "check empty, then pop"
          two-step disappears. We'll cover pattern matching in depth in Step 5.
        </p>

        <p><strong>③ <code>while</code> is not an expression</strong></p>
        <p>
          Unlike <code>loop</code>, <code>while</code> always yields{" "}
          <code>()</code> (the unit type). Why? Because a while loop can run{" "}
          <em>zero</em> times if the condition is false on entry, and then there's no
          "value the loop produced," so the type system has no consistent answer to
          "what is this expression worth?" If you need a value, use <code>loop + break</code>{" "}
          or iterator methods like <code>.find()</code> / <code>.fold()</code>.
        </p>

        <h3>🆚 <code>for</code> loops — why Rust ditched the C/Java style</h3>
        <p>
          Rust's <code>for</code> does <strong>not</strong> support the C/Java-style{" "}
          <code>for(int i=0; i&lt;n; i++)</code>. It only accepts iterators —{" "}
          <code>1..n</code>, <code>.iter()</code> on a collection, and so on. The same
          "sum from 1 to 10" compared across three languages makes the difference obvious.
        </p>
        <CodeTabs
          caption="Sum 1 through 10"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — two styles of for coexist: classic and enhanced-for
int sum = 0;
for (int i = 1; i <= 10; i++) {  // classic C-style — off-by-one risks always present
    sum += i;
}

// Or with a collection, enhanced-for
int[] arr = {1,2,3,4,5,6,7,8,9,10};
for (int x : arr) { sum += x; }

// Two grammars side by side, and the classic form still trips people on i <= n vs i < n.`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — classic for and C++11 range-based for coexist
int sum = 0;
for (int i = 1; i <= 10; ++i) sum += i;  // classic style

// C++11+ range-based
std::vector<int> v = {1,2,3,4,5,6,7,8,9,10};
for (int x : v) sum += x;

// Still iterator-based under the hood (.begin()/.end()),
// and like Java, two grammars live side by side.`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — exactly one for grammar, and only iterators behind it
let sum: i32 = (1..=10).sum();   // most idiomatic — iterator + sum()

// Or the more traditional shape
let mut sum = 0;
for i in 1..=10 {
    sum += i;
}

// With a collection:
let arr = [1,2,3,4,5,6,7,8,9,10];
let mut sum = 0;
for x in arr { sum += x; }

// There is one for grammar. What comes after must implement IntoIterator.`,
            },
          ]}
        />

        <p>
          Rust's <code>for ... in ...</code> internally calls{" "}
          <strong><code>IntoIterator::into_iter()</code></strong> to get an iterator and
          then repeatedly calls <code>next()</code> — that's the <em>desugaring</em>. In
          other words, "a for loop runs over an iterator" is a language-level contract.
          The concrete benefits:
        </p>
        <ul>
          <li>
            <strong>No buffer overruns</strong> — off-by-one bugs like C's{" "}
            <code>for(int i=0; i&lt;=n; i++)</code> going past the end of an array are
            completely ruled out. Iterators know their own length and decide when to stop.
          </li>
          <li>
            <strong>Optimizer-friendly</strong> — when you use a range like{" "}
            <code>1..=1000</code>, the compiler can eliminate bounds checks (bounds-check
            elimination) and LLVM can even apply SIMD and loop unrolling. The result
            compiles to the same assembly as a hand-written C pointer loop.
          </li>
          <li>
            <strong>Loop variable is immutable by default</strong> — in{" "}
            <code>for i in 0..10</code>, <code>i</code> is a fresh immutable binding on
            each iteration. Trying <code>i = 5;</code> is a compile error. You can't make
            a classic-Java off-by-one by quietly tweaking the loop counter inside the
            body.
          </li>
          <li>
            <strong>No modifying a collection while iterating</strong> — the borrow rules
            (Step 4) apply automatically, so C++-style iterator invalidation and Java's{" "}
            <code>ConcurrentModificationException</code> are ruled out at compile time.
          </li>
          <li>
            <strong>Iterator chaining feels natural</strong> —{" "}
            <code>for x in (1..100).filter(|n| n % 3 == 0).map(|n| n * n) {"{ ... }"}</code>
            {" "}stays a single loop with no intermediate allocations (more in Step 7).
          </li>
        </ul>

        <Callout title="💡 What if I really need an index?">
          If you genuinely need the index, use <code>.enumerate()</code>:
          <code>{"for (i, item) in items.iter().enumerate() { ... }"}</code>. You get
          the index <code>i</code> alongside the item. Or if you just need the{" "}
          <em>number itself</em> (as in <code>1..=100</code>), iterate over the range —
          that's essentially the same as a C-style for.
        </Callout>

        <h3>🏷️ Labels — breaking cleanly out of nested loops</h3>
        <p>
          Sometimes you need to break out of an outer loop from inside a nested loop.
          Java has <code>break label;</code>. C++ doesn't, so you resort to flag
          variables or <code>goto</code>. Rust supports explicit labels like Java, but
          with its own syntax — <strong>an apostrophe-prefixed <code>'name</code></strong>.
        </p>
        <CodeTabs
          caption="Find a matching pair in a 2D array"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — label with 'outer:' and break outer;
outer:
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) {
            System.out.println("found " + i + "," + j);
            break outer;   // escape both loops
        }
    }
}`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — no language-level labeled break. Pick one of three patterns.
// 1) Flag variable
bool found = false;
for (int i = 0; i < rows && !found; i++) {
    for (int j = 0; j < cols && !found; j++) {
        if (grid[i][j] == target) {
            std::cout << "found " << i << "," << j;
            found = true;
        }
    }
}

// 2) goto (still valid but frowned upon)
// 3) Extract into a function and return`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 'outer label + break 'outer
'outer: for i in 0..rows {
    for j in 0..cols {
        if grid[i][j] == target {
            println!("found {},{}", i, j);
            break 'outer;      // escape both loops
        }
    }
}

// continue also takes a label — from an inner loop, skip to the 'next iteration' of the outer
'row: for i in 0..rows {
    for j in 0..cols {
        if should_skip_row(i) {
            continue 'row;     // move outer for's i to its next value
        }
    }
}`,
            },
          ]}
        />
        <p>
          The name <code>'outer</code> looks like Rust's lifetime syntax, which can be
          confusing at first. In practice loop labels and lifetimes{" "}
          <em>only share the same shape</em> — they live in separate namespaces. You'll
          meet <code>'a</code> again when we get to lifetimes in Step 4 and wonder "wait,
          why is this here again?" — but the compiler disambiguates based on context, so
          you won't get mixed up.
        </p>

        <h3>Hands-on</h3>
        <p>An example that covers conditionals and every loop shape.</p>
        <CodeBlock>{`fn main() {
    // if expression — returns a value
    let score = 85;
    let grade = if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else {
        "C"
    };
    println!("score={score}, grade={grade}");

    // loop — can return a value via break
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 5 {
            break counter * 10; // returns 50
        }
    };
    println!("loop result = {result}");

    // while
    let mut n = 3;
    while n > 0 {
        println!("countdown: {n}");
        n -= 1;
    }
    println!("liftoff!");

    // for — the most common loop
    let fruits = ["apple", "banana", "grape"];
    for fruit in fruits {
        println!("fruit: {fruit}");
    }

    // for with a range
    for i in 1..=3 {
        println!("i = {i}");
    }

    // expression vs statement
    let a = {
        let x = 3;
        x + 1       // no semicolon → expression → produces the value 4
    };
    println!("block expression result = {a}");
}`}</CodeBlock>

        <Checklist
          items={[
            <>You understand that every branch of an <code>if</code> expression must return the same type.</>,
            <>You recognize the <code>loop</code> + <code>break value</code> pattern for returning a value from a loop.</>,
            <>You can distinguish <code>1..5</code> (excludes 5) from <code>1..=5</code> (includes 5).</>,
            <>You understand the rule that the last expression of a block <code>{"{ }"}</code> (no trailing semicolon) becomes its value.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-05-control-flow.html", text: "The Rust Book — 3.5 Control Flow" },
            { href: "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html", text: "The Rust Book — 3.3 Functions" },
          ]}
        />
      </Module>

      {/* ===== M4 ===== */}
      <Module badge="M4" title="🛠 Functions · Return values · cargo test basics">
        <Lede>Rust functions require types on their parameters, and the last expression becomes the return value.</Lede>

        <p>
          Functions are declared with the <code>fn</code> keyword. Parameters must have
          explicit types. The return type goes after <code>-&gt;</code>, and the last
          expression of the body becomes the return value. Watch out for trailing
          semicolons — adding one turns the expression into a statement and the function
          ends up returning <code>()</code>, the empty tuple.
        </p>
        <p>
          To check that your code does what you mean, you write tests. Rust ships with a
          built-in test framework that you run with a single <code>cargo test</code>.
          Functions marked with the <code>#[test]</code> attribute are test functions,
          and <code>assert_eq!</code> is the macro you use to compare an expected value
          with the actual one.
        </p>

        <h3>Hands-on</h3>
        <p>A complete example with functions and tests — save it to <code>src/main.rs</code>.</p>
        <CodeBlock>{`/// Adds two numbers.
fn add(a: i32, b: i32) -> i32 {
    a + b   // no semicolon → this is the return value
}

/// Returns true if \`n\` is even.
fn is_even(n: i32) -> bool {
    n % 2 == 0
}

/// Sums integers from 1 to n.
fn sum_up_to(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total   // same as 'return total;', but this is the idiomatic form in Rust
}

fn main() {
    println!("3 + 7 = {}", add(3, 7));
    println!("Is 4 even? {}", is_even(4));
    println!("Is 5 even? {}", is_even(5));
    println!("sum 1..=100 = {}", sum_up_to(100));
}

// ===== Tests =====
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
        assert_eq!(add(-1, 1), 0);
    }

    #[test]
    fn test_is_even() {
        assert!(is_even(4));
        assert!(!is_even(7));
    }

    #[test]
    fn test_sum_up_to() {
        assert_eq!(sum_up_to(10), 55);
        assert_eq!(sum_up_to(100), 5050);
    }
}`}</CodeBlock>

        <p>Run the program:</p>
        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <p>Run the tests:</p>
        <CodeBlock lang="bash">{`cargo test`}</CodeBlock>

        <Checklist
          items={[
            <><code>cargo run</code> prints <code>3 + 7 = 10</code> and <code>sum 1..=100 = 5050</code>.</>,
            <><code>cargo test</code> passes all three tests.</>,
            <>You've confirmed what error you get if you add a semicolon after <code>a + b</code> in <code>add</code>.</>,
            <>You can explain what <code>#[test]</code> and <code>assert_eq!</code> do.</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html", text: "The Rust Book — 3.3 Functions" },
            { href: "https://doc.rust-lang.org/book/ch11-01-writing-tests.html", text: "The Rust Book — 11.1 Writing Tests" },
          ]}
        />
      </Module>

      <Callout title="💡 Before moving on">
        Make sure every checklist item is ticked off. In particular, verify that{" "}
        <code>cargo test</code> passes at the end of M4. If anything is unclear, it's
        fine to walk through the module again. In Step 4 we dive into Rust's core
        concept: ownership.
      </Callout>

      <PageNav prev={{ to: "/step/2" }} next={{ to: "/step/4" }} />
    </Layout>
  );
}
