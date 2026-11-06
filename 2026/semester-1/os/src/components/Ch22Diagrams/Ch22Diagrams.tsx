import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch22Diagrams.css';

/**
 * 22장(Condition Variables) SVG 다이어그램 모음.
 * 다른 장과 동일한 톤 규칙.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. CV 의 3 구성요소 — CV + state variable + lock
// ════════════════════════════════════════════════════════════════════════════
export function CondVarTrio({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;
  const cardW = 240;
  const cardH = 200;
  const gap = 30;
  const startX = (W - cardW * 3 - gap * 2) / 2;
  const y = 50;

  const items: Array<{ title: string; sub: string; tone: BoxTone; rows: string[] }> = [
    {
      title: 'Condition Variable',
      sub: '잠/깨우기 채널',
      tone: 'accent',
      rows: ['wait queue (잠든 thread들)', 'wait() → 큐에 넣고 sleep', 'signal() → 하나 깨움'],
    },
    {
      title: 'State Variable',
      sub: '실제 상태',
      tone: 'solution',
      rows: ['예: done, count', 'while(!cond) 의 cond 가 이쪽', 'CV 와 별개의 보통 변수'],
    },
    {
      title: 'Lock (Mutex)',
      sub: '둘을 한 묶음으로 보호',
      tone: 'problem',
      rows: ['state 변경/검사', 'wait 호출 (반드시 hold)', 'signal 호출 (관례상)'],
    },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Condition variable trio: CV + state variable + lock">
        <ArrowDefs />
        {items.map((it, i) => {
          const x = startX + i * (cardW + gap);
          return (
            <g key={i}>
              <BoxBg x={x} y={y} w={cardW} h={cardH} tone={it.tone} />
              <text x={x + cardW / 2} y={y + 26} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(it.tone)}>
                {it.title}
              </text>
              <text x={x + cardW / 2} y={y + 44} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {it.sub}
              </text>
              {it.rows.map((r, j) => (
                <text key={j} x={x + 18} y={y + 78 + j * 26} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
                  • {r}
                </text>
              ))}
            </g>
          );
        })}
        <text x={W / 2} y={H - 16} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          셋 중 하나만 빠져도 lost wakeup / 무한 sleep 같은 race 가 생긴다.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. wait / signal 의 의미 — sleep+unlock / wakeup+reacquire
// ════════════════════════════════════════════════════════════════════════════
export function WaitSignalMechanics({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;
  const cardW = 360;
  const gap = 40;
  const startX = (W - cardW * 2 - gap) / 2;
  const y = 40;
  const cardH = 230;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="cond_wait and cond_signal mechanics">
        <ArrowDefs />

        {/* wait */}
        <BoxBg x={startX} y={y} w={cardW} h={cardH} tone="accent" />
        <text x={startX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          pthread_cond_wait(&c, &m)
        </text>
        <text x={startX + cardW / 2} y={y + 60} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          = Sleep + Unlock (atomic)
        </text>
        <text x={startX + 18} y={y + 95} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          1) 현재 thread 를 c 의 wait queue 에 넣음
        </text>
        <text x={startX + 18} y={y + 117} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          2) mutex m 을 풀고 잠든다 — 한 instruction 처럼
        </text>
        <text x={startX + 18} y={y + 139} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          3) 깨어날 때는 m 을 다시 잡고 반환
        </text>
        <text x={startX + 18} y={y + 170} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          ⚠ 호출 전 m 을 반드시 lock 한 상태여야 한다.
        </text>
        <text x={startX + 18} y={y + 192} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          atomic 한 이유 — lost wakeup 방지
        </text>

        {/* signal */}
        <BoxBg x={startX + cardW + gap} y={y} w={cardW} h={cardH} tone="solution" />
        <text x={startX + cardW + gap + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          pthread_cond_signal(&c)
        </text>
        <text x={startX + cardW + gap + cardW / 2} y={y + 60} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          = Wakeup 하나
        </text>
        <text x={startX + cardW + gap + 18} y={y + 95} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          1) c 의 wait queue 에 thread 있으면 하나 깨움
        </text>
        <text x={startX + cardW + gap + 18} y={y + 117} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          2) 깨어난 thread 는 즉시 실행 ❌
        </text>
        <text x={startX + cardW + gap + 18} y={y + 139} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          3) ready 큐로 옮겨지고, 그 뒤 mutex 재획득
        </text>
        <text x={startX + cardW + gap + 18} y={y + 170} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          ⚠ 큐가 비어 있으면 신호는 그냥 사라진다 (저장 X)
        </text>
        <text x={startX + cardW + gap + 18} y={y + 192} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          ← 이래서 state variable 이 필요한 것.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. state variable 없으면 — signal 이 허공에 사라짐
// ════════════════════════════════════════════════════════════════════════════
export function LostSignalNoState({ caption }: { caption?: string }) {
  const W = 820;
  const H = 460;
  const laneW = 320;
  const gap = 80;
  const leftX = (W - laneW * 2 - gap) / 2;
  const rightX = leftX + laneW + gap;
  const laneTop = 40;
  const laneBottom = H - 40;

  const A = [
    { y: 240, text: 'thr_join()', tone: 'accent' as BoxTone, sub: 'lock + wait' },
    { y: 300, text: 'cond_wait(c, m)', tone: 'limitation' as BoxTone, sub: 'queue 비어 있는 채로 sleep' },
    { y: 380, text: '⚠ sleep forever', tone: 'problem' as BoxTone, sub: '깨워줄 thread 가 없음' },
  ];
  const B = [
    { y: 80, text: 'child 실행', tone: 'accent' as BoxTone },
    { y: 130, text: 'thr_exit()', tone: 'accent' as BoxTone, sub: 'lock + signal + unlock' },
    { y: 190, text: 'cond_signal(c)', tone: 'problem' as BoxTone, sub: '큐가 비어 있어 그냥 사라짐' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lost signal without state variable">
        <ArrowDefs />
        <rect x={leftX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <rect x={rightX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <text x={leftX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Parent (늦게 실행)
        </text>
        <text x={rightX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Child (먼저 실행)
        </text>
        <text x={20} y={H / 2} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted} transform={`rotate(-90 20 ${H / 2})`}>
          시간 ↓
        </text>
        {A.map((e, i) => (
          <Step key={`a${i}`} x={leftX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}
        {B.map((e, i) => (
          <Step key={`b${i}`} x={rightX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}
        {/* signal 화살표가 허공으로 사라짐 */}
        <line x1={rightX} y1={B[2].y + 16} x2={leftX + laneW + 4} y2={B[2].y + 16} stroke={vars.color.problem} strokeWidth={2} strokeDasharray="4 4" />
        <text x={rightX - 6} y={B[2].y + 38} textAnchor="end" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fontWeight={700} fill={vars.color.problem}>
          ✗ 받을 thread 없음 → 신호 소멸
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Lock 없으면 — check 와 wait 사이 race ([19페이지 표] 시각화)
// ════════════════════════════════════════════════════════════════════════════
export function LostWakeupNoLock({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const laneW = 320;
  const gap = 80;
  const leftX = (W - laneW * 2 - gap) / 2;
  const rightX = leftX + laneW + gap;
  const laneTop = 40;
  const laneBottom = H - 30;

  const P = [
    { y: 80, text: 't1: check done == 0 → true', tone: 'accent' as BoxTone, sub: '아직 false, wait 으로 가야 함' },
    { y: 240, text: 't4: wait(c, m)', tone: 'limitation' as BoxTone, sub: 'queue 진입 → sleep' },
    { y: 300, text: '⚠ never wake up', tone: 'problem' as BoxTone },
  ];
  const C = [
    { y: 140, text: 't2: done = 1', tone: 'solution' as BoxTone },
    { y: 190, text: 't3: signal(c)', tone: 'problem' as BoxTone, sub: '큐가 비어 있음 → 사라짐' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lost wakeup race without lock between check and wait">
        <ArrowDefs />
        <rect x={leftX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <rect x={rightX - 10} y={laneTop} width={laneW + 20} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <text x={leftX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          parent thread
        </text>
        <text x={rightX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          child thread
        </text>
        <text x={20} y={H / 2} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted} transform={`rotate(-90 20 ${H / 2})`}>
          시간 ↓
        </text>
        {P.map((e, i) => (
          <Step key={`p${i}`} x={leftX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}
        {C.map((e, i) => (
          <Step key={`c${i}`} x={rightX} y={e.y} w={laneW} text={e.text} sub={e.sub} tone={e.tone} />
        ))}

        {/* 위험 구간 강조 */}
        <rect x={leftX - 14} y={P[0].y + 36} width={laneW + 28} height={P[1].y - P[0].y - 36} fill={vars.color.problemSoft} stroke={vars.color.problem} strokeWidth={1.2} strokeDasharray="5 4" rx={6} opacity={0.6} />
        <text x={leftX + laneW / 2} y={(P[0].y + P[1].y) / 2 + 16} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontStyle="italic" fontWeight={700} fill={vars.color.problem}>
          ⚠ check 와 wait 사이의 race window
        </text>
        <text x={leftX + laneW / 2} y={(P[0].y + P[1].y) / 2 + 38} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          context switch 가 끼면 child 가 다 끝나 버린다
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Producer / Consumer 기본 구조
// ════════════════════════════════════════════════════════════════════════════
export function ProducerConsumerLayout({ caption }: { caption?: string }) {
  const W = 820;
  const H = 280;

  // producer
  const pX = 40;
  const pY = 90;
  const pW = 180;
  const pH = 80;

  // buffer in middle
  const bufX = 280;
  const bufY = 70;
  const bufW = 260;
  const bufH = 120;

  // consumer
  const cX = W - 40 - 180;
  const cY = 90;
  const cW = 180;
  const cH = 80;

  // buffer slots
  const slotCount = 5;
  const slotW = 36;
  const slotGap = 8;
  const slotsTotalW = slotCount * slotW + (slotCount - 1) * slotGap;
  const slotStartX = bufX + (bufW - slotsTotalW) / 2;
  const slotY = bufY + 40;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Producer-consumer layout with bounded buffer">
        <ArrowDefs />

        <BoxBg x={pX} y={pY} w={pW} h={pH} tone="solution" />
        <text x={pX + pW / 2} y={pY + 28} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Producer
        </text>
        <text x={pX + pW / 2} y={pY + 52} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          데이터 생성 → put()
        </text>
        <text x={pX + pW / 2} y={pY + 70} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          full 이면 wait
        </text>

        {/* buffer */}
        <BoxBg x={bufX} y={bufY} w={bufW} h={bufH} tone="accent" />
        <text x={bufX + bufW / 2} y={bufY + 24} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          Bounded Buffer + Lock + CV
        </text>
        {Array.from({ length: slotCount }).map((_, i) => {
          const x = slotStartX + i * (slotW + slotGap);
          const filled = i < 3;
          return (
            <g key={i}>
              <rect x={x} y={slotY} width={slotW} height={36} rx={4} fill={filled ? toneBg('solution') : vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.2} />
              {filled && (
                <text x={x + slotW / 2} y={slotY + 24} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('solution')}>
                  {i + 1}
                </text>
              )}
            </g>
          );
        })}
        <text x={bufX + bufW / 2} y={bufY + bufH - 8} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          count = 3 / MAX = 5
        </text>

        {/* arrows */}
        <Arrow x1={pX + pW + 4} y1={pY + pH / 2} x2={bufX - 4} y2={bufY + bufH / 2} label="put" />
        <Arrow x1={bufX + bufW + 4} y1={bufY + bufH / 2} x2={cX - 4} y2={cY + cH / 2} label="get" />

        <BoxBg x={cX} y={cY} w={cW} h={cH} tone="solution" />
        <text x={cX + cW / 2} y={cY + 28} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Consumer
        </text>
        <text x={cX + cW / 2} y={cY + 52} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          get() → 데이터 처리
        </text>
        <text x={cX + cW / 2} y={cY + 70} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          empty 면 wait
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Mesa vs Hoare semantics
// ════════════════════════════════════════════════════════════════════════════
export function MesaVsHoareSemantics({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;
  const cardW = 360;
  const gap = 40;
  const startX = (W - cardW * 2 - gap) / 2;
  const y = 30;
  const cardH = 250;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mesa vs Hoare semantics">
        {/* Mesa */}
        <BoxBg x={startX} y={y} w={cardW} h={cardH} tone="accent" />
        <text x={startX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          Mesa semantics (Linux · Windows 등)
        </text>
        <text x={startX + 16} y={y + 56} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          signal = "너 이제 깨어날 수 있어"
        </text>
        <text x={startX + 18} y={y + 90} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 깨어난 thread 가 즉시 실행되지 않음
        </text>
        <text x={startX + 18} y={y + 114} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 그 사이 다른 thread 가 상태를 또 바꿀 수 있음
        </text>
        <text x={startX + 18} y={y + 138} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • → 조건이 여전히 참인지 보장 X
        </text>
        <text x={startX + 18} y={y + 178} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          ⚠ 반드시 while 로 재검사
        </text>
        <text x={startX + 18} y={y + 218} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          단순하고 효율적이라 거의 모든 실제 OS 가 채택.
        </text>

        {/* Hoare */}
        <BoxBg x={startX + cardW + gap} y={y} w={cardW} h={cardH} tone="muted" />
        <text x={startX + cardW + gap + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          Hoare semantics (이론적)
        </text>
        <text x={startX + cardW + gap + 16} y={y + 56} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          signal = "지금 너에게 lock 을 넘긴다"
        </text>
        <text x={startX + cardW + gap + 18} y={y + 90} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 깨어난 thread 가 signal 직후 즉시 실행
        </text>
        <text x={startX + cardW + gap + 18} y={y + 114} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 조건이 만족된 상태 그대로 깨어남 보장
        </text>
        <text x={startX + cardW + gap + 18} y={y + 138} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • → if 검사로도 안전
        </text>
        <text x={startX + cardW + gap + 18} y={y + 178} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          ✓ 강한 보장
        </text>
        <text x={startX + cardW + gap + 18} y={y + 218} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          구현 비용이 커서 실제 시스템에선 거의 안 씀.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Multi-consumer 가 single-CV 를 깨뜨리는 시나리오 ([19페이지 표])
// ════════════════════════════════════════════════════════════════════════════
export function MultiConsumerBreaks({ caption }: { caption?: string }) {
  const W = 820;
  const H = 540;
  const laneW = 240;
  const gap = 16;
  const lanesStartX = 40;
  const laneTop = 50;
  const laneBottom = H - 30;
  const lanes = ['Tc1 (consumer 1)', 'Tc2 (consumer 2)', 'Tp (producer)'];

  type Ev = { y: number; lane: 0 | 1 | 2; text: string; tone: BoxTone; sub?: string };
  const evs: Ev[] = [
    { y: 80, lane: 0, text: 'C1 lock', tone: 'accent' },
    { y: 120, lane: 0, text: 'C2 count==0?', tone: 'accent', sub: '✓ → if 통과' },
    { y: 165, lane: 0, text: 'C3 sleep on cond', tone: 'limitation' },
    { y: 215, lane: 1, text: 'C1 lock', tone: 'accent' },
    { y: 255, lane: 1, text: 'C2 count==0?', tone: 'accent', sub: '✓ → if 통과' },
    { y: 300, lane: 1, text: 'C3 sleep on cond', tone: 'limitation' },
    { y: 340, lane: 2, text: 'P put + signal', tone: 'accent', sub: 'count=1, Tc1 깨움' },
    { y: 390, lane: 1, text: 'Tc2 가 먼저 lock 잡고 get', tone: 'problem', sub: '⚠ count 0 으로 만든 뒤 unlock' },
    { y: 440, lane: 0, text: 'Tc1 깨어남 → get', tone: 'problem', sub: '⚠ assert(count==1) 실패!' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Single condition variable with multiple consumers breaks">
        <ArrowDefs />
        {lanes.map((name, i) => {
          const x = lanesStartX + i * (laneW + gap);
          const isProducer = i === 2;
          return (
            <g key={i}>
              <rect x={x} y={laneTop} width={laneW} height={laneBottom - laneTop} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
              <text x={x + laneW / 2} y={laneTop - 10} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={isProducer ? vars.color.solution : vars.color.accent}>
                {name}
              </text>
            </g>
          );
        })}
        {evs.map((e, i) => {
          const x = lanesStartX + e.lane * (laneW + gap) + 8;
          const w = laneW - 16;
          const h = e.sub ? 42 : 28;
          return (
            <g key={i}>
              <BoxBg x={x} y={e.y} w={w} h={h} tone={e.tone} />
              <text x={x + 10} y={e.y + 18} fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(e.tone)}>
                {e.text}
              </text>
              {e.sub && (
                <text x={x + 10} y={e.y + 34} fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                  {e.sub}
                </text>
              )}
            </g>
          );
        })}
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          if 로 한 번만 검사하면, signal 받은 Tc1 이 실행될 때는 이미 Tc2 가 채간 뒤일 수 있다 → while 재검사 필수.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Two condition variables — empty / fill
// ════════════════════════════════════════════════════════════════════════════
export function TwoCondVarsEmptyFill({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;

  const sideW = 260;
  const sideH = 220;
  const leftX = 40;
  const rightX = W - 40 - sideW;
  const y = 60;

  const cvW = 160;
  const cvH = 70;
  const cvX = (W - cvW * 2 - 40) / 2;
  const emptyCvX = cvX;
  const fillCvX = cvX + cvW + 40;
  const cvY = 130;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Two condition variables empty and fill">
        <ArrowDefs />

        {/* producer side */}
        <BoxBg x={leftX} y={y} w={sideW} h={sideH} tone="solution" />
        <text x={leftX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Producer
        </text>
        <text x={leftX + 18} y={y + 56} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
          while (count == MAX)
        </text>
        <text x={leftX + 18} y={y + 76} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.problem}>
          {'  wait(&empty)'}
        </text>
        <text x={leftX + 18} y={y + 96} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
          put(i);
        </text>
        <text x={leftX + 18} y={y + 116} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.solution}>
          signal(&fill);
        </text>

        {/* consumer side */}
        <BoxBg x={rightX} y={y} w={sideW} h={sideH} tone="solution" />
        <text x={rightX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Consumer
        </text>
        <text x={rightX + 18} y={y + 56} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
          while (count == 0)
        </text>
        <text x={rightX + 18} y={y + 76} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.problem}>
          {'  wait(&fill)'}
        </text>
        <text x={rightX + 18} y={y + 96} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
          get();
        </text>
        <text x={rightX + 18} y={y + 116} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.solution}>
          signal(&empty);
        </text>

        {/* CVs in middle */}
        <BoxBg x={emptyCvX} y={cvY} w={cvW} h={cvH} tone="accent" />
        <text x={emptyCvX + cvW / 2} y={cvY + 26} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('accent')}>
          empty (CV)
        </text>
        <text x={emptyCvX + cvW / 2} y={cvY + 48} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          producer 가 비기를 기다림
        </text>

        <BoxBg x={fillCvX} y={cvY} w={cvW} h={cvH} tone="accent" />
        <text x={fillCvX + cvW / 2} y={cvY + 26} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('accent')}>
          fill (CV)
        </text>
        <text x={fillCvX + cvW / 2} y={cvY + 48} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          consumer 가 차기를 기다림
        </text>

        {/* arrows */}
        {/* producer waits on empty */}
        <line x1={leftX + sideW + 2} y1={y + 70} x2={emptyCvX - 2} y2={cvY + 12} stroke={vars.color.problem} strokeWidth={1.4} markerEnd="url(#arrow-problem)" />
        {/* consumer waits on fill */}
        <line x1={rightX - 2} y1={y + 70} x2={fillCvX + cvW + 2} y2={cvY + 12} stroke={vars.color.problem} strokeWidth={1.4} markerEnd="url(#arrow-problem)" />
        {/* producer signals fill */}
        <line x1={leftX + sideW + 2} y1={y + 116} x2={fillCvX - 2} y2={cvY + 50} stroke={vars.color.solution} strokeWidth={1.4} markerEnd="url(#arrow-solution)" />
        {/* consumer signals empty */}
        <line x1={rightX - 2} y1={y + 116} x2={emptyCvX + cvW + 2} y2={cvY + 50} stroke={vars.color.solution} strokeWidth={1.4} markerEnd="url(#arrow-solution)" />

        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          producer 는 항상 fill 에 signal, consumer 는 항상 empty 에 signal → "엉뚱한 쪽 깨우기" 방지.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Circular buffer — fill / use 포인터 wrap
// ════════════════════════════════════════════════════════════════════════════
export function CircularBuffer({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;

  const cellW = 64;
  const cellH = 64;
  const cellGap = 8;
  const MAX = 8;
  const totalW = MAX * cellW + (MAX - 1) * cellGap;
  const startX = (W - totalW) / 2;
  const y = 140;

  // example state: use=2, fill=6, count=4 (items at 2,3,4,5)
  const use = 2;
  const fill = 6;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Circular buffer with fill and use pointers">
        <ArrowDefs />

        {Array.from({ length: MAX }).map((_, i) => {
          const x = startX + i * (cellW + cellGap);
          const isItem = i >= use && i < fill;
          return (
            <g key={i}>
              <rect x={x} y={y} width={cellW} height={cellH} rx={6} fill={isItem ? toneBg('solution') : vars.color.surface} stroke={isItem ? toneStroke('solution') : vars.color.borderStrong} strokeWidth={1.4} />
              <text x={x + cellW / 2} y={y + 38} textAnchor="middle" fontSize={16} fontFamily={vars.font.mono} fontWeight={700} fill={isItem ? toneTextColor('solution') : vars.color.textFaint}>
                {isItem ? `${i + 10}` : ''}
              </text>
              <text x={x + cellW / 2} y={y + cellH + 18} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                [{i}]
              </text>
            </g>
          );
        })}

        {/* use pointer */}
        <text x={startX + use * (cellW + cellGap) + cellW / 2} y={y - 18} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.accent}>
          use ↓
        </text>
        <text x={startX + use * (cellW + cellGap) + cellW / 2} y={y - 32} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          consumer 가 꺼낼 자리
        </text>

        {/* fill pointer */}
        <text x={startX + fill * (cellW + cellGap) + cellW / 2} y={y - 18} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          fill ↓
        </text>
        <text x={startX + fill * (cellW + cellGap) + cellW / 2} y={y - 32} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          producer 가 넣을 자리
        </text>

        {/* wrap arrow */}
        <path
          d={`M ${startX + MAX * (cellW + cellGap) - cellGap} ${y + cellH + 40}
              Q ${startX + totalW + 40} ${y + cellH + 70}
                ${startX + totalW + 20} ${y + cellH + 90}
              T ${startX - 20} ${y + cellH + 90}
              Q ${startX - 40} ${y + cellH + 70}
                ${startX} ${y + cellH + 40}`}
          fill="none"
          stroke={vars.color.evoArrow}
          strokeWidth={1.4}
          markerEnd="url(#arrow-default)"
          strokeDasharray="6 4"
        />
        <text x={W / 2} y={y + cellH + 96} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          fill = (fill + 1) % MAX — 끝에 도달하면 0 으로 wrap
        </text>

        <text x={W / 2} y={50} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          count = {fill - use} / MAX = {MAX}  (use→fill 사이가 데이터)
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 10. Covering condition + broadcast
// ════════════════════════════════════════════════════════════════════════════
export function CoveringConditionBroadcast({ caption }: { caption?: string }) {
  const W = 820;
  const H = 400;

  const topX = (W - 240) / 2;
  const topY = 30;
  const topW = 240;
  const topH = 60;

  const waiterY = 170;
  const waiterW = 160;
  const waiterH = 110;
  const waiters = [
    { label: 'T1 (need 50B)', tone: 'solution' as BoxTone, result: '✓ 진행' },
    { label: 'T2 (need 200B)', tone: 'limitation' as BoxTone, result: '재검사 → 다시 sleep' },
    { label: 'T3 (need 30B)', tone: 'solution' as BoxTone, result: '✓ 진행' },
    { label: 'T4 (need 500B)', tone: 'limitation' as BoxTone, result: '재검사 → 다시 sleep' },
  ];
  const waiterGap = (W - waiters.length * waiterW - 80) / (waiters.length - 1);
  const waiterStartX = 40;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Covering condition with broadcast">
        <ArrowDefs />

        {/* free() with broadcast */}
        <BoxBg x={topX} y={topY} w={topW} h={topH} tone="accent" />
        <text x={topX + topW / 2} y={topY + 26} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('accent')}>
          free(): bytesLeft += size
        </text>
        <text x={topX + topW / 2} y={topY + 46} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          cond_broadcast(&c)
        </text>

        {/* arrows to all waiters */}
        {waiters.map((_, i) => {
          const wx = waiterStartX + i * (waiterW + waiterGap) + waiterW / 2;
          return (
            <line key={i} x1={topX + topW / 2} y1={topY + topH + 2} x2={wx} y2={waiterY - 2} stroke={vars.color.problem} strokeWidth={1.3} markerEnd="url(#arrow-problem)" />
          );
        })}

        {/* waiters */}
        {waiters.map((w, i) => {
          const x = waiterStartX + i * (waiterW + waiterGap);
          return (
            <g key={i}>
              <BoxBg x={x} y={waiterY} w={waiterW} h={waiterH} tone={w.tone} />
              <text x={x + waiterW / 2} y={waiterY + 24} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(w.tone)}>
                {w.label}
              </text>
              <text x={x + waiterW / 2} y={waiterY + 56} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                while 재검사
              </text>
              <text x={x + waiterW / 2} y={waiterY + 86} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(w.tone)}>
                {w.result}
              </text>
            </g>
          );
        })}

        {/* note */}
        <text x={W / 2} y={H - 60} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ✓ 안전 — 누구를 깨워야 할지 몰라도 모두 깨워서 각자 자기 조건을 보게 한다.
        </text>
        <text x={W / 2} y={H - 38} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          ⚠ 비용 — 조건을 만족 못 하는 thread 까지 다 깨워서 다시 재우는 낭비 (thundering herd)
        </text>
        <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          정확히 누굴 깨울지 알 수 있는 상황이라면 signal 이 더 효율적.
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
function Step({ x, y, w, text, sub, tone }: { x: number; y: number; w: number; text: string; sub?: string; tone: BoxTone }) {
  const h = sub ? 46 : 30;
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text x={x + 12} y={y + 18} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
        {text}
      </text>
      {sub && (
        <text x={x + 12} y={y + 36} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
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
      <marker id="arrow-solution" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.solution} />
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
