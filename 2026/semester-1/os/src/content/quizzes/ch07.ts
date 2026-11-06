import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '07-scheduler-summary',
  chapterNumber: 7,
  title: 'Scheduler 정리',
  description: 'FIFO 부터 CFS 까지, 변천사를 관통하는 핵심 아이디어 점검.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch07-mc-1',
      type: 'multiple-choice',
      prompt:
        '스케줄러의 진화를 "가정 제거" 관점에서 볼 때, 다음 대응 중 올바른 것은?',
      options: [
        { text: 'SJF → 작업 길이가 같다는 가정 제거' },
        { text: 'STCF → 동시 도착 가정을 복원 (다시 동일 도착 가정)' },
        { text: 'RR → 작업 실행 시간을 안다는 가정 제거' },
        { text: 'MLFQ → 작업 실행 시간을 안다는 가정 제거' },
      ],
      answerIndex: 3,
      explanation:
        'Oracle 없이도 돌아가게 만든 것이 MLFQ 의 핵심. RR 은 관점이 turnaround → response time 으로 바뀐 것이지, 실행 시간 가정과 직접 연관은 아니다.',
    },
    {
      id: 'ch07-mc-2',
      type: 'multiple-choice',
      prompt:
        '다음 정책 중 "비례 공정(Proportional Share)" 범주에 속하지 않는 것은?',
      options: [
        { text: 'Lottery' },
        { text: 'Stride' },
        { text: 'CFS' },
        { text: 'MLFQ' },
      ],
      answerIndex: 3,
      explanation:
        'MLFQ 는 우선순위 + 피드백 방식이고, 명시적으로 비율을 맞추지 않는다.',
    },
    {
      id: 'ch07-mc-3',
      type: 'multiple-choice',
      prompt:
        '다음 중 "반응성(Response Time) 우선" 관점이 가장 강한 정책은?',
      options: [
        { text: 'FIFO' },
        { text: 'SJF' },
        { text: 'Round Robin' },
        { text: 'Stride' },
      ],
      answerIndex: 2,
      explanation: 'RR 은 response time 을 최적화하기 위해 도입되었다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch07-code-1',
      type: 'code-blank',
      language: 'c',
      prompt: 'Turnaround / Response 메트릭 정의를 수식으로.',
      segments: [
        { kind: 'text', text: 'double turnaround(proc_t *p) {\n    return p->' },
        { kind: 'blank', answers: ['completion', 'completion_time'], width: 14 },
        { kind: 'text', text: ' - p->arrival;\n}\n\ndouble response(proc_t *p) {\n    return p->' },
        { kind: 'blank', answers: ['first_run', 'firstrun', 'first run'], width: 14 },
        { kind: 'text', text: ' - p->arrival;\n}\n' },
      ],
      explanation: 'Turnaround = completion − arrival, Response = first_run − arrival.',
    },
    {
      id: 'ch07-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        '스케줄러 분류 상수를 채우시오 — 각 정책이 속한 범주.',
      segments: [
        { kind: 'text', text: '// Turnaround 최적화 위주\nconst int TURNAROUND_FOCUSED[] = { SJF, STCF };\n\n// Response/공정성 중시\nconst int FAIRNESS_FOCUSED[] = { RR };\n\n// Oracle 없이 행동 기반으로 학습\nconst int FEEDBACK_BASED[]   = { ' },
        { kind: 'blank', answers: ['MLFQ'], width: 6 },
        { kind: 'text', text: ' };\n\n// 비례 공정성\nconst int PROPORTIONAL[]     = { LOTTERY, STRIDE, ' },
        { kind: 'blank', answers: ['CFS'], width: 6 },
        { kind: 'text', text: ' };\n' },
      ],
      explanation: 'MLFQ 는 feedback-based, CFS 는 proportional (가중치 기반).',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch07-tf-1',
      type: 'true-false',
      prompt:
        'Turnaround 와 Response time 은 일반적으로 동시에 최적화하기 쉬운 한 방향 지표다.',
      answer: false,
      explanation:
        'SJF 는 turnaround 에 좋지만 response 는 나쁘고, RR 은 반대다 — 트레이드오프 관계.',
    },
    {
      id: 'ch07-tf-2',
      type: 'true-false',
      prompt:
        'Lottery → Stride → CFS 로 갈수록 "비율을 정확히 맞추는" 능력이 강해진다.',
      answer: true,
      explanation:
        'Lottery 는 확률적, Stride 는 결정적이지만 간단, CFS 는 가중치+트리로 대규모에서도 정확.',
    },
    {
      id: 'ch07-tf-3',
      type: 'true-false',
      prompt:
        'MLFQ 의 time slice 를 하위 큐일수록 길게 주는 튜닝은 context switch 오버헤드와 관련이 깊다.',
      answer: true,
    },
    {
      id: 'ch07-tf-4',
      type: 'true-false',
      prompt:
        '스케줄러의 모든 개선은 순전히 CPU utilization 을 올리는 목적으로 이뤄져 왔다.',
      answer: false,
      explanation:
        '반응성, 공정성, 보호, 굶주림 방지 등 여러 목표가 섞여 있다.',
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch07-short-1',
      type: 'short-answer',
      prompt:
        'Lottery 스케줄러에서 "장기적으로 실제 비율과 기대 비율이 얼마나 일치하는가" 를 측정하는 지표 U 는 어떻게 정의되는가? (두 변수 이름으로)',
      answers: ['T_first / T_last', 'T_first/T_last', 'first/last', 'T_first / T_last'],
      hint: 'T_first / T_last',
      explanation:
        'Fairness U = 먼저 끝난 프로세스의 소요시간 / 나중에 끝난 프로세스의 소요시간. 1 에 가까울수록 공평.',
    },
    {
      id: 'ch07-short-2',
      type: 'short-answer',
      prompt:
        'CFS 에서 모든 프로세스가 기본 nice(=0) 를 가질 때, nice 가 +5 만큼 올라간 프로세스는 기본 대비 time slice 가 대략 몇 배 정도로 줄어드는가? (CFS weight 근사: nice 1 증가 당 약 0.8 배)',
      answers: ['0.33', '1/3', '약 1/3', '≈ 0.33'],
      hint: '5회 누적 0.8 배',
      explanation: '0.8^5 ≈ 0.33. 약 1/3 수준으로 줄어든다.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch07-essay-1',
      type: 'essay',
      prompt:
        '스케줄링 정책의 주요 평가 메트릭(Turnaround, Response, Fairness, Utilization)을 정의하고, 정책 선택에 어떤 영향을 주는지 사례와 함께 설명하시오.',
      modelAnswer:
        '- Turnaround = T_completion − T_arrival. 작업이 "언제 끝나느냐" 에 대한 지표. 배치 작업이 많을수록 중요.\n- Response = T_firstrun − T_arrival. 사용자 입장에서의 첫 반응까지 걸린 시간. 대화형 시스템에서 중요.\n- Fairness: 각 프로세스에 공평하게 CPU 가 분배되는지. 예: U = T_first/T_last 또는 vruntime 분산.\n- Utilization: CPU 가 유휴 없이 얼마나 잘 쓰이는지.\n\n사례: 서버에서 장기 배치만 돌린다면 SJF/STCF 가 유리 (Turnaround). 데스크톱/터미널 환경이라면 RR 이나 MLFQ 상위 큐가 유리 (Response). 시스템에 여러 사용자가 있으면 CFS 의 비례 공정이 맞다. I/O 가 많으면 blocked 시 다른 작업으로 전환해 Utilization 을 챙긴다.',
      rubric: [
        '네 메트릭의 정의',
        '정책과 메트릭의 매칭 예',
        '트레이드오프 의식',
      ],
    },
    {
      id: 'ch07-essay-2',
      type: 'essay',
      prompt:
        'FIFO → SJF → STCF → RR → MLFQ → Lottery → Stride → CFS 로 이어진 변천사를 "무엇이 문제였는가 / 다음 정책이 무엇을 해결했는가" 관점에서 요약하시오.',
      modelAnswer:
        'FIFO: 구현 단순. 하지만 Convoy Effect.\nSJF: 짧은 것 먼저 → turnaround 개선. 그러나 non-preemptive 라 늦게 도착한 짧은 작업을 반영 못함.\nSTCF: 선점 추가. 최적 turnaround. 그러나 response time 나쁨.\nRR: time slice 로 순환 → response 개선. turnaround 악화.\nMLFQ: 실행 시간 oracle 가정 제거. 행동 기반 피드백으로 인터랙티브/CPU-bound 자동 분리.\nLottery: 관점을 "비율" 로 전환. 확률적이라 단기 편차 큼.\nStride: 결정적 비율. pass=0 문제 / 상태 관리 부담.\nCFS: sched_latency + weighted vruntime + RB-tree 로 대규모 환경에서도 공정 + 효율 + 정책 차등 통합.',
      rubric: [
        '각 정책이 푼 문제 / 남긴 문제를 연쇄적으로 제시',
        '성능·공정성·현실성의 축 전환 언급',
      ],
    },

    // ── 추가 : 객관식 ─────────────────────
    {
      id: 'ch07-mc-4',
      type: 'multiple-choice',
      prompt:
        '다음 시나리오 중 "SJF 가 가장 좋지 않은 결과" 를 내는 경우는?',
      options: [
        { text: '모든 작업이 거의 같은 길이이고 동시 도착' },
        { text: '짧은 작업이 먼저 도착, 긴 작업이 뒤늦게 도착' },
        { text: '긴 작업이 먼저 도착하고, 그 이후에 짧은 작업들이 계속 뒤늦게 도착' },
        { text: '모든 작업이 I/O-bound' },
      ],
      answerIndex: 2,
      explanation:
        'SJF 는 non-preemptive 라 먼저 시작된 긴 작업을 끊을 수 없어, 뒤에 도착한 짧은 작업들의 response 가 계속 나빠진다. STCF 가 이 상황을 푸는 동기.',
    },
    {
      id: 'ch07-mc-5',
      type: 'multiple-choice',
      prompt:
        '"스케줄러가 실행 시간(run-time)을 알 수 있다" 는 가정을 제거한 뒤에도 turnaround 측면에서 합리적인 결과를 내는 정책은?',
      options: [
        { text: 'FIFO' },
        { text: 'SJF' },
        { text: 'MLFQ' },
        { text: 'STCF' },
      ],
      answerIndex: 2,
      explanation:
        'MLFQ 는 oracle 가정을 제거하고도 CPU-bound 를 자연스럽게 하위로 내려 SJF 에 가까운 효과를 낸다.',
    },

    // ── 추가 : 코드 빈칸 ──────────────────
    {
      id: 'ch07-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '실행 시각 기록을 활용해 Turnaround 와 Response 를 계산한다.',
      segments: [
        { kind: 'text', text: 'typedef struct proc {\n    double arrival;\n    double first_run;     // 최초 CPU 를 받은 시각 (미정이면 -1)\n    double completion;\n} proc_t;\n\ndouble turnaround(proc_t *p) { return p->completion - p->' },
        { kind: 'blank', answers: ['arrival'], width: 10 },
        { kind: 'text', text: '; }\ndouble response(proc_t *p)   { return p->first_run  - p->' },
        { kind: 'blank', answers: ['arrival'], width: 10 },
        { kind: 'text', text: '; }\n' },
      ],
      explanation: '두 메트릭 모두 arrival 을 기준으로 한다는 점이 핵심.',
    },

    // ── 추가 : True / False ──────────────
    {
      id: 'ch07-tf-5',
      type: 'true-false',
      prompt:
        '공정성(fairness) 과 효율성(throughput) 은 항상 일치하는 목표다.',
      answer: false,
      explanation:
        '예: 우선순위 기반 스케줄은 처리량에 유리할 수 있지만 공정성은 희생될 수 있음.',
    },
    {
      id: 'ch07-tf-6',
      type: 'true-false',
      prompt:
        'MLFQ 는 "Proportional Share(비례 공정)" 범주에 속한다.',
      answer: false,
      explanation:
        '우선순위 + 피드백 기반. 명시적으로 비율을 지정하지 않는다.',
    },
    {
      id: 'ch07-tf-7',
      type: 'true-false',
      prompt:
        'STCF 와 SJF 는 같은 "짧은 것 우선" 철학을 공유하지만, 선점 지원 여부에서 차이가 난다.',
      answer: true,
    },
    {
      id: 'ch07-tf-8',
      type: 'true-false',
      prompt:
        '실제 리눅스 기본 스케줄러(CFS) 는 전통적 Unix 의 "nice" 값을 의미 있게 반영한다.',
      answer: true,
    },

    // ── 추가 : 단답 ───────────────────────
    {
      id: 'ch07-short-3',
      type: 'short-answer',
      prompt:
        '다음 정책 중 "선점(preemption) 을 사용한다" 고 볼 수 있는 것을 모두 고르시오. (쉼표로 구분)\nFIFO, SJF, STCF, RR, MLFQ, Lottery, Stride, CFS',
      answers: [
        'STCF, RR, MLFQ, Lottery, Stride, CFS',
        'stcf, rr, mlfq, lottery, stride, cfs',
        'STCF,RR,MLFQ,Lottery,Stride,CFS',
      ],
      hint: 'FIFO 와 SJF 는 non-preemptive',
      explanation: 'FIFO/SJF 를 제외한 나머지 정책은 선점 가능.',
    },
    {
      id: 'ch07-short-4',
      type: 'short-answer',
      prompt:
        '두 작업 A(3s), B(3s) 가 t=0 에 동시 도착하여 RR(slice=1s) 로 돌 때, 평균 Response time 과 평균 Turnaround 는? (형식: "R=? T=?", 숫자만)',
      answers: ['R=0.5 T=5.5', 'R=0.5, T=5.5', 'r=0.5 t=5.5'],
      hint: '소수점 1자리로',
      explanation:
        'Response: A first_run=0, B first_run=1 → 평균 0.5. Turnaround: A 완료 t=5(1,3,5 중 5), B 완료 t=6 → 평균 (5+6)/2 = 5.5.',
    },

    // ── 추가 : 서술형 ─────────────────────
    {
      id: 'ch07-essay-3',
      type: 'essay',
      prompt:
        '한 시스템에서 "서버용 배치 작업(CPU-bound)" 과 "데스크톱 앱(I/O-bound, 사용자 인터랙션)" 이 섞여 있을 때 어떤 스케줄러가 적합한지 토론하시오.',
      modelAnswer:
        'SJF/STCF 는 실행 시간을 미리 알기 어려우므로 실제 시스템에서 그대로 쓸 수 없다. FIFO 는 convoy effect 로 데스크톱 반응성이 치명적으로 나빠진다. 순수 RR 은 반응성은 좋지만 배치 작업의 turnaround 가 크게 늘어난다.\n\n실전에서 가장 적합한 선택은 두 가지 방향이다.\n1) MLFQ: 인터랙티브 작업은 스스로 자주 양보하므로 상위 큐에 머물며 빠르게 응답하고, CPU-bound 배치 작업은 자연스럽게 하위 큐로 내려가 긴 time slice 로 처리량을 유지한다. Priority Boost 로 배치 작업이 굶지 않도록 한다.\n2) CFS: nice 값으로 데스크톱 프로세스에 낮은 nice 를, 배치에 높은 nice 를 주면 weight 차로 CPU 가 비례 분배된다. RB-tree 의 O(log n) 으로 확장성도 좋다.\n\n현대 리눅스는 기본 CFS 를 쓰고, 특수 케이스에서는 SCHED_FIFO / SCHED_RR 같은 실시간 클래스를 쓸 수 있다. 본 질문의 일반 워크로드에는 CFS + 적절한 nice 가 가장 실용적이다.',
      rubric: [
        '각 정책이 왜 부적합/적합한지',
        'MLFQ / CFS 의 장점을 대조',
        '실제 리눅스 관행 언급',
      ],
    },
  ],
};

export default quiz;
