import type { ComponentType } from 'react';

export type PartId = 'cpu' | 'memory' | 'concurrency' | 'persistence';

export type MdxModule = { default: ComponentType<{ components?: Record<string, ComponentType<unknown>> }> };

export type ChapterMeta = {
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  partId: PartId;
  lineRange: [number, number];
  loader: () => Promise<MdxModule>;
  evolutionTrack?: 'scheduler' | 'memory';
};

export type PartMeta = {
  id: PartId;
  title: string;
  description: string;
};

export const parts: PartMeta[] = [
  {
    id: 'cpu',
    title: 'Part 1. CPU 가상화',
    description: '프로세스, 시스템콜, 스케줄링 — 하나의 CPU를 여러 프로세스가 공유하는 방법',
  },
  {
    id: 'memory',
    title: 'Part 2. 메모리 가상화',
    description: '주소 공간, 페이징, TLB — 물리 메모리를 가상화하여 프로세스에 나눠주는 방법',
  },
  {
    id: 'concurrency',
    title: 'Part 3. 동시성 (Concurrency)',
    description: 'Thread, race condition, critical section, lock — 한 프로세스 안에서 여러 실행 흐름을 안전하게 다루는 방법',
  },
  {
    id: 'persistence',
    title: 'Part 4. 영속성 (Persistence)',
    description: 'File, directory, inode, fd — 데이터를 전원이 꺼져도 남게 저장하고 이름 붙여 찾는 방법',
  },
];

export const chapters: ChapterMeta[] = [
  {
    slug: '01-processes',
    number: 1,
    title: 'Processes',
    subtitle: 'CPU 가상화와 프로세스의 구조',
    partId: 'cpu',
    lineRange: [1, 98],
    loader: () => import('./01-processes.mdx'),
  },
  {
    slug: '02-process-api',
    number: 2,
    title: 'Process API',
    subtitle: 'fork, wait, exec 그리고 파이프',
    partId: 'cpu',
    lineRange: [99, 304],
    loader: () => import('./02-process-api.mdx'),
  },
  {
    slug: '03-limited-direct-execution',
    number: 3,
    title: 'Limited Direct Execution',
    subtitle: 'User/Kernel 모드, trap, context switch',
    partId: 'cpu',
    lineRange: [305, 536],
    loader: () => import('./03-limited-direct-execution.mdx'),
  },
  {
    slug: '04-scheduling',
    number: 4,
    title: 'Scheduling',
    subtitle: 'FIFO부터 Round Robin까지',
    partId: 'cpu',
    lineRange: [537, 739],
    loader: () => import('./04-scheduling.mdx'),
    evolutionTrack: 'scheduler',
  },
  {
    slug: '05-mlfq',
    number: 5,
    title: 'Multi-Level Feedback Queue',
    subtitle: 'Oracle 없이도 작동하는 스케줄러',
    partId: 'cpu',
    lineRange: [740, 871],
    loader: () => import('./05-mlfq.mdx'),
    evolutionTrack: 'scheduler',
  },
  {
    slug: '06-lottery-stride-cfs',
    number: 6,
    title: 'Lottery · Stride · CFS',
    subtitle: '비례 공정성과 Linux CFS',
    partId: 'cpu',
    lineRange: [872, 1205],
    loader: () => import('./06-lottery-stride-cfs.mdx'),
    evolutionTrack: 'scheduler',
  },
  {
    slug: '07-scheduler-summary',
    number: 7,
    title: 'Scheduler 정리',
    subtitle: '전체 스케줄러 변천사 요약',
    partId: 'cpu',
    lineRange: [1206, 1363],
    loader: () => import('./07-scheduler-summary.mdx'),
    evolutionTrack: 'scheduler',
  },
  {
    slug: '08-address-space',
    number: 8,
    title: 'Address Space',
    subtitle: '메모리 가상화의 첫 개념',
    partId: 'memory',
    lineRange: [1364, 1490],
    loader: () => import('./08-address-space.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '09-base-and-bound',
    number: 9,
    title: 'Base & Bound',
    subtitle: '하드웨어 기반 단순 재배치',
    partId: 'memory',
    lineRange: [1491, 1636],
    loader: () => import('./09-base-and-bound.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '10-segmentation',
    number: 10,
    title: 'Segmentation',
    subtitle: '세그먼트 단위 base/bound',
    partId: 'memory',
    lineRange: [1637, 1850],
    loader: () => import('./10-segmentation.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '11-free-space-management',
    number: 11,
    title: 'Free-Space Management',
    subtitle: '가변 크기 할당기의 실전',
    partId: 'memory',
    lineRange: [1851, 2224],
    loader: () => import('./11-free-space-management.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '12-paging-intro',
    number: 12,
    title: 'Paging: Introduction',
    subtitle: '고정 크기 페이지로 단편화 해결',
    partId: 'memory',
    lineRange: [2225, 2523],
    loader: () => import('./12-paging-intro.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '13-tlb',
    number: 13,
    title: 'TLB',
    subtitle: '페이지 테이블 접근을 빠르게',
    partId: 'memory',
    lineRange: [2524, 2731],
    loader: () => import('./13-tlb.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '14-smaller-tables',
    number: 14,
    title: 'Smaller Tables (Multi-Level)',
    subtitle: '희소 주소 공간을 위한 다단계 페이지 테이블',
    partId: 'memory',
    lineRange: [2732, 3156],
    loader: () => import('./14-smaller-tables.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '15-swapping-mechanisms',
    number: 15,
    title: 'Swapping: Mechanisms',
    subtitle: 'Disk를 메모리처럼 — present bit, page fault 처리 흐름',
    partId: 'memory',
    lineRange: [3157, 3379],
    loader: () => import('./15-swapping-mechanisms.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '16-swapping-policies',
    number: 16,
    title: 'Swapping: Policies',
    subtitle: '어떤 page를 내보낼까 — OPT, FIFO, LRU, Clock 그리고 thrashing',
    partId: 'memory',
    lineRange: [3157, 3379],
    loader: () => import('./16-swapping-policies.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '17-memory-summary',
    number: 17,
    title: '메모리 가상화 정리',
    subtitle: 'Address Space부터 Multi-Level까지 전체 흐름',
    partId: 'memory',
    lineRange: [3157, 3379],
    loader: () => import('./17-memory-summary.mdx'),
    evolutionTrack: 'memory',
  },
  {
    slug: '18-threads-concurrency',
    number: 18,
    title: 'Threads & Concurrency',
    subtitle: '한 프로세스 안의 여러 실행 흐름 — race condition까지',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./18-threads-concurrency.mdx'),
  },
  {
    slug: '19-thread-api',
    number: 19,
    title: 'Thread API',
    subtitle: 'pthread_create · join · mutex · condition variable',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./19-thread-api.mdx'),
  },
  {
    slug: '20-locks',
    number: 20,
    title: 'Locks',
    subtitle: 'Spinlock → TAS/CAS/LL-SC → Ticket → 잠재우기 (yield · park · futex)',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./20-locks.mdx'),
  },
  {
    slug: '21-concurrent-data-structures',
    number: 21,
    title: 'Lock-based Concurrent Data Structures',
    subtitle: 'Counter · Linked List · Queue · Hash Table — fine-grained 로 쪼개기',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./21-concurrent-data-structures.mdx'),
  },
  {
    slug: '22-condition-variables',
    number: 22,
    title: 'Condition Variables',
    subtitle: 'wait/signal · 잠들고 깨우기 · Producer/Consumer · Mesa semantics',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./22-condition-variables.mdx'),
  },
  {
    slug: '23-semaphore',
    number: 23,
    title: 'Semaphore',
    subtitle: 'Binary/Signaling · Producer/Consumer · RW Lock · Dining · Zemaphore',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./23-semaphore.mdx'),
  },
  {
    slug: '24-common-concurrency-problems',
    number: 24,
    title: 'Common Concurrency Problems',
    subtitle: 'Atomicity/Order Violation · Deadlock 4조건 · Prevention/Avoidance/Detect&Recover',
    partId: 'concurrency',
    lineRange: [3380, 3380],
    loader: () => import('./24-common-concurrency-problems.mdx'),
  },
  {
    slug: '25-files-and-directories',
    number: 25,
    title: 'Files and Directories',
    subtitle: 'inode · fd · open/read/write/lseek · fork/dup · fsync · link/unlink · symlink',
    partId: 'persistence',
    lineRange: [3380, 3380],
    loader: () => import('./25-files-and-directories.mdx'),
  },
  {
    slug: '26-exam-summary',
    number: 26,
    title: '시험 직전 정리',
    subtitle: 'Swapping Mechanisms부터 Files and Directories까지 — 전체 흐름 한눈에',
    partId: 'persistence',
    lineRange: [3157, 3380],
    loader: () => import('./26-exam-summary.mdx'),
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
