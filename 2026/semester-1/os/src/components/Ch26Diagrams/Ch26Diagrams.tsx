import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch26Diagrams.css';

/**
 * 26장(시험 직전 정리) 전용 SVG 다이어그램 모음.
 *
 * 15~24장의 전개를 "문제 → 도입 → 한계 → 보완" 사슬의 순서도로 그린다.
 * 다른 장과 같은 규칙: viewBox 기반 축소, 색은 theme vars 토큰만 사용(라이트/다크 자동 대응).
 */

// ════════════════════════════════════════════════════════════════════════════
// 공통: 문제-해결 사슬(세로 순서도) 렌더러
// ════════════════════════════════════════════════════════════════════════════
type StepKind = 'problem' | 'solution' | 'limitation' | 'accent';

type ChainStep = {
  kind: StepKind;
  badge: string; // "문제" / "도입" / "한계" / "보완" …
  title: string;
  lines?: string[];
  arrowLabel?: string; // 다음 step으로 가는 화살표 옆 설명
};

const CHAIN_W = 760;
const CHAIN_BOX_W = 644;
const CHAIN_BOX_X = (CHAIN_W - CHAIN_BOX_W) / 2;
const CHAIN_ARROW_GAP = 34;

function stepHeight(step: ChainStep): number {
  const bodyLines = step.lines?.length ?? 0;
  return 40 + (bodyLines > 0 ? 4 + bodyLines * 17 : 0);
}

function ChainNode({ step, y }: { step: ChainStep; y: number }) {
  const h = stepHeight(step);
  const badgeW = 16 + step.badge.length * 12;
  return (
    <g>
      <BoxBg x={CHAIN_BOX_X} y={y} w={CHAIN_BOX_W} h={h} tone={step.kind} />
      <rect
        x={CHAIN_BOX_X + 12}
        y={y + 11}
        width={badgeW}
        height={18}
        rx={9}
        fill={toneStroke(step.kind)}
        opacity={0.92}
      />
      <text
        x={CHAIN_BOX_X + 12 + badgeW / 2}
        y={y + 24}
        textAnchor="middle"
        fontSize={10.5}
        fontWeight={700}
        fontFamily={vars.font.sans}
        fill={vars.color.surface}
      >
        {step.badge}
      </text>
      <text
        x={CHAIN_BOX_X + 12 + badgeW + 10}
        y={y + 24.5}
        fontSize={13}
        fontWeight={700}
        fontFamily={vars.font.sans}
        fill={toneTextColor(step.kind)}
      >
        {step.title}
      </text>
      {(step.lines ?? []).map((line, i) => (
        <text
          key={i}
          x={CHAIN_BOX_X + 16}
          y={y + 50 + i * 17}
          fontSize={11.5}
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function ProblemChain({
  steps,
  ariaLabel,
  caption,
}: {
  steps: ChainStep[];
  ariaLabel: string;
  caption?: string;
}) {
  const topPad = 14;
  const bottomPad = 14;
  const totalH =
    topPad + bottomPad + steps.reduce((acc, st) => acc + stepHeight(st), 0) + (steps.length - 1) * CHAIN_ARROW_GAP;

  let y = topPad;
  const nodes: ReactNode[] = [];
  steps.forEach((step, i) => {
    const h = stepHeight(step);
    nodes.push(<ChainNode key={`n${i}`} step={step} y={y} />);
    if (i < steps.length - 1) {
      const ax = CHAIN_W / 2;
      nodes.push(
        <g key={`a${i}`}>
          <line
            x1={ax}
            y1={y + h + 2}
            x2={ax}
            y2={y + h + CHAIN_ARROW_GAP - 4}
            stroke={vars.color.evoArrow}
            strokeWidth={1.4}
            markerEnd="url(#arrow-default)"
          />
          {step.arrowLabel && (
            <text
              x={ax + 12}
              y={y + h + CHAIN_ARROW_GAP / 2 + 3}
              fontSize={10.5}
              fontStyle="italic"
              fontFamily={vars.font.sans}
              fill={vars.color.textMuted}
            >
              {step.arrowLabel}
            </text>
          )}
        </g>,
      );
    }
    y += h + CHAIN_ARROW_GAP;
  });

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${CHAIN_W} ${totalH}`} role="img" aria-label={ariaLabel}>
        <ArrowDefs />
        {nodes}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 1. 이야기 1 — Swapping (15~16장) 문제-해결 사슬
// ════════════════════════════════════════════════════════════════════════════
const swappingSteps: ChainStep[] = [
  {
    kind: 'problem',
    badge: '문제',
    title: '물리 메모리(DRAM)가 부족하다',
    lines: ['프로세스를 전부 올릴 수 없음 — 그래도 실행은 계속되어야 함'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'Swap Space',
    lines: ['disk 일부를 page 단위 보조 공간으로 예약 — 안 쓰는 page를 내보냈다가 다시 가져옴'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '이 page가 지금 메모리에 있나, disk에 있나?',
    lines: ['하드웨어(MMU)가 PTE만 보고는 구분할 방법이 없음'],
  },
  {
    kind: 'solution',
    badge: '추가',
    title: 'PTE에 Present Bit',
    lines: ['1 = 메모리에 있음 · 0 = disk에 있음 (valid bit와는 별개 — valid=0은 segfault)'],
    arrowLabel: 'present = 0 인 page에 접근하면?',
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'Page Fault Handler',
    lines: ['① 참조 → ② trap → ③ swap 위치 확인 → ④ disk read → ⑤ PTE 갱신 → ⑥ 재실행'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '가져오려는데 빈 frame이 없다',
    lines: ['기존 page를 내보내야(evict) 함 — 꽉 찰 때까지 기다리면(lazy) 매 요청마다 disk I/O 대기'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'Replacement + Page Daemon (watermark)',
    lines: ['victim을 골라 내보내고, LW/HW 사이에서 background로 미리 free frame 확보'],
    arrowLabel: '그럼 "누구를" 내보내지? — 기준은 AMAT (P_miss 줄이기)',
  },
  {
    kind: 'solution',
    badge: '기준',
    title: 'OPT — 가장 나중에 쓰일 page를 내보내라',
    lines: ['최선이지만 미래를 알 수 없어 구현 불가 → 비교용 상한선으로만 사용'],
  },
  {
    kind: 'solution',
    badge: '시도',
    title: 'FIFO — 가장 먼저 들어온 page부터',
    lines: ['queue 하나로 끝나는 단순한 구현'],
  },
  {
    kind: 'limitation',
    badge: '한계',
    title: '중요도를 무시한다',
    lines: ['자주 쓰는 page도 먼저 들어왔다는 이유로 쫓아냄 → Belady’s Anomaly (frame↑ fault↑)'],
  },
  {
    kind: 'solution',
    badge: '개선',
    title: 'LRU — 가장 오래 안 쓰인 page부터',
    lines: ['locality 활용: 최근에 쓴 건 또 쓴다 → 80-20 워크로드에서 OPT에 근접'],
  },
  {
    kind: 'limitation',
    badge: '한계',
    title: '정확한 LRU는 너무 비싸다',
    lines: ['매 메모리 접근마다 최근 사용 순서(리스트)를 갱신해야 함'],
  },
  {
    kind: 'solution',
    badge: '근사',
    title: 'Clock Algorithm',
    lines: ['page당 use bit 1개 + 시계바늘 — use=1이면 0으로 리셋 후 전진, use=0이면 victim'],
  },
  {
    kind: 'solution',
    badge: '보완',
    title: 'Dirty Bit · Prefetching · Clustering',
    lines: ['clean page는 evict 시 disk write 생략 · 곧 쓸 page 미리 읽기 · write 모아서 한 번에'],
  },
  {
    kind: 'problem',
    badge: '한계',
    title: '그래도 메모리가 너무 부족하면 — Thrashing',
    lines: ['프로세스 과다(over-subscription) → 모두가 disk I/O만 기다림 → CPU 사용률 급락'],
  },
];

export function SwappingProblemChain({ caption }: { caption?: string }) {
  return (
    <ProblemChain steps={swappingSteps} ariaLabel="Swapping 문제-해결 사슬 순서도" caption={caption} />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. 이야기 2 — Concurrency (18~23장) 문제-해결 사슬
// ════════════════════════════════════════════════════════════════════════════
const concurrencySteps: ChainStep[] = [
  {
    kind: 'accent',
    badge: '도입',
    title: 'Thread — 한 프로세스 안의 여러 실행 흐름',
    lines: [
      'code·data·heap·page table은 공유(PCB), PC·SP·register·stack은 각자(TCB)',
      '병렬화 · blocking I/O와 overlap · 데이터 공유가 쉬움',
    ],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '공유했더니 Race Condition',
    lines: ['counter++ 는 load → add → store 3단계 — 사이에 context switch가 끼면 결과가 꼬임'],
  },
  {
    kind: 'solution',
    badge: '정의',
    title: 'Critical Section을 Lock으로 보호',
    lines: ['mutual exclusion — 한 번에 하나의 thread만 진입 (context switch를 막는 게 아님)'],
    arrowLabel: '그 lock은 어떻게 만들지?',
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '일반 flag 변수로 만들면 실패',
    lines: ['"flag 검사"와 "flag = 1" 사이에 끼어들면 둘 다 통과 — lock 자체가 race condition'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'HW atomic instruction — TAS · CAS · LL/SC',
    lines: ['test와 set을 쪼갤 수 없는 한 명령으로 → spinlock 완성 (correctness 확보)'],
  },
  {
    kind: 'limitation',
    badge: '한계',
    title: 'spin은 CPU 낭비 + 순서 보장 없음',
    lines: ['기다리는 동안 CPU를 태우고, 운 나쁜 thread는 starvation'],
  },
  {
    kind: 'solution',
    badge: '개선',
    title: 'FAA 번호표 → Ticket Lock',
    lines: ['도착 순서대로 lock 획득 — fairness 해결 (spin은 여전히 남음)'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'OS support — 기다릴 거면 재우자',
    lines: ['yield(양보) → queue + park/unpark (재우고 깨우기, 내부 상태는 guard lock으로 보호)'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: 'Lost Wakeup',
    lines: ['"guard 풀기 → park" 사이에 unpark가 먼저 도착하면 신호가 증발 — 영영 잠듦'],
  },
  {
    kind: 'solution',
    badge: '보완',
    title: 'setpark(Solaris) · futex_wait(expected)(Linux)',
    lines: ['"곧 잘 거다" 선등록 · 잠들기 직전 값 검사 — 실전 mutex는 Two-Phase (spin 후 sleep)'],
    arrowLabel: 'lock은 완성 — 이제 자료구조에 적용하면?',
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '자료구조 전체에 lock 하나 → 병목',
    lines: ['모든 thread가 한 줄로 직렬화 — thread를 늘려도 안 빨라짐 (perfect scaling 실패)'],
  },
  {
    kind: 'solution',
    badge: '개선',
    title: 'Fine-grained locking — 잘게 쪼개기',
    lines: [
      'counter → CPU별 local + threshold S · list → hand-over-hand',
      'queue → head/tail lock + dummy · hash → bucket별 lock + 좋은 hash 함수',
    ],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '"조건이 될 때까지 기다리기"는 lock만으로 안 됨',
    lines: ['while (조건 아님) ; 은 busy waiting — CPU 낭비, single CPU면 더 심각'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'Condition Variable — wait(잠들기) / signal(깨우기)',
    lines: ['반드시 state variable + lock과 3박자로 사용'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '셋 중 하나라도 빠지면 · Mesa semantics',
    lines: ['state 없으면 신호 증발 · lock 없으면 race window · 깨어나도 조건 보장 없음'],
  },
  {
    kind: 'solution',
    badge: '보완',
    title: 'while 재검사 · CV 2개(empty/fill) · broadcast',
    lines: ['헛깨움은 재검사로 · 엉뚱한 쪽 깨우기 방지 · 누굴 깨울지 모르면 전부 깨우기'],
  },
  {
    kind: 'accent',
    badge: '통합',
    title: 'Semaphore — 정수 값 + 대기 큐 하나로',
    lines: ['init 1 = lock · init 0 = signaling (CV처럼, 신호가 값으로 남음) · init N = 자원 N개'],
    arrowLabel: '도구는 완성 — 그래도 버그는 남는다 (24장)',
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '안 멈추는 버그 — non-deadlock bugs (실제로 더 흔함)',
    lines: ['atomicity violation: 한 덩어리가 쪼개짐 · order violation: A보다 B가 먼저 실행됨'],
  },
  {
    kind: 'solution',
    badge: '처방',
    title: 'atomicity → lock · order → CV 3박자',
    lines: ['검사+사용을 같은 lock으로 묶고, 순서는 state + cond_wait + while로 강제'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '멈추는 버그 — Deadlock',
    lines: ['4조건 동시 성립: Mutual Exclusion · Hold&Wait · No Preemption · Circular Wait'],
  },
  {
    kind: 'accent',
    badge: '대응',
    title: 'Prevention · Avoidance · Detect & Recover',
    lines: ['설계로 조건 깨기(순서 고정 · trylock · CAS) · 스케줄로 회피 · cycle 찾아 복구'],
  },
];

export function ConcurrencyProblemChain({ caption }: { caption?: string }) {
  return (
    <ProblemChain steps={concurrencySteps} ariaLabel="Concurrency 문제-해결 사슬 순서도" caption={caption} />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. 이야기 3 — Persistence: Files & Directories (25장) 문제-해결 사슬
// ════════════════════════════════════════════════════════════════════════════
const persistenceSteps: ChainStep[] = [
  {
    kind: 'problem',
    badge: '문제',
    title: '데이터를 전원이 꺼져도 남게, 이름 붙여 찾을 수 있게 하려면?',
    lines: ['메모리는 휘발성 — 디스크에 두되 "어떤 byte 덩어리가 어떤 파일인지" 식별이 필요'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'File = byte 배열 + inode (low-level name)',
    lines: ['확장자의 의미는 OS 관심 밖 — 커널은 inode 번호(파일 시스템 내 유일)로 식별'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '사람은 inode 번호로 파일을 못 찾는다',
    lines: ['"bar.txt" 같은 이름과 inode 를 이어 줄 장치가 필요'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'Directory — (이름, inode 번호) 쌍을 담는 특수 파일',
    lines: ['경로 해석 = 이름 → inode 변환을 경로 성분마다 반복 (. 과 .. 도 entry)'],
  },
  {
    kind: 'solution',
    badge: '도입',
    title: 'open() → fd → open file entry(offset·ref) → inode',
    lines: ['fd 는 프로세스별 정수(0/1/2 예약, 가장 작은 빈 칸) · offset 은 entry 에, metadata 는 inode 에'],
    arrowLabel: '같은 파일을 여럿이 보면 offset 은?',
  },
  {
    kind: 'solution',
    badge: '규칙',
    title: '따로 open = offset 독립 · fork/dup = entry 공유 = offset 공유',
    lines: ['lseek 는 entry 의 offset 정수만 변경 (disk I/O 없음)'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: 'write 는 버퍼(page cache)까지만 — crash 시 유실',
    lines: ['"나중에 언젠가" 가 아니라 지금 당장 디스크에 박혔다는 보장이 필요할 때가 있다'],
  },
  {
    kind: 'solution',
    badge: '보완',
    title: 'fsync(fd) (+ fsync(dirfd)) · 안전 저장 = tmp + fsync + rename',
    lines: ['rename 은 atomic — crash 가 나도 옛 파일 아니면 새 파일, 중간 상태 없음'],
  },
  {
    kind: 'problem',
    badge: '문제',
    title: '"삭제" 와 "별명" 은 어떻게 동작하나?',
    lines: ['이름과 데이터가 분리되어 있으니 — 이름을 지우는 것 ≠ 데이터를 지우는 것'],
  },
  {
    kind: 'accent',
    badge: '정리',
    title: 'link/unlink — hard link 는 같은 inode 의 동등한 이름',
    lines: ['unlink 로 link count 감소, 0 이어야 데이터 해제 · symlink 는 경로 문자열 파일(dangling 가능)'],
  },
];

export function PersistenceProblemChain({ caption }: { caption?: string }) {
  return (
    <ProblemChain steps={persistenceSteps} ariaLabel="Persistence 문제-해결 사슬 순서도" caption={caption} />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. 비슷한 도구들의 관계 — lock · CV · semaphore 상호 구현
// ════════════════════════════════════════════════════════════════════════════
export function SyncPrimitivesMap({ caption }: { caption?: string }) {
  const W = 760;
  const H = 508;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="lock·CV·semaphore 상호 구현 관계도">
        <ArrowDefs />

        {/* 재료 */}
        <InfoBox
          x={200}
          y={14}
          w={360}
          h={74}
          tone="muted"
          title="구현 재료"
          lines={['HW atomic: TAS · CAS · LL/SC · FAA', 'OS sleep: park/unpark · setpark · futex']}
        />
        <Arrow x1={310} y1={88} x2={210} y2={146} />

        {/* Lock / CV */}
        <InfoBox
          x={60}
          y={150}
          w={250}
          h={76}
          tone="solution"
          title="Lock (mutex)"
          lines={['한 번에 하나만 — mutual exclusion', 'spinlock → ticket → futex/2-phase']}
        />
        <InfoBox
          x={450}
          y={150}
          w={250}
          h={76}
          tone="solution"
          title="Condition Variable"
          lines={['조건까지 잠들기 — wait / signal', '항상 state variable + lock과 3박자']}
        />
        <Arrow x1={314} y1={188} x2={446} y2={188} />
        <text
          x={380}
          y={172}
          textAnchor="middle"
          fontSize={10.5}
          fontStyle="italic"
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          cond_wait가 mutex를 받아
        </text>
        <text
          x={380}
          y={207}
          textAnchor="middle"
          fontSize={10.5}
          fontStyle="italic"
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          unlock+sleep을 atomic으로
        </text>

        {/* Lock + CV → Semaphore */}
        <Arrow x1={185} y1={226} x2={300} y2={318} />
        <Arrow x1={575} y1={226} x2={460} y2={318} />
        <text
          x={380}
          y={278}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fontFamily={vars.font.sans}
          fill={vars.color.text}
        >
          lock + CV + 정수 값으로 semaphore를 구현 (Zemaphore)
        </text>

        <InfoBox
          x={230}
          y={320}
          w={300}
          h={110}
          tone="accent"
          title="Semaphore — 정수 값 + 대기 큐"
          lines={[
            'init 1 → binary semaphore = lock처럼',
            'init 0 → signaling = CV처럼 (신호가 값으로 남음)',
            'init N → 자원 N개 카운팅 (예: empty = MAX)',
          ]}
        />

        {/* 같은 문제, 두 가지 풀이 */}
        <text x={W / 2} y={460} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          같은 문제도 양쪽으로 — Producer/Consumer: ① mutex + CV 2개(empty·fill) + while 재검사
        </text>
        <text x={W / 2} y={480} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          ② semaphore 3개(empty=MAX · full=0 · mutex=1, mutex는 항상 안쪽에서)
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Primitives (file-scope)
// ════════════════════════════════════════════════════════════════════════════
function Diagram({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className={s.diagram}>
      {children}
      {caption && <div className={s.caption}>{caption}</div>}
    </div>
  );
}

type BoxTone = 'plain' | 'accent' | 'solution' | 'problem' | 'limitation' | 'muted';

function toneBg(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accentSoft;
    case 'solution':
      return vars.color.solutionSoft;
    case 'problem':
      return vars.color.problemSoft;
    case 'limitation':
      return vars.color.limitationSoft;
    case 'muted':
      return vars.color.surfaceAlt;
    default:
      return vars.color.surface;
  }
}
function toneStroke(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accent;
    case 'solution':
      return vars.color.solution;
    case 'problem':
      return vars.color.problem;
    case 'limitation':
      return vars.color.limitation;
    case 'muted':
      return vars.color.border;
    default:
      return vars.color.borderStrong;
  }
}
function toneTextColor(tone: BoxTone): string {
  switch (tone) {
    case 'accent':
      return vars.color.accent;
    case 'solution':
      return vars.color.solution;
    case 'problem':
      return vars.color.problem;
    case 'limitation':
      return vars.color.limitation;
    case 'muted':
      return vars.color.textMuted;
    default:
      return vars.color.text;
  }
}

function BoxBg({ x, y, w, h, tone }: { x: number; y: number; w: number; h: number; tone: BoxTone }) {
  return <rect x={x} y={y} width={w} height={h} rx={6} ry={6} fill={toneBg(tone)} stroke={toneStroke(tone)} strokeWidth={1.2} />;
}

function InfoBox({
  x,
  y,
  w,
  h,
  tone,
  title,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  title: string;
  lines?: string[];
}) {
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text
        x={x + w / 2}
        y={y + 24}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fontFamily={vars.font.sans}
        fill={toneTextColor(tone)}
      >
        {title}
      </text>
      {(lines ?? []).map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + 46 + i * 17}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow-default" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.evoArrow} />
      </marker>
    </defs>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={vars.color.evoArrow} strokeWidth={1.4} markerEnd="url(#arrow-default)" />;
}
