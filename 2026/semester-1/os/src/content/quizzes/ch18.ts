import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '18-threads-concurrency',
  chapterNumber: 18,
  title: 'Threads & Concurrency',
  description: '공유 vs per-thread, PCB/TCB, context switch 비교, race condition 트레이스 — counter++ 기계어 빵꾸 포함.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch18-tf-1',
      type: 'true-false',
      prompt: '같은 프로세스의 thread 들은 page table 을 공유하므로, thread 간 context switch 에서는 page table base register 를 바꿀 필요가 없다.',
      answer: true,
      explanation: '같은 주소 공간 = 같은 virtual→physical 매핑. 그래서 TLB entry 도 그대로 유효해 process switch 보다 가볍다.',
    },
    {
      id: 'ch18-tf-2',
      type: 'true-false',
      prompt: 'thread 는 user stack 만 따로 가지면 되고, kernel stack 은 프로세스당 하나를 공유한다.',
      answer: false,
      explanation:
        'kernel stack 도 thread 마다 따로 있다. trap 으로 kernel mode 에 들어가면 "그 thread 의" kernel stack 으로 SP 가 전환된다.',
    },
    {
      id: 'ch18-tf-3',
      type: 'true-false',
      prompt: 'pthread_create 로 thread 를 만든 순서대로 실행된다는 보장이 있다.',
      answer: false,
      explanation: 'thread scheduling 은 nondeterministic. A→B 로 만들었어도 B 가 먼저 출력될 수 있다.',
    },
    {
      id: 'ch18-tf-4',
      type: 'true-false',
      prompt: 'lock 을 잡고 있는 동안에는 timer interrupt 가 와도 context switch 가 일어나지 않는다.',
      answer: false,
      explanation:
        'lock 은 context switch 를 막는 장치가 아니다. switch 는 일어날 수 있지만 다른 thread 가 같은 critical section 에 "들어가지" 못하게 막을 뿐이다.',
    },
    {
      id: 'ch18-tf-5',
      type: 'true-false',
      prompt: 'heap 은 thread 마다 따로 있어서 한 thread 가 malloc 한 데이터를 다른 thread 가 직접 볼 수 없다.',
      answer: false,
      explanation: 'code·data·heap 은 공유다. 그래서 데이터 공유가 쉽고, 동시에 race condition 의 무대가 된다. 따로인 것은 stack(과 PC/SP/register).',
    },
    {
      id: 'ch18-tf-6',
      type: 'true-false',
      prompt: 'thread stack 사이의 guard page 는 stack 이 옆 영역을 조용히 덮어쓰는 것을 막고 overflow 를 SIGSEGV 로 잡기 위한 것이다.',
      answer: true,
      explanation: 'PROT_NONE 페이지라 건드리는 순간 fault — stack overflow 감지 장치.',
    },
    {
      id: 'ch18-tf-7',
      type: 'true-false',
      prompt: 'counter++ 는 C 코드 한 줄이므로 하나의 atomic 한 동작으로 실행된다.',
      answer: false,
      explanation: '기계어로는 load → add → store 3 단계. 그 사이에 context switch 가 끼어들 수 있어 atomic 하지 않다.',
    },
    {
      id: 'ch18-tf-8',
      type: 'true-false',
      prompt: '프로세스 간 데이터 공유에는 pipe·socket·shared memory 같은 IPC 가 필요하지만, 같은 프로세스의 thread 끼리는 heap/data 를 통해 바로 공유할 수 있다.',
      answer: true,
      explanation: '같은 address space 를 보기 때문. 빠르고 편리하지만 그만큼 위험(race condition)하다.',
    },
    {
      id: 'ch18-tf-9',
      type: 'true-false',
      prompt: 'trap 이 일어나면 CPU 는 user stack 에서 같은 thread 의 kernel stack 으로 옮겨가 실행하며, 이때 PCB 와 page table 은 손대지 않는다.',
      answer: true,
      explanation: 'register 를 그 thread 의 kernel stack/TCB 에 저장하고 kernel SP 로 교체할 뿐 — process 차원 정보는 그대로다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch18-mc-1',
      type: 'multiple-choice',
      prompt: '다음 중 같은 프로세스의 thread 들이 "공유하지 않는" 것은?',
      options: [
        { text: 'code (text) 영역' },
        { text: 'heap' },
        { text: 'file descriptor table' },
        { text: 'stack 과 register 상태' },
      ],
      answerIndex: 3,
      explanation: 'PC·SP·register·stack(user/kernel 둘 다)은 실행 흐름마다 달라야 하므로 thread 별로 따로 둔다.',
    },
    {
      id: 'ch18-mc-2',
      type: 'multiple-choice',
      prompt: 'PCB 와 TCB 에 들어가는 정보가 올바르게 짝지어진 것은?',
      options: [
        { text: 'PCB: PC·SP·register / TCB: PID·address space' },
        { text: 'PCB: PID·address space·FD table / TCB: TID·PC·SP·register state' },
        { text: 'PCB 와 TCB 는 같은 정보를 중복 저장한다' },
        { text: 'PCB: thread 별 kernel stack / TCB: page table' },
      ],
      answerIndex: 1,
      explanation: '프로세스 전체가 공유하는 정보는 PCB 에, thread 마다 달라지는 실행 상태는 TCB 에.',
    },
    {
      id: 'ch18-mc-3',
      type: 'multiple-choice',
      prompt: 'thread context switch 가 process context switch 보다 가벼운 가장 중요한 이유는?',
      options: [
        { text: 'thread 는 register 를 저장할 필요가 없기 때문' },
        { text: '주소 공간(page table)이 그대로 유지되어 page table base 교체와 TLB flush 가 필요 없기 때문' },
        { text: 'thread 는 kernel mode 에 진입하지 않기 때문' },
        { text: 'thread 는 scheduler 를 거치지 않기 때문' },
      ],
      answerIndex: 1,
      explanation: 'PC/SP/register 교체는 동일하지만 주소 공간 관련 비용(page table base, TLB)이 빠진다.',
    },
    {
      id: 'ch18-mc-4',
      type: 'multiple-choice',
      prompt: '강의에서 제시한 thread 를 쓰는 이유 세 가지에 해당하지 않는 것은?',
      options: [
        { text: '멀티코어에서의 병렬화 (parallelism)' },
        { text: 'blocking I/O 를 다른 작업과 overlap' },
        { text: '데이터 공유가 쉬움 (IPC 불필요)' },
        { text: 'thread 간 완전한 격리(isolation) 보장' },
      ],
      answerIndex: 3,
      explanation: '격리는 오히려 process 의 장점. thread 는 공유가 쉬운 대신 격리가 없다 — 한쪽이 죽으면 같이 죽는다.',
    },
    {
      id: 'ch18-mc-5',
      type: 'multiple-choice',
      prompt: 'counter = 50 에서 Thread 1·2 가 각각 counter++ 를 한 번씩 실행했는데 최종값이 51 이 되는 직접적인 원인은?',
      options: [
        { text: 'int overflow' },
        { text: '두 thread 가 모두 50 을 register 로 읽은 뒤, 한쪽의 51 저장을 다른 쪽의 51 저장이 덮어쓰기 때문' },
        { text: 'compiler 최적화로 ++ 가 한 번 생략되기 때문' },
        { text: 'cache 가 무효화되어 메모리 값이 사라지기 때문' },
      ],
      answerIndex: 1,
      explanation:
        'load-add-store 사이에 끼어들면 둘 다 "50 → 51" 을 계산해 저장 — 두 번 더했는데 한 번만 반영된다. 이것이 race condition.',
    },
    {
      id: 'ch18-mc-6',
      type: 'multiple-choice',
      prompt: '다음 용어 정의 중 틀린 것은?',
      options: [
        { text: 'Race condition — 실행 타이밍에 따라 결과가 달라지는 상황' },
        { text: 'Critical section — 공유 데이터에 접근해 동시에 실행되면 안 되는 코드 구간' },
        { text: 'Mutual exclusion — 한 번에 하나의 thread 만 critical section 에 들어가게 보장' },
        { text: 'Atomicity — instruction 들이 항상 정해진 순서로만 실행되는 성질' },
      ],
      answerIndex: 3,
      explanation: 'Atomicity 는 "순서" 가 아니라 일련의 instruction 들이 쪼갤 수 없는 한 덩어리처럼 실행되는 성질.',
    },
    {
      id: 'ch18-mc-7',
      type: 'multiple-choice',
      prompt: 'deadlock 의 예로 옳은 것은?',
      options: [
        { text: 'Thread A 가 lock X 를 잡고 Y 를 기다리는데, Thread B 가 lock Y 를 잡고 X 를 기다린다' },
        { text: '두 thread 가 같은 변수를 동시에 증가시켜 값이 꼬인다' },
        { text: 'thread 가 CPU 를 양보하지 않고 계속 spin 한다' },
        { text: 'reader 들이 많아 writer 가 계속 기회를 못 얻는다' },
      ],
      answerIndex: 0,
      explanation: '서로의 lock 을 기다리는 circular wait. 2 번은 race condition, 4 번은 starvation.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch18-sa-1',
      type: 'short-answer',
      prompt: '두 thread 가 각각 1,000 만 번씩 counter++ 를 수행했다. race 가 전혀 없다면 기대되는 counter 값은? (숫자만, 콤마 없이)',
      answers: ['20000000', '2000만', '2천만', '20,000,000'],
      hint: '10,000,000 × 2',
      explanation: '기대값은 2,000 만. 실제로는 race condition 때문에 매번 다른(더 작은) 값이 나온다.',
    },
    {
      id: 'ch18-sa-2',
      type: 'short-answer',
      prompt: '여러 thread 가 동시에 실행하면 안 되는 코드 구간을 부르는 용어는? (영문)',
      answers: ['critical section', 'criticalsection'],
      hint: '○○ section',
      explanation: '공유 데이터에 접근·수정하며, 동시에 실행되면 결과가 달라질 수 있는 구간.',
    },
    {
      id: 'ch18-sa-3',
      type: 'short-answer',
      prompt: 'critical section 에 한 번에 하나의 thread 만 들어가도록 보장하는 성질의 이름은? (영문)',
      answers: ['mutual exclusion', 'mutualexclusion'],
      hint: '상호 배제',
      explanation: 'mutual exclusion — lock 이 제공하는 핵심 성질.',
    },
    {
      id: 'ch18-sa-4',
      type: 'short-answer',
      prompt: 'thread 마다 달라지는 실행 상태(TID, PC, SP, register)를 저장하는 자료구조의 이름은? (영문 약어)',
      answers: ['tcb', 'TCB', 'thread control block'],
      hint: 'PCB 의 thread 버전',
      explanation: 'TCB (Thread Control Block). 프로세스 공유 정보는 PCB 에.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch18-cb-1',
      type: 'code-blank',
      prompt: 'counter++ 의 기계어 3 단계 — 각 단계의 의미를 채워라. (load / add / store 중에서)',
      language: 'text',
      segments: [
        { kind: 'text', text: 'mov 0x8049a1c, %eax    ; ' },
        { kind: 'blank', answers: ['load', 'LOAD'], width: 8 },
        { kind: 'text', text: ' — counter 값을 메모리에서 레지스터로 읽어옴\nadd $0x1, %eax         ; ' },
        { kind: 'blank', answers: ['add', 'ADD'], width: 8 },
        { kind: 'text', text: ' — 레지스터 값에 1을 더함\nmov %eax, 0x8049a1c    ; ' },
        { kind: 'blank', answers: ['store', 'STORE'], width: 8 },
        { kind: 'text', text: ' — 결과를 다시 메모리에 저장' },
      ],
      explanation: '한 줄짜리 counter++ 가 3 instruction 으로 쪼개진다 — 이 사이가 race window.',
    },
    {
      id: 'ch18-cb-2',
      type: 'code-blank',
      prompt: 'race condition 트레이스 — counter = 50 에서 시작. 표의 빈칸(메모리/레지스터 값)을 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: 'Thread 1: counter 를 register 로 읽음      // register = 50\nThread 1: register 에 1 더함               // register = ' },
        { kind: 'blank', answers: ['51'], width: 4 },
        { kind: 'text', text: '\n  -- context switch --\nThread 2: counter 를 register 로 읽음      // 메모리의 counter = ' },
        { kind: 'blank', answers: ['50'], width: 4 },
        { kind: 'text', text: '\nThread 2: +1 후 counter 에 저장            // counter = 51\n  -- context switch --\nThread 1: 자기 register 값을 counter 에 저장 // counter = ' },
        { kind: 'blank', answers: ['51'], width: 4 },
        { kind: 'text', text: '   ← 덮어쓰기!\n\n최종 counter = 51  (기대값 ' },
        { kind: 'blank', answers: ['52'], width: 4 },
        { kind: 'text', text: ')' },
      ],
      explanation: 'T1 이 store 하기 전에 T2 가 옛 값 50 을 읽어 51 을 만들고, T1 의 51 이 그 위를 다시 덮는다 — +1 하나가 증발.',
    },
    {
      id: 'ch18-cb-3',
      type: 'code-blank',
      prompt: 'lock 으로 critical section 보호하기 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'lock_t mutex;\n// ...\n' },
        { kind: 'blank', answers: ['lock(&mutex)', 'lock(&mutex);'], width: 16 },
        { kind: 'text', text: ';\nbalance = balance + 1;   // critical section\n' },
        { kind: 'blank', answers: ['unlock(&mutex)', 'unlock(&mutex);'], width: 16 },
        { kind: 'text', text: ';' },
      ],
      explanation: 'lock() 으로 진입 전 잠금 획득, unlock() 으로 해제. 한 thread 가 잡고 있는 동안 다른 thread 는 같은 구간에 못 들어온다.',
    },
    {
      id: 'ch18-cb-4',
      type: 'code-blank',
      prompt: 'thread switch 와 process switch 에서 바뀌는 것 — O/X 를 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: '항목                      | Thread switch | Process switch\nPC / SP / registers       |      O        |      O\npage table base register  |      ' },
        { kind: 'blank', answers: ['X', 'x'], width: 4 },
        { kind: 'text', text: '        |      ' },
        { kind: 'blank', answers: ['O', 'o'], width: 4 },
        { kind: 'text', text: '\naddress space             |      X        |      O\nTLB 영향                  |      ' },
        { kind: 'blank', answers: ['X', 'x', '작음'], width: 4 },
        { kind: 'text', text: '        |      O (flush / ASID 필요)' },
      ],
      explanation: 'thread switch 는 주소 공간이 그대로라 page table base 와 TLB 를 건드리지 않는다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch18-essay-1',
      type: 'essay',
      prompt:
        '"lock 이 critical section 안에서 context switch 를 막는다" 는 설명이 왜 부정확한지 지적하고, lock 이 실제로 보장하는 것이 무엇인지 서술하라.',
      modelAnswer: [
        '[부정확한 이유] 일반적인 lock(pthread mutex 등)은 context switch 자체를 막는 장치가 아니다. Thread A 가 lock 을 잡고 critical section 을 실행하는 도중에도 timer interrupt 가 오면 얼마든지 context switch 가 일어날 수 있다.',
        '',
        '[실제 보장] lock 의 핵심은 mutual exclusion — A 가 lock 을 잡고 있는 동안 다른 thread B 가 같은 lock 을 획득해 같은 critical section 에 "들어가는 것" 을 막는다. B 는 switch 되어 실행되더라도 lock() 에서 대기하므로 공유 데이터를 건드리지 못한다. 따라서 critical section 의 실행이 중간에 끊기더라도, 다른 thread 와 겹쳐 실행되지 않으므로 마치 한 덩어리(atomic)처럼 보이는 효과가 난다.',
        '',
        '[예외 보충] 커널 내부의 특정 lock 이나 interrupt disable 같은 특수한 경우에는 실제로 preemption/interrupt 를 제한하기도 하지만, 일반적인 user-level mutex 의 의미론은 "동시 진입 차단" 이다.',
      ].join('\n'),
      rubric: [
        'lock 을 든 채로도 context switch 가 일어날 수 있다는 점',
        'mutual exclusion (동시 진입 차단) 이 실제 보장이라는 점',
        '그 결과 critical section 이 atomic 하게 "보이는" 효과 설명',
      ],
    },
  ],
};

export default quiz;
