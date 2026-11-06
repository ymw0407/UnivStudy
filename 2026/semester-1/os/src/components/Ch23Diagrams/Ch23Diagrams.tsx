import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch23Diagrams.css';

/**
 * 23장(Semaphore) SVG 다이어그램 모음.
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. 세마포어 값의 의미 — 양수/0/음수
// ════════════════════════════════════════════════════════════════════════════
export function SemValueMeaning({ caption }: { caption?: string }) {
  const W = 820;
  const H = 320;
  const cardW = 240;
  const gap = 30;
  const startX = (W - cardW * 3 - gap * 2) / 2;
  const y = 30;
  const cardH = 240;

  const cards = [
    {
      tone: 'solution' as BoxTone,
      title: 's > 0',
      head: '사용 가능한 자원',
      body: 's = 3 이면 3 개 남음',
      mark: '✓ sem_wait 즉시 통과',
    },
    {
      tone: 'accent' as BoxTone,
      title: 's == 0',
      head: '자원 모두 사용 중',
      body: '대기 thread 없음',
      mark: '· 다음 sem_wait 부터 sleep',
    },
    {
      tone: 'problem' as BoxTone,
      title: 's < 0',
      head: '대기열 존재',
      body: '|s| = 기다리는 thread 수',
      mark: '⚠ sem_post 가 하나 깨움',
    },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Semaphore value meaning">
        {cards.map((c, i) => {
          const x = startX + i * (cardW + gap);
          return (
            <g key={i}>
              <BoxBg x={x} y={y} w={cardW} h={cardH} tone={c.tone} />
              <text x={x + cardW / 2} y={y + 36} textAnchor="middle" fontSize={24} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(c.tone)}>
                {c.title}
              </text>
              <text x={x + cardW / 2} y={y + 80} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
                {c.head}
              </text>
              <text x={x + cardW / 2} y={y + 110} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fill={vars.color.textMuted}>
                {c.body}
              </text>
              <text x={x + cardW / 2} y={y + 180} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(c.tone)}>
                {c.mark}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. 4-thread 타임라인 — t1~t4 시나리오
// ════════════════════════════════════════════════════════════════════════════
export function SemTimeline4Threads({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const padX = 60;
  const padTop = 60;
  const colW = (W - padX * 2) / 5; // time + 4 threads
  const rowH = 36;

  const rows = [
    { t: 0, t1: '', t2: '', t3: '', t4: '', s: 0 },
    { t: 1, t1: 'sem_wait(s)', t2: '', t3: '', t4: '', s: -1 },
    { t: 2, t1: '', t2: 'sem_wait(s)', t3: '', t4: '', s: -2 },
    { t: 3, t1: '', t2: '', t3: 'sem_wait(s)', t4: '', s: -3 },
    { t: 4, t1: '', t2: '', t3: '', t4: 'sem_post(s)', s: -2 },
    { t: 5, t1: '', t2: '', t3: '', t4: '…', s: undefined as number | undefined },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="4-thread semaphore timeline">
        {/* header */}
        {['time', 't1', 't2', 't3', 't4', 'semaphore s'].map((h, i) => (
          <text key={i} x={padX + i * colW + 12} y={padTop - 8} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
            {h}
          </text>
        ))}
        {/* rows */}
        {rows.map((r, i) => {
          const y = padTop + i * rowH;
          return (
            <g key={i}>
              <line x1={padX} x2={W - padX} y1={y} y2={y} stroke={vars.color.border} strokeWidth={1} />
              <text x={padX + 12} y={y + 22} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
                {r.t}
              </text>
              {[r.t1, r.t2, r.t3, r.t4].map((cell, j) => (
                <text key={j} x={padX + (j + 1) * colW + 12} y={y + 22} fontSize={12} fontFamily={vars.font.mono} fontWeight={cell ? 700 : 400} fill={cell.includes('post') ? vars.color.solution : cell.includes('wait') ? vars.color.problem : vars.color.text}>
                  {cell}
                </text>
              ))}
              <text x={padX + 5 * colW + 12} y={y + 22} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={r.s !== undefined && r.s < 0 ? vars.color.problem : r.s === 0 ? vars.color.accent : vars.color.text}>
                {r.s !== undefined ? r.s : '…'}
              </text>
            </g>
          );
        })}
        {/* note */}
        <text x={W / 2} y={H - 30} textAnchor="middle" fontSize={12} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          음수 값 = 기다리는 thread 수 (절댓값). -2 이면 sleep 중인 thread 가 2 명.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Binary semaphore (init=1) 를 lock 처럼 쓰기 — 2-thread 트레이스
// ════════════════════════════════════════════════════════════════════════════
export function BinarySemaphoreAsLock({ caption }: { caption?: string }) {
  const W = 820;
  const H = 520;
  const padX = 30;
  const padTop = 50;
  const colW = (W - padX * 2) / 5; // s + T0act + T0st + T1act + T1st
  const rowH = 30;

  type Row = { s: number | string; a0: string; st0: string; a1: string; st1: string; tone?: BoxTone };
  const rows: Row[] = [
    { s: 1, a0: '-', st0: 'Running', a1: '-', st1: 'Ready' },
    { s: 1, a0: 'call sem_wait()', st0: 'Running', a1: '-', st1: 'Ready' },
    { s: 0, a0: 'sem_wait returns', st0: 'Running', a1: '-', st1: 'Ready', tone: 'solution' },
    { s: 0, a0: 'CS begin', st0: 'Running', a1: '-', st1: 'Ready' },
    { s: 0, a0: 'switch → T1', st0: 'Ready', a1: '-', st1: 'Running' },
    { s: 0, a0: '-', st0: 'Ready', a1: 'call sem_wait()', st1: 'Running' },
    { s: -1, a0: '-', st0: 'Ready', a1: 'decrement', st1: 'Running' },
    { s: -1, a0: '-', st0: 'Ready', a1: 's<0 → sleep', st1: 'Sleeping', tone: 'problem' },
    { s: -1, a0: 'switch → T0', st0: 'Running', a1: '-', st1: 'Sleeping' },
    { s: -1, a0: 'CS end', st0: 'Running', a1: '-', st1: 'Sleeping' },
    { s: -1, a0: 'call sem_post()', st0: 'Running', a1: '-', st1: 'Sleeping' },
    { s: 0, a0: 'increment', st0: 'Running', a1: '-', st1: 'Sleeping' },
    { s: 0, a0: 'wake T1', st0: 'Running', a1: '-', st1: 'Ready', tone: 'solution' },
    { s: 0, a0: 'sem_post returns', st0: 'Running', a1: '-', st1: 'Ready' },
    { s: 0, a0: 'switch → T1', st0: 'Ready', a1: '-', st1: 'Running' },
    { s: 0, a0: '-', st0: 'Ready', a1: 'sem_wait returns', st1: 'Running' },
    { s: 0, a0: '-', st0: 'Ready', a1: 'CS', st1: 'Running' },
    { s: 1, a0: '-', st0: 'Ready', a1: 'sem_post returns', st1: 'Running' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Binary semaphore as lock 2-thread trace">
        {/* header */}
        {['Sem', 'T0 동작', 'T0 상태', 'T1 동작', 'T1 상태'].map((h, i) => (
          <text key={i} x={padX + i * colW + 8} y={padTop - 8} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
            {h}
          </text>
        ))}
        {rows.map((r, i) => {
          const y = padTop + i * rowH;
          const bg = r.tone ? toneBg(r.tone) : i % 2 === 0 ? vars.color.surface : vars.color.surfaceAlt;
          return (
            <g key={i}>
              <rect x={padX} y={y} width={W - padX * 2} height={rowH} fill={bg} opacity={0.55} />
              <text x={padX + 8} y={y + 20} fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={typeof r.s === 'number' && r.s < 0 ? vars.color.problem : vars.color.text}>
                {r.s}
              </text>
              <text x={padX + colW + 8} y={y + 20} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
                {r.a0}
              </text>
              <text x={padX + 2 * colW + 8} y={y + 20} fontSize={11.5} fontFamily={vars.font.sans} fill={r.st0 === 'Sleeping' ? vars.color.problem : r.st0 === 'Running' ? vars.color.solution : vars.color.textMuted}>
                {r.st0}
              </text>
              <text x={padX + 3 * colW + 8} y={y + 20} fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
                {r.a1}
              </text>
              <text x={padX + 4 * colW + 8} y={y + 20} fontSize={11.5} fontFamily={vars.font.sans} fill={r.st1 === 'Sleeping' ? vars.color.problem : r.st1 === 'Running' ? vars.color.solution : vars.color.textMuted}>
                {r.st1}
              </text>
            </g>
          );
        })}
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Semaphore as CV — join 패턴 (init=0)
// ════════════════════════════════════════════════════════════════════════════
export function SemAsCondVar({ caption }: { caption?: string }) {
  const W = 820;
  const H = 340;
  const cardW = 320;
  const gap = 50;
  const startX = (W - cardW * 2 - gap) / 2;
  const y = 50;
  const cardH = 230;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Semaphore as condition variable for join pattern">
        <ArrowDefs />
        <BoxBg x={startX} y={y} w={cardW} h={cardH} tone="accent" />
        <text x={startX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          Parent
        </text>
        <text x={startX + 16} y={y + 54} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
          sem_init(&s, 0, 0);
        </text>
        <text x={startX + 16} y={y + 76} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          초기값 0 = 아직 발생한 사건 없음
        </text>
        <text x={startX + 16} y={y + 108} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
          pthread_create(child)
        </text>
        <text x={startX + 16} y={y + 138} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
          sem_wait(&s);
        </text>
        <text x={startX + 16} y={y + 158} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          → s 값을 -1 로 만들고 sleep
        </text>
        <text x={startX + 16} y={y + 196} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          (wake up) printf("parent: end")
        </text>

        <BoxBg x={startX + cardW + gap} y={y} w={cardW} h={cardH} tone="solution" />
        <text x={startX + cardW + gap + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Child
        </text>
        <text x={startX + cardW + gap + 16} y={y + 54} fontSize={12} fontFamily={vars.font.mono} fill={vars.color.text}>
          printf("child");
        </text>
        <text x={startX + cardW + gap + 16} y={y + 84} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.solution}>
          sem_post(&s);
        </text>
        <text x={startX + cardW + gap + 16} y={y + 104} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          → s 값을 +1 시키며 parent 깨움
        </text>
        <text x={startX + cardW + gap + 16} y={y + 156} fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.heading}>
          ✓ Child 가 먼저 끝나도 안전
        </text>
        <text x={startX + cardW + gap + 16} y={y + 178} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          post 가 값을 +1 로 남기므로,
        </text>
        <text x={startX + cardW + gap + 16} y={y + 196} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          parent 가 늦게 wait 해도 통과
        </text>

        {/* signal arrow */}
        <line x1={startX + cardW + gap} y1={y + 84} x2={startX + cardW + 6} y2={y + 138} stroke={vars.color.solution} strokeWidth={2} markerEnd="url(#arrow-solution)" strokeDasharray="5 4" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Producer/Consumer with empty/full/mutex semaphores
// ════════════════════════════════════════════════════════════════════════════
export function ProducerConsumerSem({ caption }: { caption?: string }) {
  const W = 820;
  const H = 380;

  const cardW = 200;
  const cardH = 280;
  const pX = 30;
  const cX = W - 30 - cardW;
  const y = 30;

  // middle: 3 semaphores
  const midX = (W - 260) / 2;
  const midY = 60;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Producer/Consumer with three semaphores">
        <ArrowDefs />

        {/* producer */}
        <BoxBg x={pX} y={y} w={cardW} h={cardH} tone="solution" />
        <text x={pX + 16} y={y + 24} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Producer
        </text>
        {[
          'sem_wait(&empty);',
          'sem_wait(&mutex);',
          'put(i);',
          'sem_post(&mutex);',
          'sem_post(&full);',
        ].map((line, i) => (
          <text key={i} x={pX + 18} y={y + 60 + i * 28} fontSize={12} fontFamily={vars.font.mono} fontWeight={line.includes('mutex') ? 600 : line.includes('put') ? 700 : 400} fill={line.includes('mutex') ? vars.color.problem : vars.color.text}>
            {line}
          </text>
        ))}

        {/* consumer */}
        <BoxBg x={cX} y={y} w={cardW} h={cardH} tone="solution" />
        <text x={cX + 16} y={y + 24} fontSize={13} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Consumer
        </text>
        {[
          'sem_wait(&full);',
          'sem_wait(&mutex);',
          'tmp = get();',
          'sem_post(&mutex);',
          'sem_post(&empty);',
        ].map((line, i) => (
          <text key={i} x={cX + 18} y={y + 60 + i * 28} fontSize={12} fontFamily={vars.font.mono} fontWeight={line.includes('mutex') ? 600 : line.includes('get') ? 700 : 400} fill={line.includes('mutex') ? vars.color.problem : vars.color.text}>
            {line}
          </text>
        ))}

        {/* middle 3 sems */}
        {[
          { label: 'empty', init: 'MAX', tone: 'accent' as BoxTone },
          { label: 'full', init: '0', tone: 'accent' as BoxTone },
          { label: 'mutex', init: '1', tone: 'problem' as BoxTone },
        ].map((sem, i) => {
          const cx = midX + 130;
          const ly = midY + i * 80;
          return (
            <g key={i}>
              <rect x={cx - 90} y={ly} width={180} height={60} rx={6} fill={toneBg(sem.tone)} stroke={toneStroke(sem.tone)} strokeWidth={1.4} />
              <text x={cx} y={ly + 24} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor(sem.tone)}>
                sem_t {sem.label}
              </text>
              <text x={cx} y={ly + 46} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.mono} fill={vars.color.text}>
                init = {sem.init}
              </text>
            </g>
          );
        })}

        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          empty = MAX 으로 시작 (모든 슬롯 비어 있음), full = 0 으로 시작, mutex = 1 (binary lock)
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Wrong mutex placement → deadlock
// ════════════════════════════════════════════════════════════════════════════
export function PCDeadlockMutexFirst({ caption }: { caption?: string }) {
  const W = 820;
  const H = 480;
  const padX = 40;
  const padTop = 60;
  const colW = (W - padX * 2 - 60) / 5; // time, P act, C act, mutex, empty, full
  const headerColW = 60;
  const rowH = 40;

  const rows = [
    { t: 0, p: 'sem_wait(&mutex);', c: '-', m: 0, e: 0, f: 0, note: 'P 가 mutex 먼저 잡음' },
    { t: 1, p: 'sem_wait(&empty);', c: '-', m: 0, e: -1, f: 0, note: 'empty 없어서 P sleep' },
    { t: 2, p: 'Sleeping', c: 'sem_wait(&mutex);', m: -1, e: -1, f: 0, note: 'C mutex 시도, 못 얻음' },
    { t: 3, p: 'Sleeping', c: 'Sleeping', m: -1, e: -1, f: 0, note: 'C 도 sleep' },
    { t: 4, p: 'Sleeping', c: 'Sleeping', m: -1, e: -1, f: 0, note: '⚠ DEADLOCK' },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Producer-consumer deadlock with mutex grabbed first">
        {/* title */}
        <text x={W / 2} y={28} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          ⚠ 잘못된 코드 — mutex 를 empty/full 보다 먼저 잡으면 deadlock
        </text>

        {/* headers */}
        {['t', 'Producer', 'Consumer', 'mutex', 'empty', 'full'].map((h, i) => (
          <text key={i} x={padX + (i === 0 ? 0 : headerColW + (i - 1) * colW) + 8} y={padTop - 8} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
            {h}
          </text>
        ))}

        {rows.map((r, i) => {
          const y = padTop + i * rowH;
          const dead = r.note.includes('DEADLOCK');
          return (
            <g key={i}>
              <rect x={padX} y={y} width={W - padX * 2} height={rowH} fill={dead ? toneBg('problem') : i % 2 === 0 ? vars.color.surface : vars.color.surfaceAlt} opacity={dead ? 0.5 : 0.4} />
              <text x={padX + 8} y={y + 18} fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.text}>
                {r.t}
              </text>
              <text x={padX + headerColW + 8} y={y + 18} fontSize={11.5} fontFamily={vars.font.mono} fill={r.p === 'Sleeping' ? vars.color.problem : vars.color.text}>
                {r.p}
              </text>
              <text x={padX + headerColW + colW + 8} y={y + 18} fontSize={11.5} fontFamily={vars.font.mono} fill={r.c === 'Sleeping' ? vars.color.problem : vars.color.text}>
                {r.c}
              </text>
              {[r.m, r.e, r.f].map((v, j) => (
                <text key={j} x={padX + headerColW + (2 + j) * colW + 8} y={y + 18} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={700} fill={v < 0 ? vars.color.problem : vars.color.text}>
                  {v}
                </text>
              ))}
              <text x={padX + 8} y={y + 34} fontSize={10.5} fontFamily={vars.font.sans} fontStyle="italic" fill={dead ? vars.color.problem : vars.color.textMuted}>
                {r.note}
              </text>
            </g>
          );
        })}

        {/* fix note */}
        <text x={W / 2} y={H - 30} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          → 해결: sem_wait(&empty) 또는 sem_wait(&full) 을 먼저, mutex 는 put/get 만 보호
        </text>
        <text x={W / 2} y={H - 12} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          "mutex 를 잡은 채 sleep 하지 않게" 가 핵심.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Reader-Writer Lock 구조
// ════════════════════════════════════════════════════════════════════════════
export function RWLockStructure({ caption }: { caption?: string }) {
  const W = 820;
  const H = 380;

  const boxW = 260;
  const boxH = 220;
  const padX = 30;
  const gap = (W - boxW * 3 - padX * 2) / 2;
  const y = 50;

  const cards = [
    {
      tone: 'accent' as BoxTone,
      title: 'lock (binary sem)',
      desc: 'readers 변수 보호',
      bullets: ['init = 1', '읽기/감소 직전·후만 잠깐 잡음'],
    },
    {
      tone: 'problem' as BoxTone,
      title: 'writelock (binary sem)',
      desc: 'reader OR writer 진입 제어',
      bullets: ['init = 1', '첫 reader 가 잡음', '마지막 reader 가 풀음', 'writer 는 통째로 잡음'],
    },
    {
      tone: 'solution' as BoxTone,
      title: 'readers (int)',
      desc: '현재 read 중인 thread 수',
      bullets: ['init = 0', '+1 / -1 은 lock 안에서만'],
    },
  ];

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Reader-Writer lock structure">
        {cards.map((c, i) => {
          const x = padX + i * (boxW + gap);
          return (
            <g key={i}>
              <BoxBg x={x} y={y} w={boxW} h={boxH} tone={c.tone} />
              <text x={x + boxW / 2} y={y + 28} textAnchor="middle" fontSize={13.5} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor(c.tone)}>
                {c.title}
              </text>
              <text x={x + boxW / 2} y={y + 52} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                {c.desc}
              </text>
              {c.bullets.map((b, j) => (
                <text key={j} x={x + 18} y={y + 90 + j * 24} fontSize={12} fontFamily={vars.font.sans} fill={vars.color.text}>
                  • {b}
                </text>
              ))}
            </g>
          );
        })}
        <text x={W / 2} y={H - 14} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          여러 reader 가 동시에 read 가능. writer 는 항상 혼자. 핵심 트릭: "첫 reader 만 writelock 을 잡고, 마지막 reader 가 푼다".
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Writer Starvation 시각화
// ════════════════════════════════════════════════════════════════════════════
export function WriterStarvation({ caption }: { caption?: string }) {
  const W = 820;
  const H = 360;
  const padX = 60;
  const trackY = 100;
  const trackH = 60;
  const trackW = W - padX * 2;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Writer starvation under continuous readers">
        <ArrowDefs />

        {/* timeline */}
        <line x1={padX} x2={padX + trackW} y1={trackY + trackH + 20} y2={trackY + trackH + 20} stroke={vars.color.borderStrong} strokeWidth={1.4} />
        <text x={padX + trackW + 10} y={trackY + trackH + 24} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          시간 →
        </text>

        {/* readers entering continuously */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = padX + 60 + i * 90;
          return (
            <g key={i}>
              <rect x={x} y={trackY} width={50} height={trackH} rx={4} fill={toneBg('solution')} stroke={toneStroke('solution')} strokeWidth={1.2} />
              <text x={x + 25} y={trackY + 22} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('solution')}>
                R{i + 1}
              </text>
              <text x={x + 25} y={trackY + 42} textAnchor="middle" fontSize={10} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
                read
              </text>
            </g>
          );
        })}

        {/* writer waiting */}
        <BoxBg x={padX + 200} y={50} w={120} h={36} tone="problem" />
        <text x={padX + 200 + 60} y={73} textAnchor="middle" fontSize={12} fontFamily={vars.font.mono} fontWeight={700} fill={toneTextColor('problem')}>
          Writer 대기…
        </text>
        <line x1={padX + 200 + 60} y1={86} x2={padX + 200 + 60} y2={trackY + trackH + 18} stroke={vars.color.problem} strokeWidth={1.2} strokeDasharray="4 4" />
        <text x={padX + 200 + 70} y={trackY + 20} fontSize={11} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          readers 가 0 이 안 됨
        </text>

        {/* note */}
        <text x={W / 2} y={H - 60} textAnchor="middle" fontSize={12.5} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          ⚠ Writer Starvation
        </text>
        <text x={W / 2} y={H - 38} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.text}>
          새 reader 가 계속 들어오면 readers count 가 0 으로 떨어지지 않아 writer 가 writelock 을 영원히 못 잡는다.
        </text>
        <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          해결: writer 가 기다리기 시작하면 새 reader 진입을 막는 fairness 정책 추가.
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Dining Philosophers — circular deadlock + dependency break
// ════════════════════════════════════════════════════════════════════════════
export function DiningPhilosophers({ caption }: { caption?: string }) {
  const W = 820;
  const H = 420;

  const leftCx = 220;
  const rightCx = 600;
  const cy = 200;
  const R = 130;
  const philR = 32;
  const forkR = 12;

  const renderTable = (cx: number, broken: boolean) => {
    const angles = [-90, -90 + 72, -90 + 144, -90 + 216, -90 + 288];
    const philPositions = angles.map((a) => {
      const rad = (a * Math.PI) / 180;
      return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
    });
    const forkPositions = angles.map((_, i) => {
      const a = angles[i] + 36; // halfway between
      const rad = (a * Math.PI) / 180;
      return { x: cx + (R * 0.72) * Math.cos(rad), y: cy + (R * 0.72) * Math.sin(rad) };
    });
    return (
      <g>
        {/* table */}
        <circle cx={cx} cy={cy} r={R - 50} fill={vars.color.surfaceAlt} stroke={vars.color.border} strokeWidth={1} />
        {/* philosophers */}
        {philPositions.map((p, i) => {
          const isBreaker = broken && i === 4;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={philR} fill={isBreaker ? toneBg('solution') : toneBg('accent')} stroke={isBreaker ? toneStroke('solution') : toneStroke('accent')} strokeWidth={1.6} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={13} fontFamily={vars.font.mono} fontWeight={700} fill={isBreaker ? toneTextColor('solution') : toneTextColor('accent')}>
                P{i}
              </text>
            </g>
          );
        })}
        {/* forks with hold arrows */}
        {forkPositions.map((f, i) => {
          const philLeft = philPositions[i];
          const philRight = philPositions[(i + 1) % 5];
          // who holds this fork?
          // In deadlock: each philosopher i grabs left fork (= forks[i]).
          //   So fork i is held by philosopher i (which is fork's right neighbor in this layout)
          // Actually: left(p)=p, right(p)=(p+1)%5. fork[i] is between Pi and P(i+1).
          //   If everyone grabs left → fork[i] is grabbed by Pi (left side neighbor of fork i in our layout uses convention that Pi's left fork is forks[i]).
          const holder = broken && i === 4 ? philRight : philLeft;
          return (
            <g key={i}>
              <line x1={holder.x} y1={holder.y} x2={f.x} y2={f.y} stroke={vars.color.problem} strokeWidth={1.4} strokeDasharray="3 3" opacity={0.6} />
              <circle cx={f.x} cy={f.y} r={forkR} fill={vars.color.problemSoft} stroke={vars.color.problem} strokeWidth={1.4} />
              <text x={f.x} y={f.y + 4} textAnchor="middle" fontSize={11} fontFamily={vars.font.mono} fontWeight={700} fill={vars.color.problem}>
                f{i}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Dining philosophers circular deadlock and fix">
        {/* LEFT: deadlock */}
        <text x={leftCx} y={30} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.problem}>
          Deadlock — 모두 왼쪽부터
        </text>
        {renderTable(leftCx, false)}
        <text x={leftCx} y={H - 30} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.problem}>
          ⚠ Circular wait — 각자 왼쪽 잡고 오른쪽 기다림
        </text>

        {/* RIGHT: dependency break */}
        <text x={rightCx} y={30} textAnchor="middle" fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.solution}>
          Fix — P4 만 반대 순서로
        </text>
        {renderTable(rightCx, true)}
        <text x={rightCx} y={H - 30} textAnchor="middle" fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.solution}>
          ✓ Cycle 끊김 — P4 는 오른쪽부터 잡으므로 같은 자원 경쟁이 깨짐
        </text>
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 10. Zemaphore — semaphore 를 lock+CV 로 구현
// ════════════════════════════════════════════════════════════════════════════
export function ZemaphoreImpl({ caption }: { caption?: string }) {
  const W = 820;
  const H = 400;
  const cardW = 360;
  const gap = 40;
  const startX = (W - cardW * 2 - gap) / 2;
  const y = 30;
  const cardH = 320;

  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Zemaphore implementation using lock and condition variable">
        {/* Zem_wait */}
        <BoxBg x={startX} y={y} w={cardW} h={cardH} tone="accent" />
        <text x={startX + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('accent')}>
          Zem_wait()
        </text>
        {[
          'Mutex_lock(&s->lock);',
          'while (s->value <= 0)',
          '    Cond_wait(&s->cond, &s->lock);',
          's->value--;',
          'Mutex_unlock(&s->lock);',
        ].map((line, i) => (
          <text key={i} x={startX + 18} y={y + 60 + i * 26} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={line.includes('value') || line.includes('while') ? 700 : 500} fill={line.includes('while') || line.includes('Cond_wait') ? vars.color.problem : vars.color.text}>
            {line}
          </text>
        ))}
        <text x={startX + 18} y={y + 220} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          핵심 차이:
        </text>
        <text x={startX + 18} y={y + 240} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          • value 는 절대 음수가 되지 않는다
        </text>
        <text x={startX + 18} y={y + 260} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          • 기다리는 thread 는 cond queue 에 있음
        </text>
        <text x={startX + 18} y={y + 280} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          • while 재검사로 Mesa semantics 처리
        </text>

        {/* Zem_post */}
        <BoxBg x={startX + cardW + gap} y={y} w={cardW} h={cardH} tone="solution" />
        <text x={startX + cardW + gap + 16} y={y + 26} fontSize={14} fontFamily={vars.font.sans} fontWeight={700} fill={toneTextColor('solution')}>
          Zem_post()
        </text>
        {[
          'Mutex_lock(&s->lock);',
          's->value++;',
          'Cond_signal(&s->cond);',
          'Mutex_unlock(&s->lock);',
        ].map((line, i) => (
          <text key={i} x={startX + cardW + gap + 18} y={y + 60 + i * 26} fontSize={12.5} fontFamily={vars.font.mono} fontWeight={line.includes('value') || line.includes('signal') ? 700 : 500} fill={line.includes('signal') ? vars.color.solution : vars.color.text}>
            {line}
          </text>
        ))}
        <text x={startX + cardW + gap + 18} y={y + 200} fontSize={12} fontFamily={vars.font.sans} fontWeight={700} fill={vars.color.text}>
          교훈:
        </text>
        <text x={startX + cardW + gap + 18} y={y + 224} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          semaphore 는 lock+CV 로 만들 수 있고
        </text>
        <text x={startX + cardW + gap + 18} y={y + 244} fontSize={11.5} fontFamily={vars.font.sans} fill={vars.color.text}>
          lock+CV 의 역할도 대체할 수 있다.
        </text>
        <text x={startX + cardW + gap + 18} y={y + 274} fontSize={11.5} fontFamily={vars.font.sans} fontStyle="italic" fill={vars.color.textMuted}>
          → 두 추상화는 서로를 만들 수 있는 친척 관계
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
      <marker id="arrow-solution" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={vars.color.solution} />
      </marker>
    </defs>
  );
}
