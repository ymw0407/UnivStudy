import { Layout, Lede } from "../components/Layout";
import { StepCardList } from "../components/StepCard";
import { steps } from "../data/steps";

export function IndexPageKo() {
  return (
    <Layout
      kicker="시스템 최신 기술 · 2026"
      title="🦀 Rust 강의 위키"
      subtitle="Rust를 처음 배우는 사람도 따라 할 수 있도록 정리한 학습 가이드"
      showBackToToc={false}
    >
      <Lede>
        이 위키는 Rust 강의의 이론·실습 회차를 모듈 단위로 풀어 정리한 자료입니다.
        각 회차(Step)는 강의 계획서의 M1~M4 모듈을 그대로 따르며, 처음 보는 사람도
        한 단계씩 따라가면 실행 가능한 결과물을 얻을 수 있도록 구성했습니다.
      </Lede>

      <h2>학습 단계</h2>
      <StepCardList steps={steps} />

      <h2>참고 자료</h2>
      <ul>
        <li>
          <a href="https://doc.rust-kr.org/" target="_blank" rel="noreferrer">
            The Rust Programming Language 한국어판
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/book/" target="_blank" rel="noreferrer">
            The Rust Programming Language (영문 원본)
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noreferrer">
            Rust by Example
          </a>
        </li>
        <li>
          <a href="https://doc.rust-lang.org/std/" target="_blank" rel="noreferrer">
            Rust 표준 라이브러리 문서
          </a>
        </li>
        <li>
          <a href="https://rustlings.cool/" target="_blank" rel="noreferrer">
            Rustlings — 인터랙티브 연습
          </a>
        </li>
      </ul>
    </Layout>
  );
}
