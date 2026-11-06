import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '13-tlb',
  chapterNumber: 13,
  title: 'TLB — Translation Lookaside Buffer',
  description: '번역 가속의 핵심. locality 에 힘입은 MMU 내부 캐시.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch13-mc-1',
      type: 'multiple-choice',
      prompt: 'TLB 가 가장 잘 동작하는 조건은?',
      options: [
        { text: 'random 한 주소 접근' },
        { text: '공간적/시간적 locality 가 높은 접근 패턴' },
        { text: 'write 가 많은 워크로드' },
        { text: '큰 페이지보다 작은 페이지' },
      ],
      answerIndex: 1,
      explanation:
        'Locality 덕분에 같은 페이지에 대한 번역이 반복되어 hit rate 가 높아진다.',
    },
    {
      id: 'ch13-mc-2',
      type: 'multiple-choice',
      prompt:
        'Context switch 시 TLB 가 문제를 일으킬 수 있는 이유는?',
      options: [
        { text: '프로세스 A 의 (VPN, PFN) 매핑이 프로세스 B 에서는 잘못된 PFN 으로 해석될 수 있어서' },
        { text: 'TLB 가 항상 write-through 캐시이기 때문에' },
        { text: 'TLB 가 kernel mode 에서 꺼지기 때문에' },
        { text: 'TLB miss 가 user mode 에서만 발생하기 때문에' },
      ],
      answerIndex: 0,
      explanation:
        'TLB entry 는 단순 (VPN, PFN) 이라 프로세스 구분이 안 된다. 해결책: flush 또는 ASID.',
    },
    {
      id: 'ch13-mc-3',
      type: 'multiple-choice',
      prompt:
        'HW-managed TLB 와 SW-managed TLB 의 차이로 옳은 것은?',
      options: [
        { text: 'HW-managed 는 OS 가 매 TLB miss 를 처리한다.' },
        { text: 'SW-managed 는 OS trap handler 가 TLB miss 를 처리한다.' },
        { text: 'SW-managed 는 페이지 테이블을 사용하지 않는다.' },
        { text: '두 방식 모두 미리 모든 매핑을 TLB 에 올려 둔다.' },
      ],
      answerIndex: 1,
      explanation:
        'HW-managed(x86 류): 하드웨어가 page table walk. SW-managed(일부 RISC): OS 가 trap 으로 처리.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch13-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        'TLB lookup 의 흐름. hit 면 바로 PFN 으로, miss 면 page table 로.',
      segments: [
        { kind: 'text', text: 'uint32_t translate(uint32_t va) {\n    uint32_t vpn = va >> SHIFT;\n    tlb_entry_t *e = tlb_lookup(vpn);\n    if (e) {\n        // HIT\n        return (e->pfn << SHIFT) | (va & OFFSET_MASK);\n    }\n    // MISS — page table 로\n    pte_t pte = page_table[vpn];\n    tlb_' },
        { kind: 'blank', answers: ['insert', 'add', 'fill'], width: 8 },
        { kind: 'text', text: '(vpn, pte.pfn);\n    return (pte.pfn << SHIFT) | (va & ' },
        { kind: 'blank', answers: ['OFFSET_MASK', '0xFFF'], width: 14 },
        { kind: 'text', text: ');\n}\n' },
      ],
      explanation:
        'miss 시 page table 에서 pte 를 읽고 TLB 에 채운 뒤 계산.',
    },
    {
      id: 'ch13-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        'ASID 태그를 사용하는 TLB 엔트리의 키를 완성하시오.',
      segments: [
        { kind: 'text', text: 'typedef struct tlb_entry {\n    uint32_t vpn;\n    uint32_t ' },
        { kind: 'blank', answers: ['asid', 'ASID'], width: 6 },
        { kind: 'text', text: ';    // 프로세스 구분\n    uint32_t pfn;\n    uint8_t  prot;\n} tlb_entry_t;\n\n// 조회 시 키는 (vpn, asid) 쌍\ntlb_entry_t *tlb_lookup(uint32_t vpn) {\n    uint32_t cur = current_' },
        { kind: 'blank', answers: ['asid', 'ASID'], width: 6 },
        { kind: 'text', text: ';\n    // vpn 과 cur asid 가 모두 일치해야 hit\n    // ...\n}\n' },
      ],
      explanation:
        'ASID (Address Space ID) 를 태그해 프로세스를 구분. context switch 시 flush 하지 않아도 됨.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch13-tf-1',
      type: 'true-false',
      prompt:
        '배열을 순차로 읽는 코드는 TLB hit rate 가 높다. 같은 페이지 안의 여러 요소가 한 번의 번역으로 접근되기 때문이다.',
      answer: true,
    },
    {
      id: 'ch13-tf-2',
      type: 'true-false',
      prompt:
        '공유 페이지(예: 같은 라이브러리의 코드) 는 ASID 가 다른 두 TLB 엔트리가 동일한 PFN 을 가리키게 되어 자연스럽게 처리된다.',
      answer: true,
    },
    {
      id: 'ch13-tf-3',
      type: 'true-false',
      prompt:
        'LRU(Least Recently Used) 교체는 temporal locality 가 있는 워크로드에서 합리적인 정책이다.',
      answer: true,
    },
    {
      id: 'ch13-tf-4',
      type: 'true-false',
      prompt:
        'TLB 는 지역성을 활용해 번역 비용을 줄이지만, page table 자체가 메모리에 차지하는 공간 문제를 해결해 주지는 않는다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch13-short-1',
      type: 'short-answer',
      prompt:
        'TLB 에서 entry 수 64개이고 히트율이 90% 일 때, 평균 번역 비용을 메모리 접근 1 사이클 기준으로 계산하면 몇 사이클인가? (page table 접근은 1 사이클 추가, TLB 접근은 무시)',
      answers: ['0.1', '0.1 사이클'],
      hint: 'miss rate × 추가 접근',
      explanation: '0.1 * 1 + 0.9 * 0 = 0.1 사이클/번역 (TLB 접근 비용은 무시).',
    },
    {
      id: 'ch13-short-2',
      type: 'short-answer',
      prompt:
        'TLB 엔트리에 프로세스를 구분하기 위해 추가로 태그하는 식별자의 이름은? (약어)',
      answers: ['ASID', 'asid'],
      explanation: 'Address Space ID.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch13-essay-1',
      type: 'essay',
      prompt:
        'TLB 가 왜 필요한지, 그리고 TLB miss 가 발생했을 때 HW-managed / SW-managed 방식이 각각 어떻게 처리하는지 설명하시오.',
      modelAnswer:
        'Paging 을 쓰면 매 메모리 접근마다 page table 에서 PTE 를 읽어야 해 사실상 접근 횟수가 2 배가 된다. TLB 는 MMU 내부에 두는 작은 하드웨어 캐시로, 최근에 번역한 (VPN → PFN) 매핑을 보관해 hit 면 page table 방문을 생략한다. locality 가 있는 보통 워크로드에서는 대부분의 번역이 hit 로 처리되어 번역 오버헤드가 크게 줄어든다.\n\nMiss 처리:\n- HW-managed (x86 등): 하드웨어가 직접 page table 을 walk 해서 PTE 를 읽고 TLB 에 채워 넣은 뒤 명령을 재시도한다. OS 개입이 없어 빠르지만, 페이지 테이블 구조가 하드웨어에 의해 고정된다.\n- SW-managed (일부 RISC): TLB miss 가 일어나면 예외(트랩)를 발생시켜 OS 의 trap handler 로 진입한다. 핸들러가 page table 을 순회해 필요한 PTE 를 찾고, 명시적 명령으로 TLB 에 삽입한 뒤 return-from-trap. 유연하지만 매 miss 비용이 더 크다.',
      rubric: [
        'TLB 의 역할과 locality 언급',
        'HW / SW managed 의 처리 방식 구분',
        '각 방식의 장단(속도 vs 유연성)',
      ],
    },
    {
      id: 'ch13-essay-2',
      type: 'essay',
      prompt:
        'Context switch 시 TLB 가 유발하는 문제와 두 가지 해결 전략(Flush vs ASID) 을 비교하시오.',
      modelAnswer:
        '문제: TLB 엔트리는 보통 (VPN → PFN) 쌍만 저장하므로 프로세스 구분 정보가 없다. 만약 context switch 를 하고도 TLB 를 그대로 두면, A 의 가상 VPN 10 에 대한 매핑이 B 의 VPN 10 접근에도 그대로 사용되어 엉뚱한 물리 프레임을 읽거나 쓰게 된다(보안·정확성 파괴).\n\n해결 1 - Flush: context switch 마다 TLB 전체를 무효화한다. 안전하지만 매번 cold cache 에서 시작하므로 초반 miss 가 폭증한다.\n\n해결 2 - ASID 태깅: 각 TLB 엔트리에 Address Space ID 를 함께 저장한다. 조회 시 (VPN, ASID) 가 모두 일치해야 hit. flush 없이 여러 프로세스의 매핑이 TLB 에 공존할 수 있어, 자주 스위치되는 워크로드에서 큰 이득. 공유 페이지도 서로 다른 ASID 가 같은 PFN 을 가리키게 되어 자연스럽게 처리된다.',
      rubric: [
        '공유 TLB 가 프로세스 구분이 없음을 지적',
        'Flush 방식의 단순함과 초기 miss 비용',
        'ASID 방식의 공존 가능성과 공유 페이지 처리',
      ],
    },

    // ── 추가 : 객관식 ─────────────────────
    {
      id: 'ch13-mc-4',
      type: 'multiple-choice',
      prompt:
        '배열 연속 접근으로 TLB hit rate 가 높아지는 원인을 locality 로 설명할 때, 더 "직접적으로" 기여하는 것은?',
      options: [
        { text: 'Temporal locality (같은 주소 재방문)' },
        { text: 'Spatial locality (근처 주소 방문)' },
        { text: '랜덤 locality' },
        { text: '이 둘과 무관하다.' },
      ],
      answerIndex: 1,
      explanation:
        '배열은 연속 요소 = 같은 페이지에 속할 확률이 높음 → spatial locality 가 TLB hit 에 기여.',
    },
    {
      id: 'ch13-mc-5',
      type: 'multiple-choice',
      prompt:
        '다음 중 TLB 를 flush 해야 하는 상황이 아닌 것은?',
      options: [
        { text: 'ASID 지원이 없는 CPU 에서 context switch 할 때' },
        { text: '페이지 테이블 엔트리의 매핑을 unmap 한 뒤 같은 VPN 을 새 PFN 으로 재매핑할 때' },
        { text: 'CR3(페이지 테이블 베이스) 레지스터를 바꿀 때 (ASID 없음)' },
        { text: '읽기 전용인 프로그램이 단순히 배열을 순회할 때' },
      ],
      answerIndex: 3,
      explanation: '읽기 접근 자체는 flush 를 유발하지 않는다.',
    },

    // ── 추가 : 코드 빈칸 ──────────────────
    {
      id: 'ch13-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        'x86 의 TLB invalidate. 특정 VPN 한 줄만 무효화한다.',
      segments: [
        { kind: 'text', text: '// 리눅스 / x86\nstatic inline void flush_tlb_one(void *va) {\n    asm volatile("' },
        { kind: 'blank', answers: ['invlpg', 'INVLPG'], width: 8 },
        { kind: 'text', text: ' (%0)" :: "r"(va) : "memory");\n}\n' },
      ],
      explanation: 'x86 의 INVLPG 명령어. 전체 flush 는 CR3 reload 로 대체한다.',
    },

    // ── 추가 : True / False ───────────────
    {
      id: 'ch13-tf-5',
      type: 'true-false',
      prompt:
        'TLB 는 MMU 외부, 즉 L1 / L2 캐시 옆에 위치한다.',
      answer: false,
      explanation: 'TLB 는 MMU 내부에 있는 전용 캐시다.',
    },
    {
      id: 'ch13-tf-6',
      type: 'true-false',
      prompt:
        'ASID 를 쓰더라도 kernel 전역 매핑처럼 "모든 프로세스에서 공통" 인 매핑은 별도로 global 플래그로 표시해 flush 때 남겨 둘 수 있다.',
      answer: true,
      explanation: 'x86 의 PTE global bit 가 대표적 예.',
    },
    {
      id: 'ch13-tf-7',
      type: 'true-false',
      prompt:
        'TLB miss rate 가 같다면, 한 miss 당 시간 비용은 HW-managed 보다 SW-managed 가 작다.',
      answer: false,
      explanation: 'SW-managed 는 trap/OS 진입이 필요해 일반적으로 더 비싸다.',
    },
    {
      id: 'ch13-tf-8',
      type: 'true-false',
      prompt:
        '큰 페이지(huge page) 를 쓰면 같은 데이터 범위에 대해 필요한 TLB 엔트리 수가 줄어들어 hit rate 가 개선되는 경향이 있다.',
      answer: true,
    },

    // ── 추가 : 단답 ───────────────────────
    {
      id: 'ch13-short-3',
      type: 'short-answer',
      prompt:
        '페이지 크기 4KB, 배열 크기 64KB, 순차 접근. 배열을 처음부터 끝까지 한 번 훑을 때 TLB miss 는 최대 몇 번 발생할 수 있는가? (숫자만, cold start 기준)',
      answers: ['16'],
      hint: '배열이 걸치는 페이지 수',
      explanation: '64KB / 4KB = 16 페이지. 처음 만나는 페이지마다 1 miss → 최대 16.',
    },
    {
      id: 'ch13-short-4',
      type: 'short-answer',
      prompt:
        'TLB entry 가 64 개, 각 entry 가 4KB 페이지를 커버한다면 TLB 의 총 reach 는? (숫자만, 단위 KB)',
      answers: ['256', '256KB', '256 KB'],
      hint: '64 × 4',
      explanation: '64 × 4KB = 256KB.',
    },

    // ── 추가 : 서술형 ─────────────────────
    {
      id: 'ch13-essay-3',
      type: 'essay',
      prompt:
        '프로그램의 메모리 접근 패턴에 따라 TLB hit rate 가 어떻게 달라지는지, "배열 순회" vs "연결 리스트 순회" 를 비교해 설명하시오.',
      modelAnswer:
        '배열 순회:\n- 원소가 물리적으로 연속되어 있으므로 한 페이지 안에 여러 원소가 들어 있다. 한 번의 번역(= 한 TLB 엔트리) 이 같은 페이지의 수많은 원소 접근을 커버한다.\n- 따라서 spatial locality 가 높고 TLB hit rate 가 매우 높다. cold start 에서만 페이지 수만큼의 miss 가 나고, 이후는 대부분 hit.\n\n연결 리스트 순회:\n- 노드들이 malloc 으로 흩어진 위치에 할당되면 포인터 체이스마다 서로 다른 페이지를 건드릴 가능성이 높다.\n- 페이지 단위의 spatial locality 가 약해, 노드마다 새 TLB 엔트리가 필요할 수 있다. 전체 노드 수가 많을수록 TLB miss 가 비례해서 늘어나 번역 오버헤드가 실질 성능을 지배할 수 있다.\n- 특히 TLB reach(64 entry × 4KB = 256KB) 를 넘어가는 워킹셋을 가지면 계속 thrashing 이 일어난다.\n\n정리: 같은 "N 개 원소 순회" 라도 자료구조의 메모리 배치에 따라 TLB 관점의 비용이 크게 달라진다. 고성능이 필요하면 data structure 를 cache/TLB 친화적으로 설계(arena allocator, packed array 등)하는 것이 효과적.',
      rubric: [
        '배열의 spatial locality 이점',
        '연결 리스트의 TLB miss 원인',
        'TLB reach 개념(선택)',
      ],
    },
  ],
};

export default quiz;
