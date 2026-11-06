import type { QuizSet } from './types';

const quiz: QuizSet = {
  slug: '02-process-api',
  chapterNumber: 2,
  title: 'Process API',
  description: 'fork / wait / exec / pipe 의 시맨틱과 호출 순서를 점검합니다.',
  questions: [
    // ── 객관식 ─────────────────────────────────────────
    {
      id: 'ch02-mc-1',
      type: 'multiple-choice',
      prompt: 'fork() 의 반환값에 대한 설명 중 옳은 것은?',
      options: [
        { text: '부모와 자식 모두 0 을 반환받는다.' },
        { text: '부모는 자식의 PID 를, 자식은 0 을 반환받는다.' },
        { text: '부모는 0 을, 자식은 부모의 PID 를 반환받는다.' },
        { text: '부모와 자식 모두 자신의 PID 를 반환받는다.' },
      ],
      answerIndex: 1,
      explanation:
        '부모 입장에서는 어떤 자식을 만들었는지 알아야 하므로 자식 PID 가, 자식은 "나는 자식이다" 표지로 0 이 돌아간다.',
    },
    {
      id: 'ch02-mc-2',
      type: 'multiple-choice',
      prompt: 'exec() 계열 호출에 대한 설명으로 옳은 것은?',
      options: [
        { text: '성공 시 자식 프로세스가 하나 새로 생성되고 부모로 복귀한다.' },
        { text: '현재 프로세스의 메모리 내용을 새 실행 파일의 내용으로 덮어쓰며, 성공 시 돌아오지 않는다.' },
        { text: 'fork 와 동일하게 호출한 프로세스 다음 줄부터 두 번 실행된다.' },
        { text: '파일 디스크립터 테이블을 모두 초기화한다.' },
      ],
      answerIndex: 1,
      explanation:
        'exec 는 기존 주소 공간(code/data/heap/stack) 을 새 바이너리로 전부 교체한다. 성공 시 반환되지 않으며, fd 테이블은 기본적으로 유지된다.',
    },
    {
      id: 'ch02-mc-3',
      type: 'multiple-choice',
      prompt:
        '셸이 `wc w3.c > newfile.txt` 를 실행할 때의 단계 중 "자식 프로세스에서" 일어나는 일이 아닌 것은?',
      options: [
        { text: 'close(STDOUT_FILENO) 로 1 번 fd 를 닫는다.' },
        { text: 'open("newfile.txt") 로 새 파일을 연다 (가장 작은 빈 fd 인 1 에 연결된다).' },
        { text: 'fork() 로 또 다른 자식을 만든다.' },
        { text: 'execvp("wc", ...) 로 wc 프로그램을 실행한다.' },
      ],
      answerIndex: 2,
      explanation:
        '셸이 fork 로 자식을 만든 뒤, 자식이 fd 재배치 후 exec 을 호출한다. 자식이 또다시 fork 를 부르지는 않는다.',
    },

    // ── 코드 빈칸 ─────────────────────────────────────
    {
      id: 'ch02-code-1',
      type: 'code-blank',
      language: 'c',
      prompt: 'fork 의 3 분기 패턴을 완성하시오. 자식 판별은 반환값으로 한다.',
      segments: [
        { kind: 'text', text: 'int rc = fork();\nif (rc ' },
        { kind: 'blank', answers: ['<'], width: 3 },
        { kind: 'text', text: ' 0) {\n    // fork failed\n    exit(1);\n} else if (rc ' },
        { kind: 'blank', answers: ['=='], width: 3 },
        { kind: 'text', text: ' 0) {\n    // child\n    printf("child pid=%d\\n", (int) getpid());\n} else {\n    // parent\n    wait(' },
        { kind: 'blank', answers: ['NULL', '0'], width: 6 },
        { kind: 'text', text: ');\n    printf("parent of %d\\n", rc);\n}\n' },
      ],
      explanation:
        'fork 반환값: <0 실패, ==0 자식, >0 부모(자식 PID). wait(NULL) 은 임의 자식이 끝날 때까지 블록한다.',
    },
    {
      id: 'ch02-code-2',
      type: 'code-blank',
      language: 'c',
      prompt:
        '`ls | wc -l` 처럼 두 프로세스를 파이프로 연결하는 뼈대다. 자식 쪽 재배치 코드를 완성하시오.',
      segments: [
        { kind: 'text', text: 'int p[2];\npipe(p);\nif (fork() == 0) {\n    // 왼쪽(ls) - 쓰기 쪽을 stdout 으로 리다이렉트\n    close(' },
        { kind: 'blank', answers: ['1', 'STDOUT_FILENO'], width: 14 },
        { kind: 'text', text: ');\n    dup(p[' },
        { kind: 'blank', answers: ['1'], width: 3 },
        { kind: 'text', text: ']);        // write end\n    close(p[0]);\n    close(p[1]);\n    execvp("ls", ...);\n}\nif (fork() == 0) {\n    // 오른쪽(wc) - 읽기 쪽을 stdin 으로\n    close(' },
        { kind: 'blank', answers: ['0', 'STDIN_FILENO'], width: 14 },
        { kind: 'text', text: ');\n    dup(p[' },
        { kind: 'blank', answers: ['0'], width: 3 },
        { kind: 'text', text: ']);        // read end\n    close(p[0]);\n    close(p[1]);\n    execvp("wc", ...);\n}\n' },
      ],
      explanation:
        'pipe 의 p[0] = read, p[1] = write. 각 자식은 필요한 방향을 stdin/stdout 에 맞춘 뒤 나머지 두 fd 를 닫고 exec 한다.',
    },

    // ── True / False ─────────────────────────────────
    {
      id: 'ch02-tf-1',
      type: 'true-false',
      prompt:
        'fork 직후 부모와 자식은 같은 주소 공간을 공유하므로, 한쪽이 전역변수 값을 바꾸면 다른 쪽에도 반영된다.',
      answer: false,
      explanation:
        '초기 내용은 동일하지만, 독립적인 주소 공간을 가진다. 한쪽의 변경이 다른 쪽에 보이지 않는다.',
    },
    {
      id: 'ch02-tf-2',
      type: 'true-false',
      prompt:
        'fork 만으로는 부모/자식의 실행 순서가 결정되지 않아 비결정적(non-deterministic) 이며, wait 를 쓰면 "자식 종료 후 부모" 순서를 보장할 수 있다.',
      answer: true,
      explanation:
        'wait 은 자식 종료를 동기화한다.',
    },
    {
      id: 'ch02-tf-3',
      type: 'true-false',
      prompt:
        'execvp 가 성공해도 그 다음 줄의 printf 는 실행된다.',
      answer: false,
      explanation:
        'exec 는 성공 시 돌아오지 않으므로 뒤의 코드는 실행되지 않는다.',
    },
    {
      id: 'ch02-tf-4',
      type: 'true-false',
      prompt:
        'fork 와 exec 이 분리되어 있는 덕분에, 자식에서 fd 재배치 · 환경 설정 후 새 프로그램으로 교체할 수 있고 이것이 I/O redirection / pipe 구현의 근간이 된다.',
      answer: true,
    },

    // ── 단답 ───────────────────────────────────────
    {
      id: 'ch02-short-1',
      type: 'short-answer',
      prompt:
        'open / close / read / write 시 파일·파이프·장치를 가리키는 정수 인덱스를 무엇이라 부르는가? (한글 또는 영어)',
      answers: ['파일 디스크립터', 'file descriptor', '파일디스크립터', 'fd'],
      explanation: '파일 디스크립터(File Descriptor). 프로세스별 테이블로 관리된다.',
    },
    {
      id: 'ch02-short-2',
      type: 'short-answer',
      prompt:
        '리눅스에서 `pipe(p)` 를 호출했을 때, p[0] 과 p[1] 중 "읽기" 쪽은 어느 인덱스인가? (숫자만 입력)',
      answers: ['0', 'p[0]'],
      explanation: 'p[0] = read end, p[1] = write end.',
    },

    // ── 서술형 ────────────────────────────────────────
    {
      id: 'ch02-essay-1',
      type: 'essay',
      prompt:
        'fork 와 exec 이 한 번에 처리되지 않고 두 단계로 분리되어 있는 이유를 I/O redirection 예시를 들어 설명하시오.',
      modelAnswer:
        '분리의 이점은 "새 프로그램을 실행하기 직전에 프로세스의 실행 환경(특히 파일 디스크립터 테이블) 을 마음대로 조작할 수 있다" 는 점에 있다.\n\n예를 들어 `wc file.c > out.txt` 를 실행할 때 셸은:\n1) fork 로 자식을 만든다.\n2) 자식에서 close(1) 로 stdout 을 닫고, open("out.txt") 한다. 가장 작은 빈 fd 인 1 번에 새 파일이 연결된다.\n3) 이어서 execvp("wc", ...) 를 호출한다. 기존 code/data/stack/heap 은 wc 로 교체되지만, fd 테이블은 exec 에서도 유지되므로 wc 가 printf 로 쓰는 stdout 이 자동으로 out.txt 로 향하게 된다.\n\n만약 spawn 형태로 fork+exec 이 한 번에 결합되어 있었다면 이런 "exec 직전 환경 조작" 이 어려워 파이프·리다이렉션을 우아하게 구현하기 힘들다.',
      rubric: [
        '분리의 핵심: exec 직전에 환경 조작 가능',
        'I/O redirection 단계별 예시',
        'exec 이 fd 테이블을 유지한다는 사실 언급',
      ],
    },
    {
      id: 'ch02-essay-2',
      type: 'essay',
      prompt:
        '`echo hello | wc` 를 셸이 처리할 때 발생하는 주요 시스템콜을 순서대로 나열하고, 각 단계에서 파일 디스크립터 테이블이 어떻게 바뀌는지 설명하시오.',
      modelAnswer:
        '1) pipe(p) — 두 개의 fd (예: 3=read, 4=write) 가 부모 테이블에 추가된다.\n2) fork 로 자식 1 (echo 쪽) 생성. fd 테이블이 복제된다.\n3) 자식 1 에서 close(1); dup(p[1]); close(p[0]); close(p[1]); execvp("echo", ...). 이로써 echo 의 stdout(1) 이 파이프 쓰기 쪽을 가리키게 된다.\n4) fork 로 자식 2 (wc 쪽) 생성.\n5) 자식 2 에서 close(0); dup(p[0]); close(p[0]); close(p[1]); execvp("wc", ...). wc 의 stdin(0) 이 파이프 읽기 쪽을 가리키게 된다.\n6) 부모는 양쪽 파이프 fd 를 close 하고 두 자식을 wait 한다.\n\necho 가 stdout 에 쓴 데이터가 파이프를 통해 wc 의 stdin 으로 그대로 흘러 들어가게 된다.',
      rubric: [
        'pipe / fork / close-dup-close / exec / wait 흐름',
        'p[0]=read, p[1]=write 방향 구분',
        '각 프로세스에서 불필요한 파이프 끝을 닫아야 함을 언급',
      ],
    },

    // ── 추가 : 객관식 (혼동 포인트) ─────────────────────
    {
      id: 'ch02-mc-4',
      type: 'multiple-choice',
      prompt:
        '다음 중 "fork 직후 부모와 자식이 공유하는" 것은?',
      options: [
        { text: 'heap 의 실제 데이터 바이트' },
        { text: '스택 프레임의 지역 변수' },
        { text: 'open 된 file 객체(같은 offset 을 공유)' },
        { text: 'PID' },
      ],
      answerIndex: 2,
      explanation:
        'fork 는 fd 테이블을 "복제" 하지만, 두 테이블 엔트리가 같은 커널 내 file 객체를 가리키므로 read/write 시 offset 이 공유된다. heap/stack 의 실제 내용은 독립적, PID 는 다르다.',
    },
    {
      id: 'ch02-mc-5',
      type: 'multiple-choice',
      prompt:
        '자식이 먼저 종료되었는데 부모가 wait() 하지 않아 정리되지 못한 상태의 프로세스를 무엇이라 하는가?',
      options: [
        { text: 'Orphan process' },
        { text: 'Zombie process' },
        { text: 'Daemon process' },
        { text: 'Idle process' },
      ],
      answerIndex: 1,
      explanation:
        'Zombie: 이미 종료되었지만 PCB 가 남아 있는 상태. Orphan 은 반대로 부모가 먼저 죽은 경우.',
    },

    // ── 추가 : 코드 빈칸 ─────────────────────────────
    {
      id: 'ch02-code-3',
      type: 'code-blank',
      language: 'c',
      prompt:
        '표준 출력을 파일로 리다이렉션하는 과정이다. 빈칸을 채우시오.',
      segments: [
        { kind: 'text', text: 'int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);\n// stdout(1) 을 닫고 → fd 를 1 에 복제 → fd 는 정리\nclose(' },
        { kind: 'blank', answers: ['1', 'STDOUT_FILENO'], width: 14 },
        { kind: 'text', text: ');\ndup2(fd, ' },
        { kind: 'blank', answers: ['1', 'STDOUT_FILENO'], width: 14 },
        { kind: 'text', text: ');\nclose(fd);\n// 이후 printf 는 out.txt 로 향한다\n' },
      ],
      explanation:
        'dup2(src, dst) 는 src 를 dst 번호에 복제. src 를 1 에 복제해 stdout 을 새 대상으로 바꾼 뒤 원본 fd 는 닫는다.',
    },

    // ── 추가 : True / False ───────────────────────
    {
      id: 'ch02-tf-5',
      type: 'true-false',
      prompt:
        'exec 성공 후에도 프로세스의 PID 는 유지된다.',
      answer: true,
      explanation:
        'exec 은 "프로세스" 를 새로 만들지 않는다 — 같은 프로세스의 메모리 이미지만 교체되므로 PID 는 그대로.',
    },
    {
      id: 'ch02-tf-6',
      type: 'true-false',
      prompt:
        'exec 은 기본적으로 열려 있던 file descriptor 를 모두 닫는다.',
      answer: false,
      explanation:
        '기본적으로 fd 테이블은 유지된다. 닫히게 하려면 FD_CLOEXEC 플래그를 설정해야 한다.',
    },
    {
      id: 'ch02-tf-7',
      type: 'true-false',
      prompt:
        'fork() 에서 부모와 자식이 "fork 다음 줄부터" 이어 실행되는 이유는, 두 프로세스가 같은 PC 값과 각자의 스택·레지스터를 가지고 리턴 이후 분기하기 때문이다.',
      answer: true,
    },
    {
      id: 'ch02-tf-8',
      type: 'true-false',
      prompt:
        'pipe 는 같은 시스템 안의 "부모-자식" 관계가 아닌 두 임의 프로세스 사이에서도 자동으로 동작한다.',
      answer: false,
      explanation:
        '일반 pipe 는 fork 로 fd 를 상속해야 통신할 수 있다. 임의 두 프로세스 간 통신은 named pipe(FIFO), socket 등이 필요.',
    },

    // ── 추가 : 단답 ───────────────────────────────
    {
      id: 'ch02-short-3',
      type: 'short-answer',
      prompt:
        '자식 프로세스를 만들고 같은 프로세스 안에서 새 프로그램으로 완전히 덮어쓰려 할 때 일반적으로 호출하는 두 시스템콜 이름을 순서대로 쓰시오. (영문, 쉼표 구분)',
      answers: ['fork, exec', 'fork,exec', 'fork, execvp', 'fork, execve'],
      explanation:
        'fork 로 자식 생성 → 자식에서 exec 으로 프로그램 교체.',
    },
    {
      id: 'ch02-short-4',
      type: 'short-answer',
      prompt:
        'execvp 가 정상 실행되면 반환값은 무엇인가? (숫자/문자열, 또는 "돌아오지 않음")',
      answers: ['돌아오지 않음', '반환하지 않음', 'does not return', 'no return', '반환안함'],
      hint: '성공 시에는 다음 줄이 실행되지 않는다',
      explanation:
        'exec 성공 시에는 반환이 없고, 실패 시에만 -1 이 반환된다.',
    },

    // ── 추가 : 서술형 ─────────────────────────────
    {
      id: 'ch02-essay-3',
      type: 'essay',
      prompt:
        'Zombie 와 Orphan 프로세스를 정의하고, 각각 시스템이 어떻게 처리하는지 설명하시오.',
      modelAnswer:
        'Zombie: 자식이 먼저 종료되었지만 부모가 아직 wait() 을 호출하지 않은 상태. 프로세스의 대부분의 자원(메모리 등) 은 회수되지만, 종료 상태 코드를 부모에게 전달하기 위해 PCB 는 남아 있다. 부모가 wait/waitpid 를 호출하면 PCB 가 제거되고 완전히 사라진다. 만약 부모가 wait 을 하지 않으면 좀비가 누적되어 PID 고갈 같은 문제가 생길 수 있다.\n\nOrphan: 부모가 자식보다 먼저 종료된 상태. 이 경우 리눅스에서는 init (PID 1, 또는 systemd/subreaper) 이 해당 프로세스를 자동으로 입양해 wait 을 대신 해 준다. 따라서 orphan 은 보통 정상적으로 정리된다.',
      rubric: [
        'Zombie 의 정의와 발생 원인',
        'wait/waitpid 로 정리된다는 점',
        'Orphan 의 정의와 init 입양',
      ],
    },
  ],
};

export default quiz;
