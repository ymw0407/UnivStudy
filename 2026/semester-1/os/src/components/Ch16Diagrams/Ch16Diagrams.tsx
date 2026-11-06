import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch16Diagrams.css';

/**
 * 16장(Swapping Policies / Page Replacement) 전용 SVG 다이어그램 모음.
 *
 * 15장과 같은 규칙을 따른다.
 * - viewBox 기반 → 컨테이너 폭에 맞춰 축소
 * - 색은 theme.css 의 vars.color 토큰만 사용 → 라이트/다크 자동 대응
 * - replacement trace 는 정책(opt/fifo/lru) 을 받아 결과를 직접 계산해서 그린다.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. AMAT 두 가지 공식 비교
// ════════════════════════════════════════════════════════════════════════════
export function AmatComparison({ caption }: { caption?: string }) {
  const W = 760;
  const cardW = 340;
  const cardH = 150;
  const gap = 40;
  const startX = (W - (cardW * 2 + gap)) / 2;
  const y = 20;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 210`} role="img" aria-label="AMAT 두 공식 비교">
        <ArrowDefs />

        {/* 왼쪽: 기댓값 정의 */}
        <BoxBg x={startX} y={y} w={cardW} h={cardH} tone="plain" />
        <Tag x={startX + 16} y={y + 26} text="기댓값(expectation) 관점" tone="plain" bold />
        <Mono x={startX + cardW / 2} y={y + 66} text="AMAT = P_hit · T_M + P_miss · T_D" anchor="middle" size={15} />
        <Txt x={startX + cardW / 2} y={y + 96} text="P_hit + P_miss = 1" anchor="middle" muted />
        <Txt x={startX + cardW / 2} y={y + 122} text="히트는 메모리만, 미스는 디스크까지" anchor="middle" muted size={11.5} />

        {/* 화살표 */}
        <Arrow x1={startX + cardW + 6} y1={y + cardH / 2} x2={startX + cardW + gap - 6} y2={y + cardH / 2} />

        {/* 오른쪽: 교과서 버전 */}
        <BoxBg x={startX + cardW + gap} y={y} w={cardW} h={cardH} tone="accent" />
        <Tag x={startX + cardW + gap + 16} y={y + 26} text="교과서 버전 (실무에서 자주 씀)" tone="accent" bold />
        <Mono x={startX + cardW + gap + cardW / 2} y={y + 66} text="AMAT = T_M + P_miss · T_D" anchor="middle" size={15} accent />
        <Txt x={startX + cardW + gap + cardW / 2} y={y + 96} text="미스 판별에도 메모리는 한 번 본다" anchor="middle" muted size={11.5} />
        <Txt x={startX + cardW + gap + cardW / 2} y={y + 122} text="→ T_M 은 항상 발생 (고정)" anchor="middle" muted size={11.5} />

        <Txt
          x={W / 2}
          y={y + cardH + 36}
          text="미스 여부를 알려면 물리 메모리를 반드시 한 번은 접근해야 하므로, T_M 항이 P_hit 없이 항상 더해진다."
          anchor="middle"
          muted
          size={12}
        />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Replacement Trace (OPT / FIFO / LRU 자동 계산)
// ════════════════════════════════════════════════════════════════════════════
type Policy = 'opt' | 'fifo' | 'lru';

type TraceCol = {
  ref: number;
  slots: (number | null)[];
  hit: boolean;
  loadedSlot: number | null;
  evicted: number | null;
};

function computeTrace(refs: number[], numFrames: number, policy: Policy): TraceCol[] {
  const slots: (number | null)[] = new Array(numFrames).fill(null);
  const fifoQueue: number[] = []; // 적재 순서 (page 값)
  const lastUsed: Record<number, number> = {};
  const cols: TraceCol[] = [];

  refs.forEach((page, i) => {
    const present = slots.indexOf(page);
    let hit = present !== -1;
    let loadedSlot: number | null = null;
    let evicted: number | null = null;

    if (!hit) {
      const empty = slots.indexOf(null);
      if (empty !== -1) {
        slots[empty] = page;
        loadedSlot = empty;
        fifoQueue.push(page);
      } else {
        // victim 선정
        let victim: number;
        if (policy === 'fifo') {
          victim = fifoQueue.shift() as number;
        } else if (policy === 'lru') {
          victim = slots.reduce(
            (a, b) => ((lastUsed[a as number] ?? -1) <= (lastUsed[b as number] ?? -1) ? a : b),
            slots[0],
          ) as number;
        } else {
          // opt: 다음 사용 시점이 가장 먼(또는 없는) page
          victim = chooseOpt(slots as number[], refs, i);
        }
        const vIdx = slots.indexOf(victim);
        slots[vIdx] = page;
        loadedSlot = vIdx;
        evicted = victim;
        if (policy === 'fifo') fifoQueue.push(page);
      }
    }

    lastUsed[page] = i;
    cols.push({ ref: page, slots: [...slots], hit, loadedSlot, evicted });
  });

  return cols;
}

function chooseOpt(resident: number[], refs: number[], from: number): number {
  let victim = resident[0];
  let best = -1;
  for (const p of resident) {
    let next = Infinity;
    for (let j = from + 1; j < refs.length; j++) {
      if (refs[j] === p) {
        next = j;
        break;
      }
    }
    if (next > best) {
      best = next;
      victim = p;
    }
  }
  return victim;
}

export function ReplacementTrace({
  policy,
  refs,
  frames = 3,
  title,
  caption,
}: {
  policy: Policy;
  refs: number[];
  frames?: number;
  title?: string;
  caption?: string;
}) {
  const cols = computeTrace(refs, frames, policy);
  const hits = cols.filter((c) => c.hit).length;
  const rate = ((hits / refs.length) * 100).toFixed(1);

  const W = 780;
  const labelW = 78;
  const cellW = Math.min(58, (W - labelW - 16) / refs.length);
  const cellH = 38;
  const headerH = 34;
  const footerH = 30;
  const startX = labelW + 8;
  const gridW = cellW * refs.length;
  const startY = 44;

  const policyName = policy === 'opt' ? 'OPT (Optimal)' : policy === 'fifo' ? 'FIFO' : 'LRU';
  const totalH = startY + headerH + frames * cellH + footerH + 24;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${totalH}`} role="img" aria-label={`${policyName} replacement trace`}>
        <ArrowDefs />

        {/* 제목 + 히트율 */}
        <Tag x={16} y={24} text={title ?? policyName} tone="accent" bold size={14} />
        <text
          x={W - 16}
          y={24}
          textAnchor="end"
          fontSize={13}
          fontFamily={vars.font.mono}
          fontWeight={700}
          fill={vars.color.solution}
        >
          Hit {hits}/{refs.length} = {rate}%
        </text>

        {/* 헤더: 참조 문자열 */}
        <Txt x={labelW - 8} y={startY + headerH / 2 + 4} text="참조" anchor="end" muted size={11.5} />
        {cols.map((c, i) => (
          <text
            key={`h-${i}`}
            x={startX + i * cellW + cellW / 2}
            y={startY + headerH / 2 + 5}
            textAnchor="middle"
            fontSize={14}
            fontFamily={vars.font.mono}
            fontWeight={700}
            fill={vars.color.heading}
          >
            {c.ref}
          </text>
        ))}
        <line
          x1={startX}
          x2={startX + gridW}
          y1={startY + headerH}
          y2={startY + headerH}
          stroke={vars.color.borderStrong}
          strokeWidth={1.2}
        />

        {/* 프레임 행 */}
        {Array.from({ length: frames }).map((_, r) => {
          const rowY = startY + headerH + r * cellH;
          return (
            <g key={`row-${r}`}>
              <Txt x={labelW - 8} y={rowY + cellH / 2 + 4} text={`frame ${r}`} anchor="end" muted size={11} />
              {cols.map((c, i) => {
                const val = c.slots[r];
                const cellX = startX + i * cellW;
                const isCurrent = val !== null && val === c.ref;
                const isLoaded = c.loadedSlot === r && !c.hit;
                let tone: BoxTone = 'muted';
                if (isLoaded) tone = 'accent';
                else if (isCurrent && c.hit) tone = 'solution';
                else if (val !== null) tone = 'plain';
                return (
                  <g key={`c-${r}-${i}`}>
                    <rect
                      x={cellX + 3}
                      y={rowY + 4}
                      width={cellW - 6}
                      height={cellH - 8}
                      rx={4}
                      fill={val === null ? 'transparent' : toneBg(tone)}
                      stroke={val === null ? vars.color.border : toneStroke(tone)}
                      strokeWidth={isCurrent || isLoaded ? 1.6 : 1}
                      strokeDasharray={val === null ? '3 3' : undefined}
                    />
                    {val !== null && (
                      <text
                        x={cellX + cellW / 2}
                        y={rowY + cellH / 2 + 4}
                        textAnchor="middle"
                        fontSize={13}
                        fontFamily={vars.font.mono}
                        fontWeight={isCurrent || isLoaded ? 700 : 500}
                        fill={toneTextColor(tone)}
                      >
                        {val}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* 풋터: Hit / Miss */}
        {(() => {
          const fy = startY + headerH + frames * cellH;
          return (
            <g>
              <Txt x={labelW - 8} y={fy + footerH / 2 + 4} text="결과" anchor="end" muted size={11.5} />
              {cols.map((c, i) => (
                <text
                  key={`f-${i}`}
                  x={startX + i * cellW + cellW / 2}
                  y={fy + footerH / 2 + 5}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily={vars.font.mono}
                  fontWeight={700}
                  fill={c.hit ? vars.color.solution : vars.color.problem}
                >
                  {c.hit ? 'H' : 'M'}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. 범용 라인 차트
// ════════════════════════════════════════════════════════════════════════════
type Series = { name: string; color: string; points: Array<[number, number]>; dashed?: boolean };

function LineChart({
  series,
  xLabel,
  yLabel,
  xMax,
  yMax,
  xTicks,
  yTicks,
  caption,
  ariaLabel,
  height = 300,
  annotations,
}: {
  series: Series[];
  xLabel: string;
  yLabel: string;
  xMax: number;
  yMax: number;
  xTicks: number[];
  yTicks: number[];
  caption?: string;
  ariaLabel?: string;
  height?: number;
  annotations?: Array<{ x: number; y: number; text: string; color?: string }>;
}) {
  const W = 760;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 48;
  const plotW = W - padL - padR;
  const plotH = height - padT - padB;

  const sx = (x: number) => padL + (x / xMax) * plotW;
  const sy = (y: number) => padT + plotH - (y / yMax) * plotH;

  // legend
  const legendY = padT + 4;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${height}`} role="img" aria-label={ariaLabel ?? 'line chart'}>
        {/* y grid + ticks */}
        {yTicks.map((t, i) => (
          <g key={`y-${i}`}>
            <line x1={padL} x2={padL + plotW} y1={sy(t)} y2={sy(t)} stroke={vars.color.border} strokeWidth={1} />
            <text x={padL - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
              {t}
            </text>
          </g>
        ))}
        {/* x ticks */}
        {xTicks.map((t, i) => (
          <text
            key={`x-${i}`}
            x={sx(t)}
            y={padT + plotH + 18}
            textAnchor="middle"
            fontSize={11}
            fontFamily={vars.font.mono}
            fill={vars.color.textMuted}
          >
            {t}
          </text>
        ))}
        {/* axes */}
        <line x1={padL} x2={padL} y1={padT} y2={padT + plotH} stroke={vars.color.borderStrong} strokeWidth={1.4} />
        <line x1={padL} x2={padL + plotW} y1={padT + plotH} y2={padT + plotH} stroke={vars.color.borderStrong} strokeWidth={1.4} />
        {/* axis labels */}
        <text x={padL + plotW / 2} y={height - 8} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
          {xLabel}
        </text>
        <text
          x={16}
          y={padT + plotH / 2}
          textAnchor="middle"
          fontSize={12}
          fontFamily={vars.font.sans}
          fill={vars.color.text}
          transform={`rotate(-90 16 ${padT + plotH / 2})`}
        >
          {yLabel}
        </text>

        {/* series */}
        {series.map((ser, si) => (
          <g key={si}>
            <polyline
              points={ser.points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
              fill="none"
              stroke={ser.color}
              strokeWidth={2.2}
              strokeDasharray={ser.dashed ? '6 4' : undefined}
              strokeLinejoin="round"
            />
            {ser.points.map(([x, y], pi) => (
              <circle key={pi} cx={sx(x)} cy={sy(y)} r={2.8} fill={ser.color} />
            ))}
          </g>
        ))}

        {/* annotations */}
        {annotations?.map((a, i) => (
          <text
            key={`a-${i}`}
            x={sx(a.x)}
            y={sy(a.y)}
            fontSize={11.5}
            fontFamily={vars.font.sans}
            fontWeight={700}
            fill={a.color ?? vars.color.problem}
          >
            {a.text}
          </text>
        ))}

        {/* legend */}
        {series.map((ser, si) => {
          const lx = padL + plotW - 150;
          const ly = legendY + si * 18;
          return (
            <g key={`lg-${si}`}>
              <line x1={lx} x2={lx + 20} y1={ly} y2={ly} stroke={ser.color} strokeWidth={2.2} strokeDasharray={ser.dashed ? '6 4' : undefined} />
              <text x={lx + 26} y={ly + 4} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
                {ser.name}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Belady's Anomaly
// ════════════════════════════════════════════════════════════════════════════
export function BeladyAnomalyChart({ caption }: { caption?: string }) {
  // 참조열 1,2,3,4,1,2,5,1,2,3,4,5 의 FIFO fault 수 (frame 1~5)
  const fifo: Array<[number, number]> = [
    [1, 12],
    [2, 12],
    [3, 9],
    [4, 10], // ← 늘렸는데 오히려 증가!
    [5, 5],
  ];
  // OPT 는 단조 감소 (참고용)
  const opt: Array<[number, number]> = [
    [1, 12],
    [2, 9],
    [3, 7],
    [4, 6],
    [5, 5],
  ];

  return (
    <LineChart
      caption={caption}
      ariaLabel="Belady's anomaly: FIFO fault count vs frame count"
      xLabel="page frame 개수"
      yLabel="page fault 수"
      xMax={5.4}
      yMax={13}
      xTicks={[1, 2, 3, 4, 5]}
      yTicks={[0, 3, 6, 9, 12]}
      series={[
        { name: 'FIFO', color: vars.color.problem, points: fifo },
        { name: 'OPT (참고)', color: vars.color.solution, points: opt, dashed: true },
      ]}
      annotations={[{ x: 3.55, y: 11.2, text: '3→4: 오히려 증가 (anomaly)', color: vars.color.problem }]}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Workload 별 hit rate 곡선
// ════════════════════════════════════════════════════════════════════════════
export function WorkloadNoLocality({ caption }: { caption?: string }) {
  // 로컬리티 없음: 모든 정책이 거의 동일, cache_size/total 에 비례
  const line = (): Array<[number, number]> => {
    const pts: Array<[number, number]> = [];
    for (let c = 0; c <= 100; c += 10) pts.push([c, c]);
    return pts;
  };
  return (
    <LineChart
      caption={caption}
      ariaLabel="No-locality workload hit rate"
      xLabel="캐시 크기 (페이지 수)"
      yLabel="hit rate (%)"
      xMax={100}
      yMax={100}
      xTicks={[0, 20, 40, 60, 80, 100]}
      yTicks={[0, 20, 40, 60, 80, 100]}
      series={[
        { name: 'OPT', color: vars.color.solution, points: line() },
        { name: 'LRU/FIFO/Rand', color: vars.color.accent, points: line(), dashed: true },
      ]}
      annotations={[{ x: 30, y: 52, text: '거의 동일 — 중요도가 없으니', color: vars.color.textMuted }]}
    />
  );
}

export function Workload8020({ caption }: { caption?: string }) {
  const opt: Array<[number, number]> = [
    [0, 0],
    [20, 78],
    [40, 92],
    [60, 97],
    [80, 99],
    [100, 100],
  ];
  const lru: Array<[number, number]> = [
    [0, 0],
    [20, 62],
    [40, 82],
    [60, 91],
    [80, 97],
    [100, 100],
  ];
  const fifo: Array<[number, number]> = [
    [0, 0],
    [20, 44],
    [40, 64],
    [60, 78],
    [80, 90],
    [100, 100],
  ];
  return (
    <LineChart
      caption={caption}
      ariaLabel="80-20 workload hit rate"
      xLabel="캐시 크기 (페이지 수)"
      yLabel="hit rate (%)"
      xMax={100}
      yMax={100}
      xTicks={[0, 20, 40, 60, 80, 100]}
      yTicks={[0, 20, 40, 60, 80, 100]}
      series={[
        { name: 'OPT', color: vars.color.solution, points: opt },
        { name: 'LRU', color: vars.color.accent, points: lru },
        { name: 'FIFO/Random', color: vars.color.problem, points: fifo, dashed: true },
      ]}
      annotations={[{ x: 22, y: 66, text: 'LRU 가 OPT 에 근접', color: vars.color.accent }]}
    />
  );
}

export function WorkloadLooping({ caption }: { caption?: string }) {
  // 50개 페이지를 0..49 순환. cache < 50 이면 LRU/FIFO 는 0%, =50 에서 갑자기 100%.
  const lru: Array<[number, number]> = [
    [0, 0],
    [10, 0],
    [20, 0],
    [30, 0],
    [40, 0],
    [49, 0],
    [50, 100],
    [60, 100],
  ];
  const random: Array<[number, number]> = [
    [0, 0],
    [10, 20],
    [20, 40],
    [30, 60],
    [40, 80],
    [50, 100],
    [60, 100],
  ];
  const opt: Array<[number, number]> = [
    [0, 0],
    [10, 18],
    [20, 38],
    [30, 58],
    [40, 80],
    [50, 100],
    [60, 100],
  ];
  return (
    <LineChart
      caption={caption}
      ariaLabel="Looping-sequential workload hit rate"
      xLabel="캐시 크기 (페이지 수)"
      yLabel="hit rate (%)"
      xMax={60}
      yMax={105}
      xTicks={[0, 10, 20, 30, 40, 50, 60]}
      yTicks={[0, 20, 40, 60, 80, 100]}
      series={[
        { name: 'OPT', color: vars.color.solution, points: opt },
        { name: 'Random', color: vars.color.accent, points: random },
        { name: 'LRU/FIFO', color: vars.color.problem, points: lru, dashed: true },
      ]}
      annotations={[{ x: 12, y: 6, text: 'LRU/FIFO 는 50 미만에서 0% (최악)', color: vars.color.problem }]}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Clock Algorithm (원형 시계)
// ════════════════════════════════════════════════════════════════════════════
export function ClockAlgorithm({ caption }: { caption?: string }) {
  const W = 760;
  const H = 360;
  const cx = 250;
  const cy = 180;
  const R = 130;

  // 8개 페이지와 use bit
  const pages = [
    { name: 'A', use: 1 },
    { name: 'B', use: 1 },
    { name: 'C', use: 0 },
    { name: 'D', use: 1 },
    { name: 'E', use: 0 },
    { name: 'F', use: 1 },
    { name: 'G', use: 1 },
    { name: 'H', use: 0 },
  ];
  const n = pages.length;
  // 12시 방향부터 시계방향. 각도(라디안) 계산은 정적이어야 하므로 미리 계산.
  const angleOf = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2;

  // 시계 바늘이 가리키는 위치 (예: index 2 = C)
  const handIdx = 2;
  const handAngle = angleOf(handIdx);
  const handLen = R - 36;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Clock algorithm">
        <ArrowDefs />

        {/* 시계 테두리 */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={vars.color.border} strokeWidth={1.4} />

        {/* 시계 바늘 */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + handLen * Math.cos(handAngle)}
          y2={cy + handLen * Math.sin(handAngle)}
          stroke={vars.color.accent}
          strokeWidth={2.6}
          markerEnd="url(#arrow-accent)"
        />
        <circle cx={cx} cy={cy} r={4} fill={vars.color.accent} />

        {/* 페이지 노드 */}
        {pages.map((p, i) => {
          const a = angleOf(i);
          const px = cx + R * Math.cos(a);
          const py = cy + R * Math.sin(a);
          const tone: BoxTone = p.use === 1 ? 'accent' : 'muted';
          return (
            <g key={p.name}>
              <circle cx={px} cy={py} r={22} fill={toneBg(tone)} stroke={toneStroke(tone)} strokeWidth={1.6} />
              <text x={px} y={py - 1} textAnchor="middle" fontSize={14} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
                {p.name}
              </text>
              <text x={px} y={py + 12} textAnchor="middle" fontSize={9.5} fontFamily={vars.font.mono} fill={toneTextColor(tone)}>
                use={p.use}
              </text>
            </g>
          );
        })}

        {/* 오른쪽 설명 */}
        <g>
          <Tag x={430} y={50} text="리플레이스먼트가 필요할 때마다" tone="plain" bold size={13} />
          {[
            { t: 'use = 1 → 0 으로 리셋하고 바늘 한 칸 전진', tone: 'accent' as BoxTone },
            { t: 'use = 0 인 page 를 만나면 → 그 page 를 victim 으로', tone: 'problem' as BoxTone },
            { t: 'page 접근(hit) 시 → 그 page 의 use = 1', tone: 'solution' as BoxTone },
          ].map((row, i) => {
            const ry = 76 + i * 56;
            return (
              <g key={i}>
                <BoxBg x={430} y={ry} w={300} h={44} tone={row.tone} />
                <text x={446} y={ry + 27} fontSize={12} fontFamily={vars.font.sans} fill={toneTextColor(row.tone)}>
                  {row.t}
                </text>
              </g>
            );
          })}
          <Txt x={430} y={260} text="LRU 를 1bit(use) 로 근사 — 정확한 LRU 는 아니지만" anchor="start" muted size={11.5} />
          <Txt x={430} y={278} text="훨씬 싸다. 링크드 리스트 재정렬이 필요 없다." anchor="start" muted size={11.5} />
        </g>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Dirty Bit — 쓰기 생략 최적화
// ════════════════════════════════════════════════════════════════════════════
export function DirtyBitDecision({ caption }: { caption?: string }) {
  const W = 760;
  const topW = 300;
  const topX = (W - topW) / 2;
  const topY = 14;
  const topH = 46;

  const branchY = topY + topH + 50;
  const colW = 300;
  const colGap = 60;
  const leftX = (W - (colW * 2 + colGap)) / 2;
  const rightX = leftX + colW + colGap;
  const colH = 120;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${branchY + colH + 20}`} role="img" aria-label="Dirty bit eviction decision">
        <ArrowDefs />
        <Box x={topX} y={topY} w={topW} h={topH} tone="accent" label="victim page 를 evict" bold />

        {/* clean */}
        <Arrow x1={topX + topW / 2} y1={topY + topH + 1} x2={leftX + colW / 2} y2={branchY - 1} label="dirty = 0 (clean)" />
        <BoxBg x={leftX} y={branchY} w={colW} h={colH} tone="solution" />
        <Tag x={leftX + 16} y={branchY + 26} text="수정된 적 없음" tone="solution" bold />
        <Txt x={leftX + 16} y={branchY + 52} text="swap 에 동일한 사본이 이미 있음" />
        <Mono x={leftX + 16} y={branchY + 80} text="→ disk write 생략!" accent anchor="start" />
        <Txt x={leftX + 16} y={branchY + 102} text="그냥 frame 을 회수하면 끝" muted size={11.5} />

        {/* dirty */}
        <Arrow x1={topX + topW / 2} y1={topY + topH + 1} x2={rightX + colW / 2} y2={branchY - 1} label="dirty = 1" />
        <BoxBg x={rightX} y={branchY} w={colW} h={colH} tone="problem" />
        <Tag x={rightX + 16} y={branchY + 26} text="수정됨" tone="problem" bold />
        <Txt x={rightX + 16} y={branchY + 52} text="메모리 내용 ≠ swap 사본" />
        <Mono x={rightX + 16} y={branchY + 80} text="→ disk write 필요" anchor="start" />
        <Txt x={rightX + 16} y={branchY + 102} text="먼저 디스크에 써준 뒤 회수" muted size={11.5} />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Thrashing
// ════════════════════════════════════════════════════════════════════════════
export function ThrashingChart({ caption }: { caption?: string }) {
  // CPU 사용률 vs multiprogramming degree: 올라가다 임계점에서 급락
  const cpu: Array<[number, number]> = [
    [0, 0],
    [2, 45],
    [4, 75],
    [6, 90],
    [7, 92],
    [8, 60],
    [9, 30],
    [10, 12],
  ];
  return (
    <LineChart
      caption={caption}
      ariaLabel="Thrashing: CPU utilization vs degree of multiprogramming"
      xLabel="degree of multiprogramming (동시 프로세스 수)"
      yLabel="CPU 사용률 (%)"
      xMax={10}
      yMax={100}
      xTicks={[0, 2, 4, 6, 8, 10]}
      yTicks={[0, 20, 40, 60, 80, 100]}
      series={[{ name: 'CPU 사용률', color: vars.color.accent, points: cpu }]}
      annotations={[{ x: 7.1, y: 80, text: '임계점 — 이후 thrashing', color: vars.color.problem }]}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Prefetching / Clustering
// ════════════════════════════════════════════════════════════════════════════
export function PrefetchClustering({ caption }: { caption?: string }) {
  const W = 760;
  const H = 250;
  const colW = 350;
  const gap = 40;
  const leftX = (W - (colW * 2 + gap)) / 2;
  const rightX = leftX + colW + gap;
  const y = 40;
  const cardH = 180;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Prefetching and clustering">
        <ArrowDefs />

        {/* Prefetching */}
        <BoxBg x={leftX} y={y} w={colW} h={cardH} tone="plain" />
        <Tag x={leftX + 16} y={y + 26} text="Prefetching (미리 읽기)" tone="accent" bold size={13} />
        <Box x={leftX + 24} y={y + 46} w={120} h={36} tone="accent" label="page 1 요청" small />
        <Arrow x1={leftX + 150} y1={y + 64} x2={leftX + 186} y2={y + 64} />
        <Box x={leftX + 190} y={y + 46} w={130} h={36} tone="solution" label="page 1 + 2 로드" small />
        <Txt x={leftX + 16} y={y + 110} text="곧 쓸 것 같은 다음 page 까지 미리 가져온다." muted size={11.5} />
        <Txt x={leftX + 16} y={y + 130} text="예: code segment 는 순차 접근 → 다음 page 확률↑" muted size={11.5} />
        <Txt x={leftX + 16} y={y + 156} text="디스크 접근 지연을 미리 숨긴다." muted size={11.5} />

        {/* Clustering */}
        <BoxBg x={rightX} y={y} w={colW} h={cardH} tone="plain" />
        <Tag x={rightX + 16} y={y + 26} text="Clustering / Grouping (모아 쓰기)" tone="accent" bold size={13} />
        {[0, 1, 2].map((i) => (
          <Box key={i} x={rightX + 24 + i * 40} y={y + 46} w={32} h={36} tone="limitation" label={`w`} small />
        ))}
        <Arrow x1={rightX + 150} y1={y + 64} x2={rightX + 186} y2={y + 64} label="batch" />
        <Box x={rightX + 190} y={y + 46} w={130} h={36} tone="solution" label="한 번의 disk write" small />
        <Txt x={rightX + 16} y={y + 110} text="여러 page 쓰기를 모아 한 번의 큰 I/O 로 처리." muted size={11.5} />
        <Txt x={rightX + 16} y={y + 130} text="한 번 쓰기와 여러 개 쓰기의 시간 차가 작기 때문." muted size={11.5} />
        <Txt x={rightX + 16} y={y + 156} text="write 횟수를 줄여 디스크 효율을 높인다." muted size={11.5} />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 10. Policy vs Daemon — "어떻게 고를까" vs "누가 실행할까"
// ════════════════════════════════════════════════════════════════════════════
export function PolicyVsDaemon({ caption }: { caption?: string }) {
  const W = 760;
  const H = 360;

  // 상단: 좌우 두 박스 + 가운데 "uses"
  const cardW = 280;
  const cardH = 120;
  const leftX = 40;
  const rightX = W - 40 - cardW;
  const topY = 24;

  // 하단: kswapd 일하는 흐름
  const flowY = topY + cardH + 56;
  const stepW = 156;
  const stepH = 56;
  const stepGap = 14;
  const flowStartX = (W - (4 * stepW + 3 * stepGap)) / 2;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Page replacement policy vs executor daemon">
        <ArrowDefs />

        {/* 왼쪽: 실행 주체 */}
        <BoxBg x={leftX} y={topY} w={cardW} h={cardH} tone="accent" />
        <Tag x={leftX + 16} y={topY + 22} text="실행 주체 (executor)" tone="accent" bold size={12.5} />
        <Mono x={leftX + cardW / 2} y={topY + 56} text="swap / page daemon" anchor="middle" size={15} />
        <Txt x={leftX + cardW / 2} y={topY + 82} text="예: Linux kswapd" anchor="middle" muted size={11.5} />
        <Txt x={leftX + cardW / 2} y={topY + 102} text="실제로 깨어나 메모리를 회수한다" anchor="middle" muted size={11} />

        {/* 가운데: uses */}
        <Arrow x1={leftX + cardW + 6} y1={topY + cardH / 2} x2={rightX - 6} y2={topY + cardH / 2} label="사용 (uses)" />

        {/* 오른쪽: 선택 규칙 */}
        <BoxBg x={rightX} y={topY} w={cardW} h={cardH} tone="solution" />
        <Tag x={rightX + 16} y={topY + 22} text="선택 규칙 (policy)" tone="solution" bold size={12.5} />
        <Mono x={rightX + cardW / 2} y={topY + 56} text="Clock / LRU / FIFO …" anchor="middle" size={15} />
        <Txt x={rightX + cardW / 2} y={topY + 82} text="누구를 victim 으로 고를지" anchor="middle" muted size={11.5} />
        <Txt x={rightX + cardW / 2} y={topY + 102} text="규칙만 정의, 실행은 안 한다" anchor="middle" muted size={11} />

        {/* 비유 */}
        <Txt
          x={W / 2}
          y={topY + cardH + 30}
          text="비유 — daemon 은 청소부, policy 는 '어떤 물건부터 버릴지' 정하는 규칙."
          anchor="middle"
          muted
          size={12}
        />

        {/* 하단 흐름 */}
        {[
          { t: 'free < low watermark', tone: 'problem' as BoxTone },
          { t: 'daemon 깨어남', tone: 'accent' as BoxTone },
          { t: 'policy 로 victim 선택', tone: 'solution' as BoxTone, mark: true },
          { t: 'frame 회수 완료', tone: 'plain' as BoxTone },
        ].map((st, i) => {
          const x = flowStartX + i * (stepW + stepGap);
          return (
            <g key={i}>
              <BoxBg x={x} y={flowY} w={stepW} h={stepH} tone={st.tone} />
              <text
                x={x + stepW / 2}
                y={flowY + stepH / 2 + 4}
                textAnchor="middle"
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fontWeight={st.mark ? 700 : 500}
                fill={toneTextColor(st.tone)}
              >
                {st.t}
              </text>
              {i < 3 && (
                <Arrow
                  x1={x + stepW + 1}
                  y1={flowY + stepH / 2}
                  x2={x + stepW + stepGap - 1}
                  y2={flowY + stepH / 2}
                />
              )}
              {st.mark && (
                <text
                  x={x + stepW / 2}
                  y={flowY + stepH + 18}
                  textAnchor="middle"
                  fontSize={10.5}
                  fontFamily={vars.font.sans}
                  fontStyle="italic"
                  fill={vars.color.solution}
                >
                  ↑ Clock / LRU 가 호출되는 지점
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

function Box({
  x,
  y,
  w,
  h,
  tone,
  label,
  bold,
  small,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  label: string;
  bold?: boolean;
  small?: boolean;
}) {
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={small ? 11.5 : 12.5}
        fontFamily={vars.font.sans}
        fontWeight={bold ? 700 : 500}
        fill={toneTextColor(tone)}
      >
        {label}
      </text>
    </g>
  );
}

function Tag({
  x,
  y,
  text,
  tone,
  bold,
  size = 12,
}: {
  x: number;
  y: number;
  text: string;
  tone: BoxTone;
  bold?: boolean;
  size?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={vars.font.sans} fontWeight={bold ? 700 : 500} fill={toneTextColor(tone)}>
      {text}
    </text>
  );
}

function Txt({
  x,
  y,
  text,
  anchor = 'start',
  muted,
  size = 12.5,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: 'start' | 'middle' | 'end';
  muted?: boolean;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontFamily={vars.font.sans} fill={muted ? vars.color.textMuted : vars.color.text}>
      {text}
    </text>
  );
}

function Mono({
  x,
  y,
  text,
  anchor = 'start',
  size = 13,
  accent,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: 'start' | 'middle' | 'end';
  size?: number;
  accent?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontFamily={vars.font.mono}
      fontWeight={700}
      fill={accent ? vars.color.accent : vars.color.heading}
    >
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
      <marker id="arrow-accent" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.accent} />
      </marker>
    </defs>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
      {label && (
        <text x={midX} y={midY - 5} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          {label}
        </text>
      )}
    </g>
  );
}
