import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '15-swapping-mechanisms',
  chapterNumber: 15,
  title: 'Swapping: Mechanisms',
  description: 'Present bit, page fault control flow(①~⑥), lazy vs daemon, demand paging vs swapping까지 — 강의 코드 빈칸 포함.',
  questions: [
    // ═══════════════════════════════════════════════════════════════════
    // True / False
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch15-tf-1',
      type: 'true-false',
      prompt: 'page fault 는 프로세스가 잘못된(불법적인) 주소에 접근했을 때 발생하는 오류다.',
      answer: false,
      explanation:
        'valid = 1 인 합법적 주소인데 지금 physical memory 에 없을 뿐(present = 0). "유효하지만 disk 에 있으니 가져와야 한다" 는 신호이지 잘못된 접근이 아니다. 잘못된 주소(valid = 0)는 segmentation fault.',
    },
    {
      id: 'ch15-tf-2',
      type: 'true-false',
      prompt: 'swap space 에 내려가 있는 page 도 여전히 "어떤 프로세스의 어떤 VPN" 에 해당한다.',
      answer: true,
      explanation: '단지 현재 physical memory 에 없을 뿐, (Proc, VPN) 정체성은 유지된다.',
    },
    {
      id: 'ch15-tf-3',
      type: 'true-false',
      prompt: 'swap out 되었던 page 가 다시 swap in 될 때는 이전에 쓰던 것과 같은 PFN 으로 돌아온다는 보장이 있다.',
      answer: false,
      explanation:
        '비어 있던 frame 은 그 사이 다른 page 가 쓸 수 있다. swap in 때마다 free frame 을 새로 확보하고 PTE.PFN 을 갱신해야 한다.',
    },
    {
      id: 'ch15-tf-4',
      type: 'true-false',
      prompt: '어떤 page 가 swap out 되면 그 page 에 대한 기존 TLB entry 도 무효화해야 한다.',
      answer: true,
      explanation: 'TLB 가 옛 VPN→PFN 매핑을 계속 들고 있으면 잘못된 physical memory 에 접근하게 된다.',
    },
    {
      id: 'ch15-tf-5',
      type: 'true-false',
      prompt: 'page fault 가 발생하면 그 처리는 하드웨어(MMU)가 끝까지 수행한다.',
      answer: false,
      explanation:
        '하드웨어는 "지금 DRAM 에 없다(present=0)" 까지만 판단하고 trap 을 일으킨다. disk 어디서 가져올지, frame 확보, PTE 갱신은 모두 OS 의 page fault handler 몫.',
    },
    {
      id: 'ch15-tf-6',
      type: 'true-false',
      prompt: 'demand paging 의 대상 page 는 "예전에 DRAM 에 있다가 쫓겨난" page 다.',
      answer: false,
      explanation:
        '그건 swapping. demand paging 은 아직 한 번도 DRAM 에 올라온 적 없는 page 를 접근 시점에 처음 올리는 전략이다.',
    },
    {
      id: 'ch15-tf-7',
      type: 'true-false',
      prompt: 'swap daemon 은 free page 수가 low watermark 아래로 떨어지면 깨어나고, high watermark 위로 회복되면 멈춘다.',
      answer: true,
      explanation: 'LW 아래 → daemon 시작, HW 회복 → 정지. 꽉 차기 전에 background 에서 미리 여유 frame 을 확보한다.',
    },
    {
      id: 'ch15-tf-8',
      type: 'true-false',
      prompt: 'page fault 가 나면 데이터는 무조건 swap space 에서 가져온다.',
      answer: false,
      explanation:
        'backing store 는 경우에 따라 다르다 — swap-out 된 anonymous page 는 swap space, file-backed page 는 원본 파일, 새 anonymous page 는 zero-fill. 어디서 가져올지는 OS 가 PTE/VMA metadata 를 보고 결정.',
    },
    {
      id: 'ch15-tf-9',
      type: 'true-false',
      prompt: 'present = 0 인 PTE 에서 PFN 필드 자리는 disk 주소(swap slot)로 의미를 바꿔 재활용되는 경우가 많다.',
      answer: true,
      explanation: 'present = 1 이면 PFN, present = 0 이면 disk address 로 해석 — 같은 비트 자리를 상태에 따라 다르게 쓴다.',
    },
    {
      id: 'ch15-tf-10',
      type: 'true-false',
      prompt: 'Lazy approach (메모리가 완전히 꽉 찰 때까지 기다렸다가 evict) 는 매 요청마다 disk write 가 끼어들 수 있어 비현실적이다.',
      answer: true,
      explanation:
        '한 번 꽉 차면 이후에도 계속 꽉 찬 상태가 유지되어, 요청 → evict(disk I/O) → 적재가 반복된다. 그래서 watermark 기반 daemon 으로 미리 확보한다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 객관식
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch15-mc-1',
      type: 'multiple-choice',
      prompt: 'valid bit 와 present bit 의 의미가 올바르게 짝지어진 것은?',
      options: [
        { text: 'valid: 메모리에 있는가 / present: 합법적인 주소인가' },
        { text: 'valid: 합법적인 주소인가 / present: 지금 physical memory 에 있는가' },
        { text: '둘 다 "메모리에 있는가" 를 뜻하며 호환된다' },
        { text: 'valid: 읽기 권한 / present: 쓰기 권한' },
      ],
      answerIndex: 1,
      explanation:
        'valid = 0 → 애초에 접근하면 안 되는 주소(segfault). present = 0 → 합법적이지만 지금은 disk 에 있음(page fault).',
    },
    {
      id: 'ch15-mc-2',
      type: 'multiple-choice',
      prompt: 'TLB miss 후 page table 을 확인할 때 하드웨어의 검사 순서로 올바른 것은?',
      options: [
        { text: 'Present → Valid → Protection' },
        { text: 'Protection → Present → Valid' },
        { text: 'Valid → Protection → Present' },
        { text: 'Valid → Present → Protection' },
      ],
      answerIndex: 2,
      explanation:
        '합법적인 주소인지(Valid) → 권한이 있는지(Protection) → 메모리에 있는지(Present) 순. present 는 앞의 둘을 통과한 뒤에만 의미가 있다.',
    },
    {
      id: 'ch15-mc-3',
      type: 'multiple-choice',
      prompt: 'Page Fault Control Flow 그림의 ①~⑥ 단계 순서로 올바른 것은?',
      options: [
        { text: 'Reference → Trap → Check → Get the page → Reset Page Table → Re-instruction' },
        { text: 'Trap → Reference → Get the page → Check → Re-instruction → Reset Page Table' },
        { text: 'Reference → Check → Trap → Reset Page Table → Get the page → Re-instruction' },
        { text: 'Reference → Trap → Get the page → Check → Reset Page Table → Re-instruction' },
      ],
      answerIndex: 0,
      explanation:
        '① 참조 → ② present=0 으로 trap → ③ OS 가 swap 위치 확인 → ④ disk 에서 page 읽어오기 → ⑤ PTE 갱신(present=1, 새 PFN) → ⑥ 같은 instruction 재실행.',
    },
    {
      id: 'ch15-mc-4',
      type: 'multiple-choice',
      prompt: 'page fault 처리 후 RetryInstruction (재실행) 이 필요한 이유는?',
      options: [
        { text: 'TLB 를 비우기 위해서' },
        { text: 'disk 에서 읽은 데이터를 검증하기 위해서' },
        { text: 'fault 를 일으킨 instruction 은 완료되지 못했으므로 같은 PC 에서 다시 실행해야 하기 때문' },
        { text: '다음 instruction 부터 이어서 실행하기 위해서' },
      ],
      answerIndex: 2,
      explanation:
        'OS 가 page 를 올려 줬다고 원래 instruction 이 자동으로 완료되는 게 아니다. 이번에는 present = 1 이므로 같은 instruction 이 정상 수행된다.',
    },
    {
      id: 'ch15-mc-5',
      type: 'multiple-choice',
      prompt: 'Demand Paging 과 Swapping 의 공통점으로 옳은 것은?',
      options: [
        { text: '둘 다 page 가 예전에 DRAM 에 있다가 쫓겨난 경우다' },
        { text: '둘 다 present = 0 인 page 접근 시 page fault 로 처리되고, handler 가 적재 후 instruction 을 재실행한다' },
        { text: '둘 다 데이터를 swap space 에서 가져온다' },
        { text: '둘 다 disk read 없이 zero-fill 로 처리된다' },
      ],
      answerIndex: 1,
      explanation:
        '메커니즘(present=0 → page fault → 적재 → 재실행)은 공통. 차이는 출처 — demand paging 은 실행 파일/mmap/zero-fill, swapping 은 swap space.',
    },
    {
      id: 'ch15-mc-6',
      type: 'multiple-choice',
      prompt: 'physical memory 도 꽉 차고 swap space 도 꽉 찼을 때 일어날 수 있는 일이 아닌 것은?',
      options: [
        { text: 'memory allocation 실패' },
        { text: 'OOM(Out-Of-Memory) killer 동작' },
        { text: '프로세스 강제 종료' },
        { text: 'OS 가 자동으로 page 크기를 절반으로 줄여 공간을 확보' },
      ],
      answerIndex: 3,
      explanation: 'page 크기를 동적으로 줄이는 메커니즘은 없다. 더 내보낼 곳이 없으면 할당 실패·OOM killer·시스템 멈춤으로 이어진다.',
    },
    {
      id: 'ch15-mc-7',
      type: 'multiple-choice',
      prompt: 'malloc 으로 받은 새 anonymous page 에 처음 접근해서 page fault 가 났다. 데이터는 어디서 오는가?',
      options: [
        { text: 'swap space 에서 읽어온다' },
        { text: '실행 파일에서 읽어온다' },
        { text: '가져올 데이터 자체가 없으므로 disk read 없이 zero-fill 된 frame 을 받는다' },
        { text: 'segmentation fault 가 발생한다' },
      ],
      answerIndex: 2,
      explanation: '아직 한 번도 쓰인 적 없는 page 라 disk 에 사본이 없다. OS 는 0 으로 채운 새 frame 을 매핑해 준다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 단답형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch15-sa-1',
      type: 'short-answer',
      prompt: 'page 를 physical memory 와 disk 사이에서 옮기기 위해 disk 에 따로 예약해 둔 공간의 이름은? (영문)',
      answers: ['swap space', 'swapspace', 'swap'],
      hint: '○○ space',
      explanation: 'swap space — page-sized unit 으로 관리된다.',
    },
    {
      id: 'ch15-sa-2',
      type: 'short-answer',
      prompt: 'free page 를 미리 확보하기 위해 background 에서 도는 OS thread 의 이름은? (영문, 두 이름 중 하나)',
      answers: ['swap daemon', 'page daemon', 'swapdaemon', 'pagedaemon'],
      hint: '○○ daemon',
      explanation: 'swap daemon 또는 page daemon. Linux 에서는 kswapd 가 이 역할.',
    },
    {
      id: 'ch15-sa-3',
      type: 'short-answer',
      prompt: 'daemon 이 깨어나는 기준선(이 아래로 free page 가 떨어지면 시작)의 이름은? (영문)',
      answers: ['low watermark', 'lw', 'low watermark (lw)'],
      hint: '반대쪽 기준선은 high watermark',
      explanation: 'Low Watermark(LW) 아래로 떨어지면 daemon 이 깨어나 High Watermark(HW)까지 회복시킨다.',
    },
    {
      id: 'ch15-sa-4',
      type: 'short-answer',
      prompt: 'PTE 의 어떤 bit 가 0 이면 "유효한 page 인데 지금은 disk 에 있다" 는 뜻인가? (영문 bit 이름)',
      answers: ['present bit', 'present'],
      hint: 'valid 와 헷갈리지 말 것',
      explanation: 'present bit = 0 → page fault. valid bit = 0 → segmentation fault.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 코드 빈칸 — 강의 Page Fault Control Flow 코드
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch15-cb-1',
      type: 'code-blank',
      prompt: 'Page Fault Control Flow (Hardware) — TLB miss 이후 PTE 검사 분기. 각 분기에서 발생하는 exception/동작을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'PTEAddr = PTBR + (VPN * sizeof(PTE));\nPTE     = AccessMemory(PTEAddr);\n\nif (PTE.Valid == False) {\n    RaiseException(' },
        { kind: 'blank', answers: ['SEGMENTATION_FAULT', 'segmentation_fault'], width: 22 },
        { kind: 'text', text: ');\n} else if (CanAccess(PTE.ProtectBits) == False) {\n    RaiseException(PROTECTION_FAULT);\n} else if (PTE.Present == True) {\n    ' },
        { kind: 'blank', answers: ['TLB_Insert(VPN, PTE.PFN, PTE.ProtectBits)', 'TLB_Insert(VPN, PTE.PFN, PTE.ProtectBits);'], width: 42 },
        { kind: 'text', text: ';\n    RetryInstruction();\n} else {\n    // valid = 1, protection OK, present = 0\n    RaiseException(' },
        { kind: 'blank', answers: ['PAGE_FAULT', 'page_fault'], width: 14 },
        { kind: 'text', text: ');\n}' },
      ],
      explanation:
        'Valid → Protection → Present 순서로 검사. valid=0 은 SEGMENTATION_FAULT, present=1 이면 TLB 에 넣고 재시도, present=0 이면 PAGE_FAULT.',
    },
    {
      id: 'ch15-cb-2',
      type: 'code-blank',
      prompt: 'Page Fault Control Flow (Software) — OS handler 의 ③~⑥ 단계. 빈칸을 채워라.',
      language: 'c',
      segments: [
        { kind: 'text', text: 'DiskAddr = PTE.DiskAddr;             // ③ swap 위치 확인\n\nPFN = FindFreePhysicalPage();\nif (PFN == -1) {\n    PFN = ' },
        { kind: 'blank', answers: ['EvictPage()', 'EvictPage();'], width: 14 },
        { kind: 'text', text: ';          // replacement algorithm\n}\n\n' },
        { kind: 'blank', answers: ['DiskRead(DiskAddr, PFN)', 'DiskRead(DiskAddr, PFN);'], width: 26 },
        { kind: 'text', text: ';      // ④ disk I/O 동안 프로세스는 sleep\n\nPTE.Present = ' },
        { kind: 'blank', answers: ['True', 'true', '1'], width: 8 },
        { kind: 'text', text: ';                  // ⑤ PTE 갱신\nPTE.PFN     = PFN;\n\n' },
        { kind: 'blank', answers: ['RetryInstruction()', 'RetryInstruction();'], width: 22 },
        { kind: 'text', text: ';            // ⑥ 같은 instruction 재실행' },
      ],
      explanation:
        '빈 frame 이 없으면 EvictPage() 로 victim 을 내보내 확보 → DiskRead 로 swap 의 page 를 읽어옴 → PTE.Present = True, 새 PFN 기록 → RetryInstruction.',
    },
    {
      id: 'ch15-cb-3',
      type: 'code-blank',
      prompt: 'Lazy Approach 와 Page Daemon 비교 표 — 빈칸을 채워라.',
      language: 'text',
      segments: [
        { kind: 'text', text: '            | Lazy Approach              | Page Daemon\n시점        | memory 가 완전히 ' },
        { kind: 'blank', answers: ['찰 때까지 기다림', '꽉 찰 때까지 기다림', '찰 때까지'], width: 18 },
        { kind: 'text', text: ' | 완전히 차기 전에 미리 동작\n처리        | 필요할 때마다 page 하나     | background 에서 ' },
        { kind: 'blank', answers: ['여러 page', '여러 page를', '여러'], width: 12 },
        { kind: 'text', text: ' 내보냄\n영향        | 요청한 프로세스가 ' },
        { kind: 'blank', answers: ['disk I/O', 'disk i/o', '디스크 I/O'], width: 12 },
        { kind: 'text', text: ' 를 기다림 | free frame 을 일정 수준 이상 유지' },
      ],
      explanation: 'Lazy 는 단순하지만 요청 경로에 disk I/O 가 끼고, daemon 은 watermark 사이에서 미리 회수해 대기 시간을 줄인다.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // 서술형
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'ch15-essay-1',
      type: 'essay',
      prompt:
        'CPU 가 어떤 virtual address 를 참조했는데 해당 page 가 swap space 에 있다. 이때 일어나는 일을 page fault 발생부터 instruction 재실행까지 단계별로 서술하라. (하드웨어가 하는 일과 OS 가 하는 일을 구분할 것)',
      modelAnswer: [
        '[하드웨어 — ①②]',
        '1. (① Reference) CPU/MMU 가 VPN 을 뽑아 TLB 를 확인한다. miss 면 page table 에서 PTE 를 읽는다.',
        '2. 검사 순서는 Valid → Protection → Present. valid=1, 권한 OK, present=0 이므로 PAGE_FAULT exception 을 일으킨다 (② Trap). kernel mode 로 진입하며 OS 의 page fault handler 가 실행된다.',
        '',
        '[OS — ③④⑤⑥]',
        '3. (③ Check) handler 는 PTE(또는 별도 자료구조)에서 이 page 가 swap space 의 어느 disk 주소에 있는지 확인한다. present=0 이므로 PFN 필드 자리는 disk 주소로 재해석된다.',
        '4. (준비) free frame 을 찾고, 없으면 replacement policy 로 victim 을 골라 evict 해서 frame 을 확보한다 (victim 이 dirty 면 disk 에 먼저 써야 함).',
        '5. (④ Get the page) DiskRead(DiskAddr, PFN) 으로 swap 의 page 를 확보한 frame 으로 읽어온다. disk I/O 동안 프로세스는 sleep (blocked) 상태가 되고 다른 프로세스가 실행될 수 있다.',
        '6. (⑤ Reset Page Table) PTE.Present = True, PTE.PFN = 새 PFN 으로 갱신한다. (같은 PFN 으로 돌아온다는 보장이 없으므로 반드시 갱신)',
        '7. (⑥ Re-instruction) fault 를 일으킨 instruction 을 같은 PC 에서 재실행한다. 이번에는 present=1 이므로 (TLB miss → TLB insert 를 거쳐) 정상적으로 메모리에 접근한다.',
      ].join('\n'),
      rubric: [
        '하드웨어의 검사 순서(Valid → Protection → Present)와 trap 발생을 구분해 서술',
        'free frame 확보(없으면 evict) 과정 포함',
        'disk I/O 동안 프로세스가 sleep 한다는 점',
        'PTE 갱신(present=1, 새 PFN)과 재실행(RetryInstruction)으로 마무리',
      ],
    },
  ],
};

export default quiz;
