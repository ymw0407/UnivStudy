import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '19-thread-api',
  chapterNumber: 19,
  title: 'Thread API',
  description: 'pthread_create / join / mutex / cond — 시그니처와 정석 패턴 코드 빵꾸 위주.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch19-tf-1',
      type: 'true-false',
      prompt: 'thread 함수가 지역 변수의 주소를 반환해도, 그 메모리는 프로세스 안에 있으므로 pthread_join 으로 안전하게 받을 수 있다.',
      answer: false,
      explanation:
        '함수가 끝나면 stack frame 이 사라지고 그 자리는 다음 호출이 덮어쓴다 — dangling pointer. 결과를 돌려주려면 malloc 으로 heap 에 잡아 반환해야 한다.',
    },
    {
      id: 'ch19-tf-2',
      type: 'true-false',
      prompt: 'pthread_cond_wait 는 잠들면서 인자로 받은 mutex 를 자동으로 풀고, 깨어나 반환하기 전에 그 mutex 를 다시 잡는다.',
      answer: true,
      explanation: '"mutex 풀기 + 잠들기" 가 atomic 으로 묶여 lost wakeup 을 막고, 깨어날 때 재획득까지 해 주므로 wait 전후 코드를 이어 짤 수 있다.',
    },
    {
      id: 'ch19-tf-3',
      type: 'true-false',
      prompt: 'pthread_mutex_trylock 은 lock 을 얻을 수 없으면 얻을 수 있을 때까지 기다린다.',
      answer: false,
      explanation: 'trylock 은 기다리지 않고 즉시 실패를 반환한다. 기다리는 것은 lock(무한)과 timedlock(지정 시간까지).',
    },
    {
      id: 'ch19-tf-4',
      type: 'true-false',
      prompt: 'cond_wait 에서 깨어났다면 기다리던 조건이 반드시 참이므로 바로 진행해도 된다.',
      answer: false,
      explanation: '깨어났다고 조건 보장이 없다(Mesa). 반드시 while 로 조건을 재검사해야 한다.',
    },
    {
      id: 'ch19-tf-5',
      type: 'true-false',
      prompt: 'pthread_join 을 호출하지 않으면 main thread 가 먼저 끝나면서 프로세스가 종료되어, 실행 중이던 worker thread 들도 함께 사라질 수 있다.',
      answer: true,
      explanation: 'main 이 worker 종료를 기다려야 한다면 join 이 필요하다.',
    },
    {
      id: 'ch19-tf-6',
      type: 'true-false',
      prompt: 'pthread 컴파일 시 단순 -lpthread 링크보다 -pthread 옵션이 권장된다.',
      answer: true,
      explanation: '-pthread 는 컴파일·링크 양쪽 설정을 모두 잡아 주고 _REENTRANT 같은 매크로도 함께 정의해 준다.',
    },
    {
      id: 'ch19-tf-7',
      type: 'true-false',
      prompt: 'condition variable(예: init)은 값을 읽고 비교하는 변수이고, state variable(예: initialized)은 잠들고 깨우는 동기화 채널이다.',
      answer: false,
      explanation:
        '반대다. condition variable 은 잠/깨우기 채널(값 비교 X), state variable 이 실제 상태를 담는 일반 변수로 while 조건 검사는 이쪽으로 한다.',
    },
    {
      id: 'ch19-tf-8',
      type: 'true-false',
      prompt: 'state variable 과 condition variable 은 반드시 같은 mutex 로 보호되어야 "상태 변경 → signal" 이 한 덩어리로 보인다.',
      answer: true,
      explanation: '둘을 다른 lock 으로 보호하거나 lock 없이 쓰면 missed wakeup 이 생길 수 있다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch19-mc-1',
      type: 'multiple-choice',
      prompt: 'pthread_create 의 네 인자 (thread, attr, start_routine, arg) 설명으로 틀린 것은?',
      options: [
        { text: 'thread — 생성된 thread 를 식별할 핸들을 저장' },
        { text: 'attr — 스택 크기 등 속성. 기본값이면 NULL' },
        { text: 'start_routine — 새 thread 가 실행할 함수의 포인터' },
        { text: 'arg — 함수의 반환값을 받아올 포인터' },
      ],
      answerIndex: 3,
      explanation: 'arg 는 start_routine 에 "넘겨줄 인자". 반환값을 받는 것은 pthread_join 의 두 번째 인자다.',
    },
    {
      id: 'ch19-mc-2',
      type: 'multiple-choice',
      prompt: 'pthread 의 thread 함수가 인자·반환값에 void * 를 쓰는 이유는?',
      options: [
        { text: 'void * 가 가장 빠른 타입이기 때문' },
        { text: 'C 에 generic 이 없어, 어떤 타입이든 포인터로 주고받고 받는 쪽이 cast 하도록 하기 위해' },
        { text: '포인터 크기가 항상 4 byte 로 고정되기 때문' },
        { text: '컴파일러가 자동으로 타입을 추론해 주기 때문' },
      ],
      answerIndex: 1,
      explanation: '대신 타입 체크가 약해져 잘못 cast 해도 컴파일 에러가 안 날 수 있다는 단점이 있다.',
    },
    {
      id: 'ch19-mc-3',
      type: 'multiple-choice',
      prompt: 'pthread_join 의 두 번째 인자 타입이 void ** 인 이유는?',
      options: [
        { text: '두 개의 값을 받기 위해' },
        { text: 'thread 가 반환하는 값 자체가 void * 라서, 그 void * 값을 바깥 변수에 써 주려면 포인터의 포인터가 필요하기 때문' },
        { text: '배열을 반환받기 위해' },
        { text: '** 가 옵션 인자를 뜻하는 관례이기 때문' },
      ],
      answerIndex: 1,
      explanation: '"void * 값을 바꾸기 위한 포인터" = void **. pthread_join(p, (void **)&m) 형태로 쓴다.',
    },
    {
      id: 'ch19-mc-4',
      type: 'multiple-choice',
      prompt: 'lock / trylock / timedlock 의 대기 정책이 올바르게 짝지어진 것은?',
      options: [
        { text: 'lock: 즉시 포기 / trylock: 무한 대기 / timedlock: 시간제한 대기' },
        { text: 'lock: 무한 대기 / trylock: 즉시 포기 / timedlock: 지정 시간까지만 대기' },
        { text: 'lock: 시간제한 대기 / trylock: 무한 대기 / timedlock: 즉시 포기' },
        { text: '셋 모두 무한 대기이고 반환값만 다르다' },
      ],
      answerIndex: 1,
      explanation: '문이 열릴 때까지 계속(lock) / 잠겨 있으면 바로 포기(trylock) / 정해진 시간까지만(timedlock).',
    },
    {
      id: 'ch19-mc-5',
      type: 'multiple-choice',
      prompt: 'cond_wait 가 mutex 를 인자로 받아 "풀기+잠들기" 를 atomic 하게 처리하지 않으면 생기는 문제는?',
      options: [
        { text: 'deadlock — 서로의 lock 을 기다리게 된다' },
        { text: 'lost wakeup — 풀고 잠들기 직전 사이에 signal 이 도착해 신호를 영영 놓친다' },
        { text: 'starvation — 특정 thread 만 계속 깨어나지 못한다' },
        { text: 'livelock — 계속 깨어났다 다시 잠들기를 반복한다' },
      ],
      answerIndex: 1,
      explanation: '"unlock → (이 틈에 signal) → sleep" 이면 신호가 지나간 뒤 잠들어 영영 못 깨어난다.',
    },
    {
      id: 'ch19-mc-6',
      type: 'multiple-choice',
      prompt: 'Mutex / Atomic / Semaphore 의 쓰임이 올바르게 짝지어진 것은?',
      options: [
        { text: 'Mutex: 단일 연산 / Atomic: 구역 전체 / Semaphore: 동시 N 명' },
        { text: 'Mutex: 구역 전체를 한 명만 / Atomic: 단일 연산이 끊기지 않게 / Semaphore: 동시 진입 인원 N 명' },
        { text: 'Mutex: 동시 N 명 / Atomic: 구역 전체 / Semaphore: 단일 연산' },
        { text: '셋은 완전히 같은 용도다' },
      ],
      answerIndex: 1,
      explanation: '보호 대상의 모양이 다르면 도구도 다르다 — 여러 줄 구역=mutex, counter++ 한 줄 hot path=atomic, 인원수 N=semaphore.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch19-sa-1',
      type: 'short-answer',
      prompt: 'pthread 프로그램을 gcc 로 컴파일할 때 권장되는 옵션은? (예: gcc -o main main.c -Wall ___)',
      answers: ['-pthread', 'pthread'],
      hint: '-lpthread 보다 권장되는 쪽',
      explanation: '-pthread — 컴파일·링크 모두에 pthread 설정을 추가하고 _REENTRANT 도 정의.',
    },
    {
      id: 'ch19-sa-2',
      type: 'short-answer',
      prompt: '함수가 끝나 stack frame 이 사라진 뒤에도 그 주소를 계속 들고 있는 포인터를 부르는 용어는? (영문)',
      answers: ['dangling pointer', 'danglingpointer', 'dangling'],
      hint: '"매달려 있는" 포인터',
      explanation: '역참조하는 순간 쓰레기 값 또는 crash (UB). thread 반환값을 heap 에 둬야 하는 이유.',
    },
    {
      id: 'ch19-sa-3',
      type: 'short-answer',
      prompt: 'mutex 의 정적 초기화에 쓰는 매크로 이름은? (pthread_mutex_t lock = ___)',
      answers: ['PTHREAD_MUTEX_INITIALIZER', 'pthread_mutex_initializer'],
      hint: '대문자 매크로',
      explanation: '정적 초기화는 PTHREAD_MUTEX_INITIALIZER, 동적 초기화는 pthread_mutex_init(&lock, NULL).',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch19-cb-1',
      type: 'code-blank',
      prompt: 'pthread_create 시그니처 — 세 번째 인자(함수 포인터)의 타입을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int pthread_create(\n    pthread_t *thread,\n    const pthread_attr_t *attr,\n    ' },
        { kind: 'blank', answers: ['void *(*start_routine)(void*)', 'void *(*start_routine)(void *)', 'void* (*start_routine)(void*)'], width: 32 },
        { kind: 'text', text: ',\n    void *arg\n);' },
      ],
      explanation:
        '"void * 하나를 받아 void * 를 반환하는 함수" 를 가리키는 포인터. 안에서 밖으로 한 겹씩 벗기면 읽힌다.',
    },
    {
      id: 'ch19-cb-2',
      type: 'code-blank',
      prompt: 'thread 가 결과 구조체를 반환하는 올바른 방법 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void *mythread(void *arg) {\n    myarg_t *m = (myarg_t *) arg;\n    myret_t *r = ' },
        { kind: 'blank', answers: ['malloc(sizeof(myret_t))', 'malloc(sizeof(myret_t));'], width: 26 },
        { kind: 'text', text: ';   // stack 이 아닌 heap 에!\n    r->x = 1;\n    r->y = 2;\n    return (void *) r;\n}\n\nint main(...) {\n    myret_t *m;\n    pthread_create(&p, NULL, mythread, &args);\n    pthread_join(p, ' },
        { kind: 'blank', answers: ['(void **) &m', '(void**)&m', '(void **)&m'], width: 16 },
        { kind: 'text', text: ');\n    printf("returned %d %d", m->x, m->y);\n}' },
      ],
      explanation: '반환값은 heap(malloc)에 — &local 반환은 dangling pointer. join 은 void ** 로 받는다.',
    },
    {
      id: 'ch19-cb-3',
      type: 'code-blank',
      prompt: 'condition variable 대기 정석 패턴 (기다리는 쪽) — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'pthread_mutex_lock(&lock);\n\n' },
        { kind: 'blank', answers: ['while', 'while '], width: 8 },
        { kind: 'text', text: ' (initialized == 0)\n    pthread_cond_wait(&init, ' },
        { kind: 'blank', answers: ['&lock', '&lock '], width: 8 },
        { kind: 'text', text: ');\n\npthread_mutex_unlock(&lock);' },
      ],
      explanation: 'if 가 아니라 while (깨어나도 조건 재검사), wait 에는 잡고 있는 mutex 를 넘겨 "풀기+잠들기" 를 atomic 으로.',
    },
    {
      id: 'ch19-cb-4',
      type: 'code-blank',
      prompt: 'condition variable 신호 정석 패턴 (깨우는 쪽) — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'pthread_mutex_lock(&lock);\n\n' },
        { kind: 'blank', answers: ['initialized = 1', 'initialized = 1;'], width: 18 },
        { kind: 'text', text: ';                 // state variable 변경\n' },
        { kind: 'blank', answers: ['pthread_cond_signal(&init)', 'pthread_cond_signal(&init);'], width: 28 },
        { kind: 'text', text: ';   // 기다리는 thread 깨우기\n\npthread_mutex_unlock(&lock);' },
      ],
      explanation: '상태 변경과 signal 을 같은 mutex 안에서 — 그래야 검사-대기 중인 쪽과의 race 가 없다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch19-essay-1',
      type: 'essay',
      prompt:
        'pthread_cond_wait 가 mutex 를 인자로 받는 이유를 lost wakeup 시나리오와 함께 설명하라. (unlock 과 sleep 을 따로 하면 무엇이 잘못되는가?)',
      modelAnswer: [
        '[따로 하면 생기는 race] 기다리는 쪽이 (1) 조건 확인 → (2) mutex unlock → (3) sleep 순으로 따로 수행한다고 하자. (2) 와 (3) 사이의 짧은 틈에 context switch 가 일어나 깨우는 쪽이 상태를 바꾸고 signal 을 보내면 — 이 시점에 기다리는 쪽은 아직 wait queue 에 들어가 있지 않으므로 신호는 받을 사람 없이 사라진다. 그 후 기다리는 쪽이 (3) 에서 잠들면, 이미 신호가 지나갔으므로 깨워 줄 사람이 없어 영원히 잠든다 — lost wakeup.',
        '',
        '[cond_wait 의 해법] pthread_cond_wait(&c, &m) 은 "wait queue 등록 + mutex 풀기 + 잠들기" 를 atomic 하게 수행한다. mutex 를 잡은 채로 호출하므로, 깨우는 쪽은 같은 mutex 를 잡아야 상태를 바꾸고 signal 할 수 있다 → "조건 검사 ~ 잠들기 완료" 사이에 깨우는 쪽이 끼어들 수 없다.',
        '',
        '[반환 시] 깨어날 때도 mutex 를 자동으로 다시 잡고 반환하므로, wait 전후의 코드를 마치 lock 이 풀린 적 없는 것처럼 작성할 수 있다. 단 Mesa semantics 때문에 깨어난 뒤 조건은 while 로 재검사해야 한다.',
      ].join('\n'),
      rubric: [
        'unlock 과 sleep 사이의 race window 식별',
        '신호가 저장되지 않고 사라진다는 점 (CV signal 의 성질)',
        'atomic "풀기+잠들기" 와 반환 전 mutex 재획득 설명',
      ],
    },
  ],
};

export default quiz;
