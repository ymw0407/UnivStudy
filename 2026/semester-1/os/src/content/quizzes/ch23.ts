import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '23-semaphore',
  chapterNumber: 23,
  title: 'Semaphore',
  description: 'Binary/signaling semaphore, producer-consumer, reader-writer, dining philosophers, Zemaphore까지.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch23-mc-1',
      type: 'multiple-choice',
      prompt: '세마포어의 값이 -3 이라는 것이 의미하는 바로 가장 적절한 것은?',
      options: [
        { text: '음수 자원이 3 개 있다 (시스템 오류 상태)' },
        { text: '세마포어에서 대기(sleep) 중인 thread 가 3 명이다' },
        { text: 'sem_wait 가 3 번 더 호출되어야 하나의 thread 가 진입 가능하다' },
        { text: '세마포어가 락(lock) 처럼 사용되고 있음을 뜻한다' },
      ],
      answerIndex: 1,
      explanation:
        '세마포어가 음수일 때 그 절댓값은 대기 중인 thread 의 수. s = -3 이면 자원이 없고 그 자원을 기다리며 sleep 한 thread 가 3 명.',
    },
    {
      id: 'ch23-mc-2',
      type: 'multiple-choice',
      prompt: 'sem_init(&s, 0, 1) 에서 가운데 인자 0 이 의미하는 것은?',
      options: [
        { text: '세마포어의 초기값이 0 임' },
        { text: '이 세마포어는 binary semaphore 가 아님' },
        { text: '같은 process 안의 thread 사이에서 공유한다는 의미' },
        { text: 'sem_wait 호출 시 0 초만 기다린다는 의미' },
      ],
      answerIndex: 2,
      explanation:
        '두 번째 인자는 pshared 플래그. 0 이면 같은 process 의 thread 간 공유, 0 이 아니면 process 간 공유. 강의에서는 thread 간 공유만 다루므로 0.',
    },
    {
      id: 'ch23-mc-3',
      type: 'multiple-choice',
      prompt:
        'Producer/Consumer 코드에서 sem_init(&empty, 0, X) · sem_init(&full, 0, Y) · sem_init(&mutex, 0, Z) 의 적절한 초기값 조합은? (MAX = buffer 크기)',
      options: [
        { text: 'X = 0, Y = MAX, Z = 1' },
        { text: 'X = MAX, Y = 0, Z = 1' },
        { text: 'X = 1, Y = 1, Z = MAX' },
        { text: 'X = MAX, Y = MAX, Z = 0' },
      ],
      answerIndex: 1,
      explanation:
        'empty 는 "비어 있는 슬롯 수" 이므로 처음엔 MAX. full 은 "차 있는 슬롯 수" 이므로 처음엔 0. mutex 는 binary semaphore (init=1).',
    },
    {
      id: 'ch23-mc-4',
      type: 'multiple-choice',
      prompt:
        'Producer/Consumer 에서 mutex 를 empty/full 보다 먼저 잡으면 무슨 문제가 생기는가?',
      options: [
        { text: 'mutex 의 값이 음수가 되어 race condition 이 발생한다' },
        { text: '메모리 누수가 일어난다' },
        { text: 'mutex 를 잡은 채 sleep 해 deadlock 이 발생한다' },
        { text: '아무 문제 없다 — 순서는 무관하다' },
      ],
      answerIndex: 2,
      explanation:
        'mutex 를 먼저 잡고 empty/full 에서 sleep 으로 들어가면, 상대방이 mutex 를 잡을 수 없어서 자원을 만들어 줄 수도 없게 된다 → deadlock. mutex 는 put/get 만 감싸야 한다.',
    },
    {
      id: 'ch23-mc-5',
      type: 'multiple-choice',
      prompt: 'Reader-Writer Lock 의 Writer Starvation 문제는 다음 중 어떤 종류의 문제인가?',
      options: [
        { text: 'Deadlock — 모두가 서로 기다린다' },
        { text: 'Race condition — 값이 꼬여서 잘못된 결과가 나온다' },
        { text: 'Starvation — 특정 thread (writer) 만 진행 기회를 못 얻는다' },
        { text: 'Livelock — thread 가 계속 실행되지만 진전이 없다' },
      ],
      answerIndex: 2,
      explanation:
        'Writer 는 sleep 상태이고 reader 들은 계속 진행하므로 시스템은 멈추지 않는다(=deadlock 아님). 다만 writer 만 영영 못 들어가는 것 → starvation.',
    },
    {
      id: 'ch23-mc-6',
      type: 'multiple-choice',
      prompt:
        'Dining Philosophers 에서 "P4 만 오른쪽 포크를 먼저 잡게" 하면 deadlock 이 사라지는 이유는?',
      options: [
        { text: 'P4 가 두 포크를 동시에 잡을 수 있게 되기 때문' },
        { text: '하나의 thread 만 다르게 행동하면 lock 들이 모두 binary semaphore 가 되기 때문' },
        { text: 'P4 가 다른 순서로 잡으면 모두가 left 만 잡는 상황이 생기지 않아 circular wait 의 cycle 이 깨지기 때문' },
        { text: 'P4 가 가장 빠르게 식사를 끝내기 때문' },
      ],
      answerIndex: 2,
      explanation:
        'Deadlock 의 4 조건 중 하나인 "circular wait" 를 깨는 방법. 모두가 같은 순서로 자원을 요청하면 cycle 이 완성되지만, 한 명만 반대로 요청하면 cycle 이 생기지 않는다.',
    },
    {
      id: 'ch23-mc-7',
      type: 'multiple-choice',
      prompt:
        'Zemaphore (lock + CV 로 구현한 semaphore) 에서 value 가 절대 음수가 되지 않는 이유는?',
      options: [
        { text: 'C 의 int 타입이 unsigned 이기 때문' },
        { text: 'value-- 를 while 의 조건 검사 이후에만 실행하기 때문' },
        { text: 'Cond_wait 가 value 를 자동으로 0 으로 리셋하기 때문' },
        { text: 'lock 이 음수 값을 허용하지 않기 때문' },
      ],
      answerIndex: 1,
      explanation:
        'Zemaphore 에서 wait 은 "value <= 0 이면 cond_wait 으로 잠들고, 양수가 되면 그제서야 value--" 순서. 그래서 value 는 항상 0 이상. 대기 thread 정보는 condition variable 의 queue 에 들어 있다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch23-tf-1',
      type: 'true-false',
      prompt:
        'sem_post() 는 항상 대기 중인 thread 하나를 깨운다 — 즉, sem_post 호출 시점에 큐에 thread 가 없어도 그 신호가 저장되었다가 다음 wait 에서 소비된다.',
      answer: true,
      explanation:
        '함정 문장처럼 보이지만 사실. 세마포어는 값을 +1 만 시켜 두면 다음 sem_wait 가 (음수가 되지 않으므로) sleep 없이 통과한다. CV 의 signal 과 다르게 신호가 "사라지지" 않는다.',
    },
    {
      id: 'ch23-tf-2',
      type: 'true-false',
      prompt:
        'Reader-Writer Lock 의 첫 번째 reader 가 writelock 을 잡고, 마지막 reader 가 writelock 을 푼다.',
      answer: true,
      explanation:
        '핵심 트릭. 이 덕분에 reader 무리 전체가 writer 와 직렬화된다. 중간 reader 들은 writelock 을 건드리지 않고 readers count 만 증감.',
    },
    {
      id: 'ch23-tf-3',
      type: 'true-false',
      prompt:
        'Writer starvation 은 deadlock 의 한 종류이므로 모든 thread 가 멈추는 상태이다.',
      answer: false,
      explanation:
        '아니다. starvation 은 특정 thread (writer) 만 진행 기회를 못 얻는 상태고, reader 들은 계속 잘 돌아간다. deadlock 은 서로 무한히 기다리며 모두 멈추는 다른 상태.',
    },
    {
      id: 'ch23-tf-4',
      type: 'true-false',
      prompt:
        'Dining Philosophers 에서 모든 철학자가 동시에 왼쪽 포크를 집은 직후, 누군가 자신이 든 포크를 자발적으로 놓아 주지 않으면 deadlock 이다.',
      answer: true,
      explanation:
        '교과서 정의 그대로. circular wait + hold-and-wait + non-preemption 이 동시에 성립하므로 외부 개입(또는 알고리즘 변경) 없이는 풀리지 않는다.',
    },
    {
      id: 'ch23-tf-5',
      type: 'true-false',
      prompt: 'sem_wait 는 값을 감소시킨 결과가 음수이면 thread 를 spin-wait 시킨다.',
      answer: false,
      explanation: 'spin 이 아니라 sleep(blocked state) — CPU 를 낭비하지 않도록 잠재운다. 깨우는 것은 sem_post 의 몫.',
    },
    {
      id: 'ch23-tf-6',
      type: 'true-false',
      prompt: '초기값 0 으로 만든 semaphore 는 "아직 사건이 발생하지 않았다" 는 뜻으로, condition variable 처럼 순서 강제(ordering)에 쓸 수 있다.',
      answer: true,
      explanation: '기다리는 쪽 sem_wait, 사건 발생 쪽 sem_post — join 패턴. CV 와 달리 post 가 먼저 와도 값 1 로 남아 사라지지 않는다.',
    },
    {
      id: 'ch23-tf-7',
      type: 'true-false',
      prompt: 'reader-writer lock 에서 두 번째, 세 번째로 들어오는 reader 들도 각각 writelock 을 잡는다.',
      answer: false,
      explanation: 'writelock 은 첫 번째 reader 만 잡고 마지막 reader 가 푼다. 중간 reader 들은 lock(카운터 보호용)을 잡고 readers 만 증감.',
    },
    {
      id: 'ch23-tf-8',
      type: 'true-false',
      prompt: 'Zemaphore 는 semaphore 를 lock 과 condition variable 로 구현한 것으로, 두 추상화가 서로를 만들 수 있음을 보여준다.',
      answer: true,
      explanation: 'semaphore 로 lock/CV 역할을 할 수 있고, 거꾸로 lock+CV 로 semaphore 를 만들 수 있다 — 서로의 친척.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형 / Rate 계산 — PDF 표 기반
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch23-sa-1',
      type: 'short-answer',
      prompt:
        '세마포어 값이 -5 이다. 이 세마포어를 기다리며 sleep 중인 thread 는 몇 명인가? (정수만)',
      answers: ['5', '5명', '5 명'],
      hint: '|s| = 대기 thread 수',
      explanation: 's < 0 일 때 |s| = 5 가 대기 중인 thread 수.',
    },
    {
      id: 'ch23-sa-2',
      type: 'short-answer',
      prompt:
        'sem_init(&s, 0, 4) 이후 sem_wait(&s) 가 7 번 호출되었다 (대기 중인 thread 들도 포함). 이 시점의 s 값은? (부호 포함 정수)',
      answers: ['-3', '-3 ', ' -3'],
      hint: '초기값 - wait 횟수 + post 횟수',
      explanation: 's = 4 - 7 = -3. 즉 3 명이 대기 중.',
    },
    {
      id: 'ch23-sa-3',
      type: 'short-answer',
      prompt:
        'MAX = 5 인 Producer/Consumer 에서 producer 가 7 번 put 을 끝내고, consumer 가 4 번 get 을 끝낸 시점의 full 값은? (정수)',
      answers: ['3', '3 ', ' 3'],
      hint: 'full 의 초기값은 0. put → sem_post(&full) 로 +1, get → sem_wait(&full) 로 -1',
      explanation: 'full = 0 + 7 (put 마다 post) - 4 (get 마다 wait) = 3.',
    },
    {
      id: 'ch23-sa-4',
      type: 'short-answer',
      prompt:
        '같은 시나리오(MAX=5, put 7 회, get 4 회 완료)에서 empty 의 값은? (정수)',
      answers: ['2', '2 '],
      hint: 'empty 의 초기값은 MAX. put → sem_wait(&empty) 로 -1, get → sem_post(&empty) 로 +1',
      explanation: 'empty = MAX - 7 + 4 = 5 - 7 + 4 = 2.',
    },
    {
      id: 'ch23-sa-5',
      type: 'short-answer',
      prompt:
        'Binary semaphore (mutex) 의 초기값에서 sem_wait 가 2 번 호출되고 sem_post 는 1 번 호출되었을 때 값은? (부호 포함 정수)',
      answers: ['0', '0 '],
      hint: '초기값 = 1',
      explanation: '1 - 2 + 1 = 0. (-1 → post 1 회로 +1)',
    },
    {
      id: 'ch23-sa-6',
      type: 'short-answer',
      prompt:
        'Reader-Writer Lock 에서 현재 read 중인 reader 가 3 명이고 writer 1 명이 대기 중이다. rwlock 구조체의 writelock 값은? (정수)',
      answers: ['-1', '-1 '],
      hint: 'writelock 은 binary semaphore (init=1). 첫 reader 가 wait 으로 잡았고 그 뒤 writer 가 또 wait 시도',
      explanation:
        '초기 1, 첫 reader 가 sem_wait → 0. 그 다음 writer 가 sem_wait → -1 (대기 1 명).',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸 (Code-Blank)
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch23-cb-0',
      type: 'code-blank',
      prompt: 'sem_wait / sem_post 의 의사코드 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int sem_wait(sem_t *s) {\n    decrement the value of semaphore s by one;\n    ' },
        { kind: 'blank', answers: ['wait', 'wait (sleep)', 'sleep'], width: 6 },
        { kind: 'text', text: ' if value of semaphore s is ' },
        { kind: 'blank', answers: ['negative', '음수'], width: 10 },
        { kind: 'text', text: ';\n}\n\nint sem_post(sem_t *s) {\n    ' },
        { kind: 'blank', answers: ['increment', 'increment the value'], width: 11 },
        { kind: 'text', text: ' the value of semaphore s by one;\n    if there are one or more threads waiting, wake ' },
        { kind: 'blank', answers: ['one', '하나'], width: 5 },
        { kind: 'text', text: ';\n}' },
      ],
      explanation: 'wait = 값 -1, 음수면 sleep. post = 값 +1, 대기자가 있으면 하나를 깨움. 음수의 절댓값 = 대기 thread 수.',
    },
    {
      id: 'ch23-cb-1',
      type: 'code-blank',
      prompt: 'Parent-Child join 패턴 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'sem_t s;\n\nvoid *child(void *arg) {\n    printf("child\\n");\n    ' },
        { kind: 'blank', answers: ['sem_post(&s)', 'sem_post(&s);'], width: 22 },
        { kind: 'text', text: ';\n    return NULL;\n}\n\nint main(...) {\n    sem_init(&s, 0, ' },
        { kind: 'blank', answers: ['0'], width: 4 },
        { kind: 'text', text: ');\n    pthread_create(c, NULL, child, NULL);\n    ' },
        { kind: 'blank', answers: ['sem_wait(&s)', 'sem_wait(&s);'], width: 22 },
        { kind: 'text', text: ';\n    printf("parent: end\\n");\n}' },
      ],
      explanation:
        '초기값 0 = "아직 사건 없음". child 가 sem_post 로 사건 발생을 알리고, parent 가 sem_wait 로 그 사건을 기다린다 (signaling semaphore 패턴).',
    },
    {
      id: 'ch23-cb-2',
      type: 'code-blank',
      prompt: '최종 Producer/Consumer 의 mutex 위치 — 어느 줄에 들어가야 deadlock 이 안 생기는가?',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void *producer(void *arg) {\n    for (int i = 0; i < loops; i++) {\n        ' },
        { kind: 'blank', answers: ['sem_wait(&empty)', 'sem_wait(&empty);'], width: 24 },
        { kind: 'text', text: ';\n        ' },
        { kind: 'blank', answers: ['sem_wait(&mutex)', 'sem_wait(&mutex);'], width: 24 },
        { kind: 'text', text: ';\n        put(i);\n        ' },
        { kind: 'blank', answers: ['sem_post(&mutex)', 'sem_post(&mutex);'], width: 24 },
        { kind: 'text', text: ';\n        sem_post(&full);\n    }\n}' },
      ],
      explanation:
        'mutex 는 항상 empty/full 의 wait 보다 안쪽 — 즉 put 만 감싼다. 그래야 "mutex 든 채 sleep" 으로 인한 deadlock 이 안 생긴다.',
    },
    {
      id: 'ch23-cb-3',
      type: 'code-blank',
      prompt: 'Reader-Writer Lock 의 read-acquire — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void rwlock_acquire_readlock(rwlock_t *rw) {\n    sem_wait(&rw->lock);\n    rw->readers' },
        { kind: 'blank', answers: ['++', '+=1', '+= 1'], width: 8 },
        { kind: 'text', text: ';\n    if (rw->readers == ' },
        { kind: 'blank', answers: ['1'], width: 4 },
        { kind: 'text', text: ')\n        ' },
        { kind: 'blank', answers: ['sem_wait(&rw->writelock)', 'sem_wait(&rw->writelock);'], width: 28 },
        { kind: 'text', text: ';\n    sem_post(&rw->lock);\n}' },
      ],
      explanation:
        '첫 번째 reader (readers == 1 직후) 만 writelock 을 잡는다. 그 뒤로 들어오는 reader 들은 readers count 만 증가시키고 writelock 은 건드리지 않는다.',
    },
    {
      id: 'ch23-cb-4',
      type: 'code-blank',
      prompt: 'Dining Philosophers — circular wait 을 깨는 fix 코드.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void getforks() {\n    if (p == ' },
        { kind: 'blank', answers: ['4'], width: 4 },
        { kind: 'text', text: ') {\n        sem_wait(forks[' },
        { kind: 'blank', answers: ['right(p)', 'right(p) '], width: 14 },
        { kind: 'text', text: ']);\n        sem_wait(forks[' },
        { kind: 'blank', answers: ['left(p)', 'left(p) '], width: 14 },
        { kind: 'text', text: ']);\n    } else {\n        sem_wait(forks[left(p)]);\n        sem_wait(forks[right(p)]);\n    }\n}' },
      ],
      explanation:
        'p == 4 (마지막 한 명) 만 오른쪽 → 왼쪽 순서로 잡으면 cycle 이 깨진다. 누구든 한 명만 다른 순서로 잡으면 충분 — 굳이 4 번이 아니어도 된다.',
    },
    {
      id: 'ch23-cb-5',
      type: 'code-blank',
      prompt: 'Zemaphore 의 Zem_wait — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void Zem_wait(Zem_t *s) {\n    Mutex_lock(&s->lock);\n    ' },
        { kind: 'blank', answers: ['while', 'while '], width: 8 },
        { kind: 'text', text: ' (s->value <= 0)\n        Cond_wait(&s->cond, &s->lock);\n    s->value' },
        { kind: 'blank', answers: ['--', '-=1', '-= 1'], width: 8 },
        { kind: 'text', text: ';\n    Mutex_unlock(&s->lock);\n}' },
      ],
      explanation:
        '"if" 가 아니라 "while" 인 이유: Mesa semantics — cond_wait 에서 깨어났다고 해서 조건(value > 0)이 반드시 만족된다는 보장이 없으므로 재검사. value-- 는 그 뒤.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch23-essay-1',
      type: 'essay',
      prompt:
        'Producer/Consumer 코드에서 sem_wait(&mutex) 를 sem_wait(&empty) 보다 먼저 두면 왜 deadlock 이 발생하는지 구체적인 시나리오를 들어 설명하라. (정답 mutex 배치도 함께 제시)',
      modelAnswer: [
        '핵심 원인: "mutex 를 잡은 채로 sleep 으로 들어가는" 상황이 만들어지기 때문이다.',
        '',
        '시나리오 (buffer 비어 있고 mutex 자유 상태에서 시작):',
        '1. Producer 가 sem_wait(&mutex) → mutex 획득 (mutex = 0).',
        '2. Producer 가 sem_wait(&empty) → empty = 0 이라 sleep. 이때 mutex 는 여전히 0 (Producer 가 들고 있음).',
        '3. Consumer 가 sem_wait(&mutex) → mutex 가 0 이라 sleep. (mutex = -1)',
        '4. 이제 Producer 는 empty 를 기다리고, Consumer 는 mutex 를 기다린다.',
        '5. empty 는 Consumer 가 get + sem_post(&empty) 를 해 줘야 1 이 되는데, Consumer 는 mutex 를 못 잡아 진행 불가 → deadlock.',
        '',
        '정답 배치: sem_wait(&empty) (또는 &full) 를 먼저 호출하고, 그 다음 sem_wait(&mutex) 로 put/get 만 감싸야 한다. 그러면 mutex 를 잡은 상태에서는 더 이상 sleep 으로 들어갈 일이 없으므로 위와 같은 상호 대기가 생기지 않는다.',
        '',
        '교훈: "sleep 을 동반하는 wait 은 항상 mutex 바깥에서" — 일반적인 lock 사용 원칙과 동일하다.',
      ].join('\n'),
      rubric: [
        'deadlock 의 4 조건 (특히 hold-and-wait, circular wait) 을 시나리오에 적용',
        '시간 순으로 mutex / empty / full 의 값 변화를 추적',
        'mutex 가 put/get 만 감싸야 하는 이유 (sleep 동반 wait 과 분리) 설명',
      ],
    },
    {
      id: 'ch23-essay-2',
      type: 'essay',
      prompt:
        'Reader-Writer Lock 의 Writer Starvation 을 완화하려면 어떤 정책을 추가할 수 있는지 두 가지 이상 제시하고 각각의 장단점을 논하라.',
      modelAnswer: [
        '문제: writer 가 writelock 을 기다리는 동안 새 reader 가 계속 들어오면 readers count 가 0 으로 떨어지지 않아 writer 가 영영 진입 못함.',
        '',
        '정책 1) "Writer-preference" — writer 가 기다리고 있으면 새 reader 의 진입을 막는다.',
        '  ▶ 구현: waiting_writers 카운터를 두고, rwlock_acquire_readlock 에서 waiting_writers > 0 이면 reader 도 잠시 대기.',
        '  ▶ 장점: writer 가 starve 하지 않음 — fairness 가 writer 쪽으로 확보.',
        '  ▶ 단점: read 비중이 높은 워크로드에서 reader concurrency 가 떨어져 전체 throughput 감소. 반대로 reader starvation 위험.',
        '',
        '정책 2) "Fair FIFO" — 도착 순서대로 처리 (turnstile/ticket).',
        '  ▶ 구현: 도착 순서로 번호표를 받고 자기 차례에 자원을 잡게 한다 (ticket lock 의 RW 확장).',
        '  ▶ 장점: 양쪽 모두 starvation 없음.',
        '  ▶ 단점: 같은 종류(reader) 가 연속해도 그룹화하지 않으므로 reader concurrency 가 사실상 사라진다. 가장 공평하지만 가장 느림.',
        '',
        '정책 3) "Batched reads" — 현재 reader 무리는 다 받고, writer 가 들어오면 그 다음 reader 무리는 막는다.',
        '  ▶ 장점: reader concurrency 와 writer progress 를 절충.',
        '  ▶ 단점: 구현 복잡도 증가, 짧은 read 가 많은 워크로드에서는 여전히 writer 가 한참 기다린다.',
        '',
        '교훈: reader concurrency · writer progress · fairness 세 값은 보통 상충 관계 — 워크로드 특성(읽기 비중, write 의 응답성 요구) 에 따라 정책을 고른다.',
      ].join('\n'),
      rubric: [
        '최소 2 가지 정책 제시',
        '각 정책의 구현 아이디어 (어떤 상태를 추가하고 어디서 검사하는지)',
        '각 정책의 trade-off (reader concurrency / writer fairness / 복잡도) 명시',
      ],
    },
  ],
};

export default quiz;
