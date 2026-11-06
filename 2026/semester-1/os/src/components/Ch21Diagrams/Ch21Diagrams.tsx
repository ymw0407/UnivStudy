import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch21Diagrams.css';

/**
 * 21장(Lock-based Concurrent Data Structures) SVG 다이어그램 모음.
 * 톤 규칙은 다른 장과 동일.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. Single-lock counter contention — 한 lock 에 모두 몰려드는 그림
// ════════════════════════════════════════════════════════════════════════════
export function CounterContention({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;

  const cx = W / 2;
  const cy = H / 2 + 8;
  const coreW = 200;
  const coreH = 110;

  const threads = [
    { angle: -160, label: 'T1', tone: 'solution' as BoxTone, status: 'lock 보유 중' },
    { angle: -100, label: 'T2', tone: 'problem' as BoxTone, status: '대기 (blocked/spin)' },
    { angle: -20, label: 'T3', tone: 'problem' as BoxTone, status: '대기' },
    { angle: 40, label: 'T4', tone: 'problem' as BoxTone, status: '대기' },
    { angle: 100, label: 'T5', tone: 'problem' as BoxTone, status: '대기' },
    { angle: 160, label: 'T6', tone: 'problem' as BoxTone, status: '대기' },
  ];

  const R = 240;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Single-lock counter contention">
        <ArrowDefs />

        {/* central counter+lock */}
        <BoxBg x={cx - coreW / 2} y={cy - coreH / 2} w={coreW} h={coreH} tone="accent" />
        <text x={cx} y={cy - 26} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          shared counter
        </text>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={20} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
          value = 42
        </text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fill={vars.color.problem}>
          🔒 lock (held by T1)
        </text>

        {/* surrounding threads */}
        {threads.map((t, i) => {
          const rad = (t.angle * Math.PI) / 180;
          const tx = cx + (R / 1.6) * Math.cos(rad);
          const ty = cy + (R / 2.6) * Math.sin(rad);
          const boxW = 110;
          const boxH = 44;
          return (
            <g key={i}>
              {/* arrow toward center */}
              <line
                x1={tx + (Math.cos(rad) < 0 ? boxW / 2 : -boxW / 2)}
                y1={ty}
                x2={cx + (Math.cos(rad) < 0 ? -coreW / 2 - 4 : coreW / 2 + 4)}
                y2={cy + (ty - cy) * 0.35}
                stroke={t.tone === 'solution' ? vars.color.solution : vars.color.problem}
                strokeWidth={1.4}
                strokeDasharray={t.tone === 'solution' ? undefined : '4 4'}
                markerEnd={t.tone === 'solution' ? 'url(#arrow-solution)' : 'url(#arrow-problem)'}
              />
              <BoxBg x={tx - boxW / 2} y={ty - boxH / 2} w={boxW} h={boxH} tone={t.tone} />
              <text x={tx} y={ty - 4} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(t.tone)}>
                {t.label}
              </text>
              <text x={tx} y={ty + 12} textAnchor="middle" fontSize={10} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {t.status}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Perfect Scaling vs 실제 — throughput 그래프
// ════════════════════════════════════════════════════════════════════════════
export function PerfectVsActualScaling({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const padL = 64;
  const padR = 30;
  const padT = 30;
  const padB = 56;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xMax = 16;
  const yMax = 16;
  const sx = (x: number) => padL + (x / xMax) * plotW;
  const sy = (y: number) => padT + plotH - (y / yMax) * plotH;

  const perfect: Array<[number, number]> = [
    [1, 1], [2, 2], [4, 4], [8, 8], [12, 12], [16, 16],
  ];
  const actual: Array<[number, number]> = [
    [1, 1], [2, 1.7], [4, 1.9], [8, 1.6], [12, 1.3], [16, 1.1],
  ];

  const xTicks = [1, 2, 4, 8, 12, 16];
  const yTicks = [0, 4, 8, 12, 16];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Perfect scaling vs single-lock counter throughput">
        {/* gridlines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={padL + plotW} y1={sy(t)} y2={sy(t)} stroke={vars.color.border} strokeWidth={1} />
            <text x={padL - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
              {t}
            </text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text key={i} x={sx(t)} y={padT + plotH + 20} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
            {t}
          </text>
        ))}
        {/* axes */}
        <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={vars.color.borderStrong} strokeWidth={1.4} />
        <line x1={padL} x2={padL + plotW} y1={padT + plotH} y2={padT + plotH} stroke={vars.color.borderStrong} strokeWidth={1.4} />
        <text x={padL + plotW / 2} y={H - 8} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          thread 수
        </text>
        <text x={16} y={padT + plotH / 2} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text} transform={`rotate(-90 16 ${padT + plotH / 2})`}>
          throughput (상대값)
        </text>

        {/* perfect scaling */}
        <polyline points={perfect.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} fill="none" stroke={vars.color.solution} strokeWidth={2.4} strokeDasharray="6 4" />
        {perfect.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={2.8} fill={vars.color.solution} />
        ))}

        {/* actual */}
        <polyline points={actual.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')} fill="none" stroke={vars.color.problem} strokeWidth={2.4} />
        {actual.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={2.8} fill={vars.color.problem} />
        ))}

        {/* legend */}
        <g>
          <line x1={padL + plotW - 230} y1={padT + 10} x2={padL + plotW - 210} y2={padT + 10} stroke={vars.color.solution} strokeWidth={2.4} strokeDasharray="6 4" />
          <text x={padL + plotW - 204} y={padT + 14} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
            Perfect scaling (이상)
          </text>
          <line x1={padL + plotW - 230} y1={padT + 30} x2={padL + plotW - 210} y2={padT + 30} stroke={vars.color.problem} strokeWidth={2.4} />
          <text x={padL + plotW - 204} y={padT + 34} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
            Single-lock counter (실제)
          </text>
        </g>

        {/* annotation */}
        <text x={sx(8)} y={sy(1.6) - 12} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fontWeight={700} fill={vars.color.problem}>
          lock contention → 오히려 느려짐
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Approximate Counter 구조
// ════════════════════════════════════════════════════════════════════════════
export function ApproximateCounterArch({ caption }: { caption?: string }) {
  const W = 820;
  const H = 400;

  const topCx = W / 2;
  const topY = 30;
  const topW = 280;
  const topH = 80;

  const cpuY = 220;
  const cpuW = 170;
  const cpuH = 130;
  const cpuCount = 4;
  const cpuGap = 16;
  const cpuStartX = (W - (cpuW * cpuCount + cpuGap * (cpuCount - 1))) / 2;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Approximate counter architecture">
        <ArrowDefs />

        {/* global */}
        <BoxBg x={topCx - topW / 2} y={topY} w={topW} h={topH} tone="accent" />
        <text x={topCx} y={topY + 26} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          global counter
        </text>
        <text x={topCx} y={topY + 52} textAnchor="middle" fontSize={18} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
          global = 0
        </text>
        <text x={topCx} y={topY + 70} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.problem}>
          🔒 glock
        </text>

        {/* CPUs */}
        {Array.from({ length: cpuCount }).map((_, i) => {
          const x = cpuStartX + i * (cpuW + cpuGap);
          return (
            <g key={i}>
              <BoxBg x={x} y={cpuY} w={cpuW} h={cpuH} tone="problem" />
              <text x={x + cpuW / 2} y={cpuY + 22} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('problem')}>
                CPU {i}
              </text>
              <text x={x + cpuW / 2} y={cpuY + 50} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
                local[{i}] = 0
              </text>
              <text x={x + cpuW / 2} y={cpuY + 70} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.mono} fill={vars.color.problem}>
                🔒 llock[{i}]
              </text>
              <text x={x + cpuW / 2} y={cpuY + 96} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                이 CPU 의 thread 들이
              </text>
              <text x={x + cpuW / 2} y={cpuY + 112} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                여기로만 ++
              </text>

              {/* flush arrow */}
              <Arrow x1={x + cpuW / 2} y1={cpuY - 2} x2={x + cpuW / 2} y2={topY + topH + 2} label={i === 0 ? 'local≥S 면 flush' : ''} />
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Approximate Counter 예제 — S=5 타임라인
// ════════════════════════════════════════════════════════════════════════════
export function ApproximateCounterExample({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const padL = 50;
  const padR = 30;
  const padT = 40;
  const trackH = 70;
  const trackGap = 14;
  const lanes = ['CPU 0 local', 'CPU 1 local', 'global'];

  const steps = 12;
  const stepW = (W - padL - padR) / steps;

  // Events per lane per step (value displayed)
  // S = 5
  const cpu0 = [1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0];
  const cpu1 = [0, 1, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4];
  const global = [0, 0, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15];
  // flush markers
  const flushCpu0 = [4, 10]; // step indices where cpu0 flushes
  const flushCpu1 = [6, 11];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Approximate counter example timeline with threshold S=5">
        <ArrowDefs />

        {/* x-axis labels */}
        <text x={W - padR} y={padT - 14} textAnchor="end" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          시간 → (threshold S = 5)
        </text>

        {lanes.map((name, li) => {
          const y = padT + li * (trackH + trackGap);
          const isGlobal = li === 2;
          const data = li === 0 ? cpu0 : li === 1 ? cpu1 : global;
          const flushIdx = li === 0 ? flushCpu0 : li === 1 ? flushCpu1 : [];

          return (
            <g key={li}>
              <text x={padL - 8} y={y + trackH / 2 + 4} textAnchor="end" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={isGlobal ? vars.color.accent : vars.color.problem}>
                {name}
              </text>
              <rect x={padL} y={y} width={W - padL - padR} height={trackH} fill={isGlobal ? toneBg('accent') : toneBg('plain')} stroke={vars.color.border} strokeWidth={1} rx={4} opacity={0.5} />

              {data.map((v, si) => {
                const x = padL + si * stepW;
                const cx = x + stepW / 2;
                const isFlushHere = flushIdx.includes(si);
                return (
                  <g key={si}>
                    <text x={cx} y={y + trackH / 2 + 5} textAnchor="middle" fontSize={14} fontFamily={vars.font.mono} fontWeight={isFlushHere ? 700 : 500} fill={isFlushHere ? vars.color.problem : isGlobal ? vars.color.accent : vars.color.text}>
                      {v}
                    </text>
                    {isFlushHere && (
                      <text x={cx} y={y + trackH / 2 + 22} textAnchor="middle" fontSize={9.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
                        flush!
                      </text>
                    )}
                  </g>
                );
              })}

              {/* flush arrows: from cpu lane to global */}
              {!isGlobal &&
                flushIdx.map((si) => {
                  const x = padL + si * stepW + stepW / 2;
                  const y2 = padT + 2 * (trackH + trackGap) + 4;
                  return (
                    <line
                      key={si}
                      x1={x}
                      y1={y + trackH + 2}
                      x2={x}
                      y2={y2}
                      stroke={vars.color.problem}
                      strokeWidth={1.3}
                      markerEnd="url(#arrow-problem)"
                      strokeDasharray="3 3"
                    />
                  );
                })}
            </g>
          );
        })}

        {/* note */}
        <text x={padL} y={H - 8} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          local 이 S(=5) 에 도달하면 → global 에 합산하고 local 은 0 으로 리셋. 그 사이에는 글로벌 락 없음.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Threshold S 의 trade-off
// ════════════════════════════════════════════════════════════════════════════
export function ThresholdTradeoff({ caption }: { caption?: string }) {
  const W = 820;
  const H = 280;
  const padX = 50;
  const trackY = 130;
  const trackH = 40;
  const trackW = W - padX * 2;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Threshold S trade-off">
        <ArrowDefs />

        {/* labels above */}
        <text x={padX} y={trackY - 70} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          S 작음
        </text>
        <text x={padX} y={trackY - 50} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 정확도 ↑ (global 이 actual 과 거의 일치)
        </text>
        <text x={padX} y={trackY - 30} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.problem}>
          • 성능 ↓ (글로벌 락 자주 잡음)
        </text>

        <text x={W - padX} y={trackY - 70} textAnchor="end" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          S 큼
        </text>
        <text x={W - padX} y={trackY - 50} textAnchor="end" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.problem}>
          • 정확도 ↓ (global 반영 늦음)
        </text>
        <text x={W - padX} y={trackY - 30} textAnchor="end" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.solution}>
          • 성능 ↑ (글로벌 락 덜 잡음)
        </text>

        {/* gradient bar */}
        <defs>
          <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={vars.color.solutionSoft} />
            <stop offset="100%" stopColor={vars.color.accentSoft} />
          </linearGradient>
        </defs>
        <rect x={padX} y={trackY} width={trackW} height={trackH} fill="url(#s-grad)" stroke={vars.color.borderStrong} strokeWidth={1.4} rx={4} />
        <text x={W / 2} y={trackY + 25} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.text}>
          threshold S
        </text>

        {/* ends arrows */}
        <text x={padX + 6} y={trackY + 25} fontSize={16} fill={vars.color.solution}>
          ◀
        </text>
        <text x={W - padX - 16} y={trackY + 25} fontSize={16} fill={vars.color.accent}>
          ▶
        </text>

        {/* bottom takeaway */}
        <text x={W / 2} y={trackY + trackH + 30} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.text}>
          accurate-and-slow ⇄ approximate-but-fast — 워크로드 요구에 맞춰 S 를 고른다.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Linked list 전체 1 lock — bottleneck
// ════════════════════════════════════════════════════════════════════════════
export function ListSingleLockBottleneck({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;

  // 좌측: linked list (단일 lock 안)
  const listX = 40;
  const listY = 70;
  const listW = 500;
  const listH = 120;

  const nodeW = 80;
  const nodeH = 50;
  const nodes = ['A', 'B', 'C', 'D'];
  const nodeStartX = listX + 30;
  const nodeY = listY + 36;
  const nodeGap = (listW - 60 - nodeW * nodes.length) / (nodes.length - 1);

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Linked list single lock bottleneck">
        <ArrowDefs />

        {/* outer lock container */}
        <rect x={listX} y={listY} width={listW} height={listH} fill={vars.color.problemSoft} stroke={vars.color.problem} strokeWidth={1.6} rx={6} strokeDasharray="6 3" />
        <text x={listX + 16} y={listY + 22} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          🔒 list_t lock (한 개)
        </text>

        {/* nodes */}
        {nodes.map((n, i) => {
          const x = nodeStartX + i * (nodeW + nodeGap);
          return (
            <g key={i}>
              <rect x={x} y={nodeY} width={nodeW} height={nodeH} rx={6} fill={vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.4} />
              <text x={x + nodeW / 2} y={nodeY + 30} textAnchor="middle" fontSize={16} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                {n}
              </text>
              {i < nodes.length - 1 && (
                <Arrow x1={x + nodeW + 1} y1={nodeY + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={nodeY + nodeH / 2} />
              )}
            </g>
          );
        })}

        {/* 우측: 대기 thread들 */}
        <text x={listX + listW + 30} y={listY + 4} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          대기열
        </text>
        {[
          { y: listY + 16, label: 'T1 (lookup A)', tone: 'solution' as BoxTone, status: 'lock 보유' },
          { y: listY + 56, label: 'T2 (insert)', tone: 'problem' as BoxTone, status: '대기' },
          { y: listY + 92, label: 'T3 (lookup D)', tone: 'problem' as BoxTone, status: '대기' },
        ].map((t, i) => (
          <g key={i}>
            <BoxBg x={listX + listW + 30} y={t.y} w={220} h={32} tone={t.tone} />
            <text x={listX + listW + 42} y={t.y + 14} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(t.tone)}>
              {t.label}
            </text>
            <text x={listX + listW + 42} y={t.y + 28} fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
              {t.status}
            </text>
          </g>
        ))}

        {/* bottom note */}
        <text x={W / 2} y={H - 24} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          T1 이 lookup 으로 list 끝까지 훑는 동안 T2/T3 는 무관한 node 를 만지고 싶어도 <tspan fontWeight={700} fill={vars.color.problem}>전부 대기</tspan>.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Hand-over-hand locking — 사다리 타기
// ════════════════════════════════════════════════════════════════════════════
export function HandOverHandLocking({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;

  const nodes = ['A', 'B', 'C', 'D'];
  const nodeW = 90;
  const nodeH = 60;
  const nodeGap = 50;
  const startX = (W - (nodeW * nodes.length + nodeGap * (nodes.length - 1))) / 2;

  // Frame 1: step 1
  const frame1Y = 50;
  // Frame 2: step 2
  const frame2Y = 200;

  const FrameLabel = ({ y, text }: { y: number; text: string }) => (
    <text x={20} y={y} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
      {text}
    </text>
  );

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Hand-over-hand locking">
        <ArrowDefs />

        {/* Frame 1: thread at B, holding B's lock, releases A */}
        <FrameLabel y={frame1Y - 18} text="Step 1 — thread T 가 B 에 있다" />
        {nodes.map((n, i) => {
          const x = startX + i * (nodeW + nodeGap);
          const hasLock = i === 1; // B
          const justReleased = i === 0; // A just released
          return (
            <g key={i}>
              <rect
                x={x}
                y={frame1Y}
                width={nodeW}
                height={nodeH}
                rx={6}
                fill={hasLock ? toneBg('solution') : justReleased ? toneBg('muted') : vars.color.surface}
                stroke={hasLock ? toneStroke('solution') : vars.color.borderStrong}
                strokeWidth={1.4}
              />
              <text x={x + nodeW / 2} y={frame1Y + 24} textAnchor="middle" fontSize={16} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                {n}
              </text>
              <text x={x + nodeW / 2} y={frame1Y + 46} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.mono} fill={hasLock ? vars.color.solution : justReleased ? vars.color.textFaint : vars.color.textMuted}>
                {hasLock ? '🔒 locked' : justReleased ? '✓ 방금 해제' : 'unlocked'}
              </text>
              {i < nodes.length - 1 && (
                <Arrow x1={x + nodeW + 1} y1={frame1Y + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={frame1Y + nodeH / 2} />
              )}
            </g>
          );
        })}
        {/* T marker on B */}
        <text x={startX + 1 * (nodeW + nodeGap) + nodeW / 2} y={frame1Y - 4} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          ↓ T
        </text>

        {/* Frame 2: thread now at C: grabbed C, released B */}
        <FrameLabel y={frame2Y - 18} text="Step 2 — C 의 lock 을 먼저 잡고, 그 다음 B 의 lock 을 푼다" />
        {nodes.map((n, i) => {
          const x = startX + i * (nodeW + nodeGap);
          const hasLock = i === 2; // C
          const justReleased = i === 1; // B just released
          return (
            <g key={i}>
              <rect
                x={x}
                y={frame2Y}
                width={nodeW}
                height={nodeH}
                rx={6}
                fill={hasLock ? toneBg('solution') : justReleased ? toneBg('muted') : vars.color.surface}
                stroke={hasLock ? toneStroke('solution') : vars.color.borderStrong}
                strokeWidth={1.4}
              />
              <text x={x + nodeW / 2} y={frame2Y + 24} textAnchor="middle" fontSize={16} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                {n}
              </text>
              <text x={x + nodeW / 2} y={frame2Y + 46} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.mono} fill={hasLock ? vars.color.solution : justReleased ? vars.color.textFaint : vars.color.textMuted}>
                {hasLock ? '🔒 locked' : justReleased ? '✓ 방금 해제' : 'unlocked'}
              </text>
              {i < nodes.length - 1 && (
                <Arrow x1={x + nodeW + 1} y1={frame2Y + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={frame2Y + nodeH / 2} />
              )}
            </g>
          );
        })}
        <text x={startX + 2 * (nodeW + nodeGap) + nodeW / 2} y={frame2Y - 4} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          ↓ T
        </text>

        {/* note */}
        <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          항상 "다음 노드 lock 획득 → 현재 노드 lock 해제" 순서. 두 lock 을 잠깐 겹쳐 들고 이동.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Michael-Scott Queue — head/tail lock 분리 + dummy
// ════════════════════════════════════════════════════════════════════════════
export function MichaelScottQueueLayout({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;

  const nodes = [
    { label: 'dummy', value: '-', tone: 'muted' as BoxTone },
    { label: 'n1', value: '10', tone: 'plain' as BoxTone },
    { label: 'n2', value: '20', tone: 'plain' as BoxTone },
    { label: 'n3', value: '30', tone: 'plain' as BoxTone },
  ];
  const nodeW = 110;
  const nodeH = 70;
  const nodeGap = 40;
  const startX = (W - (nodeW * nodes.length + nodeGap * (nodes.length - 1))) / 2;
  const nodeY = 130;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Michael-Scott queue with head/tail lock separation">
        <ArrowDefs />

        {/* nodes */}
        {nodes.map((n, i) => {
          const x = startX + i * (nodeW + nodeGap);
          return (
            <g key={i}>
              <rect x={x} y={nodeY} width={nodeW} height={nodeH} rx={6} fill={toneBg(n.tone)} stroke={toneStroke(n.tone)} strokeWidth={1.4} />
              <text x={x + nodeW / 2} y={nodeY + 26} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(n.tone)}>
                {n.label}
              </text>
              <text x={x + nodeW / 2} y={nodeY + 50} textAnchor="middle" fontSize={14} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                value={n.value}
              </text>
              {i < nodes.length - 1 && (
                <Arrow x1={x + nodeW + 1} y1={nodeY + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={nodeY + nodeH / 2} />
              )}
            </g>
          );
        })}

        {/* head pointer */}
        <text x={startX + nodeW / 2} y={nodeY - 18} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.accent}>
          head ↓
        </text>
        <text x={startX + (nodes.length - 1) * (nodeW + nodeGap) + nodeW / 2} y={nodeY - 18} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          tail ↓
        </text>

        {/* headLock region */}
        <rect x={startX - 12} y={nodeY - 38} width={nodeW + 24} height={nodeH + 52} fill="none" stroke={vars.color.accent} strokeWidth={1.5} strokeDasharray="5 4" rx={8} />
        <text x={startX + nodeW / 2} y={nodeY + nodeH + 26} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.accent}>
          🔒 headLock — dequeue 보호
        </text>

        {/* tailLock region */}
        <rect x={startX + (nodes.length - 1) * (nodeW + nodeGap) - 12} y={nodeY - 38} width={nodeW + 24} height={nodeH + 52} fill="none" stroke={vars.color.problem} strokeWidth={1.5} strokeDasharray="5 4" rx={8} />
        <text x={startX + (nodes.length - 1) * (nodeW + nodeGap) + nodeW / 2} y={nodeY + nodeH + 26} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          🔒 tailLock — enqueue 보호
        </text>

        {/* concurrent ops */}
        <text x={startX + nodeW / 2} y={H - 20} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          dequeue 진행 ↑ (T1)
        </text>
        <text x={startX + (nodes.length - 1) * (nodeW + nodeGap) + nodeW / 2} y={H - 20} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          enqueue 진행 ↑ (T2)
        </text>
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          서로 다른 lock 을 잡으니 <tspan fontWeight={700} fill={vars.color.solution}>동시 진행 가능</tspan>. dummy node 가 head/tail 충돌을 방지.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Dequeue 시 dummy node 이동
// ════════════════════════════════════════════════════════════════════════════
export function QueueDequeueDummyShift({ caption }: { caption?: string }) {
  const W = 820;
  const H = 440;

  const nodeW = 130;
  const nodeH = 76;
  const nodeGap = 36;
  const cols = 3;
  const totalW = nodeW * cols + nodeGap * (cols - 1);
  const startX = (W - totalW) / 2;

  const beforeY = 50;
  const afterY = 270;

  const Lbl = ({ x, y, text, tone = 'plain' as BoxTone }: { x: number; y: number; text: string; tone?: BoxTone }) => (
    <text x={x} y={y} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(tone)}>
      {text}
    </text>
  );

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Queue dequeue dummy node shift">
        <ArrowDefs />

        {/* BEFORE */}
        <Lbl x={20} y={beforeY - 12} text="Before dequeue" tone="accent" />
        {['dummy', 'n1 (val=10)', 'n2 (val=20)'].map((label, i) => {
          const x = startX + i * (nodeW + nodeGap);
          const tone: BoxTone = i === 0 ? 'muted' : 'plain';
          return (
            <g key={i}>
              <rect x={x} y={beforeY} width={nodeW} height={nodeH} rx={6} fill={toneBg(tone)} stroke={toneStroke(tone)} strokeWidth={1.4} />
              <text x={x + nodeW / 2} y={beforeY + 28} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
                {label.split(' ')[0]}
              </text>
              {label.includes('=') && (
                <text x={x + nodeW / 2} y={beforeY + 52} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fill={vars.color.heading}>
                  {label.split(' ')[1]}
                </text>
              )}
              {i < 2 && (
                <Arrow x1={x + nodeW + 1} y1={beforeY + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={beforeY + nodeH / 2} />
              )}
            </g>
          );
        })}
        <text x={startX + nodeW / 2} y={beforeY - 20} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.accent}>
          head ↓
        </text>

        {/* transition arrow */}
        <line x1={W / 2} y1={beforeY + nodeH + 10} x2={W / 2} y2={afterY - 10} stroke={vars.color.problem} strokeWidth={2} markerEnd="url(#arrow-problem)" />
        <text x={W / 2 + 16} y={(beforeY + nodeH + afterY) / 2 + 4} fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fontWeight={700} fill={vars.color.problem}>
          Dequeue: value 10 반환 + dummy 한 칸 이동 + 옛 dummy free
        </text>

        {/* AFTER */}
        <Lbl x={20} y={afterY - 12} text="After dequeue" tone="solution" />
        {[
          { label: '~~dummy~~', tone: 'muted' as BoxTone, faded: true, sub: 'free()' },
          { label: 'n1 (이제 dummy)', tone: 'solution' as BoxTone, sub: 'value 무시' },
          { label: 'n2 (val=20)', tone: 'plain' as BoxTone },
        ].map((item, i) => {
          const x = startX + i * (nodeW + nodeGap);
          return (
            <g key={i}>
              <rect
                x={x}
                y={afterY}
                width={nodeW}
                height={nodeH}
                rx={6}
                fill={item.faded ? vars.color.surfaceAlt : toneBg(item.tone)}
                stroke={item.faded ? vars.color.border : toneStroke(item.tone)}
                strokeWidth={1.4}
                strokeDasharray={item.faded ? '5 4' : undefined}
                opacity={item.faded ? 0.55 : 1}
              />
              <text x={x + nodeW / 2} y={afterY + 28} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={item.faded ? vars.color.textFaint : toneTextColor(item.tone)} textDecoration={item.faded ? 'line-through' : 'none'}>
                {item.label.replace(/~~/g, '')}
              </text>
              {item.sub && (
                <text x={x + nodeW / 2} y={afterY + 52} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={item.faded ? vars.color.textFaint : vars.color.textMuted}>
                  {item.sub}
                </text>
              )}
              {i === 1 && !item.faded && (
                <text x={x + nodeW / 2} y={afterY - 20} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.accent}>
                  head ↓ (새 dummy)
                </text>
              )}
              {i === 1 && (
                <Arrow x1={x + nodeW + 1} y1={afterY + nodeH / 2} x2={x + nodeW + nodeGap - 1} y2={afterY + nodeH / 2} />
              )}
            </g>
          );
        })}

        {/* return value */}
        <text x={W - 24} y={afterY + nodeH + 30} textAnchor="end" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          return value = 10
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 10. Concurrent Hash Table — bucket 별 lock
// ════════════════════════════════════════════════════════════════════════════
export function ConcurrentHashTable({ caption }: { caption?: string }) {
  const W = 820;
  const H = 460;
  const bucketCount = 5;
  const bucketW = 130;
  const bucketGap = 16;
  const bucketsW = bucketW * bucketCount + bucketGap * (bucketCount - 1);
  const startX = (W - bucketsW) / 2;
  const bucketY = 120;
  const bucketH = 50;

  // each bucket has its own list (shown below as chain)
  // contents per bucket (small ints)
  const buckets = [
    [13, 28],
    [4],
    [],
    [9, 23, 37],
    [16],
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Concurrent hash table with per-bucket locks">
        <ArrowDefs />

        {/* threads at top */}
        {[
          { x: startX + 0 * (bucketW + bucketGap) + bucketW / 2, label: 'T1: insert 4', toBucket: 1, tone: 'solution' as BoxTone },
          { x: startX + 3 * (bucketW + bucketGap) + bucketW / 2, label: 'T2: lookup 23', toBucket: 3, tone: 'solution' as BoxTone },
          { x: startX + 1 * (bucketW + bucketGap) + bucketW / 2, label: 'T3: insert 4', toBucket: 1, tone: 'problem' as BoxTone },
        ].map((t, i) => (
          <g key={i}>
            <rect x={t.x - 70} y={30} width={140} height={32} rx={6} fill={toneBg(t.tone)} stroke={toneStroke(t.tone)} strokeWidth={1.2} />
            <text x={t.x} y={50} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(t.tone)}>
              {t.label}
            </text>
            <Arrow x1={t.x} y1={62 + 1} x2={startX + t.toBucket * (bucketW + bucketGap) + bucketW / 2} y2={bucketY - 4} />
          </g>
        ))}

        {/* buckets */}
        {buckets.map((items, i) => {
          const x = startX + i * (bucketW + bucketGap);
          return (
            <g key={i}>
              {/* bucket header */}
              <BoxBg x={x} y={bucketY} w={bucketW} h={bucketH} tone="accent" />
              <text x={x + bucketW / 2} y={bucketY + 22} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('accent')}>
                bucket[{i}]
              </text>
              <text x={x + bucketW / 2} y={bucketY + 40} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.problem}>
                🔒 lock[{i}]
              </text>

              {/* chain */}
              {items.length === 0 ? (
                <text x={x + bucketW / 2} y={bucketY + bucketH + 36} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                  (empty)
                </text>
              ) : (
                items.map((v, j) => {
                  const itemY = bucketY + bucketH + 20 + j * 44;
                  return (
                    <g key={j}>
                      <rect x={x + 20} y={itemY} width={bucketW - 40} height={32} rx={4} fill={vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.1} />
                      <text x={x + bucketW / 2} y={itemY + 21} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.heading}>
                        {v}
                      </text>
                      {/* connector to next */}
                      <line x1={x + bucketW / 2} y1={j === 0 ? bucketY + bucketH : itemY - 12} x2={x + bucketW / 2} y2={itemY} stroke={vars.color.border} strokeWidth={1} strokeDasharray="3 3" />
                    </g>
                  );
                })
              )}
            </g>
          );
        })}

        {/* bottom note */}
        <text x={W / 2} y={H - 10} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          T1 (bucket[1]) 과 T2 (bucket[3]) 는 <tspan fontWeight={700} fill={vars.color.solution}>동시에 진행</tspan>. T3 는 같은 bucket[1] 이라 lock[1] 대기.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 11. Hash function 분산 품질 — bad vs good
// ════════════════════════════════════════════════════════════════════════════
export function HashFunctionDistribution({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;
  const colW = (W - 80) / 2;
  const leftX = 40;
  const rightX = leftX + colW + 20;
  const topY = 36;
  const colH = H - 60;

  // bad distribution: lots in bucket 0
  const bad = [9, 1, 0, 1, 0]; // counts per bucket
  // good distribution: even
  const good = [3, 4, 4, 3, 3];

  const bars = 5;
  const barGap = 12;

  const Bars = ({ data, originX, originY, color, height, maxV }: { data: number[]; originX: number; originY: number; color: string; height: number; maxV: number }) => {
    const barW = (colW - 80 - barGap * (bars - 1)) / bars;
    return (
      <g>
        {data.map((v, i) => {
          const bh = (v / maxV) * height;
          const x = originX + 40 + i * (barW + barGap);
          return (
            <g key={i}>
              <rect x={x} y={originY - bh} width={barW} height={bh} fill={color} opacity={0.85} />
              <text x={x + barW / 2} y={originY + 16} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                b{i}
              </text>
              <text x={x + barW / 2} y={originY - bh - 4} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fontWeight={700} fill={color}>
                {v}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Hash function distribution quality">
        {/* LEFT: bad */}
        <BoxBg x={leftX} y={topY} w={colW} h={colH} tone="plain" />
        <text x={leftX + 16} y={topY + 22} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          Bad hash — bucket 0 에 몰림
        </text>
        <Bars data={bad} originX={leftX} originY={topY + colH - 36} color={vars.color.problem} height={colH - 80} maxV={10} />
        <text x={leftX + 16} y={topY + colH - 12} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          → bucket 0 lock 에 대부분 thread 가 몰려 contention.
        </text>

        {/* RIGHT: good */}
        <BoxBg x={rightX} y={topY} w={colW} h={colH} tone="plain" />
        <text x={rightX + 16} y={topY + 22} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Good hash — 골고루 분산
        </text>
        <Bars data={good} originX={rightX} originY={topY + colH - 36} color={vars.color.solution} height={colH - 80} maxV={10} />
        <text x={rightX + 16} y={topY + colH - 12} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          → 서로 다른 bucket 의 lock 을 잡아 동시 진행.
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
