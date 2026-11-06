import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch20Diagrams.css';

/**
 * 20장(Locks) 전용 SVG 다이어그램 모음.
 * 톤 규칙은 Ch15/16/18/19Diagrams 와 동일.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. Naive flag spinlock 의 race — Problem 1 타임라인
// ════════════════════════════════════════════════════════════════════════════
export function AtomicityRaceTimeline({ caption }: { caption?: string }) {
  const W = 820;
  const H = 480;
  const laneW = 320;
  const gap = 60;
  const leftX = (W - (laneW * 2 + gap)) / 2;
  const rightX = leftX + laneW + gap;
  const laneTop = 50;
  const laneBottom = H - 40;

  // events
  const A: Array<{ y: number; text: string; tone: BoxTone; sub?: string }> = [
    { y: 76, text: 'lock(): flag 검사', tone: 'accent', sub: 'while (flag == 1) → 0 이라 통과' },
    { y: 150, text: '⚠ context switch', tone: 'limitation', sub: 'flag set 직전에 끊겼다' },
    { y: 320, text: 'flag = 1', tone: 'problem', sub: 'lock 획득(이라고 믿음)' },
    { y: 374, text: 'critical section 진입', tone: 'problem' },
  ];
  const B: Array<{ y: number; text: string; tone: BoxTone; sub?: string }> = [
    { y: 170, text: 'lock(): flag 검사', tone: 'accent', sub: 'while (flag == 1) → 여전히 0 이라 통과' },
    { y: 244, text: 'flag = 1', tone: 'problem', sub: 'B 도 lock 획득(이라고 믿음)' },
    { y: 298, text: '⚠ context switch', tone: 'limitation' },
    { y: 410, text: '두 thread 가 동시에 CS 안!', tone: 'problem', sub: 'mutual exclusion 깨짐' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Race condition without atomic instruction">
        <ArrowDefs />
        {/* lanes */}
        <rect x={leftX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <rect x={rightX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <text x={leftX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread 1
        </text>
        <text x={rightX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread 2
        </text>
        <text x={20} y={H / 2} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted} transform={`rotate(-90 20 ${H / 2})`}>
          시간 ↓
        </text>

        {A.map((e, i) => (
          <EventBox key={`A-${i}`} x={leftX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}
        {B.map((e, i) => (
          <EventBox key={`B-${i}`} x={rightX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}

        {/* context switch arrows */}
        <Arrow x1={leftX + laneW + 6} y1={A[1].y + 18} x2={rightX - 6} y2={B[0].y + 18} label="switch → T2" />
        <Arrow x1={rightX} y1={B[2].y + 18} x2={leftX + laneW + 6} y2={A[2].y + 18} label="switch → T1" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Test-And-Set (xchg) 의 의미
// ════════════════════════════════════════════════════════════════════════════
export function TestAndSetMechanic({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;

  const colW = 220;
  const gap = 36;
  const startX = (W - (colW * 3 + gap * 2)) / 2;
  const y = 40;
  const colH = 140;

  // 좌: before / 중: xchg 박스 / 우: after
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Test-And-Set atomic exchange">
        <ArrowDefs />
        {/* before */}
        <Card x={startX} y={y} w={colW} h={colH} tone="plain" title="Before">
          <Reg x={startX + 20} y={y + 56} label="%eax" value="1" tone="accent" />
          <Reg x={startX + 20} y={y + 96} label="lock.flag" value="0" tone="muted" />
        </Card>
        <Arrow x1={startX + colW + 4} y1={y + colH / 2} x2={startX + colW + gap - 4} y2={y + colH / 2} />

        {/* xchg */}
        <Card x={startX + colW + gap} y={y} w={colW} h={colH} tone="accent" title="xchg %eax, (%ebx)">
          <text x={startX + colW + gap + colW / 2} y={y + 60} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fill={vars.color.text}>
            두 값을 <tspan fontWeight={700} fill={vars.color.accent}>atomic</tspan> 하게 교환
          </text>
          <text x={startX + colW + gap + colW / 2} y={y + 84} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
            memory bus lock 으로 보장
          </text>
          <text x={startX + colW + gap + colW / 2} y={y + 110} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
            중간에 끼어들 수 없다
          </text>
        </Card>
        <Arrow x1={startX + 2 * colW + 2 * gap - 4} y1={y + colH / 2} x2={startX + 2 * (colW + gap) - 0} y2={y + colH / 2} />

        {/* after */}
        <Card x={startX + 2 * (colW + gap)} y={y} w={colW} h={colH} tone="solution" title="After">
          <Reg x={startX + 2 * (colW + gap) + 20} y={y + 56} label="%eax" value="0" tone="solution" />
          <Reg x={startX + 2 * (colW + gap) + 20} y={y + 96} label="lock.flag" value="1" tone="accent" />
        </Card>

        {/* 결론 */}
        <text x={W / 2} y={y + colH + 60} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          %eax = 0  →  "예전 flag 가 비어 있었다" → <tspan fill={vars.color.solution}>lock 획득 성공</tspan>
        </text>
        <text x={W / 2} y={y + colH + 86} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          %eax = 1  →  "예전 flag 가 이미 잡혀 있었다" → <tspan fill={vars.color.problem}>lock 획득 실패</tspan>
        </text>
        <text x={W / 2} y={y + colH + 116} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          test(이전 값 읽기) 와 set(새 값 쓰기) 가 한 instruction 안에서 묶이는 것이 핵심
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. CAS vs TAS — 의미 비교
// ════════════════════════════════════════════════════════════════════════════
export function CasVsTas({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const colW = 360;
  const gap = 40;
  const leftX = (W - (colW * 2 + gap)) / 2;
  const rightX = leftX + colW + gap;
  const top = 24;
  const colH = 280;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="TAS vs CAS semantic comparison">
        {/* TAS */}
        <Card x={leftX} y={top} w={colW} h={colH} tone="accent" title="TAS (Test-And-Set)">
          <text x={leftX + 20} y={top + 60} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
            old = *ptr;  *ptr = new;  return old;
          </text>
          <Bullet x={leftX + 20} y={top + 95} text="기존 값 읽고, 무조건 새 값 저장" />
          <Bullet x={leftX + 20} y={top + 120} text="단순 0/1 spinlock 구현에 충분" />
          <Bullet x={leftX + 20} y={top + 145} text="실패해도 *ptr 은 이미 새 값으로 덮어쓴 상태" tone="limitation" />

          <text x={leftX + 20} y={top + 190} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
            쓰임새:
          </text>
          <Bullet x={leftX + 20} y={top + 215} text="단순 bool lock" />
          <Bullet x={leftX + 20} y={top + 240} text="atomic flag toggle" />
        </Card>

        {/* CAS */}
        <Card x={rightX} y={top} w={colW} h={colH} tone="solution" title="CAS (Compare-And-Swap)">
          <text x={rightX + 20} y={top + 60} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
            if (*ptr == expected) *ptr = new;
          </text>
          <Bullet x={rightX + 20} y={top + 95} text="기대 값과 같을 때만 새 값으로 변경" />
          <Bullet x={rightX + 20} y={top + 120} text="여러 상태를 구분해야 하는 동기화에 적합" />
          <Bullet x={rightX + 20} y={top + 145} text="실패해도 *ptr 은 그대로 — 더 안전" tone="solution" />

          <text x={rightX + 20} y={top + 190} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
            쓰임새 (예: 4 가지 상태):
          </text>
          <Bullet x={rightX + 20} y={top + 215} text="0=unlocked / 1=locked / 2=sleeping / 3=destroyed" />
          <Bullet x={rightX + 20} y={top + 240} text="lock-free 자료구조" />
        </Card>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Ticket Lock — 번호표 / 순서
// ════════════════════════════════════════════════════════════════════════════
export function TicketLockFlow({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;

  // 좌측: 두 카운터
  const counterX = 60;
  const counterY = 60;
  const counterW = 200;

  // 우측: 줄 선 thread
  const queueX = 320;
  const queueY = 60;

  const threads: Array<{ ticket: number; tone: BoxTone; label: string }> = [
    { ticket: 5, tone: 'solution', label: 'CS 진입 중' },
    { ticket: 6, tone: 'accent', label: '다음 차례' },
    { ticket: 7, tone: 'accent', label: '대기' },
    { ticket: 8, tone: 'accent', label: '대기' },
  ];

  const ringX = 60;
  const ringY = 230;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ticket lock with ticket and turn counters">
        <ArrowDefs />

        {/* counters */}
        <Card x={counterX} y={counterY} w={counterW} h={150} tone="plain" title="Counters">
          <Reg x={counterX + 16} y={counterY + 60} label="ticket" value="9" tone="accent" />
          <Reg x={counterX + 16} y={counterY + 96} label="turn" value="5" tone="solution" />
          <text x={counterX + 16} y={counterY + 130} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
            FAA(&ticket) → 번호표 발급
          </text>
        </Card>

        {/* threads in queue */}
        <text x={queueX} y={queueY - 6} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          줄 서서 대기 (도착 순서 = 번호표 순)
        </text>
        {threads.map((t, i) => {
          const x = queueX + i * 120;
          return (
            <g key={i}>
              <rect x={x} y={queueY} width={100} height={90} rx={8} fill={toneBg(t.tone)} stroke={toneStroke(t.tone)} strokeWidth={1.4} />
              <text x={x + 50} y={queueY + 26} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(t.tone)}>
                Thread
              </text>
              <text x={x + 50} y={queueY + 50} textAnchor="middle" fontSize={18} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(t.tone)}>
                #{t.ticket}
              </text>
              <text x={x + 50} y={queueY + 72} textAnchor="middle" fontSize={10} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {t.label}
              </text>
              {i < threads.length - 1 && (
                <Arrow x1={x + 100 + 2} y1={queueY + 45} x2={x + 120 - 2} y2={queueY + 45} />
              )}
            </g>
          );
        })}

        {/* unlock 화살표 */}
        <text x={ringX} y={ringY} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          unlock 시:
        </text>
        <BoxBg x={ringX} y={ringY + 14} w={460} h={56} tone="solution" />
        <text x={ringX + 16} y={ringY + 36} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('solution')}>
          FAA(&turn)
        </text>
        <text x={ringX + 16} y={ringY + 58} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          turn 을 1 증가 → 다음 번호표 가진 thread 가 자기 차례를 발견하고 진입
        </text>

        <text x={ringX} y={ringY + 100} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          ✓ 기다린 순서대로 진입 → fairness 개선. 단, while 의 spin 은 여전히 남아 있음.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Park/Unpark Lost Wakeup Race — t1~t10 시나리오
// ════════════════════════════════════════════════════════════════════════════
export function LostWakeupRace({ caption }: { caption?: string }) {
  const W = 820;
  const H = 620;
  const laneW = 240;
  const gap = 18;
  const lanesStartX = 40;
  const laneTop = 50;
  const laneBottom = H - 30;

  const lanes = ['OS', 'T1 (lock 시도)', 'T2 (lock 보유자)'];

  type Ev = { y: number; lane: 0 | 1 | 2; text: string; tone: BoxTone; sub?: string };
  const evs: Ev[] = [
    { y: 80, lane: 1, text: 't1  TAS(guard) 0→1', tone: 'accent', sub: 'guard lock 획득' },
    { y: 135, lane: 1, text: 't2  flag == 1, else 진입', tone: 'limitation', sub: 'T2 가 진짜 lock 보유 중' },
    { y: 190, lane: 1, text: 't3  queue_add(T1)', tone: 'accent' },
    { y: 245, lane: 1, text: 't4  guard = 0 (해제)', tone: 'accent' },
    { y: 300, lane: 0, text: 't5  context switch  T1 → T2', tone: 'problem', sub: '⚠ 아직 park() 전!' },
    { y: 355, lane: 2, text: 't6  TAS(guard) 0→1', tone: 'accent' },
    { y: 410, lane: 2, text: 't7  queue_empty? no → T1', tone: 'accent' },
    { y: 460, lane: 2, text: 't8  unpark(T1)', tone: 'limitation', sub: '깨우기 신호를 쐈는데…' },
    { y: 510, lane: 2, text: 't9  guard = 0', tone: 'accent' },
    {
      y: 565,
      lane: 1,
      text: 't10 park() — sleep forever',
      tone: 'problem',
      sub: '⚠ 이미 지나간 unpark 라 영영 못 깨어남 (lost wakeup)',
    },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Park/unpark lost wakeup race timeline">
        <ArrowDefs />
        {/* lanes */}
        {lanes.map((name, i) => {
          const x = lanesStartX + i * (laneW + gap);
          return (
            <g key={i}>
              <rect x={x} y={laneTop} width={laneW} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
              <text x={x + laneW / 2} y={laneTop - 10} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
                {name}
              </text>
            </g>
          );
        })}

        {/* events */}
        {evs.map((e, i) => {
          const x = lanesStartX + e.lane * (laneW + gap) + 8;
          const w = laneW - 16;
          const h = e.sub ? 46 : 30;
          return (
            <g key={i}>
              <BoxBg x={x} y={e.y} w={w} h={h} tone={e.tone} />
              <text x={x + 10} y={e.y + 18} fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(e.tone)}>
                {e.text}
              </text>
              {e.sub && (
                <text x={x + 10} y={e.y + 36} fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                  {e.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Futex — Fast path vs Slow path
// ════════════════════════════════════════════════════════════════════════════
export function FutexFastSlowPath({ caption }: { caption?: string }) {
  const W = 820;
  const H = 400;

  // user space top, kernel bottom
  const userY = 30;
  const userH = 150;
  const kernelY = 230;
  const kernelH = 130;

  // 좌측 fast path, 우측 slow path
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Futex fast path and slow path">
        <ArrowDefs />

        {/* user space */}
        <rect x={30} y={userY} width={W - 60} height={userH} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1.4} rx={6} strokeDasharray="6 4" />
        <text x={48} y={userY + 22} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          User space
        </text>

        {/* kernel space */}
        <rect x={30} y={kernelY} width={W - 60} height={kernelH} fill={vars.color.surfaceAlt} stroke={vars.color.border} strokeWidth={1.4} rx={6} strokeDasharray="6 4" />
        <text x={48} y={kernelY + 22} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          Kernel space
        </text>

        {/* fast path (left) */}
        <BoxBg x={70} y={userY + 36} w={300} h={90} tone="solution" />
        <text x={86} y={userY + 60} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Fast path — 경합 없음
        </text>
        <text x={86} y={userY + 86} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
          atomic_bit_test_set(mutex, 31)
        </text>
        <text x={86} y={userY + 108} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          userspace 의 atomic 한 번으로 lock 획득
        </text>

        {/* slow path (right) */}
        <BoxBg x={W - 70 - 300} y={userY + 36} w={300} h={90} tone="problem" />
        <text x={W - 70 - 300 + 16} y={userY + 60} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('problem')}>
          Slow path — 경합 발생
        </text>
        <text x={W - 70 - 300 + 16} y={userY + 86} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
          atomic_increment(mutex)  // waiter ++
        </text>
        <text x={W - 70 - 300 + 16} y={userY + 108} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          재시도 후 여전히 실패 → kernel 진입
        </text>

        {/* arrow from slow to kernel */}
        <line x1={W / 2 + 80} y1={userY + 36 + 90 + 4} x2={W / 2 + 80} y2={kernelY - 4} stroke={vars.color.problem} strokeWidth={2} markerEnd="url(#arrow-problem)" />
        <text x={W / 2 + 100} y={(userY + userH + kernelY) / 2 + 6} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          syscall
        </text>

        {/* kernel content */}
        <BoxBg x={W - 70 - 300} y={kernelY + 36} w={300} h={70} tone="problem" />
        <text x={W - 70 - 300 + 16} y={kernelY + 58} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('problem')}>
          futex_wait / futex_wake
        </text>
        <text x={W - 70 - 300 + 16} y={kernelY + 82} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          thread 를 재우고 깨우는 일은 kernel 책임
        </text>

        {/* note */}
        <text x={70} y={kernelY + 70} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          futex 의 매력
        </text>
        <text x={70} y={kernelY + 92} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          • 경합 없는 경우의 lock 비용 = atomic 명령 1 번 (kernel 진입 없음)
        </text>
        <text x={70} y={kernelY + 110} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          • 경합 시에만 kernel 의 sleep/wake 인프라 사용
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Two-Phase Lock — 짧으면 spin, 길면 sleep
// ════════════════════════════════════════════════════════════════════════════
export function TwoPhaseLock({ caption }: { caption?: string }) {
  const W = 820;
  const H = 280;

  const trackY = 100;
  const trackH = 50;
  const padX = 40;

  const phase1End = 360;
  const totalEnd = W - padX;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Two-phase lock — spin then sleep">
        <ArrowDefs />

        {/* axis */}
        <line x1={padX} x2={W - padX} y1={trackY + trackH + 30} y2={trackY + trackH + 30} stroke={vars.color.borderStrong} strokeWidth={1.2} />
        <text x={(padX + totalEnd) / 2} y={trackY + trackH + 50} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          시간 →
        </text>

        {/* phase 1: spin */}
        <BoxBg x={padX} y={trackY} w={phase1End - padX} h={trackH} tone="limitation" />
        <text x={(padX + phase1End) / 2} y={trackY + 22} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('limitation')}>
          Phase 1 — 짧게 spin (TAS 반복)
        </text>
        <text x={(padX + phase1End) / 2} y={trackY + 40} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          lock 이 곧 풀릴 거라면 sleep 비용보다 싸다
        </text>

        {/* divider */}
        <line x1={phase1End} y1={trackY - 6} x2={phase1End} y2={trackY + trackH + 6} stroke={vars.color.borderStrong} strokeWidth={1.4} strokeDasharray="4 3" />

        {/* phase 2: sleep */}
        <BoxBg x={phase1End} y={trackY} w={totalEnd - phase1End} h={trackH} tone="accent" />
        <text x={(phase1End + totalEnd) / 2} y={trackY + 22} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          Phase 2 — sleep (park / futex_wait)
        </text>
        <text x={(phase1End + totalEnd) / 2} y={trackY + 40} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          spin 한계 초과 → CPU 양보하고 잠들기
        </text>

        {/* labels */}
        <text x={padX} y={trackY - 12} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          짧은 대기에 유리
        </text>
        <text x={W - padX} y={trackY - 12} textAnchor="end" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          긴 대기에 유리
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Primitives & helpers
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
function Card({
  x,
  y,
  w,
  h,
  tone,
  title,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  title: string;
  children?: ReactNode;
}) {
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text x={x + 14} y={y + 22} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(tone)}>
        {title}
      </text>
      {children}
    </g>
  );
}
function Reg({ x, y, label, value, tone }: { x: number; y: number; label: string; value: string; tone: BoxTone }) {
  return (
    <g>
      <text x={x} y={y} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.textMuted}>
        {label}
      </text>
      <text x={x + 90} y={y} fontSize={16} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
        = {value}
      </text>
    </g>
  );
}
function Bullet({ x, y, text, tone = 'plain' }: { x: number; y: number; text: string; tone?: BoxTone }) {
  return (
    <text x={x} y={y} fontSize={11.5} fontFamily={vars.font.sans} fill={tone === 'plain' ? vars.color.text : toneTextColor(tone)}>
      • {text}
    </text>
  );
}
function EventBox({
  x,
  y,
  w,
  text,
  sub,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  sub?: string;
  tone: BoxTone;
}) {
  const h = sub ? 50 : 32;
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text x={x + 14} y={y + 20} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
        {text}
      </text>
      {sub && (
        <text x={x + 14} y={y + 40} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          {sub}
        </text>
      )}
    </g>
  );
}
function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow-default" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.evoArrow} />
      </marker>
      <marker id="arrow-problem" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.problem} />
      </marker>
    </defs>
  );
}
function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={vars.color.evoArrow} strokeWidth={1.4} markerEnd="url(#arrow-default)" />
      {label && (
        <text x={midX} y={midY - 5} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          {label}
        </text>
      )}
    </g>
  );
}
