import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '04-scheduling',
  chapterNumber: 4,
  title: 'Scheduling — FIFO/SJF/STCF/RR',
  description: 'Workload 가정을 하나씩 풀어가며 발견한 네 정책과 Turnaround / Response 트레이드오프.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch04-mc-1',
      type: 'multiple-choice',
      prompt:
        '세 작업 A(100s), B(10s), C(10s) 가 t=0 에 동시 도착할 때 FIFO 순서로 실행된다. 평균 Turnaround Time 은?',
      options: [
        { text: '40 초' },
        { text: '70 초' },
        { text: '110 초' },
        { text: '120 초' },
      ],
      answerIndex: 2,
      explanation:
        '완료시각: A=100, B=110, C=120. Turnaround 는 (100+110+120)/3 = 110.',
    },
    {
      id: 'ch04-mc-2',
      type: 'multiple-choice',
      prompt:
        '같은 워크로드를 SJF 로 돌렸을 때 평균 Turnaround Time 은?',
      options: [
        { text: '40 초' },
        { text: '50 초' },
        { text: '60 초' },
        { text: '110 초' },
      ],
      answerIndex: 1,
      explanation:
        '짧은 것 먼저 → B → C → A. 완료시각: B=10, C=20, A=120. 평균 = (10+20+120)/3 = 50.',
    },
    {
      id: 'ch04-mc-3',
      type: 'multiple-choice',
      prompt:
        'SJF 와 STCF 의 차이로 가장 정확한 것은?',
      options: [
        { text: 'SJF 는 preemptive, STCF 는 non-preemptive 이다.' },
        { text: 'STCF 는 SJF 에 선점(preemption)을 더한 정책이다.' },
        { text: 'STCF 는 response time 을 최소화하는 정책이고 SJF 는 그렇지 않다.' },
        { text: '둘 다 프로세스의 실행 시간을 몰라도 동작한다.' },
      ],
      answerIndex: 1,
      explanation:
        'STCF = Shortest Time-to-Completion First. 실행 중에 더 짧은 작업이 들어오면 갈아탄다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch04-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        'RR 스케줄러의 한 주기를 나타낸다. time slice 를 다 썼을 때 해야 할 일은?',
      segments: [
        { kind: 'text', text: 'void round_robin_tick(proc_t *p) {\n    p->used_this_slice++;\n    if (p->used_this_slice >= TIME_SLICE) {\n        p->used_this_slice = 0;\n        // 현재 프로세스를 ready queue 의 ' },
        { kind: 'blank', answers: ['tail', 'back', 'end'], width: 6 },
        { kind: 'text', text: ' 에 다시 넣고\n        enqueue(ready_queue, p);\n        // 다음 프로세스를 앞에서 꺼낸다\n        run(dequeue(' },
        { kind: 'blank', answers: ['ready_queue', 'ready_q'], width: 14 },
        { kind: 'text', text: '));\n    }\n}\n' },
      ],
      explanation:
        'RR 은 큐의 뒤(tail) 에 돌려놓고 앞에서 다시 꺼내는 순환 구조다.',
    },
    {
      id: 'ch04-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        '평균 Response Time 을 계산하는 함수다. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'double avg_response(proc_t procs[], int n) {\n    double sum = 0;\n    for (int i = 0; i < n; i++) {\n        // response = 처음 CPU 받은 시각 − 도착 시각\n        sum += procs[i].first_run - procs[i].' },
        { kind: 'blank', answers: ['arrival', 'arrival_time', 'arrive'], width: 10 },
        { kind: 'text', text: ';\n    }\n    return sum / ' },
        { kind: 'blank', answers: ['n'], width: 4 },
        { kind: 'text', text: ';\n}\n' },
      ],
      explanation:
        'Response Time = T_firstrun − T_arrival.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch04-tf-1',
      type: 'true-false',
      prompt:
        'Round Robin 의 time slice 가 짧아질수록 평균 response time 은 좋아지지만 context switch 오버헤드는 늘어난다.',
      answer: true,
    },
    {
      id: 'ch04-tf-2',
      type: 'true-false',
      prompt:
        'Round Robin 은 SJF/STCF 에 비해 평균 Turnaround Time 도 일반적으로 더 좋다.',
      answer: false,
      explanation:
        'RR 은 공정성·response 는 좋지만, turnaround 는 SJF/STCF 보다 나쁜 경향이 있다.',
    },
    {
      id: 'ch04-tf-3',
      type: 'true-false',
      prompt:
        'I/O 를 고려한 스케줄러는 프로세스가 I/O 를 요청하면 해당 프로세스를 blocked 로 빼고, 그동안 다른 작업을 실행해 CPU utilization 을 올린다.',
      answer: true,
    },
    {
      id: 'ch04-tf-4',
      type: 'true-false',
      prompt:
        'SJF/STCF 가 현실에서 그대로 쓰이지 않는 근본적인 이유는, 각 작업의 실행 시간을 OS 가 미리 알 수 없기 때문이다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch04-short-1',
      type: 'short-answer',
      prompt:
        'Turnaround Time 의 정의를 수식으로 표현하시오. (형식: T_completion - T_arrival 처럼 변수명으로)',
      answers: [
        'T_completion - T_arrival',
        'T_completion-T_arrival',
        'completion - arrival',
        'T_c - T_a',
      ],
      explanation: 'Turnaround = 완료시각 − 도착시각.',
    },
    {
      id: 'ch04-short-2',
      type: 'short-answer',
      prompt:
        'A 가 t=0 에 도착(실행시간 20s), B 가 t=5 에 도착(실행시간 5s) 이다. STCF 로 스케줄할 때 두 작업의 평균 Turnaround Time 은? (숫자만)',
      answers: ['15', '15s', '15 초'],
      hint: '숫자만 입력',
      explanation:
        't=5 에 B(5s) 가 A(남은 15s)보다 짧아 선점. B 는 t=10 완료. A 는 t=10..25 에 이어서 실행 → 완료=25. Turnaround: A=25, B=10−5=5. 평균 = (25+5)/2 = 15.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch04-essay-1',
      type: 'essay',
      prompt:
        'FIFO 의 Convoy Effect 가 무엇인지, 어떤 상황에서 왜 발생하는지, SJF 가 이를 어떻게 해결하는지 설명하시오.',
      modelAnswer:
        'Convoy Effect 는 긴 작업 하나가 앞에 있어 그 뒤의 짧은 작업들이 모두 "뒤에서 기다리게 되는" 현상이다. FIFO 는 도착 순서대로 non-preemptive 로 돌리기 때문에, 예컨대 A(100s) 가 먼저 도착하고 B(10s), C(10s) 가 뒤따르면 B 와 C 는 A 가 끝날 때까지 기다려야 하고, 평균 turnaround 가 급격히 나빠진다.\n\nSJF 는 "짧은 것 먼저" 를 선택하므로, 같은 세 작업이 동시 도착할 경우 B → C → A 순서로 실행되어 짧은 작업이 앞으로 빠진다. 이렇게 하면 평균 turnaround 가 크게 줄어든다(위 예시에서 110 → 50).',
      rubric: [
        'Convoy Effect 정의',
        '발생 조건(길이 차이 + non-preemptive FIFO)',
        'SJF 의 해결 방식과 정량 효과',
      ],
    },
    {
      id: 'ch04-essay-2',
      type: 'essay',
      prompt:
        'Round Robin 의 time slice 를 결정할 때 고려해야 하는 트레이드오프와, context switch 비용을 어떻게 관리할 수 있는지 설명하시오.',
      modelAnswer:
        'Time slice 가 작을수록 각 작업이 자주 돌기 때문에 response time 이 좋아진다. 반면 context switch 가 그만큼 자주 일어나 오버헤드(레지스터 저장·복원, 캐시·TLB 오염)가 커져 실질 처리량이 떨어진다. 반대로 time slice 를 크게 잡으면 오버헤드 비율은 작아지지만 대화형 작업의 반응성이 나빠진다.\n\n관리 방법:\n- time slice 를 타이머 인터럽트 주기의 정수배로 맞춰 오버헤드 지점을 예측 가능하게 한다.\n- 일반적으로 context switch 비용(수 μs) 대비 time slice 를 수십 배 이상 크게 잡아 오버헤드 비율을 몇 % 이내로 유지한다.\n- 대화형 / 배치 작업을 구분하기 위해 나중에 MLFQ 같은 정책을 도입해, 상위 큐는 짧은 slice · 하위 큐는 긴 slice 로 운영한다.',
      rubric: [
        'Response vs overhead 트레이드오프',
        'Timer tick 과의 관계',
        '관리 방안(비율 유지 / 멀티 레벨 아이디어)',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch04-mc-4',
      type: 'multiple-choice',
      prompt:
        '세 작업 A(5s), B(8s), C(3s) 가 t=0 동시 도착할 때 SJF 와 FIFO 의 평균 Turnaround 차이는?',
      options: [
        { text: '0 초' },
        { text: '1 초' },
        { text: '2 초' },
        { text: '3 초' },
      ],
      answerIndex: 2,
      explanation:
        'FIFO(A→B→C): 완료 (5, 13, 16) 평균 = 34/3 ≈ 11.33. SJF(C→A→B): (3, 8, 16) 평균 = 27/3 = 9. 차이 ≈ 2.33 → 가장 가까운 2.',
    },
    {
      id: 'ch04-mc-5',
      type: 'multiple-choice',
      prompt:
        '다음 중 "선점(preemption)" 이 스케줄러에 주는 영향으로 틀린 것은?',
      options: [
        { text: '긴 작업이 도중에 중단되어 짧은 작업에 CPU 를 양보할 수 있다.' },
        { text: 'context switch 오버헤드가 증가한다.' },
        { text: 'non-preemptive 보다 response time 이 나빠진다.' },
        { text: '새로 도착한 짧은 작업에 즉시 대응할 수 있다.' },
      ],
      answerIndex: 2,
      explanation:
        '선점은 오히려 response time 을 좋게 하는 방향이다 (STCF, RR 참조).',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch04-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        'STCF 스케줄러의 "새 작업 도착" 처리. 남은 시간 비교 로직을 채우시오.',
      segments: [
        { kind: 'text', text: 'void on_arrival(proc_t *incoming) {\n    add_to_ready(incoming);\n    if (incoming->remaining < ' },
        { kind: 'blank', answers: ['current->remaining', 'current.remaining'], width: 20 },
        { kind: 'text', text: ') {\n        preempt(current);\n        run(' },
        { kind: 'blank', answers: ['incoming'], width: 10 },
        { kind: 'text', text: ');\n    }\n}\n' },
      ],
      explanation:
        '새 작업의 총 시간이 현재 작업의 남은 시간보다 짧으면 선점.',
    },

    // ── 추가 : True / False ───────────────────────
    {
      id: 'ch04-tf-5',
      type: 'true-false',
      prompt:
        'Round Robin 에서 time slice 를 무한대로 설정하면, 효과적으로 FIFO 와 동일해진다.',
      answer: true,
      explanation:
        '한번 잡으면 끝까지 돌아가므로 사실상 FIFO.',
    },
    {
      id: 'ch04-tf-6',
      type: 'true-false',
      prompt:
        'Response time 은 "작업이 언제 끝나느냐" 를 측정하고, Turnaround time 은 "첫 반응까지 걸린 시간" 을 측정한다.',
      answer: false,
      explanation:
        '정의가 반대로 되어 있다. Turnaround = completion − arrival, Response = first_run − arrival.',
    },
    {
      id: 'ch04-tf-7',
      type: 'true-false',
      prompt:
        'STCF 는 대기 큐에 있는 작업 뿐만 아니라, 현재 실행 중인 작업의 "남은 시간" 도 함께 비교해 선점 여부를 결정한다.',
      answer: true,
    },
    {
      id: 'ch04-tf-8',
      type: 'true-false',
      prompt:
        'CPU-bound 와 I/O-bound 작업이 섞여 있을 때 I/O 를 고려한 스케줄링은, I/O 요청으로 blocked 된 프로세스가 blocked 상태 동안 CPU 를 잡지 않도록 해 전체 utilization 을 높인다.',
      answer: true,
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch04-short-3',
      type: 'short-answer',
      prompt:
        'SJF 가 가정한 5 가지 workload 가정 중, "SJF" 스스로가 (동시 도착이라는 전제를 제외하고) 암묵적으로 깨뜨리지 않으려 쓰고 있는 가정은 무엇인가? (영문 한 단어)',
      answers: ['non-preemptive', 'nonpreemptive', 'non preemptive'],
      hint: '선점 여부',
      explanation:
        'SJF 는 non-preemptive. "한번 시작한 작업은 끝까지" 가정을 이용한다.',
    },
    {
      id: 'ch04-short-4',
      type: 'short-answer',
      prompt:
        'A(t=0 도착, 10s), B(t=2 도착, 2s), C(t=4 도착, 2s) 를 STCF 로 스케줄할 때 평균 Turnaround Time 은? (숫자만, 소수점 허용)',
      answers: ['6', '6.0', '6 초', '6.00'],
      hint: '숫자만',
      explanation:
        't=0..2 A 실행(남은 8s). t=2 B(2s) 도착 → B 선점. t=2..4 B 실행 중 t=4 C(2s) 도착, B 남은 0s 완료=4, 이후 C 완료=6. 이어 A 6..14 완료=14. Turnaround: A=14, B=4−2=2, C=6−4=2. 평균 = (14+2+2)/3 = 18/3 = 6.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch04-essay-3',
      type: 'essay',
      prompt:
        'RR 의 평균 Response Time 이 SJF/STCF 보다 일반적으로 더 좋은 이유를 구체적 예로 설명하시오.',
      modelAnswer:
        'SJF/STCF 는 짧은 작업을 먼저 "끝까지" 돌려 보내 turnaround 는 좋지만, 어떤 작업이 앞에 있으면 뒤의 모든 작업은 한동안 첫 CPU 도 받지 못한다.\n\n예: A(10s), B(10s), C(10s) 가 t=0 에 동시 도착하고 모두 실행 시간이 같다고 하자.\n- SJF: 한 작업씩 순서대로 실행. 각각의 first_run 은 0, 10, 20 → response = 0, 10, 20 → 평균 10.\n- RR (time slice 1s): 0..1 A, 1..2 B, 2..3 C, ... → first_run = 0, 1, 2 → response = 0, 1, 2 → 평균 1.\n\nRR 은 매 time slice 마다 다음 작업으로 옮겨 가므로, 모든 작업이 거의 즉시 처음 실행을 경험한다. 다만 한 작업이 끝나기까지는 다른 작업들과 CPU 를 나눠 써야 하므로 turnaround 는 악화된다. 바로 이 트레이드오프가 "response 냐 turnaround 냐" 이다.',
      rubric: [
        'Response 와 first-run 의 관계',
        '구체 수치 예시',
        'Turnaround 악화의 트레이드오프',
      ],
    },
  ],
};

export default quiz;
