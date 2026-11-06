import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '06-lottery-stride-cfs',
  chapterNumber: 6,
  title: 'Lottery · Stride · CFS',
  description: '비례 공정(Proportional Share) 스케줄러와 현대 리눅스 CFS 의 설계.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch06-mc-1',
      type: 'multiple-choice',
      prompt:
        'Lottery Scheduling 에서 프로세스 A 에 75 장, B 에 25 장의 티켓이 있다. 장기적으로 A : B 의 CPU 비율에 가장 가까운 것은?',
      options: [
        { text: '1 : 1' },
        { text: '2 : 1' },
        { text: '3 : 1' },
        { text: '5 : 1' },
      ],
      answerIndex: 2,
      explanation: '75 : 25 = 3 : 1. 시행이 많아질수록 기대 비율에 수렴.',
    },
    {
      id: 'ch06-mc-2',
      type: 'multiple-choice',
      prompt: 'Stride Scheduling 에서 티켓이 많은 프로세스의 stride 는?',
      options: [
        { text: '크다 (pass 가 빠르게 증가 → 덜 선택된다)' },
        { text: '작다 (pass 가 천천히 증가 → 자주 선택된다)' },
        { text: '티켓 수와 무관하다.' },
        { text: '티켓 수와 같다.' },
      ],
      answerIndex: 1,
      explanation:
        'stride = 큰 상수 / 티켓 수. 티켓이 많을수록 stride 가 작고, pass 증가 속도가 느려 자주 선택된다.',
    },
    {
      id: 'ch06-mc-3',
      type: 'multiple-choice',
      prompt:
        'CFS(Completely Fair Scheduler) 에서 매 순간 실행할 프로세스를 고르는 규칙은?',
      options: [
        { text: '티켓 수가 가장 많은 프로세스' },
        { text: 'vruntime 이 가장 작은 프로세스' },
        { text: 'pass 값이 가장 큰 프로세스' },
        { text: '도착 시각이 가장 이른 프로세스' },
      ],
      answerIndex: 1,
      explanation:
        '지금까지 "덜 받은" 쪽 먼저. CFS 는 red-black tree 에서 가장 왼쪽(최소 vruntime) 노드를 실행한다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch06-code-1',
      type: 'code-blank',
      language: 'c',
      prompt: 'Lottery scheduler 의 당첨자 선택 루프. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'int winner = rand() % total_tickets;\nint counter = 0;\nproc_t *p = head;\nwhile (p) {\n    counter += p->tickets;\n    if (counter > ' },
        { kind: 'blank', answers: ['winner'], width: 8 },
        { kind: 'text', text: ')\n        break;\n    p = p->' },
        { kind: 'blank', answers: ['next'], width: 6 },
        { kind: 'text', text: ';\n}\nrun(p);\n' },
      ],
      explanation:
        '티켓 누적합이 당첨 번호를 초과하는 첫 프로세스가 당첨자.',
    },
    {
      id: 'ch06-code-2',
      type: 'code-blank',
      language: 'c',
      prompt: 'Stride Scheduler 의 핵심. 프로세스 p 를 한 번 실행한 뒤 pass 를 갱신한다.',
      segments: [
        { kind: 'text', text: '// 모든 프로세스 중 pass 가 최소인 것 선택\nproc_t *p = min_by_pass(procs);\nrun(p);\np->pass += p->' },
        { kind: 'blank', answers: ['stride'], width: 8 },
        { kind: 'text', text: ';\n\n// stride 의 정의\np->stride = ' },
        { kind: 'blank', answers: ['BIG_CONST / p->tickets', 'BIG / p->tickets', 'LARGE / p->tickets'], width: 28 },
        { kind: 'text', text: ';\n' },
      ],
      explanation:
        'stride = 상수 / tickets. 티켓 많을수록 stride ↓ → pass 증가 느림 → 자주 선택.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch06-tf-1',
      type: 'true-false',
      prompt:
        'Lottery 스케줄링은 확률적이므로, 짧은 실행 구간에서는 티켓 비율과 실제 CPU 점유 비율이 크게 어긋날 수 있다.',
      answer: true,
    },
    {
      id: 'ch06-tf-2',
      type: 'true-false',
      prompt:
        'Ticket Currency 메커니즘은 사용자/그룹이 자체 단위로 티켓을 표현해도, 전역 비율은 스케줄러가 환산해 공정성을 유지하게 한다.',
      answer: true,
    },
    {
      id: 'ch06-tf-3',
      type: 'true-false',
      prompt:
        'CFS 의 sched_latency 가 48ms 이고 ready 상태 프로세스가 6 개라면, 기본 time slice 는 10ms 이다.',
      answer: false,
      explanation: '48 / 6 = 8ms. min_granularity 가 더 크면 그 값으로 클램프된다.',
    },
    {
      id: 'ch06-tf-4',
      type: 'true-false',
      prompt:
        'CFS 의 nice 값이 낮을수록 weight 가 크고, 같은 실제 실행 시간에 대해 vruntime 이 더 천천히 증가한다.',
      answer: true,
      explanation:
        'nice − 5 ≈ weight 3121. 낮은 nice = 더 중요한 프로세스 = 더 자주 선택됨.',
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch06-short-1',
      type: 'short-answer',
      prompt:
        'CFS 가 ready queue 를 관리하는 자료구조의 이름은? (공백·하이픈 모두 허용)',
      answers: ['red-black tree', 'rbtree', 'red black tree', 'RB tree', 'red-black-tree'],
      explanation: 'Red-Black Tree. O(log n) 삽입/삭제/최솟값 조회.',
    },
    {
      id: 'ch06-short-2',
      type: 'short-answer',
      prompt:
        'CFS 에서 sched_latency = 48ms, min_granularity = 6ms, ready 프로세스 수 n = 10 일 때 각 프로세스의 기본 time slice 는? (숫자만, 단위 ms)',
      answers: ['6', '6ms', '6 ms'],
      hint: '48/n 과 min_granularity 중 큰 값',
      explanation:
        '48 / 10 = 4.8ms < min_granularity(6ms) 이므로 6ms 로 바닥 보정.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch06-essay-1',
      type: 'essay',
      prompt:
        'Lottery 와 Stride 의 공통 목표와 차이점을, 각 방식이 남긴 한계와 함께 설명하시오.',
      modelAnswer:
        '공통 목표는 "티켓/비율로 각 프로세스의 CPU 몫을 표현하고, 그 비율에 맞게 스케줄한다" 는 비례 공정성(Proportional Share) 이다.\n\n차이:\n- Lottery 는 확률적. 매 time slice 마다 무작위 추첨으로 프로세스를 뽑는다. 장점은 상태가 단순(현재 티켓 수만 있으면 됨)하다는 것, 단점은 단기 구간에서 비율 편차가 크고 공정성이 보장되지 않는다는 점이다.\n- Stride 는 결정적. 각 프로세스에 stride = 상수/티켓수를 두고, pass 가 최소인 쪽을 실행한 후 stride 만큼 증가시킨다. 장점은 랜덤성이 없이 정확한 비율을 만들 수 있다는 것, 단점은 pass 상태를 유지해야 하고 새 프로세스의 pass = 0 문제로 잠시 CPU 를 독점할 수 있다는 점이다.',
      rubric: [
        '공통 목표(비례 공정성) 언급',
        '확률적 vs 결정적 대비',
        '각각의 한계(Lottery 편차 / Stride pass=0 문제)',
      ],
    },
    {
      id: 'ch06-essay-2',
      type: 'essay',
      prompt:
        'CFS 가 (1) sched_latency · min_granularity, (2) nice 값과 weight, (3) vruntime 세 요소를 어떻게 결합해 "공정함 + 정책적 차등" 을 동시에 달성하는지 설명하시오.',
      modelAnswer:
        '(1) sched_latency 는 "모두가 한 번씩 도는 기대 주기" 로, n 개의 ready 프로세스가 있을 때 기본 time slice = sched_latency / n. 단 min_granularity 로 하한을 둬서 프로세스 수가 많아져도 context switch 가 지나치게 빈번해지지 않도록 한다.\n\n(2) nice 를 weight 로 매핑(nice 0 → weight 1024 등). 각 프로세스의 time slice = (weight_i / Σweight) × sched_latency 로 가중 분배된다. 높은 우선순위(낮은 nice)는 더 긴 슬라이스를 받는다.\n\n(3) vruntime = 실제 실행 시간 × (weight_0 / weight_i). 즉 우선순위가 높을수록 vruntime 이 느리게 증가한다. 스케줄러는 항상 vruntime 이 최소인 프로세스를 고른다.\n\n결과적으로 (3) 이 "덜 받은 쪽 먼저" 라는 공정성을, (2) 가 nice 기반의 정책적 차등을 반영하며, (1) 이 context switch 빈도와 반응성의 균형을 관리한다.',
      rubric: [
        'sched_latency / min_granularity 역할',
        'nice → weight 매핑',
        'vruntime 가중치 공식과 선택 규칙',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch06-mc-4',
      type: 'multiple-choice',
      prompt:
        'CFS 에서 nice 값이 "낮을수록" 우선순위가 높은 이유로 옳은 것은?',
      options: [
        { text: 'nice 가 낮으면 weight 가 작아서 CPU 를 덜 쓴다.' },
        { text: 'nice 가 낮으면 weight 가 커서 vruntime 이 천천히 증가해 자주 선택된다.' },
        { text: 'nice 가 음수면 스케줄러가 항상 먼저 실행한다(절대 우선).' },
        { text: 'nice 값은 vruntime 과 무관하다.' },
      ],
      answerIndex: 1,
      explanation:
        'nice ↓ → weight ↑ → 같은 실제 실행시간에 vruntime 증가가 weight_0/weight_i 로 작아 → 덜 받은 쪽으로 판정되어 더 자주 선택.',
    },
    {
      id: 'ch06-mc-5',
      type: 'multiple-choice',
      prompt:
        'Lottery 와 Stride 의 차이로 옳은 것은?',
      options: [
        { text: 'Lottery 는 결정적 · Stride 는 확률적' },
        { text: 'Lottery 는 확률적 · Stride 는 결정적' },
        { text: '둘 다 결정적이다.' },
        { text: '둘 다 확률적이다.' },
      ],
      answerIndex: 1,
      explanation:
        'Lottery = 매 결정마다 난수로 선택(확률적). Stride = pass 최소값을 정확히 선택(결정적).',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch06-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        'CFS 의 vruntime 누적. 실제 실행 시간 delta 에 weight 보정을 적용.',
      segments: [
        { kind: 'text', text: '// weight_0 은 nice 0 의 기본 weight (보통 1024)\nvoid account_runtime(proc_t *p, uint64_t delta) {\n    p->vruntime += delta * ' },
        { kind: 'blank', answers: ['WEIGHT_0 / p->weight', 'weight_0 / p->weight', '1024 / p->weight'], width: 22 },
        { kind: 'text', text: ';\n}\n' },
      ],
      explanation:
        'weight 큰 프로세스일수록 보정 계수가 작아 vruntime 이 느리게 증가.',
    },

    // ── 추가 : True / False ───────────────────────
    {
      id: 'ch06-tf-5',
      type: 'true-false',
      prompt:
        'Ticket Transfer 를 사용하면 클라이언트가 서버에게 자신의 티켓을 일시적으로 넘겨, 서버가 자신의 요청을 더 빨리 처리하도록 유도할 수 있다.',
      answer: true,
    },
    {
      id: 'ch06-tf-6',
      type: 'true-false',
      prompt:
        '티켓 수가 동일한 두 프로세스가 있을 때, Stride scheduling 은 완전히 교대로 실행하는 것을 보장한다.',
      answer: true,
      explanation:
        'stride 가 같으므로 pass 도 동일하게 증가 → tie-break 정책에 따라 교대로 선택.',
    },
    {
      id: 'ch06-tf-7',
      type: 'true-false',
      prompt:
        'CFS 에서 ready 프로세스 수가 많아져 기본 time slice 가 min_granularity 아래로 내려가려 하면, 실제 time slice 는 min_granularity 로 고정되어 "공평한 한 바퀴" 주기 자체가 sched_latency 를 초과하게 된다.',
      answer: true,
      explanation:
        'context switch 비용 방지 위해 공평성 주기를 조금 희생.',
    },
    {
      id: 'ch06-tf-8',
      type: 'true-false',
      prompt:
        'RB-Tree 의 삽입/삭제/최솟값 조회가 모두 O(log n) 이므로, CFS 는 ready 프로세스가 많아도 스케줄 결정 오버헤드가 이론적으로 제한된다.',
      answer: true,
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch06-short-3',
      type: 'short-answer',
      prompt:
        'CFS 가 "깨어난 프로세스의 vruntime 을 트리의 최소값보다 너무 작지 않도록 끌어올리는" 목적은? (한 줄)',
      answers: [
        '오래 잠든 보너스가 불공정한 CPU 독점이 되는 것을 막기 위해',
        '깨어난 프로세스가 CPU 를 독점하지 못하게 하기 위해',
        'CPU 독점 방지',
        'starvation 방지',
        '공정성 유지',
      ],
      hint: '"독점 방지" 느낌',
      explanation:
        '잠들었던 동안 vruntime 이 0 에 가까우면 한동안 혼자 CPU 를 독차지할 위험이 있으므로 최소값 근처로 보정.',
    },
    {
      id: 'ch06-short-4',
      type: 'short-answer',
      prompt:
        'Stride 스케줄러에서 BIG = 10000, 프로세스 A 의 tickets = 100, B 의 tickets = 50 이라면 각각의 stride 는? (공백 구분 두 숫자, A 먼저)',
      answers: ['100 200', '100, 200', '100,200'],
      hint: 'A 와 B 의 stride 순서대로',
      explanation: 'A: 10000/100 = 100. B: 10000/50 = 200.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch06-essay-3',
      type: 'essay',
      prompt:
        'CFS 가 sleep → wake 한 프로세스의 vruntime 을 보정하는 이유와 구체적 방법을, 보정하지 않았을 때의 문제와 함께 서술하시오.',
      modelAnswer:
        '보정하지 않을 때의 문제: 어떤 프로세스가 오랜 시간 잠들어 있다가(예: 블록 I/O 대기) 깨어나면, 실행되지 않은 동안 vruntime 이 거의 증가하지 않았으므로 RB-tree 의 최솟값과 크게 차이가 난다. CFS 는 "가장 작은 vruntime 을 선택" 하므로, 깨어난 프로세스가 그 차이만큼의 시간 동안 혼자 CPU 를 독점하게 되어 다른 프로세스들의 응답성이 크게 나빠진다.\n\n보정 방법: 프로세스가 ready 상태로 돌아올 때, 해당 프로세스의 vruntime 을 "현재 트리의 최소 vruntime 에서 일정량(예: sched_latency / 2) 을 뺀 값" 이상으로 끌어올린다. 즉 깨어남 보너스는 주되 "지나치게 많이 밀린 것처럼" 보이지는 않게 한다. 이렇게 하면 interactive 한 작업이 sleep 에서 깨어나면 곧바로 실행될 가능성은 높으면서도(반응성), 장기 공정성(비율) 이 크게 훼손되지 않는다.',
      rubric: [
        '보정하지 않으면 생기는 독점 문제',
        '최소 vruntime 기준으로 끌어올린다는 방법',
        '반응성과 공정성의 균형 의식',
      ],
    },
  ],
};

export default quiz;
