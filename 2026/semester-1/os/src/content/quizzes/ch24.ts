import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '24-common-concurrency-problems',
  chapterNumber: 24,
  title: 'Common Concurrency Problems',
  description: 'Atomicity/Order violation, deadlock 4조건 ↔ prevention 매핑, livelock, avoidance, detect&recover.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch24-tf-1',
      type: 'true-false',
      prompt: '실제 프로그램에서는 deadlock 버그보다 non-deadlock 동시성 버그(atomicity/order violation)가 더 자주 발생할 수 있다.',
      answer: true,
      explanation: '연구(MySQL·Apache 등 분석)에서 non-deadlock 버그가 deadlock 의 2배 이상, 그중 대부분이 atomicity/order violation 두 패턴이었다.',
    },
    {
      id: 'ch24-tf-2',
      type: 'true-false',
      prompt: 'deadlock 은 4가지 조건(Mutual Exclusion, Hold-and-wait, No preemption, Circular wait) 중 하나만 만족해도 발생할 수 있다.',
      answer: false,
      explanation: '4가지가 "동시에" 만족될 때 발생할 수 있다. 거꾸로 하나라도 깨면 deadlock 은 불가능 — 이것이 prevention.',
    },
    {
      id: 'ch24-tf-3',
      type: 'true-false',
      prompt: 'livelock 상태의 thread 들은 모두 blocked 되어 CPU 를 전혀 사용하지 않는다.',
      answer: false,
      explanation: 'blocked 는 deadlock. livelock 은 멈춰 있지는 않고(계속 실행됨) 같은 동작만 반복하며 진전이 없는 상태다.',
    },
    {
      id: 'ch24-tf-4',
      type: 'true-false',
      prompt: 'Test-and-Set 은 실패해도 메모리에 값을 쓰지만, CAS 는 기대한 값이 아니면 값을 변경하지 않는다.',
      answer: true,
      explanation: 'TAS = 무조건 write 후 옛값 반환. CAS = expected 와 같을 때만 조건부 write.',
    },
    {
      id: 'ch24-tf-5',
      type: 'true-false',
      prompt: 'lock 주소값 비교로 획득 순서를 강제할 때, 반드시 오름차순이어야만 deadlock 이 예방된다.',
      answer: false,
      explanation: '오름차순이든 내림차순이든 상관없다 — 핵심은 모든 thread 가 "같은 기준" 을 따라 기다림이 한 방향으로만 생기게 하는 것.',
    },
    {
      id: 'ch24-tf-6',
      type: 'true-false',
      prompt: 'avoidance via scheduling 은 코드에 있는 deadlock 가능성 자체를 제거하는 방식이다.',
      answer: false,
      explanation:
        '코드의 가능성은 그대로 두고, 위험한 thread 들이 동시에 실행되지 않도록 스케줄링으로 "실행 중 상황" 만 피한다. 구조 자체를 깨는 것은 prevention.',
    },
    {
      id: 'ch24-tf-7',
      type: 'true-false',
      prompt: 'deadlock detector 가 만드는 resource graph 에 cycle 이 있으면 deadlock 이 발생한 것이다.',
      answer: true,
      explanation: '"누가 무엇을 보유 / 무엇을 대기" 그래프에서 cycle = deadlock. 발견 시 transaction abort·thread 종료·재시작으로 복구.',
    },
    {
      id: 'ch24-tf-8',
      type: 'true-false',
      prompt: 'CAS 기반 wait-free insert 는 lock 을 쓰지 않으므로 livelock 도 발생할 수 없다.',
      answer: false,
      explanation: 'lock 으로 인한 deadlock 은 없지만, 여러 thread 가 계속 동시에 경쟁하면 CAS 실패가 반복될 수 있다 — livelock 가능성은 남는다.',
    },
    {
      id: 'ch24-tf-9',
      type: 'true-false',
      prompt: '캡슐화(encapsulation)는 코드 사용성을 높이지만, 함수 내부의 lock 이 보이지 않게 되어 lock 획득 순서 관리가 어려워질 수 있다.',
      answer: true,
      explanation: 'Java Vector 의 AddAll 이 대표 사례 — 사용자는 내부에서 두 vector 의 lock 을 잡는지 모른다.',
    },
    {
      id: 'ch24-tf-10',
      type: 'true-false',
      prompt: 'hold-and-wait 를 깨기 위해 모든 lock 을 한 번에 잡는 방식은 concurrency 를 증가시키는 부수 효과가 있다.',
      answer: false,
      explanation: '반대 — 실제 보호 대상보다 훨씬 앞에서 lock 을 잡아 critical section 이 불필요하게 길어지므로 concurrency 가 줄어든다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch24-mc-1',
      type: 'multiple-choice',
      prompt: 'non-deadlock 버그 두 종류와 그 처방이 올바르게 짝지어진 것은?',
      options: [
        { text: 'atomicity violation → condition variable / order violation → lock' },
        { text: 'atomicity violation → lock / order violation → condition variable' },
        { text: '둘 다 semaphore 로만 해결 가능' },
        { text: '둘 다 trylock 으로 해결' },
      ],
      answerIndex: 1,
      explanation: '"한 덩어리가 쪼개짐" 은 lock 으로 묶고, "A 먼저" 는 CV(+state+lock)로 순서를 강제한다.',
    },
    {
      id: 'ch24-mc-2',
      type: 'multiple-choice',
      prompt: 'MySQL 의 thd->proc_info 버그(NULL 검사 후 사용 사이에 다른 thread 가 NULL 대입)는 어떤 종류의 버그인가?',
      options: [
        { text: 'order violation' },
        { text: 'deadlock' },
        { text: 'atomicity violation' },
        { text: 'starvation' },
      ],
      answerIndex: 2,
      explanation: '"검사 + 사용" 이 하나의 묶음처럼 실행되어야 하는데 중간에 끼어듦 — 원자성 위반. 양쪽 모두 같은 lock 으로 보호해 해결.',
    },
    {
      id: 'ch24-mc-3',
      type: 'multiple-choice',
      prompt: 'Thread1 의 init() 이 mThread 를 만들기 전에 Thread2 의 mMain() 이 mThread->State 를 읽어 버리는 버그의 해결책은?',
      options: [
        { text: 'mThread 접근을 trylock 으로 감싼다' },
        { text: 'mtLock + mtCond + mtInit(state) 를 두고, mMain 이 while (mtInit == 0) cond_wait 로 기다리게 한다' },
        { text: 'Thread2 의 우선순위를 낮춘다' },
        { text: 'mThread 를 전역 변수로 바꾼다' },
      ],
      answerIndex: 1,
      explanation: 'order violation 의 정석 해법 — CV 3박자로 "초기화 완료" 라는 순서를 강제. 스케줄러가 누굴 먼저 돌리든 안전해진다.',
    },
    {
      id: 'ch24-mc-4',
      type: 'multiple-choice',
      prompt: 'v1.AddAll(v2) 와 v2.AddAll(v1) 이 동시에 호출될 때 deadlock 이 가능한 이유는?',
      options: [
        { text: 'AddAll 이 재귀 호출이기 때문' },
        { text: 'Thread1 은 v1→v2, Thread2 는 v2→v1 — 서로 반대 순서로 내부 lock 을 잡기 때문' },
        { text: 'vector 가 thread-safe 하지 않기 때문' },
        { text: '두 vector 의 크기가 다르기 때문' },
      ],
      answerIndex: 1,
      explanation: '각자 하나씩 잡은 채 상대 lock 을 기다리면 circular wait. 사용자는 내부 locking 을 모르므로(encapsulation) 더 위험하다.',
    },
    {
      id: 'ch24-mc-5',
      type: 'multiple-choice',
      prompt: 'deadlock 4조건과 그것을 깨는 prevention 기법의 짝으로 틀린 것은?',
      options: [
        { text: 'Circular wait — 모든 thread 가 같은 순서로 lock 획득' },
        { text: 'Hold-and-wait — 필요한 lock 을 한 번에 모두 획득' },
        { text: 'No preemption — trylock 으로 실패 시 가진 lock 을 풀고 재시도' },
        { text: 'Mutual exclusion — 더 큰 글로벌 lock 하나로 모든 자원을 보호' },
      ],
      answerIndex: 3,
      explanation: 'mutual exclusion 을 깨는 방법은 lock 을 "없애는" 것 — CAS 같은 atomic instruction 으로 lock-free/wait-free 구조를 만드는 접근.',
    },
    {
      id: 'ch24-mc-6',
      type: 'multiple-choice',
      prompt: 'trylock 패턴(실패 시 unlock 후 goto top)이 만들 수 있는 새 문제와 그 완화책은?',
      options: [
        { text: 'starvation — 우선순위를 올린다' },
        { text: 'livelock — 재시도 전에 random delay 를 넣는다' },
        { text: 'deadlock — lock 순서를 고정한다' },
        { text: 'race condition — atomic 연산을 쓴다' },
      ],
      answerIndex: 1,
      explanation: '두 thread 의 타이밍이 계속 맞물리면 잡고-실패하고-풀고가 무한 반복. random delay 로 타이밍을 어긋낸다.',
    },
    {
      id: 'ch24-mc-7',
      type: 'multiple-choice',
      prompt: 'avoidance via scheduling 의 전제 조건은?',
      options: [
        { text: '각 thread 가 어떤 lock 을 사용할지 스케줄러가 미리 알아야 한다 (global knowledge)' },
        { text: 'CPU 가 하나여야 한다' },
        { text: '모든 lock 이 spinlock 이어야 한다' },
        { text: 'thread 수가 lock 수보다 적어야 한다' },
      ],
      answerIndex: 0,
      explanation: '일반 OS 가 모든 프로그램의 lock 사용 패턴을 미리 알기는 어렵다 — 이 방식의 근본 한계. 게다가 병렬성도 줄어든다.',
    },
    {
      id: 'ch24-mc-8',
      type: 'multiple-choice',
      prompt: 'detect and recover 방식이 데이터베이스에서 특히 많이 쓰이는 이유는?',
      options: [
        { text: 'DB 에는 lock 이 없기 때문' },
        { text: '여러 transaction 이 lock 을 잡고 돌아 deadlock 가능성이 있고, 발견 시 transaction abort 로 복구할 수 있기 때문' },
        { text: 'DB 는 단일 thread 로 동작하기 때문' },
        { text: 'DB 의 lock 은 자동으로 풀리기 때문' },
      ],
      answerIndex: 1,
      explanation: 'detector 가 주기적으로 resource graph 의 cycle 을 검사하고, cycle 발견 시 transaction abort / thread 종료 / 재시작으로 복구.',
    },
    {
      id: 'ch24-mc-9',
      type: 'multiple-choice',
      prompt: '운영체제가 완전히 멈춰 사용자가 컴퓨터를 재부팅하는 것은 deadlock 대응 분류상 어디에 가까운가?',
      options: [
        { text: 'prevention' },
        { text: 'avoidance' },
        { text: 'detect and recover (넓은 의미의 recovery)' },
        { text: 'mutual exclusion 깨기' },
      ],
      answerIndex: 2,
      explanation: '발생을 허용하고 사후에 복구한다는 점에서 recovery 의 일종이다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch24-sa-1',
      type: 'short-answer',
      prompt: 'deadlock 4조건 중 "thread 들이 서로 원형으로 자원을 기다리는 cycle" 조건의 이름은? (영문)',
      answers: ['circular wait', 'circularwait'],
      hint: 'lock 순서 고정으로 깨는 그 조건',
      explanation: 'circular wait — 전체 시스템에서 lock 순서를 하나로 정하면 기다림이 한 방향이 되어 cycle 이 생기지 않는다.',
    },
    {
      id: 'ch24-sa-2',
      type: 'short-answer',
      prompt: 'thread 들이 멈춰 있지는 않지만 같은 동작만 반복하며 진전이 없는 상태의 이름은? (영문)',
      answers: ['livelock', 'live lock'],
      hint: 'deadlock 과 한 글자 차이',
      explanation: 'livelock — trylock 재시도 패턴이나 CAS 경쟁 반복에서 생길 수 있다.',
    },
    {
      id: 'ch24-sa-3',
      type: 'short-answer',
      prompt: 'deadlock 4조건 중 "자원을 가진 채로 다른 자원을 기다림" 조건의 이름은? (영문)',
      answers: ['hold-and-wait', 'hold and wait', 'holdandwait'],
      hint: '모든 lock 을 한 번에 잡아서 깨는 그 조건',
      explanation: 'hold-and-wait — 글로벌 prevention lock 으로 lock 획득 구간 전체를 묶어 깬다.',
    },
    {
      id: 'ch24-sa-4',
      type: 'short-answer',
      prompt: 'lock 없이 자료구조를 안전하게 갱신하기 위해 쓰는 대표적 hardware atomic instruction 은? (영문 약어 가능)',
      answers: ['cas', 'compare-and-swap', 'compare and swap', 'compareandswap'],
      hint: '비교와 대입을 atomic 으로',
      explanation: 'Compare-And-Swap — mutual exclusion 조건 자체를 깨는 wait-free/lock-free 접근의 기반.',
    },
    {
      id: 'ch24-sa-5',
      type: 'short-answer',
      prompt: 'deadlock detector 가 cycle 을 찾기 위해 만드는, "보유/대기 관계" 를 담은 그래프의 이름은? (영문)',
      answers: ['resource graph', 'resource allocation graph', 'wait-for graph', 'resourcegraph'],
      hint: '○○ graph',
      explanation: 'resource graph — 어떤 thread 가 어떤 lock 을 보유/대기 중인지 기록하고 cycle 을 검사한다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸 — 강의 코드
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch24-cb-1',
      type: 'code-blank',
      prompt: 'order violation 의 해결 코드 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'Thread1::\nvoid init() {\n    mThread = PR_CreateThread(mMain, ...);\n    pthread_mutex_lock(&mtLock);\n    mtInit = ' },
        { kind: 'blank', answers: ['1', '1;'], width: 4 },
        { kind: 'text', text: ';                    // 초기화 완료 표시\n    ' },
        { kind: 'blank', answers: ['pthread_cond_signal(&mtCond)', 'pthread_cond_signal(&mtCond);'], width: 30 },
        { kind: 'text', text: ';\n    pthread_mutex_unlock(&mtLock);\n}\n\nThread2::\nvoid mMain(...) {\n    pthread_mutex_lock(&mtLock);\n    while (' },
        { kind: 'blank', answers: ['mtInit == 0', 'mtInit==0'], width: 12 },
        { kind: 'text', text: ')\n        pthread_cond_wait(&mtCond, &mtLock);\n    pthread_mutex_unlock(&mtLock);\n    mState = mThread->State;\n}' },
      ],
      explanation: '22장 3박자 그대로 — state(mtInit) + CV(mtCond) + lock(mtLock). while 재검사도 동일.',
    },
    {
      id: 'ch24-cb-2',
      type: 'code-blank',
      prompt: 'lock 주소값 기준으로 획득 순서를 강제하는 코드 (circular wait 깨기) — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'if (m1 > m2) {\n    pthread_mutex_lock(' },
        { kind: 'blank', answers: ['m1'], width: 4 },
        { kind: 'text', text: ');\n    pthread_mutex_lock(' },
        { kind: 'blank', answers: ['m2'], width: 4 },
        { kind: 'text', text: ');\n} else {\n    pthread_mutex_lock(m2);\n    pthread_mutex_lock(m1);\n}' },
      ],
      explanation: '어느 thread 든 "주소가 큰 쪽 먼저" 라는 같은 기준을 따르므로 기다림이 한 방향 — cycle 불가.',
    },
    {
      id: 'ch24-cb-3',
      type: 'code-blank',
      prompt: 'trylock 으로 no preemption 깨기 — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'top:\nlock(L1);\nif (tryLock(L2) == -1) {\n    ' },
        { kind: 'blank', answers: ['unlock(L1)', 'unlock(L1);'], width: 12 },
        { kind: 'text', text: ';      // 가진 lock 을 풀고\n    ' },
        { kind: 'blank', answers: ['goto top', 'goto top;'], width: 10 },
        { kind: 'text', text: ';       // 처음부터 재시도\n}' },
      ],
      explanation: '"자원을 가진 채로 다른 자원을 기다리는 상태" 를 스스로 끊는다. 대신 두 thread 가 맞물리면 livelock — random delay 로 완화.',
    },
    {
      id: 'ch24-cb-4',
      type: 'code-blank',
      prompt: 'CAS 로 구현한 AtomicIncrement (올바른 스코프 버전) — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void AtomicIncrement(int *value, int amount) {\n    int old;\n    do {\n        old = ' },
        { kind: 'blank', answers: ['*value', '*value;'], width: 8 },
        { kind: 'text', text: ';                // 현재 값을 읽음\n    } while (CompareAndSwap(value, ' },
        { kind: 'blank', answers: ['old'], width: 5 },
        { kind: 'text', text: ', ' },
        { kind: 'blank', answers: ['old + amount', 'old+amount'], width: 14 },
        { kind: 'text', text: ') == 0);\n}' },
      ],
      explanation: '읽은 사이에 다른 thread 가 value 를 바꿨다면 CAS 가 실패하므로 다시 읽고 재시도 — lock 없는 안전한 증가.',
    },
    {
      id: 'ch24-cb-5',
      type: 'code-blank',
      prompt: 'CAS 를 사용하는 wait-free insert — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void insert(int value) {\n    node_t *n = malloc(sizeof(node_t));\n    assert(n != NULL);\n    n->value = value;\n    do {\n        n->next = ' },
        { kind: 'blank', answers: ['head', 'head;'], width: 6 },
        { kind: 'text', text: ';\n    } while (CompareAndSwap(&head, ' },
        { kind: 'blank', answers: ['n->next', 'n->next '], width: 9 },
        { kind: 'text', text: ', ' },
        { kind: 'blank', answers: ['n'], width: 3 },
        { kind: 'text', text: ') == 0);\n}' },
      ],
      explanation: '"head 가 여전히 n->next(내가 읽은 값)와 같으면 head 를 n 으로" — 다른 thread 가 head 를 바꿨으면 실패 → 재시도.',
    },
    {
      id: 'ch24-cb-6',
      type: 'code-blank',
      prompt: 'TAS vs CAS 비교 표 — 빈칸을 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: '구분                 | Test-and-Set        | Compare-and-Swap\n동작                 | 무조건 새 값으로 바꿈 | 현재 값이 ' },
        { kind: 'blank', answers: ['expected', 'expected와 같을 때만', 'expected 와 같을 때만'], width: 10 },
        { kind: 'text', text: ' 와 같을 때만 바꿈\n반환                 | 보통 ' },
        { kind: 'blank', answers: ['old value', 'old', '옛값', '이전 값'], width: 10 },
        { kind: 'text', text: ' 반환    | 성공/실패 또는 actual value\nlock-free 자료구조    | 제한적              | 훨씬 ' },
        { kind: 'blank', answers: ['유용', '유용함', '적합'], width: 6 },
        { kind: 'text', text: '\n실패 시 메모리 write  | 함                  | 안 함' },
      ],
      explanation: 'TAS 는 무조건 write 라 다중 상태를 깨뜨릴 수 있고, CAS 는 조건부 write 라 lock-free 구조에 적합.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch24-essay-1',
      type: 'essay',
      prompt:
        'Java Vector 의 AddAll deadlock 시나리오를 4조건에 대응시켜 설명하고, 이를 막는 prevention 기법을 두 가지 이상 제시하라.',
      modelAnswer: [
        '[시나리오] Thread1: v1.AddAll(v2) → 내부에서 lock(v1) 후 lock(v2). Thread2: v2.AddAll(v1) → lock(v2) 후 lock(v1). T1 이 v1 을 잡고, T2 가 v2 를 잡은 시점에 서로 상대의 lock 을 기다리며 정지한다.',
        '',
        '[4조건 대응]',
        '- Mutual exclusion: vector 객체별 lock 은 한 번에 한 thread 만 보유.',
        '- Hold-and-wait: T1 은 v1 을 든 채 v2 를 기다림 (T2 도 대칭).',
        '- No preemption: 상대의 lock 을 강제로 뺏을 수 없음.',
        '- Circular wait: T1→v2→T2→v1→T1 의 cycle 완성.',
        '추가로 이 버그가 위험한 이유는 encapsulation — 사용자는 AddAll 내부에서 lock 을 잡는다는 사실 자체를 모를 수 있다.',
        '',
        '[Prevention]',
        '1) Circular wait 깨기 — 객체의 주소(또는 고유 id) 순서로 항상 같은 순서로 lock 을 잡게 한다. 모든 호출이 같은 기준을 따르면 cycle 이 불가능. 가장 실용적.',
        '2) Hold-and-wait 깨기 — 글로벌 prevention lock 으로 "두 lock 을 잡는 구간" 전체를 감싸 한 번에 모두 잡게 한다. 단, 내부 lock 을 미리 알아야 하고 concurrency 가 줄어든다.',
        '3) No preemption 깨기 — lock(v1) 후 trylock(v2) 실패 시 v1 을 풀고 재시도. 단 livelock 위험 → random delay.',
      ].join('\n'),
      rubric: [
        '서로 반대 순서의 내부 lock 획득 시나리오',
        '4조건 각각에의 대응',
        'prevention 2가지 이상 + 각 기법의 대가(단점) 언급',
      ],
    },
    {
      id: 'ch24-essay-2',
      type: 'essay',
      prompt: 'deadlock · livelock · starvation 세 상태를 정의하고, 각각의 예를 이 장(또는 23장)의 내용에서 하나씩 들어 구분하라.',
      modelAnswer: [
        '[Deadlock] 여러 thread 가 서로가 가진 자원을 기다리며 모두 blocked 되어 영원히 진행하지 못하는 상태. CPU 도 쓰지 않는다. 예: T1 이 L1 을 들고 L2 를, T2 가 L2 를 들고 L1 을 기다리는 교차 lock — 또는 식사하는 철학자 전원이 왼쪽 포크만 든 상황 (circular wait).',
        '',
        '[Livelock] thread 들이 blocked 되지는 않고 계속 실행되지만(상태도 계속 바뀜), 같은 패턴만 반복하며 아무도 전진하지 못하는 상태. 예: trylock 패턴에서 T1 과 T2 가 "잡고 → tryLock 실패 → 풀고 → 재시도" 를 정확히 같은 타이밍으로 무한 반복. 완화: 재시도 전 random delay.',
        '',
        '[Starvation] 시스템 전체는 정상 진행되는데 특정 thread 만 계속 실행/획득 기회를 얻지 못하는 상태. 예: reader-writer lock 에서 reader 가 끊임없이 들어와 readers count 가 0 이 되지 않아 writer 가 영영 writelock 을 못 잡는 writer starvation.',
        '',
        '[구분 포인트] 멈췄는가? — deadlock 만 전원 정지. CPU 를 쓰는가? — livelock 은 바쁘게 돌면서 진전 없음. 일부만 피해를 보는가? — starvation 은 나머지가 잘 돌아간다는 점에서 앞의 둘과 다르다.',
      ].join('\n'),
      rubric: [
        '세 상태의 정의 (blocked 여부 / CPU 사용 여부 / 전체 vs 일부)',
        '각 상태에 대한 강의 범위 내 구체적 예시',
        '구분 기준의 명확한 대비',
      ],
    },
  ],
};

export default quiz;
