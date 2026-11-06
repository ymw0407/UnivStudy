import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '09-base-and-bound',
  chapterNumber: 9,
  title: 'Base & Bound',
  description: '하드웨어 레지스터 두 개로 구현하는 가장 단순한 가상화.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch09-mc-1',
      type: 'multiple-choice',
      prompt:
        'Base & Bound 방식에서 가상 주소 VA 에 대한 물리 주소 계산과 bound 검사 조합으로 올바른 것은?',
      options: [
        { text: 'PA = VA + base, 단 VA > bound' },
        { text: 'PA = VA + base, 단 VA < bound' },
        { text: 'PA = VA - base, 단 VA < bound' },
        { text: 'PA = VA × base, 단 VA < bound' },
      ],
      answerIndex: 1,
      explanation: 'PA = VA + base 이고 VA 는 bound 미만이어야 유효하다.',
    },
    {
      id: 'ch09-mc-2',
      type: 'multiple-choice',
      prompt:
        'Base & Bound 레지스터가 privileged instruction 으로만 설정 가능한 이유는?',
      options: [
        { text: '하드웨어 설계의 편의를 위해' },
        { text: '사용자 프로그램이 이를 바꿀 수 있다면 자신의 bound 를 무한대로 만들어 다른 메모리를 덮어쓸 수 있기 때문' },
        { text: '저전력 모드를 지원하기 위해' },
        { text: '캐시 동작과 충돌하지 않게 하기 위해' },
      ],
      answerIndex: 1,
      explanation:
        '특권 명령 제한이 없으면 보호가 무너진다.',
    },
    {
      id: 'ch09-mc-3',
      type: 'multiple-choice',
      prompt:
        'Base & Bound 의 가장 큰 단점은?',
      options: [
        { text: '하드웨어가 너무 복잡하다.' },
        { text: '주소 공간 전체가 하나의 연속 블록이라, stack ↔ heap 사이의 빈 공간도 물리 메모리를 낭비한다.' },
        { text: '보호가 약하다.' },
        { text: '번역 속도가 느리다.' },
      ],
      answerIndex: 1,
      explanation:
        '단일 연속 배치 → 내부의 hole 까지 물리 메모리를 잡아먹는 공간 낭비.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch09-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        'MMU 하드웨어 동작을 의사코드로 나타냈다. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'uint32_t translate(uint32_t va) {\n    if (va >= ' },
        { kind: 'blank', answers: ['bound', 'BOUND'], width: 8 },
        { kind: 'text', text: ') {\n        raise_exception(OUT_OF_BOUNDS);\n    }\n    return va + ' },
        { kind: 'blank', answers: ['base', 'BASE'], width: 8 },
        { kind: 'text', text: ';\n}\n' },
      ],
      explanation:
        '검사 후 덧셈 — 회로 한 번에 처리되는 단순 변환.',
    },
    {
      id: 'ch09-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        'Context switch 시 OS 가 하는 일이다. PCB 에 무엇을 저장하고 복원해야 하는가?',
      segments: [
        { kind: 'text', text: 'void save_ctx(pcb_t *p) {\n    p->base  = read_reg(REG_BASE);\n    p->bound = read_reg(REG_' },
        { kind: 'blank', answers: ['BOUND', 'bound'], width: 8 },
        { kind: 'text', text: ');\n    // ... 일반 레지스터 저장 ...\n}\n\nvoid restore_ctx(pcb_t *p) {\n    write_reg(REG_BASE,  p->' },
        { kind: 'blank', answers: ['base'], width: 6 },
        { kind: 'text', text: ');\n    write_reg(REG_BOUND, p->bound);\n    // ... 일반 레지스터 복원 ...\n}\n' },
      ],
      explanation:
        'Base/Bound 도 CPU 레지스터이므로 context switch 시 PCB 에 저장·복원.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch09-tf-1',
      type: 'true-false',
      prompt:
        'Base & Bound 는 프로세스의 가상 주소 0 이 물리 주소 0 에 매핑되어야만 동작한다.',
      answer: false,
      explanation: 'base 값만큼 어디든 재배치 가능.',
    },
    {
      id: 'ch09-tf-2',
      type: 'true-false',
      prompt:
        'OS 는 프로세스가 시작되거나 종료될 때, 그리고 context switch 때 개입해 base/bound 관련 상태를 관리한다.',
      answer: true,
    },
    {
      id: 'ch09-tf-3',
      type: 'true-false',
      prompt:
        'Base & Bound 에서 bound 는 "프로세스의 가상 주소 범위의 상한" 으로, 초과 접근은 하드웨어가 즉시 exception 을 발생시킨다.',
      answer: true,
    },
    {
      id: 'ch09-tf-4',
      type: 'true-false',
      prompt:
        'Base & Bound 방식에서는 프로세스의 주소 공간 중 실제로 쓰지 않는 부분(예: heap 과 stack 사이의 hole)도 물리 메모리를 통째로 잡아먹는다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch09-short-1',
      type: 'short-answer',
      prompt:
        'Base = 32 KB, Bound = 4 KB 인 프로세스가 가상 주소 1024 를 접근할 때 번역되는 물리 주소는? (숫자만, 단위 없이)',
      answers: ['33792', '33,792'],
      hint: 'bound 검사 통과 → base + VA',
      explanation: '32768 + 1024 = 33792.',
    },
    {
      id: 'ch09-short-2',
      type: 'short-answer',
      prompt:
        'Base & Bound 관점에서 "Dynamic Relocation" 이라는 용어가 의미하는 것을 한 단어로 답하시오. (영문 또는 한글)',
      answers: ['재배치', 'relocation', 'Relocation'],
      explanation: '실행 중에도 프로세스를 물리 메모리의 어느 주소에 놓아도 되는 성질.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch09-essay-1',
      type: 'essay',
      prompt:
        'Base & Bound 방식이 요구하는 하드웨어 기능과 OS 의 역할을 각각 나열하시오.',
      modelAnswer:
        '하드웨어 기능:\n- 사용자 모드와 커널 모드 구분 및 특권 명령.\n- base / bound 두 레지스터와 이를 읽고 쓰는 특권 명령.\n- 매 메모리 접근마다 VA < bound 검사 및 VA + base 변환을 수행하는 회로.\n- 위반 시 exception 을 발생시키는 능력.\n\nOS 역할:\n- 프로세스 시작 시 : 물리 메모리에서 해당 프로세스의 연속 공간을 확보하고, base 와 bound 를 설정한다.\n- 프로세스 종료 시 : 사용했던 물리 메모리를 회수해 free list 에 돌려준다.\n- Context switch 시 : 현재 프로세스의 base/bound 를 PCB 에 저장하고, 다음 프로세스의 값을 복원한다.\n- Exception 처리 : 경계 위반 발생 시 핸들러에서 프로세스를 종료하거나 시그널을 보낸다.',
      rubric: [
        '하드웨어 기능 4종 이상',
        'OS 의 3 개입 시점(시작 / 종료 / 컨텍스트 스위치)',
        '예외 처리 언급',
      ],
    },
    {
      id: 'ch09-essay-2',
      type: 'essay',
      prompt:
        'Base & Bound 에서 주소 공간 "전체" 를 연속 블록으로 잡는 방식이 왜 낭비를 낳는지, 그리고 이를 극복하기 위해 다음 단계(Segmentation)가 도입된 이유를 설명하시오.',
      modelAnswer:
        '일반적인 프로세스의 주소 공간은 code, (data), heap, (큰 빈 공간), stack 처럼 "띄엄띄엄" 사용된다. Base & Bound 는 이 가상 공간 전체를 하나의 연속 물리 블록으로 할당하므로, 사용하지 않는 빈 공간까지도 물리 메모리를 차지하게 된다. 예를 들어 bound = 16MB 인데 실제 사용은 code 1MB + heap 2MB + stack 2MB 에 불과해도, 중간의 빈 11MB 가 그대로 낭비된다.\n\nSegmentation 은 이 문제를 해결하기 위해 주소 공간을 code / heap / stack 같은 "논리 단위" 로 쪼개고, 각 세그먼트마다 자체 base / bound 를 둬서 물리 메모리의 어디든 독립적으로 놓을 수 있게 한다. 그러면 사용하지 않는 중간 hole 은 물리 메모리를 소비하지 않는다.',
      rubric: [
        '주소 공간이 희소(sparse) 하다는 관찰',
        '연속 할당의 낭비를 정량적으로 설명',
        'Segmentation 의 아이디어 연결',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────
    {
      id: 'ch09-mc-4',
      type: 'multiple-choice',
      prompt:
        'Base 와 Bound 레지스터는 물리적으로 어디에 존재하며, 몇 개가 존재하는가?',
      options: [
        { text: '메인 메모리에 프로세스마다 한 쌍씩' },
        { text: 'CPU 에 CPU 코어당 한 쌍씩 (현재 실행 중인 프로세스의 값으로 세팅)' },
        { text: 'CPU 에 프로세스마다 모두 한 쌍씩 유지' },
        { text: '디스크에 영구적으로 한 쌍' },
      ],
      answerIndex: 1,
      explanation:
        'CPU 안에 한 쌍. 프로세스별 값은 PCB 에 저장되고, context switch 시 CPU 레지스터로 로드된다.',
    },
    {
      id: 'ch09-mc-5',
      type: 'multiple-choice',
      prompt:
        '프로세스 A (base=16K, bound=4K) 가 가상 주소 5K 에 접근하면?',
      options: [
        { text: '물리 주소 21K 로 변환되어 정상 접근된다.' },
        { text: '물리 주소 16K 로 변환된다.' },
        { text: 'bound 검사에 실패하여 exception 이 발생한다.' },
        { text: '자동으로 bound 가 확장된다.' },
      ],
      answerIndex: 2,
      explanation: '5K ≥ 4K(bound) 이므로 초과 접근 → exception (segfault).',
    },

    // ── 추가 : 코드 빈칸 ───────────────────────
    {
      id: 'ch09-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '프로세스 생성 시 OS 가 하는 일. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'pcb_t *create_process(size_t size) {\n    // free_list 에서 size 만큼 물리 연속 공간 확보\n    void *mem = free_list_allocate(' },
        { kind: 'blank', answers: ['size'], width: 6 },
        { kind: 'text', text: ');\n    if (!mem) return NULL;\n    pcb_t *p = alloc_pcb();\n    p->base  = (uintptr_t) mem;\n    p->bound = ' },
        { kind: 'blank', answers: ['size'], width: 6 },
        { kind: 'text', text: ';\n    return p;\n}\n' },
      ],
      explanation: 'free list 에서 연속 공간 할당 → PCB 에 base=시작주소, bound=크기.',
    },

    // ── 추가 : True / False ───────────────────
    {
      id: 'ch09-tf-5',
      type: 'true-false',
      prompt:
        'Base & Bound 방식에서, 프로세스는 자기 자신의 base / bound 값을 user mode 에서 읽을 수 있지만 쓸 수는 없다.',
      answer: false,
      explanation:
        '일반적으로 둘 다 privileged. user 프로세스는 자기 base/bound 를 알 수도, 쓸 수도 없다(읽기는 구현에 따라 허용하는 경우도 있음 — 보수적으로 false).',
    },
    {
      id: 'ch09-tf-6',
      type: 'true-false',
      prompt:
        'Base + Bound 방식에서는 매 메모리 접근마다 하드웨어가 "더하기 + 비교" 두 연산을 수행한다.',
      answer: true,
    },
    {
      id: 'ch09-tf-7',
      type: 'true-false',
      prompt:
        'Base & Bound 에서는 하나의 프로세스 주소 공간에 대해 여러 물리 영역을 나누어 할당할 수 있다.',
      answer: false,
      explanation:
        '연속 단일 블록만 지원. 여러 영역 지원은 Segmentation 이후.',
    },
    {
      id: 'ch09-tf-8',
      type: 'true-false',
      prompt:
        'Base & Bound 방식에서는 코드 세그먼트만 따로 read-only 로 보호하는 것이 자연스럽게 어렵다.',
      answer: true,
      explanation:
        '전체 공간이 하나의 (base, bound) 라 세밀한 보호 비트를 영역별로 걸기 어렵다.',
    },

    // ── 추가 : 단답 ───────────────────────────
    {
      id: 'ch09-short-3',
      type: 'short-answer',
      prompt:
        'Base = 100, Bound = 50 일 때, 가상 주소 49 의 물리 주소는? (숫자만)',
      answers: ['149'],
      explanation: '49 < 50 → 통과. PA = 49 + 100 = 149.',
    },
    {
      id: 'ch09-short-4',
      type: 'short-answer',
      prompt:
        '두 프로세스 A(base=0, bound=8K) 와 B(base=16K, bound=8K) 가 있을 때, 물리 주소 12K 에는 누가 접근할 수 있는가?',
      answers: ['아무도', '아무도 접근 못 함', 'neither', 'none', '둘 다 불가'],
      hint: '두 프로세스 모두 접근 범위 밖',
      explanation:
        'A: va < 8K 만 허용하므로 물리 0..8K 만 가능. B: va + 16K 영역이므로 물리 16K..24K. 12K 는 둘 다 범위 밖.',
    },

    // ── 추가 : 서술형 ─────────────────────────
    {
      id: 'ch09-essay-3',
      type: 'essay',
      prompt:
        'Base & Bound 방식에서 "보호(protection)" 가 깨지지 않기 위해 반드시 지켜져야 하는 하드웨어 / OS 요구사항을 나열하시오.',
      modelAnswer:
        '하드웨어 측:\n- User 모드 / Kernel 모드를 구분하고, user 모드에서 물리 메모리 직접 접근이 불가능해야 한다.\n- Base / Bound 레지스터는 오직 privileged instruction 으로만 읽고 쓸 수 있어야 한다.\n- 매 메모리 접근마다 (VA < bound) 검사와 (VA + base) 변환을 항상 자동으로 수행하고, 위반 시 예외를 발생시켜야 한다.\n\nOS 측:\n- 프로세스 생성 시 free list 에서 실제로 겹치지 않는 물리 영역을 확보해 base/bound 를 설정.\n- Context switch 시 현재 프로세스의 base/bound 를 PCB 에 안전히 저장하고, 다음 프로세스의 값을 복원.\n- 프로세스 종료 시 물리 영역을 회수해 다른 프로세스가 재사용할 수 있도록 한다.\n- Exception 핸들러가 위반 프로세스를 종료(혹은 시그널 전달) 해 다른 프로세스에 영향이 가지 않도록 보장.\n\n이 네 가지가 하나라도 깨지면 보호가 뚫린다 — 예컨대 user 가 base 를 바꿀 수 있으면 임의 물리 주소 접근이 가능.',
      rubric: [
        '하드웨어의 특권 명령과 자동 변환/검사',
        'OS 의 할당·컨텍스트 스위치·회수',
        '예외 처리 의무',
      ],
    },
  ],
};

export default quiz;
