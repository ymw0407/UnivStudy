import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '01-processes',
  chapterNumber: 1,
  title: 'Processes',
  description: 'CPU 가상화의 출발점 — 프로세스의 구성 요소와 상태 전이를 복습합니다.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch01-mc-1',
      type: 'multiple-choice',
      prompt:
        '프로세스의 주소 공간(Address Space) 구성 요소에 대한 설명 중 옳지 않은 것은?',
      options: [
        { text: 'Code(Text) 영역은 일반적으로 read-only 로 보호된다.' },
        { text: 'Heap 은 런타임에 동적으로 할당되며 주소가 낮은 쪽에서 높은 쪽으로 자란다.' },
        { text: 'Stack 은 함수 호출 시 생성·소멸되며 주소가 높은 쪽에서 낮은 쪽으로 자란다.' },
        { text: 'BSS 영역은 heap 의 일부로, malloc 으로 할당된 객체가 놓인다.' },
      ],
      answerIndex: 3,
      explanation:
        'BSS 는 초기화되지 않은 전역/정적 변수가 놓이는 data 영역의 한 부분이다. malloc 으로 할당된 메모리는 heap 에 들어간다.',
    },
    {
      id: 'ch01-mc-2',
      type: 'multiple-choice',
      prompt:
        '다음 중 프로세스 상태(Running / Ready / Blocked) 전이에 대한 설명으로 옳은 것은?',
      options: [
        { text: 'I/O 요청을 하면 Running → Ready 로 바로 바뀐다.' },
        { text: 'I/O 완료 인터럽트가 오면 Blocked → Ready 로 바뀐다.' },
        { text: 'Blocked 상태에서도 CPU를 점유할 수 있다.' },
        { text: 'Ready → Blocked 는 스케줄러에 의해 일어난다.' },
      ],
      answerIndex: 1,
      explanation:
        'I/O 요청 시 Running → Blocked, I/O 완료 시 Blocked → Ready. Running 은 CPU 를 점유하고 있는 유일한 상태다.',
    },
    {
      id: 'ch01-mc-3',
      type: 'multiple-choice',
      prompt: 'PCB(Process Control Block)에 저장되지 않는 항목은?',
      options: [
        { text: 'Program Counter, Stack Pointer 등 레지스터 상태' },
        { text: '프로세스 상태(Running/Ready/Blocked)' },
        { text: '프로세스가 마지막으로 호출한 printf 의 문자열 내용' },
        { text: '파일 디스크립터 테이블에 대한 포인터' },
      ],
      answerIndex: 2,
      explanation:
        'PCB 는 스케줄링·컨텍스트 스위칭에 필요한 메타데이터(레지스터, 상태, 메모리 매핑, FD 테이블 등)를 담는다. 프로세스의 구체적 데이터 값은 보관하지 않는다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch01-code-1',
      type: 'code-blank',
      language: 'c',
      prompt:
        '다음 코드는 현재 실행 중인 프로세스의 PID 를 출력하고 정상 종료한다. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: '#include <stdio.h>\n#include <unistd.h>\n\nint main(void) {\n    printf("pid = %d\\n", (int) ' },
        { kind: 'blank', answers: ['getpid()', 'getpid'], width: 12 },
        { kind: 'text', text: ');\n    return ' },
        { kind: 'blank', answers: ['0'], width: 4 },
        { kind: 'text', text: ';\n}\n' },
      ],
      explanation:
        'getpid() 로 자기 자신의 PID 를 얻고, main 은 정상 종료 시 0 을 반환한다.',
    },
    {
      id: 'ch01-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        '프로세스의 상태 상수를 정의한 아래 enum 에서 세 가지 핵심 상태를 나타내는 심볼을 채우시오 (대문자 영문).',
      segments: [
        { kind: 'text', text: 'enum proc_state {\n    ' },
        { kind: 'blank', answers: ['RUNNING'], width: 10 },
        { kind: 'text', text: ',   // CPU 점유 중\n    ' },
        { kind: 'blank', answers: ['READY'], width: 10 },
        { kind: 'text', text: ',     // 실행 대기\n    ' },
        { kind: 'blank', answers: ['BLOCKED'], width: 10 },
        { kind: 'text', text: ',   // I/O 등 이벤트 대기\n};\n' },
      ],
      explanation: 'Running / Ready / Blocked 가 프로세스 3-상태 모델의 기본 상태다.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch01-tf-1',
      type: 'true-false',
      prompt: 'Time Sharing 은 하나의 물리 CPU 로 여러 프로세스를 돌리기 위한 기법이며, 잠재적 비용은 각 프로세스 실행 속도 저하이다.',
      answer: true,
      explanation: '성능을 대가로 동시 실행 환상을 제공한다.',
    },
    {
      id: 'ch01-tf-2',
      type: 'true-false',
      prompt: 'Heap 영역이 계속 커져서 Stack 과 충돌하면 Stack Overflow 가 발생한다.',
      answer: false,
      explanation:
        'Stack Overflow 는 재귀 등으로 스택이 과도하게 자랄 때 발생한다. 힙이 스택을 침범하는 상황은 일반적으로 segmentation fault 로 이어진다.',
    },
    {
      id: 'ch01-tf-3',
      type: 'true-false',
      prompt:
        'PCB 는 각 프로세스마다 고유하게 존재하며 커널 공간(kernel space)에 저장된다.',
      answer: true,
      explanation: '사용자 프로그램은 PCB 에 직접 접근할 수 없다.',
    },
    {
      id: 'ch01-tf-4',
      type: 'true-false',
      prompt:
        '프로세스가 argc, argv 같은 commandline argument 를 받는 공간은 heap 의 최하단이다.',
      answer: false,
      explanation: 'argc / argv / 환경변수는 스택 최상단(초기 스택 프레임 영역)에 세팅된다.',
    },

    // ── 단답 ────────────────────────────────────────
    {
      id: 'ch01-short-1',
      type: 'short-answer',
      prompt:
        'Context Switch 시 현재 프로세스의 레지스터 상태를 저장하고 다음 프로세스의 상태를 복원하기 위해 사용되는 자료구조의 이름은? (약어)',
      answers: ['PCB', 'Process Control Block'],
      hint: '예: PCB',
      explanation: 'Process Control Block. xv6 의 struct proc 안의 context 등이 이에 해당한다.',
    },
    {
      id: 'ch01-short-2',
      type: 'short-answer',
      prompt:
        '프로세스가 open, read, write 같은 I/O 를 수행할 때 파일·파이프·장치 등을 가리키는 정수 식별자를 무엇이라고 부르는가? (영문)',
      answers: ['file descriptor', 'fd', 'File Descriptor'],
      hint: '약어 fd 도 허용',
      explanation: 'File Descriptor. 0/1/2 는 stdin/stdout/stderr 에 대응된다.',
    },

    // ── 서술형 ───────────────────────────────────────
    {
      id: 'ch01-essay-1',
      type: 'essay',
      prompt:
        '프로세스가 생성될 때 OS 가 수행하는 절차를 "디스크의 실행 파일 → main() 실행 시작" 까지 순서대로 설명하시오.',
      modelAnswer:
        '1) 디스크의 실행 파일에서 code 와 static data 를 읽어 프로세스의 주소 공간 내 code/data segment 로 로드한다 (최근에는 lazy loading 을 많이 쓴다).\n2) 함수 호출에 필요한 run-time stack 을 준비하고 argc / argv / 환경변수를 채운다.\n3) 동적 할당을 위한 heap 영역을 준비한다.\n4) 기본 파일 디스크립터 0/1/2 (stdin/stdout/stderr) 를 열어 둔다.\n5) 마지막으로 OS 가 CPU 제어권을 프로세스의 main() 엔트리로 넘긴다.',
      rubric: [
        '디스크 → 메모리 로드 단계를 언급',
        'stack / heap 초기화를 분리해서 서술',
        '기본 fd 설정을 언급',
        '마지막에 main 진입 / CPU 제어권 전달 언급',
      ],
    },
    {
      id: 'ch01-essay-2',
      type: 'essay',
      prompt:
        '프로세스의 상태 모델(Running / Ready / Blocked)과 각 전이가 언제 일어나는지를 설명하시오.',
      modelAnswer:
        'Running: CPU 를 실제로 점유하고 실행 중인 상태.\nReady: 실행 준비는 되었으나 CPU 를 할당받지 못해 대기하는 상태.\nBlocked: 어떤 이벤트(주로 I/O 완료)를 기다리는 상태로, CPU 를 점유하지 않는다.\n\n전이:\n- Running → Blocked: 프로세스가 I/O 를 요청하면 발생. 스케줄러는 CPU 를 다른 프로세스에 넘긴다.\n- Blocked → Ready: 대기하던 I/O 가 완료되어 인터럽트가 들어오면, 해당 프로세스는 다시 실행 준비 상태로 돌아간다.\n- Ready → Running: 스케줄러가 해당 프로세스를 선택해 CPU 를 할당할 때.\n- Running → Ready: 타이머 인터럽트 등으로 선점(preemption) 되거나, 스스로 양보(yield)할 때.',
      rubric: [
        '세 상태의 의미를 구분',
        '네 가지 전이(Run↔Ready, Run→Blocked, Blocked→Ready) 모두 언급',
        '전이의 트리거(이벤트)를 서술',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch01-mc-4',
      type: 'multiple-choice',
      prompt:
        '다음 중 "프로그램" 과 "프로세스" 의 차이에 대한 설명으로 가장 정확한 것은?',
      options: [
        { text: '프로그램은 한 번 실행되면 프로세스가 되고, 종료되면 다시 프로그램이 된다.' },
        { text: '프로그램은 디스크에 저장된 정적 바이트 열이고, 프로세스는 그 프로그램을 실행 중인 동적 인스턴스다.' },
        { text: '프로세스는 프로그램의 줄임말이다.' },
        { text: '프로그램과 프로세스는 실행 관점에서는 동일하다.' },
      ],
      answerIndex: 1,
      explanation:
        '프로그램은 수동적 바이트 열(디스크의 ELF/실행파일), 프로세스는 그 프로그램을 실행 중인 능동적 개체(메모리 + 레지스터 + PCB 등).',
    },
    {
      id: 'ch01-mc-5',
      type: 'multiple-choice',
      prompt:
        '다음 중 커널 공간(kernel space) 에 저장되는 것이 아닌 것은?',
      options: [
        { text: 'PCB(Process Control Block)' },
        { text: 'trap table' },
        { text: '프로세스의 heap 에 malloc 으로 할당한 객체' },
        { text: 'file descriptor table' },
      ],
      answerIndex: 2,
      explanation:
        'malloc 으로 할당된 메모리는 프로세스의 user-space heap 이다. PCB·trap table·fd table 등 OS 가 직접 관리하는 자료구조가 kernel space 에 있다.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch01-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '아래 C 프로그램에서 각 심볼이 놓일 영역을 채우시오 (text/data/bss/heap/stack 중 하나).',
      segments: [
        { kind: 'text', text: 'int g_init = 5;      // ' },
        { kind: 'blank', answers: ['data'], width: 6 },
        { kind: 'text', text: '\nint g_uninit;        // ' },
        { kind: 'blank', answers: ['bss'], width: 6 },
        { kind: 'text', text: '\nconst char *msg      // .rodata / text 계열\n    = "hi";\n\nvoid foo(void) { // 코드는 ' },
        { kind: 'blank', answers: ['text', 'code'], width: 6 },
        { kind: 'text', text: '\n    int tmp = 1;   // ' },
        { kind: 'blank', answers: ['stack'], width: 6 },
        { kind: 'text', text: '\n    int *p = malloc(4); // ' },
        { kind: 'blank', answers: ['heap'], width: 6 },
        { kind: 'text', text: ';\n}\n' },
      ],
      explanation:
        '초기화 전역 → data, 미초기화 전역 → bss, 실행 코드 → text, 지역 변수 → stack, malloc → heap.',
    },

    // ── 추가 : True / False (혼동 포인트 다수) ───────
    {
      id: 'ch01-tf-5',
      type: 'true-false',
      prompt:
        'Running 상태와 Ready 상태는 모두 "CPU 를 점유하고 있다" 는 공통점이 있다.',
      answer: false,
      explanation: 'Ready 는 실행 준비만 되어 있을 뿐, CPU 는 Running 프로세스 하나만 점유한다.',
    },
    {
      id: 'ch01-tf-6',
      type: 'true-false',
      prompt:
        'BSS 영역은 로더가 0 으로 초기화해 주므로, C 에서 전역 int 변수를 따로 초기화하지 않아도 0 으로 시작하는 것이 보장된다.',
      answer: true,
      explanation:
        'C 표준도 static/extern 의 기본값 0 을 보장하며, 구현상 BSS 가 이 역할을 한다.',
    },
    {
      id: 'ch01-tf-7',
      type: 'true-false',
      prompt:
        'argv 와 환경변수(envp) 는 heap 의 최하단에 순서대로 배치된다.',
      answer: false,
      explanation: '초기 스택 프레임(스택 최상단) 에 배치된다. heap 과는 관계가 없다.',
    },
    {
      id: 'ch01-tf-8',
      type: 'true-false',
      prompt:
        'xv6 의 register context 는 함수 호출 규약상 "호출자가 보존할 레지스터" 만 저장하면 충분하다.',
      answer: false,
      explanation:
        '스케줄러가 강제로 중단했을 수 있으므로 callee-saved 가 아닌 "다시 돌아와 이어서 실행" 에 필요한 모든 상태(PC, SP 등)를 저장해야 한다.',
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch01-short-3',
      type: 'short-answer',
      prompt:
        '스택 영역이 자라는 방향은 "높은 주소 → 낮은 주소" 와 "낮은 주소 → 높은 주소" 중 어느 쪽인가? (화살표 방향을 text 로)',
      answers: ['높은 주소 → 낮은 주소', '높→낮', '높은→낮은', 'high to low', '하단으로 자람'],
      hint: '"높은 주소 → 낮은 주소" 처럼',
      explanation: '일반적인 x86/ARM 에서 스택은 높은 주소에서 낮은 주소 방향으로 자란다.',
    },
    {
      id: 'ch01-short-4',
      type: 'short-answer',
      prompt:
        '프로세스 상태가 "Running → ? → Ready" 의 순서로 I/O 대기를 거쳐 다시 실행 준비 상태로 돌아올 때, 중간의 상태 이름은?',
      answers: ['Blocked', 'blocked', 'BLOCKED', 'Waiting'],
      explanation: 'I/O 같은 이벤트를 기다릴 때는 Blocked(또는 Waiting) 상태.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch01-essay-3',
      type: 'essay',
      prompt:
        'OS 가 "CPU 가상화" 라는 환상을 제공하기 위해 하는 두 가지 핵심 작업(Time Sharing, Context Switch)을 설명하고, 그 비용을 논하시오.',
      modelAnswer:
        'Time Sharing: OS 는 CPU 를 짧은 시간 조각(time slice) 으로 잘라 여러 프로세스에 번갈아 할당한다. 각 프로세스는 "내가 CPU 를 계속 쓰고 있다" 는 환상을 갖는다.\n\nContext Switch: 실행 프로세스를 바꿀 때 OS 는 현재 프로세스의 레지스터 상태(PC, SP, 일반 레지스터, 모드 비트 등)를 PCB 에 저장하고, 다음 프로세스의 PCB 에서 그 상태를 복원한다. 필요하면 페이지 테이블 포인터(CR3 등)도 바꾼다.\n\n비용:\n- 직접 비용: 레지스터 저장·복원, 권한 모드 전환 (수 μs 수준).\n- 간접 비용: 캐시 · TLB 오염으로 전환 직후 miss 가 증가, 파이프라인 재충전 등. 실제로는 직접 비용보다 간접 비용이 더 큰 경우가 많다.\n- 따라서 time slice 를 너무 짧게 하면 전환 비용이 실질 처리량을 먹어버리므로, 반응성과 오버헤드 사이의 균형이 필요하다.',
      rubric: [
        'Time sharing / Context switch 개념 구분',
        '직접 비용 언급',
        '간접 비용(cache/TLB 오염) 언급',
        'time slice 선택과 트레이드오프',
      ],
    },
  ],
};

export default quiz;
