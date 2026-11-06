import type { ComponentType } from 'react';

export type PartId = 'intro' | 'math' | 'algorithm';

export type MdxModule = { default: ComponentType<{ components?: Record<string, ComponentType<unknown>> }> };

export type ChapterMeta = {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  partId: PartId;
  loader: () => Promise<MdxModule>;
};

export type PartMeta = {
  id: PartId;
  title: string;
  description: string;
};

export const parts: PartMeta[] = [
  {
    id: 'intro',
    title: 'Part 1. 양자 회로, 직접 만져 보기',
    description:
      '디지털 회로의 half adder 를 양자 회로로 다시 만들어 보며 큐비트·게이트·측정·중첩을 손으로 익힌다. 수식은 최소한으로.',
  },
  {
    id: 'math',
    title: 'Part 2. 양자 상태의 언어, 벡터와 선형대수',
    description:
      '"양자 상태 = 벡터, 양자 연산 = 행렬". 복소수와 벡터부터 시작해 디랙 표기법, 기저, 텐서곱, 유니터리 연산까지 차근차근 쌓는다.',
  },
  {
    id: 'algorithm',
    title: 'Part 3. 양자 알고리즘',
    description:
      '앞에서 쌓은 도구로 진짜 알고리즘을 만든다. 얽힘과 텔레포테이션, 위상 킥백과 Deutsch, 그리고 Grover 검색까지 — 모두 "중첩 → 위상 → 간섭" 한 골격이다.',
  },
];

export const chapters: ChapterMeta[] = [
  {
    slug: '01-bit-to-qubit',
    number: 1,
    title: '비트에서 큐비트로',
    subtitle: 'half adder 로 보는 고전 회로, 그리고 양자가 필요한 이유',
    partId: 'intro',
    loader: () => import('./01-bit-to-qubit.mdx'),
  },
  {
    slug: '02-quantum-circuit',
    number: 2,
    title: '양자 회로 만들기',
    subtitle: 'IBM Quantum Composer 로 게이트(X·CX·Toffoli·H) 올리기',
    partId: 'intro',
    loader: () => import('./02-quantum-circuit.mdx'),
  },
  {
    slug: '03-superposition-measurement',
    number: 3,
    title: '중첩과 측정, 그리고 슈뢰딩거의 고양이',
    subtitle: '관찰하면 상태가 무너진다 — 확률진폭·측정·실제 장치의 오류',
    partId: 'intro',
    loader: () => import('./03-superposition-measurement.mdx'),
  },
  {
    slug: '04-complex-and-vector',
    number: 4,
    title: '복소수와 벡터',
    subtitle: '양자 상태를 적기 위한 최소 재료',
    partId: 'math',
    loader: () => import('./04-complex-and-vector.mdx'),
  },
  {
    slug: '05-dirac-notation',
    number: 5,
    title: '디랙 표기법: bra와 ket',
    subtitle: '|ψ⟩ 와 ⟨ψ|, 내적과 직교',
    partId: 'math',
    loader: () => import('./05-dirac-notation.mdx'),
  },
  {
    slug: '06-qubit-as-vector',
    number: 6,
    title: '큐비트는 벡터다',
    subtitle: '|0⟩·|1⟩, 중첩, 확률진폭, 선형 독립',
    partId: 'math',
    loader: () => import('./06-qubit-as-vector.mdx'),
  },
  {
    slug: '07-basis-and-hilbert',
    number: 7,
    title: '기저와 힐베르트 공간',
    subtitle: '같은 벡터를 보는 여러 좌표계 — Z·X·Y 기저',
    partId: 'math',
    loader: () => import('./07-basis-and-hilbert.mdx'),
  },
  {
    slug: '08-tensor-product',
    number: 8,
    title: '텐서곱: 큐비트 여러 개',
    subtitle: '2큐비트·4큐비트 상태와 크로네커 곱',
    partId: 'math',
    loader: () => import('./08-tensor-product.mdx'),
  },
  {
    slug: '09-quantum-operation',
    number: 9,
    title: '양자 연산은 행렬이다',
    subtitle: '선형 연산자, unitary·Hermitian, Pauli 행렬',
    partId: 'math',
    loader: () => import('./09-quantum-operation.mdx'),
  },
  {
    slug: '10-entanglement-teleportation',
    number: 10,
    title: '얽힘과 양자 텔레포테이션',
    subtitle: 'Bell 상태, 얽힘, 그리고 상태를 옮기는 법',
    partId: 'algorithm',
    loader: () => import('./10-entanglement-teleportation.mdx'),
  },
  {
    slug: '11-phase-kickback-deutsch',
    number: 11,
    title: '위상 킥백과 Deutsch 알고리즘',
    subtitle: '오라클, 위상 킥백, 첫 양자 우위',
    partId: 'algorithm',
    loader: () => import('./11-phase-kickback-deutsch.mdx'),
  },
  {
    slug: '12-grover-search',
    number: 12,
    title: 'Grover 검색 알고리즘',
    subtitle: '오라클·확산기·기하학적 회전으로 O(√N) 검색',
    partId: 'algorithm',
    loader: () => import('./12-grover-search.mdx'),
  },
  {
    slug: '13-shor-factoring',
    number: 13,
    title: 'Shor 인수분해 알고리즘',
    subtitle: 'order finding + QPE 로 RSA 를 위협한 다항 시간 인수분해',
    partId: 'algorithm',
    loader: () => import('./13-shor-factoring.mdx'),
  },
];

export function chapterBySlug(slug: string | undefined): ChapterMeta | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function adjacentChapters(slug: string | undefined): {
  prev: ChapterMeta | undefined;
  next: ChapterMeta | undefined;
} {
  const idx = chapters.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return { prev: chapters[idx - 1], next: chapters[idx + 1] };
}

export function chaptersByPart(partId: PartId): ChapterMeta[] {
  return chapters.filter((c) => c.partId === partId);
}
