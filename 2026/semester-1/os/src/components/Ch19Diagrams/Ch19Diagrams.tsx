import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch19Diagrams.css';

/**
 * 19장(Thread API) 전용 SVG 다이어그램 모음.
 * 다른 장(Ch15/16/18Diagrams)과 같은 톤 규칙.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. pthread_create + pthread_join 타임라인
// ════════════════════════════════════════════════════════════════════════════
export function PthreadJoinTimeline({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const padX = 60;
  const lineY1 = 90; // main lane
  const lineY2 = 220; // child lane

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="pthread_create and pthread_join timeline">
        <ArrowDefs />

        {/* Lane labels */}
        <Tag x={padX - 50} y={lineY1 + 4} text="main" tone="accent" bold size={13} />
        <Tag x={padX - 50} y={lineY2 + 4} text="child" tone="problem" bold size={13} />

        {/* Lifelines */}
        <line x1={padX} x2={W - padX} y1={lineY1} y2={lineY1} stroke={vars.color.accent} strokeWidth={2} />
        <line x1={padX + 180} x2={W - padX - 60} y1={lineY2} y2={lineY2} stroke={vars.color.problem} strokeWidth={2} />

        {/* time arrow */}
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          시간 →
        </text>
        <line x1={padX} x2={W - padX} y1={H - 36} y2={H - 36} stroke={vars.color.border} strokeWidth={1} strokeDasharray="3 4" />

        {/* main events */}
        <Event x={padX + 30} y={lineY1} text="…" />
        <Event x={padX + 180} y={lineY1} text="pthread_create" tone="accent" mark />
        <Event x={padX + 350} y={lineY1} text="…work…" />
        <Event x={padX + 480} y={lineY1} text="pthread_join (blocked)" tone="limitation" mark />
        <Event x={padX + 660} y={lineY1} text="resume" tone="solution" mark />

        {/* child events */}
        <Event x={padX + 200} y={lineY2} text="start_routine 시작" tone="problem" mark />
        <Event x={padX + 400} y={lineY2} text="…work…" />
        <Event x={padX + 580} y={lineY2} text="return (void *)" tone="problem" mark />

        {/* create → child birth */}
        <Arrow x1={padX + 180} y1={lineY1 + 6} x2={padX + 200} y2={lineY2 - 6} label="새 thread 탄생" />

        {/* child return → main resume */}
        <Arrow x1={padX + 580} y1={lineY2 - 6} x2={padX + 660} y2={lineY1 + 6} label="값 전달 (void **)" />

        {/* join 대기 영역 강조 */}
        <rect
          x={padX + 480}
          y={lineY1 - 6}
          width={180}
          height={12}
          fill={vars.color.limitationSoft}
          stroke={vars.color.limitation}
          strokeWidth={1}
          rx={2}
          opacity={0.7}
        />
        <text x={padX + 570} y={lineY1 + 30} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.limitation}>
          join 은 child 가 끝날 때까지 main 을 잠재운다
        </text>

        {/* legend */}
        <text x={padX} y={H - 60} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          • pthread_create 4번째 인자(<tspan fontFamily={vars.font.mono} fontWeight={700}>void *arg</tspan>)로 데이터 전달
        </text>
        <text x={padX} y={H - 44} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          • pthread_join 의 <tspan fontFamily={vars.font.mono} fontWeight={700}>void **value_ptr</tspan> 로 반환값 수신 (필요 없으면 NULL)
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Stack 반환의 위험 (dangling pointer)
// ════════════════════════════════════════════════════════════════════════════
export function StackReturnDanger({ caption }: { caption?: string }) {
  const W = 820;
  const H = 380;
  const colW = 320;
  const gap = 40;
  const leftX = (W - (colW * 2 + gap)) / 2;
  const rightX = leftX + colW + gap;
  const colTop = 24;
  const colH = 280;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Stack return creating dangling pointer">
        <ArrowDefs />

        {/* LEFT: foo() 실행 중 */}
        <BoxBg x={leftX} y={colTop} w={colW} h={colH} tone="plain" />
        <Tag x={leftX + 16} y={colTop + 22} text="foo() 실행 중" tone="accent" bold size={13} />
        {/* stack frame of foo */}
        <rect x={leftX + 20} y={colTop + 50} width={colW - 40} height={130} fill={toneBg('problem')} stroke={toneStroke('problem')} strokeWidth={1.4} rx={4} />
        <text x={leftX + colW / 2} y={colTop + 70} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('problem')}>
          foo() 의 stack frame
        </text>
        <text x={leftX + 36} y={colTop + 100} fontSize={12.5} fontFamily={vars.font.mono} fill={vars.color.text}>
          local: int x = 10;
        </text>
        <Pointer x={leftX + colW - 28} y={colTop + 100} label="&x" tone="accent" />

        <text x={leftX + 36} y={colTop + 140} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          x 는 이 frame 안에 살아 있다
        </text>
        <text x={leftX + 36} y={colTop + 160} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          &x 도 유효한 주소
        </text>

        <text x={leftX + 36} y={colTop + 210} fontSize={12} fontFamily={vars.font.mono} fontStyle="italic" fill={vars.color.textMuted}>
          return &x;
        </text>
        <text x={leftX + 36} y={colTop + 240} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          호출자에게 이 주소를 돌려준다.
        </text>

        {/* RIGHT: 반환 후 */}
        <BoxBg x={rightX} y={colTop} w={colW} h={colH} tone="plain" />
        <Tag x={rightX + 16} y={colTop + 22} text="foo() 가 return 된 직후" tone="problem" bold size={13} />
        {/* stack frame torn down */}
        <rect x={rightX + 20} y={colTop + 50} width={colW - 40} height={130} fill={vars.color.surfaceAlt} stroke={vars.color.border} strokeWidth={1.2} strokeDasharray="5 5" rx={4} />
        <text x={rightX + colW / 2} y={colTop + 75} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textFaint}>
          foo() 의 frame 사라짐
        </text>
        <text x={rightX + colW / 2} y={colTop + 100} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textFaint}>
          (또는 다음 호출이 덮어씀)
        </text>
        <Pointer x={rightX + colW - 28} y={colTop + 140} label="&x" tone="problem" />
        <text x={rightX + colW - 86} y={colTop + 160} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          dangling!
        </text>

        <text x={rightX + 36} y={colTop + 210} fontSize={12} fontFamily={vars.font.mono} fontStyle="italic" fill={vars.color.problem}>
          *p_returned // ⚠️ UB
        </text>
        <text x={rightX + 36} y={colTop + 240} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          쓰레기 값일 수도, crash 일 수도.
        </text>

        {/* 하단 안내 */}
        <text x={W / 2} y={H - 26} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          해결: <tspan fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>malloc</tspan> 으로 heap 에 잡고 그 포인터를 반환 → frame 이 사라져도 살아남는다.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Lock 의 세 변형 (lock / trylock / timedlock)
// ════════════════════════════════════════════════════════════════════════════
export function LockVariantsComparison({ caption }: { caption?: string }) {
  const W = 820;
  const H = 280;
  const padX = 30;
  const rowH = 70;
  const gap = 14;
  const labelW = 130;
  const trackX = padX + labelW;
  const trackW = W - trackX - padX - 130; // 우측 outcome 칸
  const outcomeX = trackX + trackW + 16;
  const outcomeW = W - outcomeX - padX;

  const rows: Array<{
    name: string;
    desc: string;
    enterRatio: number; // 진입 비율 (0~1)
    timeout?: number; // timeout 위치
    outcome: string;
    outcomeTone: BoxTone;
  }> = [
    { name: 'lock', desc: '문 열릴 때까지 계속 기다림', enterRatio: 0.75, outcome: '결국 진입', outcomeTone: 'solution' },
    { name: 'trylock', desc: '잠겨 있으면 즉시 포기', enterRatio: 0.05, outcome: '즉시 EBUSY', outcomeTone: 'limitation' },
    { name: 'timedlock', desc: '지정 시간까지만 대기', enterRatio: 1.05, timeout: 0.6, outcome: 'timeout 시 실패', outcomeTone: 'problem' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lock variants comparison">
        <ArrowDefs />

        {rows.map((r, i) => {
          const y = 20 + i * (rowH + gap);
          const arrivedX = trackX + 8;
          const enterX = trackX + r.enterRatio * trackW;
          const timeoutX = r.timeout != null ? trackX + r.timeout * trackW : null;
          const acquired = r.enterRatio <= 1;
          return (
            <g key={r.name}>
              {/* label */}
              <BoxBg x={padX} y={y} w={labelW - 10} h={rowH} tone="plain" />
              <text x={padX + 12} y={y + 26} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                {r.name}
              </text>
              <text x={padX + 12} y={y + 46} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                {r.desc}
              </text>

              {/* track */}
              <rect x={trackX} y={y + rowH / 2 - 8} width={trackW} height={16} fill={vars.color.surfaceAlt} stroke={vars.color.border} strokeWidth={1} rx={3} />
              {/* arrival marker */}
              <circle cx={arrivedX} cy={y + rowH / 2} r={5} fill={vars.color.accent} />
              <text x={arrivedX} y={y + rowH / 2 - 12} textAnchor="middle" fontSize={10} fontFamily={vars.font.sans} fill={vars.color.accent}>
                도착
              </text>
              {/* waiting bar */}
              <rect
                x={arrivedX}
                y={y + rowH / 2 - 6}
                width={Math.max(0, Math.min(timeoutX ?? enterX, enterX) - arrivedX)}
                height={12}
                fill={vars.color.limitationSoft}
                stroke={vars.color.limitation}
                strokeWidth={1}
              />
              {/* enter or timeout */}
              {acquired && (
                <>
                  <line x1={enterX} y1={y + rowH / 2 - 12} x2={enterX} y2={y + rowH / 2 + 12} stroke={vars.color.solution} strokeWidth={2} />
                  <text x={enterX + 4} y={y + rowH / 2 - 14} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.solution}>
                    진입
                  </text>
                </>
              )}
              {timeoutX != null && (
                <>
                  <line x1={timeoutX} y1={y + rowH / 2 - 12} x2={timeoutX} y2={y + rowH / 2 + 12} stroke={vars.color.problem} strokeWidth={2} strokeDasharray="3 3" />
                  <text x={timeoutX + 4} y={y + rowH / 2 - 14} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.problem}>
                    timeout
                  </text>
                </>
              )}

              {/* outcome */}
              <BoxBg x={outcomeX} y={y + 10} w={outcomeW} h={rowH - 20} tone={r.outcomeTone} />
              <text
                x={outcomeX + outcomeW / 2}
                y={y + rowH / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(r.outcomeTone)}
              >
                {r.outcome}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Condition variable 프로토콜 — 정석 시퀀스
// ════════════════════════════════════════════════════════════════════════════
export function CondVarProtocol({ caption }: { caption?: string }) {
  const W = 820;
  const H = 660;
  const laneW = 320;
  const gap = 80;
  const leftX = (W - (laneW * 2 + gap)) / 2;
  const rightX = leftX + laneW + gap;
  const laneTop = 50;
  const boxH = 32;

  // A (left) events
  const A: Array<{ y: number; text: string; tone: BoxTone; sub?: string }> = [
    { y: 80, text: 'pthread_mutex_lock(&lock)', tone: 'accent' },
    { y: 130, text: 'while (initialized == 0)', tone: 'accent', sub: '조건 검사' },
    {
      y: 180,
      text: 'pthread_cond_wait(&init, &lock)',
      tone: 'limitation',
      sub: '① mutex 풀고  ② 잠든다 (atomically)',
    },
    { y: 260, text: '⋯ blocked / sleeping ⋯', tone: 'muted' },
    { y: 440, text: 'wake-up → mutex 재획득', tone: 'solution', sub: 'cond_wait 내부에서 자동 reacquire' },
    { y: 495, text: 'while 재검사 — 이제 == 1, 빠져나감', tone: 'solution' },
    { y: 545, text: 'pthread_mutex_unlock(&lock)', tone: 'accent' },
  ];

  // B (right) events
  const B: Array<{ y: number; text: string; tone: BoxTone; sub?: string }> = [
    { y: 280, text: 'pthread_mutex_lock(&lock)', tone: 'accent' },
    { y: 330, text: 'initialized = 1', tone: 'solution', sub: '상태 변수 갱신' },
    { y: 380, text: 'pthread_cond_signal(&init)', tone: 'problem', sub: 'A 깨우기 신호' },
    { y: 430, text: 'pthread_mutex_unlock(&lock)', tone: 'accent' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Condition variable wait/signal protocol">
        <ArrowDefs />

        {/* lane backgrounds */}
        <rect x={leftX - 10} y={laneTop} width={laneW + 20} height={H - laneTop - 50} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />
        <rect x={rightX - 10} y={laneTop} width={laneW + 20} height={H - laneTop - 50} fill={vars.color.surface} stroke={vars.color.border} strokeWidth={1} rx={6} />

        {/* lane labels */}
        <text x={leftX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread A — 기다리는 쪽
        </text>
        <text x={rightX + laneW / 2} y={laneTop - 12} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Thread B — 깨우는 쪽
        </text>

        {/* time arrow */}
        <text x={20} y={H / 2} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted} transform={`rotate(-90 20 ${H / 2})`}>
          시간 ↓
        </text>

        {/* A boxes */}
        {A.map((e, i) => (
          <g key={`A-${i}`}>
            <BoxBg x={leftX} y={e.y} w={laneW} h={e.sub ? boxH + 18 : boxH} tone={e.tone} />
            <text x={leftX + 14} y={e.y + 20} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(e.tone)}>
              {e.text}
            </text>
            {e.sub && (
              <text x={leftX + 14} y={e.y + 40} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {e.sub}
              </text>
            )}
          </g>
        ))}

        {/* B boxes */}
        {B.map((e, i) => (
          <g key={`B-${i}`}>
            <BoxBg x={rightX} y={e.y} w={laneW} h={e.sub ? boxH + 18 : boxH} tone={e.tone} />
            <text x={rightX + 14} y={e.y + 20} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(e.tone)}>
              {e.text}
            </text>
            {e.sub && (
              <text x={rightX + 14} y={e.y + 40} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {e.sub}
              </text>
            )}
          </g>
        ))}

        {/* signal arrow B → A */}
        <line
          x1={rightX}
          y1={B[2].y + 16}
          x2={leftX + laneW + 6}
          y2={A[3].y + 16}
          stroke={vars.color.problem}
          strokeWidth={1.8}
          markerEnd="url(#arrow-problem)"
          strokeDasharray="5 4"
        />
        <text
          x={(rightX + leftX + laneW) / 2}
          y={(B[2].y + A[3].y) / 2 - 4}
          textAnchor="middle"
          fontSize={11.5}
          fontFamily={vars.font.sans}
          fontStyle="italic"
          fontWeight={700}
          fill={vars.color.problem}
        >
          signal
        </text>

        {/* unlock visual marker — A's cond_wait gives up mutex */}
        <text
          x={leftX + laneW + 6}
          y={A[2].y + 16}
          fontSize={10.5}
          fontFamily={vars.font.sans}
          fontStyle="italic"
          fill={vars.color.limitation}
        >
          → mutex 풀림 (B 가 잡을 수 있음)
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
function Tag({ x, y, text, tone, bold, size = 12 }: { x: number; y: number; text: string; tone: BoxTone; bold?: boolean; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={vars.font.sans} fontWeight={bold ? 700 : 500} fill={toneTextColor(tone)}>
      {text}
    </text>
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
function Event({ x, y, text, tone = 'muted', mark }: { x: number; y: number; text: string; tone?: BoxTone; mark?: boolean }) {
  return (
    <g>
      {mark && <circle cx={x} cy={y} r={6} fill={toneStroke(tone)} />}
      <text x={x} y={y - 14} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontWeight={mark ? 700 : 400} fill={toneTextColor(tone)}>
        {text}
      </text>
    </g>
  );
}
function Pointer({ x, y, label, tone }: { x: number; y: number; label: string; tone: BoxTone }) {
  return (
    <g>
      <line x1={x - 6} y1={y} x2={x + 30} y2={y} stroke={toneStroke(tone)} strokeWidth={1.6} />
      <polygon points={`${x - 6},${y - 4} ${x - 6},${y + 4} ${x - 12},${y}`} fill={toneStroke(tone)} />
      <text x={x + 36} y={y + 4} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
        {label}
      </text>
    </g>
  );
}
