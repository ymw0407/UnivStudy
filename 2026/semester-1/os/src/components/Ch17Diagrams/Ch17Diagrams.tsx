import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch17Diagrams.css';

/**
 * 17장(Threads & Concurrency) 본문에서 사용하는 SVG 다이어그램 모음.
 *
 * Ch15Diagrams와 동일한 규칙:
 * - viewBox 기반 → 폭에 맞춰 자연 축소
 * - 색은 theme.css의 vars.color 토큰만 사용 (라이트/다크 대응)
 * - 박스/화살표 primitive는 파일 하단에 모아둠
 */

// ────────────────────────────────────────────────────────────────────────────
// 1. CPU virtualization timeline — A → switch → B → switch → A
// ────────────────────────────────────────────────────────────────────────────
export function CpuVirtTimeline({ caption }: { caption?: string }) {
  const W = 720;
  const H = 170;
  const trackY = 70;
  const trackH = 50;
  const segs = [
    { x: 30, w: 170, label: 'Process A', tone: 'accent' as BoxTone },
    { x: 230, w: 170, label: 'Process B', tone: 'limitation' as BoxTone },
    { x: 430, w: 170, label: 'Process A', tone: 'accent' as BoxTone },
  ];
  const interruptXs = [210, 410, 610];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="CPU virtualization timeline">
        <ArrowDefs />

        {/* time axis */}
        <line x1={20} x2={W - 20} y1={trackY + trackH + 30} y2={trackY + trackH + 30} stroke={vars.color.border} strokeWidth={1} />
        <text x={20} y={trackY + trackH + 48} fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          time →
        </text>

        {/* segments */}
        {segs.map((seg, i) => (
          <g key={i}>
            <BoxBg x={seg.x} y={trackY} w={seg.w} h={trackH} tone={seg.tone} />
            <text
              x={seg.x + seg.w / 2}
              y={trackY + trackH / 2 + 5}
              textAnchor="middle"
              fontSize={14}
              fontFamily={vars.font.sans}
              fontWeight={700}
              fill={toneTextColor(seg.tone)}
            >
              {seg.label} 실행
            </text>
          </g>
        ))}

        {/* interrupt markers between segments */}
        {interruptXs.slice(0, 2).map((x, i) => (
          <g key={i}>
            <line x1={x} y1={trackY - 8} x2={x} y2={trackY + trackH + 8} stroke={vars.color.problem} strokeWidth={1.4} strokeDasharray="3 3" />
            <text x={x} y={trackY - 14} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.problem}>
              ⚡ timer interrupt
            </text>
            <text x={x} y={trackY + trackH + 22} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
              context switch
            </text>
          </g>
        ))}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. Thread anatomy — process가 공유하는 부분 + thread별 전용 상태
// ────────────────────────────────────────────────────────────────────────────
export function ThreadAnatomy({ caption }: { caption?: string }) {
  const W = 720;
  const H = 340;
  const outerX = 30;
  const outerY = 30;
  const outerW = W - 60;
  const outerH = H - 50;

  // shared region
  const sharedY = outerY + 36;
  const sharedH = 110;
  const sharedW = outerW - 40;
  const sharedX = outerX + 20;
  const sharedCells = [
    { label: 'code' },
    { label: 'data' },
    { label: 'heap' },
    { label: 'FD table' },
    { label: 'address space' },
  ];
  const cellW = (sharedW - 10 * (sharedCells.length - 1)) / sharedCells.length;

  // per-thread region
  const threadsY = sharedY + sharedH + 30;
  const threadW = (sharedW - 20) / 3;
  const threadFields = ['PC', 'SP', 'registers', 'stack'];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Thread anatomy inside a process">
        <ArrowDefs />

        {/* outer process box */}
        <BoxBg x={outerX} y={outerY} w={outerW} h={outerH} tone="muted" />
        <text x={outerX + 16} y={outerY + 22} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          Process
        </text>

        {/* shared region */}
        <BoxBg x={sharedX} y={sharedY} w={sharedW} h={sharedH} tone="accent" />
        <text x={sharedX + 12} y={sharedY + 20} fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          공유 (모든 thread가 같이 사용)
        </text>
        {sharedCells.map((c, i) => (
          <g key={i}>
            <BoxBg
              x={sharedX + 14 + i * (cellW + 10)}
              y={sharedY + 36}
              w={cellW}
              h={56}
              tone="plain"
            />
            <text
              x={sharedX + 14 + i * (cellW + 10) + cellW / 2}
              y={sharedY + 36 + 34}
              textAnchor="middle"
              fontSize={12.5}
              fontFamily={vars.font.mono}
              fontWeight={600}
              fill={vars.color.text}
            >
              {c.label}
            </text>
          </g>
        ))}

        {/* per-thread cards */}
        {[0, 1, 2].map((ti) => {
          const tx = sharedX + 10 + ti * (threadW + 10);
          const ty = threadsY;
          const th = 110;
          const tone: BoxTone = ti === 0 ? 'solution' : ti === 1 ? 'limitation' : 'problem';
          return (
            <g key={ti}>
              <BoxBg x={tx} y={ty} w={threadW} h={th} tone={tone} />
              <text
                x={tx + threadW / 2}
                y={ty + 18}
                textAnchor="middle"
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(tone)}
              >
                Thread {ti + 1} 전용
              </text>
              {threadFields.map((f, fi) => (
                <text
                  key={f}
                  x={tx + threadW / 2}
                  y={ty + 38 + fi * 16}
                  textAnchor="middle"
                  fontSize={11.5}
                  fontFamily={vars.font.mono}
                  fill={vars.color.text}
                >
                  {f}
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
// 2-b. Thread memory map — user mode + kernel mode 양쪽에서 무엇이
//      shared / per-thread 인지 한 장에 보여주는 종합 도식.
// ────────────────────────────────────────────────────────────────────────────
export function ThreadMemoryMap({ caption }: { caption?: string }) {
  const W = 760;
  const H = 760;

  const outerX = 20;
  const outerY = 30;
  const outerW = W - 40;
  const outerH = H - 50;

  // ── User mode section ──
  const userY = 60;
  const userH = 290;
  const userInnerX = outerX + 20;
  const userInnerW = outerW - 40;

  // user-mode shared band
  const uSharedY = userY + 30;
  const uSharedH = 100;
  const uSharedCells = [
    { label: 'code', sub: 'instructions' },
    { label: 'data', sub: 'global / static' },
    { label: 'heap', sub: 'malloc()' },
    { label: 'libs', sub: 'shared libs' },
  ];
  const uCellW = (userInnerW - 20 - 10 * (uSharedCells.length - 1)) / uSharedCells.length;

  // user-mode per-thread cards
  const uThreadsY = uSharedY + uSharedH + 38;
  const uThreadH = 88;
  const uThreadColW = (userInnerW - 20 - 20 * 2) / 3;

  // ── Trap zone ──
  const trapY = userY + userH + 6;
  const trapH = 60;

  // ── Kernel mode section ──
  const kerY = trapY + trapH + 6;
  const kerH = H - kerY - 30;
  const kerInnerX = userInnerX;
  const kerInnerW = userInnerW;

  // kernel shared (PCB + page table)
  const kSharedY = kerY + 30;
  const kSharedH = 96;
  // kernel per-thread cards (TCB + kernel stack stacked vertically)
  const kThreadsY = kSharedY + kSharedH + 38;
  const kTcbH = 86;
  const kStackH = 54;
  const kThreadColW = uThreadColW;

  const threadTones: BoxTone[] = ['solution', 'limitation', 'problem'];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Thread memory map across user and kernel mode">
        <ArrowDefs />

        {/* outer process box */}
        <BoxBg x={outerX} y={outerY} w={outerW} h={outerH} tone="muted" />
        <text x={outerX + 14} y={outerY + 20} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          Process — 하나의 address space
        </text>

        {/* ====================== USER MODE ====================== */}
        <BoxBg x={userInnerX} y={userY} w={userInnerW} h={userH} tone="plain" />
        <text x={userInnerX + 12} y={userY + 20} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          User Mode (user space)
        </text>

        {/* user-mode SHARED band */}
        <BoxBg x={userInnerX + 10} y={uSharedY} w={userInnerW - 20} h={uSharedH} tone="accent" />
        <text x={userInnerX + 22} y={uSharedY + 18} fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          🟦 SHARED — 모든 thread가 같은 메모리를 그대로 본다
        </text>
        {uSharedCells.map((c, i) => (
          <g key={c.label}>
            <BoxBg
              x={userInnerX + 22 + i * (uCellW + 10)}
              y={uSharedY + 32}
              w={uCellW}
              h={uSharedH - 42}
              tone="plain"
            />
            <text
              x={userInnerX + 22 + i * (uCellW + 10) + uCellW / 2}
              y={uSharedY + 32 + 26}
              textAnchor="middle"
              fontSize={13.5}
              fontFamily={vars.font.mono}
              fontWeight={700}
              fill={vars.color.text}
            >
              {c.label}
            </text>
            <text
              x={userInnerX + 22 + i * (uCellW + 10) + uCellW / 2}
              y={uSharedY + 32 + 46}
              textAnchor="middle"
              fontSize={11}
              fontFamily={vars.font.sans}
              fill={vars.color.textMuted}
            >
              {c.sub}
            </text>
          </g>
        ))}

        {/* user-mode PER-THREAD label */}
        <text
          x={userInnerX + 22}
          y={uSharedY + uSharedH + 24}
          fontSize={11.5}
          fontFamily={vars.font.sans}
          fontWeight={700}
          fill={vars.color.problem}
        >
          🟧 PER-THREAD — thread마다 따로
        </text>

        {/* user stacks */}
        {[0, 1, 2].map((i) => {
          const x = userInnerX + 22 + i * (kThreadColW + 20);
          return (
            <g key={i}>
              <BoxBg x={x} y={uThreadsY} w={kThreadColW} h={uThreadH} tone={threadTones[i]} />
              <text x={x + kThreadColW / 2} y={uThreadsY + 22} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(threadTones[i])}>
                Thread {i + 1}
              </text>
              <text x={x + kThreadColW / 2} y={uThreadsY + 44} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.text}>
                user stack
              </text>
              <text x={x + kThreadColW / 2} y={uThreadsY + 62} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                local var · return addr
              </text>
              <text x={x + kThreadColW / 2} y={uThreadsY + 78} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                + 실행 중이라면 CPU register
              </text>
            </g>
          );
        })}

        {/* ====================== TRAP ZONE ====================== */}
        <line x1={userInnerX} y1={trapY + trapH / 2} x2={userInnerX + userInnerW} y2={trapY + trapH / 2} stroke={vars.color.border} strokeDasharray="5 5" />
        {/* down arrow: user → kernel */}
        <line
          x1={W / 2 - 70}
          y1={trapY + 4}
          x2={W / 2 - 70}
          y2={trapY + trapH - 4}
          stroke={vars.color.problem}
          strokeWidth={1.6}
          markerEnd="url(#ch17-arrow-problem)"
        />
        <text x={W / 2 - 56} y={trapY + 22} fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          trap (syscall · timer · page fault)
        </text>
        <text x={W / 2 - 56} y={trapY + 38} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          → 현재 register를 자신의 kernel stack(또는 TCB)에 저장
        </text>
        {/* up arrow: kernel → user (return) */}
        <line
          x1={W / 2 + 110}
          y1={trapY + trapH - 4}
          x2={W / 2 + 110}
          y2={trapY + 4}
          stroke={vars.color.solution}
          strokeWidth={1.6}
          markerEnd="url(#ch17-arrow-solution)"
        />
        <text x={W / 2 + 124} y={trapY + 22} fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          return
        </text>
        <text x={W / 2 + 124} y={trapY + 38} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          저장된 register 복원 → user mode 재개
        </text>

        {/* ====================== KERNEL MODE ====================== */}
        <BoxBg x={kerInnerX} y={kerY} w={kerInnerW} h={kerH} tone="plain" />
        <text x={kerInnerX + 12} y={kerY + 20} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          Kernel Mode (kernel space)
        </text>

        {/* kernel SHARED — PCB */}
        <BoxBg x={kerInnerX + 10} y={kSharedY} w={kerInnerW - 20} h={kSharedH} tone="accent" />
        <text x={kerInnerX + 22} y={kSharedY + 18} fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          🟦 SHARED — 이 process의 모든 thread가 같이 본다
        </text>
        {/* PCB box */}
        <BoxBg x={kerInnerX + 22} y={kSharedY + 30} w={(kerInnerW - 50) * 0.55} h={kSharedH - 40} tone="plain" />
        <text x={kerInnerX + 32} y={kSharedY + 30 + 18} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.text}>
          PCB (Process Control Block)
        </text>
        {['PID', 'address space', 'page table base register', 'file descriptor table', 'signal info'].map((it, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <text
              key={it}
              x={kerInnerX + 36 + col * 180}
              y={kSharedY + 30 + 36 + row * 14}
              fontSize={10.5}
              fontFamily={vars.font.mono}
              fill={vars.color.textMuted}
            >
              · {it}
            </text>
          );
        })}
        {/* Page table & TLB box */}
        <BoxBg x={kerInnerX + 22 + (kerInnerW - 50) * 0.55 + 10} y={kSharedY + 30} w={(kerInnerW - 50) * 0.45 - 4} h={kSharedH - 40} tone="plain" />
        <text x={kerInnerX + 22 + (kerInnerW - 50) * 0.55 + 22} y={kSharedY + 30 + 18} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.text}>
          Page Table · TLB
        </text>
        <text x={kerInnerX + 22 + (kerInnerW - 50) * 0.55 + 22} y={kSharedY + 30 + 36} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          같은 address space →
        </text>
        <text x={kerInnerX + 22 + (kerInnerW - 50) * 0.55 + 22} y={kSharedY + 30 + 50} fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          page table도 공유
        </text>

        {/* kernel PER-THREAD label */}
        <text
          x={kerInnerX + 22}
          y={kSharedY + kSharedH + 24}
          fontSize={11.5}
          fontFamily={vars.font.sans}
          fontWeight={700}
          fill={vars.color.problem}
        >
          🟧 PER-THREAD — thread마다 TCB와 kernel stack이 따로
        </text>

        {/* per-thread kernel cards */}
        {[0, 1, 2].map((i) => {
          const x = kerInnerX + 22 + i * (kThreadColW + 20);
          const ty = kThreadsY;
          return (
            <g key={i}>
              {/* TCB */}
              <BoxBg x={x} y={ty} w={kThreadColW} h={kTcbH} tone={threadTones[i]} />
              <text x={x + kThreadColW / 2} y={ty + 18} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(threadTones[i])}>
                Thread {i + 1} — TCB
              </text>
              {['TID', 'PC', 'SP', 'saved registers', 'thread state'].map((f, fi) => (
                <text
                  key={f}
                  x={x + 12}
                  y={ty + 36 + fi * 11}
                  fontSize={10}
                  fontFamily={vars.font.mono}
                  fill={vars.color.text}
                >
                  · {f}
                </text>
              ))}

              {/* kernel stack */}
              <BoxBg x={x} y={ty + kTcbH + 8} w={kThreadColW} h={kStackH} tone={threadTones[i]} />
              <text x={x + kThreadColW / 2} y={ty + kTcbH + 8 + 22} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(threadTones[i])}>
                kernel stack
              </text>
              <text x={x + kThreadColW / 2} y={ty + kTcbH + 8 + 40} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                kernel mode 진입 시 사용
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2-c. Address space layout — 가상 주소 공간의 위쪽엔 kernel space,
//      그 아래에 stack 1/2/3 가 흩어져 있고, 맨 아래는 code/data/heap.
//      thread들이 어디에 자리잡고 있는지를 "주소 공간 그림"으로 보여준다.
// ────────────────────────────────────────────────────────────────────────────
export function AddressSpaceLayout({ caption }: { caption?: string }) {
  const W = 760;
  const H = 660;

  // 왼쪽 컬럼 = 가상 주소 공간 그림
  const colX = 60;
  const colW = 300;

  // 위에서부터: kernel → stack1 → free → stack2 → free → stack3 → free → heap↑ → data → code → 0
  const rows: Array<{
    h: number;
    label: string;
    sub?: string;
    tone: BoxTone;
    addrLabel?: string;
    isFree?: boolean;
    isHeap?: boolean;
    italic?: boolean;
  }> = [
    { h: 150, label: 'Kernel Space', sub: '(kernel mode에서만 접근 가능)', tone: 'muted', addrLabel: '0xFFFF…' },
    { h: 42, label: 'Stack 1', sub: '(Thread 1 user stack)', tone: 'solution', addrLabel: 'high' },
    { h: 28, label: '(free)', tone: 'plain', isFree: true },
    { h: 42, label: 'Stack 2', sub: '(Thread 2 user stack)', tone: 'limitation' },
    { h: 28, label: '(free)', tone: 'plain', isFree: true },
    { h: 42, label: 'Stack 3', sub: '(Thread 3 user stack)', tone: 'problem' },
    { h: 36, label: '(free) — 모든 stack은 위→아래로 자람 ↓', tone: 'plain', isFree: true, italic: true },
    { h: 56, label: 'Heap', sub: 'malloc, dynamic data ↑ (위로 자람)', tone: 'accent', isHeap: true },
    { h: 28, label: 'Data', sub: 'global / static', tone: 'accent' },
    { h: 28, label: 'Code', sub: 'instructions', tone: 'accent', addrLabel: '0x0000' },
  ];

  const startY = 60;
  let cursorY = startY;
  const rowsWithPos = rows.map((r) => {
    const y = cursorY;
    cursorY += r.h;
    return { ...r, y };
  });
  const totalEndY = cursorY;

  // 오른쪽 설명 영역
  const annoX = 410;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Address space layout with 3 threads and kernel space">
        <ArrowDefs />

        {/* 컬럼 헤더 */}
        <text x={colX + colW / 2} y={36} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          한 process의 가상 주소 공간
        </text>
        <text x={colX + colW / 2} y={52} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          (위쪽 = high address, 아래쪽 = 0x0000)
        </text>

        {/* address 축 */}
        <line x1={colX - 14} y1={startY} x2={colX - 14} y2={totalEndY} stroke={vars.color.border} strokeWidth={1} />

        {/* 각 row 그리기 */}
        {rowsWithPos.map((r, i) => {
          // kernel space 내부에는 PCB / TCB / kernel stack 박스를 따로 그린다.
          if (r.label === 'Kernel Space') {
            return (
              <g key={i}>
                <BoxBg x={colX} y={r.y} w={colW} h={r.h} tone="muted" />
                <text x={colX + 12} y={r.y + 18} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
                  Kernel Space
                </text>
                <text x={colX + 12} y={r.y + 34} fontSize={10} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                  (모든 process가 같은 kernel 영역을 봄)
                </text>

                {/* PCB */}
                <BoxBg x={colX + 12} y={r.y + 44} w={colW - 24} h={26} tone="accent" />
                <text x={colX + colW / 2} y={r.y + 44 + 18} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.accent}>
                  PCB (이 process 1개)
                </text>

                {/* TCB row × 3 */}
                {[0, 1, 2].map((ti) => {
                  const tone: BoxTone = ti === 0 ? 'solution' : ti === 1 ? 'limitation' : 'problem';
                  const tcbW = (colW - 24 - 8 * 2) / 3;
                  const tx = colX + 12 + ti * (tcbW + 8);
                  return (
                    <g key={`tcb-${ti}`}>
                      <BoxBg x={tx} y={r.y + 76} w={tcbW} h={20} tone={tone} />
                      <text x={tx + tcbW / 2} y={r.y + 76 + 14} textAnchor="middle" fontSize={10} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
                        TCB {ti + 1}
                      </text>
                    </g>
                  );
                })}

                {/* kernel stack row × 3 */}
                {[0, 1, 2].map((ti) => {
                  const tone: BoxTone = ti === 0 ? 'solution' : ti === 1 ? 'limitation' : 'problem';
                  const tcbW = (colW - 24 - 8 * 2) / 3;
                  const tx = colX + 12 + ti * (tcbW + 8);
                  return (
                    <g key={`kstk-${ti}`}>
                      <BoxBg x={tx} y={r.y + 100} w={tcbW} h={20} tone={tone} />
                      <text x={tx + tcbW / 2} y={r.y + 100 + 14} textAnchor="middle" fontSize={10} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(tone)}>
                        kstack {ti + 1}
                      </text>
                    </g>
                  );
                })}

                {/* addr label on left */}
                <text x={colX - 20} y={r.y + 14} textAnchor="end" fontSize={10} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                  0xFFFF…
                </text>
                <text x={colX - 20} y={r.y + r.h - 4} textAnchor="end" fontSize={10} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                  kernel base
                </text>
              </g>
            );
          }

          // 일반 row
          return (
            <g key={i}>
              <BoxBg x={colX} y={r.y} w={colW} h={r.h} tone={r.tone} />
              <text
                x={colX + 14}
                y={r.y + r.h / 2 + (r.sub ? -2 : 4)}
                fontSize={12.5}
                fontFamily={vars.font.mono}
                fontWeight={r.isFree ? 400 : 700}
                fontStyle={r.italic ? 'italic' : 'normal'}
                fill={r.isFree ? vars.color.textMuted : toneTextColor(r.tone)}
              >
                {r.label}
              </text>
              {r.sub && (
                <text
                  x={colX + 14}
                  y={r.y + r.h / 2 + 14}
                  fontSize={10.5}
                  fontFamily={vars.font.sans}
                  fontStyle="italic"
                  fill={vars.color.textMuted}
                >
                  {r.sub}
                </text>
              )}
              {/* heap growth arrow */}
              {r.isHeap && (
                <line
                  x1={colX + colW - 22}
                  y1={r.y + r.h - 8}
                  x2={colX + colW - 22}
                  y2={r.y + 8}
                  stroke={vars.color.accent}
                  strokeWidth={1.4}
                  markerEnd="url(#ch17-arrow-default)"
                />
              )}
              {r.addrLabel && (
                <text x={colX - 20} y={r.y + 12} textAnchor="end" fontSize={10} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                  {r.addrLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* 0x0000 마크 */}
        <text x={colX - 20} y={totalEndY + 12} textAnchor="end" fontSize={10} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.textMuted}>
          0x0000
        </text>

        {/* ── 오른쪽 설명 ── */}
        {/* 큰 묶음 1: User vs Kernel */}
        <text x={annoX} y={62} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ① User space (하단부) vs Kernel space (상단부)
        </text>
        <text x={annoX} y={80} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · 한 가상 주소 공간 안에서 위쪽은 kernel만 접근 가능.
        </text>
        <text x={annoX} y={96} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · 같은 process의 모든 thread는 이 그림 한 장을 공유한다.
        </text>

        {/* 묶음 2: thread stacks */}
        <text x={annoX} y={140} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ② Thread별 user stack은 별도 위치에 박힘
        </text>
        <text x={annoX} y={158} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · Stack 1·2·3 사이 (free) 공백은 서로 침범하지 않도록
        </text>
        <text x={annoX} y={172} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          &nbsp;&nbsp;guard page를 두는 흔적.
        </text>
        <text x={annoX} y={188} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · 같은 thread의 user stack ↔ kernel stack은 짝꿍.
        </text>

        {/* 묶음 3: shared regions */}
        <text x={annoX} y={232} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ③ code · data · heap 은 한 덩어리, 모두가 공유
        </text>
        <text x={annoX} y={250} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · global 변수, malloc된 데이터를 thread끼리
        </text>
        <text x={annoX} y={264} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          &nbsp;&nbsp;직접 읽고 쓸 수 있는 이유.
        </text>
        <text x={annoX} y={280} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · race condition이 발생하는 영역도 바로 여기.
        </text>

        {/* 묶음 4: kernel-space breakdown */}
        <text x={annoX} y={324} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ④ Kernel space 안쪽 (이 process 몫)
        </text>
        <text x={annoX} y={342} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · PCB 1개 — process 단위 정보 (PID, page table base,
        </text>
        <text x={annoX} y={356} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          &nbsp;&nbsp;FD table, signals …)
        </text>
        <text x={annoX} y={372} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · TCB / kstack은 thread 수만큼 — 같은 색끼리 묶임.
        </text>
        <text x={annoX} y={388} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          · trap 발생 시 해당 thread의 kstack 위에서 실행 시작.
        </text>

        {/* 묶음 5: 색 범례 */}
        <text x={annoX} y={432} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          ⑤ 색이 같으면 같은 thread의 것
        </text>
        <g transform={`translate(${annoX}, 450)`}>
          <rect x={0} y={0} width={14} height={14} rx={3} fill={toneBg('solution')} stroke={toneStroke('solution')} />
          <text x={22} y={11} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.text}>
            Thread 1 — Stack 1 / TCB 1 / kstack 1
          </text>
        </g>
        <g transform={`translate(${annoX}, 472)`}>
          <rect x={0} y={0} width={14} height={14} rx={3} fill={toneBg('limitation')} stroke={toneStroke('limitation')} />
          <text x={22} y={11} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.text}>
            Thread 2 — Stack 2 / TCB 2 / kstack 2
          </text>
        </g>
        <g transform={`translate(${annoX}, 494)`}>
          <rect x={0} y={0} width={14} height={14} rx={3} fill={toneBg('problem')} stroke={toneStroke('problem')} />
          <text x={22} y={11} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.text}>
            Thread 3 — Stack 3 / TCB 3 / kstack 3
          </text>
        </g>
        <g transform={`translate(${annoX}, 516)`}>
          <rect x={0} y={0} width={14} height={14} rx={3} fill={toneBg('accent')} stroke={toneStroke('accent')} />
          <text x={22} y={11} fontSize={11} fontFamily={vars.font.sans} fill={vars.color.text}>
            모두 공유 — code / data / heap / PCB
          </text>
        </g>
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3. Multicore parallelism — single vs multi-thread on multi-core
// ────────────────────────────────────────────────────────────────────────────
export function MulticoreParallelism({ caption }: { caption?: string }) {
  const W = 720;
  const H = 220;
  const coreW = 180;
  const coreH = 70;
  const cores = ['Core 1', 'Core 2', 'Core 3'];

  // single-threaded row
  const singleY = 40;
  const singleStartX = (W - 3 * coreW - 2 * 20) / 2;
  // multi-threaded row
  const multiY = 140;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Multicore parallelism comparison">
        <ArrowDefs />

        {/* single-threaded row */}
        <text x={20} y={singleY - 8} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          Single-thread
        </text>
        {cores.map((c, i) => {
          const x = singleStartX + i * (coreW + 20);
          const isActive = i === 0;
          return (
            <g key={i}>
              <BoxBg x={x} y={singleY} w={coreW} h={coreH} tone={isActive ? 'accent' : 'muted'} />
              <text
                x={x + coreW / 2}
                y={singleY + 26}
                textAnchor="middle"
                fontSize={12}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={isActive ? vars.color.accent : vars.color.textMuted}
              >
                {c}
              </text>
              <text
                x={x + coreW / 2}
                y={singleY + 50}
                textAnchor="middle"
                fontSize={13}
                fontFamily={vars.font.sans}
                fontWeight={600}
                fill={isActive ? vars.color.accent : vars.color.textFaint}
              >
                {isActive ? 'Thread' : 'idle'}
              </text>
            </g>
          );
        })}

        {/* multi-threaded row */}
        <text x={20} y={multiY - 8} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          Multi-thread (parallelism)
        </text>
        {cores.map((c, i) => {
          const x = singleStartX + i * (coreW + 20);
          const labels = ['Thread A', 'Thread B', 'Thread C'];
          const tones: BoxTone[] = ['solution', 'limitation', 'problem'];
          return (
            <g key={i}>
              <BoxBg x={x} y={multiY} w={coreW} h={coreH} tone={tones[i]} />
              <text
                x={x + coreW / 2}
                y={multiY + 26}
                textAnchor="middle"
                fontSize={12}
                fontFamily={vars.font.mono}
                fontWeight={700}
                fill={toneTextColor(tones[i])}
              >
                {c}
              </text>
              <text
                x={x + coreW / 2}
                y={multiY + 50}
                textAnchor="middle"
                fontSize={13}
                fontFamily={vars.font.sans}
                fontWeight={700}
                fill={toneTextColor(tones[i])}
              >
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 4. I/O overlap timeline — blocking vs overlap
// ────────────────────────────────────────────────────────────────────────────
export function IOOverlapTimeline({ caption }: { caption?: string }) {
  const W = 720;
  const H = 230;
  const trackH = 36;

  // single-thread track
  const singleY = 50;
  const singleSegs = [
    { x: 100, w: 130, label: 'Compute', tone: 'accent' as BoxTone },
    { x: 230, w: 230, label: 'I/O wait (blocked)', tone: 'problem' as BoxTone },
    { x: 460, w: 130, label: 'Compute', tone: 'accent' as BoxTone },
  ];

  // multi-thread tracks
  const tAY = 130;
  const tBY = 170;
  const tASegs = [
    { x: 100, w: 360, label: 'Thread A: I/O', tone: 'problem' as BoxTone },
  ];
  const tBSegs = [
    { x: 100, w: 360, label: 'Thread B: Compute (계속 진행)', tone: 'solution' as BoxTone },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="I/O overlap timeline">
        <ArrowDefs />

        {/* single thread row */}
        <text x={20} y={singleY + 22} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          single
        </text>
        {singleSegs.map((seg, i) => (
          <g key={i}>
            <BoxBg x={seg.x} y={singleY} w={seg.w} h={trackH} tone={seg.tone} />
            <text
              x={seg.x + seg.w / 2}
              y={singleY + trackH / 2 + 4.5}
              textAnchor="middle"
              fontSize={12}
              fontFamily={vars.font.sans}
              fontWeight={600}
              fill={toneTextColor(seg.tone)}
            >
              {seg.label}
            </text>
          </g>
        ))}

        {/* divider */}
        <line x1={20} x2={W - 20} y1={singleY + trackH + 24} y2={singleY + trackH + 24} stroke={vars.color.border} strokeDasharray="4 6" />

        {/* multi thread rows */}
        <text x={20} y={tAY + 22} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          multi
        </text>
        {tASegs.map((seg, i) => (
          <g key={`a${i}`}>
            <BoxBg x={seg.x} y={tAY} w={seg.w} h={trackH} tone={seg.tone} />
            <text x={seg.x + seg.w / 2} y={tAY + trackH / 2 + 4.5} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={600} fill={toneTextColor(seg.tone)}>
              {seg.label}
            </text>
          </g>
        ))}
        {tBSegs.map((seg, i) => (
          <g key={`b${i}`}>
            <BoxBg x={seg.x} y={tBY} w={seg.w} h={trackH} tone={seg.tone} />
            <text x={seg.x + seg.w / 2} y={tBY + trackH / 2 + 4.5} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={600} fill={toneTextColor(seg.tone)}>
              {seg.label}
            </text>
          </g>
        ))}

        {/* time axis */}
        <line x1={20} x2={W - 20} y1={H - 20} y2={H - 20} stroke={vars.color.border} />
        <text x={20} y={H - 4} fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          time →
        </text>
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 5. IPC vs Thread data sharing — process는 IPC 필요, thread는 heap 공유
// ────────────────────────────────────────────────────────────────────────────
export function IpcVsThreadSharing({ caption }: { caption?: string }) {
  const W = 720;
  const H = 240;
  const colW = 320;
  const leftX = 30;
  const rightX = W - 30 - colW;
  const procH = 130;
  const procY = 50;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="IPC vs thread data sharing">
        <ArrowDefs />

        {/* LEFT: process IPC */}
        <text x={leftX + colW / 2} y={30} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          Process — IPC 필요
        </text>
        {/* Process A box */}
        <BoxBg x={leftX} y={procY} w={130} h={procH} tone="accent" />
        <text x={leftX + 65} y={procY + 24} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Process A
        </text>
        <text x={leftX + 65} y={procY + 56} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own heap
        </text>
        <text x={leftX + 65} y={procY + 74} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own stack
        </text>
        <text x={leftX + 65} y={procY + 92} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own AS
        </text>
        {/* Process B box */}
        <BoxBg x={leftX + colW - 130} y={procY} w={130} h={procH} tone="limitation" />
        <text x={leftX + colW - 65} y={procY + 24} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.limitation}>
          Process B
        </text>
        <text x={leftX + colW - 65} y={procY + 56} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own heap
        </text>
        <text x={leftX + colW - 65} y={procY + 74} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own stack
        </text>
        <text x={leftX + colW - 65} y={procY + 92} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          own AS
        </text>
        {/* IPC arrow */}
        <line
          x1={leftX + 130 + 4}
          y1={procY + procH / 2}
          x2={leftX + colW - 130 - 4}
          y2={procY + procH / 2}
          stroke={vars.color.problem}
          strokeWidth={1.4}
          markerEnd="url(#ch17-arrow-problem)"
          markerStart="url(#ch17-arrow-problem)"
        />
        <text
          x={leftX + colW / 2}
          y={procY + procH / 2 - 6}
          textAnchor="middle"
          fontSize={11}
          fontFamily={vars.font.sans}
          fontStyle="italic"
          fontWeight={600}
          fill={vars.color.problem}
        >
          pipe / socket / shm
        </text>
        <text
          x={leftX + colW / 2}
          y={procY + procH / 2 + 14}
          textAnchor="middle"
          fontSize={10}
          fontFamily={vars.font.sans}
          fill={vars.color.textMuted}
        >
          (느리고 복잡)
        </text>

        {/* RIGHT: thread shared heap */}
        <text x={rightX + colW / 2} y={30} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Thread — heap 직접 공유
        </text>
        {/* outer process */}
        <BoxBg x={rightX} y={procY} w={colW} h={procH} tone="muted" />
        <text x={rightX + 10} y={procY + 16} fontSize={10.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          Process
        </text>
        {/* shared heap in the middle */}
        <BoxBg x={rightX + colW / 2 - 50} y={procY + 32} w={100} h={50} tone="solution" />
        <text x={rightX + colW / 2} y={procY + 62} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          shared heap
        </text>
        {/* Thread A */}
        <BoxBg x={rightX + 14} y={procY + 92} w={82} h={28} tone="accent" />
        <text x={rightX + 14 + 41} y={procY + 110} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread A
        </text>
        {/* Thread B */}
        <BoxBg x={rightX + colW - 14 - 82} y={procY + 92} w={82} h={28} tone="limitation" />
        <text x={rightX + colW - 14 - 41} y={procY + 110} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.limitation}>
          Thread B
        </text>
        {/* arrows from threads to shared heap */}
        <line x1={rightX + 14 + 41} y1={procY + 92 - 2} x2={rightX + colW / 2 - 30} y2={procY + 80} stroke={vars.color.solution} strokeWidth={1.2} markerEnd="url(#ch17-arrow-solution)" />
        <line x1={rightX + colW - 14 - 41} y1={procY + 92 - 2} x2={rightX + colW / 2 + 30} y2={procY + 80} stroke={vars.color.solution} strokeWidth={1.2} markerEnd="url(#ch17-arrow-solution)" />
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 6. Race condition timeline — 두 스레드의 interleaving + counter 변화 추적
// ────────────────────────────────────────────────────────────────────────────
export function RaceConditionTimeline({ caption }: { caption?: string }) {
  const W = 720;
  const rowH = 28;
  // [op, owner ('T1' | 'T2' | '--'), counter_after, comment?]
  const rows: Array<{
    op: string;
    owner: 'T1' | 'T2' | '--';
    reg: string;
    counter: string;
    note?: string;
    danger?: boolean;
  }> = [
    { op: 'start',                              owner: '--', reg: '—',  counter: '50' },
    { op: 'mov counter, %eax',                  owner: 'T1', reg: '50', counter: '50' },
    { op: 'add $1, %eax',                       owner: 'T1', reg: '51', counter: '50' },
    { op: '⚡ context switch',                  owner: '--', reg: '—',  counter: '50', note: 'T1 state saved' },
    { op: 'mov counter, %eax',                  owner: 'T2', reg: '50', counter: '50' },
    { op: 'add $1, %eax',                       owner: 'T2', reg: '51', counter: '50' },
    { op: 'mov %eax, counter',                  owner: 'T2', reg: '51', counter: '51' },
    { op: '⚡ context switch',                  owner: '--', reg: '—',  counter: '51', note: 'restore T1' },
    { op: 'mov %eax, counter (T1의 51 덮어씀)', owner: 'T1', reg: '51', counter: '51', danger: true },
  ];

  const H = 60 + rows.length * rowH + 30;
  const startY = 60;
  const colT1X = 80;
  const colT2X = 320;
  const colT1W = 220;
  const colT2W = 220;
  const colRegX = 560;
  const colCntX = 640;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Race condition timeline">
        <ArrowDefs />

        {/* header */}
        <text x={colT1X + colT1W / 2} y={36} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread 1
        </text>
        <text x={colT2X + colT2W / 2} y={36} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.limitation}>
          Thread 2
        </text>
        <text x={colRegX} y={36} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.textMuted}>
          %eax
        </text>
        <text x={colCntX} y={36} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.textMuted}>
          counter
        </text>
        <line x1={50} x2={W - 20} y1={44} y2={44} stroke={vars.color.border} />

        {rows.map((r, i) => {
          const y = startY + i * rowH;
          const isSwitch = r.owner === '--';
          const tone: BoxTone = r.danger ? 'problem' : r.owner === 'T1' ? 'accent' : r.owner === 'T2' ? 'limitation' : 'muted';
          const colX = r.owner === 'T1' ? colT1X : r.owner === 'T2' ? colT2X : (colT1X + colT2X + colT2W) / 2 - 130;
          const colW = isSwitch ? 260 : r.owner === 'T1' ? colT1W : colT2W;

          return (
            <g key={i}>
              {/* row guide line */}
              {i > 0 && (
                <line x1={50} x2={W - 20} y1={y - 4} y2={y - 4} stroke={vars.color.border} strokeDasharray="2 4" opacity={0.5} />
              )}

              {/* op cell */}
              <BoxBg x={colX} y={y} w={colW} h={rowH - 6} tone={tone} />
              <text
                x={colX + 10}
                y={y + (rowH - 6) / 2 + 4}
                fontSize={11.5}
                fontFamily={vars.font.mono}
                fontWeight={r.danger ? 700 : 500}
                fill={toneTextColor(tone)}
              >
                {r.op}
              </text>

              {/* register & counter columns */}
              <text x={colRegX} y={y + (rowH - 6) / 2 + 4} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={600} fill={vars.color.text}>
                {r.reg}
              </text>
              <text x={colCntX} y={y + (rowH - 6) / 2 + 4} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fontWeight={r.danger ? 700 : 600} fill={r.danger ? vars.color.problem : vars.color.text}>
                {r.counter}
              </text>
            </g>
          );
        })}

        {/* final note */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          기대: counter = 52 → 실제: counter = 51 (T1이 마지막에 덮어씀)
        </text>
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 7. Lock / critical section — lock~unlock 사이가 atomic
// ────────────────────────────────────────────────────────────────────────────
export function LockCriticalSection({ caption }: { caption?: string }) {
  const W = 720;
  const H = 230;
  const boxX = 140;
  const boxW = 440;
  const lockY = 40;
  const lockH = 38;
  const csY = 95;
  const csH = 60;
  const unlockY = 175;
  const unlockH = 38;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Lock and critical section">
        <ArrowDefs />

        {/* lock */}
        <BoxBg x={boxX} y={lockY} w={boxW} h={lockH} tone="accent" />
        <text x={boxX + boxW / 2} y={lockY + lockH / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.accent}>
          lock(&mutex)
        </text>
        <text x={boxX - 12} y={lockY + lockH / 2 + 4} textAnchor="end" fontSize={11} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.textMuted}>
          잠금 획득
        </text>

        {/* critical section */}
        <BoxBg x={boxX} y={csY} w={boxW} h={csH} tone="problem" />
        <text x={boxX + boxW / 2} y={csY + 22} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          critical section
        </text>
        <text x={boxX + boxW / 2} y={csY + 44} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          balance = balance + 1
        </text>
        <text x={boxX + boxW + 12} y={csY + csH / 2 + 4} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          atomic처럼 실행
        </text>

        {/* unlock */}
        <BoxBg x={boxX} y={unlockY} w={boxW} h={unlockH} tone="solution" />
        <text x={boxX + boxW / 2} y={unlockY + unlockH / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          unlock(&mutex)
        </text>
        <text x={boxX - 12} y={unlockY + unlockH / 2 + 4} textAnchor="end" fontSize={11} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.textMuted}>
          잠금 해제
        </text>

        {/* connecting arrows */}
        <Arrow x1={boxX + boxW / 2} y1={lockY + lockH + 1} x2={boxX + boxW / 2} y2={csY - 1} />
        <Arrow x1={boxX + boxW / 2} y1={csY + csH + 1} x2={boxX + boxW / 2} y2={unlockY - 1} />
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 8. Deadlock cycle — 두 thread가 서로 lock을 들고 상대방의 lock을 기다림
// ────────────────────────────────────────────────────────────────────────────
export function DeadlockCycle({ caption }: { caption?: string }) {
  const W = 720;
  const H = 280;
  const threadW = 200;
  const threadH = 60;
  const lockW = 100;
  const lockH = 50;

  const tA = { x: 80, y: 50 };
  const tB = { x: W - 80 - threadW, y: H - 50 - threadH };
  const lX = { x: tB.x + threadW / 2 - lockW / 2, y: tA.y + 30 };
  const lY = { x: tA.x + threadW / 2 - lockW / 2, y: tB.y - 80 };

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Deadlock cycle">
        <ArrowDefs />

        {/* Thread A */}
        <BoxBg x={tA.x} y={tA.y} w={threadW} h={threadH} tone="accent" />
        <text x={tA.x + threadW / 2} y={tA.y + 24} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.accent}>
          Thread A
        </text>
        <text x={tA.x + threadW / 2} y={tA.y + 46} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          holds X / waits Y
        </text>

        {/* Thread B */}
        <BoxBg x={tB.x} y={tB.y} w={threadW} h={threadH} tone="limitation" />
        <text x={tB.x + threadW / 2} y={tB.y + 24} textAnchor="middle" fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.limitation}>
          Thread B
        </text>
        <text x={tB.x + threadW / 2} y={tB.y + 46} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.text}>
          holds Y / waits X
        </text>

        {/* Lock X */}
        <BoxBg x={lX.x} y={lX.y} w={lockW} h={lockH} tone="problem" />
        <text x={lX.x + lockW / 2} y={lX.y + lockH / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          Lock X
        </text>

        {/* Lock Y */}
        <BoxBg x={lY.x} y={lY.y} w={lockW} h={lockH} tone="problem" />
        <text x={lY.x + lockW / 2} y={lY.y + lockH / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          Lock Y
        </text>

        {/* A holds X */}
        <line x1={tA.x + threadW} y1={tA.y + threadH / 2} x2={lX.x} y2={lX.y + lockH / 2} stroke={vars.color.solution} strokeWidth={1.4} markerEnd="url(#ch17-arrow-solution)" />
        <text x={(tA.x + threadW + lX.x) / 2} y={(tA.y + threadH / 2 + lX.y + lockH / 2) / 2 - 6} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.solution}>
          holds
        </text>

        {/* B holds Y */}
        <line x1={tB.x} y1={tB.y + threadH / 2} x2={lY.x + lockW} y2={lY.y + lockH / 2} stroke={vars.color.solution} strokeWidth={1.4} markerEnd="url(#ch17-arrow-solution)" />
        <text x={(tB.x + lY.x + lockW) / 2} y={(tB.y + threadH / 2 + lY.y + lockH / 2) / 2 - 6} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.solution}>
          holds
        </text>

        {/* A waits Y (dashed) */}
        <line x1={tA.x + threadW / 2} y1={tA.y + threadH} x2={lY.x + lockW / 2} y2={lY.y} stroke={vars.color.problem} strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#ch17-arrow-problem)" />
        <text x={(tA.x + threadW / 2 + lY.x + lockW / 2) / 2 - 30} y={(tA.y + threadH + lY.y) / 2} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.problem}>
          waits
        </text>

        {/* B waits X (dashed) */}
        <line x1={tB.x + threadW / 2} y1={tB.y} x2={lX.x + lockW / 2} y2={lX.y + lockH} stroke={vars.color.problem} strokeWidth={1.4} strokeDasharray="5 4" markerEnd="url(#ch17-arrow-problem)" />
        <text x={(tB.x + threadW / 2 + lX.x + lockW / 2) / 2 + 30} y={(tB.y + lX.y + lockH) / 2} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fontWeight={600} fill={vars.color.problem}>
          waits
        </text>
      </svg>
    </Diagram>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 9. Thread switch vs Process switch — 무엇이 바뀌고 무엇이 그대로인가
// ────────────────────────────────────────────────────────────────────────────
export function ThreadVsProcessSwitchDiagram({ caption }: { caption?: string }) {
  const W = 720;
  const H = 280;
  const colW = 320;
  const leftX = 30;
  const rightX = W - 30 - colW;
  const rowH = 32;
  const items: Array<{ label: string; thread: 'change' | 'same'; process: 'change' | 'same' }> = [
    { label: 'User register → kernel stack', thread: 'change', process: 'change' },
    { label: 'Kernel SP 교체', thread: 'change', process: 'change' },
    { label: 'Page table base 교체', thread: 'same', process: 'change' },
    { label: 'FD table / ASID 교체', thread: 'same', process: 'change' },
    { label: 'TLB 영향', thread: 'same', process: 'change' },
  ];
  const headerY = 30;
  const tableY = headerY + 30;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Thread switch vs Process switch">
        <ArrowDefs />
        <text x={leftX + colW / 2} y={headerY} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Thread switch
        </text>
        <text x={rightX + colW / 2} y={headerY} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          Process switch
        </text>

        {items.map((it, i) => {
          const y = tableY + i * rowH;
          const renderCell = (which: 'thread' | 'process', cx: number) => {
            const v = which === 'thread' ? it.thread : it.process;
            const tone: BoxTone = v === 'change' ? (which === 'process' ? 'problem' : 'solution') : 'muted';
            const symbol = v === 'change' ? 'O' : 'X';
            const subText = v === 'change' ? '바뀜' : '그대로';
            return (
              <g>
                <BoxBg x={cx} y={y} w={colW} h={rowH - 6} tone={tone} />
                <text
                  x={cx + 12}
                  y={y + (rowH - 6) / 2 + 4}
                  fontSize={11.5}
                  fontFamily={vars.font.sans}
                  fill={toneTextColor(tone)}
                >
                  {it.label}
                </text>
                <text
                  x={cx + colW - 60}
                  y={y + (rowH - 6) / 2 + 4}
                  fontSize={12}
                  fontFamily={vars.font.mono}
                  fontWeight={700}
                  fill={toneTextColor(tone)}
                >
                  {symbol}
                </text>
                <text
                  x={cx + colW - 12}
                  y={y + (rowH - 6) / 2 + 4}
                  textAnchor="end"
                  fontSize={10.5}
                  fontFamily={vars.font.sans}
                  fontStyle="italic"
                  fill={toneTextColor(tone)}
                >
                  {subText}
                </text>
              </g>
            );
          };
          return (
            <g key={i}>
              {renderCell('thread', leftX)}
              {renderCell('process', rightX)}
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

function BoxBg({ x, y, w, h, tone }: { x: number; y: number; w: number; h: number; tone: BoxTone }) {
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

function ArrowDefs() {
  return (
    <defs>
      <marker id="ch17-arrow-default" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.evoArrow} />
      </marker>
      <marker id="ch17-arrow-problem" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.problem} />
      </marker>
      <marker id="ch17-arrow-solution" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
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
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#ch17-arrow-default)" />
      {label && (
        <text x={midX} y={midY - 4} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          {label}
        </text>
      )}
    </g>
  );
}
