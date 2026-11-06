import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '05-mlfq',
  chapterNumber: 5,
  title: 'MLFQ — Multi-Level Feedback Queue',
  description: '실행 시간을 모른 채, 과거 행동으로 미래를 추정하는 스케줄러.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch05-mc-1',
      type: 'multiple-choice',
      prompt: 'MLFQ 의 "기본 4 규칙" 중 잘못 설명한 것은?',
      options: [
        { text: '높은 우선순위 큐의 작업이 낮은 큐의 작업보다 먼저 실행된다.' },
        { text: '같은 큐 안에서는 Round Robin 으로 돈다.' },
        { text: '새 작업은 가장 낮은 우선순위 큐에서 시작한다.' },
        { text: '자신의 time slice 를 다 쓰면 한 단계 강등된다.' },
      ],
      answerIndex: 2,
      explanation:
        '새 작업은 "일단 짧다" 고 가정하고 최상위 큐에서 시작한다. 길게 돌리면 그때 강등된다.',
    },
    {
      id: 'ch05-mc-2',
      type: 'multiple-choice',
      prompt: 'MLFQ 에서 Starvation 을 완화하기 위해 추가된 규칙은?',
      options: [
        { text: '낮은 큐의 작업이 오래 기다리면 강제 종료한다.' },
        { text: '일정 시간 S 마다 모든 작업의 우선순위를 최상위 큐로 끌어올린다 (Priority Boost).' },
        { text: '새 작업의 time slice 를 두 배로 늘린다.' },
        { text: '우선순위가 같은 작업끼리는 FIFO 로만 돈다.' },
      ],
      answerIndex: 1,
      explanation:
        'Priority Boost(Rule 5). 모든 작업을 주기적으로 최상위 큐로 승급시켜 굶는 일을 막고, 변화한 행동을 재평가한다.',
    },
    {
      id: 'ch05-mc-3',
      type: 'multiple-choice',
      prompt:
        '"Gaming" 문제(프로세스가 time slice 만료 직전에 짧게 I/O 를 걸어 강등을 피하는 행위)를 막기 위한 개선은?',
      options: [
        { text: 'Round Robin 을 FIFO 로 바꾼다.' },
        { text: '우선순위 큐를 하나만 둔다.' },
        { text: '한 번의 time slice 가 아니라, 해당 큐에서의 누적 allotment 로 강등 여부를 판단한다.' },
        { text: 'I/O 호출 횟수를 세서 일정 이상이면 강등한다.' },
      ],
      answerIndex: 2,
      explanation:
        'Better Accounting. 양보 횟수와 관계 없이 같은 큐에서 총 사용한 시간이 allotment 를 넘으면 강등.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch05-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        '개선된 규칙 4(누적 allotment 기반 강등) 의 핵심이다. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'void on_timer_tick(proc_t *p) {\n    p->used_in_level += TICK_MS;\n    if (p->used_in_level >= ALLOTMENT[p->level]) {\n        p->level = min(p->level + ' },
        { kind: 'blank', answers: ['1'], width: 3 },
        { kind: 'text', text: ', MAX_LEVEL);\n        p->used_in_level = ' },
        { kind: 'blank', answers: ['0'], width: 3 },
        { kind: 'text', text: ';\n    }\n}\n' },
      ],
      explanation:
        '레벨을 한 단계 낮추고, 새 레벨에서는 누적 사용량을 0 으로 초기화한다.',
    },
    {
      id: 'ch05-code-2',
      type: 'code-blank',
      language: 'c',
      prompt: 'Priority Boost 를 S 주기로 수행하는 함수다.',
      segments: [
        { kind: 'text', text: 'void priority_boost(void) {\n    for (int i = 0; i < N; i++) {\n        procs[i].level = ' },
        { kind: 'blank', answers: ['0', 'TOP', 'MAX'], width: 6 },
        { kind: 'text', text: ';             // 최상위 큐\n        procs[i].used_in_level = 0;\n    }\n}\n\n// scheduler 초기화\nregister_periodic(' },
        { kind: 'blank', answers: ['S', 'BOOST_PERIOD'], width: 16 },
        { kind: 'text', text: ', priority_boost);\n' },
      ],
      explanation:
        '모든 프로세스를 최상위 큐로 끌어올리고 누적 사용량 초기화. 주기는 정책 파라미터 S.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch05-tf-1',
      type: 'true-false',
      prompt:
        'MLFQ 의 기본 규칙만으로는 인터랙티브 작업이 항상 최상위 큐에 머물 수 있다.',
      answer: true,
      explanation:
        '짧게 돌고 자주 양보하므로 강등되지 않고 상위에 남는다. 그 대신 CPU-bound 는 하위로 밀린다.',
    },
    {
      id: 'ch05-tf-2',
      type: 'true-false',
      prompt:
        '하위 큐일수록 time slice 를 길게 주는 이유는, CPU-bound 작업의 context switch 오버헤드를 줄이기 위해서다.',
      answer: true,
    },
    {
      id: 'ch05-tf-3',
      type: 'true-false',
      prompt:
        'Priority Boost 는 Gaming 문제를 완전히 해결한다.',
      answer: false,
      explanation:
        'Boost 는 Starvation / Behavior Change 를 해결할 뿐, Gaming 은 Better Accounting 이 필요하다.',
    },
    {
      id: 'ch05-tf-4',
      type: 'true-false',
      prompt:
        'Solaris 의 time-sharing 스케줄러는 전형적인 MLFQ 로, 약 60개 우선순위 큐와 주기적 boost 를 사용한다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch05-short-1',
      type: 'short-answer',
      prompt:
        'MLFQ 의 세 가지 함정으로 꼽히는 문제 이름을 쉼표로 구분해 나열하시오. (한글 또는 영어, 순서 무관)',
      answers: [
        'Starvation, Gaming, Behavior Change',
        'starvation, gaming, behavior change',
        '굶주림, 게이밍, 행동 변화',
        'starvation, gaming, behavior-change',
      ],
      explanation:
        '하위 큐의 Starvation, time slice 꼼수(Gaming), 작업 성격의 Behavior Change.',
    },
    {
      id: 'ch05-short-2',
      type: 'short-answer',
      prompt:
        'MLFQ 에서 time slice 가 상위 큐 10ms, 하위 큐 40ms 라 하자. 한 작업이 상위에서 100ms 를 누적 사용했다면, 해당 작업은 몇 번 강등되었을까? (숫자만, allotment = 그 큐의 time slice 라고 가정)',
      answers: ['1'],
      hint: '한 번 강등되면 하위 큐로 내려와 적용 규칙이 바뀐다',
      explanation:
        '상위 allotment 10ms 사용 후 강등(1 회). 이후 하위에서 40ms 씩 카운트되고, 아직 다음 레벨 강등 기준(40ms × 하위 allotment)을 넘지 못했다고 가정.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch05-essay-1',
      type: 'essay',
      prompt:
        'MLFQ 가 "실행 시간을 몰라도" SJF/STCF 같은 효과를 낼 수 있는 원리를 설명하시오.',
      modelAnswer:
        'MLFQ 의 핵심 직관은 "과거 행동으로 미래를 추정" 이다.\n- 새 작업은 일단 짧을 거라고 가정하고 최상위 큐에서 시작한다.\n- 자발적으로 자주 CPU 를 양보하는 (I/O-bound, 인터랙티브) 작업은 강등되지 않고 상위에 머문다. 이들은 SJF 가 골랐을 "짧은 작업" 과 같은 성격이다.\n- 반대로 CPU 를 길게 쓰는 작업은 time slice (또는 allotment) 를 다 써서 점점 하위 큐로 내려간다. 이는 "긴 작업" 을 나중으로 미루는 효과다.\n- 즉 OS 는 실행 시간을 미리 알 필요 없이, 런타임에 관찰되는 행동 패턴으로 우선순위를 학습해 SJF/STCF 와 비슷한 결과(짧은 작업은 빨리 끝나게)를 얻는다.',
      rubric: [
        '"과거 행동으로 미래 추정" 아이디어',
        '상위 유지(I/O-bound) / 강등(CPU-bound) 분리',
        'Oracle 없이도 SJF 와 유사한 효과',
      ],
    },
    {
      id: 'ch05-essay-2',
      type: 'essay',
      prompt:
        'MLFQ 의 세 가지 함정(Starvation / Gaming / Behavior Change)을 각각 정의하고, 이를 해결하기 위해 도입된 규칙을 설명하시오.',
      modelAnswer:
        'Starvation: 상위 큐에 작업이 계속 들어오면 하위 큐 작업이 영원히 CPU 를 받지 못한다. → Rule 5 Priority Boost(주기 S 마다 모든 작업을 최상위 큐로 끌어올림) 로 해결.\n\nGaming: time slice 거의 끝날 즈음 짧게 I/O 를 걸어 양보하는 척하면 강등 규칙을 회피해 상위에 남을 수 있다. → Better Accounting(해당 큐에서의 누적 사용량으로 강등 여부를 판단) 로 해결.\n\nBehavior Change: 처음엔 CPU-bound 였다가 뒤늦게 인터랙티브 성격으로 바뀌는(또는 반대) 경우 한번 강등되면 회복이 어렵다. → 역시 주기적 Priority Boost 로 재평가 기회를 제공해 해결.',
      rubric: [
        '세 문제의 정의 명확',
        'Priority Boost 가 어떤 문제를 해결하는지',
        'Better Accounting 의 역할',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch05-mc-4',
      type: 'multiple-choice',
      prompt:
        'MLFQ 에서 "I/O 를 자주 부르는" 작업이 상위 큐에 머무는 이유로 가장 정확한 것은?',
      options: [
        { text: '규칙이 I/O 호출 횟수를 카운트해 우선순위를 올리기 때문' },
        { text: 'I/O 가 발생하면 자동으로 최상위 큐로 boost 되기 때문' },
        { text: 'time slice 를 다 쓰기 전에 CPU 를 양보하므로 강등 조건이 충족되지 않기 때문' },
        { text: 'I/O-bound 작업은 MLFQ 의 특수 규칙으로 분리 관리되기 때문' },
      ],
      answerIndex: 2,
      explanation:
        'MLFQ 는 "time slice 를 다 썼느냐" 만 본다. I/O 로 도중에 양보하면 같은 레벨 유지. I/O-bound 는 이 덕에 상위에 남는다.',
    },
    {
      id: 'ch05-mc-5',
      type: 'multiple-choice',
      prompt:
        'Priority Boost 의 주기 S 를 설정할 때의 트레이드오프로 가장 정확한 것은?',
      options: [
        { text: 'S 가 너무 크면 starvation 위험 / S 가 너무 작으면 MLFQ 가 RR 처럼 변함' },
        { text: 'S 와 성능은 무관하다.' },
        { text: 'S 가 크면 context switch 가 증가한다.' },
        { text: 'S 가 작을수록 CPU-bound 작업의 turnaround 가 좋아진다.' },
      ],
      answerIndex: 0,
      explanation:
        'S 너무 큼 → 하위 큐가 오래 굶음. S 너무 작음 → 모두 상위로 자주 올라가 우선순위 의미가 희석되고 RR 에 가까워짐.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch05-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        'I/O 로 양보할 때의 처리 — 이전 규칙(time slice 직전 I/O 로 gaming 가능) 과 개선된 규칙(누적 allotment 유지) 을 구분.',
      segments: [
        { kind: 'text', text: 'void on_yield_for_io(proc_t *p) {\n    // 이전 규칙: "다 쓰기 전에 양보" → 슬라이스 사용량을 0 으로 리셋\n    // 개선 규칙: used_in_level 은 ' },
        { kind: 'blank', answers: ['유지', '그대로', 'keep', 'not reset'], width: 8 },
        { kind: 'text', text: ' (누적 추적 유지)\n    p->state = BLOCKED;\n    // level 은 바꾸지 않고, 같은 큐로 복귀 예정\n    p->level = p->level;   // no-op\n}\n' },
      ],
      explanation:
        '개선된 규칙의 핵심은 "I/O 양보 시에도 해당 레벨의 누적 사용량을 유지" — gaming 차단.',
    },

    // ── 추가 : True / False ───────────────────────
    {
      id: 'ch05-tf-5',
      type: 'true-false',
      prompt:
        'MLFQ 에서 같은 우선순위 큐 안의 작업 두 개에 대해서는 스케줄러가 SJF 에 따라 선택한다.',
      answer: false,
      explanation: '같은 큐 안에서는 Round Robin 이다. SJF 는 쓰이지 않는다.',
    },
    {
      id: 'ch05-tf-6',
      type: 'true-false',
      prompt:
        '새 작업을 항상 최상위 큐에서 시작하게 하는 이유는, "일단 짧은 작업일 가능성이 있다고 보고 우선 반응성을 준 뒤, 실제 CPU 를 길게 쓰면 그때 강등하기" 위함이다.',
      answer: true,
    },
    {
      id: 'ch05-tf-7',
      type: 'true-false',
      prompt:
        '하위 큐의 time slice 를 길게 잡으면, 해당 큐의 CPU-bound 작업에 한 번 들어갔을 때 context switch 오버헤드가 줄어들어 전체 처리량이 개선된다.',
      answer: true,
    },
    {
      id: 'ch05-tf-8',
      type: 'true-false',
      prompt:
        'Priority Boost 는 starvation 과 behavior change 문제를 모두 해결하지만, gaming 문제는 그대로 남긴다.',
      answer: true,
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch05-short-3',
      type: 'short-answer',
      prompt:
        'MLFQ 에서 프로세스가 강등되는 단 하나의 공식 조건을, 개선된 규칙 기준으로 간결히 표현하시오.',
      answers: [
        '현재 레벨에서의 누적 사용량이 allotment 를 초과할 때',
        '해당 큐의 allotment 를 다 썼을 때',
        '누적 allotment 초과',
        '현재 레벨에서 누적 사용량 >= allotment',
      ],
      hint: 'allotment 라는 단어를 포함',
      explanation:
        '개선된 Rule 4: 한 레벨에서의 누적 사용량이 그 레벨의 allotment 를 초과하면 강등.',
    },
    {
      id: 'ch05-short-4',
      type: 'short-answer',
      prompt:
        '큐 레벨별 time slice 가 10ms / 20ms / 40ms 이고 한 프로세스가 최상위에서 시작해 각 큐의 allotment(= time slice) 를 모두 소모했다면, 이 프로세스가 거친 총 CPU 시간은? (숫자만, 단위 ms)',
      answers: ['70', '70ms', '70 ms'],
      explanation: '10 + 20 + 40 = 70ms 후 최하위 큐에 도달.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch05-essay-3',
      type: 'essay',
      prompt:
        'MLFQ 의 "개선된 Rule 4(Better Accounting)" 가 왜 gaming 을 근본적으로 막을 수 있는지, gaming 시나리오와 대비해 설명하시오.',
      modelAnswer:
        '원래 Rule 4 는 "한 번의 time slice 를 다 썼는가" 만 강등의 기준으로 썼다. 악성 프로세스는 time slice 가 끝날 즈음(예: 99%) 에 의도적으로 I/O 를 살짝 걸어 "양보" 처리되게 만들었고, 그 순간 슬라이스 카운트가 리셋되어 강등을 피할 수 있었다. 이렇게 하면 CPU 를 거의 다 쓰면서도 상위 큐에 영구히 머무는 것이 가능했다 — gaming.\n\nBetter Accounting 은 기준을 "한 번의 time slice" 가 아닌 "해당 큐에서의 누적 CPU 사용량(allotment)" 으로 바꾼다. 여러 번 나눠 양보했더라도 총 사용량이 allotment 를 초과하면 강등된다.\n\n따라서 악성 프로세스가 몇 번에 나눠 I/O 를 걸든 상관없이, 실제로 CPU 를 allotment 만큼 누적해서 쓰면 하위 큐로 내려가게 된다. 누적량은 속일 수 없으므로 gaming 이 실질적으로 불가능해진다.',
      rubric: [
        '원래 Rule 4 의 허점(슬라이스 단위 리셋)',
        'Gaming 시나리오를 구체적으로 설명',
        '누적 allotment 로 기준 변경의 효과',
      ],
    },
  ],
};

export default quiz;
