import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch15Diagrams.css';

/**
 * 15장(Swapping Mechanisms) 본문에서 사용하는 SVG 다이어그램 모음.
 *
 * 가독성을 위해 모든 다이어그램은 다음 규칙을 공유한다.
 * - viewBox 기반 → 컨테이너 폭에 맞춰 자연스럽게 축소
 * - 색은 theme.css 의 vars.color 토큰만 사용 → 라이트/다크 자동 대응
 * - 박스/화살표 등 자주 쓰는 요소는 파일 하단의 primitive 함수로 분리
 */

// ────────────────────────────────────────────────────────────────────────────
// 1. Physical Memory + Swap Space 레이아웃
// ────────────────────────────────────────────────────────────────────────────
export function MemorySwapLayout({ caption }: { caption?: string }) {
  // physical memory: PFN0~3
  const pfn = [
    { pfn: 0, proc: 'Proc 0', vpn: 'VPN 0' },
    { pfn: 1, proc: 'Proc 1', vpn: 'VPN 2' },
    { pfn: 2, proc: 'Proc 1', vpn: 'VPN 3' },
    { pfn: 3, proc: 'Proc 2', vpn: 'VPN 0' },
  ];
  // swap space: 5 blocks (마지막은 ...)
  const swap: Array<{ block: string; main: string; sub?: string; free?: boolean }> = [
    { block: 'Block 0', main: 'Proc 0', sub: 'VPN 1' },
    { block: 'Block 1', main: 'Proc 0', sub: 'VPN 2' },
    { block: 'Block 2', main: '[Free]', free: true },
    { block: 'Block 3', main: 'Proc 1', sub: 'VPN 0' },
    { block: 'Block 4', main: '…', free: true },
  ];

  const W = 760;
  const cellW = 140;
  const cellH = 78;
  const gap = 14;

  // physical row
  const pfnRowStartX = (W - (pfn.length * cellW + (pfn.length - 1) * gap)) / 2;
  const pfnRowY = 56;

  // swap row
  const swapRowStartX = (W - (swap.length * cellW + (swap.length - 1) * gap)) / 2 - 30;
  const swapRowY = 220;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 340`} role="img" aria-label="Physical Memory and Swap Space layout">
        <ArrowDefs />

        {/* Physical Memory row */}
        <SectionLabel x={20} y={32} text="Physical Memory (DRAM)" />
        {pfn.map((c, i) => (
          <BoxWithLabels
            key={c.pfn}
            x={pfnRowStartX + i * (cellW + gap)}
            y={pfnRowY}
            w={cellW}
            h={cellH}
            tone="accent"
            top={`PFN ${c.pfn}`}
            mid={c.proc}
            bot={c.vpn}
          />
        ))}

        {/* divider */}
        <line
          x1={20}
          x2={W - 20}
          y1={170}
          y2={170}
          stroke={vars.color.border}
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* Swap Space row */}
        <SectionLabel x={20} y={200} text="Swap Space (Disk)" />
        {swap.map((c, i) => (
          <BoxWithLabels
            key={c.block}
            x={swapRowStartX + i * (cellW + gap)}
            y={swapRowY}
            w={cellW}
            h={cellH}
            tone={c.free ? 'muted' : 'limitation'}
            top={c.block}
            mid={c.main}
            bot={c.sub}
          />
        ))}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Page 이동 (Physical → Swap)
// ────────────────────────────────────────────────────────────────────────────
export function PageMovement({ caption }: { caption?: string }) {
  const W = 720;
  const colW = 240;
  const cellH = 48;
  const gap = 10;
  const leftX = 60;
  const rightX = W - 60 - colW;
  const topY = 56;

  const left = ['Proc A, VPN 0', 'Proc A, VPN 1', 'Proc B, VPN 0'];
  const right = ['Proc A, VPN 0', '...'];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 240`} role="img" aria-label="Page movement from physical memory to swap space">
        <ArrowDefs />

        <SectionLabel x={leftX} y={32} text="Physical Memory" />
        <SectionLabel x={rightX} y={32} text="Swap Space" />

        {left.map((t, i) => (
          <Box
            key={`l-${i}`}
            x={leftX}
            y={topY + i * (cellH + gap)}
            w={colW}
            h={cellH}
            tone={i === 0 ? 'accent' : 'plain'}
            label={t}
          />
        ))}

        {right.map((t, i) => (
          <Box
            key={`r-${i}`}
            x={rightX}
            y={topY + i * (cellH + gap)}
            w={colW}
            h={cellH}
            tone={i === 0 ? 'limitation' : 'muted'}
            label={t}
          />
        ))}

        {/* 첫 페이지 이동 화살표 */}
        <Arrow
          x1={leftX + colW + 4}
          y1={topY + cellH / 2}
          x2={rightX - 4}
          y2={topY + cellH / 2}
          label="swap out"
        />
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Valid / Present 결정 매트릭스
// ────────────────────────────────────────────────────────────────────────────
export function ValidPresentMatrix({ caption }: { caption?: string }) {
  const rows: Array<{ cond: string; result: string; tone: BoxTone }> = [
    { cond: 'valid = 0', result: 'segmentation fault', tone: 'problem' },
    { cond: 'valid = 1, protection check 실패', result: 'protection fault', tone: 'problem' },
    { cond: 'valid = 1, protection OK, present = 0', result: 'page fault (swap-in)', tone: 'limitation' },
    { cond: 'valid = 1, protection OK, present = 1', result: '정상 접근', tone: 'solution' },
  ];

  const W = 720;
  const rowH = 56;
  const rowGap = 10;
  const condW = 380;
  const resultW = 240;
  const startX = 30;
  const resultX = startX + condW + 40;
  const startY = 24;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${rows.length * (rowH + rowGap) + 16}`} role="img" aria-label="Valid and Present bit decision matrix">
        <ArrowDefs />
        {rows.map((r, i) => {
          const y = startY + i * (rowH + rowGap);
          return (
            <g key={i}>
              <Box x={startX} y={y} w={condW} h={rowH} tone="plain" label={r.cond} />
              <Arrow x1={startX + condW + 4} y1={y + rowH / 2} x2={resultX - 4} y2={y + rowH / 2} />
              <Box x={resultX} y={y} w={resultW} h={rowH} tone={r.tone} label={r.result} bold />
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. User mode → Page fault → Handler trap 흐름
// ────────────────────────────────────────────────────────────────────────────
export function PageFaultTrapFlow({ caption }: { caption?: string }) {
  return (
    <StepFlow
      caption={caption}
      steps={[
        { text: 'User mode에서 memory access', tone: 'plain' },
        { text: 'PTE 확인', tone: 'plain' },
        { text: 'present bit = 0', tone: 'limitation' },
        { text: 'page fault 발생', tone: 'problem' },
        { text: 'trap을 통해 kernel mode 진입', tone: 'accent' },
        { text: 'page fault handler 실행', tone: 'solution' },
      ]}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 5. Replacement: 5단계
// ────────────────────────────────────────────────────────────────────────────
export function ReplacementSteps({ caption }: { caption?: string }) {
  return (
    <StepFlow
      caption={caption}
      numbered
      steps={[
        { text: '필요한 page가 disk에 있음', tone: 'plain' },
        { text: 'physical memory에 빈 frame이 없음', tone: 'problem' },
        { text: '기존 page 하나를 골라 disk로 내보냄 (page-replacement policy)', tone: 'limitation' },
        { text: '빈 frame이 생김', tone: 'solution' },
        { text: '필요한 page를 disk에서 읽어와 해당 frame에 넣음', tone: 'accent' },
      ]}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 6. Lazy approach 흐름
// ────────────────────────────────────────────────────────────────────────────
export function LazyApproachFlow({ caption }: { caption?: string }) {
  return (
    <StepFlow
      caption={caption}
      steps={[
        { text: 'Physical Memory가 꽉 참', tone: 'problem' },
        { text: '새로운 page를 올려야 함', tone: 'plain' },
        { text: '그제서야 page 하나를 disk로 내보냄', tone: 'limitation' },
        { text: '생긴 빈 frame에 새로운 page를 올림', tone: 'solution' },
      ]}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 7. 메모리가 한 번 꽉 차면 계속 꽉 차는 사이클
// ────────────────────────────────────────────────────────────────────────────
export function MemoryFullCycle({ caption }: { caption?: string }) {
  // 사이클이므로 마지막에서 처음으로 돌아가는 curved arrow 표시
  const steps = [
    '새 page 필요',
    'memory full',
    'victim page disk write',
    '새 page load',
    '다시 memory full',
  ];

  const W = 720;
  const stepW = 130;
  const stepH = 70;
  const gap = (W - stepW * steps.length - 40) / (steps.length - 1);
  const startX = 20;
  const y = 60;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 200`} role="img" aria-label="Memory full cycle">
        <ArrowDefs />
        {steps.map((t, i) => {
          const x = startX + i * (stepW + gap);
          return (
            <g key={i}>
              <Box x={x} y={y} w={stepW} h={stepH} tone={i === 1 || i === 4 ? 'problem' : 'plain'} label={t} small />
              {i < steps.length - 1 && (
                <Arrow
                  x1={x + stepW + 2}
                  y1={y + stepH / 2}
                  x2={x + stepW + gap - 2}
                  y2={y + stepH / 2}
                />
              )}
            </g>
          );
        })}
        {/* 마지막에서 처음으로 돌아가는 곡선 */}
        <path
          d={`M ${W - 20 - stepW / 2} ${y + stepH + 2}
              C ${W - 20 - stepW / 2} ${y + stepH + 70},
                ${20 + stepW / 2} ${y + stepH + 70},
                ${20 + stepW / 2} ${y + stepH + 2}`}
          fill="none"
          stroke={vars.color.problem}
          strokeWidth={1.5}
          markerEnd="url(#arrow-problem)"
          strokeDasharray="6 4"
        />
        <text
          x={W / 2}
          y={y + stepH + 60}
          textAnchor="middle"
          fontSize={12}
          fontFamily={vars.font.sans}
          fontStyle="italic"
          fill={vars.color.problem}
        >
          반복…
        </text>
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 8. Watermark / Page daemon
// ────────────────────────────────────────────────────────────────────────────
export function WatermarkDaemonFlow({ caption }: { caption?: string }) {
  const W = 720;
  const H = 320;

  // 좌측: watermark 게이지
  const gaugeX = 60;
  const gaugeY = 40;
  const gaugeW = 100;
  const gaugeH = 240;

  // HW 와 LW 위치 (위쪽이 free page 많음)
  const hwY = gaugeY + gaugeH * 0.25;
  const lwY = gaugeY + gaugeH * 0.65;

  // 우측: flow steps
  const flowX = 220;
  const flowW = W - flowX - 30;
  const stepH = 44;
  const stepGap = 12;

  const steps: Array<{ text: string; tone: BoxTone }> = [
    { text: 'free page 수가 LW 아래로 떨어짐', tone: 'problem' },
    { text: 'page daemon 실행', tone: 'accent' },
    { text: '잘 안 쓰는 page들을 disk로 내보냄', tone: 'limitation' },
    { text: 'free page 수가 HW까지 회복됨', tone: 'solution' },
    { text: 'page daemon 멈춤', tone: 'plain' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Watermark based page daemon flow">
        <ArrowDefs />
        <SectionLabel x={gaugeX} y={28} text="free pages" />

        {/* gauge background */}
        <rect
          x={gaugeX}
          y={gaugeY}
          width={gaugeW}
          height={gaugeH}
          fill={vars.color.surface}
          stroke={vars.color.border}
          strokeWidth={1}
          rx={6}
        />
        {/* 안전 구역 (HW 위) */}
        <rect
          x={gaugeX + 1}
          y={gaugeY + 1}
          width={gaugeW - 2}
          height={hwY - gaugeY - 1}
          fill={vars.color.solutionSoft}
        />
        {/* 데몬 동작 구역 (LW ~ HW) */}
        <rect
          x={gaugeX + 1}
          y={hwY}
          width={gaugeW - 2}
          height={lwY - hwY}
          fill={vars.color.limitationSoft}
        />
        {/* 위험 구역 (LW 아래) */}
        <rect
          x={gaugeX + 1}
          y={lwY}
          width={gaugeW - 2}
          height={gaugeY + gaugeH - lwY - 1}
          fill={vars.color.problemSoft}
        />

        {/* HW 선 */}
        <line
          x1={gaugeX - 8}
          x2={gaugeX + gaugeW + 8}
          y1={hwY}
          y2={hwY}
          stroke={vars.color.solution}
          strokeWidth={1.5}
        />
        <text
          x={gaugeX + gaugeW + 12}
          y={hwY + 4}
          fontSize={12}
          fontFamily={vars.font.mono}
          fill={vars.color.solution}
          fontWeight={700}
        >
          HW
        </text>

        {/* LW 선 */}
        <line
          x1={gaugeX - 8}
          x2={gaugeX + gaugeW + 8}
          y1={lwY}
          y2={lwY}
          stroke={vars.color.problem}
          strokeWidth={1.5}
        />
        <text
          x={gaugeX + gaugeW + 12}
          y={lwY + 4}
          fontSize={12}
          fontFamily={vars.font.mono}
          fill={vars.color.problem}
          fontWeight={700}
        >
          LW
        </text>

        {/* 라벨 */}
        <text
          x={gaugeX + gaugeW / 2}
          y={gaugeY + 24}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fill={vars.color.solution}
        >
          여유
        </text>
        <text
          x={gaugeX + gaugeW / 2}
          y={(hwY + lwY) / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fill={vars.color.limitation}
          fontWeight={600}
        >
          daemon
        </text>
        <text
          x={gaugeX + gaugeW / 2}
          y={lwY + (gaugeY + gaugeH - lwY) / 2 + 4}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fill={vars.color.problem}
          fontWeight={600}
        >
          위험
        </text>

        {/* 오른쪽 flow */}
        {steps.map((st, i) => {
          const y = 40 + i * (stepH + stepGap);
          return (
            <g key={i}>
              <Box x={flowX} y={y} w={flowW} h={stepH} tone={st.tone} label={st.text} />
              {i < steps.length - 1 && (
                <Arrow
                  x1={flowX + 20}
                  y1={y + stepH + 1}
                  x2={flowX + 20}
                  y2={y + stepH + stepGap - 1}
                />
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 9. RetryInstruction 흐름
// ────────────────────────────────────────────────────────────────────────────
export function RetryInstructionFlow({ caption }: { caption?: string }) {
  return (
    <StepFlow
      caption={caption}
      steps={[
        { text: '처음 실행', tone: 'plain' },
        { text: 'page fault 발생', tone: 'problem' },
        { text: 'kernel page fault handler 실행', tone: 'accent' },
        { text: 'disk에서 page 읽어옴', tone: 'limitation' },
        { text: 'PTE 업데이트', tone: 'accent' },
        { text: 'instruction 재시도 — RetryInstruction()', tone: 'solution' },
        { text: '이번에는 성공', tone: 'solution', bold: true },
      ]}
    />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 10. TLB hit / miss 흐름 (간단 버전)
// ────────────────────────────────────────────────────────────────────────────
export function TlbHitMissFlow({ caption }: { caption?: string }) {
  const W = 720;
  const H = 280;

  // 위 박스: TLB lookup
  const topX = (W - 220) / 2;
  const topY = 16;

  // 좌우 두 갈래
  const branchY = topY + 70;
  const branchW = 280;
  const leftX = 40;
  const rightX = W - 40 - branchW;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="TLB hit and miss flow">
        <ArrowDefs />

        <Box x={topX} y={topY} w={220} h={48} tone="accent" label="VA → TLB Lookup" bold />

        {/* 양 갈래 화살표 */}
        <Arrow x1={topX + 40} y1={topY + 48 + 2} x2={leftX + branchW / 2} y2={branchY - 2} label="hit" />
        <Arrow x1={topX + 180} y1={topY + 48 + 2} x2={rightX + branchW / 2} y2={branchY - 2} label="miss" />

        {/* 좌측: hit */}
        <Box
          x={leftX}
          y={branchY}
          w={branchW}
          h={56}
          tone="solution"
          label="최근 사용한 page · 메모리에 있음"
        />
        <Arrow x1={leftX + branchW / 2} y1={branchY + 56 + 2} x2={leftX + branchW / 2} y2={branchY + 90 - 2} />
        <Box
          x={leftX}
          y={branchY + 90}
          w={branchW}
          h={56}
          tone="solution"
          label="바로 접근"
          bold
        />

        {/* 우측: miss */}
        <Box
          x={rightX}
          y={branchY}
          w={branchW}
          h={56}
          tone="limitation"
          label="page table 확인"
        />
        <Arrow x1={rightX + branchW / 2} y1={branchY + 56 + 2} x2={rightX + branchW / 2} y2={branchY + 90 - 2} />
        <Box
          x={rightX}
          y={branchY + 90}
          w={branchW}
          h={56}
          tone="problem"
          label="present = 0 → page fault"
          bold
        />
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 11. 시스템 컴포넌트 파이프라인 (큰 그림)
// ────────────────────────────────────────────────────────────────────────────
export function SystemComponentPipeline({ caption }: { caption?: string }) {
  const items: Array<{ title: string; subs: string[]; tone: BoxTone; mark?: string }> = [
    {
      title: 'User Process',
      tone: 'plain',
      subs: ['load/store instruction 실행'],
    },
    {
      title: 'CPU / MMU',
      tone: 'accent',
      subs: ['TLB, Page Table 확인', 'PTE.Present == 0 이면 PAGE_FAULT 발생'],
    },
    {
      title: 'Kernel: Virtual Memory subsystem',
      tone: 'accent',
      subs: [
        'page fault handler 실행',
        'swap slot / disk address 확인',
        '빈 physical page frame 확보',
      ],
      mark: '③',
    },
    {
      title: 'Kernel: Block I/O layer',
      tone: 'limitation',
      subs: ['swap device에 read 요청 생성'],
    },
    {
      title: 'Device Driver / Storage Controller',
      tone: 'limitation',
      subs: ['디스크에서 해당 block 읽기', 'DMA로 DRAM의 page frame에 데이터 전송'],
      mark: '④',
    },
    {
      title: 'Interrupt / Completion',
      tone: 'limitation',
      subs: ['I/O 완료 알림'],
    },
    {
      title: 'Kernel',
      tone: 'solution',
      subs: [
        'PTE.Present = 1',
        'PTE.PFN = 새 PFN',
        'fault 났던 instruction 재실행',
      ],
      mark: '⑤⑥',
    },
  ];

  const W = 720;
  const boxW = 600;
  const startX = (W - boxW) / 2;
  const gap = 14;
  const padX = 16;
  const titleH = 22;
  const lineH = 18;

  // 각 박스의 높이 미리 계산
  const heights = items.map((it) => titleH + 8 + it.subs.length * lineH + 12);
  const totalH = heights.reduce((a, b) => a + b, 0) + (items.length - 1) * gap + 20;

  let y = 10;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${totalH}`} role="img" aria-label="OS subsystem pipeline for page fault handling">
        <ArrowDefs />
        {items.map((it, i) => {
          const boxH = heights[i];
          const node = (
            <g key={i}>
              <BoxBg x={startX} y={y} w={boxW} h={boxH} tone={it.tone} />
              <text
                x={startX + padX}
                y={y + 16}
                fontSize={13}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(it.tone)}
              >
                {it.title}
              </text>
              {it.mark && (
                <text
                  x={startX + boxW - padX}
                  y={y + 16}
                  textAnchor="end"
                  fontSize={12}
                  fontFamily={vars.font.mono}
                  fontWeight={700}
                  fill={toneTextColor(it.tone)}
                >
                  {it.mark}
                </text>
              )}
              {it.subs.map((sub, j) => (
                <text
                  key={j}
                  x={startX + padX + 12}
                  y={y + titleH + 8 + j * lineH + 4}
                  fontSize={12}
                  fontFamily={vars.font.sans}
                  fill={vars.color.text}
                >
                  └ {sub}
                </text>
              ))}
              {i < items.length - 1 && (
                <Arrow
                  x1={startX + boxW / 2}
                  y1={y + boxH + 1}
                  x2={startX + boxW / 2}
                  y2={y + boxH + gap - 1}
                />
              )}
            </g>
          );
          y += boxH + gap;
          return node;
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 12. Page daemon 시나리오 (3 가지 case)
// ────────────────────────────────────────────────────────────────────────────
export function PageDaemonScenarios({ caption }: { caption?: string }) {
  const W = 720;
  const H = 380;

  // 위쪽 트리거 흐름
  const triggerW = 320;
  const triggerX = (W - triggerW) / 2;
  const triggerY = 16;

  const trigger = [
    'free pages < low watermark',
    'page daemon wake up',
    'victim page들을 고르고 evict 시작',
  ];

  const triggerH = 38;
  const triggerGap = 8;

  const caseTop = triggerY + trigger.length * (triggerH + triggerGap) + 28;
  const colW = 220;
  const colGap = 12;
  const colStartX = (W - (3 * colW + 2 * colGap)) / 2;

  const cases: Array<{ title: string; lines: string[]; tone: BoxTone }> = [
    {
      title: 'case 1',
      tone: 'solution',
      lines: ['page가 DRAM에 있음', '그냥 read 성공'],
    },
    {
      title: 'case 2',
      tone: 'limitation',
      lines: [
        'page가 swap에 있음',
        'free frame 있음 → swap-in',
        'process A는 disk read 완료까지 sleep',
      ],
    },
    {
      title: 'case 3',
      tone: 'problem',
      lines: [
        'page가 swap에 있음',
        'free frame 없음',
        '직접 reclaim/evict 참여 또는 대기',
        '더 긴 latency',
      ],
    },
  ];

  const lineH = 18;
  const caseHeight = 28 + Math.max(...cases.map((c) => c.lines.length)) * lineH + 14;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Page daemon and foreground process scenarios">
        <ArrowDefs />

        {/* 트리거 흐름 */}
        {trigger.map((t, i) => {
          const y = triggerY + i * (triggerH + triggerGap);
          return (
            <g key={i}>
              <Box x={triggerX} y={y} w={triggerW} h={triggerH} tone={i === 0 ? 'problem' : 'accent'} label={t} />
              {i < trigger.length - 1 && (
                <Arrow
                  x1={triggerX + triggerW / 2}
                  y1={y + triggerH + 1}
                  x2={triggerX + triggerW / 2}
                  y2={y + triggerH + triggerGap - 1}
                />
              )}
            </g>
          );
        })}

        {/* "동시에 process A가 memory read" 텍스트 */}
        <text
          x={W / 2}
          y={caseTop - 12}
          textAnchor="middle"
          fontSize={12}
          fontStyle="italic"
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          동시에 process A가 memory read
        </text>

        {/* 3 cases */}
        {cases.map((c, i) => {
          const x = colStartX + i * (colW + colGap);
          return (
            <g key={c.title}>
              <BoxBg x={x} y={caseTop} w={colW} h={caseHeight} tone={c.tone} />
              <text
                x={x + colW / 2}
                y={caseTop + 18}
                textAnchor="middle"
                fontSize={13}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={toneTextColor(c.tone)}
              >
                {c.title}
              </text>
              {c.lines.map((ln, j) => (
                <text
                  key={j}
                  x={x + 12}
                  y={caseTop + 36 + j * lineH + 4}
                  fontSize={11.5}
                  fontFamily={vars.font.sans}
                  fill={vars.color.text}
                >
                  • {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 13. PFN 재할당 — 같은 VPN의 PFN이 swap out/in 후에 바뀌는 모습
// ────────────────────────────────────────────────────────────────────────────
export function PfnReassignment({ caption }: { caption?: string }) {
  // 세 시점의 같은 VPN 2 매핑 상태
  const rows: Array<{
    label: string;
    vpn: string;
    arrow: string;
    target: string;
    targetSub: string;
    tone: BoxTone;
    targetTone: BoxTone;
    note: string;
  }> = [
    {
      label: 't1',
      vpn: 'VPN 2',
      arrow: '→',
      target: 'PFN 5',
      targetSub: 'present = 1',
      tone: 'plain',
      targetTone: 'solution',
      note: 'DRAM에 적재됨',
    },
    {
      label: 't2',
      vpn: 'VPN 2',
      arrow: '→',
      target: 'disk block 10',
      targetSub: 'present = 0',
      tone: 'plain',
      targetTone: 'limitation',
      note: 'swap out — PFN 5는 다른 page가 차지',
    },
    {
      label: 't3',
      vpn: 'VPN 2',
      arrow: '→',
      target: 'PFN 8',
      targetSub: 'present = 1',
      tone: 'plain',
      targetTone: 'solution',
      note: 'swap in — 이전과 다른 PFN로 복귀',
    },
  ];

  const W = 720;
  const rowH = 72;
  const rowGap = 28;
  const startX = 30;
  const startY = 24;

  // 한 줄 구성요소 폭
  const labelW = 50;
  const vpnW = 110;
  const arrowW = 32;
  const targetW = 200;
  const noteX = startX + labelW + 12 + vpnW + arrowW + targetW + 24;

  const H = startY + rows.length * (rowH + rowGap) - rowGap + 20;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="PFN reassignment across swap out and swap in">
        <ArrowDefs />
        {rows.map((r, i) => {
          const y = startY + i * (rowH + rowGap);
          const vpnX = startX + labelW + 12;
          const arrowStartX = vpnX + vpnW;
          const arrowEndX = arrowStartX + arrowW;
          const targetX = arrowEndX;

          return (
            <g key={i}>
              {/* 시점 라벨 (t1, t2, t3) */}
              <text
                x={startX + labelW / 2}
                y={y + rowH / 2 + 4}
                textAnchor="middle"
                fontSize={14}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={vars.color.textMuted}
              >
                {r.label}
              </text>

              {/* VPN 박스 */}
              <Box x={vpnX} y={y} w={vpnW} h={rowH} tone={r.tone} label={r.vpn} bold />

              {/* 화살표 */}
              <Arrow x1={arrowStartX + 4} y1={y + rowH / 2} x2={arrowEndX - 4} y2={y + rowH / 2} />

              {/* Target 박스 (PFN 또는 disk block) */}
              <BoxBg x={targetX} y={y} w={targetW} h={rowH} tone={r.targetTone} />
              <text
                x={targetX + targetW / 2}
                y={y + rowH / 2 - 4}
                textAnchor="middle"
                fontSize={15}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={toneTextColor(r.targetTone)}
              >
                {r.target}
              </text>
              <text
                x={targetX + targetW / 2}
                y={y + rowH / 2 + 16}
                textAnchor="middle"
                fontSize={11}
                fontFamily={vars.font.mono}
                fill={vars.color.textMuted}
              >
                {r.targetSub}
              </text>

              {/* 우측 설명 */}
              <text
                x={noteX}
                y={y + rowH / 2 + 4}
                fontSize={12}
                fontFamily={vars.font.sans}
                fontStyle="italic"
                fill={vars.color.textMuted}
              >
                {r.note}
              </text>

              {/* 시점 간 전이 화살표 (행 사이) */}
              {i < rows.length - 1 && (
                <g>
                  <path
                    d={`M ${targetX + targetW / 2} ${y + rowH + 2}
                        L ${targetX + targetW / 2} ${y + rowH + rowGap - 2}`}
                    stroke={vars.color.evoArrow}
                    strokeWidth={1.4}
                    fill="none"
                    markerEnd="url(#arrow-default)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={targetX + targetW / 2 + 10}
                    y={y + rowH + rowGap / 2 + 4}
                    fontSize={11.5}
                    fontFamily={vars.font.sans}
                    fontStyle="italic"
                    fill={vars.color.textMuted}
                  >
                    {i === 0 ? 'swap out' : 'swap in'}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 14. 전체 흐름 13단계
// ────────────────────────────────────────────────────────────────────────────
export function FullFlowSteps({ caption }: { caption?: string }) {
  const steps: Array<{ text: string; tone: BoxTone; mark?: string }> = [
    { text: '프로세스가 virtual address에 접근', tone: 'plain' },
    { text: '하드웨어가 VPN을 뽑고 TLB 확인', tone: 'accent' },
    { text: 'TLB miss → page table에서 PTE 읽기', tone: 'accent' },
    { text: 'PTE.Valid == 0 → segmentation fault', tone: 'problem' },
    { text: 'protection bit 불일치 → protection fault', tone: 'problem' },
    { text: 'PTE.Present == 1 → TLB에 넣고 재실행', tone: 'solution' },
    { text: 'PTE.Present == 0 → page fault 발생', tone: 'limitation', mark: '②' },
    { text: 'kernel mode trap → page fault handler', tone: 'accent' },
    { text: '운영체제: free physical frame 탐색', tone: 'accent' },
    { text: 'free frame 없으면 victim page를 disk로 evict', tone: 'limitation' },
    { text: 'disk에서 page 읽어와 physical frame에 저장', tone: 'limitation', mark: '④' },
    { text: 'PTE.Present = 1', tone: 'solution', mark: '⑤' },
    { text: 'PTE.PFN = 새 PFN', tone: 'solution' },
    { text: 'fault 났던 instruction 재실행', tone: 'solution', mark: '⑥' },
  ];

  const W = 720;
  const padX = 12;
  const boxW = 580;
  const startX = (W - boxW) / 2;
  const boxH = 34;
  const gap = 6;
  const startY = 14;

  return (
    <Diagram caption={caption}>
      <svg
        className={s.svg}
        viewBox={`0 0 ${W} ${startY + steps.length * (boxH + gap) + 10}`}
        role="img"
        aria-label="14-step swapping flow"
      >
        <ArrowDefs />
        {steps.map((st, i) => {
          const y = startY + i * (boxH + gap);
          return (
            <g key={i}>
              <BoxBg x={startX} y={y} w={boxW} h={boxH} tone={st.tone} />
              <text
                x={startX + padX}
                y={y + boxH / 2 + 4}
                fontSize={12}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={toneTextColor(st.tone)}
              >
                {String(i + 1).padStart(2, '0')}.
              </text>
              <text
                x={startX + padX + 32}
                y={y + boxH / 2 + 4}
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fill={vars.color.text}
              >
                {st.text}
              </text>
              {st.mark && (
                <text
                  x={startX + boxW - padX}
                  y={y + boxH / 2 + 4}
                  textAnchor="end"
                  fontSize={12}
                  fontFamily={vars.font.mono}
                  fontWeight={700}
                  fill={toneTextColor(st.tone)}
                >
                  {st.mark}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 14. Page fault 판단 주체 — Hardware vs OS
// ────────────────────────────────────────────────────────────────────────────
export function FaultDecisionLevels({ caption }: { caption?: string }) {
  const W = 720;
  const boxW = 560;
  const startX = (W - boxW) / 2;
  const padX = 16;

  const levels: Array<{ title: string; sub: string; tone: BoxTone }> = [
    {
      title: 'MMU / Hardware',
      sub: '"이 page가 지금 DRAM에 없다" 까지만 판단 → PAGE_FAULT 발생',
      tone: 'accent',
    },
    {
      title: 'OS page fault handler',
      sub: '"이 page를 어디서 가져올까?" → swap / 실행 파일 / mmap / zero-fill 결정',
      tone: 'solution',
    },
  ];

  const boxH = 64;
  const gap = 26;
  const startY = 12;
  const H = startY + levels.length * boxH + (levels.length - 1) * gap + 10;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Hardware vs OS decision levels on page fault">
        <ArrowDefs />
        {levels.map((lv, i) => {
          const y = startY + i * (boxH + gap);
          return (
            <g key={i}>
              <BoxBg x={startX} y={y} w={boxW} h={boxH} tone={lv.tone} />
              <text
                x={startX + padX}
                y={y + 26}
                fontSize={14}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(lv.tone)}
              >
                {lv.title}
              </text>
              <text
                x={startX + padX}
                y={y + 48}
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fill={vars.color.text}
              >
                {lv.sub}
              </text>
              {i < levels.length - 1 && (
                <Arrow
                  x1={startX + boxW / 2}
                  y1={y + boxH + 1}
                  x2={startX + boxW / 2}
                  y2={y + boxH + gap - 1}
                  label="page fault"
                />
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 15. present = 0 이후 backing store 분기
// ────────────────────────────────────────────────────────────────────────────
export function BackingStoreBranch({ caption }: { caption?: string }) {
  const W = 720;

  const topW = 320;
  const topX = (W - topW) / 2;
  const topY = 12;
  const topH = 46;

  const caseTop = topY + topH + 50;
  const colW = 218;
  const colGap = 12;
  const colStartX = (W - (3 * colW + 2 * colGap)) / 2;

  const cases: Array<{ title: string; tone: BoxTone; lines: string[] }> = [
    {
      title: 'Anonymous + swap-out',
      tone: 'limitation',
      lines: ['heap / stack 등', '예전에 DRAM에 있었음', '→ swap space에서 read'],
    },
    {
      title: 'File-backed 미로드',
      tone: 'accent',
      lines: ['code / lib / mmap', '아직 한 번도 안 올림', '→ 원본 파일에서 read'],
    },
    {
      title: '새 anonymous page',
      tone: 'solution',
      lines: ['malloc 후 첫 접근', 'disk read 없음', '→ zero-fill page 생성'],
    },
  ];

  const lineH = 18;
  const caseH = 30 + Math.max(...cases.map((c) => c.lines.length)) * lineH + 12;
  const H = caseTop + caseH + 12;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Backing store decision after page fault">
        <ArrowDefs />
        <Box x={topX} y={topY} w={topW} h={topH} tone="problem" label="present = 0 → page fault" bold />

        {cases.map((c, i) => {
          const x = colStartX + i * (colW + colGap);
          // 트리거 박스 → 각 case 로 향하는 화살표
          return (
            <g key={c.title}>
              <Arrow
                x1={topX + topW / 2}
                y1={topY + topH + 1}
                x2={x + colW / 2}
                y2={caseTop - 1}
              />
              <BoxBg x={x} y={caseTop} w={colW} h={caseH} tone={c.tone} />
              <text
                x={x + colW / 2}
                y={caseTop + 20}
                textAnchor="middle"
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(c.tone)}
              >
                {c.title}
              </text>
              {c.lines.map((ln, j) => (
                <text
                  key={j}
                  x={x + 12}
                  y={caseTop + 38 + j * lineH + 4}
                  fontSize={11.5}
                  fontFamily={vars.font.sans}
                  fill={vars.color.text}
                >
                  • {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Primitive helpers (file-scope)
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
    case 'plain':
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
    case 'plain':
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
    case 'plain':
    default:
      return vars.color.text;
  }
}

function BoxBg({
  x,
  y,
  w,
  h,
  tone,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={6}
      ry={6}
      fill={toneBg(tone)}
      stroke={toneStroke(tone)}
      strokeWidth={1.2}
    />
  );
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

function BoxWithLabels({
  x,
  y,
  w,
  h,
  tone,
  top,
  mid,
  bot,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  top: string;
  mid: string;
  bot?: string;
}) {
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text
        x={x + w / 2}
        y={y + 18}
        textAnchor="middle"
        fontSize={11}
        fontFamily={vars.font.mono}
        fontWeight={700}
        fill={toneTextColor(tone)}
      >
        {top}
      </text>
      <text
        x={x + w / 2}
        y={y + 40}
        textAnchor="middle"
        fontSize={13}
        fontFamily={vars.font.sans}
        fontWeight={600}
        fill={vars.color.text}
      >
        {mid}
      </text>
      {bot && (
        <text
          x={x + w / 2}
          y={y + 60}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.mono}
          fill={vars.color.textMuted}
        >
          {bot}
        </text>
      )}
    </g>
  );
}

function SectionLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={12}
      fontFamily={vars.font.sans}
      fontWeight={700}
      letterSpacing="0.05em"
      fill={vars.color.textMuted}
    >
      {text}
    </text>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="arrow-default"
        viewBox="0 0 10 10"
        refX={8}
        refY={5}
        markerWidth={6}
        markerHeight={6}
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.evoArrow} />
      </marker>
      <marker
        id="arrow-problem"
        viewBox="0 0 10 10"
        refX={8}
        refY={5}
        markerWidth={6}
        markerHeight={6}
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.problem} />
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
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={vars.color.evoArrow}
        strokeWidth={1.2}
        markerEnd="url(#arrow-default)"
      />
      {label && (
        <text
          x={midX}
          y={midY - 4}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fontStyle="italic"
          fill={vars.color.textMuted}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/**
 * 단순한 위→아래 step flow. 박스 + 아래 화살표가 반복된다.
 */
function StepFlow({
  steps,
  caption,
  numbered,
}: {
  steps: Array<{ text: string; tone: BoxTone; bold?: boolean }>;
  caption?: string;
  numbered?: boolean;
}) {
  const W = 720;
  const boxW = 540;
  const boxH = 44;
  const gap = 10;
  const startX = (W - boxW) / 2;
  const startY = 14;
  const H = startY + steps.length * (boxH + gap) + 6;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Step flow">
        <ArrowDefs />
        {steps.map((st, i) => {
          const y = startY + i * (boxH + gap);
          return (
            <g key={i}>
              <BoxBg x={startX} y={y} w={boxW} h={boxH} tone={st.tone} />
              {numbered && (
                <text
                  x={startX + 14}
                  y={y + boxH / 2 + 4}
                  fontSize={13}
                  fontFamily={vars.font.mono}
                  fontWeight={700}
                  fill={toneTextColor(st.tone)}
                >
                  {i + 1}.
                </text>
              )}
              <text
                x={numbered ? startX + 40 : startX + boxW / 2}
                y={y + boxH / 2 + 4}
                textAnchor={numbered ? 'start' : 'middle'}
                fontSize={13}
                fontFamily={vars.font.sans}
                fontWeight={st.bold ? 700 : 500}
                fill={toneTextColor(st.tone)}
              >
                {st.text}
              </text>
              {i < steps.length - 1 && (
                <Arrow
                  x1={startX + boxW / 2}
                  y1={y + boxH + 1}
                  x2={startX + boxW / 2}
                  y2={y + boxH + gap - 1}
                />
              )}
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}
