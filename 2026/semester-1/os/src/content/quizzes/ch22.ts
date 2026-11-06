import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '22-condition-variables',
  chapterNumber: 22,
  title: 'Condition Variables',
  description: 'CV+state+lock 3박자, Mesa semantics와 while, Producer/Consumer 발전 단계, covering condition.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch22-tf-1',
      type: 'true-false',
      prompt: 'pthread_cond_signal 호출 시점에 wait queue 가 비어 있으면, 그 신호는 저장되었다가 다음 wait 호출 때 소비된다.',
      answer: false,
      explanation:
        'CV 의 signal 은 이벤트 기록 장치가 아니다 — 기다리는 thread 가 없으면 그냥 사라진다. 신호가 값으로 남는 것은 semaphore 의 성질.',
    },
    {
      id: 'ch22-tf-2',
      type: 'true-false',
      prompt: 'state variable(done) 없이 CV 만 쓰면, 신호를 보내는 쪽이 먼저 실행되었을 때 기다리는 쪽이 영원히 잠들 수 있다.',
      answer: true,
      explanation: 'child 가 먼저 signal → queue 비어 신호 증발 → parent 가 나중에 wait → 깨워 줄 사람 없음. done=1 이 남아 있으면 wait 자체를 건너뛴다.',
    },
    {
      id: 'ch22-tf-3',
      type: 'true-false',
      prompt: 'lock 없이 "done 검사" 와 "wait 진입" 을 따로 하면, 그 사이에 상대가 done=1 과 signal 을 모두 끝내 버려 lost wakeup 이 생길 수 있다.',
      answer: true,
      explanation: '검사~wait 사이가 race window. lock 이 "검사 + 잠들기" 를 한 덩어리로 묶어 이 틈을 없앤다.',
    },
    {
      id: 'ch22-tf-4',
      type: 'true-false',
      prompt: 'single producer + single consumer 라면 if 로 조건을 한 번만 검사하는 CV 코드도 동작한다.',
      answer: true,
      explanation:
        '강의 트레이스 그대로 — 1:1 에서는 동작한다. consumer 가 둘 이상이 되는 순간 깨어난 사이 다른 consumer 가 먼저 소비해 버려 깨진다 → while 필요.',
    },
    {
      id: 'ch22-tf-5',
      type: 'true-false',
      prompt: 'Hoare semantics 는 signal 받은 thread 의 즉시 실행을 보장하며, 그 강한 보장 때문에 Linux·Windows 등 대부분의 실제 OS 가 채택했다.',
      answer: false,
      explanation: '실제 OS 대부분은 구현이 단순한 Mesa semantics. Hoare 는 구현이 복잡해 거의 쓰이지 않는다.',
    },
    {
      id: 'ch22-tf-6',
      type: 'true-false',
      prompt: 'Mesa semantics 에서 signal 은 "너 이제 깨어날 수 있어" 라는 알림일 뿐, 깨어나 실행될 때 조건이 여전히 참이라는 보장이 없다.',
      answer: true,
      explanation: '깨어나기~실행 사이에 다른 thread 가 상태를 또 바꿀 수 있다. 그래서 while 재검사가 필수.',
    },
    {
      id: 'ch22-tf-7',
      type: 'true-false',
      prompt: 'producer 와 consumer 가 CV 하나를 같이 쓰면, consumer 의 signal 이 다른 consumer 를 깨우는 의미 없는 wakeup 이 생길 수 있다.',
      answer: true,
      explanation: 'single CV 에서는 누가 깨어날지 모른다. empty/fill 두 개로 쪼개면 신호가 항상 반대편에게만 간다.',
    },
    {
      id: 'ch22-tf-8',
      type: 'true-false',
      prompt: 'pthread_cond_broadcast 는 조건이 맞는 thread 만 골라서 깨운다.',
      answer: false,
      explanation: 'broadcast 는 전부 깨운다. 각자 깨어나 while 재검사로 자기가 진행 가능한지 확인한다 — 그래서 안전하지만 불필요한 wakeup 비용이 든다.',
    },
    {
      id: 'ch22-tf-9',
      type: 'true-false',
      prompt: '최종 Producer/Consumer 코드(CV 2개 + while)는 correctness 는 만족하지만, mutex 하나가 전체 buffer 를 보호하므로 scalability 는 제한될 수 있다.',
      answer: true,
      explanation: '그래서 고성능 병렬 환경에서는 head/tail lock 을 분리한 concurrent queue 같은 구조가 유리할 수 있다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch22-mc-1',
      type: 'multiple-choice',
      prompt: 'condition variable 을 안전하게 쓰기 위한 "3박자" 의 구성은?',
      options: [
        { text: 'condition variable + state variable + lock' },
        { text: 'condition variable + semaphore + spinlock' },
        { text: 'signal + broadcast + wait' },
        { text: 'mutex + rwlock + barrier' },
      ],
      answerIndex: 0,
      explanation: 'CV(대기 큐) + state(실제 조건 값) + lock(둘을 한 덩어리로 보호). 하나라도 빠지면 lost wakeup 또는 무한 sleep.',
    },
    {
      id: 'ch22-mc-2',
      type: 'multiple-choice',
      prompt: 'pthread_cond_wait 가 내부적으로 수행하는 동작의 묶음으로 올바른 것은?',
      options: [
        { text: '"sleep + lock 획득" 을 atomic 하게, 깨어날 때 lock 해제' },
        { text: '"sleep + lock 해제" 를 atomic 하게, 깨어날 때 lock 재획득 후 반환' },
        { text: 'sleep 만 하고 lock 은 건드리지 않음' },
        { text: 'lock 해제만 하고 sleep 은 호출자가 따로 함' },
      ],
      answerIndex: 1,
      explanation: 'Wait = Sleep + Unlock(atomic), 깨어나면 lock 을 다시 잡고 wait 에서 return.',
    },
    {
      id: 'ch22-mc-3',
      type: 'multiple-choice',
      prompt: 'busy waiting (while (done == 0) ; spin) 방식의 문제가 아닌 것은?',
      options: [
        { text: '기다리는 동안 CPU 를 낭비한다' },
        { text: 'single CPU 에서는 상대 thread 가 실행될 틈을 빼앗아 더 심각하다' },
        { text: '결과 자체가 틀리게 나온다' },
        { text: '잠들고 깨어나는 메커니즘(CV)으로 대체할 수 있다' },
      ],
      answerIndex: 2,
      explanation: 'volatile done 예제의 결과는 맞다 — 문제는 정확성이 아니라 자원 낭비.',
    },
    {
      id: 'ch22-mc-4',
      type: 'multiple-choice',
      prompt: 'consumer 가 2명일 때 "if + CV 1개" 코드가 깨지는 직접적 이유는?',
      options: [
        { text: 'producer 가 신호를 두 번 보내기 때문' },
        { text: '깨어난 Tc1 이 lock 을 재획득하기 전에 Tc2 가 먼저 lock 을 잡고 get 을 끝내, Tc1 이 빈 buffer 에 get 을 호출하기 때문' },
        { text: 'buffer 가 overflow 하기 때문' },
        { text: 'mutex 가 두 개 필요하기 때문' },
      ],
      answerIndex: 1,
      explanation: '깨어남 ≠ 즉시 실행(Mesa). 그 사이 상태가 바뀔 수 있으므로 while 로 재검사해야 한다.',
    },
    {
      id: 'ch22-mc-5',
      type: 'multiple-choice',
      prompt: 'CV 를 empty 와 fill 두 개로 나눈 뒤의 신호 방향으로 올바른 것은?',
      options: [
        { text: 'producer 는 empty 에서 자고 empty 에 signal' },
        { text: 'producer 는 empty 에서 자고 fill 에 signal / consumer 는 fill 에서 자고 empty 에 signal' },
        { text: 'producer 는 fill 에서 자고 empty 에 signal / consumer 는 empty 에서 자고 fill 에 signal' },
        { text: '둘 다 양쪽 CV 에 signal 을 보낸다' },
      ],
      answerIndex: 1,
      explanation: '"빈 칸을 기다리는 쪽(producer)" 은 empty 에서 자고, put 후에는 "찬 칸을 기다리는 쪽(consumer)" 을 fill 로 깨운다 — 신호가 항상 필요한 쪽에게만.',
    },
    {
      id: 'ch22-mc-6',
      type: 'multiple-choice',
      prompt: 'covering condition (메모리 할당기 예제) 에서 broadcast 를 쓰는 이유는?',
      options: [
        { text: 'broadcast 가 signal 보다 빠르기 때문' },
        { text: 'free 된 크기로 어떤 대기자가 진행 가능한지 알 수 없으니, 전부 깨워 각자 while 로 재검사하게 하는 것이 안전하기 때문' },
        { text: 'signal 은 deadlock 을 일으키기 때문' },
        { text: 'thread 수가 적을 때만 동작하기 때문' },
      ],
      answerIndex: 1,
      explanation: '100 byte 반환 시 50 대기자는 진행 가능, 200 대기자는 불가 — 누굴 깨울지 모르면 다 깨운다. 대가는 불필요한 wakeup.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch22-sa-1',
      type: 'short-answer',
      prompt: '"깨어난 thread 가 실행될 때 조건이 유지된다는 보장이 없는" — Linux/Windows 등 대부분 OS 가 쓰는 CV 의미론의 이름은? (영문)',
      answers: ['mesa semantics', 'mesa', 'mesa semantic'],
      hint: '반대편은 Hoare',
      explanation: 'Mesa semantics — 그래서 조건 검사는 if 가 아니라 while.',
    },
    {
      id: 'ch22-sa-2',
      type: 'short-answer',
      prompt: 'MAX = 10 인 circular buffer 에서 fill = 8 일 때 put 을 한 번 하면 fill 은 얼마가 되는가? (정수)',
      answers: ['9'],
      hint: 'fill = (fill + 1) % MAX',
      explanation: '(8+1) % 10 = 9. fill 이 9 에서 put 하면 (9+1)%10 = 0 으로 wrap.',
    },
    {
      id: 'ch22-sa-3',
      type: 'short-answer',
      prompt: 'MAX = 10 인 circular buffer 에서 fill = 9 일 때 put 을 한 번 하면 fill 은 얼마가 되는가? (정수)',
      answers: ['0'],
      hint: '% MAX 로 wrap',
      explanation: '(9+1) % 10 = 0 — 배열을 처음부터 재활용한다.',
    },
    {
      id: 'ch22-sa-4',
      type: 'short-answer',
      prompt: 'bounded buffer 개념이 등장하는 shell 예제 "grep foo file.txt | wc -l" 에서 producer 역할을 하는 명령은?',
      answers: ['grep', 'grep foo file.txt'],
      hint: '데이터를 만들어 buffer 에 넣는 쪽',
      explanation: 'grep 이 producer, wc 가 consumer — 사이에 kernel 의 bounded buffer(pipe)가 있다.',
    },
    {
      id: 'ch22-sa-5',
      type: 'short-answer',
      prompt: 'Producer/Consumer 의 state variable 로, buffer 에 현재 들어 있는 item 개수를 나타내는 변수 이름은? (강의 코드 기준, 영문)',
      answers: ['count'],
      hint: 'while (___ == MAX), while (___ == 0)',
      explanation: 'count — producer 는 count == MAX 면 대기, consumer 는 count == 0 이면 대기.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch22-cb-1',
      type: 'code-blank',
      prompt: 'CV 로 직접 구현한 join — thr_exit / thr_join 의 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int done = 0;\npthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;\npthread_cond_t c = PTHREAD_COND_INITIALIZER;\n\nvoid thr_exit() {\n    Pthread_mutex_lock(&m);\n    ' },
        { kind: 'blank', answers: ['done = 1', 'done = 1;'], width: 10 },
        { kind: 'text', text: ';                  // state variable 변경\n    ' },
        { kind: 'blank', answers: ['Pthread_cond_signal(&c)', 'Pthread_cond_signal(&c);', 'pthread_cond_signal(&c)'], width: 26 },
        { kind: 'text', text: ';\n    Pthread_mutex_unlock(&m);\n}\n\nvoid thr_join() {\n    Pthread_mutex_lock(&m);\n    while (' },
        { kind: 'blank', answers: ['done == 0', 'done==0'], width: 12 },
        { kind: 'text', text: ')\n        Pthread_cond_wait(&c, ' },
        { kind: 'blank', answers: ['&m', '&m '], width: 5 },
        { kind: 'text', text: ');\n    Pthread_mutex_unlock(&m);\n}' },
      ],
      explanation: 'state(done) 변경과 signal 은 lock 안에서, 대기는 while + cond_wait(mutex 전달) — 3박자 정석.',
    },
    {
      id: 'ch22-cb-2',
      type: 'code-blank',
      prompt: '최종 Producer/Consumer (CV 2개 + while + MAX 칸 buffer) 의 producer — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void *producer(void *arg) {\n    for (int i = 0; i < loops; i++) {\n        Pthread_mutex_lock(&mutex);              // p1\n        ' },
        { kind: 'blank', answers: ['while', 'while '], width: 7 },
        { kind: 'text', text: ' (count == ' },
        { kind: 'blank', answers: ['MAX'], width: 5 },
        { kind: 'text', text: ')                    // p2\n            Pthread_cond_wait(&' },
        { kind: 'blank', answers: ['empty'], width: 7 },
        { kind: 'text', text: ', &mutex);  // p3\n        put(i);                                  // p4\n        Pthread_cond_signal(&' },
        { kind: 'blank', answers: ['fill'], width: 6 },
        { kind: 'text', text: ');             // p5\n        Pthread_mutex_unlock(&mutex);            // p6\n    }\n}' },
      ],
      explanation: 'producer 는 buffer 가 가득(count == MAX)이면 empty 에서 자고, put 후에는 fill 로 consumer 를 깨운다.',
    },
    {
      id: 'ch22-cb-3',
      type: 'code-blank',
      prompt: 'circular buffer 의 put/get — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int buffer[MAX];\nint fill = 0;   // producer 가 다음에 넣을 위치\nint use  = 0;   // consumer 가 다음에 꺼낼 위치\nint count = 0;\n\nvoid put(int value) {\n    buffer[fill] = value;\n    fill = ' },
        { kind: 'blank', answers: ['(fill + 1) % MAX', '(fill+1)%MAX', '(fill + 1)%MAX'], width: 18 },
        { kind: 'text', text: ';\n    count' },
        { kind: 'blank', answers: ['++', '++;', ' += 1'], width: 4 },
        { kind: 'text', text: ';\n}\n\nint get() {\n    int tmp = buffer[' },
        { kind: 'blank', answers: ['use'], width: 5 },
        { kind: 'text', text: '];\n    use = (use + 1) % MAX;\n    count--;\n    return tmp;\n}' },
      ],
      explanation: 'fill/use 모두 % MAX 로 wrap 하는 circular 구조. count 가 두 CV 의 조건 검사에 쓰이는 state variable.',
    },
    {
      id: 'ch22-cb-4',
      type: 'code-blank',
      prompt: 'covering condition — 메모리 할당기. 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void *allocate(int size) {\n    Pthread_mutex_lock(&m);\n    while (bytesLeft < size)\n        Pthread_cond_wait(&c, &m);\n    void *ptr = ...;\n    bytesLeft -= size;\n    Pthread_mutex_unlock(&m);\n    return ptr;\n}\n\nvoid free(void *ptr, int size) {\n    Pthread_mutex_lock(&m);\n    bytesLeft += size;\n    ' },
        { kind: 'blank', answers: ['Pthread_cond_broadcast(&c)', 'Pthread_cond_broadcast(&c);', 'pthread_cond_broadcast(&c)'], width: 28 },
        { kind: 'text', text: ';   // 누굴 깨울지 모르니 전부\n    Pthread_mutex_unlock(&m);\n}' },
      ],
      explanation: 'signal 로 하나만 깨우면 "진행 불가능한 thread" 가 깨어나고 정작 가능한 thread 는 못 깨어날 수 있다 → broadcast + 각자 while 재검사.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch22-essay-1',
      type: 'essay',
      prompt:
        'Producer/Consumer 코드가 "if + CV 1개" 에서 "while + CV 2개" 로 발전한 과정을, 각 단계에서 무엇이 깨졌는지와 함께 설명하라.',
      modelAnswer: [
        '[1단계: lock 없는 put/get] producer/consumer 가 동시에 buffer 를 만져 race condition — 동기화 자체가 없음.',
        '',
        '[2단계: lock + CV 1개 + if] single producer + single consumer 에서는 동작한다. 그러나 consumer 가 2명이 되면 깨진다: producer 의 signal 로 Tc1 이 깨어났지만, Tc1 이 mutex 를 재획득하기 전에 Tc2 가 먼저 lock 을 잡고 get 을 끝내 버리면, Tc1 은 if 를 이미 통과한 상태라 재검사 없이 빈 buffer 에 get 을 호출한다 (assert 폭발). 원인은 Mesa semantics — 깨어남이 조건 보장이 아니라는 것.',
        '',
        '[3단계: if → while] 깨어난 뒤 조건(count)을 다시 검사하므로, 그 사이 다른 thread 가 상태를 바꿔도 다시 잠들면 된다. 그러나 아직 CV 가 하나라 "consumer 가 consumer 를 깨우는" 문제가 남는다: buffer 가 빈 상태에서 consumer 의 signal 이 또 다른 consumer 를 깨우면 의미 없는 wakeup 만 반복되고, 정작 producer 가 못 깨어나는 시나리오가 가능하다.',
        '',
        '[4단계: CV 2개 (empty/fill)] producer 는 empty 에서 자고 fill 에 signal, consumer 는 fill 에서 자고 empty 에 signal — 신호가 항상 반대편(필요한 쪽)에게만 가도록 분리. 마지막으로 buffer 를 MAX 칸 circular 로 키워 (fill/use/count) 일반화하면 정석 코드 완성.',
      ].join('\n'),
      rubric: [
        '단계별로 "무엇이 깨졌는가" 를 시나리오로 제시',
        'Mesa semantics 와 while 의 연결',
        'CV 분리가 막는 잘못된 wakeup 설명',
      ],
    },
  ],
};

export default quiz;
