export type EvolutionNode = {
  id: string;
  title: string;
  tagline: string;
  keyIdea: string;
  subIdeas?: string[];
  advantage?: string;
  problem?: string; // 다음 노드로 이어지는 불씨. 없으면 최종 노드.
  phase?: string; // 새 phase 의 첫 노드에만 지정. 렌더링 시 그 위에 구분 헤더가 붙음.
  to: { chapter: string; anchor?: string };
  // 본문 PDF 에서 크롭한 figure. public/figures/ 기준의 경로.
  image?: { src: string; alt?: string };
  // 여러 장을 붙이고 싶을 때 — image 뒤에 순서대로 표시.
  extraImages?: Array<{ src: string; alt?: string }>;
};

// ─────────────────────────────────────────────────────────────
// Scheduler Evolution — 세부 아이디어 포함
// ─────────────────────────────────────────────────────────────

export const schedulerChain: EvolutionNode[] = [
  // Phase 1: 이상화된 가정 위에서 출발
  {
    id: 'fifo',
    phase: 'Phase 1. 이상적인 가정 위에서 출발',
    title: 'FIFO / FCFS',
    tagline: '먼저 온 작업을 먼저, 끝까지.',
    keyIdea:
      '가장 단순한 정책. Ready queue의 head에서 작업을 꺼내 끝날 때까지 돌린다. Workload 가정 5개(동일 길이, 동시 도착, non-preemptive, CPU-only, 실행시간 앎)를 모두 받아들인 출발점.',
    subIdeas: [
      '모든 job이 동시 도착 + 같은 길이 → 평균 turnaround = 길이의 (n+1)/2 배',
      '메트릭: Turnaround Time = T_completion − T_arrival',
    ],
    advantage: '구현이 극도로 단순하고 context switch 오버헤드가 거의 없다.',
    problem:
      '가정을 하나만 깨도 무너진다. 길이가 다르면 긴 작업이 앞에 올 때 짧은 작업이 밀려 평균 turnaround가 폭등한다 — Convoy Effect.',
    to: { chapter: '04-scheduling', anchor: 'fifo' },
    image: { src: '/figures/ch04-fifo.png', alt: 'FIFO — 5가지 Workload 가정이 모두 유지된 출발점' },
  },
  {
    id: 'sjf',
    title: 'SJF — Shortest Job First',
    tagline: '짧은 것부터 먼저.',
    keyIdea:
      '대기 중인 작업 중 실행 시간이 가장 짧은 것을 먼저 고른다. 모든 작업이 동시 도착한다면 이론적으로 평균 turnaround 최소.',
    advantage: 'Convoy effect 해소. 짧은 작업이 긴 작업 뒤에서 굶지 않는다.',
    problem:
      'Non-preemptive다. 긴 작업이 이미 실행 중인데 더 짧은 작업이 뒤늦게 도착해도 끊을 수 없다 → 현실에서는 최적이 아니다.',
    to: { chapter: '04-scheduling', anchor: 'sjf' },
    image: { src: '/figures/ch04-sjf.png', alt: 'SJF — "가장 짧은 작업부터" 정의' },
  },
  {
    id: 'stcf',
    title: 'STCF — Shortest Time-to-Completion First',
    tagline: 'SJF + 선점(preemption).',
    keyIdea:
      '새 작업이 도착할 때마다 "현재 작업의 남은 시간 vs 새 작업의 총 실행 시간" 을 비교해 더 짧은 쪽으로 갈아탄다. Non-preemptive 가정이 제거됨.',
    advantage: '도착 시각이 달라도 평균 turnaround를 계속 최적으로 유지할 수 있다.',
    problem:
      'Response Time(첫 CPU 할당까지 걸린 시간)이 매우 나쁘다. 사용자 입장에서는 "일단 빨리 반응" 하는 편이 낫다.',
    to: { chapter: '04-scheduling', anchor: 'stcf' },
    image: { src: '/figures/ch04-stcf.png', alt: 'STCF — 가정 3 (run to completion) 제거' },
  },

  // Phase 2: 응답성 확보
  {
    id: 'rr',
    phase: 'Phase 2. 응답성 · 현실성 확보',
    title: 'Round Robin',
    tagline: '짧은 time slice로 순환.',
    keyIdea:
      '고정된 time slice(quantum) 단위로 모든 ready 작업을 순회한다. 관점이 "작업 완료 시간"에서 "첫 반응 속도" 로 이동.',
    subIdeas: [
      '메트릭 추가: Response Time = T_firstrun − T_arrival',
      'time slice ↓ → response time ↑, context switch 오버헤드 ↑',
      'time slice ↑ → 오버헤드 ↓, response time ↓ (trade-off)',
    ],
    advantage: '공정성이 좋고 인터랙티브 환경에서 반응이 빠르다.',
    problem:
      '평균 turnaround는 SJF/STCF보다 훨씬 나빠진다. 또 context switch 비용이 있고, 여전히 "실행 시간을 안다" 는 가정이 남아 있다.',
    to: { chapter: '04-scheduling', anchor: 'round-robin' },
    image: { src: '/figures/ch04-rr-timeline.png', alt: 'RR vs SJF 타임라인 비교' },
  },
  {
    id: 'io-aware',
    title: 'I/O 통합',
    tagline: 'CPU-only 가정 제거.',
    keyIdea:
      '실제 프로세스는 CPU만 쓰지 않고 I/O 도 한다. I/O 요청 시 프로세스를 blocked 로 빼고, 그동안 다른 작업을 실행한다. I/O 완료 인터럽트로 다시 ready list로 복귀.',
    subIdeas: [
      'Running → I/O 요청 → Blocked (CPU 해제)',
      'I/O 완료 → 인터럽트 → Blocked → Ready 재진입',
      'CPU 유휴 시간을 줄여 utilization을 높인다',
    ],
    advantage: 'CPU 자원을 낭비하지 않고 겹쳐 쓰게 된다.',
    problem:
      '여전히 핵심 가정 하나가 남는다 — OS가 작업 실행 시간을 미리 안다는 것. 현실에선 모른다.',
    to: { chapter: '04-scheduling' },
    image: { src: '/figures/ch04-io-overlap.png', alt: 'I/O 대기 구간에 다른 작업 겹쳐 쓰기' },
  },

  // Phase 3: Oracle 없이 살기
  {
    id: 'mlfq-basic',
    phase: 'Phase 3. Oracle 없이 살기 — MLFQ',
    title: 'MLFQ 기본 규칙 (1~4)',
    tagline: '과거 행동으로 미래를 추정.',
    keyIdea:
      '여러 우선순위 큐를 둔다. 높은 큐가 먼저 돌고, 같은 큐 내부는 RR. 새 작업은 최상위 큐에서 시작해 시간을 다 쓰면 강등, 중간에 양보하면 유지. "SJF/STCF 스타일 효과를 Oracle 없이" 가 목표.',
    subIdeas: [
      'Rule 1: 높은 우선순위 큐 먼저',
      'Rule 2: 같은 큐는 RR',
      'Rule 3: 새 작업은 최상위 큐에 배치',
      'Rule 4a: time slice 다 쓰면 강등',
      'Rule 4b: 다 쓰기 전에 양보하면 유지',
    ],
    advantage:
      '실행 시간을 몰라도 interactive는 상위, CPU-bound는 하위로 자연스럽게 분리된다.',
    problem:
      '세 가지 함정: (1) Starvation — 상위 큐가 붐비면 하위가 굶음, (2) Gaming — time slice 직전에 I/O 던져 강등 회피, (3) Behavior change — 작업 성격이 바뀔 때 대응 못함.',
    to: { chapter: '05-mlfq', anchor: 'mlfq' },
    image: { src: '/figures/ch05-mlfq-queues.png', alt: 'MLFQ 다단계 큐 구조' },
    extraImages: [
      {
        src: '/figures/ch05-mlfq-starvation.png',
        alt: '기본 규칙만 썼을 때의 Starvation — 한 큐가 CPU 를 독점',
      },
    ],
  },
  {
    id: 'priority-boost',
    title: 'Priority Boost (Rule 5)',
    tagline: '모두 최상위 큐로 주기적 승급.',
    keyIdea:
      '일정 시간 S마다 모든 작업을 최상위 큐로 끌어올린다. 굶주린 작업에도 기회를 주고, 성격이 바뀐 작업도 재평가된다.',
    advantage: 'Starvation 해소. Behavior change 에도 재적응 기회.',
    problem: 'Gaming 문제는 여전히 남는다.',
    to: { chapter: '05-mlfq' },
    image: { src: '/figures/ch05-mlfq-boost.png', alt: 'Priority Boost 적용 전/후 비교' },
    extraImages: [
      {
        src: '/figures/ch05-mlfq-boost-s50.png',
        alt: 'S=50 마다 모든 작업을 최상위 큐로 끌어올리는 Priority Boost 타임라인',
      },
    ],
  },
  {
    id: 'better-accounting',
    title: 'Better Accounting (Rule 4 개정)',
    tagline: '한 레벨에서의 누적 사용량을 추적.',
    keyIdea:
      '"한 번의 time slice를 끝까지 썼는가" 가 아니라, "해당 큐에서 누적 allotment를 다 썼는가" 로 강등 여부를 판단한다. 중간에 몇 번 양보했든 합산.',
    advantage: 'Gaming 차단 — 99% 쓰고 I/O 던지는 꼼수가 통하지 않는다.',
    problem:
      '효율성은 좋아졌지만 여전히 "공정성" 자체를 목표로 삼는 관점은 아니다. 비율 기반의 새 패러다임이 필요.',
    to: { chapter: '05-mlfq' },
    image: { src: '/figures/ch05-mlfq-allotment.png', alt: '누적 allotment 기반 강등' },
  },
  {
    id: 'mlfq-tuning',
    title: '큐별 Time Slice · Solaris MLFQ',
    tagline: '하위 큐일수록 길게.',
    keyIdea:
      '하위 큐의 CPU-bound 작업은 한 번 잡았을 때 오래 돌게 하면 context switch 오버헤드가 줄어든다. Solaris는 60개 큐, ~1초 마다 boost.',
    subIdeas: [
      '상위 큐: 짧은 time slice (10ms) — 반응성 우선',
      '하위 큐: 긴 time slice (40ms+) — 처리량 우선',
      'Solaris time-sharing class: 큐 60개 + 1s 주기 boost',
    ],
    advantage: 'MLFQ의 실무 튜닝. 상위와 하위의 목적 차를 time slice로 분리.',
    problem:
      'MLFQ 가지치기로 최적화했지만, 근본적으로 "비율을 정확히 맞춘다" 는 목표는 없다 → Fair-Share 패러다임으로 관점 전환.',
    to: { chapter: '05-mlfq' },
    image: { src: '/figures/ch05-mlfq-timeslices.png', alt: '큐 레벨별 time slice' },
  },

  // Phase 4: Fair-Share 패러다임
  {
    id: 'lottery',
    phase: 'Phase 4. Fair-Share — 비율을 맞춘다',
    title: 'Lottery Scheduling',
    tagline: '티켓으로 CPU 비율 표현.',
    keyIdea:
      '각 프로세스에 티켓을 나눠 주고, 매 time slice마다 무작위 추첨으로 하나를 뽑아 실행한다. 시행 횟수가 많아질수록 기대 비율에 수렴(Monte Carlo 직관).',
    subIdeas: [
      'A 75장 / B 25장 → 장기적으로 A:B = 3:1 실행',
      '구현: 티켓 누적합으로 linked list 순회',
      'Fairness 지표 U = T_first / T_last — 1에 가까울수록 공평',
    ],
    advantage: '상태 관리가 간단하다. 비율을 직관적으로 표현 가능.',
    problem:
      '확률적이다. 짧은 구간에서는 실제 비율이 기대치에서 크게 흔들릴 수 있다.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'lottery-scheduling' },
    image: { src: '/figures/ch06-lottery.png', alt: '당첨 티켓 → 실행 순서' },
  },
  {
    id: 'ticket-mechanisms',
    title: 'Ticket Currency · Transfer · Inflation',
    tagline: '티켓 운영의 세 가지 확장.',
    keyIdea:
      '비율의 표현력을 실무적으로 확장하는 세 메커니즘. 사용자/그룹이 자체 단위를 쓰되(currency), 프로세스 간 양도 가능하고(transfer), 동적으로 부풀릴 수도 있다(inflation).',
    subIdeas: [
      'Ticket Currency — 로컬 자율성 + 전역 공정성',
      'Ticket Transfer — 협력 관계(클라→서버 위임 등)에서 몫 이전',
      'Ticket Inflation — 일시적 우선순위 상승',
    ],
    advantage: '실전 워크로드에 맞는 유연한 자원 분배 정책 표현.',
    problem:
      '메커니즘을 다 갖춰도, 스케줄링 자체가 "확률적" 이라는 본질 한계는 남는다.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'lottery-scheduling' },
    image: { src: '/figures/ch06-lottery-currency.png', alt: 'Ticket currency — 로컬/전역 변환' },
  },
  {
    id: 'stride',
    title: 'Stride Scheduling',
    tagline: 'Lottery를 결정적으로.',
    keyIdea:
      '각 프로세스에 stride = 큰상수 / 티켓수 를 부여하고, 매 실행마다 pass 값을 stride만큼 증가. 가장 pass가 작은 프로세스를 선택.',
    subIdeas: [
      '티켓 많음 → stride 작음 → 자주 선택',
      'pass 값으로 정확한 비율 유지, 랜덤 불필요',
      'Lottery 대비: 추가 상태(pass)를 프로세스마다 유지',
    ],
    advantage: '확률적 흔들림 없이 결정적으로 비율을 맞춘다.',
    problem:
      '새 프로세스가 pass=0 으로 들어오면 한동안 CPU를 독점. sleep→wake 후에도 pass 보정이 필요.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'stride-scheduling' },
    image: { src: '/figures/ch06-stride.png', alt: 'Stride/pass 값 추적 표' },
  },

  // Phase 5: 현대 리눅스
  {
    id: 'cfs-vruntime',
    phase: 'Phase 5. 실전 리눅스 — CFS',
    title: 'CFS — vruntime 선택',
    tagline: '가장 덜 쓴 프로세스를 고른다.',
    keyIdea:
      '실행된 만큼을 가중치 보정한 값이 vruntime. 매 스케줄 결정마다 vruntime이 가장 작은 프로세스를 실행한다. Stride의 pass 아이디어를 현대적으로 일반화.',
    advantage: '"지금까지 덜 받은 쪽 먼저" 라는 직관 그대로 구현.',
    problem:
      '고정 time slice면 프로세스 수 변화에 적응 못함. 실제 CPU 사용량을 어떻게 "공평" 하게 측정할지도 설계 필요.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'cfs-completely-fair-scheduling' },
    image: { src: '/figures/ch06-cfs-vruntime.png', alt: 'vruntime 가중치 계산 표' },
  },
  {
    id: 'cfs-latency',
    title: 'sched_latency · min_granularity',
    tagline: '가변 time slice + 하한선.',
    keyIdea:
      'n개의 ready 프로세스가 있을 때 각 time slice = sched_latency / n. 즉 모두가 한 번씩 도는 "기대 주기" 를 고정한다. 단, 너무 짧아지지 않도록 min_granularity로 최소값 보장.',
    subIdeas: [
      '예: sched_latency=48ms, 4개 → 각 12ms',
      '프로세스 수 ↑ → slice ↓ → 하지만 min_granularity로 바닥',
      'RR의 고정 quantum 한계를 동적으로 해소',
    ],
    advantage: 'context switch 비용을 제어하면서도 반응성을 유지.',
    problem: '이제 비율도 반영해야 한다. 모두가 정말 똑같은 비율이어야 할까?',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'cfs-completely-fair-scheduling' },
    image: { src: '/figures/ch06-cfs-latency.png', alt: 'sched_latency 를 n개로 나눈 타임라인' },
  },
  {
    id: 'cfs-nice-weight',
    title: 'nice value · weight',
    tagline: '정책적 비율 부여.',
    keyIdea:
      'nice (-20~19)을 weight로 매핑. time_slice_i = (weight_i / Σweight) × sched_latency. vruntime도 실제 실행시간에 weight_0/weight_i를 곱해 가중 보정 → 우선순위 높은 쪽의 vruntime이 천천히 증가 → 더 자주 선택됨.',
    subIdeas: [
      'nice −5 → weight ≈ 3121 (큰 몫)',
      'nice 0  → weight = 1024 (기본)',
      'nice 값이 높다 = CPU를 더 양보하는 착한 프로세스',
    ],
    advantage: '공정함을 유지하면서도 정책적 차등이 가능.',
    problem: '매 틱마다 "최소 vruntime" 을 빠르게 찾아야 한다. 자료구조 선택이 중요.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'cfs-completely-fair-scheduling' },
    image: { src: '/figures/ch06-cfs-nice.png', alt: 'nice → weight → time slice 매핑' },
  },
  {
    id: 'cfs-rbtree',
    title: 'Red-Black Tree 기반 Ready Queue',
    tagline: 'O(log n) 삽입·삭제·최솟값.',
    keyIdea:
      '왼쪽일수록 vruntime이 작은 RB-tree로 ready queue 구현. 가장 왼쪽 노드가 다음 실행 대상.',
    advantage: '수천 프로세스 환경에서도 일정한 오버헤드.',
    problem:
      '오랫동안 잠들어 있던 프로세스가 깨어나 vruntime이 극단적으로 작으면 CPU를 독점할 수 있다.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'cfs-completely-fair-scheduling' },
    image: { src: '/figures/ch06-cfs-rbtree.png', alt: 'Red-Black Tree 기반 ready queue' },
  },
  {
    id: 'cfs-sleep-boost',
    title: 'Sleep / Wake vruntime 보정',
    tagline: '깨어난 프로세스의 공정성.',
    keyIdea:
      '깨어난 프로세스의 vruntime이 트리의 최소값보다 지나치게 작지 않도록 끌어올려 보정. "오래 잠든 보너스" 가 불공정 독점이 되지 않게 막는다.',
    advantage: 'Stride에서 pass=0 문제로 남았던 "새/깨어난 프로세스 독점" 을 해결.',
    to: { chapter: '06-lottery-stride-cfs', anchor: 'cfs-completely-fair-scheduling' },
  },
];

// ─────────────────────────────────────────────────────────────
// Memory Virtualization Evolution — 세부 아이디어 포함
// ─────────────────────────────────────────────────────────────

export const memoryChain: EvolutionNode[] = [
  // Phase 1: 가상화 이전
  {
    id: 'single-process',
    phase: 'Phase 1. 가상화 이전 — 문제의 발견',
    title: '단일 프로세스 시대',
    tagline: '가상화가 필요 없던 시절.',
    keyIdea:
      'OS + 프로그램 하나. 실행 파일을 그대로 메모리에 로드하고 돌린다. 주소 변환도, 보호도 필요 없다.',
    advantage: '극도로 단순한 구조.',
    problem: '여러 프로그램을 동시에 돌리기 시작하면 서로의 메모리를 침범할 수 있다.',
    to: { chapter: '08-address-space', anchor: 'address-space' },
    image: { src: '/figures/ch08-single-process.png', alt: 'OS + 단일 프로그램 메모리 레이아웃' },
    extraImages: [
      {
        src: '/figures/ch08-memory-simple.png',
        alt: '주소 공간 기본 구성 — kernel / stack / heap / data / code',
      },
    ],
  },
  {
    id: 'multiprogramming',
    title: 'Multiprogramming 등장',
    tagline: 'Protection issue.',
    keyIdea:
      '여러 프로세스를 물리 메모리의 서로 다른 구역에 나눠 배치. 하지만 각자 physical address를 직접 쓰게 두면 실수/악의적 접근으로 남의 메모리, OS까지 깨질 수 있다.',
    problem: '보호와 효율을 동시에 만족시킬 추상화가 필요하다.',
    to: { chapter: '08-address-space' },
    image: { src: '/figures/ch08-multiprogramming.png', alt: '여러 프로세스가 물리 메모리에 공존' },
  },

  // Phase 2: Address Space 추상화
  {
    id: 'address-space',
    phase: 'Phase 2. Address Space 추상화',
    title: 'Virtual Address Space',
    tagline: '프로세스마다 자기만의 주소 공간.',
    keyIdea:
      '모든 주소는 virtual. 프로세스는 물리 메모리를 직접 보지 않고 가상 주소 공간(code / data / bss / heap / stack)만 본다. OS + 하드웨어가 뒤에서 mapping을 수행한다.',
    subIdeas: [
      '32-bit = 4GB = user 2GB + kernel 2GB 대략',
      '힙은 위로, 스택은 아래로 자람 (그 사이 큰 hole)',
      'main/malloc/지역변수 주소를 찍으면 각각 text/heap/stack 영역이 드러남',
    ],
    advantage: '프로세스 간 격리 + 프로그래머 입장에서의 단순화.',
    problem: '어떻게 이 가상 주소를 물리 주소로 빠르게 변환할 것인가?',
    to: { chapter: '08-address-space', anchor: 'address-space' },
    image: { src: '/figures/ch08-address-space.png', alt: 'code / heap / stack 가상 주소 공간 레이아웃' },
    extraImages: [
      {
        src: '/figures/ch08-memory-simple.png',
        alt: '단순화된 레이아웃 — kernel / stack / heap / data / code',
      },
      {
        src: '/figures/ch08-process-address-space.png',
        alt: '리눅스 3G user + 1G kernel 주소 공간 상세 구조',
      },
    ],
  },

  // Phase 3: 연속 재배치
  {
    id: 'base-bound',
    phase: 'Phase 3. 연속 재배치 (Dynamic Relocation)',
    title: 'Base & Bound',
    tagline: '레지스터 두 개로 시작.',
    keyIdea:
      'CPU에 base + bound 레지스터. physical = virtual + base, 단 virtual < bound. 모든 번역과 검사는 하드웨어 회로가 한 번에.',
    subIdeas: [
      'base = 프로세스 시작 물리 주소',
      'bound = 유효 가상 주소 범위',
      'virtual 0 이 반드시 physical 0 일 필요 없음 — 어디든 배치 가능',
    ],
    advantage: '단순 · 빠름 · 보호까지 한 번에.',
    problem: '전체 주소 공간이 하나의 "큰 연속 블록" 으로 잡힌다. stack↔heap 사이 빈 공간도 통째로 물리 메모리를 차지 → 낭비.',
    to: { chapter: '09-base-and-bound' },
    image: { src: '/figures/ch09-base-bound.png', alt: 'base + bound 레지스터로 가상 → 물리 변환' },
  },
  {
    id: 'base-bound-hw-os',
    title: 'HW 요건 · OS 개입 시점',
    tagline: 'Privileged 모드 · 예외 · 3대 개입.',
    keyIdea:
      'Base/Bound는 하드웨어 + OS의 협업. privileged instruction으로만 세팅 가능하고, 초과 접근은 예외를 발생시켜 OS 핸들러로 간다. OS는 세 순간에 개입한다.',
    subIdeas: [
      'HW: 사용자 모드 물리 접근 금지 / CPU 레지스터로 base/bound / 변환·검사 회로 / 예외 발생 능력',
      'OS 개입 ①: 프로세스 시작 — free list에서 공간 찾기',
      'OS 개입 ②: 프로세스 종료 — 메모리 회수',
      'OS 개입 ③: context switch — PCB에 base/bound 저장·복원',
    ],
    advantage: '하드웨어 단순성을 유지한 채 OS가 정책 결정을 담당.',
    problem: '여전히 주소 공간 "전체" 를 연속으로 잡는다 — 내부의 빈 틈이 그대로 낭비.',
    to: { chapter: '09-base-and-bound', anchor: 'hardware-requirements' },
    image: { src: '/figures/ch09-context-switch.png', alt: 'Context switch 시 PCB 의 base/bound 저장·복원' },
  },

  // Phase 4: 논리 단위별로 쪼개기
  {
    id: 'segmentation-basic',
    phase: 'Phase 4. 논리 단위로 쪼개기 — Segmentation',
    title: 'Segmentation 기본',
    tagline: 'code / heap / stack 각각 base·bound.',
    keyIdea:
      '주소 공간을 의미 있는 세그먼트로 쪼개고 각각에 별도 base/bound. 어느 세그먼트인지 판별 → 그 안에서의 offset → bounds 검사 → base 더하기.',
    subIdeas: [
      'heap 4KB부터라면 가상 4200번지 = offset 104 (= 4200−4096)',
      '세그먼트마다 물리 메모리 어디든 독립적으로 놓을 수 있음',
    ],
    advantage: 'sparse address space 지원. code sharing 기반 마련.',
    problem: '어느 세그먼트인지 어떻게 판별하지? 스택은 반대 방향으로 자라는데?',
    to: { chapter: '10-segmentation' },
    image: { src: '/figures/ch10-segmentation-basic.png', alt: 'code / heap / stack 세그먼트가 물리 메모리에 분산 배치' },
  },
  {
    id: 'segmentation-bits',
    title: 'Direction Bit · Protection Bit',
    tagline: '세그먼트 부가 속성.',
    keyIdea:
      '스택은 아래로 자라므로 direction bit가 필요. 코드 세그먼트 공유를 위한 protection bit(read-only)도. 이 둘이 붙어야 현대적 세그먼트가 된다.',
    subIdeas: [
      'direction: grow-positive (code, heap) / grow-negative (stack)',
      'protection: code → read·execute, heap/stack → read·write',
      'code sharing: Vim 여러 개 → code 세그먼트 1개 물리 공유',
    ],
    advantage: 'code 공유로 물리 메모리 절약 + 쓰기 보호로 안전.',
    to: { chapter: '10-segmentation' },
    image: { src: '/figures/ch10-seg-direction.png', alt: 'Stack 세그먼트 — 역방향 성장 + "Grows Positive?" 비트' },
  },
  {
    id: 'segmentation-identify',
    title: 'Explicit vs Implicit 식별',
    tagline: '세그먼트 번호를 어떻게 알리나.',
    keyIdea:
      '두 접근. Explicit: 가상 주소 상위 비트에 세그먼트 번호를 넣음(예: 상위 2비트). Implicit: 그 주소를 어떤 레지스터로 접근했는지로 추론(PC면 code, SP면 stack).',
    subIdeas: [
      'Explicit — 주소 표현력을 상위 비트만큼 잃음',
      'Implicit — 표현력 손해 없음, 대신 규칙이 암묵적',
    ],
    advantage: '두 방식 모두 실제 CPU에서 사용된 역사.',
    problem:
      '그런데 세그먼트는 가변 크기 + contiguous 배치라는 특성 때문에 더 큰 문제가 기다리고 있다.',
    to: { chapter: '10-segmentation' },
    image: { src: '/figures/ch10-seg-bits.png', alt: '가상 주소 상위 비트로 세그먼트 식별' },
  },
  {
    id: 'external-fragmentation',
    title: 'External Fragmentation',
    tagline: '총량은 있는데 못 넣는다.',
    keyIdea:
      '가변 크기 세그먼트를 여기저기 놓다 보면 물리 메모리에 작은 빈틈들이 생긴다. 총 free 용량은 충분해도 "큰 연속 공간" 이 없어서 새 세그먼트를 못 받는다.',
    problem: 'Compaction? — 비싸다. 실행 중 세그먼트 이동 + 메모리 복사 + base 전부 재설정.',
    to: { chapter: '10-segmentation' },
    image: { src: '/figures/ch10-external-fragmentation.png', alt: '압축 전/후 비교 — external fragmentation' },
  },

  // Phase 5: 가변 크기 할당의 실전
  {
    id: 'free-list',
    phase: 'Phase 5. 가변 크기 할당의 실전 (힙)',
    title: 'Free List · Splitting · Coalescing',
    tagline: '남은 빈 공간을 어떻게 관리하나.',
    keyIdea:
      '빈 chunk들을 linked list로. 요청이 오면 적절한 chunk를 찾아 splitting, free 시에는 이웃과 coalescing 해서 다시 큰 chunk로. 힙 전반의 기본 연산.',
    subIdeas: [
      'Allocated chunk: header (size + magic) 앞에 숨김 → free(ptr)가 크기를 몰라도 됨',
      'Free chunk: (size + next) 로 노드 역할',
      'Double free → 리스트가 꼬여 free chunk 유실',
      'heap 부족 시 sbrk/brk 로 OS에 확장 요청',
    ],
    advantage: '가변 크기 요청을 유연하게 처리.',
    problem: '어떤 chunk를 고를 것인가? 정책이 필요.',
    to: { chapter: '11-free-space-management' },
    image: { src: '/figures/ch11-free-list.png', alt: 'heap + free list (head → node → NULL)' },
    extraImages: [
      {
        src: '/figures/ch11-free-alloc-dealloc.png',
        alt: '128B heap — allocation 4회 후 deallocation(5~8) 시 빈틈이 생기는 과정',
      },
    ],
  },
  {
    id: 'fit-policies',
    title: 'Fit 정책 (best · worst · first · next)',
    tagline: '어떤 free chunk를 선택할까.',
    keyIdea:
      '동일한 free list를 보더라도 선택 규칙에 따라 단편화와 속도 특성이 달라진다.',
    subIdeas: [
      'best-fit — 남는 공간 최소화, 탐색 비용 크고 작은 자투리 증가',
      'worst-fit — 큰 덩어리를 잘라 씀, 작은 요청에 과잉 할당',
      'first-fit — 앞에서부터 맞으면 바로, 앞쪽에 자투리 집중',
      'next-fit — 직전 탐색 위치부터 계속, 탐색 분산',
    ],
    problem: '그래도 가변 크기 할당의 근본 단편화는 남는다.',
    to: { chapter: '11-free-space-management' },
    image: { src: '/figures/ch11-fit-policies.png', alt: 'best-fit vs worst-fit 결과 비교' },
    extraImages: [
      {
        src: '/figures/ch11-free-alloc-basic.png',
        alt: '요청 크기에 따른 splitting — 128B heap 기본 할당 시퀀스',
      },
    ],
  },
  {
    id: 'segregated-list',
    title: 'Segregated List · McKusick-Karels',
    tagline: '크기별로 전용 풀.',
    keyIdea:
      '32·64·128·256B 같은 size class별 free list를 따로 둔다. 요청이 오면 맞는 리스트에서 즉시 꺼냄. 페이지 내부는 동일 크기 버퍼 집합으로 운영.',
    advantage: '같은 크기 요청이 반복될 때 탐색 비용이 극단적으로 낮다.',
    problem: '크기별로 얼마나 미리 확보할지 — 정책 복잡성이 증가.',
    to: { chapter: '11-free-space-management' },
    image: { src: '/figures/ch11-segregated.png', alt: 'Segregated list — 크기별 전용 풀' },
  },
  {
    id: 'buddy',
    title: 'Buddy System',
    tagline: '반씩 쪼개고 짝끼리 합친다.',
    keyIdea:
      '모든 블록을 2의 거듭제곱 크기로 관리. 필요하면 반으로 쪼개고, free 시 짝(buddy) 블록이 비어 있으면 다시 합친다. 주소·크기만으로 buddy를 계산 가능.',
    advantage: '연쇄 coalescing이 자연스러움. 페이지 서브시스템과 궁합 좋음.',
    problem:
      '2의 거듭제곱 단위라 33B 요청에 64B 할당 → Internal Fragmentation. 그리고 가변 크기라는 근본 한계는 여전히 남는다.',
    to: { chapter: '11-free-space-management' },
    image: { src: '/figures/ch11-buddy-split.png', alt: 'Buddy System — 반씩 분할' },
    extraImages: [
      {
        src: '/figures/ch11-buddy-in-action.png',
        alt: 'Buddy System 동작 — freelist · 블록 배치 · bitmap 연동',
      },
      {
        src: '/figures/ch11-internal-fragmentation.png',
        alt: 'Internal Fragmentation — Assigned Space 중 Used Space 만 실제 사용',
      },
    ],
  },

  // Phase 6: 고정 크기 패러다임
  {
    id: 'paging',
    phase: 'Phase 6. 고정 크기 패러다임 — Paging',
    title: 'Paging 기본',
    tagline: 'page · frame 고정 크기로 통일.',
    keyIdea:
      '가상 주소 공간을 page(예: 4KB), 물리 메모리를 같은 크기의 frame으로 자른다. 가상 주소 = VPN + offset. 어느 물리 frame인지는 Page Table이 기록.',
    subIdeas: [
      '물리 메모리 어디든 빈 frame만 있으면 끼워 넣음',
      'heap/stack 성장을 미리 정교하게 예측할 필요 없음',
      'external fragmentation 사실상 소멸',
    ],
    advantage: '가변 크기 할당의 고질병에서 벗어남.',
    problem: '메모리 접근마다 PTE를 먼저 읽어야 해 2배 느리다.',
    to: { chapter: '12-paging-intro' },
    image: { src: '/figures/ch12-paging.png', alt: '가상 주소 공간을 page → frame 으로 매핑' },
  },
  {
    id: 'pte-flags',
    title: 'Page Table Entry 구성',
    tagline: 'PFN + 여러 보조 비트.',
    keyIdea:
      'PTE는 단순 매핑이 아니라 보호·상태까지 품는다.',
    subIdeas: [
      'Valid — 매핑 자체가 유효한가',
      'R/W — 쓰기 허용',
      'U/S — 사용자/커널 권한',
      'Present — 현재 메모리에 있는가 (swap 여부)',
      'Accessed / Dirty — 참조 / 변경 추적',
    ],
    advantage: '보호 + 존재 + 접근 이력을 한 엔트리가 통합 관리.',
    problem: '프로세스당 page table 자체가 크고, 매 접근마다 이걸 읽어야 한다 → 느리다.',
    to: { chapter: '12-paging-intro' },
    image: { src: '/figures/ch12-pte.png', alt: 'x86 PTE 비트 구성' },
  },

  // Phase 7: 번역 가속
  {
    id: 'tlb',
    phase: 'Phase 7. 번역 가속 — TLB',
    title: 'TLB 기본',
    tagline: '최근 번역을 MMU 캐시에.',
    keyIdea:
      'MMU 내부의 작은 하드웨어 캐시. VPN → PFN 을 저장. hit면 page table 방문 생략. 배열 순차 접근이면 70%+ hit가 자연스럽게 난다.',
    subIdeas: [
      'Temporal locality — 방금 쓴 주소는 또 쓴다',
      'Spatial locality — 근처 주소는 같은 페이지일 확률이 높음',
    ],
    advantage: 'paging의 번역 오버헤드를 locality로 상쇄.',
    problem: 'miss 처리는 누가 하지? 프로세스가 바뀌면 어떻게 되지?',
    to: { chapter: '13-tlb' },
    image: { src: '/figures/ch13-tlb.png', alt: 'MMU / TLB / Page Table 흐름' },
  },
  {
    id: 'tlb-miss-handling',
    title: 'HW-managed vs SW-managed',
    tagline: 'TLB miss를 누가 처리하나.',
    keyIdea:
      'CISC(x86): 하드웨어가 직접 page table을 walk해 TLB를 채우고 재시도. RISC 일부: 예외를 발생시켜 OS trap handler가 처리.',
    subIdeas: [
      'HW-managed — 빠르고 OS 개입 없음, 설계 경직',
      'SW-managed — 유연, OS가 page table 구조를 자유롭게',
    ],
    to: { chapter: '13-tlb' },
  },
  {
    id: 'tlb-asid',
    title: 'ASID · Context Switch',
    tagline: '프로세스 구분 태그.',
    keyIdea:
      'TLB는 CPU당 1개이므로 A의 VPN 10과 B의 VPN 10을 구분할 필요. 각 TLB entry에 ASID(Address Space ID)를 태그 → flush 없이 공존.',
    subIdeas: [
      '(VPN, ASID) → PFN 로 키를 확장',
      '공유 페이지는 서로 다른 ASID가 같은 PFN을 가리키면 자연스럽게 처리',
    ],
    advantage: 'context switch마다 TLB flush하는 비용 회피.',
    to: { chapter: '13-tlb' },
    image: { src: '/figures/ch13-asid.png', alt: 'ASID 태그가 붙은 TLB (두 프로세스 공존)' },
  },
  {
    id: 'tlb-replace',
    title: 'LRU Replacement',
    tagline: '한정된 entry를 어떻게 교체하나.',
    keyIdea:
      '32~128개 정도의 entry에 새 매핑을 넣으려면 누군가를 뺀다. Temporal locality를 믿고 가장 오래 안 쓰인 것을 버린다(LRU).',
    advantage: '지역성에 잘 맞는 간단하고 효과적인 정책.',
    problem: 'TLB가 있어 빠르긴 한데, page table 자체의 크기 문제는 그대로 남아 있다.',
    to: { chapter: '13-tlb' },
    image: { src: '/figures/ch13-tlb-lru.png', alt: 'TLB LRU replacement' },
    extraImages: [
      {
        src: '/figures/ch13-lru-korean.png',
        alt: 'LRU 교체 예 — 참조 페이지 번호 시퀀스와 page fault / 교체 지점',
      },
    ],
  },

  // Phase 8: 테이블 공간 줄이기
  {
    id: 'pt-too-big',
    phase: 'Phase 8. Page Table 공간 줄이기',
    title: '선형 Page Table이 너무 크다',
    tagline: '프로세스당 4MB의 부담.',
    keyIdea:
      '32bit + 4KB page + 4B PTE → 2^20 × 4B = 4MB. 프로세스 100개면 400MB. 문제는 대부분의 가상 공간이 비어 있는데도 테이블이 그 전체를 커버한다는 점.',
    problem: 'invalid entry가 대량으로 존재 — 공간이 그냥 버려진다.',
    to: { chapter: '14-smaller-tables' },
    image: { src: '/figures/ch14-linear-pt.png', alt: '선형 page table 크기 계산 (4MB/프로세스)' },
  },
  {
    id: 'bigger-page',
    title: '그냥 Page 크기를 키우면?',
    tagline: '기각되는 대안.',
    keyIdea:
      'page size ↑ → 엔트리 수 ↓ → page table ↓. 계산상은 맞지만, 한 페이지 크기가 커지면 안 쓰는 바이트까지 한 덩어리로 잡혀 Internal Fragmentation이 폭증.',
    problem: '공간 트레이드오프를 조금 옮기는 수준이지 본질을 해결하지 못한다.',
    to: { chapter: '14-smaller-tables' },
  },
  {
    id: 'hybrid',
    title: 'Hybrid (Segmentation + Paging)',
    tagline: '세그먼트별 page table.',
    keyIdea:
      '가상 주소 = SN + VPN + offset. 세그먼트마다 자기 page table. 세그먼트 사이의 큰 hole은 page table에서도 표현하지 않음.',
    advantage: '주소 공간이 희소할 때 유의미한 절약.',
    problem:
      '세그먼트 내부는 여전히 선형 page table. 힙이 희소하게 쓰이면 invalid entry는 여전히 쌓인다.',
    to: { chapter: '14-smaller-tables' },
    image: { src: '/figures/ch14-hybrid.png', alt: 'Hybrid — 세그먼트별 page table 주소 포맷' },
  },
  {
    id: 'two-level',
    title: 'Multi-Level Page Table — 2단계',
    tagline: 'Page Directory → Page Table Page.',
    keyIdea:
      'page table 자체를 page 단위로 쪼개고, 전부 invalid인 조각은 아예 할당하지 않는다. 상위 Page Directory Entry가 "그 아래 테이블 존재 여부" 를 표시.',
    subIdeas: [
      'VA = PDI + PTI + offset',
      'PDBR → PDE → (있으면) Page Table Page → PTE',
      'invalid PDE 한 칸으로 "이 영역 전체 없음" 을 표현 가능',
    ],
    advantage: '실제로 쓰는 영역에 비례해서만 공간 소비 → sparse 주소공간에 최적.',
    problem: 'TLB miss 시 메모리 접근이 1회 → 2회로 늘어난다.',
    to: { chapter: '14-smaller-tables', anchor: 'multi-level-page-table' },
    image: { src: '/figures/ch14-two-level.png', alt: '선형 page table vs 2단계 page table 비교' },
  },
  {
    id: 'deeper-levels',
    title: '더 깊은 레벨 (3·4단계)',
    tagline: 'Page Directory도 커지면 또 쪼갠다.',
    keyIdea:
      '주소 공간이 크거나 page가 작으면 Page Directory조차 한 페이지를 넘긴다. 이때는 Directory를 가리키는 또 다른 상위 테이블을 둔다 → 3단계, 4단계. 64비트 시스템은 보통 4단계.',
    subIdeas: [
      '예: 30bit VA + 512B page → 21bit VPN, PTE 128개/page → 2단계로 커버 안 됨',
      'Linux x86_64: PGD → P4D → PUD → PMD → PTE',
    ],
    problem: '단계가 깊어질수록 TLB miss 시 메모리 접근 횟수가 비례해서 늘어난다.',
    to: { chapter: '14-smaller-tables' },
    image: { src: '/figures/ch14-multilevel.png', alt: '3단계 이상의 깊은 계층 page table' },
  },
  {
    id: 'time-space',
    title: 'Time-Space Trade-off',
    tagline: '공간 절약 ↔ 번역 비용.',
    keyIdea:
      'Multi-level은 공간 면에서 큰 이득이지만 TLB miss 때 메모리 접근이 단계 수만큼 늘어난다. 이 손해는 TLB hit rate로 상쇄.',
    advantage:
      '일반 워크로드에서는 TLB가 대부분 hit → 실제 비용은 크지 않음. 공간 절약은 확실하다.',
    to: { chapter: '14-smaller-tables' },
  },
  {
    id: 'inverted',
    title: 'Inverted Page Table',
    tagline: '관점을 뒤집는다 — PFN 기준.',
    keyIdea:
      '가상 공간 크기 대신 물리 메모리 크기에 비례하는 단 하나의 테이블. 각 PFN 마다 (프로세스, VPN) 을 기록.',
    subIdeas: [
      '프로세스 수가 많아도 테이블은 하나',
      '총 엔트리 수 = 물리 프레임 수',
      'lookup이 VPN→PFN 방향이 아니라 역방향이라 해시·검색 자료구조 필요',
    ],
    advantage: '프로세스 많을수록 상대적 절약 효과가 크다.',
    problem:
      '검색 난이도가 근본적으로 올라간다 — 공간을 아끼는 대신 시간(lookup) 비용이 늘어난다.',
    to: { chapter: '14-smaller-tables' },
  },

  // Phase 9: 통합 정리
  {
    id: 'summary',
    phase: 'Phase 9. 큰 그림',
    title: '시간 ↔ 공간 그리고 계층화',
    tagline: 'coarse → fixed → hierarchical.',
    keyIdea:
      '거친 재배치(Base/Bound) → 논리 단위(Segmentation) → 가변 관리의 한계 → 고정 단위(Paging) → 번역 가속(TLB) → 계층화(Multi-Level)로 이어진 한 줄기. 각 단계는 "시간을 벌거나, 공간을 아끼거나" 의 결정.',
    to: { chapter: '17-memory-summary' },
  },
];
