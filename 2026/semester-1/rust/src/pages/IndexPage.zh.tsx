import { Layout, Lede } from "../components/Layout";
import { StepCardList } from "../components/StepCard";
import { steps } from "../data/steps";

export function IndexPageZh() {
  return (
    <Layout
      kicker="系统前沿技术 · 2026"
      title="🦀 Rust 课程 Wiki"
      subtitle="为零基础学习者编写的 Rust 学习指南"
      showBackToToc={false}
    >
      <Lede>
        本 Wiki 按模块整理了 Rust 课程的理论与实践内容。每个 Step(章节)
        对应教学大纲中的 M1~M4 模块,内容按顺序编排,初学者也可以一步一步跟着做,
        最终获得可运行的代码成果。
      </Lede>

      <h2>学习步骤</h2>
      <StepCardList steps={steps} />

      <h2>参考资料</h2>
      <ul>
        <li>
          <a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer">
            The Rust Programming Language(官方英文版)
          </a>
        </li>
        <li>
          <a href="https://rustwiki.org/zh-CN/book/" target="_blank" rel="noreferrer">
            Rust 程序设计语言(中文翻译)
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noreferrer">
            Rust by Example
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/std/" target="_blank" rel="noreferrer">
            Rust 标准库文档
          </a>
        </li>
        <li>
          <a href="https://rustlings.cool/" target="_blank" rel="noreferrer">
            Rustlings — 互动练习
          </a>
        </li>
      </ul>
    </Layout>
  );
}
