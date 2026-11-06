import type { QuizSet } from './types';

// 각 챕터 퀴즈는 dynamic import. 나중에 챕터를 더 추가하려면
// `src/content/quizzes/chNN.ts` 파일을 만들고 여기에 한 줄 추가하면 된다.
export type QuizLoader = () => Promise<{ default: QuizSet }>;

export type QuizIndexEntry = {
  slug: string;            // chapter slug
  chapterNumber: number;
  title: string;
  subtitle?: string;
  partId: 'cpu' | 'memory' | 'concurrency' | 'persistence';
  loader: QuizLoader;
};

export const quizIndex: QuizIndexEntry[] = [
  {
    slug: '01-processes',
    chapterNumber: 1,
    title: 'Processes',
    subtitle: 'CPU 가상화와 프로세스의 구조',
    partId: 'cpu',
    loader: () => import('./ch01'),
  },
  {
    slug: '02-process-api',
    chapterNumber: 2,
    title: 'Process API',
    subtitle: 'fork, wait, exec, pipe',
    partId: 'cpu',
    loader: () => import('./ch02'),
  },
  {
    slug: '03-limited-direct-execution',
    chapterNumber: 3,
    title: 'Limited Direct Execution',
    subtitle: 'Trap, context switch',
    partId: 'cpu',
    loader: () => import('./ch03'),
  },
  {
    slug: '04-scheduling',
    chapterNumber: 4,
    title: 'Scheduling',
    subtitle: 'FIFO, SJF, STCF, RR',
    partId: 'cpu',
    loader: () => import('./ch04'),
  },
  {
    slug: '05-mlfq',
    chapterNumber: 5,
    title: 'MLFQ',
    subtitle: 'Multi-Level Feedback Queue',
    partId: 'cpu',
    loader: () => import('./ch05'),
  },
  {
    slug: '06-lottery-stride-cfs',
    chapterNumber: 6,
    title: 'Lottery · Stride · CFS',
    subtitle: '비례 공정성과 Linux CFS',
    partId: 'cpu',
    loader: () => import('./ch06'),
  },
  {
    slug: '07-scheduler-summary',
    chapterNumber: 7,
    title: 'Scheduler 정리',
    partId: 'cpu',
    loader: () => import('./ch07'),
  },
  {
    slug: '08-address-space',
    chapterNumber: 8,
    title: 'Address Space',
    partId: 'memory',
    loader: () => import('./ch08'),
  },
  {
    slug: '09-base-and-bound',
    chapterNumber: 9,
    title: 'Base & Bound',
    partId: 'memory',
    loader: () => import('./ch09'),
  },
  {
    slug: '10-segmentation',
    chapterNumber: 10,
    title: 'Segmentation',
    partId: 'memory',
    loader: () => import('./ch10'),
  },
  {
    slug: '11-free-space-management',
    chapterNumber: 11,
    title: 'Free-Space Management',
    partId: 'memory',
    loader: () => import('./ch11'),
  },
  {
    slug: '12-paging-intro',
    chapterNumber: 12,
    title: 'Paging',
    partId: 'memory',
    loader: () => import('./ch12'),
  },
  {
    slug: '13-tlb',
    chapterNumber: 13,
    title: 'TLB',
    partId: 'memory',
    loader: () => import('./ch13'),
  },
  {
    slug: '14-smaller-tables',
    chapterNumber: 14,
    title: 'Smaller Page Tables',
    partId: 'memory',
    loader: () => import('./ch14'),
  },
  {
    slug: '15-swapping-mechanisms',
    chapterNumber: 15,
    title: 'Swapping: Mechanisms',
    subtitle: 'Present bit · page fault 처리 ①~⑥ · lazy vs daemon',
    partId: 'memory',
    loader: () => import('./ch15'),
  },
  {
    slug: '16-swapping-policies',
    chapterNumber: 16,
    title: 'Swapping: Policies',
    subtitle: 'AMAT · OPT/FIFO/LRU 트레이스 · Clock · thrashing',
    partId: 'memory',
    loader: () => import('./ch16'),
  },
  {
    slug: '17-memory-summary',
    chapterNumber: 17,
    title: '메모리 가상화 정리',
    partId: 'memory',
    loader: () => import('./ch17'),
  },
  {
    slug: '18-threads-concurrency',
    chapterNumber: 18,
    title: 'Threads & Concurrency',
    subtitle: '공유 vs per-thread · PCB/TCB · race condition',
    partId: 'concurrency',
    loader: () => import('./ch18'),
  },
  {
    slug: '19-thread-api',
    chapterNumber: 19,
    title: 'Thread API',
    subtitle: 'create/join · mutex 3종 · cond wait/signal',
    partId: 'concurrency',
    loader: () => import('./ch19'),
  },
  {
    slug: '20-locks',
    chapterNumber: 20,
    title: 'Locks',
    subtitle: 'TAS/CAS/LL-SC/FAA · Ticket · park/futex · two-phase',
    partId: 'concurrency',
    loader: () => import('./ch20'),
  },
  {
    slug: '21-concurrent-data-structures',
    chapterNumber: 21,
    title: 'Concurrent Data Structures',
    subtitle: 'Approximate counter · hand-over-hand · M&S queue · hash',
    partId: 'concurrency',
    loader: () => import('./ch21'),
  },
  {
    slug: '22-condition-variables',
    chapterNumber: 22,
    title: 'Condition Variables',
    subtitle: '3박자 · Mesa와 while · Producer/Consumer 발전',
    partId: 'concurrency',
    loader: () => import('./ch22'),
  },
  {
    slug: '23-semaphore',
    chapterNumber: 23,
    title: 'Semaphore',
    subtitle: 'Binary/signaling · Producer/Consumer · RW Lock · Dining · Zemaphore',
    partId: 'concurrency',
    loader: () => import('./ch23'),
  },
  {
    slug: '24-common-concurrency-problems',
    chapterNumber: 24,
    title: 'Common Concurrency Problems',
    subtitle: 'Atomicity/Order violation · Deadlock 4조건 · Prevention 매핑',
    partId: 'concurrency',
    loader: () => import('./ch24'),
  },
  {
    slug: '25-files-and-directories',
    chapterNumber: 25,
    title: 'Files and Directories',
    subtitle: 'inode · fd 사슬 · offset · fsync/rename · link count',
    partId: 'persistence',
    loader: () => import('./ch25'),
  },
];

export function quizEntryBySlug(slug: string | undefined): QuizIndexEntry | undefined {
  return quizIndex.find((q) => q.slug === slug);
}
