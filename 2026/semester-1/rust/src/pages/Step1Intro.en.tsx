import { Layout, Lede } from "../components/Layout";
import { Module } from "../components/Module";
import { DocsRef } from "../components/DocsRef";
import { Callout } from "../components/Callout";
import { PageNav } from "../components/PageNav";
import { CodeBlock } from "../components/CodeBlock";

export function Step1IntroEn() {
  return (
    <Layout
      kicker="Step 1 · Apr 7"
      title="Course overview and why you should learn Rust"
      subtitle="Where Rust came from, how it compares to other languages, and the learning roadmap"
    >
      <Lede>
        In this first session we'll walk through how the course is structured, why Rust was
        created, and what makes it different from other languages. We'll also look at the
        full learning roadmap.
      </Lede>

      {/* ===== Section 1: Course info ===== */}
      <Module title="📋 Course info">
        <h3>How the course runs</h3>
        <p>
          The course is split into sessions. Each one alternates between short theory and
          hands-on follow-alongs — the rule is that every code sample should be typed out
          and run yourself rather than just read.
        </p>
        <ul>
          <li><strong>Theory</strong> — a short explanation of the concept first.</li>
          <li><strong>Follow-along</strong> — immediately after, you type the code and run it.</li>
          <li><strong>Checklist</strong> — self-check at the end of each module.</li>
        </ul>

        <h3>Grading</h3>
        <ul>
          <li>Midterm: individual coding assignment (submitted after Step 5)</li>
          <li>Attendance and participation</li>
        </ul>

        <h3>🌐 How to use this wiki</h3>
        <p>
          This site is the course wiki. The "← Back to contents" link at the top-left takes
          you back to the full list of sessions. Each session page is divided into modules
          (M1, M2, ...), and every module provides a one-line summary, an explanation, a
          follow-along code block, a checklist, and links to official docs.
        </p>
      </Module>

      {/* ===== Section 2: Why Rust was created ===== */}
      <Module title="🔧 Why Rust was created">
        <h3>The limits of systems programming</h3>
        <p>
          C and C++ have powered operating systems, browser engines, and game engines
          for decades where performance matters. But these languages require the
          programmer to manage memory manually, and the same classes of bugs keep
          showing up.
        </p>
        <ul>
          <li><strong>Use-after-free</strong> — reading or writing memory that has already been freed.</li>
          <li><strong>Double free</strong> — freeing the same memory twice, crashing the program.</li>
          <li><strong>Buffer overflow</strong> — reading or writing past the bounds of an array, a classic security hole.</li>
          <li><strong>Data race</strong> — multiple threads mutating the same data at the same time, producing unpredictable results.</li>
        </ul>
        <p>
          Microsoft has reported that roughly 70% of the security vulnerabilities in its
          products trace back to memory-safety bugs. The Google Chrome team has reported
          very similar numbers.
        </p>

        <h3>Mozilla and the birth of Rust</h3>
        <p>
          <strong>Rust</strong> started in 2006 as a personal project by Mozilla engineer
          Graydon Hoare, and in 2009 Mozilla began sponsoring it officially. The goal was
          clear: <em>build a language with C/C++ level performance that also guarantees
          memory safety at compile time.</em>
        </p>
        <p>
          To pull that off, Rust introduced its own memory model based on an{" "}
          <strong>ownership</strong> system. There's no garbage collector — the compiler
          analyzes the code and checks that memory is used safely. Code that breaks the
          rules simply doesn't compile, so the bugs above get blocked before the program
          ever runs.
        </p>
        <p>
          Rust 1.0 was released in 2015, and since then stable releases have shipped on a
          steady six-week cycle. These days Rust is managed independently by the Rust
          Foundation, whose members include Amazon (AWS), Google, Microsoft, Meta, Huawei
          and others.
        </p>
      </Module>

      {/* ===== Section 3: Performance · Safety · Productivity ===== */}
      <Module title="⚡ Performance · Safety · Productivity">
        <p>
          Three core values get Rust a lot of attention. Let's look at each one.
        </p>

        <h3>1. Performance — Zero-Cost Abstractions</h3>
        <p>
          Rust's abstractions have no runtime cost. The{" "}
          <strong>Zero-Cost Abstractions</strong> principle says "writing high-level code
          should compile down to the same machine code as writing the low-level version
          by hand." For example, chaining{" "}
          <strong>iterators</strong> produces the same generated code as a handwritten
          loop after the compiler is done with it.
        </p>
        <p>
          Because there's no garbage collector, there are no GC pauses. That's why Rust
          gets picked for real-time systems, embedded work, and game engines — anything
          latency-sensitive.
        </p>

        <h3>2. Safety — Borrow Checker</h3>
        <p>
          The Rust compiler has a built-in <strong>borrow checker</strong>. It verifies
          the rules of <strong>ownership</strong>, <strong>borrowing</strong>, and{" "}
          <strong>lifetimes</strong> at compile time. If your code violates these rules
          it doesn't compile, which means memory-related bugs never make it to runtime.
        </p>
        <p>
          At first the compiler will reject a lot of code you didn't think was wrong, and
          that can feel frustrating. But those rejections are "bugs caught before they
          could explode at runtime." Rust's error messages are unusually helpful — most
          of the time they suggest the fix too.
        </p>

        <h3>3. Productivity — Cargo and the ecosystem</h3>
        <p>
          <strong>Cargo</strong> is Rust's official build system and package manager.
          Project creation, dependency management, building, testing, and doc generation
          all go through a single tool.
        </p>
        <CodeBlock lang="bash">{`# Create a new project
cargo new my_project

# Build
cargo build

# Run
cargo run

# Run tests
cargo test

# Generate docs
cargo doc --open`}</CodeBlock>
        <p>
          A <strong>crate</strong> is Rust's unit of packaging. There are already more
          than 150,000 crates published on{" "}
          <a href="https://crates.io" target="_blank" rel="noreferrer">crates.io</a>,
          and you can pull one into your project by adding a single line to{" "}
          <code>Cargo.toml</code>.
        </p>
      </Module>

      {/* ===== Section 4: Comparison with other languages ===== */}
      <Module title="🔄 How Rust compares to other languages">
        <p>
          Comparing Rust to C/C++, Go, and Python highlights how different their design
          philosophies are. The table below summarizes the main characteristics.
        </p>

        <table>
          <thead>
            <tr>
              <th>Trait</th>
              <th>C/C++</th>
              <th>Go</th>
              <th>Python</th>
              <th>Rust</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Memory management</td>
              <td>Manual (malloc/free)</td>
              <td>GC</td>
              <td>GC (reference counting)</td>
              <td>Ownership (compile-time)</td>
            </tr>
            <tr>
              <td>Memory safety</td>
              <td>Not guaranteed</td>
              <td>Guaranteed (GC)</td>
              <td>Guaranteed (GC)</td>
              <td>Guaranteed (borrow checker)</td>
            </tr>
            <tr>
              <td>Runtime performance</td>
              <td>Very fast</td>
              <td>Fast</td>
              <td>Slow</td>
              <td>Very fast</td>
            </tr>
            <tr>
              <td>GC pauses</td>
              <td>None</td>
              <td>Yes</td>
              <td>Yes</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Concurrency safety</td>
              <td>Up to the programmer</td>
              <td>Goroutines + channels</td>
              <td>Limited by the GIL</td>
              <td>Checked at compile time</td>
            </tr>
            <tr>
              <td>Compile speed</td>
              <td>Medium</td>
              <td>Very fast</td>
              <td>Interpreted (N/A)</td>
              <td>On the slow side</td>
            </tr>
            <tr>
              <td>Learning curve</td>
              <td>High</td>
              <td>Low</td>
              <td>Very low</td>
              <td>High (ownership)</td>
            </tr>
            <tr>
              <td>Package manager</td>
              <td>None (unofficial: vcpkg, conan…)</td>
              <td>go mod</td>
              <td>pip</td>
              <td>Cargo (official, integrated)</td>
            </tr>
            <tr>
              <td>Main use cases</td>
              <td>OS, embedded, games</td>
              <td>Web servers, cloud infra</td>
              <td>Data science, scripting</td>
              <td>Systems, WebAssembly, CLIs, servers</td>
            </tr>
          </tbody>
        </table>

        <h3>Where Rust sits</h3>
        <p>
          Rust aims at both "C/C++ performance" and "the safety and ergonomics of a
          high-level language" at the same time.
        </p>
        <ul>
          <li><strong>Can it replace C/C++?</strong> — With equivalent performance and memory safety, it's a serious alternative for new projects. Rust code has even started landing in the Linux kernel.</li>
          <li><strong>Compared to Go?</strong> — Go prioritizes simplicity and fast compilation. Rust gives you finer control and higher performance, but the learning curve is steeper.</li>
          <li><strong>Compared to Python?</strong> — Python is great for rapid prototyping. A common pattern is to write the performance-critical pieces in Rust and call them from Python (PyO3).</li>
        </ul>

        <h3>🧭 The comparative lens this course uses</h3>
        <p>
          Throughout every session we'll lean on one recurring angle:{" "}
          <strong>
            "Java/C++ has always done it this way. Why does Rust do it differently — or
            forbid it outright?"
          </strong>{" "}
          Most of Rust's unfamiliar syntax and constraints are design decisions aimed at
          preventing specific bug classes that other languages have suffered through. A
          preview of a few:
        </p>
        <ul>
          <li>
            <strong>Variables are immutable by default</strong> — not "mutable by default + add
            final/const when needed" like Java/C++, but "immutable by default + opt in with{" "}
            <code>mut</code>". Flipping the default cuts down on "where does this variable change?"
            questions dramatically.
          </li>
          <li>
            <strong>No inheritance</strong> — after 20 years of experience with "fragile base
            class" and the diamond problem, Rust replaces inheritance with "data via composition,
            behavior via traits."
          </li>
          <li>
            <strong>No null</strong> — to avoid repeating Tony Hoare's "billion-dollar mistake,"
            Rust encodes "maybe absent" into the type itself via <code>Option&lt;T&gt;</code>.
          </li>
          <li>
            <strong>No exceptions</strong> — to dodge Java's checked-exception hell and C++'s
            exception-safety headaches, Rust adopts the model "errors are values
            (<code>Result&lt;T, E&gt;</code>)."
          </li>
          <li>
            <strong>Only one mutable reference at a time</strong> — iterator invalidation in C++,{" "}
            <code>ConcurrentModificationException</code> in Java, multithreaded data races — all
            of these fall away under a single rule.
          </li>
        </ul>
        <p>
          Keep this lens in mind and "why does it have to be this way?" almost always has an
          answer. Most of Rust's constraints are{" "}
          <em>choices to avoid passing problems the language didn't want to solve onto you, the
          developer.</em>
        </p>
      </Module>

      {/* ===== Section 5: WebAssembly and Rust ===== */}
      <Module title="🌐 WebAssembly and Rust">
        <p>
          <strong>WebAssembly (Wasm)</strong> is a binary format that lets code run in the
          browser at close to native speed. You can produce Wasm modules from many
          languages — C, C++, Rust and more — but Rust is one of the most actively used
          languages in the Wasm ecosystem.
        </p>

        <h3>Why Rust + WebAssembly?</h3>
        <ul>
          <li><strong>Small binaries</strong> — Rust has no runtime or GC, so the resulting Wasm files tend to be small.</li>
          <li><strong>Predictable performance</strong> — with no GC pauses, it fits applications that need steady frame-level performance like games and graphics.</li>
          <li><strong>wasm-pack</strong> — the official tool for building Rust code into WebAssembly and publishing it as an npm package.</li>
        </ul>

        <h3>The basic flow</h3>
        <CodeBlock lang="bash">{`# Install wasm-pack
cargo install wasm-pack

# Build a Rust library to Wasm
wasm-pack build --target web`}</CodeBlock>
        <p>
          Drop the resulting <code>.wasm</code> file and its JavaScript bindings into a web
          project and you can run Rust logic straight from the browser. We won't go deep
          into WebAssembly in this course, but it's worth knowing that Rust's reach goes
          well beyond systems programming.
        </p>
      </Module>

      {/* ===== Section 6: Roadmap ===== */}
      <Module title="🗺️ Learning roadmap">
        <p>
          This wiki covers the theory and hands-on sessions of the course (Steps 1–5 and
          7–8). Here's the flow:
        </p>

        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Topic</th>
              <th>Key concepts</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Step 1</td>
              <td>Course overview and why learn Rust</td>
              <td>Origins, comparison, roadmap</td>
            </tr>
            <tr>
              <td>Step 2</td>
              <td>Environment setup</td>
              <td>rustup, Cargo, VS Code, debugger</td>
            </tr>
            <tr>
              <td>Step 3</td>
              <td>Variables · Types · Control flow · Functions</td>
              <td>Immutability, shadowing, expressions, cargo test</td>
            </tr>
            <tr>
              <td>Step 4</td>
              <td>Ownership · Borrowing · Lifetime</td>
              <td>Ownership, borrowing, lifetimes, move</td>
            </tr>
            <tr>
              <td>Step 5</td>
              <td>Structs · Enums · Pattern Matching · Traits</td>
              <td>Structs, enums, match, traits</td>
            </tr>
            <tr>
              <td>Step 7</td>
              <td>Generics · Error Handling · Closures · Iterators</td>
              <td>Generics, Result, closures, iterators</td>
            </tr>
            <tr>
              <td>Step 8</td>
              <td>Modules · Smart Pointers · Concurrency · Async</td>
              <td>Crates, Box/Rc, threads, tokio</td>
            </tr>
          </tbody>
        </table>

        <h3>How each Step is structured</h3>
        <p>
          Every Step page maps to the M1–M4 modules from the syllabus. Each module has
          five parts:
        </p>
        <ol>
          <li><strong>One-line summary</strong> — a single sentence of what this module covers.</li>
          <li><strong>Why you need it</strong> — background for why the concept matters.</li>
          <li><strong>Follow-along</strong> — code or commands you run yourself.</li>
          <li><strong>Checklist</strong> — a self-check for whether you're done.</li>
          <li><strong>Official docs</strong> — links for deeper reading.</li>
        </ol>
        <p>
          Step 1 (this page) is an overview, so it's organized by topic rather than M1–M4
          modules. From Step 2 onward the module structure kicks in.
        </p>
      </Module>

      {/* ===== Docs ===== */}
      <DocsRef
        links={[
          { href: "https://doc.rust-lang.org/book/foreword.html", text: "The Rust Programming Language — Foreword" },
          { href: "https://doc.rust-lang.org/book/ch00-00-introduction.html", text: "The Rust Programming Language — Introduction" },
        ]}
      />

      <Callout title="💡 Before moving on">
        If you've read this far and have a rough sense of why Rust gets so much attention,
        that's enough. In Step 2 we'll actually install Rust and run the first program.
      </Callout>

      <PageNav next={{ to: "/step/2" }} />
    </Layout>
  );
}
