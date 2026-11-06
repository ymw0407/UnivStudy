import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step1IntroZh() {
  return (
    <Layout
      kicker="Step 1 · 4月7日"
      title="课程概述与为何学习 Rust"
      subtitle="Rust 的诞生背景、与其他语言的比较,以及学习路线图"
    >
      <Lede>
        第一节课将介绍本课程的进行方式、Rust 为什么被创造出来,以及它与其他语言的
        不同之处。同时也会展示整个学习路线图。
      </Lede>

      {/* ===== 第 1 节: 课程说明 ===== */}
      <Module title="📋 课程说明">
        <h3>进行方式</h3>
        <p>
          本课程分为多个课时(Step),每一节都交替进行理论讲解与动手练习。
          原则是所有示例代码都必须亲自输入并运行,而不仅仅是阅读。
        </p>
        <ul>
          <li><strong>理论</strong> — 先用简短的语言解释概念。</li>
          <li><strong>动手练习</strong> — 紧接着亲手写代码并运行。</li>
          <li><strong>自检清单</strong> — 每个模块结束时自我检查学习成果。</li>
        </ul>

        <h3>评估方式</h3>
        <ul>
          <li>期中作业:个人编程作业(在 Step 5 之后提交)</li>
          <li>出勤与参与度</li>
        </ul>

        <h3>🌐 本 Wiki 使用方法</h3>
        <p>
          您现在看到的网站就是本课程的 Wiki。左上角的"← 返回目录"可以回到全部课时列表。
          每个课时(Step)页面被划分为多个模块(M1、M2...),每个模块都提供一句话摘要、
          说明、动手代码、自检清单与官方文档链接。
        </p>
      </Module>

      {/* ===== 第 2 节: Rust 为何诞生 ===== */}
      <Module title="🔧 Rust 为何诞生">
        <h3>系统编程的局限</h3>
        <p>
          几十年来,C 和 C++ 被广泛用于操作系统、浏览器引擎、游戏引擎等对性能要求极高的场景。
          然而这两种语言需要程序员手动管理内存,这就导致以下类型的 bug 反复出现:
        </p>
        <ul>
          <li><strong>Use-after-free(释放后使用)</strong> — 读或写已经释放的内存。</li>
          <li><strong>Double free(双重释放)</strong> — 同一块内存被释放两次,导致程序崩溃。</li>
          <li><strong>Buffer overflow(缓冲区溢出)</strong> — 越界读写数组,是经典的安全漏洞。</li>
          <li><strong>Data race(数据竞争)</strong> — 多个线程同时修改同一数据,结果不可预测。</li>
        </ul>
        <p>
          微软曾公开表示,其产品中约 70% 的安全漏洞源自内存安全问题。
          Google Chrome 团队也报告了类似的数据。
        </p>

        <h3>Mozilla 与 Rust 的诞生</h3>
        <p>
          <strong>Rust</strong> 最初是 Mozilla 工程师 Graydon Hoare 于 2006 年启动的个人项目,
          2009 年起由 Mozilla 正式赞助并开始加速发展。目标非常明确:
          <em>打造一门性能可与 C/C++ 比肩、同时在编译期就能保证内存安全的语言。</em>
        </p>
        <p>
          为实现这一目标,Rust 引入了自己独有的内存管理模型——
          <strong>所有权(Ownership)</strong>系统。
          它不依赖垃圾回收器,而是由编译器分析代码,检查内存是否被安全地使用。
          违反规则的代码根本无法通过编译,上述那些 bug 因此在运行之前就被挡在门外。
        </p>
        <p>
          2015 年 Rust 1.0 正式发布,此后保持每 6 周一次稳定版本的更新节奏。
          如今 Rust 已不再隶属于 Mozilla,而是由 Rust 基金会独立管理,
          其成员包括 Amazon(AWS)、Google、Microsoft、Meta、华为等众多企业。
        </p>
      </Module>

      {/* ===== 第 3 节: 性能 · 安全 · 生产力 ===== */}
      <Module title="⚡ 性能 · 安全 · 生产力">
        <p>
          Rust 被关注的三个核心价值,我们逐一来看。
        </p>

        <h3>1. 性能 — Zero-Cost Abstractions(零成本抽象)</h3>
        <p>
          Rust 的抽象没有运行时开销。
          <strong>Zero-Cost Abstractions</strong>(零成本抽象)的原则是:
          "写高级代码时,其性能应与亲手写出底层代码完全一致"。
          例如使用<strong>迭代器(Iterator)</strong>链式调用时,
          编译器会将其优化成与手写循环等价的机器码。
        </p>
        <p>
          因为没有 GC,也就没有 GC 暂停(pause)。
          这使 Rust 成为实时系统、嵌入式、游戏引擎等延迟敏感领域的首选之一。
        </p>

        <h3>2. 安全 — Borrow Checker(借用检查器)</h3>
        <p>
          Rust 编译器内置了 <strong>borrow checker</strong>(借用检查器)。
          它会在编译期验证<strong>所有权(Ownership)</strong>、
          <strong>借用(Borrowing)</strong>与<strong>生命周期(Lifetime)</strong>的规则。
          任何违反规则的代码都无法通过编译,与内存相关的 bug 不会被带到运行时。
        </p>
        <p>
          一开始可能会因为编译器频繁拒绝代码而感到挫败,但这其实是
          "编译器提前帮你抓住了运行时会爆炸的 bug"。
          Rust 的错误信息非常友好,大多数时候甚至会直接告诉你该怎么修。
        </p>

        <h3>3. 生产力 — Cargo 与生态</h3>
        <p>
          <strong>Cargo</strong> 是 Rust 官方的构建系统兼包管理器。
          项目创建、依赖管理、构建、测试、文档生成,全都集成在这一个工具里。
        </p>
        <CodeBlock lang="bash">{`# 创建新项目
cargo new my_project

# 构建
cargo build

# 运行
cargo run

# 运行测试
cargo test

# 生成文档
cargo doc --open`}</CodeBlock>
        <p>
          <strong>Crate</strong> 是 Rust 的包单位。
          <a href="https://crates.io" target="_blank" rel="noreferrer">crates.io</a>{" "}
          上已有超过 15 万个 crate,只需在 <code>Cargo.toml</code> 里添加一行即可使用。
        </p>
      </Module>

      {/* ===== 第 4 节: 与其他语言的比较 ===== */}
      <Module title="🔄 与其他语言的比较">
        <p>
          把 Rust 放到 C/C++、Go、Python 一起看,就能看清各语言设计哲学的差异。
          下表总结了主要特性。
        </p>

        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>C/C++</th>
              <th>Go</th>
              <th>Python</th>
              <th>Rust</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>内存管理</td>
              <td>手动(malloc/free)</td>
              <td>GC</td>
              <td>GC(引用计数)</td>
              <td>所有权(编译期)</td>
            </tr>
            <tr>
              <td>内存安全</td>
              <td>不保证</td>
              <td>保证(GC)</td>
              <td>保证(GC)</td>
              <td>保证(borrow checker)</td>
            </tr>
            <tr>
              <td>运行性能</td>
              <td>非常快</td>
              <td>快</td>
              <td>慢</td>
              <td>非常快</td>
            </tr>
            <tr>
              <td>GC 暂停</td>
              <td>无</td>
              <td>有</td>
              <td>有</td>
              <td>无</td>
            </tr>
            <tr>
              <td>并发安全</td>
              <td>由程序员负责</td>
              <td>goroutine + channel</td>
              <td>受 GIL 限制</td>
              <td>编译期保证</td>
            </tr>
            <tr>
              <td>编译速度</td>
              <td>一般</td>
              <td>非常快</td>
              <td>解释型(不适用)</td>
              <td>偏慢</td>
            </tr>
            <tr>
              <td>学习曲线</td>
              <td>较陡</td>
              <td>平缓</td>
              <td>非常平缓</td>
              <td>陡峭(所有权概念)</td>
            </tr>
            <tr>
              <td>包管理器</td>
              <td>无(非官方:vcpkg、conan…)</td>
              <td>go mod</td>
              <td>pip</td>
              <td>Cargo(官方、集成)</td>
            </tr>
            <tr>
              <td>主要应用领域</td>
              <td>操作系统、嵌入式、游戏</td>
              <td>Web 服务、云基础设施</td>
              <td>数据科学、脚本</td>
              <td>系统、WebAssembly、CLI、服务端</td>
            </tr>
          </tbody>
        </table>

        <h3>Rust 的定位</h3>
        <p>
          Rust 同时追求 "C/C++ 级别的性能" 和 "高级语言的安全性与易用性"。
        </p>
        <ul>
          <li><strong>能替代 C/C++ 吗?</strong> — 在性能相当的基础上还保证了内存安全,新项目里完全可以作为替代方案。Linux 内核也已经开始合入 Rust 代码。</li>
          <li><strong>与 Go 相比?</strong> — Go 优先考虑简洁性与编译速度;Rust 提供更细粒度的控制和更高性能,但学习曲线陡得多。</li>
          <li><strong>与 Python 相比?</strong> — Python 适合快速原型开发。一种常见模式是用 Rust 写性能关键的部分,再从 Python 调用(PyO3)。</li>
        </ul>

        <h3>🧭 本课程贯穿始终的比较视角</h3>
        <p>
          在接下来的每一节课中,我们会反复使用一个视角:
          <strong>"Java/C++ 一直是这样做的。Rust 为什么要不同地做,或者干脆禁止?"</strong>
          Rust 那些陌生的语法与限制,大多是为了防止其他语言积累多年的具体 bug 而做出的设计决定。先预览几个:
        </p>
        <ul>
          <li>
            <strong>变量默认不可变</strong> — 不是 Java/C++ 那种"默认可变 + 必要时加 final/const",
            而是"默认不可变 + 必要时用 <code>mut</code>"。
            把默认值翻过来,大大减少了"这个变量会在哪里被改?"这种问题的数量。
          </li>
          <li>
            <strong>没有继承</strong> — 吸取了 Java/C++ 20 年经验中"脆弱基类""钻石问题"的教训,
            Rust 用"数据靠组合、行为靠 trait"代替继承。
          </li>
          <li>
            <strong>没有 null</strong> — 为了避免重蹈 Tony Hoare 的"十亿美元错误",
            Rust 用 <code>Option&lt;T&gt;</code> 把"可能不存在"写进类型里。
          </li>
          <li>
            <strong>没有异常</strong> — 为了避开 Java 的 checked exception 地狱与 C++ 的异常安全难题,
            Rust 采用了"错误即值(<code>Result&lt;T, E&gt;</code>)"的模型。
          </li>
          <li>
            <strong>同一时刻只能有一个可变引用</strong> — C++ 的迭代器失效、
            Java 的 <code>ConcurrentModificationException</code>、多线程数据竞争,
            这一条规则就把它们统统消灭。
          </li>
        </ul>
        <p>
          带着这个视角去看 Rust,"为什么非要这样?"几乎每次都能得到答案。
          Rust 大多数约束都是<em>不把语言自己不想解决的问题推给开发者的选择</em>。
        </p>
      </Module>

      {/* ===== 第 5 节: WebAssembly 与 Rust ===== */}
      <Module title="🌐 WebAssembly 与 Rust">
        <p>
          <strong>WebAssembly(Wasm)</strong>是一种可在浏览器中以接近原生速度运行代码的二进制格式。
          C、C++、Rust 等多种语言都可以生成 Wasm 模块,而 Rust 是 Wasm 生态中最活跃的语言之一。
        </p>

        <h3>为什么是 Rust + WebAssembly?</h3>
        <ul>
          <li><strong>体积小</strong> — Rust 没有运行时也没有 GC,生成的 Wasm 文件通常很小。</li>
          <li><strong>性能可预测</strong> — 没有 GC 暂停,适合需要稳定帧级性能的游戏或图形应用。</li>
          <li><strong>wasm-pack</strong> — 将 Rust 代码构建为 WebAssembly 并发布为 npm 包的官方工具。</li>
        </ul>

        <h3>简单流程</h3>
        <CodeBlock lang="bash">{`# 安装 wasm-pack
cargo install wasm-pack

# 将 Rust 库构建为 Wasm
wasm-pack build --target web`}</CodeBlock>
        <p>
          把生成的 <code>.wasm</code> 文件和 JavaScript 绑定一起放到 Web 项目中,
          就能在浏览器里直接运行 Rust 逻辑。本课程不会深入讲解 WebAssembly,
          但请记住 Rust 的应用范围远远超出系统编程,还延伸到了 Web。
        </p>
      </Module>

      {/* ===== 第 6 节: 学习路线图 ===== */}
      <Module title="🗺️ 学习路线图">
        <p>
          本 Wiki 覆盖课程的理论与实践部分(Step 1~5, 7~8)。下面是整体学习流程:
        </p>

        <table>
          <thead>
            <tr>
              <th>课时</th>
              <th>主题</th>
              <th>核心关键词</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Step 1</td>
              <td>课程概述与为何学习 Rust</td>
              <td>诞生背景、比较、路线图</td>
            </tr>
            <tr>
              <td>Step 2</td>
              <td>开发环境搭建</td>
              <td>rustup、Cargo、VS Code、调试器</td>
            </tr>
            <tr>
              <td>Step 3</td>
              <td>变量 · 类型 · 控制流 · 函数</td>
              <td>不可变性、shadowing、表达式、cargo test</td>
            </tr>
            <tr>
              <td>Step 4</td>
              <td>所有权 · 借用 · 生命周期</td>
              <td>所有权、借用、生命周期、move</td>
            </tr>
            <tr>
              <td>Step 5</td>
              <td>结构体 · 枚举 · 模式匹配 · Trait</td>
              <td>struct、enum、match、trait</td>
            </tr>
            <tr>
              <td>Step 7</td>
              <td>泛型 · 错误处理 · 闭包 · 迭代器</td>
              <td>泛型、Result、闭包、迭代器</td>
            </tr>
            <tr>
              <td>Step 8</td>
              <td>模块 · 智能指针 · 并发 · 异步</td>
              <td>crate、Box/Rc、线程、tokio</td>
            </tr>
          </tbody>
        </table>

        <h3>本 Wiki 的结构</h3>
        <p>
          Wiki 中的每个 Step 页面都对应教学大纲中的 M1~M4 模块。每个模块由 5 个部分组成:
        </p>
        <ol>
          <li><strong>一句话摘要</strong> — 一句话概括本模块要学什么。</li>
          <li><strong>为什么需要</strong> — 解释这个概念为什么重要。</li>
          <li><strong>动手练习</strong> — 亲自运行代码或命令。</li>
          <li><strong>自检清单</strong> — 自我确认是否完成学习。</li>
          <li><strong>官方文档链接</strong> — 想深入学习时可以参考的资料。</li>
        </ol>
        <p>
          Step 1(本页)是概览,因此按主题组织而非 M1~M4 模块。
          从 Step 2 开始按模块进行。
        </p>
      </Module>

      {/* ===== 官方文档 ===== */}
      <DocsRef
        links={[
          { href: "https://doc.rust-lang.org/book/foreword.html", text: "The Rust Programming Language — Foreword" },
          { href: "https://doc.rust-lang.org/book/ch00-00-introduction.html", text: "The Rust Programming Language — Introduction" },
        ]}
      />

      <Callout title="💡 进入下一步之前">
        读到这里,如果您对"Rust 为什么值得关注"有了大致的概念,就已经足够了。
        下一节 Step 2 将真正安装 Rust 并运行第一个程序。
      </Callout>

      <PageNav next={{ to: "/step/2" }} />
    </Layout>
  );
}
