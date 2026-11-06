import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Checklist } from "../components/Checklist";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";
import { CodeTabs } from "../components/CodeTabs";

export function Step3BasicsZh() {
  return (
    <Layout
      kicker="Step 3 · 4月14日"
      title="变量 · 类型 · 控制流 · 函数"
      subtitle="Rust 基础语法四个模块 — 从不可变性到 cargo test"
    >
      <Lede>
        完成本节后,您将能够在 Rust 中声明变量、使用数据类型、编写条件与循环,以及定义函数。
        所有示例都可以直接用 <code>cargo run</code> 运行。
      </Lede>

      {/* ===== M1 ===== */}
      <Module badge="M1" title="🔒 不可变性 · mut · const · Shadowing">
        <Lede>Rust 的变量默认不可变。仅此一条规则就悄悄减少了大量 bug。</Lede>

        <p>
          大多数语言的变量可以随意重新赋值。Rust 正好相反。用 <code>let</code> 声明的变量默认是
          <strong>不可变的(immutable)</strong>,要想修改值必须显式写成 <code>let mut</code>。
          多亏这一点,"这个变量会不会在某处被改?"这种担忧几乎消失了。
        </p>
        <p>
          <strong><code>const</code></strong> 看起来很像 <code>let</code>,但必须显式写出类型,
          而且值要在编译期就确定下来。用于那些整个程序中都不会变的值(比如最大分数、圆周率等)。
          <strong>Shadowing(遮蔽)</strong>则是用相同的名字再声明一次 <code>let</code>。
          与 <code>mut</code> 不同,shadowing 甚至可以改变类型。
        </p>

        <h3>🆚 Java/C++ 默认可变,Rust 默认不可变 — 为什么反过来?</h3>
        <p>
          Java、C++、Python、JavaScript 的变量默认都可以随意修改。要让它不可变,就得加一个额外的关键字
          (<code>final</code>、<code>const</code>)。点击下面的标签看看三种语言的差异。
        </p>
        <CodeTabs
          caption="同一件事在三种语言中:可变 vs 不可变"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — 默认可变
int count = 0;
count = 10;             // OK(默认行为)

final int MAX = 100;    // 要让它不可变,得写 final
// MAX = 200;           // 编译错误`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ — 默认可变,const 是"加上去的"
int count = 0;
count = 10;             // OK(默认行为)

const int MAX = 100;    // 要让它不可变,得写 const
// MAX = 200;           // 编译错误`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust — 默认不可变,可变是"加上去的"
let count = 0;
// count = 10;          // ← 编译错误! cannot assign twice to immutable variable

let mut counter = 0;    // 加 mut 才能重新赋值
counter = 10;           // OK`,
            },
          ]}
        />
        <p>
          这个差异看似很小,但叠加在真实代码里效果可不小。Java 里"忘记加 final"导致变量在别处被改写的
          bug 非常常见;Rust 反过来 —— 你只需要对带 <code>mut</code> 的变量多留心即可,
          <strong>读代码时"这个变量会在哪里被改?"这种问题本身就不需要问了</strong>。
          把默认值翻到安全的一侧,是一个很小但很重要的设计决定。
        </p>

        <h3>let · let mut · const — 三者截然不同</h3>
        <ul>
          <li><code>let x = 5;</code> — 值在运行时决定,之后不能重新赋值,按作用域管理。</li>
          <li><code>let mut x = 5;</code> — 值在运行时决定,可以重新赋值。</li>
          <li><code>const MAX: u32 = 100;</code> — 编译期常量。必须写类型,只能用表达式,作用于整个程序。
            类似 Java 的 <code>static final</code>、C++ 的 <code>constexpr</code>。</li>
        </ul>

        <h3>🧱 const 什么时候用 — "编译期就需要值的位置"</h3>
        <p>
          把 <code>const</code> 仅仅理解为"全局常量"只说对了一半。
          Rust 里 <code>const</code> 真正的作用是
          <strong>向类型系统在编译期要求数字的位置提供值</strong>。
          以下四种是最常见的场合。
        </p>

        <p><strong>① 数组长度 — <code>[T; N]</code> 中的 <code>N</code> 必须是 const</strong></p>
        <CodeBlock>{`const BUFFER_SIZE: usize = 1024;

// 数组的长度必须在编译期就确定。
let buffer: [u8; BUFFER_SIZE] = [0; BUFFER_SIZE];

// let n = 1024;
// let buffer: [u8; n] = [0; n];
// ← 错误! "attempt to use a non-constant value in a constant"
//   普通 let 变量(运行时的值)不能作为数组长度。`}</CodeBlock>

        <p>
          这部分一开始会觉得怪:"为啥定个数组长度也要 const?"
          关键在于 Rust 中<strong>数组的长度不是<em>值</em>,而是<em>类型的一部分</em></strong>。
          我们分三步慢慢来。
        </p>

        <p><strong>第 1 步 — 长度不同的数组是"不同的类型"</strong></p>
        <CodeBlock>{`let a: [i32; 3] = [1, 2, 3];
let b: [i32; 5] = [1, 2, 3, 4, 5];

// a 和 b "都是 i32 数组",但"类型不同"。
// 下面的代码会编译错误:
let mut x: [i32; 3] = a;
// x = b;
// ^^^^ expected an array with a fixed size of 3 elements,
//      found one with 5 elements

fn print_three(arr: [i32; 3]) { println!("{:?}", arr); }

print_three(a);   // OK
// print_three(b); // 错误!要的是 3 元素数组,给的是 5 元素`}</CodeBlock>
        <p>
          换句话说,<code>[i32; 3]</code> 和 <code>[i32; 5]</code> 的差别就和 <code>i32</code> 与
          <code>f64</code> 之间一样大。数字 "3" 是直接刻进类型名里的。
        </p>

        <p><strong>第 2 步 — 编译器必须提前算好每个变量占多少空间</strong></p>
        <p>
          Rust 编译器把一个函数翻译成机器码时,会<em>提前</em>为每个变量保留占用的位置。
          <code>i32</code> 是 4 字节,<code>bool</code> 是 1 字节,<code>[i32; 3]</code> 是 12 字节(4×3),
          <code>[i32; 5]</code> 是 20 字节(4×5)等等。
          这些算完之后,才能确定"这个函数执行时需要多少空间",然后才能生成机器码。
        </p>
        <CodeBlock>{`fn main() {
    let x: [i32; 3] = [1, 2, 3];   // 编译器:"嗯,x 需要 12 字节的空位"
    let y: [i32; 5] = [1; 5];      // "y 需要 20 字节的空位"
    // ...
}
// 编译器生成机器码时已经知道 "x 是 12 字节,y 是 20 字节",
// 因此函数开始执行时就能一次性分配所需空间。`}</CodeBlock>
        <p>
          现在问题来了:如果 <code>[u8; n]</code> 里的 <code>n</code> 是<em>运行时决定的值</em>,
          编译器在生成机器码的时候就<strong>没有办法知道这个变量到底多少字节</strong>。
          "要运行时才知道的大小",按定义就不可能在编译期确定。
          所以 Rust 干脆画了一条死线:"数组的长度必须是编译期可知的值"。
          <code>const</code>、字面量、<code>const fn</code> 的结果 —— 编译器"现在"就能算出来的东西都可以。
          普通 <code>let</code> 变量不行,因为运行之前它的值还不知道。
        </p>

        <p><strong>第 3 步 — "要在运行时决定大小的数组呢?" → <code>Vec&lt;T&gt;</code></strong></p>
        <CodeBlock>{`fn main() {
    // 运行中才确定的大小,例如来自用户输入
    let n: usize = read_size_from_user();

    // let buf: [u8; n] = [0; n];   // ← 不允许
    // 用 Vec 代替 —— 长度不写在类型里
    let buf: Vec<u8> = vec![0; n];  // OK —— 在堆上分配 n 个 u8
    println!("size: {}", buf.len());
}

fn read_size_from_user() -> usize { 1024 }`}</CodeBlock>
        <p>
          <code>Vec&lt;T&gt;</code> 的长度不写在类型里。<code>Vec&lt;u8&gt;</code> 无论装多少个 u8 都是同一个类型。
          长度信息被放在值内部(堆上缓冲区的长度字段),运行时再检查。
          所以基本规则是:
          <strong>"需要编译期确定的大小吗? → 数组 <code>[T; N]</code>。否则 → <code>Vec&lt;T&gt;</code>。"</strong>
          (<code>Vec</code> 的内部结构会在 Step 4 和所有权、堆一起详细讲 —— 现在只要知道它是"运行时大小数组的替代品"就够了。)
        </p>

        <Callout title="💡 与 Java 最大的差别正是在这里">
          Java 里 <code>new int[n]</code> 之所以可以随便用,是因为 Java 数组<em>永远</em>是堆对象,
          长度作为对象头的一个字段存在。也就是说,Java 的数组其实更像 Rust 的 <code>Vec</code>。
          而 Rust 的 <code>[T; N]</code> 反而更接近 C 的 <code>int arr[3];</code> ——
          "这个变量本身就是一段 12 字节的连续空间"这种低层次概念。
          所以 Rust 把两种情况明确地分开了:固定大小用数组,运行时大小用 <code>Vec</code>。
        </Callout>

        <p><strong>② const 泛型 — 把数字作为类型参数</strong></p>
        <CodeBlock>{`// 长度作为类型一部分的矩阵 —— N 是编译期常量
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
    let m: Matrix<3, 4> = Matrix::new();      // 3x4 —— 尺寸刻在类型里
    let n: Matrix<2, 2> = Matrix::new();      // 2x2 —— 不同的类型!

    // 有了这个,编译器能把错误的乘法当成"类型错误"抓住:
    // fn mul<const A: usize, const B: usize, const D: usize>(
    //     x: Matrix<A, B>, y: Matrix<B, D>
    // ) -> Matrix<A, D> { ... }
    // Matrix<3, 4> * Matrix<5, 2> ← 编译错误:B 不一致
}`}</CodeBlock>
        <p>
          <strong>const 泛型(const generics)</strong>是 Rust 1.51(2021 年)之后稳定的功能,
          允许你像传类型参数一样把<em>数字</em>作为泛型参数传入。
          可以把数组长度、位宽、SIMD 通道数等等刻进类型里,
          从而<strong>把"3x4 不能乘 5x2"变成编译期就能证明的事实</strong>。
          作用和 C++ 的 <code>template&lt;std::size_t N&gt;</code> 几乎一样。
        </p>

        <p><strong>③ <code>const fn</code> — 在编译期求值的函数</strong></p>
        <CodeBlock>{`// const fn 是可以在 const 上下文中调用的函数
const fn square(x: usize) -> usize {
    x * x
}

// 既能用在 const 里,也能用在数组长度里
const AREA: usize = square(16);         // 编译期求值为 256
let grid: [u8; square(8)] = [0; square(8)]; // [u8; 64]

// 当然,普通运行时值也能调用
fn main() {
    let side = 5;
    println!("{}", square(side));       // 运行时调用也可以 —— 25
}`}</CodeBlock>
        <p>
          关键点是:"只有用 <code>const fn</code> 声明的函数才能在 <code>const</code> 上下文中调用。"
          const 上下文包括 <code>const BUFFER_SIZE: usize = ...</code> 的右边、
          <code>[T; N]</code> 的 N 位置、const 泛型实参位置等。
          标准库也越来越多地把像 <code>u32::from_be_bytes</code>、<code>usize::pow</code>、
          <code>Option::is_some</code> 这样的方法设为 <code>const fn</code>,
          鼓励"不要手动算魔法数字,用代码算出来并保存为常量"的写法。
        </p>
        <Callout title="🧠 const fn 的限制 —— 必须是纯函数">
          <code>const fn</code> 的函数体必须是确定性的 —— 堆分配、I/O、随机数、线程、读写可变静态变量等
          "与外部世界打交道"的操作全部被禁止。因为编译器需要直接执行这段代码。
          Rust 每升级一个版本,const fn 允许的操作就更多一些,曾经不行的东西现在可能已经能用了。
        </Callout>

        <p><strong>④ match 模式、属性参数、数组初始化等</strong></p>
        <CodeBlock>{`const OK: u32 = 200;
const NOT_FOUND: u32 = 404;

fn classify(status: u32) {
    match status {
        OK        => println!("ok"),     // 把 const 当作模式 —— 行为类似字面量
        NOT_FOUND => println!("missing"),
        _         => println!("其他 {status}"),
    }
}

// #[repr(align(N))]、#[repr(C)] 等属性中的数字参数、
// [0u8; const 表达式]、静态数组初始化 —— 这些都是 const 上下文。`}</CodeBlock>

        <h3>🆚 C/C++/Java 中同一个位置上是什么?</h3>
        <CodeTabs
          caption="数组长度与编译期函数"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java — "编译期常量"的概念非常有限
public static final int BUFFER_SIZE = 1024; // 只有原始类型/String 才是真正的编译期常量

// 数组长度可以是运行时的值 —— 反正是在 JVM 堆上动态分配
byte[] buffer = new byte[BUFFER_SIZE];
int n = readFromConfig();
byte[] dyn = new byte[n];                   // OK —— 不需要是编译期常量

// 没有"编译期函数"。要生成复杂常量,只能在
// static 块里初始化,或者借助外部构建脚本。
static final int AREA;
static { AREA = computeAtClassLoad(); }     // 在类加载时执行(仍然是运行时)`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 最贴近 Rust const 的东西是 constexpr
constexpr std::size_t BUFFER_SIZE = 1024;

// C 风格栈数组的长度必须是常量表达式
std::uint8_t buffer[BUFFER_SIZE] = {};
// int n = read();
// std::uint8_t dyn[n];  // 非标准 VLA。标准 C++ 里是错的。
// → 运行时大小用 std::vector<uint8_t>(n) 替代。(角色同 Rust 的 Vec)

// 非类型模板参数(non-type template parameter)
template <std::size_t R, std::size_t C>
struct Matrix { std::array<std::array<double, C>, R> data{}; };
// ↑ 基本就是 Rust const 泛型的对应物

// constexpr 函数 —— C++11 引入,之后每个版本都在扩充能力
constexpr std::size_t square(std::size_t x) { return x * x; }
constexpr auto AREA = square(16);      // 256 —— 编译期计算`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— const 恰好契合这些所有位置
const BUFFER_SIZE: usize = 1024;

let buffer: [u8; BUFFER_SIZE] = [0; BUFFER_SIZE];  // 栈数组
// let n = read();
// let dyn: [u8; n] = ...;  // 错:不能用运行时值
// → 改用 Vec::with_capacity(n)

// const 泛型
struct Matrix<const R: usize, const C: usize> {
    data: [[f64; C]; R],
}

// const fn —— 相当于 C++ 的 constexpr
const fn square(x: usize) -> usize { x * x }
const AREA: usize = square(16);        // 256

// 与 Java 的根本区别:Rust 和 C++ 都把
// "编译期 = 类型系统的一部分资源"这个观念深植其中,
// 而 Java 则基本一切都在运行时完成。`,
            },
          ]}
        />
        <p>
          总结一下:在 Java 里,"常量"通常指的是<em>程序启动后也不变的值</em>,JVM 把几乎一切都在运行时处理。
          而在 Rust 和 C++ 里,<code>const</code>/<code>constexpr</code> 属于更高一层的概念 ——
          <strong>编译器可以直接把值刻到使用位置上</strong>,因此可以作为数组长度、类型参数、模式匹配等
          <em>类型系统的一部分</em>来使用。
          一开始这种区分会让人觉得麻烦,但一旦接触到 const 泛型这种"数字被刻进类型"的世界,
          就能写出大量不需要运行时验证的代码。
        </p>

        <h3>稍等 —— <code>const</code> vs <code>static</code></h3>
        <p>
          Rust 还有一个形似的 <code>static</code> 关键字,容易搞混。
          细节先不展开,但有一点必须记住。
        </p>
        <ul>
          <li>
            <code>const</code> 表示的是<em>值</em>。每个使用处,编译器都<em>把值复制进去</em>。
            它没有内存地址,因此 <code>&amp;CONST</code> 在不同场合可能指向新的临时值。
          </li>
          <li>
            <code>static</code> 表示的是<em>固定的内存位置</em>。在整个程序中只有一个地址,
            用于需要全局共享的数据(日志级别、缓存、懒初始化的单例等)。
            需要修改时,要用 <code>static mut</code>(unsafe)或包一层 <code>OnceLock</code>/<code>Mutex</code>。
          </li>
        </ul>
        <p>
          只需要一个带名字的数字 → 用 <code>const</code>;需要地址,或初始化成本很高 → 用 <code>static</code>。
          本课程的常规示例里几乎都用 <code>const</code> 就够了。
        </p>

        <h3>🔄 Shadowing(遮蔽) — 有规则地"复用名字"</h3>
        <p>
          Shadowing 是<em>用同一个名字再声明一次 <code>let</code></em>。
          第一次看到会觉得"这不就等于 <code>mut</code> 吗?",但其实有三个关键差别。
        </p>

        <p><strong>① 可以改变类型</strong></p>
        <CodeBlock>{`// 最常见的模式 —— 解析:&str → 数字
let input = "42";              // &str
let input: u32 = input.parse().unwrap(); // u32 —— 用同一个名字再声明
println!("{}", input + 1);     // 43

// mut 做不到 —— 类型是固定的
// let mut input = "42";
// input = input.parse().unwrap(); // ← 类型不一致,报错`}</CodeBlock>
        <p>
          Java 里做这件事就得起不同的名字,比如 <code>inputStr</code> 和 <code>inputNum</code>。
          这样一来下面的代码里"原来的字符串好像还能用",给人一种陷阱。
          Rust 的 shadowing 让编译器强制"<em>之前的名字已经不是这个名字了</em>",根本没有这种陷阱。
        </p>

        <p><strong>② 结果仍然是不可变的</strong></p>
        <CodeBlock>{`let spaces = "   ";              // &str, 不可变
let spaces = spaces.len();       // usize, 仍然不可变 —— shadowing
// spaces = 10;                  // ← 错!不是 mut,不能再赋值`}</CodeBlock>
        <p>
          <code>mut</code> 的意思是"这个变量以后还会被改",而 shadowing 的意思是
          "在这里一次性换成一个新值,然后再次变回不可变"。
          也就是说,shadowing 是<strong>一种不引入可变性就能表达转换流水线的手段</strong>。
        </p>

        <p><strong>③ 离开作用域后恢复为原值</strong></p>
        <CodeBlock>{`fn main() {
    let x = 5;
    println!("外层 x = {x}");   // 5

    {
        let x = x * 2;            // 在内层作用域里 shadowing
        println!("内层 x = {x}"); // 10
    }

    println!("再次外层 x = {x}"); // 5 —— 原值没有被动过
}`}</CodeBlock>
        <p>
          这是 <code>mut</code> 无法模拟的。用 <code>mut x</code> 改写的话,外层作用域里也会永远看到被改过的值。
          Shadowing 让你能在类型系统里直接表达"只在这个块里想给 x 赋予另一种意义" ——
          就像数学证明里说"在本证明中,我们定义 x 为……"那样。
        </p>

        <h3>🆚 为什么在 Java/C++ 里 shadowing 不方便</h3>
        <CodeTabs
          caption="解析后复用 —— 三种语言比较"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— 不能再声明同名变量。只能起不同的名字。
String inputStr = "42";
int input = Integer.parseInt(inputStr);
// 下面 inputStr(字符串)和 input(数字)都还在作用域里。
// 一不小心又去用 inputStr,就是一个常见 bug。
System.out.println(input + 1);`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 只能在内层块作用域里再声明同名变量,
// 在同一作用域内则是错误。
std::string input_str = "42";
int input = std::stoi(input_str);
// 原字符串同样还活着,依然容易让人搞混。
std::cout << input + 1;`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— 用同一个名字覆盖掉,原来的变量无法再访问。
let input = "42";
let input: i32 = input.parse().unwrap();
// 在这之下 'input' 只是 i32。字符串版本像不存在一样被遮住。
println!("{}", input + 1);`,
            },
          ]}
        />
        <Callout title="💡 mut vs shadowing —— 什么时候用哪个?">
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li><strong>对同一类型多次更新</strong>(计数器、累加和):<code>let mut</code>。</li>
            <li><strong>一次转换后又回到不可变</strong>(解析、归一化、聚合结果):shadowing。</li>
            <li><strong>转换过程中类型会变</strong>(<code>String → usize</code>):只能用 shadowing。</li>
            <li><strong>只想在特定块里赋予不同含义</strong>:使用内层作用域 shadowing。</li>
          </ul>
        </Callout>

        <h3>动手练习</h3>
        <p>把下面的代码保存到 <code>src/main.rs</code>,用 <code>cargo run</code> 运行一遍。</p>
        <CodeBlock>{`fn main() {
    // 1) 不可变变量 —— 重新赋值就会编译错误
    let x = 5;
    println!("x = {x}");
    // x = 10;  // ← 取消注释就会看到编译错误!

    // 2) mut —— 可变变量
    let mut y = 10;
    println!("y 修改前 = {y}");
    y = 20;
    println!("y 修改后 = {y}");

    // 3) const —— 编译期常量(必须写类型,使用 SCREAMING_SNAKE_CASE)
    const MAX_SCORE: u32 = 100;
    println!("最大分数 = {MAX_SCORE}");

    // 4) shadowing —— 用同一个名字再声明 let(类型也可以改变)
    let spaces = "   ";           // &str 类型
    let spaces = spaces.len();    // 现在是 usize!
    println!("空格数 = {spaces}");
}`}</CodeBlock>

        <Checklist
          items={[
            <><code>cargo run</code> 的输出里包含 <code>x = 5</code>、<code>y 修改后 = 20</code> 等。</>,
            <>取消注释 <code>x = 10;</code> 后会出现编译错误。</>,
            <><code>const</code> 省略类型会报错。</>,
            <>能解释 shadowing(可以改变类型)和 <code>mut</code> 的区别。</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-01-variables-and-mutability.html", text: "The Rust Book — 3.1 Variables and Mutability" },
          ]}
        />
      </Module>

      {/* ===== M2 ===== */}
      <Module badge="M2" title="📦 数据类型 · 类型推断 · 元组 · 数组 · &str vs String">
        <Lede>Rust 是静态类型语言,但实际上大部分情况下不需要手动写类型。</Lede>

        <p>
          Rust 的类型大致分为<strong>语言内置的原始类型(primitive)</strong>
          和<strong>标准库提供的类型</strong>。
          本节不会深入每一个,但这些名字以后会在各处反复出现,所以先整体过一遍有帮助。
          先看分类表格,之后再详细讲常用的几个。
        </p>

        <h3>📚 Rust 数据类型一览</h3>

        <p><strong>1. 标量(Scalar)原始类型 — 装"单个值"的类型</strong></p>
        <table>
          <thead>
            <tr>
              <th>分类</th>
              <th>类型</th>
              <th>大小</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>有符号整数</td>
              <td><code>i8</code>、<code>i16</code>、<code>i32</code>、<code>i64</code>、<code>i128</code>、<code>isize</code></td>
              <td>1·2·4·8·16 B,指针宽度</td>
              <td>默认 <code>i32</code></td>
            </tr>
            <tr>
              <td>无符号整数</td>
              <td><code>u8</code>、<code>u16</code>、<code>u32</code>、<code>u64</code>、<code>u128</code>、<code>usize</code></td>
              <td>1·2·4·8·16 B,指针宽度</td>
              <td>索引和长度用 <code>usize</code></td>
            </tr>
            <tr>
              <td>浮点数</td>
              <td><code>f32</code>、<code>f64</code></td>
              <td>4 B、8 B</td>
              <td>IEEE 754,默认 <code>f64</code></td>
            </tr>
            <tr>
              <td>布尔</td>
              <td><code>bool</code></td>
              <td>1 B</td>
              <td><code>true</code> / <code>false</code></td>
            </tr>
            <tr>
              <td>字符</td>
              <td><code>char</code></td>
              <td>4 B</td>
              <td>Unicode scalar value。<code>'a'</code>、<code>'❤'</code>、<code>'가'</code></td>
            </tr>
            <tr>
              <td>单元类型</td>
              <td><code>()</code></td>
              <td>0 B</td>
              <td>表示"没有值",相当于 C 的 <code>void</code></td>
            </tr>
            <tr>
              <td>Never 类型</td>
              <td><code>!</code></td>
              <td>—</td>
              <td>永不返回的函数的返回类型(<code>panic!</code>、无限循环等)</td>
            </tr>
          </tbody>
        </table>

        <p><strong>2. 复合(Compound)原始类型 — 把多个值组合到一起</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>语法</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>元组</td>
              <td><code>(T1, T2, ...)</code></td>
              <td>把不同类型按固定个数组合,用 <code>.0</code>、<code>.1</code> 访问</td>
            </tr>
            <tr>
              <td>数组</td>
              <td><code>[T; N]</code></td>
              <td>N 个相同类型的连续元素,长度是类型的一部分</td>
            </tr>
            <tr>
              <td>切片(slice)</td>
              <td><code>[T]</code>(实际使用 <code>&amp;[T]</code>)</td>
              <td>指向数组/Vec 中一段连续区间的视图,指针 + 长度</td>
            </tr>
            <tr>
              <td>字符串切片</td>
              <td><code>str</code>(实际使用 <code>&amp;str</code>)</td>
              <td>UTF-8 字符串视图。字面量 <code>"hello"</code> 就是 <code>&amp;'static str</code></td>
            </tr>
          </tbody>
        </table>

        <p><strong>3. 引用与指针类型 — 指向内存位置的类型</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>说明</th>
              <th>使用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>&amp;T</code></td>
              <td>不可变引用(借用)</td>
              <td>只读访问 —— Step 4 详讲</td>
            </tr>
            <tr>
              <td><code>&amp;mut T</code></td>
              <td>可变引用(独占借用)</td>
              <td>需要读写时</td>
            </tr>
            <tr>
              <td><code>*const T</code>、<code>*mut T</code></td>
              <td>原始指针</td>
              <td>在 <code>unsafe</code> 块中用于 FFI 或底层操作</td>
            </tr>
            <tr>
              <td><code>fn(A) -&gt; B</code></td>
              <td>函数指针</td>
              <td>把函数当作值传递(和闭包不同 —— Step 7)</td>
            </tr>
          </tbody>
        </table>

        <p><strong>4. 堆分配与所有权相关的标准类型(Step 4、Step 8 预告)</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>作用</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>String</code></td>
              <td>堆上拥有的可变 UTF-8 字符串</td>
            </tr>
            <tr>
              <td><code>Vec&lt;T&gt;</code></td>
              <td>堆上的动态数组(长度可在运行时变化)</td>
            </tr>
            <tr>
              <td><code>Box&lt;T&gt;</code></td>
              <td>堆上单一所有者持有的值</td>
            </tr>
            <tr>
              <td><code>Rc&lt;T&gt;</code> / <code>Arc&lt;T&gt;</code></td>
              <td>引用计数的共享所有权(单线程 / 多线程)</td>
            </tr>
            <tr>
              <td><code>Cell&lt;T&gt;</code> / <code>RefCell&lt;T&gt;</code></td>
              <td>通过不可变引用修改内部值(interior mutability)</td>
            </tr>
            <tr>
              <td><code>Cow&lt;'a, T&gt;</code></td>
              <td>"先只读借用,要修改时再复制"</td>
            </tr>
          </tbody>
        </table>

        <p><strong>5. 核心泛型类型 — 几乎每段代码里都会出现(Step 5、Step 7)</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>作用</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Option&lt;T&gt;</code></td>
              <td><code>Some(T)</code> / <code>None</code> —— 没有 null 的"可能有值可能没有"</td>
            </tr>
            <tr>
              <td><code>Result&lt;T, E&gt;</code></td>
              <td><code>Ok(T)</code> / <code>Err(E)</code> —— 错误处理(替代异常)</td>
            </tr>
            <tr>
              <td><code>Range&lt;T&gt;</code>、<code>RangeInclusive&lt;T&gt;</code>...</td>
              <td>像 <code>0..10</code>、<code>0..=10</code> 这样的迭代区间</td>
            </tr>
          </tbody>
        </table>

        <p><strong>6. 集合(std::collections)</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>性质</th>
              <th>Java 对应</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Vec&lt;T&gt;</code></td>
              <td>动态数组</td>
              <td><code>ArrayList</code></td>
            </tr>
            <tr>
              <td><code>VecDeque&lt;T&gt;</code></td>
              <td>双端队列</td>
              <td><code>ArrayDeque</code></td>
            </tr>
            <tr>
              <td><code>LinkedList&lt;T&gt;</code></td>
              <td>双向链表(基本不用)</td>
              <td><code>LinkedList</code></td>
            </tr>
            <tr>
              <td><code>HashMap&lt;K, V&gt;</code></td>
              <td>基于哈希的键值对</td>
              <td><code>HashMap</code></td>
            </tr>
            <tr>
              <td><code>BTreeMap&lt;K, V&gt;</code></td>
              <td>有序键值对</td>
              <td><code>TreeMap</code></td>
            </tr>
            <tr>
              <td><code>HashSet&lt;T&gt;</code>、<code>BTreeSet&lt;T&gt;</code></td>
              <td>集合(无序 / 有序)</td>
              <td><code>HashSet</code>、<code>TreeSet</code></td>
            </tr>
            <tr>
              <td><code>BinaryHeap&lt;T&gt;</code></td>
              <td>优先队列(最大堆)</td>
              <td><code>PriorityQueue</code></td>
            </tr>
          </tbody>
        </table>

        <p><strong>7. 文件系统、OS、FFI 字符串</strong></p>
        <table>
          <thead>
            <tr>
              <th>类型</th>
              <th>用途</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>PathBuf</code> / <code>&amp;Path</code></td>
              <td>文件系统路径(按平台处理编码)</td>
            </tr>
            <tr>
              <td><code>OsString</code> / <code>&amp;OsStr</code></td>
              <td>操作系统原生字符串(不一定是 UTF-8)</td>
            </tr>
            <tr>
              <td><code>CString</code> / <code>&amp;CStr</code></td>
              <td>C FFI 用的以 null 结尾的字符串</td>
            </tr>
          </tbody>
        </table>

        <p><strong>8. 用户自定义类型(Step 5 详讲)</strong></p>
        <ul>
          <li><code>struct</code> —— 带字段的结构体。元组结构体 <code>struct Point(f64, f64)</code>、单元结构体 <code>struct Marker</code> 也是变体。</li>
          <li><code>enum</code> —— 表示"多种形态之一"的和类型(sum type)。<code>Option</code>、<code>Result</code> 也是 enum。</li>
          <li><code>union</code> —— 与 C 兼容的 union(主要用于 FFI / <code>unsafe</code>)。</li>
          <li><code>type</code> 别名 —— <code>type Km = u32;</code> 这种,给已有类型换个名字。</li>
          <li><code>trait</code> / <code>dyn Trait</code> / <code>impl Trait</code> —— 描述类型"能做什么"(Step 5 M4)。</li>
        </ul>

        <Callout title="💡 现在不用全都记住">
          这些表格是"目录"。以后每个章节用到什么,再回来查。
          Step 3 现在真正要掌握的是:标量(整数、浮点、bool、char)、元组、数组、<code>&amp;str</code> vs <code>String</code>。
          其余只要"啊,还有这种东西"的程度就够了。
        </Callout>

        <h3>本阶段要关注的重点</h3>
        <p>
          在上面的地图里,Step 3 实际涉及的部分 —— 标量、元组、数组、字符串、类型推断 —— 下面来细讲。
        </p>

        <h3>🧠 类型推断 —— 大多省略,偶尔必须</h3>
        <p>
          Rust 是静态类型语言,但实际代码中手动写类型的频率远低于 Java。
          原因在于 Rust 编译器<strong>会看整个函数体</strong>来推断类型。
          而且这种推断不只是"看等号右边决定左边",还会参考<em>变量后面是怎么用的</em>。
        </p>

        <p><strong>① 最常见的情形 —— 直接从字面量推断</strong></p>
        <CodeBlock>{`let x = 5;          // 整数字面量默认 → i32
let pi = 3.14;      // 浮点字面量默认 → f64
let ok = true;      // bool
let c = '❤';        // char
let s = "hello";    // &str

// 要显式写类型就加上冒号
let x: i64 = 5;     // 覆盖默认值,改成 i64`}</CodeBlock>

        <p><strong>② 不是看前面,而是"看后面"再推断的情形</strong></p>
        <CodeBlock>{`// 只看这一行的话,v 的类型不确定 —— Vec<什么>?
let mut v = Vec::new();

// 但编译器会继续往下看再决定:
v.push(42);
// 这里 42 是 i32 → 因此 v: Vec<i32> 被确定。

println!("{:?}", v); // [42]`}</CodeBlock>
        <p>
          这种"前后都看"的推断,正是 Rust 和 Java 的 <code>var</code>、C++ 的 <code>auto</code> 最大的不同点。
          Java 的 <code>var v = new ArrayList&lt;&gt;();</code> 只看<em>这一行</em>决定类型,
          所以会落到 <code>ArrayList&lt;Object&gt;</code>;
          而 Rust 会看见后面的 <code>v.push(42)</code> 再确定为 <code>Vec&lt;i32&gt;</code>。
        </p>

        <p><strong>③ 推断失败的典型例子 —— <code>parse()</code> 和 <code>collect()</code></strong></p>
        <CodeBlock>{`// 这段代码不会通过编译
// let n = "42".parse().unwrap();
// error[E0284]: type annotations needed
//               cannot infer type of the type parameter \`F\`
//               declared on the method \`parse\`

// 原因:parse() 可以转换为"所有实现了 FromStr 的类型"。
//       i32? u64? f64? 候选太多,编译器挑不出来。

// 三种解决办法 —— 随便选一种给出类型提示即可:

// (a) 在变量上写类型
let n: i32 = "42".parse().unwrap();

// (b) turbofish —— 直接在方法上写类型
let n = "42".parse::<i32>().unwrap();

// (c) 从后面的用法得到提示
let n = "42".parse().unwrap();
let doubled: i32 = n * 2;  // 由此 n 被确定为 i32`}</CodeBlock>
        <p>
          <strong>Turbofish</strong>(<code>::&lt;T&gt;</code>)是 Rust 独有的一种写法。
          因为"调用方法时要在拿到值之前就先定好类型",于是变成了这个形状
          (如果写成 <code>foo.parse&lt;i32&gt;()</code>,就和比较运算符混淆了)。
          在 <code>collect</code>、<code>parse</code>、<code>::from</code> 这种"结果类型由调用方负责"的方法上会经常见到。
        </p>

        <p><strong>④ <code>_</code> 通配符 —— "剩下的你定"</strong></p>
        <CodeBlock>{`// 只指定容器类型,里面装什么让编译器决定
let squares: Vec<_> = (1..=5).map(|n| n * n).collect();
// 编译器知道 (1..=5) 是 i32 区间,n*n 也是 i32,
// 于是把 Vec<_> 中的 _ 填成 i32 → Vec<i32>

// 反过来只指定元素类型,让容器灵活:
let set: std::collections::HashSet<i32> = [1, 2, 3].into_iter().collect();`}</CodeBlock>

        <p><strong>⑤ 必须明确写类型的地方</strong></p>
        <p>Rust 的推断很强大,但"只在函数体内"生效。以下位置必须手动写类型。</p>
        <ul>
          <li><strong>函数参数和返回类型</strong> —— <code>fn add(a: i32, b: i32) -&gt; i32</code></li>
          <li><strong>结构体、enum 的字段</strong> —— <code>struct User {"{ name: String, age: u32 }"}</code></li>
          <li><strong><code>const</code>、<code>static</code> 声明</strong> —— <code>const MAX: u32 = 100;</code></li>
          <li><strong>trait 的关联类型</strong> —— 会在 Step 5~7 出现</li>
        </ul>
        <p>
          为什么函数签名非要写类型?原因有三个。
        </p>
        <ol>
          <li><strong>公共 API 的稳定性</strong> —— 如果签名会随实现变化而变,内部实现动一下就可能让所有调用方崩掉。</li>
          <li><strong>编译时间</strong> —— 跨函数的推断复杂度会爆炸。把推断限定在单个函数内部可以保持快速。</li>
          <li><strong>文档与错误信息</strong> —— 签名显式写出后,编译器可以清晰地指出"期望的类型"与"实际得到的类型"。</li>
        </ol>

        <h3>🆚 Java <code>var</code> · C++ <code>auto</code> · Rust 推断</h3>
        <CodeTabs
          caption="同一场景下各语言的推断极限"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java 10+ —— var 只看"本行等号右边"
var x = 5;                          // int
var list = new ArrayList<Integer>(); // ArrayList<Integer> —— 必须写全
var empty = new ArrayList<>();      // ArrayList<Object> —— 看不到后面的信息

// 不能用在函数参数和返回类型上
// var f(var x) { ... }             // 错

// 字段也不能用 —— 仅限局部变量`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 从 C++11 起有 auto,根据右边表达式的类型决定
auto x = 5;                 // int
auto v = std::vector<int>{}; // std::vector<int>
auto empty = std::vector{};  // 即使在 C++17 也要指定元素类型

// C++14+ 函数返回类型也可以推断,但
// 仍然基于"当前表达式",不会前向推断
auto add(int a, int b) { return a + b; }  // 只推断返回类型`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— 扫描整个函数体,前后都看
let x = 5;              // i32(字面量默认值)
let mut v = Vec::new(); // 暂时 Vec<?> —— 推迟决定
v.push(42);             // ← 这里被确定为 Vec<i32>

// 容器类型和元素类型只提供一边就够了
let v: Vec<_> = (1..=5).collect();    // _ 的位置由编译器填
let v = (1..=5).collect::<Vec<i32>>(); // 或者用 turbofish

// 函数签名必须明确 —— 推断的边界
fn add(a: i32, b: i32) -> i32 {
    let tmp = a + b;     // tmp 被推断为 i32
    tmp
}`,
            },
          ]}
        />

        <Callout title="💡 实战小贴士">
          一开始你可能会忍不住给每个 <code>let</code> 都写上类型。
          但 Rust 的惯用做法是 <strong>"函数签名必须写,函数体内尽量少写"</strong>。
          rust-analyzer 会以行内提示的形式显示推断出来的类型,读代码时并不会吃亏。
          只有当编译器自己都推不出来并报错时,才加类型注解。
        </Callout>

        <h3>字符串 —— <code>&str</code> 与 <code>String</code></h3>
        <p>
          Rust 有两种字符串类型:<code>&str</code>(字符串切片)与 <code>String</code>(堆上分配的可变字符串)。
          现在只要记住"字符串字面量是 <code>&str</code>,动态生成的是 <code>String</code>"就行。
          详细的原理会在 Step 4 讲所有权时一起讲。
        </p>

        <h3>🆚 为什么 Rust 有这么多种整数类型?</h3>
        <p>
          Java 里说到整数,通常就是 <code>int</code>(32 位有符号)或更大的 <code>long</code>(64 位)。
          Rust 却有 <code>i8、i16、i32、i64、i128、isize</code> 和 <code>u8、u16、u32、u64、u128、usize</code>
          共 12 种。为什么?
        </p>
        <ul>
          <li>
            <strong>无符号整数(以 u 开头)是一等公民</strong> —— 可以直接通过类型表达"数组长度不可能是负数"之类的事实。
            Java 里用 <code>int length</code>,而"必须 ≥ 0"的约束只能靠注释和运行时检查来管理。
          </li>
          <li>
            <strong><code>usize</code>/<code>isize</code> 是指针宽度</strong> —— 32 位系统为 32 位,64 位系统为 64 位。
            用于索引、大小等场合,和 C 的 <code>size_t</code> 作用相同。
          </li>
          <li>
            <strong>溢出策略明确</strong> —— debug 构建下,整数溢出会 panic;release 构建下,则是"定义好的回绕(two's complement)"。
            C/C++ 的有符号整数溢出是<em>未定义行为(UB)</em>,优化器甚至会"假设代码不会溢出"而生成奇怪的结果。
            Rust 把这个陷阱直接移除了。
          </li>
        </ul>

        <h3>🆚 <code>&str</code> 和 <code>String</code>:为什么 Java 的 <code>String</code> 一个还不够?</h3>
        <p>
          Java 的 <code>String</code> 是不可变的,永远在堆上,而且没有"视图(view)"的概念。
          要获取子字符串必须调用 <code>substring()</code>,而它会创建一个<em>新对象</em>(Java 7u6 之后)。
          字符串字面量 "hello" 也是编译器放进 <code>String</code> 池里的一个完整对象。
        </p>
        <p>
          Rust 把这一个概念拆成了两个 —— <em>拥有数据的人(<code>String</code>)</em>
          和 <em>只借来看的人(<code>&str</code>)</em>。
        </p>
        <ul>
          <li><code>String</code>:在堆上拥有数据,可变,类似 Java 的 <code>StringBuilder</code>。</li>
          <li><code>&str</code>:指向现有缓冲区某一段的视图(指针 + 长度),不分配。
            <code>&s[0..5]</code> 这种切片也不会发生复制。</li>
        </ul>
        <p>
          正因如此,函数写成 <code>fn greet(name: &str)</code> 后,
          既能接受 <code>String</code>,也能接受字符串字面量或其他 <code>&str</code>,而且<strong>完全不会复制</strong>。
          Java 要做到类似的灵活性,要么用 <code>CharSequence</code>,要么每次都构造新的 <code>String</code>。
        </p>

        <h3>动手练习</h3>
        <p>这是用到元组和数组的示例。保存到 <code>src/main.rs</code> 并运行。</p>
        <CodeBlock>{`fn main() {
    // 标量类型
    let age: i32 = 25;
    let pi: f64 = 3.14159;
    let is_rust_fun: bool = true;
    let heart: char = '❤';
    println!("{age}岁, pi={pi}, fun={is_rust_fun}, {heart}");

    // 元组 —— 组合不同类型
    let person: (&str, i32) = ("Alice", 30);
    println!("name={}, age={}", person.0, person.1);

    // 解构(destructuring)
    let (name, score) = ("Bob", 95);
    println!("{name}的分数是 {score}");

    // 数组 —— 相同类型,长度固定
    let nums: [i32; 5] = [1, 2, 3, 4, 5];
    println!("首个 = {}, 长度 = {}", nums[0], nums.len());

    // 用同一个值初始化
    let zeros = [0; 3]; // [0, 0, 0]
    println!("zeros = {:?}", zeros);

    // &str vs String
    let greeting: &str = "你好";                    // 字符串切片
    let owned: String = String::from("世界");       // 分配在堆上
    println!("{greeting}, {owned}");
}`}</CodeBlock>

        <Checklist
          items={[
            <>能通过 <code>.0</code>、<code>.1</code> 访问元组元素。</>,
            <>亲手测试过数组下标越界会出现什么错误。</>,
            <>能用一句话说清 <code>&str</code> 和 <code>String</code> 的区别。</>,
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
      <Module badge="M3" title="🔀 控制流 — if · loop · while · for,表达式与语句">
        <Lede>Rust 中 <code>if</code> 是表达式,可以返回值。</Lede>

        <p>
          大多数语言里 <code>if</code> 是语句(statement)。在 Rust 里,<code>if</code> 是
          <strong>表达式(Expression)</strong>,所以可以像 <code>let x = if cond {"{"} 1 {"}"} else {"{"} 2 {"}"};</code>
          这样直接把值绑定到变量上。理解了这一点,很多 Rust 代码为什么长那个样子就瞬间有了答案。
        </p>
        <p>
          <strong>表达式(Expression)</strong>是会产生值的代码,
          <strong>语句(Statement)</strong>则不产生值。
          在 Rust 里加上分号(<code>;</code>)会把表达式变成语句。
          这对函数返回值也很重要(M4 会讲)。
        </p>

        <h3>🆚 Java 的 if 和 Rust 的 if 为什么不一样</h3>
        <p>
          Java 里 <code>if</code> 是<em>语句</em>,不会产生值,所以 <code>String grade = if (...) ...</code>
          这样的代码根本编译不过。
          要做复杂分支,只能先声明变量然后在分支里用 <code>=</code> 赋值;简单分支则用三目运算符 <code>?:</code>。
          Rust 因为 <code>if</code> 是<strong>表达式</strong>,所以完全没有这些限制。
        </p>
        <CodeTabs
          caption="按分数评级"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— if 是语句,不返回值
String grade;
if (score >= 90)      grade = "A";
else if (score >= 80) grade = "B";
else                  grade = "C";
// 或者仅在简单情况下用: String grade = (score >= 90) ? "A" : "B";
// 一旦超过三个分支,三目就变得难看,最后还是回到上面的写法。`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 和 Java 一样,if 是语句
std::string grade;
if      (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else                  grade = "C";
// 或者仅在简单情况下用: auto grade = (score >= 90) ? "A" : "B";`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— if 返回值,所以能直接绑定到 let
let grade = if score >= 90 {
    "A"
} else if score >= 80 {
    let bonus = if extra_credit { "+" } else { "" };
    "B"  // 分支里嵌再复杂的东西也没关系,最后一个表达式就是值
} else {
    "C"
};`,
            },
          ]}
        />
        <p>
          这种理念同样贯穿于 <code>match</code>、<code>loop</code> 和块 <code>{"{}"}</code>。
          "几乎所有东西都有值"这条方针让"先声明再重赋值"的模式大幅减少,
          也和默认不可变的设计自然契合。
        </p>

        <h3>🔁 <code>loop</code> —— Rust 独有的"专用"无限循环关键字</h3>
        <p>
          Java 和 C++ 都没有专门表示"无限循环"的关键字,习惯上写 <code>while(true)</code> 或 <code>for(;;)</code>。
          Rust 把这个位置交给了一个独立关键字 <strong><code>loop</code></strong>,
          而且它并不只是 syntactic sugar,背后有三个理由。
        </p>

        <p><strong>① 编译器可以知道"这个循环永远不会结束"</strong></p>
        <p>
          <code>while(true)</code> 在语法上被假设"true 这个<em>条件表达式</em>以后可能变成 false",
          所以对类型推断没什么帮助。
          <code>loop</code> 按定义就是无限循环,因此它可以返回 <strong>Never 类型 <code>!</code></strong>,
          这样我们就能在类型系统层面描述"永远不会返回的函数"。
        </p>
        <CodeBlock>{`fn forever() -> ! {
    loop {
        // 编译器可以保证这个函数绝对不会返回。
        // Never 类型(!)可以替代任何类型,所以下面这种
        // "出错就 panic" 的模式写起来很自然。
    }
}

fn get_or_die(x: Option<i32>) -> i32 {
    match x {
        Some(n) => n,
        None => forever(),   // ! 可以放进 i32 的位置
    }
}`}</CodeBlock>

        <p><strong>② <code>loop</code> 是"会返回值的表达式"</strong></p>
        <p>
          与 <code>while</code>、<code>for</code> 不同,<code>loop</code> 是<em>表达式</em>。
          给 <code>break</code> 带一个值,那就是整个循环的值,可以直接用 <code>let</code> 接住。
          "重试直到成功"或"找到满足条件的第一个值"这种场景尤其干净。
        </p>
        <CodeTabs
          caption="找到满足条件的值并返回"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— while(true) + 外部变量/标志
int result = -1;
while (true) {
    int candidate = randomNumber();
    if (isPrime(candidate)) {
        result = candidate;
        break;
    }
}
// 光是把值接住就要"声明 → 循环 → 赋值 → break"四步。`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— for(;;) 或 while(true) + 外部变量,模式一致
int result = -1;
for (;;) {
    int candidate = random_number();
    if (is_prime(candidate)) {
        result = candidate;
        break;
    }
}
// 也可以用 lambda 立即调用(IIFE)封装起来,但和 Java 的限制差不多。`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— loop 会返回值,直接用 let 接
let first_prime = loop {
    let candidate = random_number();
    if is_prime(candidate) {
        break candidate;    // 这个值就是 first_prime
    }
};
// "声明/赋值/break"三重奏压缩成了一行。
// 而且 first_prime 是不可变的(let),顺手就确定下来了。`,
            },
          ]}
        />

        <p><strong>③ 意图清晰</strong></p>
        <p>
          看到 <code>while(true)</code> 的读者会下意识怀疑:"条件以后会不会变?"
          而 <code>loop</code> 用一个词就声明:"这里除非内部 <code>break</code>,否则永远不停"。
          看似微不足道,但在大型代码库里,这种意图传达累加起来对可读性很有帮助。
        </p>

        <h3>⏳ <code>while</code> —— 熟悉,但有两点不同</h3>
        <p>
          <code>while</code> 是最熟悉的形态:条件为真时重复执行代码块。
          日常用法和 Java/C++ 基本相同,但在两处有区别。
        </p>

        <p><strong>① 没有 <code>do...while</code></strong></p>
        <CodeTabs
          caption="一直读到合法输入为止"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— do-while:"先执行一次再检查条件"
int n;
do {
    n = readInput();
} while (n < 0);
// n 里就是合法的值(>= 0)。`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 和 Java 同样支持 do-while
int n;
do {
    n = read_input();
} while (n < 0);`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— 没有 do-while,用 loop + break 代替
let n = loop {
    let x = read_input();
    if x >= 0 { break x; }
};
// 结果反而更短:
// 因为 loop 是会返回值的表达式,所以"等到合法值时退出循环并把它绑到变量上"
// 一步就完成了。`,
            },
          ]}
        />
        <p>
          Rust 的设计者去掉 <code>do-while</code> 是因为他们判断
          "<code>loop + break 值</code>的组合能更干净地完成同样的事"。
          实际上 do-while 最常见的用法"执行一次后再检查"在 Rust 里用 loop 只要一行。
        </p>

        <p><strong>② <code>while let</code> —— 用模式匹配来循环</strong></p>
        <CodeBlock>{`let mut stack = vec![1, 2, 3, 4, 5];

// "只要 pop() 返回 Some 就继续" —— 模式匹配成功就继续循环
while let Some(top) = stack.pop() {
    println!("{}", top);
}
// 输出:5, 4, 3, 2, 1

// 用 Java 写同样的逻辑:
// while (!stack.isEmpty()) {
//     int top = stack.pop();
//     System.out.println(top);
// }
// → "判空"和"取值"被拆成了两步。`}</CodeBlock>
        <p>
          <code>while let</code> 把"条件 + 取值"合并为一次表达。
          在使用 <code>Option</code>、<code>Result</code>、迭代器的 <code>next()</code>
          这种"有值就拿出来,没值就停止"的结构时尤其得力。
          Java 那种"先判空再 pop"的两步法消失了。模式匹配在 Step 5 会详细讲。
        </p>

        <p><strong>③ <code>while</code> 不返回值</strong></p>
        <p>
          和 <code>loop</code> 是表达式不同,<code>while</code> 永远只返回 <code>()</code>(单元类型)。
          为什么?因为 while 如果条件一开始就是 false,<em>就可能一次都不执行</em>。
          那样的话"循环产生的值"不存在,类型系统也没法一致地回答"这个表达式的值是什么"。
          要拿到值就用 <code>loop + break</code>,或者用迭代器的 <code>.find()</code>/<code>.fold()</code>。
        </p>

        <h3>🆚 <code>for</code> 循环的设计哲学 —— 为什么抛弃了 C/Java 的"索引风格"</h3>
        <p>
          Rust 的 <code>for</code> 不支持 C/Java/C++ 风格的 <code>for(int i=0; i&lt;n; i++)</code>。
          它只接受迭代器(<code>1..n</code>、集合的 <code>.iter()</code> 等)。
          比较一下三种语言写"从 1 加到 10"的代码,差别就很清楚了。
        </p>
        <CodeTabs
          caption="计算 1 到 10 的和"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— 索引式 for 和 enhanced-for 两种写法并存
int sum = 0;
for (int i = 1; i <= 10; i++) {  // 传统 C 风格 —— off-by-one 风险一直都在
    sum += i;
}

// 或者对集合用 enhanced-for
int[] arr = {1,2,3,4,5,6,7,8,9,10};
for (int x : arr) { sum += x; }

// 两种语法并存,而且传统 for 里 i <= n vs i < n 的笔误依然频发。`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 索引式 for 和 C++11 的 range-based for 并存
int sum = 0;
for (int i = 1; i <= 10; ++i) sum += i;  // 传统风格

// C++11+ 的 range-based
std::vector<int> v = {1,2,3,4,5,6,7,8,9,10};
for (int x : v) sum += x;

// 背后依然依赖 .begin()/.end() 迭代器,
// 和 Java 一样两种语法并存。`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— 只有一种 for 语法,后面必须跟"迭代器"
let sum: i32 = (1..=10).sum();   // 迭代器 + sum() —— 最常用的写法

// 或者传统 for 风格
let mut sum = 0;
for i in 1..=10 {
    sum += i;
}

// 对集合:
let arr = [1,2,3,4,5,6,7,8,9,10];
let mut sum = 0;
for x in arr { sum += x; }

// for 语法只有一种,后面必须是实现了 IntoIterator 的值。`,
            },
          ]}
        />

        <p>
          Rust 的 <code>for ... in ...</code> 在内部会调用
          <strong><code>IntoIterator::into_iter()</code></strong> 拿到迭代器,
          然后反复调用 <code>next()</code> —— 这就是 <em>desugar</em>(脱糖)。
          换句话说,"for 循环只在迭代器上运行"是语言级的契约。
          这样设计带来的好处如下:
        </p>
        <ul>
          <li>
            <strong>消除缓冲区溢出</strong> —— C 里 <code>for(int i=0; i&lt;=n; i++)</code> 那种
            "off-by-one"越界 bug 从根本上被挡住。迭代器自己知道集合的实际长度,结束点由它决定。
          </li>
          <li>
            <strong>对优化器友好</strong> —— 像 <code>1..=1000</code> 这样的区间,
            编译器会消除边界检查(bounds-check elimination),LLVM 甚至会做 SIMD 和循环展开。
            最终生成的汇编和 C 的指针循环一致。
          </li>
          <li>
            <strong>循环变量默认不可变</strong> —— <code>for i in 0..10</code> 里的 <code>i</code>
            是每次迭代新建的不可变绑定。试图写 <code>i = 5;</code> 会编译错误。
            再也不会出现 Java 传统 for 里"在循环体里偷偷改计数器导致 off-by-one"的情况。
          </li>
          <li>
            <strong>不能在遍历集合时修改它</strong> —— 借用规则(Step 4)会自动生效,
            C++ 的迭代器失效和 Java 的 <code>ConcurrentModificationException</code> 都在编译期被阻止。
          </li>
          <li>
            <strong>迭代器可以自然地链式组合</strong> ——
            <code>for x in (1..100).filter(|n| n % 3 == 0).map(|n| n * n) {"{ ... }"}</code>
            这种组合,运行时不会产生中间分配,最终被融合成一个循环(Step 7 详讲)。
          </li>
        </ul>

        <Callout title="💡 那真的需要索引怎么办?">
          真的需要索引时用 <code>.enumerate()</code>:
          <code>{"for (i, item) in items.iter().enumerate() { ... }"}</code>
          这样同时拿到索引 <code>i</code> 和元素 <code>item</code>,只在需要时引用索引即可。
          如果你要的是"像 <code>1..=100</code> 这种数字本身",那就直接遍历区间,与 C 的 for 基本没差别。
        </Callout>

        <h3>🏷️ 标签(Label) —— 干净地跳出嵌套循环</h3>
        <p>
          在嵌套循环里,想"一次跳出外层循环"是常见需求。
          Java 有 <code>break label;</code>,而 C++ 没有,只能靠标志变量或 <code>goto</code>。
          Rust 像 Java 一样支持显式标签,但写法独特 —— 用<strong>带单引号前缀的 <code>'name</code></strong>。
        </p>
        <CodeTabs
          caption="在二维数组中查找符合条件的一对"
          tabs={[
            {
              label: "Java",
              lang: "java",
              code: `// Java —— 用 'outer:' 打标签,然后 break outer;
outer:
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        if (grid[i][j] == target) {
            System.out.println("found " + i + "," + j);
            break outer;   // 一次跳出两层循环
        }
    }
}`,
            },
            {
              label: "C++",
              lang: "cpp",
              code: `// C++ —— 没有语言级的带标签 break。只能选一种方式。
// 1) 标志变量
bool found = false;
for (int i = 0; i < rows && !found; i++) {
    for (int j = 0; j < cols && !found; j++) {
        if (grid[i][j] == target) {
            std::cout << "found " << i << "," << j;
            found = true;
        }
    }
}

// 2) goto(仍然合法但不被推荐)
// 3) 把循环抽成函数 + return`,
            },
            {
              label: "Rust",
              lang: "rust",
              code: `// Rust —— 'outer: 标签 + break 'outer
'outer: for i in 0..rows {
    for j in 0..cols {
        if grid[i][j] == target {
            println!("found {},{}", i, j);
            break 'outer;      // 跳出两层循环
        }
    }
}

// continue 也可以带标签 —— 从内层直接跳到外层的"下一次迭代"
'row: for i in 0..rows {
    for j in 0..cols {
        if should_skip_row(i) {
            continue 'row;     // 外层 for 的 i 前进到下一个值
        }
    }
}`,
            },
          ]}
        />
        <p>
          <code>'outer</code> 这个名字和生命周期语法长得很像,一开始可能会搞混。
          实际上 Rust 的循环标签和生命周期<em>只是写法相同</em>,使用的是不同的命名空间。
          在 Step 4 讲生命周期时你会再遇到 <code>'a</code>,那时难免会想"怎么又出现了?",
          但其实不会真的混淆,编译器会根据上下文区分它们。
        </p>

        <h3>动手练习</h3>
        <p>下面这个示例把条件和各种循环都写进来了。</p>
        <CodeBlock>{`fn main() {
    // if 表达式 —— 返回值
    let score = 85;
    let grade = if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else {
        "C"
    };
    println!("分数={score}, 等级={grade}");

    // loop —— 可以用 break 返回值
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 5 {
            break counter * 10; // 返回 50
        }
    };
    println!("loop 结果 = {result}");

    // while
    let mut n = 3;
    while n > 0 {
        println!("倒计时: {n}");
        n -= 1;
    }
    println!("发射!");

    // for —— 最常用的循环
    let fruits = ["苹果", "香蕉", "葡萄"];
    for fruit in fruits {
        println!("水果: {fruit}");
    }

    // 用区间(Range)遍历
    for i in 1..=3 {
        println!("i = {i}");
    }

    // 表达式 vs 语句
    let a = {
        let x = 3;
        x + 1       // 无分号 → 表达式 → 返回值 4
    };
    println!("块表达式结果 = {a}");
}`}</CodeBlock>

        <Checklist
          items={[
            <>理解 <code>if</code> 表达式的每个分支必须返回同一类型。</>,
            <>掌握用 <code>loop</code> + <code>break 值</code> 返回值的模式。</>,
            <>区分 <code>1..5</code>(不含 5)和 <code>1..=5</code>(含 5)。</>,
            <>理解块 <code>{"{ }"}</code> 中最后一个表达式(无分号)会成为它的值。</>,
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
      <Module badge="M4" title="🛠 函数 · 返回值 · cargo test 入门">
        <Lede>Rust 的函数必须写参数类型,而最后一个表达式会成为返回值。</Lede>

        <p>
          函数用 <code>fn</code> 关键字声明。参数必须显式写类型。
          返回类型写在 <code>-&gt;</code> 后面,函数体最后一个表达式就是返回值。
          注意:加上分号会让它变成语句,结果是返回 <code>()</code>(空元组)。
        </p>
        <p>
          要验证代码是否按预期工作,就写测试。
          Rust 内置了测试框架,只需一个 <code>cargo test</code> 就能运行。
          用 <code>#[test]</code> 标记的函数就是测试函数,
          用 <code>assert_eq!</code> 宏来比较预期值和实际值。
        </p>

        <h3>动手练习</h3>
        <p>一个包含函数和测试的完整示例。把它保存到 <code>src/main.rs</code>。</p>
        <CodeBlock>{`/// 两数之和。
fn add(a: i32, b: i32) -> i32 {
    a + b   // 无分号 → 这就是返回值
}

/// 判断是否为偶数。
fn is_even(n: i32) -> bool {
    n % 2 == 0
}

/// 求 1 到 n 的和。
fn sum_up_to(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total   // 等价于 return total;,但 Rust 更推荐这种写法
}

fn main() {
    println!("3 + 7 = {}", add(3, 7));
    println!("4 是偶数吗? {}", is_even(4));
    println!("5 是偶数吗? {}", is_even(5));
    println!("1~100 的和 = {}", sum_up_to(100));
}

// ===== 测试 =====
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

        <p>运行程序:</p>
        <CodeBlock lang="bash">{`cargo run`}</CodeBlock>

        <p>运行测试:</p>
        <CodeBlock lang="bash">{`cargo test`}</CodeBlock>

        <Checklist
          items={[
            <><code>cargo run</code> 输出里包含 <code>3 + 7 = 10</code>、<code>1~100 的和 = 5050</code>。</>,
            <><code>cargo test</code> 三个测试全部通过。</>,
            <>在 <code>add</code> 函数里给 <code>a + b</code> 后面加分号时出现什么错误,已经亲自试过。</>,
            <>能解释 <code>#[test]</code> 和 <code>assert_eq!</code> 的作用。</>,
          ]}
        />

        <DocsRef
          links={[
            { href: "https://doc.rust-lang.org/book/ch03-03-how-functions-work.html", text: "The Rust Book — 3.3 Functions" },
            { href: "https://doc.rust-lang.org/book/ch11-01-writing-tests.html", text: "The Rust Book — 11.1 Writing Tests" },
          ]}
        />
      </Module>

      <Callout title="💡 进入下一步之前">
        请确认上面所有清单项都已完成。特别是 M4 的 <code>cargo test</code> 能顺利通过。
        如果哪里卡住了,重头再走一遍对应模块也没问题。
        下一节 Step 4 将讲解 Rust 的核心概念 —— 所有权(Ownership)。
      </Callout>

      <PageNav prev={{ to: "/step/2" }} next={{ to: "/step/4" }} />
    </Layout>
  );
}
