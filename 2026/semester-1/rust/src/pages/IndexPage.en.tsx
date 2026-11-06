import { Layout, Lede } from "../components/Layout";
import { StepCardList } from "../components/StepCard";
import { steps } from "../data/steps";

export function IndexPageEn() {
  return (
    <Layout
      kicker="Advanced Systems · 2026"
      title="🦀 Rust Course Wiki"
      subtitle="A hands-on learning guide written so complete beginners can follow along."
      showBackToToc={false}
    >
      <Lede>
        This wiki walks through the theory and hands-on sessions of the Rust course,
        module by module. Each Step mirrors the M1–M4 modules of the syllabus, and is
        structured so that a first-time reader can follow along step by step and end
        up with runnable code.
      </Lede>

      <h2>Learning steps</h2>
      <StepCardList steps={steps} />

      <h2>References</h2>
      <ul>
        <li>
          <a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer">
            The Rust Programming Language (The Book)
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noreferrer">
            Rust by Example
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/std/" target="_blank" rel="noreferrer">
            Rust standard library docs
          </a>
        </li>
        <li>
          <a href="https://rustlings.cool/" target="_blank" rel="noreferrer">
            Rustlings — interactive exercises
          </a>
        </li>
        <li>
          <a href="https://doc.rust-kr.org/" target="_blank" rel="noreferrer">
            The Rust Programming Language (Korean translation)
          </a>
        </li>
      </ul>
    </Layout>
  );
}
