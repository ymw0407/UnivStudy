import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '16-swapping-policies',
  chapterNumber: 16,
  title: 'Swapping: Policies',
  description: 'AMAT 계산, OPT/FIFO/Random/LRU 트레이스, Belady, Clock, dirty bit, thrashing — 계산 단답 다수.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch16-tf-1',
      type: 'true-false',
      prompt: 'frame 수를 늘리면 어떤 정책에서든 page fault 는 줄어들거나 같다.',
      answer: false,
      explanation:
        "FIFO 에는 frame 을 늘렸는데 fault 가 오히려 늘어나는 Belady's Anomaly 가 있다 (예: 참조열 1,2,3,4,1,2,5,1,2,3,4,5 에서 3→4 frame 시 9→10 fault).",
    },
    {
      id: 'ch16-tf-2',
      type: 'true-false',
      prompt: 'OPT(MIN) 는 미래의 참조를 모두 안다고 가정하므로 실제 시스템에서는 구현할 수 없고, 정책 비교의 상한선(벤치마크)으로 쓰인다.',
      answer: true,
      explanation: '어떤 정책이 OPT 보다 좋게 나왔다면 OPT 를 잘못 구한 것이다.',
    },
    {
      id: 'ch16-tf-3',
      type: 'true-false',
      prompt: '지역성(locality)이 전혀 없는 uniform random 워크로드에서는 OPT 를 제외하면 LRU·FIFO·Random 의 hit rate 가 거의 같다.',
      answer: true,
      explanation: '과거를 봐도 미래를 못 맞추므로 정책 간 차이가 사라진다. hit rate ≈ 캐시 크기 / 전체 page 수.',
    },
    {
      id: 'ch16-tf-4',
      type: 'true-false',
      prompt: 'Clock 알고리즘은 LRU 와 항상 정확히 같은 victim 을 고른다.',
      answer: false,
      explanation:
        'use bit 1 개는 "최근에 썼나/안 썼나" 만 기억할 뿐 정확한 순서는 모른다. LRU 의 근사(approximation)이며 hit rate 는 LRU 에 가깝지만 조금 낮다.',
    },
    {
      id: 'ch16-tf-5',
      type: 'true-false',
      prompt: 'dirty bit = 0 인(수정되지 않은) page 를 evict 할 때는 disk write 를 생략할 수 있다.',
      answer: true,
      explanation: 'swap 에 이미 동일한 사본이 있으므로 다시 쓸 필요가 없다. code segment 처럼 읽기 전용 page 에서 효과가 크다.',
    },
    {
      id: 'ch16-tf-6',
      type: 'true-false',
      prompt: 'LRU 를 정확히 구현하려면 매 메모리 접근마다 최근 사용 순서를 갱신해야 하므로 오버헤드가 크다.',
      answer: true,
      explanation: 'doubly-linked list 라면 매 접근마다 노드를 찾아 맨 앞으로 옮겨야 한다. 그래서 Clock 같은 근사 기법이 등장했다.',
    },
    {
      id: 'ch16-tf-7',
      type: 'true-false',
      prompt: 'Clock·LRU·FIFO 는 메모리를 실제로 회수하는 "실행 주체" 이고, kswapd 같은 daemon 은 victim 을 고르는 "선택 규칙" 이다.',
      answer: false,
      explanation:
        '반대다. daemon(kswapd)이 실행 주체, Clock·LRU·FIFO 는 daemon 이 victim 을 고를 때 따르는 policy(선택 규칙)다.',
    },
    {
      id: 'ch16-tf-8',
      type: 'true-false',
      prompt: 'Random 정책은 어떤 워크로드에서도 FIFO 보다 항상 나쁘다.',
      answer: false,
      explanation:
        '같은 예제를 10,000 번 반복하면 상당수 시도가 FIFO 보다 좋고 일부는 OPT 급. looping-sequential 워크로드에서는 LRU/FIFO 보다 오히려 낫다.',
    },
    {
      id: 'ch16-tf-9',
      type: 'true-false',
      prompt: '80-20 워크로드(접근의 80% 가 hot page 20% 에 집중)에서는 LRU 가 FIFO·Random 보다 좋고 OPT 에 근접한다.',
      answer: true,
      explanation: '최근성 정보로 hot page 를 지켜낼 수 있기 때문 — 실제 코드가 흔히 보이는 패턴이다.',
    },
    {
      id: 'ch16-tf-10',
      type: 'true-false',
      prompt: 'thrashing 은 CPU 가 고장 나서 발생하는 현상이다.',
      answer: false,
      explanation:
        '동시 프로세스가 너무 많아(over-subscription) 모두가 page fault 처리(disk I/O)만 기다리는 상태. CPU 는 멀쩡한데 할 일이 없어 사용률이 급락한다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch16-mc-1',
      type: 'multiple-choice',
      prompt: '교과서 버전 AMAT 식 "AMAT = T_M + P_miss × T_D" 에서 T_M 앞에 P_hit 이 붙지 않는 이유는?',
      options: [
        { text: 'P_hit 은 항상 1 에 가깝기 때문에 생략한다' },
        { text: 'miss 인지 확인하려면 hit 이든 miss 든 물리 메모리(page table/TLB)를 한 번은 봐야 하므로 T_M 은 항상 발생하는 고정 비용이기 때문' },
        { text: 'T_M 이 T_D 보다 크기 때문' },
        { text: '수식을 단순화하기 위한 근사일 뿐 정확하지 않다' },
      ],
      answerIndex: 1,
      explanation: 'hit/miss 어느 쪽이든 메모리 접근 1 회는 무조건 발생 → T_M 을 고정 비용으로 더한다.',
    },
    {
      id: 'ch16-mc-2',
      type: 'multiple-choice',
      prompt: 'AMAT 를 줄이기 위해 교체 정책이 노리는 지점은?',
      options: [
        { text: 'T_M (메모리 접근 시간) 을 줄인다' },
        { text: 'T_D (디스크 접근 시간) 를 줄인다' },
        { text: 'P_miss (miss 확률) 를 줄인다 — 즉 hit rate 를 높인다' },
        { text: '메모리 접근 횟수 자체를 줄인다' },
      ],
      answerIndex: 2,
      explanation:
        'T_M·T_D 는 하드웨어 특성이라 정책으로 못 바꾼다. disk 항이 평균을 지배하므로 P_miss 를 줄이는 것이 유일한 길.',
    },
    {
      id: 'ch16-mc-3',
      type: 'multiple-choice',
      prompt: 'OPT 정책의 victim 선택 기준은?',
      options: [
        { text: '가장 먼저 들어온 page' },
        { text: '가장 오랫동안 안 쓰인 page' },
        { text: '앞으로 가장 나중에 쓰일(또는 다시 안 쓰일) page' },
        { text: '접근 빈도가 가장 낮은 page' },
      ],
      answerIndex: 2,
      explanation: '미래를 안다는 가정 하에 "앞으로 가장 늦게 필요한" page 를 내보내는 것이 최적.',
    },
    {
      id: 'ch16-mc-4',
      type: 'multiple-choice',
      prompt: 'Clock 알고리즘에서 시계 바늘이 가리킨 page 의 use bit 가 1 일 때 하는 일은?',
      options: [
        { text: '그 page 를 victim 으로 내보낸다' },
        { text: 'use bit 를 0 으로 리셋하고 바늘을 다음 칸으로 옮긴다' },
        { text: 'use bit 를 2 로 올린다' },
        { text: '바늘을 반대 방향으로 돌린다' },
      ],
      answerIndex: 1,
      explanation: '"한 번 봐줬다" — 리셋 후 전진. use = 0 인 page 를 만나면 그 page 가 victim.',
    },
    {
      id: 'ch16-mc-5',
      type: 'multiple-choice',
      prompt: '이 수업에서 LFU 를 다루지 않는 이유로 제시된 것은?',
      options: [
        { text: 'LFU 는 항상 LRU 보다 성능이 나쁘기 때문' },
        { text: '모든 page 의 접근 빈도를 카운트해 저장해야 해서 메모리 오버헤드가 커 현실적으로 구현이 어렵기 때문' },
        { text: '특허 문제 때문' },
        { text: 'LFU 는 Belady 역설이 발생하기 때문' },
      ],
      answerIndex: 1,
      explanation: 'page 가 수백만 개면 카운터만으로 MB 단위를 넘는다.',
    },
    {
      id: 'ch16-mc-6',
      type: 'multiple-choice',
      prompt: 'looping-sequential 워크로드(0~49 를 반복 접근)에서 frame 이 49 개일 때 LRU 의 hit rate 는?',
      options: [
        { text: '약 98% — 거의 다 들어가므로' },
        { text: '약 50%' },
        { text: '0% — 막 내보낸 page 가 바로 다음에 필요해지는 일이 반복된다' },
        { text: '100% — 50 개 중 49 개가 캐시에 있으므로' },
      ],
      answerIndex: 2,
      explanation:
        '새 page 를 넣을 때 가장 오래된(= 바로 다음 루프에서 곧 필요한) page 를 내보내므로 매번 miss. 50 칸이 되는 순간 100% 로 점프. 이 경우 Random 이 오히려 낫다.',
    },
    {
      id: 'ch16-mc-7',
      type: 'multiple-choice',
      prompt: 'Prefetching 과 Clustering 의 설명이 올바르게 짝지어진 것은?',
      options: [
        { text: 'Prefetching: 여러 write 를 모아 한 번에 / Clustering: 곧 쓸 page 를 미리 읽기' },
        { text: 'Prefetching: 곧 쓸 page 를 미리 같이 읽기 / Clustering: 여러 page write 를 모아 한 번의 큰 write 로' },
        { text: '둘 다 read 최적화 기법이다' },
        { text: '둘 다 write 최적화 기법이다' },
      ],
      answerIndex: 1,
      explanation:
        'Prefetching 은 순차 접근(code 등)에서 다음 page 를 미리 읽어 지연을 숨기고, Clustering 은 write 횟수를 줄인다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형 — 계산 / 트레이스
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch16-sa-1',
      type: 'short-answer',
      prompt: 'T_M = 100ns, T_D = 10ms, P_miss = 0.1 일 때 교과서 버전 AMAT 은 약 몇 ms 인가? (소수점 없이 정수 ms)',
      answers: ['1', '1ms', '1 ms', '약 1', '약 1ms'],
      hint: 'AMAT = T_M + P_miss × T_D. 100ns = 0.0001ms',
      explanation: 'AMAT = 0.0001ms + 0.1 × 10ms ≈ 1ms. disk 항이 평균을 지배한다.',
    },
    {
      id: 'ch16-sa-2',
      type: 'short-answer',
      prompt: '참조열 0,1,2,0,1,3,0,3,1,2,1 · frame 3 개에서 OPT 의 hit 횟수는? (정수)',
      answers: ['6', '6번', '6 번', '6회', '6 회'],
      hint: '처음 세 번(0,1,2)은 강제(compulsory) miss',
      explanation: 'hit 6 회 (54.6%). 3 을 처음 만날 때 "가장 나중에 쓰일 2" 를 내보내는 것이 핵심.',
    },
    {
      id: 'ch16-sa-3',
      type: 'short-answer',
      prompt: '같은 참조열(0,1,2,0,1,3,0,3,1,2,1) · frame 3 개에서 FIFO 의 hit 횟수는? (정수)',
      answers: ['4', '4번', '4 번', '4회', '4 회'],
      hint: '들어온 순서만 보고 내보낸다',
      explanation: 'hit 4 회 (36.4%). 자주 쓰이는 0 을 "먼저 들어왔다" 는 이유로 날리기 때문에 OPT 보다 나쁘다.',
    },
    {
      id: 'ch16-sa-4',
      type: 'short-answer',
      prompt: '같은 참조열 · frame 3 개에서 LRU 의 hit 횟수는? (정수)',
      answers: ['6', '6번', '6 번', '6회', '6 회'],
      hint: '이 예제에서는 어떤 이상적 정책과 같은 결과가 나온다',
      explanation: 'hit 6 회 — 이 예제에서는 OPT 와 동일. locality 가 있으면 최근성이 미래를 잘 예측한다.',
    },
    {
      id: 'ch16-sa-5',
      type: 'short-answer',
      prompt: '전체 100 개 page 를 균등 무작위로 접근하는 워크로드에서 캐시가 40 칸일 때 기대 hit rate 는 몇 % 인가? (정수)',
      answers: ['40', '40%', '40 %'],
      hint: 'hit rate ≈ 캐시 크기 / 전체 page 수',
      explanation: 'locality 가 없으면 hit rate ≈ 40/100 = 40%. 어떤 정책이든 비슷하다.',
    },
    {
      id: 'ch16-sa-6',
      type: 'short-answer',
      prompt: 'FIFO 에서 frame 을 늘렸는데 page fault 가 오히려 늘어나는 현상의 이름은? (영문)',
      answers: ["belady's anomaly", 'belady anomaly', 'beladys anomaly', "belady's"],
      hint: '사람 이름 + Anomaly',
      explanation: "Belady's Anomaly. OPT·LRU 같은 stack 알고리즘에서는 일어나지 않는다.",
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch16-cb-1',
      type: 'code-blank',
      prompt: 'AMAT 식 — 빈칸을 채워라. (기호: T_M, T_D, P_hit, P_miss 중에서)',
      language: 'text',
      segments: [
        { kind: 'text', text: '기댓값 정의:   AMAT = P_hit × T_M + ' },
        { kind: 'blank', answers: ['P_miss × T_D', 'P_miss x T_D', 'P_miss * T_D', 'p_miss × t_d'], width: 16 },
        { kind: 'text', text: '\n교과서 버전:   AMAT = ' },
        { kind: 'blank', answers: ['T_M', 't_m'], width: 6 },
        { kind: 'text', text: ' + ' },
        { kind: 'blank', answers: ['P_miss', 'p_miss'], width: 8 },
        { kind: 'text', text: ' × T_D\n\n(P_hit + P_miss = 1)' },
      ],
      explanation: 'miss 판별에도 메모리 한 번은 보므로 교과서 버전은 T_M 을 고정 비용으로 두고 P_miss × T_D 만 더한다.',
    },
    {
      id: 'ch16-cb-2',
      type: 'code-blank',
      prompt: 'Clock 알고리즘 동작 규칙 — 빈칸을 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: '1. victim 이 필요하면 바늘이 가리키는 page 의 use bit 를 본다.\n2. use = 1 이면 → use bit 를 ' },
        { kind: 'blank', answers: ['0으로 리셋', '0으로 리셋하고 전진', '0', '0으로'], width: 12 },
        { kind: 'text', text: ' 하고 바늘을 다음 칸으로 옮긴다.\n3. use = ' },
        { kind: 'blank', answers: ['0'], width: 4 },
        { kind: 'text', text: ' 인 page 를 만나면 → 그 page 를 victim 으로 내보낸다.\n4. 평소 page 가 접근(hit)되면 그 page 의 use bit 를 ' },
        { kind: 'blank', answers: ['1'], width: 4 },
        { kind: 'text', text: ' 로 세팅한다.' },
      ],
      explanation: '"한 바퀴 도는 동안 한 번도 안 쓰인 page" 가 victim — 1 bit 로 LRU 의 정신을 흉내 낸다.',
    },
    {
      id: 'ch16-cb-3',
      type: 'code-blank',
      prompt: 'evict 시 dirty bit 분기 — 빈칸을 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: 'victim page 를 내보낼 때:\n\nif (dirty bit == 0)   // 메모리에서 수정된 적 없음\n    → swap 의 사본과 동일하므로 disk write 를 ' },
        { kind: 'blank', answers: ['생략', '생략한다', '건너뛴다', 'skip'], width: 8 },
        { kind: 'text', text: ' 한다\nif (dirty bit == 1)   // 수정됨\n    → page 내용을 disk 에 ' },
        { kind: 'blank', answers: ['다시 쓴다', '쓴다', 'write', '기록한다'], width: 10 },
        { kind: 'text', text: ' 후 evict' },
      ],
      explanation: 'disk write 는 비싸므로 clean page 의 write 생략은 효과가 크다. 읽기 전용 code page 가 대표적.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch16-essay-1',
      type: 'essay',
      prompt:
        'thrashing 이 무엇인지 정의하고, "동시 프로세스 수 vs CPU 사용률" 그래프의 모양과 함께 왜 임계점을 넘으면 CPU 사용률이 급락하는지 설명하라.',
      modelAnswer: [
        '정의: 동시에 도는 프로세스가 너무 많아져(over-subscription) 물리 메모리가 모든 working set 을 담지 못하게 되면, 모든 프로세스가 page fault 처리(disk I/O)에 묶여 실제 연산은 거의 진행되지 못하는 상태.',
        '',
        '그래프: 가로축 = multiprogramming 정도(동시 프로세스 수), 세로축 = CPU 사용률. 어느 임계점까지는 프로세스가 늘수록 CPU 사용률이 올라간다 (한 프로세스가 I/O 대기 중일 때 다른 프로세스가 CPU 를 쓰므로). 그러나 임계점을 넘는 순간 급격히 무너진다.',
        '',
        '급락 이유: 메모리가 부족해지면 A 가 메모리를 쓰려다 replacement(disk I/O)로 blocked → context switch 된 B 도 메모리 부족으로 disk I/O 요청 → C 도 마찬가지. 결국 모두가 disk 를 기다리고, evict 한 page 를 곧 다시 가져오는 악순환이 반복된다. CPU 는 할 일이 없어 사용률이 급락하고, 시스템 전체 시간이 page fault 처리에 빨려 들어간다.',
      ].join('\n'),
      rubric: [
        'over-subscription(프로세스 과다) 이라는 원인 명시',
        '임계점까지는 상승, 이후 급락하는 그래프 모양 설명',
        '모두가 disk I/O 대기 → CPU idle 이라는 메커니즘 설명',
      ],
    },
    {
      id: 'ch16-essay-2',
      type: 'essay',
      prompt:
        '"정확한 LRU 대신 Clock 을 쓰는 이유" 를 두 기법의 관리 비용을 비교하여 설명하고, Clock 이 LRU 와 정확히 같지 않은 이유도 서술하라.',
      modelAnswer: [
        '[LRU 의 비용] 정확한 LRU 는 "가장 최근에 쓰인 순서" 를 항상 유지해야 한다. 예컨대 doubly-linked list 로 관리하면 매 메모리 접근(hit)마다 해당 노드를 찾아 리스트 맨 앞으로 옮겨야 한다. 이 갱신이 모든 접근에 끼어들므로 시간 오버헤드가 크고, 리스트 구조 유지를 위한 메모리도 든다.',
        '',
        '[Clock 의 비용] page 당 use bit 1 개만 추가한다. 접근 시에는 use bit 를 1 로 세트만 해 두고(매우 쌈), victim 판단은 replacement 가 필요할 때 바늘이 돌면서 몰아서 한다. 리스트 재정렬이 없어 관리 비용과 메모리 모두 훨씬 가볍다.',
        '',
        '[같지 않은 이유] use bit 는 "최근에 썼나/안 썼나" 1 bit 정보일 뿐, A 를 B 보다 먼저 썼는지의 순서는 모른다. 한 바퀴 안에서 둘 다 use=0 이면 바늘이 도는 물리적 순서로 victim 이 정해진다. 그래서 Clock 의 hit rate 는 LRU 에 가깝지만 조금 낮다 — 성능을 약간 양보하고 구현 단순성을 얻은 트레이드오프(근사 LRU)다.',
      ].join('\n'),
      rubric: [
        'LRU 의 매 접근마다 순서 갱신 비용 설명',
        'Clock 의 use bit 1 개 + 게으른(lazy) 판단 구조 설명',
        '순서 정보 손실로 인한 근사라는 점 명시',
      ],
    },
  ],
};

export default quiz;
