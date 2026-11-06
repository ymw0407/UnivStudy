import type { ReactNode } from 'react';
import { vars } from '../../styles/theme.css';
import * as s from './Ch24Diagrams.css';

/**
 * 24장(Common Concurrency Problems) 전용 SVG 다이어그램 모음.
 *
 * 다른 장과 같은 규칙을 따른다.
 * - viewBox 기반 → 컨테이너 폭에 맞춰 축소
 * - 색은 theme.css 의 vars.color 토큰만 사용 → 라이트/다크 자동 대응
 */

// ════════════════════════════════════════════════════════════════════════════
// 1. 동시성 버그 분류 지도
// ════════════════════════════════════════════════════════════════════════════
export function BugTaxonomy({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 360`} role="img" aria-label="동시성 버그 분류 지도">
        <ArrowDefs />

        <TitleBox x={280} y={14} w={200} h={40} tone="accent" title="동시성 버그" />
        <Arrow x1={350} y1={54} x2={210} y2={92} />
        <Arrow x1={410} y1={54} x2={550} y2={92} />

        {/* 왼쪽: non-deadlock */}
        <TitleBox
          x={60}
          y={96}
          w={290}
          h={56}
          tone="problem"
          title="Non-Deadlock Bugs"
          lines={['멈추진 않지만 결과가 틀어짐 — 실제로 더 흔함']}
        />
        <line x1={84} y1={152} x2={84} y2={300} stroke={vars.color.evoArrow} strokeWidth={1.2} />
        <line x1={84} y1={216} x2={104} y2={216} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
        <line x1={84} y1={300} x2={104} y2={300} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
        <TitleBox
          x={108}
          y={188}
          w={266}
          h={56}
          tone="solution"
          title="Atomicity Violation → lock"
          lines={['한 덩어리여야 할 접근 사이에 끼어듦']}
        />
        <TitleBox
          x={108}
          y={272}
          w={266}
          h={56}
          tone="solution"
          title="Order Violation → CV"
          lines={['A보다 B가 먼저 실행되어 버림']}
        />

        {/* 오른쪽: deadlock */}
        <TitleBox x={430} y={96} w={270} h={56} tone="problem" title="Deadlock Bugs" lines={['서로의 lock을 기다리며 영원히 멈춤']} />
        <line x1={452} y1={152} x2={452} y2={300} stroke={vars.color.evoArrow} strokeWidth={1.2} />
        <line x1={452} y1={216} x2={472} y2={216} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
        <line x1={452} y1={300} x2={472} y2={300} stroke={vars.color.evoArrow} strokeWidth={1.2} markerEnd="url(#arrow-default)" />
        <TitleBox
          x={476}
          y={188}
          w={266}
          h={56}
          tone="limitation"
          title="발생 조건 4가지"
          lines={['ME · Hold&Wait · No Preempt · Circular']}
        />
        <TitleBox
          x={476}
          y={272}
          w={266}
          h={56}
          tone="solution"
          title="대응 3종"
          lines={['Prevention · Avoidance · Detect&Recover']}
        />

        <Note x={W / 2} y={350} text="처방이 정해져 있다 — atomicity ↔ lock, order ↔ condition variable, deadlock ↔ 4조건 공략" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 2. Atomicity Violation 타임라인 (MySQL 버그)
// ════════════════════════════════════════════════════════════════════════════
export function AtomicityViolationTimeline({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 370`} role="img" aria-label="atomicity violation 타임라인">
        <ArrowDefs />
        <ColHeader x={190} y={26} text="Thread 1" />
        <ColHeader x={570} y={26} text="Thread 2" />
        <line x1={380} y1={40} x2={380} y2={292} stroke={vars.color.border} strokeWidth={1} strokeDasharray="4 4" />

        <TitleBox x={40} y={48} w={300} h={56} tone="plain" title="if (thd->proc_info)" mono lines={['NULL 아님 — 검사 통과']} />
        <SwitchLabel y={126} text="context switch" />
        <TitleBox x={420} y={140} w={300} h={56} tone="problem" title="thd->proc_info = NULL" mono lines={['공유 포인터를 중간에 NULL로 변경']} />
        <SwitchLabel y={218} text="context switch" />
        <TitleBox x={40} y={232} w={300} h={56} tone="problem" title="fputs(thd->proc_info, …)" mono lines={['NULL 역참조 → crash']} />

        <TitleBox
          x={110}
          y={312}
          w={540}
          h={44}
          tone="solution"
          title="해결 — 두 thread 모두 같은 lock으로 “검사 + 사용”을 한 덩어리로 보호"
        />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 3. Order Violation — 기대 순서 vs 실제 가능 순서
// ════════════════════════════════════════════════════════════════════════════
export function OrderViolationCompare({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 390`} role="img" aria-label="order violation 비교">
        <ArrowDefs />
        <ColHeader x={200} y={26} text="기대한 순서" />
        <ColHeader x={570} y={26} text="실제로 가능한 순서" />

        <TitleBox x={40} y={44} w={320} h={44} tone="plain" title="T1: init() — mThread 생성" />
        <Arrow x1={200} y1={88} x2={200} y2={112} />
        <TitleBox x={40} y={116} w={320} h={40} tone="plain" title="mThread 초기화 완료" />
        <Arrow x1={200} y1={156} x2={200} y2={180} />
        <TitleBox x={40} y={184} w={320} h={44} tone="solution" title="T2: mMain() — mThread 사용 OK" />

        <TitleBox x={420} y={44} w={320} h={44} tone="problem" title="T2: mMain()이 먼저 스케줄링됨" lines={[]} />
        <Arrow x1={580} y1={88} x2={580} y2={112} />
        <TitleBox x={420} y={116} w={320} h={48} tone="problem" title="mState = mThread->State" mono lines={['mThread는 아직 초기화 전(NULL)']} />
        <Arrow x1={580} y1={164} x2={580} y2={188} />
        <TitleBox x={420} y={192} w={320} h={40} tone="problem" title="crash 또는 쓰레기 값" />

        <TitleBox
          x={60}
          y={272}
          w={640}
          h={96}
          tone="solution"
          title="해결 — 22장의 3박자 그대로: mtLock + mtCond + mtInit"
          lines={[
            'T2:  lock → while (mtInit == 0) cond_wait → unlock 후에 mThread 사용',
            'T1:  생성 직후 lock → mtInit = 1 → signal → unlock',
            '→ 스케줄러가 누굴 먼저 돌리든 순서가 강제된다',
          ]}
        />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 4. Java Vector AddAll — encapsulation이 만든 deadlock
// ════════════════════════════════════════════════════════════════════════════
export function VectorAddAllDeadlock({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 370`} role="img" aria-label="Vector AddAll deadlock">
        <ArrowDefs />
        <TitleBox x={40} y={16} w={320} h={56} tone="plain" title="Thread 1 — v1.AddAll(v2)" lines={['내부: lock(v1) → lock(v2)']} />
        <TitleBox x={420} y={16} w={320} h={56} tone="plain" title="Thread 2 — v2.AddAll(v1)" lines={['내부: lock(v2) → lock(v1)']} />

        {/* 자원 그래프 cycle */}
        <CycleNode x={320} y={108} w={120} h={34} label="Thread 1" />
        <CycleNode x={500} y={186} w={120} h={34} label="lock(v2)" mono />
        <CycleNode x={320} y={264} w={120} h={34} label="Thread 2" />
        <CycleNode x={140} y={186} w={120} h={34} label="lock(v1)" mono />

        <CycleArrow x1={442} y1={134} x2={530} y2={184} dashed label="원함" lx={510} ly={148} />
        <CycleArrow x1={530} y1={222} x2={442} y2={272} label="보유" lx={510} ly={258} />
        <CycleArrow x1={318} y1={272} x2={230} y2={222} dashed label="원함" lx={250} ly={258} />
        <CycleArrow x1={230} y1={184} x2={318} y2={134} label="보유" lx={250} ly={148} />

        <Note x={W / 2} y={330} text="실선 = 보유(holds) · 점선 = 대기(wants) — 점선까지 이어지면 cycle 완성 = deadlock" />
        <Note x={W / 2} y={352} text="사용자는 AddAll() 내부에서 lock을 잡는지 모른다 — encapsulation이 만든 deadlock" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 5. Deadlock 4조건과 각각을 깨는 Prevention
// ════════════════════════════════════════════════════════════════════════════
export function DeadlockConditionsBreak({ caption }: { caption?: string }) {
  const W = 760;
  const xs = [16, 204, 392, 580];
  const bw = 164;
  const conds: Array<{ t: string; l: string }> = [
    { t: '① Mutual Exclusion', l: '자원은 한 번에 하나만' },
    { t: '② Hold-and-wait', l: '가진 채로 또 기다림' },
    { t: '③ No Preemption', l: '강제로 못 뺏음' },
    { t: '④ Circular Wait', l: '기다림이 원형 cycle' },
  ];
  const breaks: Array<{ t: string; l: string[] }> = [
    { t: 'lock 없애기', l: ['CAS · lock-free', '단, livelock 여지'] },
    { t: '한 번에 모두 잡기', l: ['전부 미리 알아야', 'concurrency ↓'] },
    { t: 'trylock + 재시도', l: ['실패 시 풀고 goto top', '단, livelock 여지'] },
    { t: 'lock 순서 고정', l: ['예: 주소 오름차순', '가장 실용적 ✓'] },
  ];
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 300`} role="img" aria-label="deadlock 4조건과 prevention 매핑">
        <ArrowDefs />
        {conds.map((c, i) => (
          <TitleBox key={c.t} x={xs[i]} y={28} w={bw} h={58} tone="problem" title={c.t} small lines={[c.l]} />
        ))}
        <text x={W / 2} y={116} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.text}>
          4가지가 동시에 성립해야 deadlock — 하나라도 깨면 Prevention
        </text>
        {xs.map((x) => (
          <Arrow key={x} x1={x + bw / 2} y1={86} x2={x + bw / 2} y2={134} />
        ))}
        {breaks.map((b, i) => (
          <TitleBox key={b.t} x={xs[i]} y={138} w={bw} h={78} tone="solution" title={b.t} small lines={b.l} />
        ))}
        <Note x={W / 2} y={250} text="시험 포인트 — 조건 ↔ 깨는 기법 매핑: ME→lock-free · H&W→한꺼번에 · NP→trylock · CW→순서 고정" />
        <Note x={W / 2} y={272} text="4조건은 필요조건 — 다 만족해도 반드시 발생하는 건 아니지만, 하나라도 깨지면 절대 발생 불가" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 6. Livelock 타임라인
// ════════════════════════════════════════════════════════════════════════════
export function LivelockTimeline({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 340`} role="img" aria-label="livelock 반복 타임라인">
        <ArrowDefs />
        <ColHeader x={230} y={24} text="Thread 1" />
        <ColHeader x={590} y={24} text="Thread 2" />

        <TitleBox x={90} y={38} w={280} h={36} tone="plain" title="lock(L1)  ✓" mono small />
        <TitleBox x={450} y={38} w={280} h={36} tone="plain" title="lock(L2)  ✓" mono small />
        <Arrow x1={230} y1={74} x2={230} y2={94} />
        <Arrow x1={590} y1={74} x2={590} y2={94} />
        <TitleBox x={90} y={98} w={280} h={36} tone="problem" title="tryLock(L2) → 실패" mono small />
        <TitleBox x={450} y={98} w={280} h={36} tone="problem" title="tryLock(L1) → 실패" mono small />
        <Arrow x1={230} y1={134} x2={230} y2={154} />
        <Arrow x1={590} y1={134} x2={590} y2={154} />
        <TitleBox x={90} y={158} w={280} h={36} tone="limitation" title="unlock(L1) · goto top" mono small />
        <TitleBox x={450} y={158} w={280} h={36} tone="limitation" title="unlock(L2) · goto top" mono small />

        {/* 반복 화살표 */}
        <path
          d="M 90 176 L 46 176 L 46 56 L 84 56"
          fill="none"
          stroke={vars.color.problem}
          strokeWidth={1.4}
          strokeDasharray="5 4"
          markerEnd="url(#arrow-default)"
        />
        <path
          d="M 450 176 L 414 176 L 414 56 L 444 56"
          fill="none"
          stroke={vars.color.problem}
          strokeWidth={1.4}
          strokeDasharray="5 4"
          markerEnd="url(#arrow-default)"
        />
        <text x={28} y={120} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.problem}>
          ↻
        </text>

        <TitleBox
          x={110}
          y={224}
          w={540}
          h={44}
          tone="problem"
          title="Livelock — 멈춰 있지 않은데(상태는 계속 바뀜) 아무도 전진하지 못함"
        />
        <TitleBox x={110} y={282} w={540} h={44} tone="solution" title="해결 — 재시도 전에 random delay로 두 thread의 타이밍을 어긋내기" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 7. Lock 기반 insert vs CAS wait-free insert
// ════════════════════════════════════════════════════════════════════════════
export function LockVsCasInsert({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 380`} role="img" aria-label="lock 기반 insert와 CAS insert 비교">
        <ArrowDefs />
        <ColHeader x={205} y={24} text="Lock 기반 insert" />
        <ColHeader x={575} y={24} text="CAS wait-free insert" />

        {/* 왼쪽 */}
        <TitleBox x={50} y={40} w={310} h={38} tone="muted" title="malloc + n->value 채우기 (lock 밖)" small />
        <Arrow x1={205} y1={78} x2={205} y2={96} />
        <TitleBox x={50} y={100} w={310} h={34} tone="accent" title="lock(listlock)" mono small />
        <Arrow x1={205} y1={134} x2={205} y2={152} />
        <TitleBox x={50} y={156} w={310} h={44} tone="accent" title="n->next = head;  head = n" mono small lines={['두 줄이 한 덩어리로 보호됨']} />
        <Arrow x1={205} y1={200} x2={205} y2={218} />
        <TitleBox x={50} y={222} w={310} h={34} tone="accent" title="unlock(listlock)" mono small />
        <Note x={205} y={292} text="lock이 다른 lock과 얽히면" />
        <Note x={205} y={310} text="deadlock 가능성이 생긴다" />

        {/* 오른쪽 */}
        <TitleBox x={420} y={40} w={310} h={38} tone="muted" title="malloc + n->value 채우기" small />
        <Arrow x1={575} y1={78} x2={575} y2={96} />
        <TitleBox x={420} y={100} w={310} h={34} tone="plain" title="n->next = head" mono small />
        <Arrow x1={575} y1={134} x2={575} y2={152} />
        <TitleBox x={420} y={156} w={310} h={44} tone="plain" title="CAS(&head, n->next, n)" mono small lines={['head가 그대로일 때만 교체']} />
        <Arrow x1={575} y1={200} x2={575} y2={230} label="성공" />
        <TitleBox x={460} y={234} w={230} h={34} tone="solution" title="삽입 완료 — lock 없음" small />
        <path
          d="M 730 178 L 748 178 L 748 117 L 730 117"
          fill="none"
          stroke={vars.color.problem}
          strokeWidth={1.4}
          strokeDasharray="5 4"
          markerEnd="url(#arrow-default)"
        />
        <Note x={575} y={292} text="실패(다른 thread가 head 변경) → 재시도" />
        <Note x={575} y={310} text="deadlock 없음 · 경쟁 심하면 livelock 여지" />

        <line x1={380} y1={36} x2={380} y2={316} stroke={vars.color.border} strokeWidth={1} strokeDasharray="4 4" />
        <Note x={W / 2} y={352} text="mutual exclusion 자체를 깨는 prevention — lock이 없으니 lock으로 인한 deadlock도 없다" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 8. Avoidance via Scheduling — Gantt
// ════════════════════════════════════════════════════════════════════════════
export function AvoidanceSchedule({ caption }: { caption?: string }) {
  const W = 760;
  const x0 = 130;
  const u = 130; // 시간 1칸 폭
  const bar = (x: number, y: number, w: number, label: string, tone: BoxTone) => (
    <g key={`${x}-${y}-${label}`}>
      <BoxBg x={x} y={y} w={w} h={30} tone={tone} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={toneTextColor(tone)}>
        {label}
      </text>
    </g>
  );
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 360`} role="img" aria-label="스케줄링으로 deadlock 회피">
        <ArrowDefs />
        <text x={20} y={30} fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.text}>
          시나리오 1 — T1·T2만 서로 위험 (둘 다 L1·L2 사용)
        </text>
        <Txt x={20} y={62} text="CPU 1" muted />
        {bar(x0, 44, u, 'T3', 'muted')}
        {bar(x0 + u, 44, u, 'T4', 'muted')}
        <Txt x={20} y={102} text="CPU 2" muted />
        {bar(x0, 84, u, 'T1', 'accent')}
        {bar(x0 + u, 84, u, 'T2', 'accent')}
        <Note x={x0 + u + 150} y={132} text="위험한 T1·T2를 같은 CPU에 직렬로 → 절대 동시 실행되지 않음" />

        <text x={20} y={182} fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.text}>
          시나리오 2 — T1·T2·T3 모두 위험 (셋 다 L1·L2 사용)
        </text>
        <Txt x={20} y={214} text="CPU 1" muted />
        {bar(x0, 196, u, 'T3', 'accent')}
        <Txt x={20} y={254} text="CPU 2" muted />
        {bar(x0, 236, u, 'T4', 'muted')}
        {bar(x0 + u, 236, u, 'T1', 'accent')}
        {bar(x0 + u * 2, 236, u, 'T2', 'accent')}
        <line x1={x0 + u * 2} y1={40} x2={x0 + u * 2} y2={272} stroke={vars.color.problem} strokeWidth={1.2} strokeDasharray="5 4" />
        <text x={x0 + u * 2 + 8} y={170} fontSize={11} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.problem}>
          시나리오 1의 종료 시점
        </text>
        <text x={x0 + u * 3 + 8} y={258} fontSize={11} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.problem}>
          전체 시간 ↑
        </text>

        <Note x={W / 2} y={314} text="deadlock은 피하지만 — 위험한 thread를 겹치지 못하게 하느라 병렬성이 줄어든다" />
        <Note x={W / 2} y={336} text="+ 각 thread가 어떤 lock을 쓸지 미리 알아야 함(global knowledge) → 범용 OS에는 비현실적" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 9. Detect & Recover — resource graph cycle 탐지
// ════════════════════════════════════════════════════════════════════════════
export function ResourceGraphDetect({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 330`} role="img" aria-label="resource graph cycle 탐지와 복구">
        <ArrowDefs />
        <text x={210} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.text}>
          deadlock detector — 주기적으로 graph를 그리고 cycle 검사
        </text>

        <CycleNode x={90} y={56} w={100} h={32} label="Thread 1" />
        <CycleNode x={270} y={56} w={100} h={32} label="Lock L2" mono />
        <CycleNode x={270} y={216} w={100} h={32} label="Thread 2" />
        <CycleNode x={90} y={216} w={100} h={32} label="Lock L1" mono />
        <CycleArrow x1={192} y1={72} x2={266} y2={72} dashed label="대기" lx={229} ly={62} />
        <CycleArrow x1={320} y1={90} x2={320} y2={212} label="보유" lx={342} ly={152} />
        <CycleArrow x1={268} y1={232} x2={194} y2={232} dashed label="대기" lx={229} ly={252} />
        <CycleArrow x1={140} y1={214} x2={140} y2={92} label="보유" lx={118} ly={152} />
        <text x={229} y={158} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.problem}>
          cycle 발견!
        </text>
        <text x={229} y={176} textAnchor="middle" fontSize={11} fontFamily={vars.font.sans} fill={vars.color.problem}>
          = deadlock
        </text>

        <Arrow x1={420} y1={152} x2={490} y2={152} label="복구" />

        <TitleBox x={500} y={64} w={220} h={40} tone="solution" title="transaction abort" small lines={[]} />
        <TitleBox x={500} y={132} w={220} h={40} tone="solution" title="process / thread 종료" small />
        <TitleBox x={500} y={200} w={220} h={40} tone="solution" title="시스템 재시작" small />

        <Note x={W / 2} y={290} text="DB에서 표준 — 여러 transaction이 lock을 잡고 돌아 deadlock detector가 주기 실행 (예: MySQL InnoDB)" />
        <Note x={W / 2} y={312} text="완전히 막는 게 아니라 ‘가끔 나는 건 허용하고, 나면 찾아서 되돌린다’는 실용주의" />
      </svg>
    </Diagram>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 10. Summary — 버그를 만났을 때의 의사결정 순서도
// ════════════════════════════════════════════════════════════════════════════
export function StrategyDecisionFlow({ caption }: { caption?: string }) {
  const W = 760;
  return (
    <Diagram caption={caption}>
      <svg className={s.svg} viewBox={`0 0 ${W} 420`} role="img" aria-label="동시성 버그 대응 의사결정 순서도">
        <ArrowDefs />
        <TitleBox x={270} y={14} w={220} h={40} tone="accent" title="동시성 버그를 만났다" />
        <Arrow x1={380} y1={54} x2={380} y2={76} />
        <TitleBox x={230} y={80} w={300} h={44} tone="plain" title="프로그램이 멈춰 있는가?" lines={['(thread들이 서로를 기다리는가)']} />

        <Arrow x1={232} y1={102} x2={130} y2={150} label="아니오" />
        <Arrow x1={528} y1={102} x2={620} y2={150} label="예 — deadlock" />

        {/* 왼쪽: non-deadlock */}
        <TitleBox
          x={30}
          y={154}
          w={330}
          h={100}
          tone="solution"
          title="Non-deadlock bug — 둘 중 무엇?"
          lines={[
            '값이 중간에 바뀜 → Atomicity violation → lock',
            '초기화 전에 사용 → Order violation → CV 3박자',
            '(lock + cond + state variable, while 재검사)',
          ]}
        />

        {/* 오른쪽: deadlock 전략 */}
        <TitleBox x={420} y={154} w={320} h={52} tone="solution" title="설계 단계 — Prevention" lines={['4조건 중 하나를 구조적으로 깨기']} small />
        <Arrow x1={580} y1={206} x2={580} y2={224} />
        <TitleBox x={420} y={228} w={320} h={52} tone="solution" title="실행 중 — Avoidance" lines={['lock 사용 정보를 알고 스케줄링으로 회피']} small />
        <Arrow x1={580} y1={280} x2={580} y2={298} />
        <TitleBox x={420} y={302} w={320} h={52} tone="solution" title="사후 — Detect & Recover" lines={['resource graph에서 cycle 찾고 복구']} small />

        <Note x={195} y={300} text="atomicity ↔ lock" />
        <Note x={195} y={320} text="order ↔ condition variable" />

        <Note x={W / 2} y={392} text="한 줄 암기 — 멈췄으면 deadlock(4조건·3대응), 안 멈췄으면 atomicity(lock) 아니면 order(CV)" />
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

/** 제목(굵게) + 보조 줄(흐리게)을 가운데 정렬로 담는 박스 */
function TitleBox({
  x,
  y,
  w,
  h,
  tone,
  title,
  lines,
  mono,
  small,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: BoxTone;
  title: string;
  lines?: string[];
  mono?: boolean;
  small?: boolean;
}) {
  const body = lines ?? [];
  const titleY = body.length > 0 ? y + 22 : y + h / 2 + 4.5;
  return (
    <g>
      <BoxBg x={x} y={y} w={w} h={h} tone={tone} />
      <text
        x={x + w / 2}
        y={titleY}
        textAnchor="middle"
        fontSize={small ? 12 : 12.5}
        fontWeight={700}
        fontFamily={mono ? vars.font.mono : vars.font.sans}
        fill={toneTextColor(tone)}
      >
        {title}
      </text>
      {body.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={y + 40 + i * 16}
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

function ColHeader({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={12.5} fontWeight={700} fontFamily={vars.font.sans} fill={vars.color.heading}>
      {text}
    </text>
  );
}

function SwitchLabel({ y, text }: { y: number; text: string }) {
  return (
    <text x={380} y={y} textAnchor="middle" fontSize={11} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
      ── {text} ──
    </text>
  );
}

function Txt({ x, y, text, muted }: { x: number; y: number; text: string; muted?: boolean }) {
  return (
    <text x={x} y={y} fontSize={12} fontFamily={vars.font.sans} fill={muted ? vars.color.textMuted : vars.color.text}>
      {text}
    </text>
  );
}

function Note({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={11.5} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
      {text}
    </text>
  );
}

/** 자원 그래프의 노드 */
function CycleNode({ x, y, w, h, label, mono }: { x: number; y: number; w: number; h: number; label: string; mono?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={vars.color.surface} stroke={vars.color.borderStrong} strokeWidth={1.2} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        fontFamily={mono ? vars.font.mono : vars.font.sans}
        fill={vars.color.text}
      >
        {label}
      </text>
    </g>
  );
}

/** 보유(실선)/대기(점선) 화살표 + 라벨 */
function CycleArrow({
  x1,
  y1,
  x2,
  y2,
  dashed,
  label,
  lx,
  ly,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  label?: string;
  lx?: number;
  ly?: number;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={dashed ? vars.color.problem : vars.color.evoArrow}
        strokeWidth={1.4}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={dashed ? 'url(#arrow-problem)' : 'url(#arrow-default)'}
      />
      {label && lx !== undefined && ly !== undefined && (
        <text x={lx} y={ly} textAnchor="middle" fontSize={10.5} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          {label}
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
        <text x={midX + 8} y={midY - 4} fontSize={10.5} fontStyle="italic" fontFamily={vars.font.sans} fill={vars.color.textMuted}>
          {label}
        </text>
      )}
    </g>
  );
}
