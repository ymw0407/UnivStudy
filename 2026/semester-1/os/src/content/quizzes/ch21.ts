import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '21-concurrent-data-structures',
  chapterNumber: 21,
  title: 'Lock-based Concurrent Data Structures',
  description: 'Approximate counter, hand-over-hand, Michael&Scott queue, hash table — fine-grained 쪼개기와 그 대가.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch21-tf-1',
      type: 'true-false',
      prompt: '단일 lock counter 에서 thread 수를 늘리면 CPU 가 4개일 때 throughput 도 그에 비례해 늘어난다.',
      answer: false,
      explanation:
        '모든 thread 가 같은 lock·같은 value 에 몰리므로 lock 이 직렬화 지점이 된다. thread 가 늘수록 경쟁과 context switch 오버헤드만 누적되어 오히려 느려질 수 있다.',
    },
    {
      id: 'ch21-tf-2',
      type: 'true-false',
      prompt: 'approximate counter 의 get() 이 반환하는 값은 항상 실제 카운트와 정확히 일치한다.',
      answer: false,
      explanation: 'local counter 에 아직 합산되지 않은 값은 포함되지 않으므로 근사값(approximate)이다.',
    },
    {
      id: 'ch21-tf-3',
      type: 'true-false',
      prompt: 'approximate counter 에서 threshold S 를 키우면 성능은 좋아지지만 global counter 와 실제 값의 차이는 커진다.',
      answer: true,
      explanation: 'S 큼 = global lock 을 덜 잡음(빠름) but 반영 지연 큼. S 작음 = 정확하지만 느림.',
    },
    {
      id: 'ch21-tf-4',
      type: 'true-false',
      prompt: 'hand-over-hand locking 은 동시성을 높이므로 coarse-grained 단일 lock 리스트보다 항상 빠르다.',
      answer: false,
      explanation: '노드마다 lock/unlock 을 반복하는 오버헤드가 커서 실제로는 항상 더 빠르지는 않다.',
    },
    {
      id: 'ch21-tf-5',
      type: 'true-false',
      prompt: 'Michael & Scott queue 에서 dummy node 덕분에 enqueue 와 dequeue 가 서로 다른 노드를 만지게 되어 headLock 과 tailLock 이 충돌하지 않는다.',
      answer: true,
      explanation: 'dummy 가 항상 head 자리에 있어 빈 큐/원소 1개 상황에서도 두 lock 이 같은 노드를 두고 경쟁하지 않는다.',
    },
    {
      id: 'ch21-tf-6',
      type: 'true-false',
      prompt: 'M&S queue 의 dequeue 는 값을 꺼낸 노드(newHead)를 free 하고, 기존 dummy 를 그대로 둔다.',
      answer: false,
      explanation: '반대다. newHead 의 value 만 꺼낸 뒤 newHead 를 "새 dummy 로 승격" 시키고, 기존 dummy(tmp)를 free 한다.',
    },
    {
      id: 'ch21-tf-7',
      type: 'true-false',
      prompt: 'concurrent hash table 에서 서로 다른 bucket 에 접근하는 thread 들은 서로 기다리지 않고 동시에 진행할 수 있다.',
      answer: true,
      explanation: 'bucket 마다 자기 lock 이 있기 때문 — fine-grained locking 의 효과.',
    },
    {
      id: 'ch21-tf-8',
      type: 'true-false',
      prompt: 'hash function 이 나빠서 모든 key 가 한 bucket 에 몰려도, bucket lock 구조 덕분에 성능은 그대로 유지된다.',
      answer: false,
      explanation: '한 bucket 에 몰리면 그 bucket 의 lock 하나에 모두 경쟁 — 사실상 single-lock 리스트와 같은 병목이 된다.',
    },
    {
      id: 'ch21-tf-9',
      type: 'true-false',
      prompt: 'List_Insert 에서 malloc 은 공유 자료구조와 무관하므로 lock 밖으로 빼는 것이 좋다.',
      answer: true,
      explanation: 'critical section 이 짧을수록 다른 thread 의 대기가 줄어든다. lock 안에는 head 를 만지는 두 줄만.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch21-mc-1',
      type: 'multiple-choice',
      prompt: '단일 lock counter 의 병목 원인으로 가장 정확한 것은?',
      options: [
        { text: '++ 연산 자체가 느리기 때문' },
        { text: '모든 thread 가 하나의 shared counter 와 하나의 lock 에 동시에 몰리는 구조 때문' },
        { text: 'CPU 캐시가 작기 때문' },
        { text: 'mutex 가 커널 객체이기 때문' },
      ],
      answerIndex: 1,
      explanation: '병목은 계산이 아니라 "모두가 같은 곳을 건드리는 구조". 그래서 해법도 구조를 쪼개는 것.',
    },
    {
      id: 'ch21-mc-2',
      type: 'multiple-choice',
      prompt: 'approximate counter 의 동작 순서로 올바른 것은?',
      options: [
        { text: 'global 증가 → threshold 확인 → local 에 분배' },
        { text: 'local 증가 → threshold 도달 시 global lock 잡고 합산 → local 리셋' },
        { text: 'local 과 global 을 항상 동시에 증가' },
        { text: 'threshold 도달 시 local 들을 모두 0 으로 만들고 버린다' },
      ],
      answerIndex: 1,
      explanation: '자기 CPU 의 local 만 증가시키다가 S 에 도달하면 그때만 global 에 반영하고 local = 0.',
    },
    {
      id: 'ch21-mc-3',
      type: 'multiple-choice',
      prompt: 'hand-over-hand locking 의 이동 규칙은?',
      options: [
        { text: '현재 노드 lock 을 먼저 풀고, 다음 노드 lock 을 잡는다' },
        { text: '다음 노드 lock 을 먼저 잡고, 그 다음에 현재 노드 lock 을 푼다' },
        { text: '두 노드의 lock 을 동시에 풀었다 동시에 잡는다' },
        { text: '리스트 전체 lock 을 잡은 채 이동한다' },
      ],
      answerIndex: 1,
      explanation: '항상 두 lock 을 잠깐 겹쳐 들고 한 칸씩 — 그래야 이동 중인 구간이 보호된다. 풀고 나서 잡으면 그 틈에 구조가 바뀔 수 있다.',
    },
    {
      id: 'ch21-mc-4',
      type: 'multiple-choice',
      prompt: 'queue 가 linked list 보다 fine-grained locking 을 적용하기 쉬운 이유는?',
      options: [
        { text: 'queue 가 더 짧기 때문' },
        { text: 'enqueue 는 tail, dequeue 는 head — 두 연산이 서로 다른 끝에서 일어나므로 lock 을 둘로 나눌 수 있기 때문' },
        { text: 'queue 는 탐색이 필요 없어 lock 이 아예 필요 없기 때문' },
        { text: 'queue 는 node 가 고정 크기이기 때문' },
      ],
      answerIndex: 1,
      explanation: 'headLock(dequeue 보호) + tailLock(enqueue 보호) 로 분리 → 두 연산이 동시 진행 가능.',
    },
    {
      id: 'ch21-mc-5',
      type: 'multiple-choice',
      prompt: '첫 번째 List_Lookup 코드에서 "성공 시 unlock 하고 return, 실패 시에도 unlock 하고 return" 처럼 return 을 여러 곳에 두는 방식의 위험은?',
      options: [
        { text: '컴파일이 안 된다' },
        { text: '어떤 return 경로에서 unlock 을 빼먹으면 lock 이 영원히 잡혀 다른 thread 가 모두 막힌다' },
        { text: 'return 이 느려진다' },
        { text: '결과값이 틀려진다' },
      ],
      answerIndex: 1,
      explanation: '결과를 rv 에 담고 함수 끝 한 곳에서 return 하면 unlock 이 항상 실행된다 — malloc 실패 경로도 마찬가지.',
    },
    {
      id: 'ch21-mc-6',
      type: 'multiple-choice',
      prompt: 'concurrent hash table 의 성능을 좌우하는 요소가 아닌 것은?',
      options: [
        { text: 'bucket 수' },
        { text: 'hash function 의 분산 품질' },
        { text: '각 bucket 내부 list 의 길이' },
        { text: 'key 값의 절대적 크기' },
      ],
      answerIndex: 3,
      explanation: 'key 가 큰 수인지 작은 수인지는 무관 — 분산만 잘 되면 된다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch21-sa-1',
      type: 'short-answer',
      prompt: 'thread/CPU 수를 늘리면 처리량도 그만큼 늘어나는 이상적 상태를 부르는 용어는? (영문)',
      answers: ['perfect scaling', 'perfectscaling'],
      hint: '○○ scaling',
      explanation: '단일 lock counter 는 이를 달성하지 못한다 — 오히려 역방향.',
    },
    {
      id: 'ch21-sa-2',
      type: 'short-answer',
      prompt: 'threshold S = 5 인 approximate counter 에서 CPU 0 의 local 이 4 일 때 update 가 한 번 더 오면, global 에 더해지는 값은? (정수)',
      answers: ['5'],
      hint: 'local 이 threshold 에 도달하는 순간 통째로 합산',
      explanation: 'local 4 + 1 = 5 → threshold 도달 → global += 5, local = 0.',
    },
    {
      id: 'ch21-sa-3',
      type: 'short-answer',
      prompt: 'M&S queue 의 Queue_Init 에서 head 와 tail 이 처음에 함께 가리키는 특수 노드의 이름은? (영문)',
      answers: ['dummy node', 'dummy', 'dummynode'],
      hint: '값이 없는 자리 채움 노드',
      explanation: 'dummy node — head/tail 분리를 가능하게 하는 핵심 트릭.',
    },
    {
      id: 'ch21-sa-4',
      type: 'short-answer',
      prompt: '리스트 전체에 lock 하나 대신 노드마다 lock 을 두고 옮겨 가며 잡는 기법의 이름은? (영문, 두 이름 중 하나)',
      answers: ['hand-over-hand locking', 'hand over hand locking', 'hand-over-hand', 'lock coupling', 'lockcoupling'],
      hint: '사다리 타듯이 / lock ○○ling',
      explanation: 'hand-over-hand locking = lock coupling.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸 — 강의 구현 코드
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch21-cb-1',
      type: 'code-blank',
      prompt: 'Approximate counter 의 update() — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void update(counter_t *c, int threadID, int amt) {\n    pthread_mutex_lock(&c->llock[threadID]);   // local lock\n    c->local[threadID] += amt;\n\n    if (c->local[threadID] >= ' },
        { kind: 'blank', answers: ['c->threshold', 'c->threshold '], width: 14 },
        { kind: 'text', text: ') {\n        pthread_mutex_lock(&c->glock);\n        c->global += ' },
        { kind: 'blank', answers: ['c->local[threadID]', 'c->local[cpu]'], width: 20 },
        { kind: 'text', text: ';\n        pthread_mutex_unlock(&c->glock);\n        c->local[threadID] = ' },
        { kind: 'blank', answers: ['0', '0;'], width: 4 },
        { kind: 'text', text: ';\n    }\n\n    pthread_mutex_unlock(&c->llock[threadID]);\n}' },
      ],
      explanation: 'local 이 threshold 에 도달했을 때만 global lock 을 잡고 합산 → local 리셋. 평소에는 local lock 만.',
    },
    {
      id: 'ch21-cb-2',
      type: 'code-blank',
      prompt: '개선된 List_Insert — critical section 을 좁힌 버전. 빈칸(어디서 lock 을 잡고 푸는가)을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void List_Insert(list_t *L, int key) {\n    node_t *new = malloc(sizeof(node_t));   // lock 밖 — 동기화 불필요\n    if (new == NULL) { perror("malloc"); return; }\n    new->key = key;\n\n    ' },
        { kind: 'blank', answers: ['pthread_mutex_lock(&L->lock)', 'pthread_mutex_lock(&L->lock);'], width: 30 },
        { kind: 'text', text: ';\n    new->next = L->head;\n    L->head = ' },
        { kind: 'blank', answers: ['new', 'new;'], width: 6 },
        { kind: 'text', text: ';\n    ' },
        { kind: 'blank', answers: ['pthread_mutex_unlock(&L->lock)', 'pthread_mutex_unlock(&L->lock);'], width: 32 },
        { kind: 'text', text: ';\n}' },
      ],
      explanation: 'malloc 은 lock 밖, head 를 만지는 두 줄만 lock 안 — critical section 최소화.',
    },
    {
      id: 'ch21-cb-3',
      type: 'code-blank',
      prompt: 'Michael & Scott queue 의 Enqueue — 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'void Queue_Enqueue(queue_t *q, int value) {\n    node_t *tmp = malloc(sizeof(node_t));\n    tmp->value = value;\n    tmp->next = NULL;\n\n    pthread_mutex_lock(&q->' },
        { kind: 'blank', answers: ['tailLock'], width: 10 },
        { kind: 'text', text: ');\n    q->tail->next = ' },
        { kind: 'blank', answers: ['tmp', 'tmp;'], width: 6 },
        { kind: 'text', text: ';\n    q->tail = ' },
        { kind: 'blank', answers: ['tmp', 'tmp;'], width: 6 },
        { kind: 'text', text: ';\n    pthread_mutex_unlock(&q->tailLock);\n}' },
      ],
      explanation: 'enqueue 는 tail 쪽만 — tailLock 으로 보호하고 "이어 붙이기 → tail 갱신" 두 줄.',
    },
    {
      id: 'ch21-cb-4',
      type: 'code-blank',
      prompt: 'M&S queue 의 Dequeue — dummy 승격 트릭. 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'int Queue_Dequeue(queue_t *q, int *value) {\n    pthread_mutex_lock(&q->' },
        { kind: 'blank', answers: ['headLock'], width: 10 },
        { kind: 'text', text: ');\n    node_t *tmp = q->head;          // 현재 dummy\n    node_t *newHead = ' },
        { kind: 'blank', answers: ['tmp->next', 'tmp->next;'], width: 12 },
        { kind: 'text', text: ';\n    if (newHead == NULL) {\n        pthread_mutex_unlock(&q->headLock);\n        return -1;                  // queue was empty\n    }\n    *value = newHead->value;        // 값만 꺼내고\n    q->head = ' },
        { kind: 'blank', answers: ['newHead', 'newHead;'], width: 10 },
        { kind: 'text', text: ';            // newHead 가 새 dummy 로 승격\n    pthread_mutex_unlock(&q->headLock);\n    ' },
        { kind: 'blank', answers: ['free(tmp)', 'free(tmp);'], width: 12 },
        { kind: 'text', text: ';                  // 옛 dummy 해제\n    return 0;\n}' },
      ],
      explanation: 'newHead 노드를 삭제하는 게 아니라 value 만 반환하고 새 dummy 로 만든다. free 되는 것은 옛 dummy.',
    },
    {
      id: 'ch21-cb-5',
      type: 'code-blank',
      prompt: 'Concurrent hash table — bucket 선택. 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: '#define BUCKETS (101)\n\nint Hash_Insert(hash_t *H, int key) {\n    int bucket = ' },
        { kind: 'blank', answers: ['key % BUCKETS', 'key%BUCKETS'], width: 16 },
        { kind: 'text', text: ';\n    return List_Insert(&H->lists[' },
        { kind: 'blank', answers: ['bucket'], width: 8 },
        { kind: 'text', text: '], key);\n}' },
      ],
      explanation: 'hash function 으로 bucket 번호를 계산해 그 bucket 의 concurrent list 에 위임. bucket 별 lock 이 fine-grained 의 핵심.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch21-essay-1',
      type: 'essay',
      prompt:
        'approximate counter 의 threshold S 가 만드는 trade-off 를 설명하고, "정확도가 늦게 반영되어도 괜찮은 상황" 의 예를 들어 이 자료구조가 적합한 경우를 논하라.',
      modelAnswer: [
        '[구조] CPU(core)마다 local counter + local lock 을 두고, thread 는 자기 local 만 증가시킨다. local 이 threshold S 에 도달하면 그때만 global lock 을 잡아 global += local 후 local = 0.',
        '',
        '[S 가 작을 때] local 이 자주 global 에 반영 → global 값이 actual count 에 가깝다(정확). 대신 global lock 을 자주 잡으므로 경쟁이 늘어 성능이 떨어진다.',
        '[S 가 클 때] global lock 을 드물게 잡아 성능이 좋다. 대신 local 에 머무는 양이 많아 global 과 actual 의 차이(반영 지연)가 커진다 — 정확도(response time) 손해.',
        '',
        '[적합한 경우] 정확한 순간값보다 추세/대략적 크기만 필요한 통계성 카운터 — 예: 웹서버의 총 요청 수 집계, 패킷 수 모니터링, 페이지 뷰 카운트. 이런 워크로드는 업데이트는 매우 빈번하지만 읽기는 가끔이고 약간의 오차가 허용되므로, S 를 키워 성능을 취하는 것이 합리적이다. 반대로 잔액·재고처럼 정확한 값이 필요한 곳에는 부적합하다.',
      ].join('\n'),
      rubric: [
        'local/global 구조와 threshold 동작 설명',
        'S 작음 = 정확↑성능↓ / S 큼 = 성능↑정확↓ 양방향 명시',
        '오차 허용 워크로드의 구체적 예시 제시',
      ],
    },
  ],
};

export default quiz;
