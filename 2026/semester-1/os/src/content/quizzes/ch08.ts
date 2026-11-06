import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '08-address-space',
  chapterNumber: 8,
  title: 'Address Space',
  description: '메모리 가상화의 첫 추상화 — 가상 주소 공간의 개념과 영역 구성.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch08-mc-1',
      type: 'multiple-choice',
      prompt:
        '가상 주소 공간(Virtual Address Space) 의 장점으로 가장 적절한 것은?',
      options: [
        { text: '프로그램이 직접 물리 메모리를 조작할 수 있어 빠르다.' },
        { text: '프로세스 간 격리 및 프로그래머의 단순화된 추상.' },
        { text: '페이지 테이블을 없애 오버헤드가 사라진다.' },
        { text: '스왑이 필요 없어진다.' },
      ],
      answerIndex: 1,
      explanation:
        '가상 주소 공간의 본질은 "격리 + 단순화" 다. 페이지 테이블과 swap 은 오히려 이 추상화를 구현하는 도구.',
    },
    {
      id: 'ch08-mc-2',
      type: 'multiple-choice',
      prompt: '다음 중 heap 과 stack 에 대한 설명으로 옳지 않은 것은?',
      options: [
        { text: 'heap 은 낮은 주소에서 높은 주소로 자란다.' },
        { text: 'stack 은 높은 주소에서 낮은 주소로 자란다.' },
        { text: 'heap 은 프로세스가 살아 있는 동안 OS 에 의해 자동 축소된다.' },
        { text: 'stack 은 함수가 반환되면 자동으로 축소된다.' },
      ],
      answerIndex: 2,
      explanation:
        'heap 은 free() / brk 등을 거쳐야 축소된다. 자동으로 축소되지 않는다.',
    },
    {
      id: 'ch08-mc-3',
      type: 'multiple-choice',
      prompt:
        '32 bit 시스템에서 한 프로세스가 가질 수 있는 가상 주소 공간의 총 크기는?',
      options: [
        { text: '1 GB' },
        { text: '2 GB' },
        { text: '4 GB' },
        { text: '16 GB' },
      ],
      answerIndex: 2,
      explanation:
        '2^32 바이트 = 4 GB. 리눅스에서는 보통 user 2GB + kernel 2GB 로 쪼개 쓴다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch08-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        '한 프로그램의 각 영역 주소를 출력한다. 어떤 변수가 어느 영역인지 채우시오.',
      segments: [
        { kind: 'text', text: 'int global_var;           // ' },
        { kind: 'blank', answers: ['bss', 'BSS', 'data'], width: 6 },
        { kind: 'text', text: '\nint init_var = 7;         // ' },
        { kind: 'blank', answers: ['data', 'DATA'], width: 6 },
        { kind: 'text', text: '\n\nint main(void) {\n    int local = 42;       // ' },
        { kind: 'blank', answers: ['stack', 'STACK'], width: 8 },
        { kind: 'text', text: '\n    int *p = malloc(16); // ' },
        { kind: 'blank', answers: ['heap', 'HEAP'], width: 6 },
        { kind: 'text', text: '\n    printf("%p %p %p %p\\n", &global_var, &init_var, &local, p);\n    free(p);\n}\n' },
      ],
      explanation:
        'bss : 초기화 안 된 전역/정적, data : 초기화된 전역/정적, stack : 지역 변수, heap : malloc 블록.',
    },
    {
      id: 'ch08-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        '현재 프로세스의 heap 크기를 확장하는 시스템콜 이름을 채우시오 (리눅스).',
      segments: [
        { kind: 'text', text: '// malloc 내부에서, free list 가 부족하면 OS 에 heap 확장 요청\nvoid *old_top = ' },
        { kind: 'blank', answers: ['sbrk(0)', 'sbrk', 'brk'], width: 10 },
        { kind: 'text', text: ';\n' },
        { kind: 'blank', answers: ['sbrk(size)', 'sbrk(n)', 'sbrk'], width: 14 },
        { kind: 'text', text: ';          // heap 의 top 을 size 만큼 밀어 올림\n' },
      ],
      explanation:
        'sbrk / brk 시스템콜이 heap 경계(break) 를 조정한다.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch08-tf-1',
      type: 'true-false',
      prompt:
        '멀티프로그래밍에서 두 프로세스가 서로의 메모리를 침범할 수 있었던 원인은, 각 프로세스가 물리 주소를 직접 사용했기 때문이다.',
      answer: true,
    },
    {
      id: 'ch08-tf-2',
      type: 'true-false',
      prompt:
        '가상 주소 0 은 반드시 물리 주소 0 에 대응되어야 한다.',
      answer: false,
      explanation: '하드웨어 재배치(base + virtual 등)로 어디에도 놓일 수 있다.',
    },
    {
      id: 'ch08-tf-3',
      type: 'true-false',
      prompt:
        '텍스트 세그먼트(code) 가 read-only 로 보호되면, 한 프로그램의 같은 바이너리가 여러 프로세스에서 동시에 실행될 때 코드 페이지를 물리적으로 공유할 수 있다.',
      answer: true,
    },
    {
      id: 'ch08-tf-4',
      type: 'true-false',
      prompt:
        'address space 추상화는 "프로그래머는 물리 메모리의 실제 위치를 신경 쓰지 않아도 된다" 는 단순화를 제공한다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch08-short-1',
      type: 'short-answer',
      prompt:
        '초기화되지 않은 전역 변수가 놓이는 영역의 이름은? (약어)',
      answers: ['bss', 'BSS'],
      explanation: 'BSS (Block Started by Symbol). 로더가 0 으로 초기화한다.',
    },
    {
      id: 'ch08-short-2',
      type: 'short-answer',
      prompt:
        '다음 중 "heap 이 비정상적으로 커져 stack 과 만나게 되면 무슨 fault 가 발생하는가?" (영문)',
      answers: ['segmentation fault', 'segfault', 'seg fault', 'SIGSEGV'],
      explanation: 'segmentation fault — 유효 영역을 벗어난 참조로 트랩된다.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch08-essay-1',
      type: 'essay',
      prompt:
        '단일 프로세스 시절에는 가상화가 필요하지 않았다. 멀티프로그래밍이 도입되면서 어떤 문제가 드러났는지, 그리고 virtual address space 가 이를 어떻게 해결하는지 설명하시오.',
      modelAnswer:
        '단일 프로세스 시대에는 OS 와 프로그램 하나만 메모리에 있었으므로, 프로그램이 물리 주소를 직접 써도 보호가 필요하지 않았다.\n\n멀티프로그래밍으로 여러 프로세스가 같은 물리 메모리에 공존하게 되자, 한 프로세스가 (의도적이든 실수든) 다른 프로세스나 OS 의 메모리 영역을 덮어쓸 위험이 생겼다. 또한 각 프로세스가 몇 번지에 놓일지를 컴파일 타임에 고정하기도 어려워졌다.\n\nVirtual address space 는 이 문제를 두 가지로 해결한다.\n1) 각 프로세스는 자기만의 가상 주소 0 ~ N 을 본다. 다른 프로세스의 가상 주소는 물리적으로 다른 프레임에 매핑되어 서로 접근할 수 없다(격리).\n2) 프로그램이 실제 물리 주소를 몰라도 된다. OS + 하드웨어가 뒤에서 가상→물리 매핑을 관리하므로, 같은 프로그램을 여러 프로세스가 동시에 돌려도 OS 가 서로 다른 프레임에 올려주면 된다(단순화).',
      rubric: [
        '단일 프로세스 → 멀티 전환에서 생긴 문제',
        '격리 관점의 해결',
        '프로그래머 단순화 관점의 해결',
      ],
    },
    {
      id: 'ch08-essay-2',
      type: 'essay',
      prompt:
        'Address Space 안의 각 영역(code, data, heap, stack) 이 어떤 용도로 쓰이는지, 크기가 어떻게 변하는지 설명하시오.',
      modelAnswer:
        '- Code(text) : 컴파일된 기계어 명령이 놓이는 읽기 전용 영역. 실행 중에는 크기가 변하지 않는다.\n- Data / BSS : 전역 · 정적 변수. 초기화 된 것은 data, 초기화 안 된 것은 bss 에 놓인다. 크기는 프로그램 로드 시점에 결정되며 실행 중에는 변하지 않는다.\n- Heap : 런타임에 malloc/free 로 동적 할당되는 영역. 낮은 주소에서 높은 주소 방향으로 자라며, sbrk/brk 로 OS 에 확장 요청할 수 있다. 해제해야만 줄어든다.\n- Stack : 함수 호출 프레임이 쌓이는 영역. LIFO. 높은 주소에서 낮은 주소로 자라며, 함수 종료와 함께 자동으로 해제된다. argc/argv/환경변수는 초기에 스택 최상단에 세팅된다.\n\nheap 과 stack 이 서로 마주보고 자라며, 그 사이의 빈 공간(hole) 이 프로세스가 확장에 쓸 수 있는 여분이다.',
      rubric: [
        '네 영역의 용도',
        '자라는 방향과 크기 변동 조건',
        'heap ↔ stack 관계(마주보며 자람)',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────
    {
      id: 'ch08-mc-4',
      type: 'multiple-choice',
      prompt:
        '다음 중 "주소 공간 가상화의 3 가지 목표" 로 일반적으로 꼽히는 것이 아닌 것은?',
      options: [
        { text: 'Transparency (프로그램이 가상화를 의식하지 않게)' },
        { text: 'Efficiency (시간·공간 오버헤드를 크게 늘리지 않게)' },
        { text: 'Protection (프로세스 간/커널 메모리 격리)' },
        { text: 'Persistence (프로세스 종료 후에도 메모리 내용을 보존)' },
      ],
      answerIndex: 3,
      explanation:
        'Transparency / Efficiency / Protection 이 기본 목표. Persistence 는 파일시스템의 목표.',
    },
    {
      id: 'ch08-mc-5',
      type: 'multiple-choice',
      prompt:
        '다음 변수 중 일반적으로 "stack" 이 아닌 다른 영역에 놓이는 것은?',
      options: [
        { text: '함수 내부에서 선언한 `int x;`' },
        { text: '함수 인자 `int argc`' },
        { text: '함수 내부의 `static int cached = 0;`' },
        { text: '함수 내부의 반환 주소' },
      ],
      answerIndex: 2,
      explanation:
        '`static` 지역변수는 한 번 생성되어 프로세스 수명 동안 유지되므로 bss 또는 data 에 놓인다.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch08-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        'C 표준 기준 주소 크기를 바이트로 출력. 32-bit 시스템과 64-bit 시스템 각각 결과값.',
      segments: [
        { kind: 'text', text: '#include <stdio.h>\nint main(void) {\n    printf("ptr bytes = %zu\\n", sizeof(void *));\n    // 32-bit x86 에서는 ' },
        { kind: 'blank', answers: ['4'], width: 4 },
        { kind: 'text', text: '\n    // 64-bit x86_64 에서는 ' },
        { kind: 'blank', answers: ['8'], width: 4 },
        { kind: 'text', text: '\n}\n' },
      ],
      explanation:
        '32-bit 주소 공간: 포인터 4B. 64-bit 주소 공간: 포인터 8B. 주소 공간 크기는 2^32 vs 2^64.',
    },

    // ── 추가 : True / False ───────────────────
    {
      id: 'ch08-tf-5',
      type: 'true-false',
      prompt:
        '같은 바이너리에서 포크된 두 프로세스가 각각 `printf("%p", &global)` 를 찍으면, 현대 OS 에서 대개 같은 "가상" 주소가 찍히지만 그 뒤의 물리 주소는 다를 수 있다.',
      answer: true,
      explanation:
        '가상 주소 공간은 프로세스마다 독립. 같은 프로그램이면 컴파일된 virtual 주소가 같게 나오기 쉽다. 물리 매핑은 OS 마음대로.',
    },
    {
      id: 'ch08-tf-6',
      type: 'true-false',
      prompt:
        'heap 은 동적으로 자라지만, 스택과 달리 free() 를 명시적으로 호출해도 OS 가 즉시 메모리를 회수해 주는 것은 아니다.',
      answer: true,
      explanation:
        'free 는 allocator 의 free list 로만 돌려주고, OS 반환(brk 축소)은 별개 판단.',
    },
    {
      id: 'ch08-tf-7',
      type: 'true-false',
      prompt:
        '한 프로세스가 자기 코드 세그먼트에 쓰기를 시도해 segmentation fault 가 나는 이유는, 코드 세그먼트의 페이지 속성이 read-execute 로 설정되어 있기 때문이다.',
      answer: true,
    },
    {
      id: 'ch08-tf-8',
      type: 'true-false',
      prompt:
        '64-bit 시스템에서 실제로 사용 가능한 가상 주소 공간은 2^64 바이트 전부다.',
      answer: false,
      explanation:
        '현대 x86_64 는 canonical 주소(보통 48 bit) 만 사용. 상위는 예약.',
    },

    // ── 추가 : 단답 ───────────────────────────
    {
      id: 'ch08-short-3',
      type: 'short-answer',
      prompt:
        '주소 공간 안에서 stack 과 heap 사이의 큰 미사용 공간을 가리키는 용어는? (영문)',
      answers: ['hole', 'Hole', 'free hole', 'gap'],
      explanation: '"Hole"(또는 free 영역). heap ↔ stack 이 서로 마주보며 자라게 해 주는 여유 공간.',
    },
    {
      id: 'ch08-short-4',
      type: 'short-answer',
      prompt:
        '16 KB 페이지, 4 GB 가상 주소 공간에서 선형 페이지 테이블의 엔트리 수는? (숫자만)',
      answers: ['262144', '262,144', '2^18'],
      hint: '4GB / 16KB',
      explanation: '4 GB / 16 KB = 2^32 / 2^14 = 2^18 = 262,144.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch08-essay-3',
      type: 'essay',
      prompt:
        '"주소 공간" 이라는 추상화가 커널 개발자에게 주는 이점과, 사용자 프로그래머에게 주는 이점을 나누어 설명하시오.',
      modelAnswer:
        '커널 개발자 관점:\n- 각 프로세스의 메모리 위치를 자유롭게 재배치할 수 있다. 물리 메모리 조각 어디든 쓸 수 있으므로 할당/회수 정책이 단순해진다.\n- 권한 비트(RW, US 등) 를 페이지 단위로 부여해 보호 정책을 세밀하게 적용할 수 있다.\n- swap, lazy allocation, copy-on-write 등 고급 메커니즘을 매핑 계층에서 투명하게 구현할 수 있다.\n\n사용자 프로그래머 관점:\n- 자기 프로그램의 "주소 0" 부터 시작하는 평평한 가상 공간을 가정하고 작성할 수 있어, 물리적 배치나 다른 프로세스의 존재를 신경 쓰지 않아도 된다.\n- 포인터, 배열, malloc 같은 기본 메모리 API 가 다른 프로세스의 간섭 없이 안정적으로 동작한다.\n- 디버거가 보여 주는 주소가 프로세스별로 일관되므로 디버깅이 쉬워진다.\n\n결국 가상 주소 공간은 "OS 가 복잡한 물리 메모리 관리를 흡수하고, 사용자에게는 깔끔한 개념 모델을 제공" 하는 추상화다.',
      rubric: [
        '커널 관점의 자유도/보호/고급 기능',
        '사용자 관점의 평평하고 독립적인 모델',
        '추상화의 일반 원리 요약',
      ],
    },
  ],
};

export default quiz;
