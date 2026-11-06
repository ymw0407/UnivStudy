import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '20-locks',
  chapterNumber: 20,
  title: 'Locks',
  description: 'TAS/CAS/LL-SC/FAA, Ticket Lock, park/unpark, setpark, futex, two-phase — 구현 코드 빵꾸 집중.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch20-tf-1',
      type: 'true-false',
      prompt: 'interrupt 를 끄는 lock 구현은 multiprocessor 에서도 잘 동작한다.',
      answer: false,
      explanation: 'interrupt 는 CPU(코어)마다 따로다. 한 CPU 의 interrupt 를 꺼도 다른 CPU 의 thread 가 동시에 critical section 에 들어올 수 있다.',
    },
    {
      id: 'ch20-tf-2',
      type: 'true-false',
      prompt: '단순 flag 변수 spinlock 이 깨지는 이유는 "flag 검사(test)" 와 "flag = 1 (set)" 사이에 context switch 가 끼어들 수 있기 때문이다.',
      answer: true,
      explanation: '둘 다 flag = 0 을 보고 통과한 뒤 각자 1 을 쓰면 두 thread 가 모두 critical section 안 — mutual exclusion 붕괴.',
    },
    {
      id: 'ch20-tf-3',
      type: 'true-false',
      prompt: 'TAS 기반 spinlock 은 correctness(mutual exclusion)는 만족하지만 fairness 는 보장하지 않는다.',
      answer: true,
      explanation: '오래 기다린 thread 가 다음에 lock 을 얻는다는 보장이 없어 starvation 이 가능하다. fairness 는 FAA + ticket lock 으로.',
    },
    {
      id: 'ch20-tf-4',
      type: 'true-false',
      prompt: 'single CPU 에서 spinlock 이 제대로 동작하려면 선점형(preemptive) 스케줄러가 필요하다.',
      answer: true,
      explanation: 'spin 중인 thread 가 CPU 를 계속 잡으면 lock 을 풀 thread 가 실행될 수 없다 — 선점이 있어야 lock 보유자가 돌 수 있다.',
    },
    {
      id: 'ch20-tf-5',
      type: 'true-false',
      prompt: 'multicore 에서 lock 이 곧 풀릴 상황이라면, sleep 보다 spin 이 context switch 비용이 없어서 더 빠를 수 있다.',
      answer: true,
      explanation: '짧은 대기 = spin 유리, 긴 대기 = sleep 유리. 이 관찰이 two-phase lock 의 근거다.',
    },
    {
      id: 'ch20-tf-6',
      type: 'true-false',
      prompt: 'ticket lock 은 fairness 를 해결했고, 더 이상 spin 도 하지 않는다.',
      answer: false,
      explanation: '도착 순서는 보장하지만 자기 차례(turn == myturn)가 될 때까지 여전히 while 에서 spin 한다.',
    },
    {
      id: 'ch20-tf-7',
      type: 'true-false',
      prompt: 'park/unpark 구현의 guard lock 은 critical section(balance 등) 자체를 보호하는 lock 이다.',
      answer: false,
      explanation: 'guard 는 lock 구현 내부의 공유 상태(flag 와 queue)를 보호하는 내부 spinlock 이다. 실제 critical section 보호는 flag 의 몫.',
    },
    {
      id: 'ch20-tf-8',
      type: 'true-false',
      prompt: 'futex 기반 mutex 는 경합이 없으면 kernel 에 들어가지 않고 userspace 의 atomic 명령만으로 lock 을 처리한다.',
      answer: true,
      explanation: 'fast path = userspace atomic 한 번. 경합이 있을 때만 syscall 로 kernel 의 sleep/wake 인프라를 쓴다(slow path).',
    },
    {
      id: 'ch20-tf-9',
      type: 'true-false',
      prompt: 'futex_wait(addr, expected) 는 잠들기 직전 *addr 값이 expected 와 다르면 잠들지 않고 바로 반환한다.',
      answer: true,
      explanation: '이 expected 검사가 Solaris 의 setpark 이 해결한 lost wakeup 을 인자 하나로 처리한다.',
    },
    {
      id: 'ch20-tf-10',
      type: 'true-false',
      prompt: 'TAS 는 기존 값이 무엇이든 무조건 새 값을 쓰지만, CAS 는 기존 값이 expected 와 같을 때만 새 값을 쓴다.',
      answer: true,
      explanation: '그래서 0/1 lock 에는 둘 다 쓸 수 있지만, 다중 상태나 lock-free 자료구조에는 조건부 쓰기인 CAS 가 적합하다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch20-mc-1',
      type: 'multiple-choice',
      prompt: 'lock 구현을 평가하는 세 가지 기준은?',
      options: [
        { text: 'Correctness · Fairness · Performance' },
        { text: 'Latency · Throughput · Bandwidth' },
        { text: 'Atomicity · Consistency · Isolation' },
        { text: 'Safety · Liveness · Security' },
      ],
      answerIndex: 0,
      explanation: 'mutual exclusion 이 깨지지 않는가 / starvation 없는가 / 오버헤드는 작은가.',
    },
    {
      id: 'ch20-mc-2',
      type: 'multiple-choice',
      prompt: 'interrupt 끄기 방식의 문제점이 아닌 것은?',
      options: [
        { text: '응용 프로그램을 너무 신뢰해야 한다 (안 켜면 CPU 독점)' },
        { text: 'multiprocessor 에서는 다른 CPU 의 접근을 못 막는다' },
        { text: '긴 시간 꺼 두면 중요한 interrupt 를 놓칠 수 있다' },
        { text: 'atomic instruction 보다 hardware 비용이 크다' },
      ],
      answerIndex: 3,
      explanation: '제시된 한계는 신뢰 문제·멀티프로세서 무력·interrupt 유실 세 가지다.',
    },
    {
      id: 'ch20-mc-3',
      type: 'multiple-choice',
      prompt: 'TAS spinlock 에서 TestAndSet(&lock->flag, 1) 의 반환값이 0 이라는 것의 의미는?',
      options: [
        { text: 'lock 이 이미 잡혀 있어서 실패했다' },
        { text: '이전에 lock 이 비어 있었고(0), 내가 1 로 바꿨으므로 lock 획득 성공' },
        { text: 'flag 가 0 으로 초기화되지 않았다' },
        { text: '다른 thread 가 동시에 lock 을 잡았다' },
      ],
      answerIndex: 1,
      explanation: '"옛값 읽기 + 1 쓰기" 가 atomic 이므로, 옛값 0 = 내가 처음 잡은 것. 옛값 1 = 누군가 이미 보유 → spin.',
    },
    {
      id: 'ch20-mc-4',
      type: 'multiple-choice',
      prompt: '값이 0=unlocked, 1=locked, 2=sleeping, 3=destroyed 처럼 여러 상태를 갖는 동기화 구조에 CAS 가 TAS 보다 적합한 이유는?',
      options: [
        { text: 'CAS 가 TAS 보다 항상 빠르기 때문' },
        { text: '"정확히 0 일 때만 1 로 바꿔라, 다른 상태면 건드리지 마라" 는 조건부 변경이 가능하기 때문' },
        { text: 'TAS 는 멀티코어에서 동작하지 않기 때문' },
        { text: 'CAS 는 lock 없이도 deadlock 을 일으키지 않기 때문' },
      ],
      answerIndex: 1,
      explanation: 'TAS 는 무조건 새 값을 덮어쓰므로 2(sleeping) 같은 상태를 깨뜨릴 수 있다.',
    },
    {
      id: 'ch20-mc-5',
      type: 'multiple-choice',
      prompt: 'LL/SC (Load-Linked / Store-Conditional) 의 동작 원리는?',
      options: [
        { text: '읽기와 쓰기를 하나의 거대한 명령으로 합친다' },
        { text: 'LL 로 읽은 뒤, 그 주소가 다른 누군가에 의해 수정되지 않았을 때만 SC 의 쓰기가 성공한다' },
        { text: '쓰기를 두 번 수행해 검증한다' },
        { text: '메모리 버스를 영구히 잠근다' },
      ],
      answerIndex: 1,
      explanation: 'read-modify-write 를 두 개의 단순 명령으로 쪼개고, 그 사이의 변경 여부를 hardware 가 감시 — RISC 철학.',
    },
    {
      id: 'ch20-mc-6',
      type: 'multiple-choice',
      prompt: 'yield 방식의 한계로 옳은 것을 모두 고른 조합은? (a) context switch 비용 누적 (b) 순서 보장 없음 → starvation 여전 (c) mutual exclusion 이 깨짐',
      options: [
        { text: '(a) 만' },
        { text: '(a), (b)' },
        { text: '(b), (c)' },
        { text: '(a), (b), (c)' },
      ],
      answerIndex: 1,
      explanation: 'CPU 낭비는 줄지만 lock 획득 순서는 관리하지 않는다. mutual exclusion 자체는 TAS 가 보장하므로 (c) 는 아님.',
    },
    {
      id: 'ch20-mc-7',
      type: 'multiple-choice',
      prompt: 'park/unpark 방식의 lost wakeup 은 정확히 어느 틈에서 발생하는가?',
      options: [
        { text: 'queue_add 와 guard 해제 사이' },
        { text: 'guard 해제(m->guard = 0) 후 park() 호출 직전 — 이 틈에 unpark 가 먼저 도착하는 경우' },
        { text: 'park() 와 unpark() 가 동시에 호출될 때' },
        { text: 'TAS 가 실패했을 때' },
      ],
      answerIndex: 1,
      explanation: '아직 잠들지 않은 thread 에게 보낸 unpark 신호는 그냥 흘러가고, 그 뒤의 park() 는 영영 깨어나지 못한다.',
    },
    {
      id: 'ch20-mc-8',
      type: 'multiple-choice',
      prompt: 'Two-Phase Lock 의 동작으로 옳은 것은?',
      options: [
        { text: '두 개의 lock 을 항상 같은 순서로 잡는다' },
        { text: '먼저 잠깐 spin 해 보고, 일정 시간 안에 못 얻으면 sleep 으로 전환한다' },
        { text: '먼저 sleep 하고, 깨어나면 spin 한다' },
        { text: 'lock 을 두 단계로 나눠 절반씩 잡는다' },
      ],
      answerIndex: 1,
      explanation: '짧은 대기에는 spin(전환 비용 없음), 긴 대기에는 sleep(CPU 절약) — 두 장점을 결합한 hybrid.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch20-sa-1',
      type: 'short-answer',
      prompt: 'thread 들에게 atomic 하게 "번호표" 를 나눠 주어 ticket lock 의 기반이 되는 atomic instruction 의 이름은? (영문)',
      answers: ['fetch-and-add', 'fetch and add', 'fetchandadd', 'faa', 'fetch-and-add (faa)'],
      hint: '값을 +1 하면서 옛값을 반환',
      explanation: 'FetchAndAdd — 동시에 호출해도 서로 다른 old 값을 받으므로 도착 순서대로 번호표가 발급된다.',
    },
    {
      id: 'ch20-sa-2',
      type: 'short-answer',
      prompt: 'Solaris 에서 "나 곧 잘 거다" 를 미리 등록해 lost wakeup 을 끊는 system call 의 이름은? (영문)',
      answers: ['setpark', 'setpark()'],
      hint: 'park 의 친구',
      explanation: 'setpark() 이후의 park() 는 그 사이 들어온 unpark 를 기억해 즉시 반환한다.',
    },
    {
      id: 'ch20-sa-3',
      type: 'short-answer',
      prompt: 'Linux 에서 user-level lock 과 kernel-level sleep/wakeup 을 연결하는 장치의 이름은? (영문)',
      answers: ['futex', 'futex (fast userspace mutex)', 'fast userspace mutex'],
      hint: 'Fast Userspace muTEX',
      explanation: '경합 없으면 userspace atomic 만, 경합 시에만 futex_wait/futex_wake 로 kernel 진입.',
    },
    {
      id: 'ch20-sa-4',
      type: 'short-answer',
      prompt: 'x86 의 atomic exchange 명령으로, TAS 구현에 쓰이며 자동으로 memory bus lock 이 걸리는 instruction 은? (영문 소문자)',
      answers: ['xchg'],
      hint: 'exchange 의 줄임',
      explanation: 'xchg %eax, (%ebx) — 레지스터와 메모리 한 워드를 atomic 하게 맞바꾼다.',
    },
    {
      id: 'ch20-sa-5',
      type: 'short-answer',
      prompt: 'futex mutex 구현에서 mutex int 의 31번(최상위) bit 가 1 이라는 것은 무슨 상태를 뜻하는가? (한글 또는 영문 한 단어)',
      answers: ['lock이 잡혀 있음', 'locked', '잠김', 'lock 잡힘', 'lock이 잡힘', '락이 잡혀있음', 'lock이 잡혀있음'],
      hint: '나머지 하위 bit 들은 대기 thread 수',
      explanation: '최상위 bit = lock 상태 (1 = locked), 하위 bit = waiter count. 그래서 mutex 값이 음수면 lock 이 잡혀 있는 상태.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸 — 강의 구현 코드
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch20-cb-1',
      type: 'code-blank',
      prompt: 'TestAndSet 의 정의와 그것으로 만든 spinlock — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int TestAndSet(int *ptr, int new) {\n    int old = *ptr;\n    *ptr = ' },
        { kind: 'blank', answers: ['new', 'new;'], width: 6 },
        { kind: 'text', text: ';\n    return ' },
        { kind: 'blank', answers: ['old', 'old;'], width: 6 },
        { kind: 'text', text: ';        // 이 전체가 atomic\n}\n\nvoid lock(lock_t *lock) {\n    while (TestAndSet(&lock->flag, 1) == ' },
        { kind: 'blank', answers: ['1'], width: 4 },
        { kind: 'text', text: ')\n        ;  // spin-wait\n}\n\nvoid unlock(lock_t *lock) {\n    lock->flag = ' },
        { kind: 'blank', answers: ['0', '0;'], width: 4 },
        { kind: 'text', text: ';\n}' },
      ],
      explanation:
        '"옛값을 읽고 + 새 값을 쓰고 + 옛값 반환" 이 한 atomic 명령. 반환이 1 이면 누군가 보유 중 → spin, 0 이면 내가 획득.',
    },
    {
      id: 'ch20-cb-2',
      type: 'code-blank',
      prompt: 'CompareAndSwap 으로 만든 lock — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int CompareAndSwap(int *ptr, int expected, int new) {\n    int actual = *ptr;\n    if (actual == ' },
        { kind: 'blank', answers: ['expected'], width: 10 },
        { kind: 'text', text: ')\n        *ptr = new;\n    return actual;\n}\n\nvoid lock(lock_t *lock) {\n    while (CompareAndSwap(&lock->flag, ' },
        { kind: 'blank', answers: ['0'], width: 4 },
        { kind: 'text', text: ', ' },
        { kind: 'blank', answers: ['1'], width: 4 },
        { kind: 'text', text: ') == 1)\n        ; // spin\n}' },
      ],
      explanation: '"flag 가 0 일 때만 1 로 바꿔라". 반환된 actual 이 1 이면 이미 잡혀 있던 것 → spin.',
    },
    {
      id: 'ch20-cb-3',
      type: 'code-blank',
      prompt: 'Ticket Lock — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void lock(lock_t *lock) {\n    int myturn = ' },
        { kind: 'blank', answers: ['FetchAndAdd(&lock->ticket)', 'FetchAndAdd(&lock->ticket);'], width: 28 },
        { kind: 'text', text: ';  // 번호표 발급\n    while (lock->turn != ' },
        { kind: 'blank', answers: ['myturn'], width: 8 },
        { kind: 'text', text: ')\n        ; // spin\n}\n\nvoid unlock(lock_t *lock) {\n    ' },
        { kind: 'blank', answers: ['FetchAndAdd(&lock->turn)', 'FetchAndAdd(&lock->turn);'], width: 26 },
        { kind: 'text', text: ';   // 다음 번호 호명\n}' },
      ],
      explanation: 'ticket 으로 도착 순 번호표를 받고, turn 이 내 번호가 될 때까지 spin. unlock 이 turn 을 +1 해 다음을 호명 — fairness 확보.',
    },
    {
      id: 'ch20-cb-4',
      type: 'code-blank',
      prompt: 'queue + park/unpark lock 의 lock() — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void lock(lock_t *m) {\n    while (TestAndSet(&m->guard, 1) == 1)\n        ; // guard 를 spin 으로 획득\n    if (m->flag == 0) {\n        m->flag = 1;       // lock 획득\n        m->guard = 0;\n    } else {\n        ' },
        { kind: 'blank', answers: ['queue_add(m->q, gettid())', 'queue_add(m->q, gettid());'], width: 28 },
        { kind: 'text', text: ';   // 깨울 목록에 등록\n        m->guard = ' },
        { kind: 'blank', answers: ['0', '0;'], width: 4 },
        { kind: 'text', text: ';\n        ' },
        { kind: 'blank', answers: ['park()', 'park();'], width: 10 },
        { kind: 'text', text: ';            // sleep\n    }\n}' },
      ],
      explanation:
        '못 얻으면 queue 에 자기 tid 를 넣고 guard 를 푼 뒤 park 로 잠든다. 바로 이 "guard=0 → park" 사이가 lost wakeup 의 틈.',
    },
    {
      id: 'ch20-cb-5',
      type: 'code-blank',
      prompt: 'setpark 로 lost wakeup 을 끊는 수정 — 올바른 위치에 호출을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'queue_add(m->q, gettid());\n' },
        { kind: 'blank', answers: ['setpark()', 'setpark();'], width: 12 },
        { kind: 'text', text: ';        // "곧 잘 것" 을 미리 등록\nm->guard = 0;\n' },
        { kind: 'blank', answers: ['park()', 'park();'], width: 10 },
        { kind: 'text', text: ';           // 그 사이 unpark 가 왔다면 즉시 반환' },
      ],
      explanation: 'setpark 이후의 park 는 자기보다 먼저 들어온 unpark 까지 기억하므로 신호가 흘러가 버리지 않는다.',
    },
    {
      id: 'ch20-cb-6',
      type: 'code-blank',
      prompt: 'futex 의 두 연산 — 의미를 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'futex_wait(address, expected)\n// 해당 주소의 값이 expected 와 ' },
        { kind: 'blank', answers: ['같으면', '같을 때만', '같다면'], width: 8 },
        { kind: 'text', text: ' thread 를 잠들게 한다.\n// 값이 expected 와 다르면 ' },
        { kind: 'blank', answers: ['즉시 반환', '바로 반환', '즉시 반환한다', '잠들지 않고 반환'], width: 10 },
        { kind: 'text', text: ' 한다.\n\nfutex_wake(address)\n// 해당 주소에서 기다리는 thread 중 ' },
        { kind: 'blank', answers: ['하나', '하나를', '1개'], width: 6 },
        { kind: 'text', text: ' 를 깨운다.' },
      ],
      explanation: '잠들기 직전 값 검사로 lost wakeup 방지. wake 는 한 명만 깨운다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch20-essay-1',
      type: 'essay',
      prompt:
        'park/unpark 기반 lock 에서 lost wakeup 이 발생하는 시나리오를 시간 순서(T1 이 lock 시도, T2 가 lock 보유 중)로 서술하고, setpark 가 이를 어떻게 해결하는지 설명하라.',
      modelAnswer: [
        '[시나리오 — T2 가 lock 보유, T1 이 lock() 호출]',
        't1. T1: guard 를 TAS 로 획득.',
        't2. T1: flag == 1 (T2 보유 중) → else 분기 진입.',
        't3. T1: queue_add(q, T1) — 깨울 목록에 자신을 등록.',
        't4. T1: m->guard = 0 — guard 해제. ★ 그러나 아직 park() 는 호출 전.',
        't5. context switch → T2 실행.',
        't6. T2: unlock() 진입, guard 획득.',
        't7. T2: queue 가 비어 있지 않음(T1 등록됨) 확인.',
        't8. T2: unpark(T1) 호출 — 그런데 T1 은 아직 잠들지 않았으므로 이 신호는 받을 사람 없이 흘러가 버린다.',
        't9. T2: guard 해제.',
        't10. T1 재실행: 이제서야 park() 호출 → 깨워 줄 신호는 이미 지나갔으므로 영원히 잠든다 (lost wakeup).',
        '',
        '[setpark 의 해결] t3 과 t4 사이에 setpark() 를 호출해 "나 곧 잘 것이다" 를 OS 에 미리 표시한다. setpark 이후 park 이전에 unpark 가 도착하면 OS 가 이를 기억해 두고, 이후의 park() 는 실제로 잠들지 않고 즉시 반환한다. 즉 "잠들 의향의 등록" 과 "실제 잠들기" 를 분리해, 그 사이에 끼어든 깨우기 신호가 유실되지 않게 한다. (Linux futex 는 같은 문제를 futex_wait 의 expected 값 검사로 해결한다.)',
      ].join('\n'),
      rubric: [
        'guard 해제와 park 호출 사이의 틈을 정확히 지목',
        'unpark 신호가 "아직 안 잠든 thread" 에게는 저장되지 않고 사라진다는 점',
        'setpark = 잠들 의향 선등록 → 이후 park 즉시 반환 메커니즘',
      ],
    },
    {
      id: 'ch20-essay-2',
      type: 'essay',
      prompt: 'spin lock 과 sleep(park/futex) 기반 lock 의 장단점을 비교하고, 실전 mutex 가 two-phase 전략을 쓰는 이유를 설명하라.',
      modelAnswer: [
        '[Spin] 장점 — lock 이 곧 풀리는 짧은 경합에서는 context switch(저장/복원, 캐시 오염) 없이 즉시 획득할 수 있어 지연이 가장 짧다. 단점 — 기다리는 동안 CPU 를 태운다. 특히 single CPU 에서는 lock 보유자가 실행돼야 풀리는데 대기자가 CPU 를 점유하는 자기모순적 낭비가 생긴다. fairness 도 없다.',
        '',
        '[Sleep] 장점 — 대기 중 CPU 를 다른 thread 에게 양보하므로 긴 경합에서 효율적이다. 단점 — 잠들고 깨는 데 syscall + context switch 비용이 들어, 정작 lock 이 금방 풀리는 경우에는 spin 보다 느리다. lost wakeup 같은 구현 난점도 따라온다.',
        '',
        '[Two-phase 의 이유] 경합 시간은 미리 알 수 없지만, 짧은 경합이 흔하다는 경험칙이 있다. 그래서 1단계로 잠깐 spin 해 보고(짧은 경합이면 여기서 이득), 한계를 넘으면 2단계로 sleep 에 들어간다(긴 경합이면 CPU 절약). 두 전략의 장점을 상황에 따라 취하는 hybrid 로, futex 기반의 실전 mutex 들이 이 구조를 따른다.',
      ].join('\n'),
      rubric: [
        'spin: 짧은 대기 유리 / CPU 낭비, sleep: 긴 대기 유리 / 전환 비용',
        'single CPU 에서 spin 의 자기모순 지적',
        '경합 길이를 모르므로 단계적으로 둘 다 시도한다는 논리',
      ],
    },
  ],
};

export default quiz;
