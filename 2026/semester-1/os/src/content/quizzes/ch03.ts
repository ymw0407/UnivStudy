import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '03-limited-direct-execution',
  chapterNumber: 3,
  title: 'Limited Direct Execution',
  description: 'User/Kernel 모드, trap, context switch — 제어권을 OS 가 다시 가져오는 메커니즘.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch03-mc-1',
      type: 'multiple-choice',
      prompt:
        'Direct Execution(그냥 프로그램을 CPU 에 직접 돌리기) 의 한계에 해당하지 않는 것은?',
      options: [
        { text: '잘못된 포인터 접근으로 다른 메모리 영역을 덮어쓸 수 있다.' },
        { text: '프로세스가 무한루프로 CPU 를 내놓지 않으면 OS 가 제어권을 되찾기 어렵다.' },
        { text: '시스템콜 없이도 디스크에 직접 접근할 수 있다.' },
        { text: 'CPU 가상화의 성능 자체가 극단적으로 나빠진다.' },
      ],
      answerIndex: 3,
      explanation:
        'Direct Execution 의 "성능"은 오히려 좋다 (OS 개입이 없으니까). 문제는 보호와 제어를 못 한다는 점.',
    },
    {
      id: 'ch03-mc-2',
      type: 'multiple-choice',
      prompt: 'Trap 이 발생했을 때 CPU 가 하는 일의 순서로 가장 적절한 것은?',
      options: [
        {
          text: 'User mode 로 강등 → 레지스터 저장 → handler 점프 → return-from-trap',
        },
        {
          text: 'Kernel mode 로 상승 → 레지스터 저장 → trap table 에서 handler 찾기 → handler 실행 → return-from-trap 으로 복귀',
        },
        {
          text: 'trap table 에서 handler 를 찾고 → handler 실행 → Kernel mode 로 상승 → User mode 로 복귀',
        },
        {
          text: '레지스터 저장 → User mode 유지 → handler 실행 → Kernel mode 로 복귀',
        },
      ],
      answerIndex: 1,
      explanation:
        '권한 상승 → 레지스터 저장(나중에 돌아오기 위해) → trap table 조회 → handler → return-from-trap 으로 복원 및 권한 강등.',
    },
    {
      id: 'ch03-mc-3',
      type: 'multiple-choice',
      prompt:
        'Cooperative vs Non-cooperative 스케줄링 관점에서, OS 가 주기적으로 제어권을 되찾기 위해 반드시 필요한 것은?',
      options: [
        { text: '프로세스의 자발적 yield() 호출' },
        { text: '타이머 인터럽트와 관련 handler' },
        { text: '사용자 프로그램의 exit(0) 호출' },
        { text: '가상 메모리 시스템' },
      ],
      answerIndex: 1,
      explanation:
        'Non-cooperative 방식에서는 주기적인 타이머 인터럽트로 OS 가 주도권을 되찾아야 한다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch03-code-1',
      type: 'code-blank',
      language: 'c',
      prompt: 'Trap 발생 시 수행되는 의사코드다. 네 개의 핵심 단계를 채우시오.',
      segments: [
        { kind: 'text', text: 'void handle_trap(int trap_num) {\n    // 1) 권한 모드 승격\n    switch_to_' },
        { kind: 'blank', answers: ['kernel', 'KERNEL'], width: 10 },
        { kind: 'text', text: '_mode();\n\n    // 2) 사용자 레지스터를 커널 스택에 저장\n    save_user_' },
        { kind: 'blank', answers: ['registers', 'regs', 'register'], width: 14 },
        { kind: 'text', text: '();\n\n    // 3) 어떤 trap 인지에 따라 다른 handler 로 분기\n    void (*h)() = trap_' },
        { kind: 'blank', answers: ['table', 'TABLE'], width: 8 },
        { kind: 'text', text: '[trap_num];\n    h();\n\n    // 4) 저장해 둔 상태를 복원하고 user 로 복귀\n    ' },
        { kind: 'blank', answers: ['return-from-trap', 'iret', 'return_from_trap'], width: 20 },
        { kind: 'text', text: '();\n}\n' },
      ],
      explanation:
        'kernel 모드 상승 → 레지스터 저장 → trap table 에서 handler 선택 → return-from-trap.',
    },
    {
      id: 'ch03-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        'x86 에서 소프트웨어 trap 을 일으키는 인터럽트 명령어와, 시스템콜 번호를 담는 전통적인 레지스터(리눅스 i386) 를 채우시오.',
      segments: [
        { kind: 'text', text: '// syscall 번호를 eax 에 넣고 trap 을 발생시킨다.\nmov eax, ' },
        { kind: 'blank', answers: ['1'], width: 4 },
        { kind: 'text', text: '         ; __NR_exit 로 가정\n' },
        { kind: 'blank', answers: ['int', 'INT'], width: 5 },
        { kind: 'text', text: '   0x80\n' },
      ],
      explanation:
        '리눅스 i386 에서 시스템콜 번호는 eax 에 넣고 `int 0x80` 으로 kernel 에 진입한다.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch03-tf-1',
      type: 'true-false',
      prompt:
        'User mode 에서도 시스템콜을 거치지 않고 하드웨어 I/O 포트에 직접 접근할 수 있다.',
      answer: false,
      explanation:
        '특권 명령은 kernel mode 에서만 허용된다. user mode 에서 시도하면 exception 이 발생한다.',
    },
    {
      id: 'ch03-tf-2',
      type: 'true-false',
      prompt:
        'trap table 은 부팅 시 OS 가 등록하며, 이후 사용자 프로그램이 임의로 다시 설정할 수는 없다.',
      answer: true,
      explanation:
        'trap table 설정은 특권 명령이며, 부팅 시 한 번 초기화된다.',
    },
    {
      id: 'ch03-tf-3',
      type: 'true-false',
      prompt:
        'Context switch 는 사용자 프로세스 A 의 레지스터를 kernel stack 에 저장하고, B 의 레지스터를 복원하는 과정이다.',
      answer: true,
    },
    {
      id: 'ch03-tf-4',
      type: 'true-false',
      prompt:
        'System call 은 일종의 소프트웨어 trap(software interrupt) 으로, exception 이나 하드웨어 interrupt 와 같은 메커니즘 위에서 동작한다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch03-short-1',
      type: 'short-answer',
      prompt:
        'trap 번호를 키로 삼아 어떤 커널 핸들러로 점프할지 결정하는 테이블의 이름은? (영문)',
      answers: ['trap table', 'IDT', 'interrupt descriptor table'],
      hint: 'x86 에서는 IDT 라고 부르기도 함',
      explanation: 'Trap Table(일반 용어). x86 하드웨어에서는 IDT(Interrupt Descriptor Table).',
    },
    {
      id: 'ch03-short-2',
      type: 'short-answer',
      prompt:
        '타이머 인터럽트 주기가 1 ms, context switch 에 드는 시간이 10 μs 라면, 한 타이머 주기당 CPU 시간 중 context switch 오버헤드가 차지하는 비율은 몇 % 인가?',
      answers: ['1%', '1 %', '1'],
      hint: '% 기호 포함',
      explanation: '10 μs / 1 ms = 10 / 1000 = 1 %.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch03-essay-1',
      type: 'essay',
      prompt:
        '"Limited" Direct Execution 이 "Direct Execution" 에 비해 추가한 두 가지 하드웨어·OS 장치(특권 모드 구분 / trap 메커니즘)를 각각 어떤 문제를 풀기 위해 도입했는지 설명하시오.',
      modelAnswer:
        '1) User / Kernel 모드 구분: 사용자 프로그램의 잘못된 메모리 접근이나 특권 명령(디스크 I/O, 페이지 테이블 수정 등)이 시스템 전체를 망가뜨리지 못하도록, CPU 에 두 종류의 실행 권한을 둔다. User mode 에서는 금지된 명령을 만나면 exception 이 발생해 kernel 이 개입한다.\n\n2) Trap 메커니즘 (system call, timer interrupt 포함): 사용자 프로그램이 커널 서비스를 요청할 수 있도록 미리 정의된 진입점을 제공하고(system call), 동시에 프로그램이 무한루프 등으로 CPU 를 반납하지 않을 때 타이머 인터럽트로 OS 가 강제로 제어권을 회수할 수 있게 한다.\n\n두 장치는 각각 "보호" 와 "제어 되찾기" 문제를 해결해, OS 가 프로그램을 거의 직접 실행하는 성능을 유지하면서도 안전성·관리 가능성을 확보한다.',
      rubric: [
        'User/Kernel 모드 구분의 목적(보호)',
        'Trap 의 두 역할(system call / timer interrupt)',
        '성능을 크게 해치지 않으면서 안전성 확보',
      ],
    },
    {
      id: 'ch03-essay-2',
      type: 'essay',
      prompt:
        'Timer interrupt 가 도착했을 때부터 다른 프로세스가 실행되기까지(context switch) 전체 과정을 서술하시오.',
      modelAnswer:
        '1) 타이머 하드웨어가 interrupt 를 발생시킨다.\n2) CPU 가 현재 user 프로세스의 레지스터(PC, SP, flags 등) 를 kernel stack 에 저장하고 kernel mode 로 전환한다.\n3) trap table 에서 timer interrupt 에 대응하는 handler 로 점프한다.\n4) OS 는 현재 프로세스의 context 를 PCB 에 저장한다.\n5) 스케줄러가 다음에 실행할 프로세스를 선택한다.\n6) 새 프로세스의 PCB 에서 context 를 복원한다(레지스터, 페이지 테이블 등).\n7) return-from-trap 으로 user mode 에 돌아가면, 새 프로세스가 멈춰 있던 바로 그 지점부터 이어서 실행된다.',
      rubric: [
        '하드웨어 인터럽트 발생',
        '레지스터 저장 → handler 진입',
        'PCB 저장/복원',
        '스케줄러 결정',
        'return-from-trap 으로 새 프로세스 진입',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch03-mc-4',
      type: 'multiple-choice',
      prompt:
        'Trap / Interrupt / Exception 의 발생 원인에 대한 짝이 올바른 것은?',
      options: [
        { text: 'Trap : 외부 하드웨어 / Interrupt : 소프트웨어 / Exception : 0 으로 나누기' },
        { text: 'Trap : 소프트웨어 시스템콜 / Interrupt : 외부 하드웨어 / Exception : 0 으로 나누기 같은 잘못된 연산' },
        { text: 'Trap : 0 으로 나누기 / Interrupt : 시스템콜 / Exception : 타이머' },
        { text: '셋 다 동일한 원인(시스템콜) 에서 발생한다.' },
      ],
      answerIndex: 1,
      explanation:
        'Trap 은 software trap(시스템콜), Interrupt 는 외부 하드웨어, Exception 은 잘못된 연산/접근. 셋 다 kernel 진입점이지만 트리거가 다르다.',
    },
    {
      id: 'ch03-mc-5',
      type: 'multiple-choice',
      prompt:
        '다음 중 반드시 Cooperative 스케줄링 방식의 단점에 해당하지 않는 것은?',
      options: [
        { text: '프로세스가 무한루프에 빠지면 OS 가 제어권을 되찾지 못한다.' },
        { text: '프로세스가 일부러 system call 이나 yield 를 부르지 않으면 다른 프로세스에 CPU 가 가지 않는다.' },
        { text: '매 타이머 인터럽트마다 context switch 가 일어나 오버헤드가 크다.' },
        { text: '버그 있는 프로그램이 시스템 전체의 응답성을 망가뜨릴 수 있다.' },
      ],
      answerIndex: 2,
      explanation:
        '타이머 인터럽트는 non-cooperative 방식의 핵심 도구다. cooperative 에는 해당하지 않는 설명.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch03-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '타이머 인터럽트 핸들러의 뼈대. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'void timer_interrupt(void) {\n    // 1) 커널 스택에 user 레지스터 저장\n    save_regs();\n    // 2) 현재 프로세스 PCB 에 context 저장\n    save_ctx(current);\n    // 3) 스케줄러 호출\n    proc_t *next = ' },
        { kind: 'blank', answers: ['schedule()', 'scheduler()', 'pick_next()'], width: 14 },
        { kind: 'text', text: ';\n    // 4) 새 프로세스 context 복원\n    restore_ctx(next);\n    current = next;\n    // 5) 유저 모드로 복귀\n    ' },
        { kind: 'blank', answers: ['return-from-trap', 'iret', 'return_from_trap'], width: 20 },
        { kind: 'text', text: '();\n}\n' },
      ],
      explanation:
        '저장 → 스케줄 → 복원 → return-from-trap 으로 새 프로세스의 user mode 로 복귀.',
    },

    // ── 추가 : True / False (혼동 포인트) ───────────
    {
      id: 'ch03-tf-5',
      type: 'true-false',
      prompt:
        'System call 은 함수 호출과 동일한 메커니즘이며, 권한 모드 전환 없이도 수행된다.',
      answer: false,
      explanation:
        'system call 은 trap 을 일으켜 kernel mode 로 권한을 상승시킨 뒤 동작한다. 단순 함수 호출이 아니다.',
    },
    {
      id: 'ch03-tf-6',
      type: 'true-false',
      prompt:
        'timer interrupt 핸들러는 user 가 설치할 수 있으며, 사용자 프로그램 안에서도 interrupt 를 끌 수 있다.',
      answer: false,
      explanation:
        'interrupt 핸들러 등록 / 마스킹은 특권 명령이라 user mode 에서 불가능.',
    },
    {
      id: 'ch03-tf-7',
      type: 'true-false',
      prompt:
        'return-from-trap 이 실행되면 kernel mode 에서 저장해 두었던 레지스터들이 복원되고, 사용자 모드로 돌아와 멈춰 있던 지점부터 실행을 이어 간다.',
      answer: true,
    },
    {
      id: 'ch03-tf-8',
      type: 'true-false',
      prompt:
        '타이머 인터럽트는 사용자 프로그램이 실행 중일 때만 발생하며, 커널 코드 실행 중에는 발생하지 않는다.',
      answer: false,
      explanation:
        '타이머는 CPU 에서 주기적으로 발생하는 하드웨어 이벤트이므로 커널 코드 중에도 발생할 수 있다. 단 커널은 중요한 구간에서 interrupt 를 잠시 마스킹하기도 한다.',
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch03-short-3',
      type: 'short-answer',
      prompt:
        'CPU 가 사용자 모드에서 금지된 명령을 만났을 때, 하드웨어가 자동으로 발생시키는 이벤트의 영문 이름은?',
      answers: ['exception', 'Exception', 'EXCEPTION', 'trap'],
      hint: 'Protection fault 와 같은 맥락',
      explanation: 'Exception. 엄밀한 하드웨어 용어로는 "fault/trap/abort" 로 세분화됨.',
    },
    {
      id: 'ch03-short-4',
      type: 'short-answer',
      prompt:
        '현대 x86 리눅스에서 사용자 프로그램이 시스템콜을 호출할 때 사용하는 "빠른 시스템콜 진입" 명령어의 이름은? (x86_64 기준, 영문)',
      answers: ['syscall', 'SYSCALL', 'sysenter', 'SYSENTER'],
      hint: 'x86_64 의 전용 명령어',
      explanation:
        'x86_64 에서는 syscall 명령어가 `int 0x80` 대신 쓰인다 (빠른 진입/복귀).',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch03-essay-3',
      type: 'essay',
      prompt:
        '트랩 메커니즘이 "성능을 거의 희생하지 않으면서" 안전한 가상화를 제공할 수 있는 이유를 Direct Execution 과 비교해 설명하시오.',
      modelAnswer:
        'Direct Execution 은 사용자 프로그램을 그대로 CPU 에서 실행하기 때문에 OS 의 개입이 거의 없고 매우 빠르지만, 프로그램이 원하는 무엇이든 할 수 있어 안전하지 않다.\n\nLimited Direct Execution 은 대부분의 명령을 여전히 사용자 프로세스가 CPU 에서 직접 실행하게 두되, "특권이 필요한 순간" 과 "OS 가 개입해야 하는 순간" 에만 trap 으로 커널에 들어간다.\n- 일반 산술/메모리 접근은 user mode 에서 곧바로 실행 (오버헤드 없음).\n- I/O · 프로세스 생성 · 메모리 할당 같은 특권 작업만 system call trap 으로 kernel 호출.\n- 통제를 놓치지 않으려고 timer interrupt 가 주기적으로 CPU 를 빼앗아 스케줄링.\n\n즉 trap 은 "필요한 순간에만 비용이 드는 스위치" 이기 때문에, 평균적으로는 direct execution 에 가까운 성능을 유지하면서도 안전성·공정성을 확보할 수 있다.',
      rubric: [
        '대부분은 사용자 모드에서 직접 실행된다는 점',
        '특권 작업만 trap 을 통해 커널로 전달',
        '타이머 인터럽트로 제어권 유지',
      ],
    },
  ],
};

export default quiz;
