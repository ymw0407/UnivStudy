import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch18Diagrams.css';

/**
 * 18장 후반의 "Thread 존재 시점의 Virtual Memory 구조 — Linux 구현 관점"
 * 섹션에서 사용하는 SVG 다이어그램들.
 *
 * 톤 규칙은 Ch15/Ch16 와 동일.
 * - viewBox + vars.color 토큰만 사용
 * - 색 코드: accent(=공유) / problem(=per-thread) — OSTEP/리눅스 관례에 맞춰
 *   "shared = 청록(여기서는 accent 파랑)", "per-thread = 산호(여기서는 problem 주황)"
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. x86-64 Linux 가상 주소 공간 (멀티스레드)
// ════════════════════════════════════════════════════════════════════════════
export function VmThreadLayoutLinux({ caption }: { caption?: string }) {
  const W = 820;
  const H = 620;

  // 좌측 주소공간 박스
  const boxX = 40;
  const boxW = 360;
  const boxTop = 30;
  const boxBottom = H - 30;
  const boxH = boxBottom - boxTop;

  // 세그먼트 정의 (위→아래 = 높은 주소 → 낮은 주소)
  const segs: Array<{ label: string; sub?: string; tone: BoxTone; hRel: number }> = [
    { label: 'Kernel Space', sub: 'shared (page table·VFS·…)', tone: 'accent', hRel: 0.14 },
    { label: 'Stack (main)', sub: '↓ grows down · ~8MB', tone: 'problem', hRel: 0.10 },
    { label: '(free)', tone: 'muted', hRel: 0.07 },
    { label: 'Shared Libraries', sub: 'libc.so · ld.so · …', tone: 'accent', hRel: 0.07 },
    { label: 'guard page', tone: 'limitation', hRel: 0.025 },
    { label: 'Thread 2 stack (mmap)', sub: '↓ grows down · ~8MB', tone: 'problem', hRel: 0.07 },
    { label: 'guard page', tone: 'limitation', hRel: 0.025 },
    { label: 'Thread 3 stack (mmap)', sub: '↓ grows down · ~8MB', tone: 'problem', hRel: 0.07 },
    { label: 'TLS (per-thread)', sub: 'fs reg → 이 영역', tone: 'problem', hRel: 0.045 },
    { label: '(free)', tone: 'muted', hRel: 0.08 },
    { label: 'Heap', sub: '↑ malloc · brk/mmap', tone: 'accent', hRel: 0.08 },
    { label: 'BSS · Data', sub: 'globals · static', tone: 'accent', hRel: 0.05 },
    { label: 'Text (code)', sub: 'r-x · 공유 가능', tone: 'accent', hRel: 0.04 },
  ];
  const sum = segs.reduce((a, b) => a + b.hRel, 0);

  let y = boxTop;
  const rendered: Array<{ label: string; sub?: string; tone: BoxTone; y: number; h: number }> = [];
  for (const seg of segs) {
    const segH = (seg.hRel / sum) * boxH;
    rendered.push({ ...seg, y, h: segH });
    y += segH;
  }

  // 우측 주소·주석
  const noteX = boxX + boxW + 30;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="x86-64 Linux virtual address space with multiple threads">
        <ArrowDefs />

        {/* 좌측 외곽선 */}
        <rect x={boxX} y={boxTop} width={boxW} height={boxH} fill={vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.4} rx={4} />

        {/* 세그먼트 */}
        {rendered.map((seg, i) => (
          <g key={i}>
            <rect
              x={boxX + 1}
              y={seg.y}
              width={boxW - 2}
              height={seg.h}
              fill={toneBg(seg.tone)}
              opacity={seg.tone === 'limitation' ? 0.5 : 1}
            />
            <line
              x1={boxX + 1}
              x2={boxX + boxW - 1}
              y1={seg.y + seg.h}
              y2={seg.y + seg.h}
              stroke={vars.color.border}
              strokeWidth={i === rendered.length - 1 ? 0 : 1}
              strokeDasharray={seg.tone === 'muted' ? '3 4' : undefined}
            />
            <text
              x={boxX + 14}
              y={seg.y + seg.h / 2 + 4}
              fontSize={12.5}
              fontFamily={vars.font.sans}
              fontWeight={seg.tone === 'muted' ? 400 : 700}
              fontStyle={seg.tone === 'muted' || seg.label === 'guard page' ? 'italic' : 'normal'}
              fill={toneTextColor(seg.tone)}
            >
              {seg.label}
            </text>
            {seg.sub && (
              <text
                x={boxX + boxW - 14}
                y={seg.y + seg.h / 2 + 4}
                textAnchor="end"
                fontSize={11}
                fontFamily={vars.font.mono}
                fill={vars.color.textMuted}
              >
                {seg.sub}
              </text>
            )}
          </g>
        ))}

        {/* 주소 라벨 (위·아래) */}
        <text x={boxX - 8} y={boxTop + 4} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          높은 주소
        </text>
        <text x={boxX - 8} y={boxTop + 18} textAnchor="end" fontSize={10.5} fontFamily={vars.font.mono} fill={vars.color.textFaint}>
          0xFFFF…
        </text>
        <text x={boxX - 8} y={boxBottom + 2} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          0x0
        </text>
        <text x={boxX - 8} y={boxBottom - 12} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          낮은 주소
        </text>

        {/* 우측 범례 */}
        <g>
          <Tag x={noteX} y={boxTop + 12} text="범례" tone="plain" bold size={13} />
          <rect x={noteX} y={boxTop + 22} width={14} height={14} fill={toneBg('accent')} stroke={toneStroke('accent')} />
          <Txt x={noteX + 22} y={boxTop + 34} text="공유 (shared) — 모든 thread 공통" muted={false} size={12} />
          <rect x={noteX} y={boxTop + 44} width={14} height={14} fill={toneBg('problem')} stroke={toneStroke('problem')} />
          <Txt x={noteX + 22} y={boxTop + 56} text="per-thread — 스레드마다 따로" muted={false} size={12} />
          <rect x={noteX} y={boxTop + 66} width={14} height={14} fill={toneBg('limitation')} stroke={toneStroke('limitation')} opacity={0.5} />
          <Txt x={noteX + 22} y={boxTop + 78} text="guard page (PROT_NONE)" muted={false} size={12} />
        </g>

        {/* 우측 메모 박스 */}
        <g>
          {[
            { y: boxTop + 110, t: 'pthread_create() 가 mmap 으로', t2: '추가 스레드 스택을 할당' },
            { y: boxTop + 175, t: 'ASLR — text/heap/mmap/stack 모두', t2: '실행 때마다 base 가 무작위' },
            { y: boxTop + 240, t: 'TLS 는 `__thread`/`thread_local`', t2: 'x86-64 는 fs 레지스터가 가리킴' },
            { y: boxTop + 305, t: '실제 매핑 확인:', t2: 'cat /proc/<pid>/maps' },
          ].map((m, i) => (
            <g key={i}>
              <BoxBg x={noteX} y={m.y} w={310} h={50} tone="plain" />
              <text x={noteX + 12} y={m.y + 20} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.heading}>
                {m.t}
              </text>
              <text x={noteX + 12} y={m.y + 38} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                {m.t2}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Linux task_struct — per-thread 와 shared substructures
// ════════════════════════════════════════════════════════════════════════════
export function TaskStructSharing({ caption }: { caption?: string }) {
  const W = 820;
  const H = 480;

  // 상단: 3개의 task_struct (per-thread)
  const taskW = 200;
  const taskH = 150;
  const taskGap = 30;
  const tasksTotal = taskW * 3 + taskGap * 2;
  const tasksStartX = (W - tasksTotal) / 2;
  const tasksY = 24;

  // 하단: 공유 substructures
  const subY = tasksY + taskH + 90;
  const subW = 150;
  const subH = 70;
  const subs = ['mm_struct', 'files_struct', 'fs_struct', 'signal_struct', 'sighand_struct'];
  const subGap = (W - subW * subs.length) / (subs.length + 1);

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Linux task_struct sharing substructures across threads">
        <ArrowDefs />

        {/* Thread group title */}
        <text x={W / 2} y={tasksY - 4} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          Thread Group (= 하나의 process, 같은 TGID)
        </text>

        {/* per-thread task_struct boxes */}
        {[0, 1, 2].map((i) => {
          const x = tasksStartX + i * (taskW + taskGap);
          return (
            <g key={i}>
              <BoxBg x={x} y={tasksY} w={taskW} h={taskH} tone="problem" />
              <text x={x + taskW / 2} y={tasksY + 22} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('problem')}>
                task_struct
              </text>
              <text x={x + taskW / 2} y={tasksY + 38} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                (thread {i + 1})
              </text>
              {[
                'PID (kernel) · TGID',
                'thread_struct (regs/FPU)',
                'kernel stack ptr',
                'sched state · prio',
                'pending signals',
              ].map((line, j) => (
                <text
                  key={j}
                  x={x + 14}
                  y={tasksY + 60 + j * 16}
                  fontSize={10.5}
                  fontFamily={vars.font.mono}
                  fill={vars.color.text}
                >
                  • {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* shared substructures */}
        <text x={W / 2} y={subY - 10} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.textMuted}>
          shared substructures — 같은 thread group 의 task_struct 가 포인터로 공유
        </text>
        {subs.map((name, i) => {
          const x = subGap + i * (subW + subGap);
          const labels: Record<string, string> = {
            'mm_struct': '주소 공간(=PCB의 "주소 공간")',
            'files_struct': 'FD 테이블',
            'fs_struct': 'cwd · root',
            'signal_struct': '시그널 핸들러',
            'sighand_struct': '핸들러 등록 상태',
          };
          return (
            <g key={name}>
              <BoxBg x={x} y={subY} w={subW} h={subH} tone="accent" />
              <text x={x + subW / 2} y={subY + 26} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('accent')}>
                {name}
              </text>
              <text x={x + subW / 2} y={subY + 48} textAnchor="middle" fontSize={10.5} fontFamily={vars.font.sans} fill={vars.color.textMuted}>
                {labels[name]}
              </text>
            </g>
          );
        })}

        {/* 화살표: 모든 task_struct → 모든 shared sub (간단화: 가운데 task에서 fan-out) */}
        {[0, 1, 2].map((i) => {
          const fromX = tasksStartX + i * (taskW + taskGap) + taskW / 2;
          const fromY = tasksY + taskH + 1;
          return subs.map((_, j) => {
            const toX = subGap + j * (subW + subGap) + subW / 2;
            const toY = subY - 1;
            return (
              <line
                key={`${i}-${j}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={vars.color.border}
                strokeWidth={0.8}
                opacity={0.55}
              />
            );
          });
        })}

        {/* 하단 메모 */}
        <text x={W / 2} y={H - 16} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          clone(CLONE_VM | CLONE_FILES | CLONE_FS | CLONE_SIGHAND | CLONE_THREAD) — 복사 대신 ref-count 증가로 공유
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. User-mode stack frame zoom (x86-64 System V ABI)
// ════════════════════════════════════════════════════════════════════════════
export function StackFrameZoom({ caption }: { caption?: string }) {
  const W = 820;
  const H = 540;

  // 좌측: 프레임 (높은 주소 위, 낮은 주소 아래)
  const frameX = 80;
  const frameW = 280;
  const frameTop = 30;
  const frameBottom = H - 60;
  const frameH = frameBottom - frameTop;

  // 슬롯
  const slots: Array<{ label: string; sub?: string; tone: BoxTone; weight: number; italic?: boolean }> = [
    { label: '… caller frame …', tone: 'muted', weight: 1.0, italic: true },
    { label: 'arg 7 ~ (있다면)', sub: '7번째 인자부터 stack', tone: 'problem', weight: 0.7 },
    { label: 'return address', sub: 'call 이 push', tone: 'problem', weight: 0.7 },
    { label: 'saved RBP (caller)', sub: '프롤로그 push %rbp', tone: 'problem', weight: 0.7 },
    { label: 'local variables', sub: 'int x, char buf[64], …', tone: 'problem', weight: 1.5 },
    { label: 'temporaries / spill', sub: '컴파일러가 더 쓰면', tone: 'problem', weight: 0.6 },
    { label: '(unused stack — 미래 호출용)', tone: 'muted', weight: 1.4, italic: true },
    { label: 'guard page (PROT_NONE)', sub: 'overflow → SIGSEGV', tone: 'limitation', weight: 0.6 },
  ];
  const sum = slots.reduce((a, b) => a + b.weight, 0);

  // RBP / RSP 가 가리킬 위치 (각각 saved RBP 슬롯의 윗단, locals 마지막 끝)
  let yCur = frameTop;
  const positions: Array<{ y: number; h: number }> = [];
  for (const sl of slots) {
    const h = (sl.weight / sum) * frameH;
    positions.push({ y: yCur, h });
    yCur += h;
  }
  // saved RBP slot is index 3; RBP points at its top
  const rbpY = positions[3].y;
  // locals last is index 5 (temporaries) bottom; RSP at its bottom
  const rspY = positions[5].y + positions[5].h;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Single user-mode stack frame zoom (x86-64)">
        <ArrowDefs />

        {/* 외곽 */}
        <rect x={frameX} y={frameTop} width={frameW} height={frameH} fill={vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.4} rx={4} />

        {/* 슬롯 */}
        {slots.map((sl, i) => {
          const { y, h } = positions[i];
          return (
            <g key={i}>
              <rect
                x={frameX + 1}
                y={y}
                width={frameW - 2}
                height={h}
                fill={toneBg(sl.tone)}
                opacity={sl.tone === 'muted' ? 0.7 : 1}
              />
              <line
                x1={frameX + 1}
                x2={frameX + frameW - 1}
                y1={y + h}
                y2={y + h}
                stroke={vars.color.border}
                strokeWidth={i === slots.length - 1 ? 0 : 1}
                strokeDasharray={sl.tone === 'muted' ? '3 4' : undefined}
              />
              <text
                x={frameX + 14}
                y={y + h / 2 + 4}
                fontSize={12.5}
                fontFamily={vars.font.sans}
                fontWeight={sl.tone === 'muted' ? 400 : 700}
                fontStyle={sl.italic ? 'italic' : 'normal'}
                fill={toneTextColor(sl.tone)}
              >
                {sl.label}
              </text>
              {sl.sub && (
                <text
                  x={frameX + frameW - 14}
                  y={y + h / 2 + 4}
                  textAnchor="end"
                  fontSize={10.5}
                  fontFamily={vars.font.mono}
                  fill={vars.color.textMuted}
                >
                  {sl.sub}
                </text>
              )}
            </g>
          );
        })}

        {/* 주소 라벨 */}
        <text x={frameX - 8} y={frameTop + 12} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          높은 주소
        </text>
        <text x={frameX - 8} y={frameBottom + 2} textAnchor="end" fontSize={11} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
          낮은 주소
        </text>

        {/* RBP / RSP 표시 */}
        <Pointer x={frameX + frameW + 10} y={rbpY} label="RBP" tone="accent" />
        <Pointer x={frameX + frameW + 10} y={rspY} label="RSP" tone="accent" />

        {/* 우측 메모 */}
        <g>
          <Tag x={frameX + frameW + 140} y={50} text="x86-64 System V ABI 한 프레임" tone="plain" bold size={13} />
          {[
            'call 명령이 자동으로 return addr 푸시',
            '프롤로그: push %rbp; mov %rsp, %rbp',
            '에필로그: leave; ret',
            '6개까지 인자는 레지스터로 (rdi/rsi/rdx/rcx/r8/r9)',
            '7번째 인자부터 stack 으로 푸시',
            '스택은 ↓로 자란다 (낮은 주소 방향)',
            'overflow 시 guard page 가 SIGSEGV',
          ].map((t, i) => (
            <text
              key={i}
              x={frameX + frameW + 140}
              y={80 + i * 22}
              fontSize={12}
              fontFamily={vars.font.sans}
              fill={vars.color.text}
            >
              • {t}
            </text>
          ))}
        </g>

        {/* 하단 화살표 — 자라는 방향 */}
        <text x={frameX + frameW / 2} y={H - 32} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          ↓ 새 함수 호출 시 이 방향으로 프레임 추가
        </text>
      </svg>
    </Diagram>
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

function Tag({ x, y, text, tone, bold, size = 12 }: { x: number; y: number; text: string; tone: BoxTone; bold?: boolean; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={vars.font.sans} fontWeight={bold ? 700 : 500} fill={toneTextColor(tone)}>
      {text}
    </text>
  );
}

function Txt({ x, y, text, muted, size = 12.5 }: { x: number; y: number; text: string; muted?: boolean; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={vars.font.sans} fill={muted ? vars.color.textMuted : vars.color.text}>
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
    </defs>
  );
}
