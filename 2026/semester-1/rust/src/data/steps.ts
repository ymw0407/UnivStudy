import type { Locale } from "../i18n";

type LocalizedString = Record<Locale, string>;
type LocalizedStringArray = Record<Locale, string[]>;

export interface StepMeta {
  step: number;
  slug: string;
  title: LocalizedString;
  desc: LocalizedString;
  tags: LocalizedStringArray;
  date: LocalizedString;
}

export const steps: StepMeta[] = [
  {
    step: 1,
    slug: "intro",
    title: {
      ko: "강의 개요 및 Rust를 배워야 하는 이유",
      en: "Course overview and why you should learn Rust",
      zh: "课程概述与为何学习 Rust",
    },
    desc: {
      ko: "Rust의 탄생 배경, 다른 언어와의 비교, 학습 로드맵을 살펴봅니다.",
      en: "The origins of Rust, a comparison with other languages, and the learning roadmap.",
      zh: "了解 Rust 的诞生背景、与其他语言的比较以及学习路线图。",
    },
    tags: {
      ko: ["개념"],
      en: ["Concepts"],
      zh: ["概念"],
    },
    date: { ko: "4월 7일", en: "Apr 7", zh: "4月7日" },
  },
  {
    step: 2,
    slug: "setup",
    title: {
      ko: "개발환경 구축 — Cargo · Toolchain · Debugger",
      en: "Setting up your environment — Cargo · Toolchain · Debugger",
      zh: "开发环境搭建 — Cargo · Toolchain · Debugger",
    },
    desc: {
      ko: "rustup·cargo 설치부터 rust-analyzer, CodeLLDB 디버거까지. 호스트 OS별 가이드 제공.",
      en: "From installing rustup and cargo to rust-analyzer and the CodeLLDB debugger. Guides per host OS.",
      zh: "从安装 rustup、cargo 到 rust-analyzer 与 CodeLLDB 调试器。按主机系统提供指南。",
    },
    tags: {
      ko: ["macOS", "Linux", "Windows"],
      en: ["macOS", "Linux", "Windows"],
      zh: ["macOS", "Linux", "Windows"],
    },
    date: { ko: "4월 9일", en: "Apr 9", zh: "4月9日" },
  },
  {
    step: 3,
    slug: "basics",
    title: {
      ko: "변수 · 타입 · 제어흐름 · 함수",
      en: "Variables · Types · Control flow · Functions",
      zh: "变量 · 类型 · 控制流 · 函数",
    },
    desc: {
      ko: "불변성, 타입 추론, 표현식 vs 구문, cargo test 기초까지 4개 모듈로 학습합니다.",
      en: "Immutability, type inference, expressions vs statements, and the basics of cargo test — across four modules.",
      zh: "通过四个模块学习不可变性、类型推断、表达式与语句的区别,以及 cargo test 基础。",
    },
    tags: {
      ko: ["기초 문법"],
      en: ["Basics"],
      zh: ["基础语法"],
    },
    date: { ko: "4월 14일", en: "Apr 14", zh: "4月14日" },
  },
  {
    step: 4,
    slug: "ownership",
    title: {
      ko: "Ownership · Borrowing · Lifetime",
      en: "Ownership · Borrowing · Lifetime",
      zh: "所有权 · 借用 · 生命周期",
    },
    desc: {
      ko: "Rust의 핵심인 소유권·빌림·라이프타임 규칙을 단계적으로 익힙니다.",
      en: "Step by step through Rust's core rules: ownership, borrowing, and lifetimes.",
      zh: "循序渐进地掌握 Rust 的核心规则:所有权、借用与生命周期。",
    },
    tags: {
      ko: ["핵심 개념"],
      en: ["Core concepts"],
      zh: ["核心概念"],
    },
    date: { ko: "4월 16일", en: "Apr 16", zh: "4月16日" },
  },
  {
    step: 5,
    slug: "types",
    title: {
      ko: "Structs · Enums · Pattern Matching · Traits",
      en: "Structs · Enums · Pattern Matching · Traits",
      zh: "结构体 · 枚举 · 模式匹配 · Trait",
    },
    desc: {
      ko: "Rust식 데이터 모델링과 인터페이스 추상화를 4개 모듈로 다룹니다.",
      en: "Rust-style data modeling and interface abstraction across four modules.",
      zh: "通过四个模块讲解 Rust 风格的数据建模与接口抽象。",
    },
    tags: {
      ko: ["타입 시스템"],
      en: ["Type system"],
      zh: ["类型系统"],
    },
    date: { ko: "4월 21일", en: "Apr 21", zh: "4月21日" },
  },
  {
    step: 7,
    slug: "generics",
    title: {
      ko: "Generics · Error Handling · Closures · Iterators",
      en: "Generics · Error Handling · Closures · Iterators",
      zh: "泛型 · 错误处理 · 闭包 · 迭代器",
    },
    desc: {
      ko: "제네릭, Result/?, 클로저, 이터레이터까지 함수형 Rust의 핵심을 다룹니다.",
      en: "The functional core of Rust: generics, Result with ?, closures, and iterators.",
      zh: "涵盖函数式 Rust 的核心:泛型、Result 与 ?、闭包、迭代器。",
    },
    tags: {
      ko: ["함수형"],
      en: ["Functional"],
      zh: ["函数式"],
    },
    date: { ko: "4월 28일", en: "Apr 28", zh: "4月28日" },
  },
  {
    step: 8,
    slug: "advanced",
    title: {
      ko: "Modules · Smart Pointers · Concurrency · Async",
      en: "Modules · Smart Pointers · Concurrency · Async",
      zh: "模块 · 智能指针 · 并发 · 异步",
    },
    desc: {
      ko: "모듈/Crates.io, 스마트 포인터, Fearless Concurrency, async/tokio를 학습합니다.",
      en: "Modules and crates.io, smart pointers, fearless concurrency, and async with tokio.",
      zh: "学习模块与 crates.io、智能指针、无畏并发以及基于 tokio 的异步。",
    },
    tags: {
      ko: ["고급", "tokio"],
      en: ["Advanced", "tokio"],
      zh: ["进阶", "tokio"],
    },
    date: { ko: "4월 30일", en: "Apr 30", zh: "4月30日" },
  },
];
