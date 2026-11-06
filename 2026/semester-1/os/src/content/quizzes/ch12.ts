import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '12-paging-intro',
  chapterNumber: 12,
  title: 'Paging: Introduction',
  description: '가상 주소 공간과 물리 메모리를 고정 크기 단위(page / frame)로 관리.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch12-mc-1',
      type: 'multiple-choice',
      prompt: 'Paging 이 Segmentation 에 비해 가지는 핵심 장점은?',
      options: [
        { text: 'TLB 가 필요 없다.' },
        { text: '고정 크기 단위로 관리하므로 external fragmentation 이 사실상 사라진다.' },
        { text: '주소 변환이 필요 없다.' },
        { text: '한 프로세스의 주소 공간이 항상 연속된 물리 메모리를 차지한다.' },
      ],
      answerIndex: 1,
      explanation:
        '고정 크기 page/frame 단위라 "빈 frame 아무거나" 에 꽂을 수 있어 external fragmentation 이 해소된다.',
    },
    {
      id: 'ch12-mc-2',
      type: 'multiple-choice',
      prompt:
        '32-bit 가상 주소 · 4KB 페이지 · 4B PTE 를 가정할 때, 단일 선형 page table 의 크기는?',
      options: [
        { text: '1 MB' },
        { text: '2 MB' },
        { text: '4 MB' },
        { text: '8 MB' },
      ],
      answerIndex: 2,
      explanation: '2^20 엔트리 × 4B = 4 MB (프로세스당).',
    },
    {
      id: 'ch12-mc-3',
      type: 'multiple-choice',
      prompt:
        '다음 중 PTE(Page Table Entry) 에 포함되지 않는 정보는?',
      options: [
        { text: 'PFN (물리 프레임 번호)' },
        { text: 'Valid / Present 비트' },
        { text: 'Read/Write, User/Supervisor 권한 비트' },
        { text: '프로세스 PID' },
      ],
      answerIndex: 3,
      explanation:
        'PTE 에는 주로 매핑·보호·상태 비트가 들어간다. 프로세스 식별은 페이지 테이블 자체의 소유로 구분된다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch12-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        'VPN 과 offset 을 추출하는 계산. 4KB 페이지라면?',
      segments: [
        { kind: 'text', text: '// 페이지 크기 4KB → offset 은 하위 12 비트\nuint32_t vpn    = va >> ' },
        { kind: 'blank', answers: ['12'], width: 4 },
        { kind: 'text', text: ';\nuint32_t offset = va & ' },
        { kind: 'blank', answers: ['0xFFF', '0xfff', '4095'], width: 8 },
        { kind: 'text', text: ';\n\nuint32_t pfn = page_table[vpn].pfn;\nuint32_t pa  = (pfn << ' },
        { kind: 'blank', answers: ['12'], width: 4 },
        { kind: 'text', text: ') | offset;\n' },
      ],
      explanation:
        '4KB = 2^12. VPN = va >> 12, offset = va & 0xFFF, PA = (PFN << 12) | offset.',
    },
    {
      id: 'ch12-code-2',
      type: 'code-blank',
      language: 'c',
      prompt: 'PTE 의 핵심 비트를 구조체로 선언하시오.',
      segments: [
        { kind: 'text', text: 'struct pte {\n    uint32_t pfn    : 20;\n    uint32_t ' },
        { kind: 'blank', answers: ['valid'], width: 6 },
        { kind: 'text', text: ' : 1; // 매핑 유효\n    uint32_t ' },
        { kind: 'blank', answers: ['present', 'prsnt'], width: 8 },
        { kind: 'text', text: ': 1; // 물리 메모리에 있음 (swap 여부)\n    uint32_t rw      : 1;\n    uint32_t us      : 1;\n    uint32_t ' },
        { kind: 'blank', answers: ['dirty'], width: 6 },
        { kind: 'text', text: '  : 1; // 쓰기 발생\n    uint32_t accessed: 1;\n};\n' },
      ],
      explanation: 'Valid / Present / RW / US / Dirty / Accessed 가 기본 비트.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch12-tf-1',
      type: 'true-false',
      prompt:
        'Paging 은 external fragmentation 은 해결하지만, 페이지 내부의 미사용 공간으로 인한 internal fragmentation 은 생길 수 있다.',
      answer: true,
    },
    {
      id: 'ch12-tf-2',
      type: 'true-false',
      prompt:
        '단순 선형 page table 로 번역할 때는, 매 메모리 접근마다 PTE 를 먼저 읽어야 해 실질적으로 접근 횟수가 2 배가 된다.',
      answer: true,
    },
    {
      id: 'ch12-tf-3',
      type: 'true-false',
      prompt:
        'PTE 의 "valid" 비트와 "present" 비트는 항상 같은 의미이다.',
      answer: false,
      explanation:
        'valid 는 매핑 자체의 유효성, present 는 해당 페이지가 지금 메모리에 있는지(아니면 swap 영역에 있는지) 여부.',
    },
    {
      id: 'ch12-tf-4',
      type: 'true-false',
      prompt:
        'Dirty bit 는 해당 페이지가 쓰기(수정) 되었는지를 나타내며, 이 비트가 세트되어 있어야 swap out 시 디스크에 써 줄 필요가 있다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch12-short-1',
      type: 'short-answer',
      prompt:
        '64B 가상 주소 공간 · 16B 페이지라면 VPN 비트 수는? (숫자만)',
      answers: ['2'],
      hint: '총 페이지 수를 로그 2',
      explanation: '64/16 = 4 페이지 → log2(4) = 2 비트.',
    },
    {
      id: 'ch12-short-2',
      type: 'short-answer',
      prompt:
        '물리 메모리 크기 128B · 페이지 16B 인 시스템에서, PFN 을 담으려면 최소 몇 비트가 필요한가? (숫자만)',
      answers: ['3'],
      hint: '총 프레임 수를 로그 2',
      explanation: '128/16 = 8 프레임 → log2(8) = 3 비트.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch12-essay-1',
      type: 'essay',
      prompt:
        '가변 크기(segmentation) 방식에서 겪던 external fragmentation 을 Paging 이 어떻게 해결하는지, 대신 어떤 비용이 생기는지 설명하시오.',
      modelAnswer:
        'Paging 은 가상 주소 공간과 물리 메모리를 모두 같은 크기(예: 4KB) 의 페이지/프레임 단위로 쪼갠다. 그 결과 새 프로세스의 임의의 페이지를 "물리 메모리의 어떤 빈 프레임에든" 그대로 꽂을 수 있다. 연속된 큰 공간이 필요하지 않으므로 external fragmentation 이 사실상 사라진다.\n\n대신 두 가지 비용이 생긴다.\n1) Internal fragmentation: 실제 사용량이 페이지 크기의 배수가 아니면 마지막 페이지의 일부가 남아 낭비된다.\n2) 번역 오버헤드: 가상 주소마다 page table 엔트리를 한 번 더 읽어야 하므로 메모리 접근 횟수가 2 배가 된다. 이 비용을 낮추기 위해 나중에 TLB 가 도입된다.\n\n또한 page table 자체의 크기도 문제(4MB/프로세스 등) 가 되어 다단계 page table 이 필요해진다.',
      rubric: [
        'Paging 이 external fragmentation 을 없애는 원리',
        'Internal fragmentation / 번역 오버헤드 중 최소 한 가지 언급',
        'TLB · 다단계 page table 로의 연결(선택)',
      ],
    },
    {
      id: 'ch12-essay-2',
      type: 'essay',
      prompt:
        'PTE 에 들어가는 주요 비트(Valid, Present, R/W, U/S, Accessed, Dirty)의 역할을 각각 설명하시오.',
      modelAnswer:
        '- Valid : 해당 PTE 의 매핑 자체가 유효한지. valid=0 이면 아예 매핑이 없는 가상 페이지로 취급되어 접근 시 fault.\n- Present : 페이지가 지금 물리 메모리에 있는지(1) 아니면 swap 되어 디스크에 있는지(0). 0 이면 page fault 후 OS 가 swap in.\n- R/W : 쓰기 허용 여부. read-only 페이지에 쓰기 시 fault.\n- U/S : User / Supervisor. 사용자 모드에서 접근 가능한지 커널만 가능한지 구분.\n- Accessed : 최근에 이 페이지가 참조되었는지. 페이지 교체 정책(LRU 근사 등) 에 사용.\n- Dirty : 이 페이지가 수정되었는지. swap out 시 수정되지 않은 페이지는 디스크에 다시 쓰지 않아도 됨.\n\n이 비트들로 한 엔트리가 매핑 + 보호 + 상태 정보를 통합해 관리한다.',
      rubric: [
        '각 비트의 의미 정확',
        '교체 정책 / swap 과의 연결(Accessed, Dirty)',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────
    {
      id: 'ch12-mc-4',
      type: 'multiple-choice',
      prompt:
        '다음 중 옳지 않은 설명은?',
      options: [
        { text: '페이지 크기를 키우면 page table 엔트리 수는 줄어든다.' },
        { text: '페이지 크기를 키우면 offset 비트 수가 증가한다.' },
        { text: '페이지 크기를 키우면 internal fragmentation 도 커질 수 있다.' },
        { text: '페이지 크기를 키우면 external fragmentation 이 같이 늘어난다.' },
      ],
      answerIndex: 3,
      explanation: 'Paging 은 고정 크기이므로 external fragmentation 은 원칙적으로 없다.',
    },
    {
      id: 'ch12-mc-5',
      type: 'multiple-choice',
      prompt:
        '선형 page table 의 각 엔트리가 8B 로 늘어난다면, 32-bit 주소공간·4KB 페이지 환경에서 프로세스당 page table 크기는 얼마가 되는가?',
      options: [
        { text: '4 MB' },
        { text: '8 MB' },
        { text: '16 MB' },
        { text: '2 MB' },
      ],
      answerIndex: 1,
      explanation: '2^20 × 8B = 8 MB.',
    },

    // ── 추가 : 코드 빈칸 ──────────────────
    {
      id: 'ch12-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '선형 page table 에서 주소를 번역한다. 오류 시 fault.',
      segments: [
        { kind: 'text', text: 'uint32_t translate(uint32_t va) {\n    uint32_t vpn    = va >> SHIFT;\n    uint32_t offset = va & OFFSET_MASK;\n\n    pte_t pte = page_table[vpn];\n    if (!pte.' },
        { kind: 'blank', answers: ['valid'], width: 6 },
        { kind: 'text', text: ') raise_fault();\n    if (!pte.' },
        { kind: 'blank', answers: ['present'], width: 8 },
        { kind: 'text', text: ') handle_page_fault(vpn);\n\n    return (pte.pfn << SHIFT) | offset;\n}\n' },
      ],
      explanation:
        'valid 는 "매핑 존재 여부", present 는 "현재 메모리에 존재 여부(아니면 swap in 필요)".',
    },

    // ── 추가 : True / False ─────────────
    {
      id: 'ch12-tf-5',
      type: 'true-false',
      prompt:
        'Paging 을 도입하면 프로세스의 heap 과 stack 이 물리 메모리에서 반드시 연속으로 놓여야 한다.',
      answer: false,
      explanation: '물리 frame 단위로 흩어져 놓일 수 있는 것이 paging 의 장점.',
    },
    {
      id: 'ch12-tf-6',
      type: 'true-false',
      prompt:
        'Paging 자체가 page table 을 어디에 저장해야 하는지 문제를 해결해 주지는 않는다 — page table 은 별도로 메모리 어딘가에 배치해야 한다.',
      answer: true,
    },
    {
      id: 'ch12-tf-7',
      type: 'true-false',
      prompt:
        'PTE 의 dirty bit 가 0 인 clean 페이지는, swap out 될 때 디스크에 다시 쓸 필요가 없다(이미 백업이 있다면).',
      answer: true,
    },
    {
      id: 'ch12-tf-8',
      type: 'true-false',
      prompt:
        '페이지 크기 4KB 에서 offset 은 정확히 12 비트이다.',
      answer: true,
      explanation: 'log2(4096) = 12.',
    },

    // ── 추가 : 단답 ────────────────────
    {
      id: 'ch12-short-3',
      type: 'short-answer',
      prompt:
        'VPN 이 5 비트, offset 이 7 비트인 시스템의 페이지 크기는 몇 바이트인가? (숫자만)',
      answers: ['128', '128B', '128 bytes'],
      explanation: '2^7 = 128.',
    },
    {
      id: 'ch12-short-4',
      type: 'short-answer',
      prompt:
        'Paging 을 도입한 뒤에도 남아 있는 대표적인 성능 문제 두 가지를 쉼표로 구분해 쓰시오.',
      answers: [
        '번역 오버헤드, page table 크기',
        '번역 오버헤드, 페이지 테이블 크기',
        'translation overhead, page table size',
        '번역 오버헤드,page table 크기',
      ],
      hint: '시간 문제와 공간 문제',
      explanation: '시간(번역 오버헤드) → TLB 로 해결, 공간(page table 크기) → Multi-Level 로 해결.',
    },

    // ── 추가 : 서술형 ───────────────────
    {
      id: 'ch12-essay-3',
      type: 'essay',
      prompt:
        'Paging 을 도입한 직후의 시스템에서는 왜 프로그램 실행 속도가 원래보다 느려지는지, 그리고 후속 해결책이 무엇인지 설명하시오.',
      modelAnswer:
        'Paging 은 매 메모리 접근마다 다음 두 단계를 거쳐야 한다.\n1) VPN 으로 page table 인덱스를 계산해 PTE 를 읽는다 (메모리 접근 1 회).\n2) PTE 의 PFN 과 offset 을 결합한 물리 주소로 실제 데이터를 읽는다 (메모리 접근 1 회).\n\n즉 논리적으로는 "메모리 접근 1 회" 였던 것이 "메모리 접근 2 회" 로 늘어나 실행 속도가 2 배에 가깝게 느려질 수 있다. 특히 캐시 miss 가 많은 상황에서는 체감 저하가 더 크다.\n\n해결책:\n- TLB: 최근 번역 결과를 MMU 내부의 작은 캐시에 보관해, 같은 VPN 이 다시 접근되면 page table 을 건드리지 않고 바로 PFN 을 얻는다. locality 가 있는 일반 워크로드에서는 hit rate 가 높아 번역 오버헤드가 거의 사라진다.\n- Multi-Level Page Table: 공간 문제를 풀되, TLB miss 시 접근 횟수가 단계 수만큼 늘어나는 시간 비용을 다시 도입한다. 역시 TLB 에 의존.\n\n결국 paging + TLB + multi-level 이 함께 쓰여, 공간과 시간 모두를 실용적인 범위로 관리한다.',
      rubric: [
        '번역 오버헤드의 정량적 원인',
        'TLB 의 역할',
        '공간 문제(테이블 크기) 의 존재를 언급',
      ],
    },
  ],
};

export default quiz;
