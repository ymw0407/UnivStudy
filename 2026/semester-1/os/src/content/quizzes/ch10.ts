import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '10-segmentation',
  chapterNumber: 10,
  title: 'Segmentation',
  description: '세그먼트 단위 base/bound, direction · protection bit, 그리고 external fragmentation.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch10-mc-1',
      type: 'multiple-choice',
      prompt:
        'Segmentation 에서 가상 주소 4200 (heap 세그먼트, heap 시작 가상 주소 4096, heap base 34KB) 의 물리 주소는?',
      options: [
        { text: '34,304' },
        { text: '34,920' },
        { text: '38,296' },
        { text: '38,192' },
      ],
      answerIndex: 1,
      explanation:
        'offset = 4200 − 4096 = 104. PA = 34 × 1024 + 104 = 34,816 + 104 = 34,920.',
    },
    {
      id: 'ch10-mc-2',
      type: 'multiple-choice',
      prompt: '세그먼트의 "direction bit" 가 필요한 가장 큰 이유는?',
      options: [
        { text: 'code 세그먼트를 공유하기 위해' },
        { text: 'stack 처럼 반대 방향으로 자라는 세그먼트를 처리하기 위해' },
        { text: 'heap 의 크기를 동적으로 조절하기 위해' },
        { text: '캐시 라인을 맞추기 위해' },
      ],
      answerIndex: 1,
      explanation: 'stack 은 역방향으로 자라므로 offset 계산 방법이 달라야 한다.',
    },
    {
      id: 'ch10-mc-3',
      type: 'multiple-choice',
      prompt:
        '세그먼트 번호를 "가상 주소의 상위 비트" 에 넣어 식별하는 방식의 단점은?',
      options: [
        { text: '하드웨어 비용이 크다.' },
        { text: '상위 비트를 세그먼트 번호로 떼어 쓰는 만큼 주소 표현력이 줄어든다.' },
        { text: '보호가 약해진다.' },
        { text: 'code 공유가 불가능해진다.' },
      ],
      answerIndex: 1,
      explanation:
        'Explicit 방식은 주소 비트 일부를 세그먼트 인덱스로 소모한다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch10-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        '상위 2 비트를 세그먼트 번호로, 나머지를 offset 으로 분리하는 코드. 14-bit 가상 주소 기준.',
      segments: [
        { kind: 'text', text: '// va 는 14-bit: [세그 2][offset 12]\nuint16_t seg = (va >> ' },
        { kind: 'blank', answers: ['12'], width: 4 },
        { kind: 'text', text: ') & 0x3;\nuint16_t off = va & ' },
        { kind: 'blank', answers: ['0xFFF', '0xfff', '4095'], width: 8 },
        { kind: 'text', text: ';\n\nif (off >= seg_table[seg].size) raise_segfault();\nuint32_t pa = seg_table[seg].base + off;\n' },
      ],
      explanation:
        '12 비트 offset 의 마스크는 0xFFF. 상위 2 비트(>>12 & 0x3) 가 세그먼트 번호.',
    },
    {
      id: 'ch10-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        'stack 처럼 grows-negative 세그먼트의 offset 계산. MAX_SEG 는 해당 세그먼트의 최대 크기.',
      segments: [
        { kind: 'text', text: 'int32_t offset;\nif (seg_table[seg].grows_positive) {\n    offset = va_offset;\n} else {\n    offset = va_offset - ' },
        { kind: 'blank', answers: ['MAX_SEG', 'MAX', 'MAX_SIZE'], width: 10 },
        { kind: 'text', text: ';           // 음수\n}\n// 경계 검사 후\nuint32_t pa = seg_table[seg].base + ' },
        { kind: 'blank', answers: ['offset', 'off'], width: 8 },
        { kind: 'text', text: ';\n' },
      ],
      explanation:
        'grows-negative 에서는 va_offset − MAX 가 음수의 offset 이 되어 base 에서 차감되는 효과.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch10-tf-1',
      type: 'true-false',
      prompt:
        '세그먼트 단위 protection bit(예: code 는 read-execute) 를 두면, 코드 영역을 실수로 덮어쓰는 것을 하드웨어가 차단할 수 있다.',
      answer: true,
    },
    {
      id: 'ch10-tf-2',
      type: 'true-false',
      prompt:
        '세그먼테이션에서도 내부 단편화(internal fragmentation) 가 주요 문제이다.',
      answer: false,
      explanation:
        '세그먼트는 가변 크기이므로 외부 단편화(external fragmentation) 가 문제.',
    },
    {
      id: 'ch10-tf-3',
      type: 'true-false',
      prompt:
        'Compaction 은 external fragmentation 을 줄이는 방법이지만, 실행 중 세그먼트 이동 + 메모리 복사 + base 재설정으로 비용이 크다.',
      answer: true,
    },
    {
      id: 'ch10-tf-4',
      type: 'true-false',
      prompt:
        '같은 프로그램의 여러 인스턴스가 실행될 때 code 세그먼트를 공유해 물리 메모리를 절약하는 기법의 전제는 "code 세그먼트가 read-only 로 보호되어 있다" 는 점이다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch10-short-1',
      type: 'short-answer',
      prompt:
        '가변 크기 세그먼트를 물리 메모리에 여기저기 배치하다 보면 "총량은 충분한데 연속 공간이 없어" 새 세그먼트를 못 넣는 문제가 생긴다. 이 문제 이름은? (영문)',
      answers: ['external fragmentation', '외부 단편화', 'External Fragmentation'],
      explanation: 'External Fragmentation — 세그먼트 같은 가변 크기 할당의 근본 난제.',
    },
    {
      id: 'ch10-short-2',
      type: 'short-answer',
      prompt:
        '세그먼트 번호를 "주소의 상위 비트" 가 아니라 "어느 레지스터로 접근했느냐(PC=code, SP=stack 등)" 로 추정하는 방식의 이름은? (영문)',
      answers: ['implicit', 'Implicit', 'implicit segmentation'],
      explanation: 'Implicit 방식. Explicit 과 달리 주소 표현력을 희생하지 않는다.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch10-essay-1',
      type: 'essay',
      prompt:
        'Segmentation 이 Base & Bound 에 비해 가진 장점과, 새롭게 발생시킨 문제를 설명하시오.',
      modelAnswer:
        '장점:\n- Sparse Address Space 지원: code, heap, stack 을 각각 독립적으로 배치하므로, 실제 사용하는 세그먼트 크기만큼만 물리 메모리를 소모한다. Base & Bound 의 "hole 까지 차지하는" 낭비를 피한다.\n- 세그먼트별 속성 제어: direction bit 로 반대 방향 성장을 지원하고, protection bit 로 read-only / read-write 등을 다르게 설정해 보호와 공유를 가능하게 한다.\n- Code Sharing: read-only 로 보호된 code 세그먼트를 물리적으로 하나 두고 여러 프로세스가 공유해 메모리 절약.\n\n새 문제:\n- External Fragmentation: 가변 크기 세그먼트를 여기저기 놓다 보면 작은 빈틈들이 많이 생기고, 총량은 충분한데 "큰 연속 공간" 이 없어 새 세그먼트를 받지 못하게 된다.\n- Compaction 으로 일부 해소 가능하지만 비싸다.\n- 이 문제가 "가변 크기 할당의 근본 한계" 임을 드러내, 다음 단계인 고정 크기 Paging 으로의 전환을 유도한다.',
      rubric: [
        'Sparse address space · direction · protection · sharing 중 2 개 이상 언급',
        'External fragmentation 문제 제시',
        'Compaction 의 한계 또는 paging 연결',
      ],
    },
    {
      id: 'ch10-essay-2',
      type: 'essay',
      prompt:
        '세그먼트 식별의 Explicit 방식과 Implicit 방식을 설명하고 각자의 장단점을 비교하시오.',
      modelAnswer:
        'Explicit 방식은 가상 주소의 상위 비트 일부를 세그먼트 번호로 할당한다. 예를 들어 14-bit 주소에서 상위 2 비트를 세그먼트 번호, 나머지 12 비트를 offset 으로 사용한다. 장점은 CPU 하드웨어가 어느 세그먼트인지 직접적으로 알 수 있다는 것, 단점은 상위 비트를 소모하므로 동일한 address space 크기에서 주소 표현력이 줄어든다는 것이다.\n\nImplicit 방식은 주소 자체에는 세그먼트 번호가 없고, 그 주소를 어느 레지스터로 접근했는지에 따라 세그먼트를 추정한다. PC 로 가져오면 code, SP 로 접근하면 stack 세그먼트 등으로 분류한다. 장점은 주소 공간 전체를 offset 으로 쓸 수 있어 표현력 손해가 없다는 것, 단점은 분류 규칙이 암묵적이라 일반 포인터로 접근하는 데이터는 규칙에 맞게 처리하기 까다롭다는 점이다.',
      rubric: [
        '두 방식의 메커니즘 차이',
        '표현력 / 규칙 명확성 등 trade-off',
        '실제 CPU 가 두 방식을 모두 썼다는 사실(선택)',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────
    {
      id: 'ch10-mc-4',
      type: 'multiple-choice',
      prompt:
        'Internal fragmentation 과 external fragmentation 에 대한 설명 중 옳은 것은?',
      options: [
        { text: 'Segmentation 은 internal, Paging 은 external fragmentation 이 주된 문제이다.' },
        { text: 'Segmentation 은 external, Paging 은 internal fragmentation 이 주된 문제이다.' },
        { text: '두 단편화는 같은 의미로 쓰인다.' },
        { text: '두 단편화는 모두 compaction 으로 동일하게 해결된다.' },
      ],
      answerIndex: 1,
      explanation:
        '가변 크기(segment) → 외부, 고정 크기(page) → 내부 단편화.',
    },
    {
      id: 'ch10-mc-5',
      type: 'multiple-choice',
      prompt:
        '"세그먼트 공유(code sharing)" 가 가능한 기본 전제는?',
      options: [
        { text: '각 세그먼트가 같은 크기여야 한다.' },
        { text: '공유할 세그먼트가 read-only 여야 한다.' },
        { text: '공유할 세그먼트가 stack 이어야 한다.' },
        { text: '공유할 세그먼트가 heap 이어야 한다.' },
      ],
      answerIndex: 1,
      explanation:
        '쓰기가 가능한 세그먼트는 서로 다른 프로세스가 값을 덮어쓰게 되어 공유 불가.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────
    {
      id: 'ch10-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '세그먼트 테이블 엔트리 정의. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'typedef struct seg_entry {\n    uintptr_t base;\n    size_t    size;\n    uint8_t   ' },
        { kind: 'blank', answers: ['grows_positive', 'grow_pos', 'direction'], width: 16 },
        { kind: 'text', text: '; // 1=양의 방향, 0=음의 방향\n    uint8_t   ' },
        { kind: 'blank', answers: ['protection', 'prot'], width: 10 },
        { kind: 'text', text: ';   // R/W/X 비트\n} seg_entry_t;\n' },
      ],
      explanation:
        'direction(grows_positive) 과 protection 비트가 현대적 세그먼트의 핵심 속성.',
    },

    // ── 추가 : True / False ─────────────────
    {
      id: 'ch10-tf-5',
      type: 'true-false',
      prompt:
        'Explicit 방식에서 14-bit 주소의 상위 2 비트를 세그먼트 번호로 쓰면 총 4 개 세그먼트를 표현할 수 있다.',
      answer: true,
    },
    {
      id: 'ch10-tf-6',
      type: 'true-false',
      prompt:
        '세그먼트마다 독립된 base/bound 가 있기 때문에, 한 세그먼트의 성장이 다른 세그먼트의 물리 배치에 직접 영향을 준다.',
      answer: false,
      explanation:
        '각각 물리 메모리의 다른 곳에 놓여 있으므로 서로 독립적으로 성장 가능(공간이 충분하면).',
    },
    {
      id: 'ch10-tf-7',
      type: 'true-false',
      prompt:
        '현대 x86_64 리눅스에서는 세그먼트 방식이 주된 메모리 관리 기법이다.',
      answer: false,
      explanation:
        'x86_64 에서 세그먼트 레지스터는 거의 flat 으로 설정되어 사실상 paging 으로 모든 관리를 한다.',
    },
    {
      id: 'ch10-tf-8',
      type: 'true-false',
      prompt:
        'Compaction 을 수행하려면, 프로세스가 참조 중인 포인터 값들도 모두 갱신해야 한다.',
      answer: false,
      explanation:
        '세그먼트는 base 재설정만으로 가상 주소는 그대로 유지된다. 내부 포인터는 가상 주소이므로 이동해도 바뀌지 않는다(단 물리 메모리는 이동).',
    },

    // ── 추가 : 단답 ───────────────────────────
    {
      id: 'ch10-short-3',
      type: 'short-answer',
      prompt:
        '세그먼트 공유로 물리 메모리를 절약하는 전형적인 예를 한 문장으로 설명하시오.',
      answers: [
        '여러 프로세스가 같은 라이브러리(또는 프로그램) 의 code 세그먼트를 물리적으로 공유하는 경우',
        '같은 프로그램의 code 세그먼트를 여러 프로세스가 공유',
        'libc 같은 공유 라이브러리의 code 를 공유',
        '같은 프로그램 실행 인스턴스의 code 공유',
      ],
      hint: 'read-only code + 여러 인스턴스',
      explanation: '같은 바이너리를 여러 번 실행했을 때 code 페이지/세그먼트를 공유.',
    },
    {
      id: 'ch10-short-4',
      type: 'short-answer',
      prompt:
        '14-bit 가상 주소에서 상위 2 비트가 세그먼트 번호, 나머지가 offset 인 경우, 가상 주소 0b00_0001_0101_1010 이 가리키는 세그먼트 번호는? (숫자만)',
      answers: ['0'],
      hint: '상위 두 비트 값',
      explanation: '상위 2 비트 = 00 → 세그먼트 0.',
    },

    // ── 추가 : 서술형 ─────────────────────────
    {
      id: 'ch10-essay-3',
      type: 'essay',
      prompt:
        'Compaction 이 external fragmentation 을 해결하는 방식과, 이 방법이 실전에서 자주 쓰이지 않는 이유를 설명하시오.',
      modelAnswer:
        'Compaction 은 실행 중인 프로세스들의 세그먼트를 물리 메모리 상에서 이동시켜, 흩어져 있던 작은 free 조각들을 하나의 큰 연속 공간으로 합치는 기법이다. 각 세그먼트의 base 값을 재설정하면 프로세스의 가상 주소는 그대로 둔 채 물리 위치만 바뀌므로, 사용자 프로그램에게는 투명하다.\n\n실전에서 자주 쓰이지 않는 이유:\n- 이동해야 할 데이터가 크다 — 수 MB/GB 의 메모리 복사 오버헤드.\n- 이동 중에는 해당 프로세스를 중단해야 하고(또는 정교한 동기화가 필요), 사용자 체감 지연이 커진다.\n- 자주 compaction 을 돌리면 시스템 throughput 이 크게 떨어진다.\n- 근본적으로 가변 크기 할당의 fragmentation 은 완전히 없앨 수 없어 주기적 compaction 이 계속 필요하다.\n\n그래서 실전에서는 "고정 크기 단위로 잘게 쪼개서 external fragmentation 자체를 없애는" paging 으로 전환하는 것이 일반적이다.',
      rubric: [
        'Compaction 의 메커니즘(세그먼트 이동 + base 재설정)',
        '비용의 구체적 원인',
        'Paging 으로의 전환 이유',
      ],
    },
  ],
};

export default quiz;
