# Processes

## CPU의 가상화
OS는 여러 개의 가상 CPU가 존재하는 것처럼 보이도록 할 수 있다.
- Time Sharing
	- 잠재적인 비용은 성능 저하
	- 각 process는 느려짐

## Process
프로세스는 다음으로 이뤄져있다.

### Memory(address space)
- Intsructaions (Code Segment/Text Segment, 프로그램 명령어)
	- 개발자가 작성한 소스코드가 기계어로 저장되는 공간
	- Read Only 상태로 보호됨
- Data Segment
	- global variable이나 static variable이 저장
	- 초기화된 변수는 Data 영역, 초기화되지 않은 변수는 BSS 영역
- Heap
	- 프로그래머가 실행 중에 동적으로 할당하는 메모리 공간 (Dynamical memory Allocation)
	- 런타임에 크기가 결정, 사용 후 헤제하지 않으면 메모리 주수 발생
	- 메모리 주소 하단에서 상단으로 확장
- Stack
	- 함수의 local variable, argument, return address 등이 임시로 저장된다.
	- 함수 호출 시 생성되고 종료 시 자동으로 소멸한다.
	- LIFO 구조
	- 메모리 상단에서 하단으로 확장
	- argc, argv, environment variable도 여기 최상단에 생성

> 재귀 호출을 지나치게 깊게 하면? -> 스택이 너무 커지고 -> stack overflow가 발생

> heap space가 너무 비대해짐 -> stack을 침범하면 -> segmentaion fault 발생

![[Pasted image 20260415094925.png]]

### Registers
- Program Counter(PC)
	- 현재 어느 명령어를 실행 중인지
- Stack Pointer(SP)
	- 현재 어느 스택의 위치에 있는지

### File Descriptors
- Process가 사용하는 파일, 소캣, 입출력 장치 등

## Process Creation
1. OS가 디스크에 있던 실행 파일의 Code와 Static data를 Code Segment와 Data Segement에 각각 load하여 프로세스의 address space에 배치
	- 프로그램은 처음에 executable format으로 디스크에 저장
	- 초기에는 데이터를 로딩하는 과정이 eagerly하게 수행
		- -> 현대에는 데이터를 lazily하게 로딩을 수행
2. 함수 호출에 필요한 정보를 저장할 run-time stack을 준비한다.
	- 이때 argc, argv 같은 commandline argument도 들어간다.
	- argc, argv -> return address -> local varriable -> ...
3. 동적 할당을 위한 heap을 준비한다.
4. 기본적인 입출력 설정을 위한, 파일 디스크립터 개방
	- stdin(0)
	- stdout(1)
	- stderr(2)
5. 프로그램의 시작인 main()부터 실행
	- OS는 CPU의 제어권을 프로세스에게 넘긴다.
		- -> Direct Execution

## Process States
- Running
	- 현재 CPU를 점유하고 실행 중인 상태
- Ready
	- 실행할 준비는 되었으나 CPU를 할당받지 못한 상태
- Blocked
	- 어떤 이벤트를 기다리는 상태
	- 예) I/O 작업을 기다리는 상태

Running하다가 / I/O 요청을 기다리면 Blocked으로 넘어갔다가 / I/O 끝나면 Ready / CPU 할당 받으면,  Running ...

-> 이렇게 CPU를 누구에게 줄지 결정하는 것이 Scheduler

## Data Structures
Context Switch시 
- 현재 프로세스의 레지스터를 저장하고
- 다음 프로세스의 레지스터를 복원해야함
이때 이러한 정보를 저장하는 대표적인 자료구조가 PCB(Process Control Block)이다.

- 이러한 PCB는 Kernel Space, 즉 DRAM에 저장
- 각각의 프로세스는 각각의 고유한 PCB를 갖고 있음
- PCB는 Kernel Space의 Process Specific Data Structures에 포함

![[Pasted image 20260415103148.png]]

**xv6 register context**

- 프로세스를 나중에 다시 실행하기 위해 저장하는 CPU 레지스터 묶음
- `eip`(PC), `esp`(SP), 일반 레지스터들로 구성
- `proc` 구조체 안에 저장됨
- context switch 때 현재 프로세스의 context를 저장하고 다음 프로세스의 context를 복원함
- 그래서 CPU는 다른 프로세스로 자연스럽게 넘어갈 수 있음

한 줄로 말하면,  
**register context는 “프로세스의 실행 지점과 CPU 작업 상태를 저장한 스냅샷”**

---
# Process API
## fork
> 자식 프로세스(child process)를 만드는 시스템 콜

child process는 parent process로부터 만들어지지만, **독립된 프로세스**이다.
- 독립적 메모리 공간
- 자체적인 레지스터 상태
	- -> 자체적인 프로그램 카운터 / 스택 포인터...

fork()시
- parent process
	- child process의 pid 반환
- child process
	- 0을 반환
- 메모리 과점
	- 부모 프로세스가 가진 주소 공간과 동일한 내용이 자식에게 복사됨
		- -> code segment, data segment, heap, stack이 동일한 상태로 자식 프로세스에도 생성
	- 하지만, 독립된 프로세스이기 때문에 PID가 다름
	- 부모와 자식의 메모리 내용은 처음에만 같지, 그 이후에는 각자 독립적으로 실행되고 변화 가능
- fork() 직후
	- 부모 프로세스는 원래 자기 메모리 공간을 유지한다.
	- 자식 프로세스는 부모의 메모리 내용을 복사한 새로운 주소 공간을 가진다.
	- 부모와 자식은 서로 다른 PID를 가진다.
	- 둘 다 `fork()` 이후의 코드부터 계속 실행한다.
	
```c
printf("hello world (pid:%d)\n", (int) getpid());  
int rc = fork();  
  
if (rc < 0) {  
	fprintf(stderr, "fork failed\n");  
	exit(1);  
} else if (rc == 0) {  
	printf("hello, I am child (pid:%d)\n", (int) getpid());  
} else {  
	printf("hello, I am parent of %d (pid:%d)\n", rc, (int) getpid());  
}
```


> “둘 다 같은 코드이고, 같은 프로그램 카운터 위치를 보고 있다면 자식이 또 다시 `fork()` 를 하는 것 아닌가?”라는 질문이 나올 수 있습니다. 
> 실제로는 우리가 C 코드 한 줄로 보고 있는 `rc = fork();` 가 내부적으로는 여러 개의 명령어로 나뉘어 실행됩니다.
>  먼저 `fork()` 자체가 수행되고, 그 결과값이 각 프로세스의 `rc` 변수에 저장됩니다. 그러므로 부모는 `rc` 에 자식 PID를 넣고, 자식은 `rc` 에 0을 넣은 뒤, 그다음 분기문으로 넘어가게 됩니다.

### fork의 Nondeterministic
부모와 자식 중에 누가 먼저 실행 될까?
-> 모른다.

이것은 스케줄링 정책과 당시 시스템 상황에 따라 달라짐.
- 어떤 실행에서는 부모가 먼저 출력
- 다른 실행에서는 자식이 먼저 출력
-> Nondeterministic함.

## wait()
child process가 parent process보다 먼저 종료되어야 하는 경우가 있음
-> 이를 위해 wait()을 사용

> child process가 생성되면, parent process의 wait()은 child process가 실행되고 종료될 때까지 반환되지 않음.


```c
printf("hello world (pid:%d)\n", (int) getpid());  
int rc = fork();  
  
if (rc < 0) {  
	fprintf(stderr, "fork failed\n");  
	exit(1);  
} else if (rc == 0) {  
	printf("hello, I am child (pid:%d)\n", (int) getpid());  
} else {  
	int wc = wait(NULL); // 이 systemcall을 통해 child process가 종료될 때까지 대기.
	printf("hello, I am parent of %d (pid:%d)\n", rc, (int) getpid());  
}
```


-> Deterministic 해짐.

## exec()
> 현재 프로세스를 새로운 프로그램으로 덮어써서 실행하는 시스템 콜

일반적으로 fork() 후 자식 프로세스가 자기 자신을 새로운 프로그램로 바꾸는 데 많이 사용

```c
char *myargs[3];
myargs[0] = strdup("wc"); // binary file 이름
myargs[1] = strdup("p3.c"); // array of argument
myargs[2] = NULL;
execvp(myargs[0], myargs); 
printf("this shouldn't print out"); // 실행되지 않음
```

child process를 parent process와는 다른, wc p3.c라는 새로운 프로그램으로 바꿈.

> 중요한 점은 `exec()` 가 호출되면, 기존 메모리 내용은 새로운 실행 파일의 내용으로 대체된다는 것입니다.

-> code segment, data segment, stack, heap 모두 새 프로그램 기준으로 다시 구성
-> exec()시 원래 프로그램으로 못 돌아옴.
-> 기존 메모리의 내용을 새로운 binary file의 메모리 내용으로 대체하기 때문에 exec()는 반환되지 않는다

- `fork()` 는 새 프로세스를 만든다.
- `exec()` 는 현재 프로세스를 다른 프로그램으로 바꾼다.

> 하지만, parent process가 wait을 하고 있다면
> exec를 하더라도 자식 프로세스가 종료되어야지
>  parent process도 종료

## fork()와 exec()는 왜 분리되어 있음?

> 새 프로그램을 실행하기 직전에 여러 설정을 조작할 수 있게 하기 위해서

- I/O redirection
- pipe

1. `fork()` 로 자식 생성
2. 자식 쪽에서 파일 디스크립터 조작 -> 이 과정을 위해 fork와 exec을 분리
3. 그 뒤 `exec()` 로 새 프로그램 실행

## File Descriptor & File Descriptor Table

> 파일 디스크립터는 **파일, 디렉터리, 장치, 파이프 등을 가리키는 정수**

File, Pipe, Directory, Device

- 각 프로세스는 자기만의 file descriptor table을 갖고 있음.
- 해당 테이블을 통해 열린 파일이나 표준 입출력 대상을 관리


- 0번은 **standard input**
- 1번은 **standard output**
- 2번은 **standard error**

1. open() 시스템콜을 호출
2. 가장 작은 사용 가능한 file descriptor 번호를 찾아 새 file object를 연결한다.
- ex) 0,1,2 표준 입출력이 있고, 그 다음이 비어있다.
- -> open()은 3을 반환하게 됨.

1. close(fd) 시스템콜을 호출
2. 해당 파일디스크립터는 닫힘
3. 만약, 연결되어있던 file object가 더 이상 연결된게 없다면 file object도 제거

- `fork()` 는 부모의 file descriptor table을 자식에게 복사한다.
- `exec()` 는 file descriptor table을 **유지** 한다.


## I/O redirection

wc w3.c > newfile.txt

위 명령이 쉘에서 실행되는 과정

1. 쉘이 fork()를 하여 자식 프로세스를 만든다.
2. 자식 프로세스에서 close(STDOUT_FILENO)를 한다.
	1. 표준출력(1번 fd)을 닫는다.
3. 자식 프로세스에서 open("newfile.txt")를 한다.
	1. newfile.txt의 파일 오브젝트를 열고,
	2. 가장 작은 빈 file descriptor, 즉 원래 stdout이 있던 1번 자리에 연결된다.
4. 자식 프로세스에서 execvp("wc", ["wc", "w3.c", NULL])를 한다.
5. exec 이후 실행된 wc 프로그램이 w3.c를 연다.
	1. 이 open은 쉘이 아니라 wc가 한다.
6. wc가 w3.c의 워드 카운트를 수행한다.
7. wc가 stdout으로 결과를 출력한다.
	1. 하지만 stdout은 이미 newfile.txt에 연결되어 있으므로 결과가 파일에 저장된다.


> 여기서 fork()시 부모의 File Descriptor Table을 복제하는데, 이때 File Object는 같이 복제되는 것이 아니라 부모와 자식 프로세스가 같은 파일 오브젝트를 가리키고 있다이다.

## dup()

- `dup(fd)` 는 주어진 file descriptor가 가리키는 **같은 파일 객체를**, 가장 작은 빈 descriptor 번호에 다시 연결합니다.
- 즉, “같은 파일을 가리키는 새로운 별칭”을 하나 더 만드는 것에 가깝습니다.

## pipe()

- `pipe(p)` 를 호출하면 보통 두 개의 file descriptor가 생깁니다.

	- `p[0]`: 읽기(read) 쪽 3번
	- `p[1]`: 쓰기(write) 쪽 4번




echo hello world | wc`
쉘에서 해당 명령어를 실행했을 때 어떤 시스템콜들이 어떤 순서로 일어날까?!

1. fork()를 하여 자식 프로세스를 만든다.
2. pipe() / 0 - stdin / 1 - stdout / 2 - stderr / 3 - pipe read / 4 - pipe write
	1. 파이프를 하여, 파이프를 만들고, p[0]-read과 p[1]-write를 file descriptor table에 등록한다.
	2. 각각 3번과 4번에 p[0]와 p[1]이 생겼다고 가정하자.
3. fork() 
	- 자식 / 0 - stdin / 1 - stdout / 2 - stderr / 3 - pipe read / 4 - pipe write
		1. close(0) /  1 - stdout / 2 - stderr / 3 - pipe read / 4 - pipe write
		2. dup(p[0]) 가장 작은것부터 연결을 하니까.. 0에 연결이 될거란 말이야 어디로? p[0]-(3번)으로.
				/ 0 - pipe read /  1 - stdout / 2 - stderr / 3 - pipe read / 4 - pipe write
		3. close(p[0])
		4. close(p[1])
				/ 0 - pipe read /  1 - stdout / 2 - stderr
		5. execvp("wc")
	
	- 부모 / 0 - stdin / 1 - stdout / 2 - stderr / 3 - pipe read / 4 - pipe write
		1. close(1) / 0 - stdin / 2 - stderr / 3 - pipe read / 4 - pipe write
		2. write(p[1], "hello world\n")
		3. close


---
# Limited Direct Execution

OS는 time sharing을 통해 physical CPU를 공유해야 함.
- performance
	- 과도한 시스템 오버헤드를 추가 하지 않고 가상화 구현법
- control
	- CPU에 대한 제어를 유지하면서 프로세스를 효율적으로 실행하는법

## Direct Execution - 그냥 프로그램을 CPU에 직접 올려 실행하면 안 되는가?

> Process가 Direct Execution시
> Limit 없이 프로그램을 실행하면, 운영체제는 아무것도 제어할 수 없음

1. Process가 이상한 짓 할 수 있음
	- `int *i; i=0; *i=1;`
	- 잘못된 포인터를 사용해서 메모리의 잘못된 위치를 덮어써 버릴 수도 있습니다
2. 운영체제가 CPU 제어권을 다시 가져오기 어려움
	- 프로세스가 무한루프를 돌려서 탈출하지 못하고, 점유권을 안넘긴다면?
	- OS는 제어권을 가져오지 못함

## User mode & Kernel mode

> 중요한 건 kernel mode에서만 하자 
> -> Limited Execution

### User Mode
일반적으로 작성하는 사용자 프로그램은 User Mode에서만 동작함
반면 운영체제가 시스템 전체 자원을 직접 다루는 작업은 kernel mode에서 실행

### Kernel Mode
중요한 일은 전부 kernel mode에서만 가능하게 막아 두는 것

중요한 작업
- 디스크에 대한 I/O 요청
	- open, close, read, write
- 프로세스 생성 및 삭제
	- fork, exec
- 메모리 추가 할당
	- brk, sbrk(malloc)
- 다른 프로세스와의 통신
	- pipe

### User Mode -> Kernel Mode
- 사용자 프로그램은 직접 kernel mode 자원에 접근하지 못한다.
- 대신 미리 정의된 약속된 인터페이스, 즉 `system call`을 통해서만 요청할 수 있습니다.
- ex) user mode(fopen) -> kernel mode(open)

> 운영체제가 미리 허용한 system call만 노출해 두면, 사용자 프로그램은 그 범위 안에서만 시스템 자원을 요청
> 즉, 아무거나 할 수 없고, “허용된 일만 하라”는 정책이 강제

## Trap

> User Mode에서 System Call을 호출할 때 무슨 일이 일어날까?

> trap은 user mode에서 kernel mode로 넘어가는 사건

- **interrupt** 
	- 외부 하드웨어에 의해 발생하는 이벤트
- **exception** 
	- 예를 들어 0으로 나누기 같은 잘못된 연산이 일어났을 때 발생
- **system call**
	- 소프트웨어적으로 의도적으로 trap을 일으켜 kernel mode로 들어가는 경우
	- software trap이라고도 함.

### Trap Instruction이 하는 일

> int n
> 여기서 n은 interrupt number임

1. Privilege Level을 User Mode에서 Kernel Mode로 상승
2. 현재 CPU Register 상태를 저장해야함.
	- user mode에서 실행 중이던 프로그램을 나중에 다시 이어서 실행해야 하기 때문
		- ex) eip, cs, eflags, esp, ss
	- 이런 레지스터 값들이 kernel stack에 저장
3. 커널 안에서 어디를 가야할지 찾기
4. 해당 handler로 점프
	- 이제부턴 kernel code 실행
5. kernel mode에서 해야 할 일을 다 하고 나면, **return-from-trap** 을 통해 다시 user mode로 복귀
	- 저장해 두었던 레지스터 값을 복원해서 원래 user program이 이어서 실행될 수 있게 함.

### Trap Table & Trap Handler

> trap이 발생했다고 해서 무조건 같은 커널 코드로 들어가는 것은 아님  
> 어떤 trap인지에 따라 가야 할 handler가 달라야 함
> 이것을 가능하게 하는 것이 **trap table**

> trap table은 “각 trap 번호에 대해 어느 handler를 실행할 것인지”를 저장한 테이블  

- 예)
	- system call 때문에 들어온 것인지
	- divide by zero 같은 exception인지
	- timer interrupt 때문인지
- 각각 다른 handler가 등록되어 있어야 함
	- trap table은 각 interrupt number, trap number에 대해 실행될 코드의 주소를 저장하는 구조

- 운영체제는 부팅 시 trap table을 초기화
- 하드웨어는 부팅시 OS에게 “trap table은 여기 있다”라고 알려 줌
	- 이 작업 자체도 privileged instruction이기 때문에 user mode에서는 할 수 없음
	- 즉, trap table 설정은 오직 운영체제만 가능


> user mode에서 trap이 발생했을 때 kernel mode로 넘어가고
> 그다음 **trap table을 보고 적절한 handler를 찾아 실행한다**


### System Call Handler & System Call Table

> trap table은 “왜 kernel mode로 들어왔는가” 정도까지만 구분함
> 예를 들어 “system call 때문이다”라는 것까지는 알 수 있지만, 
> system call 중에서도 `open()` 때문인지 `close()` 때문인지, `fork()` 때문인지까지는 추가로 구분해야 함

> 따라서 커널 안에는 System Call Handler와 System Call Table이 있음

trap table을 통해 system call handler까지 들어온 뒤, system call 번호를 보고 다시 system call table에서 실제 목적지 함수를 찾아가는 것

1. user mode에서 system call 호출
2. trap 발생
3. kernel mode 진입
4. trap table을 통해 system call handler 실행
5. system call table을 보고 실제 `open()` 이나 `close()` 커널 루틴 호출
6. 작업 완료 후 user mode 복귀

![[Pasted image 20260417004353.png]]

## Kernel Stack은 왜 Stack인가?

> 중요한 점: user mode에서 들어오면서 저장한 레지스터 값이 kernel stack의 아래쪽에 깔려 있다는 것

- kernel mode에서 동작하는 동안 커널 함수들이 그 위에 자기 호출 정보를 쌓아 감
- 마지막에 user mode로 돌아갈 때는 그 아래에 있던 레지스터 값을 다시 꺼내 와 CPU 레지스터에 복원
- 그래서 kernel stack이라는 이름이 붙는 것입니다


## 부팅 ~ user mode까지의 흐름

### OS Booting
1. 운영체제가 부팅되면 커널모드에서 먼저 **trap table** 을 초기화  
2. 이후 하드웨어는 system call handler, timer handler 같은 중요한 handler들의 위치를 기억

### OS Running
어떤 프로그램을 실행하려고 하면,
1. 운영체제는 kernel mode에서 다음과 같은 일을 함.
	- process list에 엔트리를 만들기
	- 메모리를 할당
	- 프로그램을 메모리에 로드
	- user stack과 kernel stack을 준비
	- 초기 레지스터 값을 설정
2. return-from-trap을 하드웨어 경유
	- 레지스터를 커널 스택에서 복원
	- 유저 모드로 진입
	- main으로 점프
3. 유저모드에서 main 실행

실행 도중 system call을 만나면 trap이 발생하고 kernel mode로 들어갑니다.  
이때 현재 CPU 레지스터 값은 kernel stack에 저장됩니다. kernel은 적절한 handler를 실행해 작업을 처리한 뒤, 다시 kernel stack에 있던 레지스터 값을 복원해서 user mode로 돌아갑니다. 이 덕분에 프로그램은 “중간에 멈췄다가 다시 이어서 실행되는 것처럼” 자연스럽게 동작합니다.

> 프로그램이 끝나면 마지막에는 `exit()` 계열 system call을 통해 다시 kernel mode로 들어가고, 운영체제는 프로세스가 쓰던 메모리를 해제하고 process list에서 제거합니다.

## CPU의 제어권 찾는 방법!

> user mode와 kernel mode를 나누고 system call로 제한을 걸면, 프로세스가 함부로 중요한 자원을 망가뜨리는 문제는 어느 정도 막을 수 있다.
> 하지만, **프로세스가 CPU를 계속 붙잡고 있으면 어떻게 할 것인가?**

cooperative approach vs non-cooperative approach

### Cooperative approach

> process가 `yield`와 같은 System call을 실행하여 주기적으로 CPU 사용을 포기

But, 프로세스가 무한 루프에 빠지거나, 실수로 CPU 양보 코드를 실행하지 않으면 운영체제는 다시 제어권을 되찾기 어려움

### Non-cooperative approach

> 프로세스가 협조적으로 CPU를 반납하길 기대하지 않고, 운영체제가 주기적으로 강제로 CPU 제어권을 되찾는 방식

> 이때 사용하는 것이 timer interrupt!

- 운영체제는 부팅 시 타이머를 설정해 두고, 몇 밀리초마다 인터럽트가 발생하도록 만듦
- 현재 어떤 프로세스가 실행 중이든 상관없이, 타이머 인터럽트가 발생하는 순간 kernel mode로 들어가게 됩
-> 어! timer interrupt로 커널 모드로 들어가면서 운영체제가 제어권을 되찾았다!

## Context Switching

- timer interrupt가 발생하면 현재 실행 중인 프로세스는 일단 **중단(suspend)** 됨.
- 이후 현재 CPU 레지스터 값 같은 문맥 정보가 저장
	- 저장 작업 역시 kernel stack과 PCB가 함께 관여
- 이후 kernel mode 안의 timer interrupt handler가 실행되고, 그 안에서 **scheduler** 가 동작하게 된다.

이때 Scheduler의 결정 사항
- 현재 프로세스를 계속 실행할 것인가
- 아니면 다른 프로세스로 바꿀 것인가

> 다른 프로세스로 바꾸기로 결정하면?
> -> Context Switching

> 현재 실행 중이던 프로세스 A의 문맥(context), 즉 레지스터 상태 등을 저장하고, 예전에 실행되다 멈춰 있던 프로세스 B의 문맥을 복원해서 CPU가 B를 이어서 실행하게 만드는 과정

1. 타이머 인터럽트 발생
2. 현재 A의 CPU 레지스터 값을 A의 kernel stack에 저장
3. kernel mode로 들어감
4. scheduler가 “B로 바꾸자”라고 결정
5. A의 현재 상태를 A의 PCB에 저장
6. B의 PCB에서 저장된 상태를 읽어 옴
7. B의 kernel stack을 활성화
8. return-from-trap을 통해 B의 user mode 레지스터 복원
9. 이제 CPU는 B를 실행

> 이 과정을 통해 운영체제는 “한 번에 한 프로세스만 실행 중이지만, 여러 프로세스가 돌아가는 것처럼 보이는” CPU 가상화를 구현

## kernel stack과 PCB가 모두 필요한 이유

> 어차피 레지스터 값을 저장할 거면 kernel stack만 있으면 되지, 왜 PCB까지 쓰는가?

> **kernel stack은 trap이나 커널 실행 도중 사용하는 임시적인 저장 공간** 에 가깝고, **PCB는 프로세스의 장기적인 상태를 보관하는 구조**

즉, kernel stack은 “지금 kernel mode에서 일하는 동안 필요한 stack”이고,  
PCB는 “이 프로세스를 나중에 다시 실행하려면 알아야 하는 정보 묶음”입니다.

그래서 context switch 과정에서는 kernel stack과 PCB가 함께 사용됩니다.

## interrupt 도중 또 다른 interrupt가 오면 어떻게 하는가

> 만약 운영체제가 interrupt를 처리하고 있는 도중에 또 다른 interrupt가 발생하면 어떻게 될까?

아마도 여기선 interrupt 처리중에 timer interrupt가 발생하는 상황을 고려하는 중일 듯

- ex) 어떤 trap handler 안에서 중요한 자료구조를 만지고 있는데, 그 도중 또 다른 interrupt가 와서 같은 자료를 건드리면?
	->시스템 상태가 꼬일 수 있다

> 운영체제는 보통 이런 상황을 방지하기 위해 **interrupt를 잠시 비활성화(disable)** 하거나,  **locking** 같은 기법을 사용

---
# Scheduling 

> **OS가 실행 가능한 프로세스들 중에서 어떤 프로세스를 언제 실행할지 결정하는 것**
> 즉, CPU를 누구에게 줄지 결정하는 규칙이 필요하고, 그 규칙을 **정책(policy)**이라 함.

## workload Assumptions

문제를 단순화하기 위해 다음과 같은 가정을 둔다.

- 모든 job은 실행 시간이 같다.
- 모든 job은 동시에 도착한다.
- 한 번 실행되면 끝날 때까지 계속 실행된다.
- 모든 job은 CPU만 사용하고 I/O는 하지 않는다.
- 각 job의 전체 실행 시간을 OS가 미리 알고 있다.

## Scheduling Metrics

### Turnaround time

> **프로세스가 도착한 시점부터 완료될 때까지 걸린 시간**입니다.

- T_turnaround​ = T_completion ​ − T_arrival​


### fairness

- 프로세스들이 CPU를 얼마나 공평하게 나눠 가지는가
- performance와 fairness는 종종 충돌
	- turnaround와 같은 성능 지표만 볼 것은 아니다.

## FIFO(first in, first out)

> FCFS(Fisrt Come, First Serve)라고도 함.
> 먼저 도착한 job을 먼저 실행하는 방식

예를 들어 A, B, C가 모두 10초씩 실행되고, 순서대로 도착했다고 합시다.

- A: 0초에 도착, 10초에 완료 → turnaround time = 10
- B: 0초에 도착, 20초에 완료 → turnaround time = 20
- C: 0초에 도착, 30초에 완료 → turnaround time = 30

### Convoy Effect (모든 job은 실행 시간이 같다. 제거)

- ~~모든 job은 실행 시간이 같다~~
- 모든 job은 동시에 도착한다.
- 한 번 실행되면 끝날 때까지 계속 실행된다.
- 모든 job은 CPU만 사용하고 I/O는 하지 않는다.
- 각 job의 전체 실행 시간을 OS가 미리 알고 있다.

```
-> A는 100초짜리 긴 작업이고, B와 C는 각각 10초짜리 짧은 작업인데 A가 먼저 도착

FIFO
A - - - - - - - - -
B                         -
C                          -
```


> 짧은 작업들이 너무 오랫동안 종료가 안됨

turnaround time total = 100(a)+110(b)+120(c) = 330
avg = 110

## SJF(Shortest Job First)

> 가장 짧은 작업을 먼저 실행하는 정책
> 비선점형(non-preemptive) scheduler

```
-> A는 100초짜리 긴 작업이고, B와 C는 각각 10초짜리 짧은 작업인데 A가 먼저 도착

SJF
A     - - - - - - - - -
B -                       
C   -             
```

turnaround time total = 10(b) + 20(c) + a(120) = 150
avg = 150 / 3 = 50

>SJF는 평균 turnaround time을 줄이는 데 유리
>짧은 작업을 먼저 끝내버리면 전체 평균 완료 시간이 줄어들기 때문


### Late Arrivals from B & C (모든 job은 동시에 도착한다. 제거)

- ~~모든 job은 실행 시간이 같다~~
- ~~모든 job은 동시에 도착한다.~~
- 한 번 실행되면 끝날 때까지 계속 실행된다.
- 모든 job은 CPU만 사용하고 I/O는 하지 않는다.
- 각 job의 전체 실행 시간을 OS가 미리 알고 있다.

>job이 동시에 도착하지 않는다면 SJF만으로는 부족
>SJF는 비선점형이기 때문에...


## STCF(Shortest Time-to-Completion First) (한 번 실행되면 끝날 때까지 계속 실행된다. 제거)

- ~~모든 job은 실행 시간이 같다~~
- ~~모든 job은 동시에 도착한다.~~
- ~~한 번 실행되면 끝날 때까지 계속 실행된다.~~
- 모든 job은 CPU만 사용하고 I/O는 하지 않는다.
- 각 job의 전체 실행 시간을 OS가 미리 알고 있다.

> SJF에 **선점(preemption)** 을 추가

> 새로운 job이 들어오면, 현재 실행 중인 job과 새로 들어온 job의 **남은 시간**을 비교해서 더 짧은 쪽을 실행

```
-> A / t=0 / 100s
   B & C / t=10 / 10s
   
STCF
A -   - - - - - - - - -
  B - 
  C  -

```

turnaround time total = 10(b) + 20(c) + a(120) = 150
avg = 150 / 3 = 50

## 새로운 매트릭: Response Time

> 프로세스가 도착한 시점부터 처음으로 CPU를 할당받기까지 걸린 시간

T_response ​= T_firstrun​−T_arrival

> STCF는 turnaround time 관점에서는 좋을 수 있지만, response time 관점에서는 항상 좋은 것은 아님

## Round Robin
​
> RR은 각 프로세스를 **정해진 time slice(quantum)** 만큼만 실행한 뒤, 다음 프로세스로 넘기는 방식

> fairness와 response time 측면에서 유리
> 프로세스가 짧게라도 빨리 CPU를 한 번씩 받기 때문

> RR is fair, but performs poorly on metrics such as turnaround time

- time slice가 짧을수록
    - response time은 좋아짐
    - 하지만 context switch가 자주 일어나서 overhead가 커짐
- time slice가 길수록
    - context switch overhead는 줄어듦
    - 하지만 response time은 나빠짐

**프로세스가 완전히 종료되는 경우**와 **아직 안 끝났는데 다른 프로세스로 바뀌는 경우**를 구분해야 한다


## I/O를 포함하자! (모든 job은 CPU만 사용하고 I/O는 하지 않는다. 제거)

- ~~모든 job은 실행 시간이 같다~~
- ~~모든 job은 동시에 도착한다.~~
- ~~한 번 실행되면 끝날 때까지 계속 실행된다.~~
- ~~모든 job은 CPU만 사용하고 I/O는 하지 않는다.~~
- 각 job의 전체 실행 시간을 OS가 미리 알고 있다.

```
예를 들어 A와 B가 각각 50ms의 CPU가 필요하다고 합시다.

- A는 10ms 실행한 뒤 I/O를 요청하고 10ms 기다림
- B는 I/O 없이 CPU만 계속 사용함
  
RR

A    - - - - -
A(io) - - - - 
B             -----

A - - - - -
B  - - - - -


```

> A가 I/O를 요청하면 A는 **blocked state** 로 들어가고 CPU를 더 이상 쓰지 못합니다.  
> 그러면 스케줄러는 그 빈 CPU 시간에 B를 실행시켜야 합니다.  
> 이렇게 해야 CPU를 놀리지 않고 **CPU utilization을 높일 수 있습니다.**

- A가 CPU를 쓰다가 I/O 요청
- A는 blocked state로 이동
- OS는 CPU를 B에게 할당
- I/O가 끝나면 인터럽트 발생
- 인터럽트 핸들러가 A의 I/O 완료를 확인
- A를 blocked → ready 상태로 바꾸고 ready list에 넣음
- 이후 다시 스케줄링 대상이 됨

> I/O 끝나면 Ready Process List에 추가

## No More Oracle(각 job의 전체 실행 시간을 OS가 미리 알고 있다. 제거)

- ~~모든 job은 실행 시간이 같다~~
- ~~모든 job은 동시에 도착한다.~~
- ~~한 번 실행되면 끝날 때까지 계속 실행된다.~~
- ~~모든 job은 CPU만 사용하고 I/O는 하지 않는다.~~
- ~~각 job의 전체 실행 시간을 OS가 미리 알고 있다.~~

>SJF나 STCF는 “누가 더 짧은가, 누가 남은 시간이 더 적은가”를 알아야 하는데, 이제 그 정보를 모르는 것
> -> 현실에서는 SJF/STCF를 그대로 구현할 수 없음!!!!

사실? SJF나 STCF가 이론적으로 성능이 가장 좋음! 하지만, 실제로는 남은 시간을 알 수 없기에 이렇게 하지 못함!!

# Multi-Level Feedback Queue

> 모든 가정을 다 제거했을때, 우리는 실행시간을 미래로 예측할 순 없다.
> 하지만! 과거로부턴 예측해볼 수 있다!!


## MLFQ(Multi-Levle Feedback Queue)

- **turnaround time 최적화**
    - 짧은 작업을 먼저 끝내고 싶다
- **response time 최소화**
    - 사용자가 빨리 반응한다고 느끼게 하고 싶다

> **짧고 자주 CPU를 포기하는 작업은 우대**하고,  
> **길게 CPU를 붙잡는 작업은 뒤로 미루**기

> 기존에는 ready queue가 하나인 것처럼 생각했다면, 
> 이제는 ready queue가 **우선순위별로 여러 개** 있는 구조

> 각 queue는 서로 다른 priority level을 가짐

**Rule 1**  
우선순위가 더 높은 queue에 있는 job이 먼저 실행된다.

**Rule 2**  
같은 queue 안에 있는 job들은 **Round Robin** 으로 실행된다.

- I/O를 기다리면서 반복적으로 CPU를 포기하면(Observed Behavior)
	- 우선순위를 높게 유지
- 작업이 오랜 시간 동안 CPU를 집중적으로 사용
	- 우선순위를 낮춤

-> 
- 어떤 프로세스가 CPU를 조금만 쓰고 자주 I/O를 하면서 CPU를 빨리 포기한다면  
    → 짧고 인터랙티브한 job일 가능성이 큼  
    → 높은 priority를 유지하고 싶다
- 어떤 프로세스가 타임슬라이스를 끝까지 다 쓰면서 CPU를 오래 점유한다면  
    → CPU-intensive job일 가능성이 큼  
    → 낮은 priority queue로 보내고 싶다


**Rule 3**
새로운 job이 시스템에 들어오면, **가장 높은 priority queue** 에 넣는다.
왜냐하면 처음에는 이 프로세스가 어떤 성격인지 모르기 때문입니다.  
일단 좋은 대우를 해 주고, 실행해 보면서 판단하겠다는 것입니다.

**Rule 4a**
어떤 job이 **주어진 time slice를 끝까지 다 써버리면**,  
즉 CPU를 오래 쓴다면, priority를 낮춰서 더 아래 queue로 내린다.

**Rule 4b**
반대로 어떤 job이 **time slice를 다 쓰기 전에 CPU를 포기하면**,  
현재 queue에 그대로 둔다.

- 처음 들어온 job은 일단 최상위 queue에 넣고 실행
- 실행해 보니 10ms를 다 써버렸다  
    → 이 친구는 CPU를 오래 쓰는 타입 같으니 아래 queue로 내림
- 실행해 보니 10ms 안에 CPU를 포기했다  
    → 이 친구는 인터랙티브하거나 짧은 job 같으니 현재 우선순위를 유지

https://www.youtube.com/watch?v=WOOzgCt6dW4

### 1. Starvation

interactive job이 너무 많으면, 낮은 queue의 job은 CPU를 거의 못 받을 수 있습니다.
- 작은 작업들이 너무 많으면, CPU만 heavy하게 쓰는 intensive job이 동작을 안함 
### 2. Gaming the scheduler

프로세스가 스케줄러의 규칙을 악용해 우선순위를 인위적으로 유지할 수 있습니다.
- ex) 99%만 돌리고, I/O request 돌리고 다시 제일 높은 Priority 가짐.
### 3. Behavior change

프로세스의 성격이 시간에 따라 바뀔 수 있습니다.  
처음에는 CPU-bound였다가 나중에는 I/O-bound가 될 수도 있습니다.


## Priority Boost

**Rule 5**
**일정 시간 S마다, 시스템의 모든 job을 최상위 queue로 끌어올린다.**

- A가 아래 queue에서 계속 굶고 있어도
- 일정 시간이 지나면 강제로 위로 올려준다
- 그러면 적어도 한 번은 다시 CPU를 받을 기회를 얻는다
- 이후 다시 오래 CPU를 쓰면 또 아래로 내려가겠지만,
- 적어도 영원히 굶지는 않는다

> Starvation을 막고,
> behavior가 바뀐 프로세스에게 다시 기회를 줌 (Behavior change 해결)


## Better Accounting

**Rule 4** - 개정
한 level에서 허용된 총 allotment(할당시간)를 다 쓰면, 중간에 몇 번 CPU를 포기했든 상관없이 priority를 낮춘다.

- 더 이상 “한 번의 time slice를 끝까지 썼는가”만 보지 말고
- **그 queue에서 누적해서 얼마만큼 CPU를 썼는가**를 본다
- 누적 allotment를 다 써버리면 강제로 아래 queue로 내린다

![[Pasted image 20260418011145.png]]

빗금 작업을 보면, a + b의 값을 모두 고려하여 allotment를 초과하면 priority를 낮추는 것을 알 수 있다.

> 이렇게 하면 99%만 쓰고 빠지는 식으로 스케줄러를 속이기가 어려워짐

## 낮은 queue일수록 더 긴 time slice

> 낮은 priority queue일수록 더 긴 quantum을 주자

- ex)
	- 최상위 queue: 10ms
	- 중간 queue: 20ms
	- 최하위 queue: 40ms

- 위에 있는 job들은 대체로 짧고 인터랙티브하므로 짧은 slice로도 충분하다
- 아래 있는 job들은 대체로 긴 CPU-bound job이므로, 너무 짧게 자르면 오히려 자주 끊겨 비효율적이다
- 따라서 낮은 queue에서는 한 번 잡았을 때 좀 더 오래 돌게 해 주는 것이 낫다

![[Pasted image 20260418011804.png]]

## Solaris MLFQ

Solaris의 time-sharing scheduling class에서는 MLFQ 계열 접근을 썼고,

- queue가 60개 정도 있었고
- 위쪽 queue는 짧은 time slice
- 아래쪽 queue는 긴 time slice
- 대략 1초 정도마다 priority boost가 일어났습니다.

---

# Lottery Scheduling

> **각 작업이 자신에게 기대되는 비율만큼 CPU를 받고 있는가**를 중심으로 보는 **fair-share scheduler**에 대해서 알아보자


> 티켓으로 CPU 비율을 표현한다
> CPU라는 자원을 일정한 비율로 나눠 쓰고 싶다면, 그 비율을 **티켓 수**로 표현하면 됨


- 예) 전체 티켓이 100장 있고,
	- 프로세스 A가 75장
	- 프로세스 B가 25장
- A가 CPU의 75%, B가 CPU의 25% 정도를 받기를 기대

이때 스케줄러는 매 타임슬라이스마다 **당첨 티켓 하나를 무작위로 뽑고**, 그 티켓을 가진 프로세스를 실행합니다.  
즉, 0~74가 뽑히면 A, 75~99가 뽑히면 B가 실행되는 식

> 반복 횟수가 많아질수록 원하는 비율에 수렴한다


## Ticket currency, transfer, inflation

### Ticket currency

사용자나 그룹이 자기 내부적으로 별도의 티켓 단위를 쓰더라도, 시스템은 이를 **global ticket value**로 환산해서 전체 스케줄링에 반영할 수 있습니다.  
즉, 로컬 단위는 달라도 최종적으로는 시스템 전체 기준의 비율로 바꿔 계산합니다.

- **목적:** 
	- 서로 다른 사용자나 그룹이 **자기 내부 기준으로 티켓을 나누더라도**, 시스템 전체에서는 공정하게 비교할 수 있게 하려는 것
- 예를 들어 사용자 A와 사용자 B가 각각 자기 프로세스들끼리 CPU 비율을 나누고 싶을 수 있다.
	- 그런데 모든 사람이 똑같은 단위로 티켓을 쓸 필요는 없다.
	- 그래서 각자는 자기 로컬 단위로 나누고, OS는 그걸 **global ticket value**로 환산해서 전체 시스템 차원에서 계산한다.

> **로컬 자율성 + 전체 시스템 공정성**을 동시에 얻기 위한 장치

### Ticket transfer

프로세스는 자신의 티켓을 다른 프로세스에 **일시적으로 양도**할 수 있습니다.  
즉, CPU 사용 권한의 일부를 넘겨주는 개념입니다.

- **목적:** 
	- 어떤 프로세스가 당장 CPU를 덜 쓰고, 대신 **다른 프로세스가 더 많이 CPU를 쓰게 하고 싶을 때** 그 비율을 넘겨주기 위해서
- 즉, 프로세스끼리 협력 관계가 있을 때 유용하다.
- 예를 들어 클라이언트가 서버에게 일을 맡겼다면,
	- "내가 받아야 할 CPU 몫 일부를 서버에게 넘겨서 빨리 처리하게 하자” 같은 식의 발상이 가능하다.

> 협력하는 프로세스 사이에서 CPU 몫을 유연하게 넘기기 위한 장치

### Ticket inflation

어떤 프로세스가 더 많은 CPU가 필요하다면, 일시적으로 티켓 수를 늘려서 더 많은 CPU 비율을 받을 수도 있습니다.  
즉, 시스템이 허용한다면 CPU 점유 비율을 동적으로 조정할 수 있는 것입니다

- **목적:** 
	- 어떤 프로세스가 **일시적으로 CPU를 더 많이 써야 할 때**, 그 요구를 반영하기 위해서
- 즉, 평소에는 보통 비율로 돌다가도, 
	- 특정 순간에는 “지금은 내가 더 급하다”라는 상황이 생길 수 있다.
	- 그럴 때 티켓 수를 잠시 늘려서 CPU 점유율을 더 높일 수 있다.

> 순간적으로 더 많은 CPU가 필요한 상황을 반영하기 위한 장치


## Lottery Scheduler Implementaion

```c
int counter = 0;
int winnter = getrandom(0, totaltickets);

node_t *current = head;

// tickets 순서는 가장 큰거부터 정렬되어 있음
// head -> c(250) -> a(100) -> b(50) -> NULL

while(current)
{
	counter = counter + current->tickets;
	if (coutner > winner) break;
	current = current->next;
}

// 만약 300번이 나왔다!
// 1.
//   current->tickets = 250임
//   counter 250이 300보다 작기때문에 다음으로 넘어감
// 2.
//   current->tickets = 100임
//   counter는 이제 350,
//   어 300보다 크네? 너가 걸렸다!
// 3.
//   a 프로세스에 자원 할당
```


## Fairness Metric

> U = 먼저 끝난 작업의 완료 시간 / 나중에 끝난 작업의 완료 시간

- 예를 들어 두 작업이 동시에 시작했고 둘 다 실행 시간이 10이라고 합시다.
	- 첫 번째 작업 완료 시각: 10
	- 두 번째 작업 완료 시각: 20
- fairness 값은
	- u = 10 / 20 = 0.5


> U가 **1에 가까울수록 더 공평하다**고 볼 수 있음

> Lottery Scheduling에서는 짧은 실행 구간에서는 이 값이 흔들릴 수 있지만, 작업 길이가 길어져서 티켓 추첨이 충분히 많이 일어나면 fairness가 점점 좋아집니다.  
> 즉, 이 스케줄러의 공평성은 **확률적 수렴** 위에 서 있습니다.

## Monte Carlo Sampling과의 연결

> Lottery Scheduling은 본질적으로 무작위 샘플링을 반복해서 원하는 비율에 가까운 결과를 얻는 방식

> Monte Carlo 계열 아이디어와 비슷

- 무작위로 샘플을 계속 뽑고
- 그 결과를 누적해 보면
- 전체적인 특성이나 평균적인 비율에 가까워질 수 있습니다.

- 예시
	- **sampling-based path planning**
	- **ray tracing**


## Stride Scheduling

> Lottery Scheduling의 장점은 간단하고 직관적이라는 점이지만, 본질적으로 **확률 기반**입니다.  
> 그래서 “비율을 맞추긴 하지만 매 순간 deterministic하지는 않다”는 한계가 있습니다.

> stride=큰 수/티켓 수

- 티켓이 많으면 stride는 작아지고
- 티켓이 적으면 stride는 커집니다.

- stride가 작다 = 조금씩 자주 간다 = CPU를 자주 받는다
- stride가 크다 = 크게 한 번에 간다 = CPU를 덜 자주 받는다

Stride Scheduling에서는 각 프로세스가 **pass value**를 가집니다.

- 현재 pass 값이 가장 작은 프로세스를 선택한다.
- 그 프로세스를 실행한다.
- 실행한 뒤 그 프로세스의 pass 값에 자신의 stride를 더한다.
- 다시 자료구조에 넣는다.
- 다음에도 pass가 가장 작은 프로세스를 선택한다.

- A: stride 100
- B: stride 200
- C: stride 40

A(100) -> B(200) -> C(40) -> C(80) -> C(120) -> A(200)->C(160)->C(180)->C(220)->A(300)->B(400)->C(260)->...


- Stride Scheduling의 장점
	- Lottery Scheduling보다 **더 예측 가능하고 결정적**이라는 점입니다
	- 무작위 추첨에 의존하지 않기 때문에, 원하는 비율을 더 안정적으로 맞출 수 있습니다.
- 단점
	- 각 프로세스마다 **pass 값을 계속 저장하고 갱신해야 함**
	- Lottery Scheduling은 티켓만 알면 그때그때 추첨하면 되지만, Stride Scheduling은 매 프로세스의 상태를 관리해야 함

> Stride Scheduling은 프로세스별 pass 값을 유지해야 하고, 새 프로세스가 pass=0으로 들어오면 한동안 CPU를 독점할 가능성도 있다.

> Lottery Scheduling은 프로세스별 추가 상태를 유지할 필요가 없다

## Linux Completely Fair Scheduling(CFS)

> 현재 리눅스의 스케줄러

- SJF/STCF처럼 “남은 실행 시간이 짧은 작업”을 우선하는 것이 아니라
- **fairness**를 매우 중요하게 본다는 점입니다.

> 실제로는 완전히 똑같이 나누는 것이 아니라 **nice value**를 통해 우선순위 차등도 반영

> “공평함”을 기본 원칙으로 두되, 필요하면 정책적으로 CPU 비율을 조정할 수 있는 구조


### Scheduled Latency

> 기존 RR 같은 방식은 보통 고정된 타임 슬라이스를 씀.
> 하지만 CFS는 고정 타임슬라이스 대신 **sched_latency**라는 개념을 사용

> 실행 가능한 모든 프로세스가 한 번씩 실행되기를 목표로 하는 시간

실행 가능한 프로세스가 n개라면 각 프로세스의 기본 타임슬라이스는 대략 `sched_latency/n`임 


```
예를 들어shed_latency가 48ms였을때...

프로세스 4개가 돌아가고 있으면 -> 48 / 4 = 12ms씩 time slice를 배정 받음
프로세스가 2개가 되면 -> 48 / 2 = 24ms씩 time slice를 배정 받음
```

> 실행 가능한 프로세스 수에 따라 타임슬라이스가 바뀌는 **non-fixed timeslice** 구조

### min_granularity

> 프로세스 수가 너무 많아지면 48msn\frac{48ms}{n}n48ms 값이 너무 작아질 수 있음
> 그렇다면 context-switching overhead가 너무 커지게 됨

> 이런 문제를 방지하기 위해 min_granularity를 두어 timeslice가 min_granularity보다 짧지 않게 만든다.

```
예를 들어, 
프로세스가 10개
sched_latency가 48ms
일때...

48 / 10 = 4.8ms
개별 프로세스의 time slice는 4.8ms임
너무 짧음!!!

-> min_granularity를 6ms로 둠
개별 time slice는 6ms가 됨
6ms * 10 = 60ms

그렇다면 한번 돌아가는데 60ms로 늘어남을 알 수 있음
```

### vruntime

> CFS에서 다음에 실행할 프로세스를 고르는 기준은 **vruntime(virtual runtime)** 임

> CFS will pick the process with the lowest vruntime to run next

- 지금까지 CPU를 덜 쓴 프로세스는 먼저 실행시키고
- 많이 쓴 프로세스는 뒤로 미룬다

> CFS는 ready queue를 “지금까지 얼마나 실행했는가”를 기준으로 정렬하고, **vruntime이 가장 작은 프로세스**를 실행합니다.
> Stride Scheduling에서 pass가 가장 작은 것을 뽑는 것과 느낌이 비슷하지만, CFS는 이걸 Linux 친화적인 방식으로 일반화한 것

```
새 프로세스가 들어온다고 해서  
**무조건 `vruntime = 0`으로 바닥부터 시작하는 게 아니다.**

더 정확히는:

- CFS는 ready queue에서 **가장 작은 vruntime**을 가진 프로세스를 고른다.
- 그런데 새 프로세스나 오래 sleeping 했다가 돌아온 프로세스를 너무 작은 값으로 넣어 버리면 불공평해진다.
- 그래서 적어도 강의/PDF 흐름에서는  
    **“현재 큐의 최소 vruntime 근처에 맞춰서 넣는다”**  
    라는 직관으로 이해하면 된다.

PDF에 직접 나온 건 sleeping process에 대한 규칙인데,

- I/O 후 다시 ready state가 될 때
- 그 프로세스의 vruntime을
- **트리의 최소값보다 작지 않도록 설정한다**고 되어 있다.

```

>“timeslice를 다 쓴 뒤에도, 그 프로세스의 vruntime이 여전히 제일 작으면 어떻게 되냐?”
> 그 경우엔 **다시 그 프로세스가 선택될 수 있다.**

### nice value & weight

> 실제 시스템에서는 모든 프로세스를 완전히 동일하게 취급하지는 않음
> 어떤 프로세스는 더 중요하고, 어떤 프로세스는 CPU를 조금 덜 받아도 괜찮을 수 있음

- nice 값이 작을수록 우선순위가 높고
- nice 값이 클수록 우선순위가 낮습니다

`-20 ~ 19`

> nice 값이 높다 = CPU를 더 양보하는 착한 프로세스

- A: nice = -5 → weight = 3121
- B: nice = 0 → weight = 1024

> 더 높은 우선순위 프로세스가 더 큰 weight를 가짐

### weight를 반영한 time slice

```
a의 time_slice = (a의 weight / 전체 weight의 합) * sched_latency
```

```
- A: weight = 3121
- B: weight = 1024
- sched_latency = 48ms

A의 time_slice = 3121/3121+1024 * 48 = 3/4 * 48 = 36
B의 time_slice = 1024/3121+1024 * 48 = 1/4 * 48 = 12

```

> 이제 fairness는 “완전히 똑같이 나누는 것”이 아니라, **정책적으로 정한 비율에 맞춰 공평하게 나누는 것**

### vruntime의 필요성

얼마만큼 실행시켰는지를 따지면, 특정 프로세스가 weight에 따라 더 많이 씀
음? 그럼 정책적으로 정한 비율에 맞게 공평하게 한건데 쟤의 vruntime을 저렇게 낮다고?

```
A가 36ms, B가 12ms를 받았다고 합시다.  
단순 runtime만 보면 A가 훨씬 많이 실행했으니 다음에는 항상 B가 먼저 뽑혀야 할 것 같습니다.  
하지만 그건 “정책적으로 A에게 더 많이 주겠다”는 의도를 무시하는 셈입니다.
```

그래서 CFS는 그냥 runtime이 아니라 **보정된 runtime**, 즉 **vruntime**을 씁니다.

```
i의 vruntime(timeslice 끝난 후) = 
i의 vruntime(timeslice 끝나기 전) + weight_0/weight_i * runtime_i;
```

- A는 weight가 크기 때문에 `weight0/weighti` 값이 작아지고
- 같은 실제 실행시간을 가져도 vruntime은 덜 증가합니다.

> 높은 우선순위 프로세스는 실제로 더 오래 실행해도 “가상 실행시간”은 천천히 늘어나므로, 앞으로도 더 자주 선택될 수 있음
> 반대로 낮은 우선순위 프로세스는 조금만 실행해도 vruntime이 상대적으로 빨리 증가


### Ready queue는 왜 Red-Black Tree인가

CFS는 항상 **vruntime이 가장 작은 프로세스**를 빨리 찾아야 합니다.  
그리고 프로세스는 계속 들어오고 나가고, 실행 후 다시 큐에 들어가므로 삽입/삭제/최솟값 탐색이 매우 자주 일어납니다.

> Linux는 ready queue를 **Red-Black Tree**로 관리

삽입/삭제가 O(log⁡n)으로 가능

- 왼쪽으로 갈수록 vruntime이 작은 프로세스
- 오른쪽으로 갈수록 vruntime이 큰 프로세스

### I/O와 sleeping process 문제

오랫동안 sleep 상태였다가 다시 ready가 되면 vruntime이 상대적으로 매우 작아서 계속 유리해질 수 있음

Linux는 프로세스가 ready 상태로 돌아올 때, 그 vruntime이 현재 트리의 최소값보다 지나치게 작아지지 않도록 보정

깨어난 프로세스가 무한정 유리해져서 CPU를 독점하지 못하게 합니다

---
# (중간정리) Scheduler 정리

## 1. FIFO

- **왜 나왔나**
    - 가장 단순하고 구현하기 쉽기 때문.
    - 먼저 온 작업을 먼저 실행하면 된다.
- **문제점**
    - 작업 길이가 다르면 바로 문제가 생긴다.
    - 긴 작업이 앞에 오면 짧은 작업들이 뒤에서 줄줄이 기다려야 한다.
    - 이게 바로 **convoy effect**다.
- **그래서 다음에 나온 것**
    - “짧은 작업 먼저 돌리자” → **SJF**

---

## 2. SJF

- **왜 나왔나**
    - FIFO의 convoy effect를 줄이기 위해.
    - 긴 작업 하나 때문에 짧은 작업 여러 개가 피해 보는 상황을 막고 싶었다.
    - 그래서 **Shortest Job First**, 즉 가장 짧은 작업부터 실행한다.
- **장점**
    - 평균 **turnaround time**을 줄이는 데 유리하다.
- **문제점**
    - 기본적으로 **non-preemptive**다.
    - 이미 긴 작업이 실행 중인데 뒤늦게 더 짧은 작업이 들어와도 바로 반영 못 한다.
- **그래서 다음에 나온 것**
    - “짧은 작업이 늦게 와도 바로 반영하자” → **STCF**

---

## 3. STCF

- **왜 나왔나**
    - SJF에 **preemption**을 넣기 위해.
    - 새 작업이 들어왔을 때, 남은 실행 시간이 가장 짧은 작업을 선택하고 싶었다.
- **장점**
    - SJF보다 더 공격적으로 turnaround time을 최적화할 수 있다.
    - 늦게 도착한 짧은 작업도 빠르게 처리 가능하다.
- **문제점**
    - **response time**에는 약하다.
    - 사용자 입장에서는 “빨리 끝나는 것”보다 “일단 빨리 반응하는 것”이 더 중요할 때가 많다. PDF도 STCF 계열은 response time에 강하지 않다고 말한다.
- **그래서 다음에 나온 것**
    - “모든 작업이 빨리 한 번씩 CPU를 받아보게 하자” → **RR**

---

## 4. RR

- **왜 나왔나**
    - response time 문제를 해결하기 위해.
    - 각 작업에 짧은 **time slice**를 주고 번갈아 실행시키면, 사용자가 느끼는 첫 반응이 빨라진다.
- **장점**
    - 인터랙티브한 환경에서 반응성이 좋다.
    - 여러 작업이 빠르게 한 번씩 CPU를 받는다.
- **문제점**
    - turnaround time은 오히려 나빠질 수 있다.
    - PDF도 RR은 fair하지만 turnaround 같은 metric에는 불리하다고 말한다.
    - 또 time slice가 너무 짧으면 **context switching overhead**가 커지고, 너무 길면 response time이 나빠진다. 즉, trade-off가 생긴다.
- **추가 현실 문제**
    - 실제 프로그램은 CPU만 쓰지 않고 **I/O**도 한다.
    - I/O를 시작하면 blocked 상태가 되므로, 그동안 다른 작업을 돌려 CPU를 놀리지 않아야 한다.
- **그래서 다음 고민**
    - “짧은 작업을 우대하고 응답성도 챙기고 싶은데, 현실에선 실행 시간을 모른다” → **MLFQ**

---

## 5. MLFQ

- **왜 나왔나**
    - 핵심은 **No More Oracle**이다.
    - 운영체제는 보통 작업의 실행 시간을 미리 모른다.
    - 그런데도 SJF/STCF처럼 “짧은 작업 먼저”의 효과를 내고 싶었다.
- **핵심 아이디어**
    - 과거 행동을 보고 미래를 추정한다.
    - CPU를 오래 붙잡고 있으면 CPU-bound 같다고 보고 우선순위를 낮춘다.
    - 자주 I/O로 빠지고 금방 CPU를 양보하면 interactive job 같다고 보고 높은 우선순위를 유지한다.
- **어떻게 동작하나**
    - 여러 우선순위 큐를 둔다.
    - 높은 큐가 먼저 실행된다.
    - 같은 큐 안에서는 RR로 돈다.
- **장점**
    - 실행 시간을 몰라도 SJF/STCF 비슷한 효과를 흉내낼 수 있다.
    - interactive job의 response time을 좋게 유지할 수 있다.
- **문제점**
    - **starvation**: interactive job이 너무 많으면 낮은 우선순위 작업은 계속 못 돌 수 있다.
    - **gaming**: time slice 거의 다 쓰고 I/O를 걸어 우선순위 하락을 피하는 식으로 속일 수 있다.
    - **behavior change**: 작업 성격이 시간이 지나며 바뀔 수도 있다.
- **그래서 붙은 보완책**
    - **Priority Boost**: 일정 시간마다 모든 작업을 다시 최상위 큐로 올린다.
    - **Better Accounting**: 단순히 “끝까지 썼나”가 아니라, 해당 레벨에서 총 allotment를 다 쓰면 우선순위를 내리게 한다.

---

## 6. Lottery Scheduling

- **왜 나왔나**
    - 이제 관점이 바뀐다.
    - 앞에서는 turnaround time, response time, interactive behavior를 봤다면,  
        여기서는 **fair share**, 즉 “각 작업이 CPU를 자기 몫만큼 나눠 가지게 하자”가 목표다.
- **핵심 아이디어**
    - CPU 비율을 **티켓 수**로 표현한다.
    - 티켓이 많을수록 더 자주 당첨되어 CPU를 더 많이 받는다.
- **장점**
    - 비율 기반 자원 분배를 아주 직관적으로 표현할 수 있다.
    - 상태를 복잡하게 유지하지 않아도 된다.
- **문제점**
    - 확률 기반이다.
    - 긴 시간으로 보면 원하는 비율에 수렴하지만, 짧은 구간에서는 fairness가 흔들릴 수 있다.
    - PDF도 job length가 짧으면 fairness가 심하게 나빠질 수 있다고 말한다.
- **그래서 다음에 나온 것**
    - “확률 말고, 더 결정적으로 비율을 맞추자” → **Stride Scheduling**

---

## 7. Stride Scheduling

- **왜 나왔나**
    - Lottery의 확률적 성격을 줄이고, **deterministic**하게 비율을 맞추기 위해. PDF도 아예 deterministic approach라고 부른다.
- **핵심 아이디어**
    - 티켓 수가 많을수록 stride는 작아진다.
    - 실행할 때마다 pass 값을 stride만큼 증가시키고,
    - 가장 pass가 작은 프로세스를 다음에 실행한다.
- **장점**
    - Lottery보다 더 안정적으로 비율을 맞춘다.
    - 랜덤에 덜 의존한다.
- **문제점**
    - 프로세스마다 **pass 값 상태를 계속 유지**해야 한다.
    - 새 프로세스는 pass=0에서 시작해서 일시적으로 유리해질 수 있다.
- **그래서 다음 흐름**
    - 실제 운영체제에서는 fairness, priority, 효율적 자료구조까지 함께 고려해야 한다 → **CFS**

---

## 8. CFS

- **왜 나왔나**
    - Linux에서 실제로 쓸 수 있는, 현실적인 **fair scheduler**가 필요했기 때문.
    - 단순히 “다 똑같이”가 아니라,
        - 공평하게 나누되
        - 필요하면 우선순위 조정도 하고
        - 프로세스 수가 많아도 효율적으로 관리해야 한다.
- **핵심 아이디어**
    - **vruntime**이 가장 작은 프로세스를 실행한다.
    - 즉, 지금까지 CPU를 상대적으로 덜 쓴 프로세스를 우선 실행한다.
- **왜 그냥 runtime이 아니라 vruntime인가**
    - nice value를 통해 어떤 프로세스는 더 많이 CPU를 줘야 할 수도 있다.
    - 그래서 실제 runtime을 weight에 따라 보정해서 vruntime으로 관리한다.
- **왜 고정 timeslice가 아닌가**
    - CFS는 **sched_latency**를 기준으로 “모든 프로세스가 한 번씩 실행되길 원하는 시간”을 잡고,  
        프로세스 수에 따라 timeslice를 나눈다.
    - 하지만 너무 짧아지면 RR 때처럼 context switching overhead가 커지므로,  
        **min_granularity**로 최소 time slice를 보장한다.
- **왜 red-black tree를 쓰나**
    - vruntime이 가장 작은 프로세스를 빨리 찾고, 삽입/삭제도 효율적으로 해야 하기 때문.
    - 그래서 ready queue를 red-black tree로 관리한다.
---
# Address Space 

> 메모리 가상화(memory virtualization)
> OS가 물리 메모리(physical memory)를 추상화해서 각 프로세스에게 독립적인 메모리 공간이 있는 것처럼 보이게 한다

## Memory Virtualization

- 프로그래밍을 쉽게 만든다
- 시간/공간 측면에서 메모리를 효율적으로 쓸 수 있게 한다
- 프로세스 간, 그리고 OS와 프로세스 간의 **격리(isolation)** 를 보장한다

> **protection / isolation**

- 다른 프로세스가 내 메모리를 함부로 읽거나 쓰지 못하게 하고
- 한 프로세스의 잘못된 접근이 다른 프로세스나 OS에 피해를 주지 못하게 하며
- 이 과정을 수행하는 비용(시간/공간 오버헤드)이 너무 크지 않게 만드는 것

## 초기 시스템: 한 번에 하나의 프로세스만 적재

> 물리 메모리에 **한 번에 하나의 프로세스만** 올려서 실행

- 처음에는 메모리도 작고 시스템도 단순했다
- 굳이 복잡한 추상화가 없어도, 한 번에 프로그램 하나만 돌리면 됐다
- 그래서 그냥 디스크에 있는 실행 파일을 메모리로 가져와 적재하고 실행하면 됐다

- 컴파일-링킹-실행 파일 생성 흐름
	- 소스코드를 컴파일하면 object file이 만들어지고
	- 필요한 라이브러리들과 링크하여 executable file을 만들고
	- 이 실행 파일은 디스크에 저장되어 있다가
	- OS가 그것을 메모리에 올려 실행한다

## Multiprogramming이 필요해지면 문제가 생긴다

- 물리 메모리를 여러 구역으로 나눈다
	- Process A는 여기
	- Process B는 여기
	- Process C는 여기

> **protection issue**

- 프로세스 A가 악의적으로든 실수로든
- 자기 구역이 아닌 물리 메모리 영역을 건드릴 수 있다
- 그러면 다른 프로세스의 코드나 데이터를 읽거나 망가뜨릴 수 있다
- 심하면 OS 자체가 깨질 수 있다

> 물리 메모리를 단순 분할해서 직접 쓰게 하면 **격리와 보호가 깨진다**

## Address Space

> 각 프로세스는 물리 메모리를 직접 보는 것이 아니라,  
> 자기만의 **virtual address space** 를 보는 것

- 실제 물리 메모리는 뒤에 따로 존재한다
- 사용자는 그 물리 메모리를 직접 참조하지 않는다
- 대신 **virtual address space** 라는 추상화된 공간만 본다
- 그리고 OS가 뒤에서 **mapping function** 을 통해 virtual address를 physical memory에 연결해 준다

> 이렇게 하면 프로세스는 자기 주소 공간만 보게 되므로, 다른 프로세스의 메모리를 직접 건드리기 어려움

- **Code(Text)**: 실행할 명령어가 들어 있는 영역
- **Heap**: 동적 메모리 할당 영역 (`malloc`, `new`)
- **Stack**: 함수 호출, 지역 변수, 반환 주소 등을 저장하는 영역


### 모든 주소는 virtual address다

- `main` 함수의 주소를 찍어 본다 → code 영역
- `malloc(1)`의 반환값을 찍어 본다 → heap 영역
- 지역 변수 `x`의 주소를 찍어 본다 → stack 영역

> 코드/힙/스택이 virtual address space 안에 논리적으로 구분되어 존재한다는 것을 실제로 확인

### 32-bit address space

> 각 주소가 1 byte를 가리킨다고 보면 전체 크기는 2^32 bytes=4GB

2^32 = 2^30 * 2^2 = 1G * 4 = 4GB

예시 시스템에서 virtual address space를 대략

- 아래 2GB: user space
- 위 2GB: kernel space

> 32비트 주소 공간 전체는 4GB이지만, 그중 사용자 프로세스가 직접 쓰는 user space는 보통 그 절반 정도로 제한될 수 있다


### 1. Code

`main` 함수의 주소를 찍으면 code(text) 영역 근처가 나온다.

### 2. Data

초기화된 전역변수는 **data segment** 에 들어간다.

### 3. BSS

초기화되지 않은 전역변수는 **BSS** 에 들어간다.

### 4. Stack

지역변수는 **stack** 에 들어간다.

### 5. Heap

`malloc()` 으로 받은 메모리는 **heap** 에 들어간다.

```c
int *dynamicLocalVar1;
dynamicLocalVar1 = malloc(sizeof(int));
```

- `malloc()` 이 반환한 **실제 메모리 블록**은 heap에 있다
- 하지만 `dynamicLocalVar1` 이라는 **포인터 변수 자체**는 지역변수라서 stack에 있다

- `dynamicLocalVar1` 의 **값** = heap 주소
	- `printf("0x%x\n", dynamicLocalVar1)`
- `&dynamicLocalVar1` 의 **주소** = stack 주소
	-  `printf("0x%x\n", &dynamicLocalVar1)`

```c
printf("%p\n", (void *)dynamicLocalVar1);   // heap 쪽 주소
printf("%p\n", (void *)&dynamicLocalVar1);  // stack 쪽 주소
```

-> 해당 파트는 PDF의 코드 부분 유심히 보기

---
# Base & Bound

## Address Translation

- 프로그램이 사용하는 주소는 **virtual address**
- 실제 데이터가 저장된 곳은 **physical address**
- 하드웨어가 virtual address를 physical address로 바꿔준다
- OS는 적절한 시점에 개입해서 이 하드웨어를 세팅한다

> **사용자 프로그램은 physical memory를 직접 보는 게 아니라 virtual address만 본다**
> 실제 physical memory로 가는 경로는 OS와 하드웨어가 숨겨서 처리

```c
x = x + 3;
```

1. 메모리에서 값을 읽고
2. 레지스터에서 3을 더하고
3. 다시 메모리에 저장하는

```assembly
128 : movl 0x0(%ebx), %eax   ; load 0+ebx into eax
132 : addl $0x03, %eax       ; add 3 to eax register
135 : movl %eax, 0x0(%ebx)   ; store eax back to mem
```

- `ebx` 같은 레지스터에 변수 `x`의 주소가 들어 있다
- `mov`로 메모리 값을 `eax`로 가져온다
- `add`로 3을 더한다
- 다시 `mov`로 메모리에 저장한다

> 이때 참조하는 주소들이 **physical address가 아니라 virtual address**이다!!!

>한 줄 실행하는 데도 instruction 자체를 가져오고, 데이터도 가져오고, 다시 저장하니까 **메모리를 빈번하게 접근한다**
>그래서 주소 변환은 반드시 **아주 빨라야 한다**

## Dynamic Relocation: 왜 Base/Bound가 필요한가?

- virtual address space는 논리적으로 0부터 시작한다
- 하지만 physical memory는 이미 OS도 차지하고 있고, 다른 프로세스도 있을 수 있다
- 따라서 프로세스를 physical memory의 임의의 위치에 올려야 한다
- 그러면 “virtual의 0번 주소가 physical에서는 어디인가?”를 알려줄 기준이 필요하다

## Base Register & Bound Register

- **base register** = 그 프로세스가 실제로 시작하는 physical address
- **bound register** = 그 프로세스 address space의 크기 또는 유효 범위

- 시작 주소를 알아야 한다 → **base register**
- 끝이 어디인지도 알아야 한다 → **bound register**

> 즉, translation과 protection 둘 다 하려면 이 두 값이 필요합니다.  
> base만 있으면 “어디서 시작하느냐”는 알 수 있지만,  
> bound가 없으면 “유효 범위를 넘었는지”를 검사할 수 없기 때문입니다.

## Dynamic Relocation

`physical address = virtual address + base`

`0 <= virtual address < bounds`
> 단, 모든 virtual address는 유효 범위 내에 있어야 함

- virtual address는 사실 base로부터의 **offset**
- 따라서 base + offset을 하면 실제 physical 위치가 나온다
- 다만 그 전에 offset이 bounds를 넘지 않았는지 검사해야 한다

### Bound Register

- address space의 **크기(size)** 로 볼 수도 있고
- address space의 **끝 위치(end)** 로 볼 수도 있음

- base: physical start
- bound: valid virtual range의 크기

## Hardware Requirements

- privileged mode
- base/bounds registers
- bounds check와 translation을 수행할 circuitry
- base/bounds를 세팅할 privileged instruction
- 예외를 발생시키고 처리할 능력

### 1. 유저 모드에서는 physical memory를 직접 건드리면 안 된다

메모리 가상화의 목적이 protection이기 때문에, 사용자 프로그램이 physical address를 직접 다루게 하면 안 됩니다.  
사용자는 virtual address만 쓰고, 실제 translation은 OS/하드웨어 내부에서 처리해야 합니다

### 2. base/bounds는 CPU에 붙은 진짜 레지스터여야 한다

이 값들을 너무 자주 참조하므로, 느린 메모리에 둘 수 없습니다.  
프로그램 카운터나 스택 포인터처럼 **CPU 레지스터 수준으로 빨라야 한다**는 뜻입니다.

### 3. translation과 bounds check는 하드웨어 회로로 해야 한다

소프트웨어로 매번 계산하면 너무 느립니다.  
그래서 base 더하기, 범위 검사 같은 작업은 하드웨어 논리 회로가 직접 처리해야 합니다.

### 4. 잘못된 접근은 예외를 발생시켜야 한다

bounds를 넘는 주소를 접근하면 **segmentation fault** 같은 예외가 나야 합니다.  
그리고 이를 처리할 예외 핸들러도 필요합니다.


### OS가 base-and-bound를 구현하려면 세 가지 중요 시점에 개입해야함.

- 프로세스가 시작할 때
	- finding space for address space in physical memory
	- 새 프로세스의 address space를 physical memory의 어디에 배정할 것인가
	- free list는 현재 사용되지 않는 물리 메모리 구간들의 목록
	- OS는 빈 공간이 어디에 얼마나 있는지 알아야 한다
	- 그래서 free list 같은 자료구조를 유지한다
	- 새 프로세스를 할당할 때 free list를 훑어서 적절한 위치를 찾는다
- 프로세스가 끝날 때
	- reclaiming the memory for use
	- 프로세스가 차지하던 physical memory를 다시 시스템에 돌려주는 순간
	- Process A가 종료되면 그 공간은 다시 free가 된다
	- OS는 이 빈 공간을 기록해 두어야 다음 프로세스를 거기에 배치할 수 있다
	- 그래서 free list를 잘 관리하는 것이 중요하다
- context switch가 일어날 때
	- Saving and storing the base-and-bounds pair
	- 다른 프로세스로 바꾸면 OS가 PCB에 저장된 base/bound를 교체해 준다.  
	- 그래야 새 프로세스의 VA가 올바른 physical memory로 간다.
	- A가 실행 중일 때 CPU 안에는 A의 base/bounds가 들어 있다
	- B로 switch하면 CPU 안의 값을 B의 base/bounds로 바꿔야 한다
	- 그런데 A의 값이 사라지면 안 되니 어디 저장해야 한다
	- 그 저장 위치가 바로 **PCB(process control block)** 이다


## 예외 핸들러도 boot time에 준비되어 있어야 한다

> 잘못된 메모리 접근이 일어나면 예외를 처리해야 하므로, OS는 예외 핸들러를 제공해야 합니다.  
> 그리고 그런 핸들러는 boot time에 privileged instruction을 통해 등록되어 있어야 합니다.

- trap table은 boot time에 초기화되어야 한다
- 그래야 실행 도중 exception이 났을 때 올바른 handler로 갈 수 있다
- 메모리 접근 오류도 마찬가지다


## 마무리

> base-and-bound는 **개념적으로 단순하고 이해하기 쉬운 첫 번째 접근** 이지만,  
> 실제 공간 활용은 비효율적이라서 다음 단계로 **segmentation**, 그리고 더 나아가 **paging** 으로 발전



---
# Segmentaion

> base-and-bounds 방식은 아주 단순하고 빠르다는 장점이 있지만, 주소 공간 전체를 하나의 덩어리처럼 다룬다는 한계가 있습니다.
> 실제로는 코드, 힙, 스택처럼 성격이 서로 다른 영역들이 있는데도, 이를 한 통으로 보고 메모리에 배치합니다. 
> 그러다 보니 사용하지 않는 빈 공간도 같이 따라다니게 되고, 결과적으로 메모리를 비효율적으로 쓰게 됩니다.

> 전체를 한 덩어리로 다루지 말고, 필요한 부분만 따로따로 관리하면 되지 않을까?


세그멘테이션을 하려면 각 세그먼트에 대해 적어도 두 가지 정보가 필요합니다.

- **base**: 해당 세그먼트가 물리 메모리의 어디에 시작하는가
- **bounds(size)**: 그 세그먼트의 크기가 얼마인가

> 어떤 주소를 접근했을 때 이것이 코드 영역인지, 힙 영역인지, 스택 영역인지를 먼저 알고, 그 세그먼트의 base를 더해서 실제 물리 주소를 구하는 것
> 동시에 bounds를 검사해서 그 세그먼트 범위를 넘지 않았는지도 확인해야함


## Code Segment

예를 들어 코드 세그먼트의 시작이 가상 주소 0이라고 합시다. 
그렇다면 코드 영역에서 100번째 바이트를 접근할 때는 다음과 같이 code base를 더하면 됨

`physical address = code base + 100`

## Heap 

가상 주소 공간에서 힙의 시작이 예를 들어 4KB 지점부터 시작한다고 해봅시다.  
그러면 힙 안에서 어떤 주소를 접근할 때는, 단순히 그 가상 주소 값을 base에 바로 더하면 안됨
왜냐하면 힙의 “세그먼트 내부 offset”을 먼저 구해야 하기 때문

```
힙 주소 4200을 참조한다고 하면,  

그 힙 세그먼트의 시작이 4KB = 4096이라면,  
실제로 더해야 할 값은 `4200 - 4096 = 104` 같은 **offset**입니다
```

> 세그멘테이션에서는 “가상 주소 그 자체”를 base에 더하는 것이 아니라,
> **그 세그먼트 안에서의 상대적 위치(offset)** 를 구한 뒤 더해야 한다는 점

> “어느 세그먼트인지 판별 → offset 계산 → bounds 검사 → base 더하기”
> 세그멘테이션은 더 유연해졌지만, 대신 하드웨어적 처리는 더 복잡해졌다

## Segmentaion fault

> base-and-bounds 하나로 전체 주소 공간을 볼 때는, 어떤 주소가 그 전체 주소 공간 범위 안에 있기만 하면 “잘못된 주소”는 아니었음

- 코드 세그먼트는 코드 세그먼트 범위만 유효
- 힙 세그먼트는 힙 세그먼트 범위만 유효
- 스택 세그먼트는 스택 세그먼트 범위만 유효


힙의 base/bounds로 판단할 때 그 범위를 넘어가는 주소라면,  
비록 전체 주소 공간 안 어딘가에 있는 값이라 하더라도  
**그 힙 세그먼트 관점에서는 잘못된 주소**

> base-and-bound는 그 사이 어딘가 찍어도 괜찮았다면
> segmentation approach에서는 그 사이 어딘가가 free space다! 그럼 이것도 segmentation fault
> -> 더 자세히 말하면, code segment는 code segment 밖을 벗어나는 순간 segmentation fault

## Explicit approach

> 세그먼트를 비트로 명시적으로 나누자
> -> 가상 주소의 상위 비트 몇 개를 세그먼트 번호로 쓰는 것


예를 들어 가상 주소의 맨 앞 **top 2 bit**를 세그먼트 구분에 쓴다고 해봅시다.

- `00` → code segment
- `01` → heap segment
- `10` → stack segment

-> 주소를 보자마자 어느 세그먼트인지 알 수 있음

> 뒤쪽 나머지 비트를 **offset**으로 해석
> 그 세그먼트의 base에 더하면 물리 주소를 얻을 수 있음


```c
segment = (VirtualAddress & SEG_MASK) >> SEG_SHIFT
// virtual address:    01000001101000
// segementation mask: 11000000000000
// and result:         01000000000000
// shift 12 :          00000000000001 -> 어 01이네 -> heap segmentation!

offset = virtualAddress & OFF_MASK
// virtual address:    01000001101000
// segementation mask: 00111111111111
// and result:         00000001101000 -> 1101000이 offset!

if (offset > bounds[segment]) // offset이 범위를 벗어나면?
	RaiseException(PROTECTION_FAULT) // segmentation fault 발생
else
	physicalAddress = Base[segment] + offset // heap의 base memory에 offset을 더함
	Register = AccessMemory(physicalAddress)
```

## Stack

> 스택은 일반적으로 **아래 방향으로 성장**

> 스택 세그먼트를 처리할 때는 단순히 offset을 더하는 방식만으로는 안됨
> -> 그 세그먼트가 **positive direction으로 자라는지, negative direction으로 자라는지** 필요

grow positive: 1 -> code(00) / heap(01)
grow negative: 0 -> stack(10)

- direction bit
- protection bit

### protection bit는 왜 필요?

> code sharing!!!!

- Vim을 여러 개 띄운다고 하면, 각각의 프로세스는 별개의 프로세스이지만 **실행 파일의 코드 자체는 동일**함
- 이 동일한 코드 세그먼트를 매 프로세스마다 따로 물리 메모리에 올리면 낭비
- 코드는 실행 중에 바뀌지 않으므로, 여러 프로세스가 **같은 물리 코드 세그먼트를 공유**해도 됨

> 이렇게 공유하는 대신에, code sharing된 physical memory의 정보는 수정되면 안됨
> 그래서 protection bit가 필요한 것!!

- code segment → read, execute 가능 / write 불가
- heap segment → read, write 가능
- stack segment → read, write 가능

> protection bit는 단순 보안 기능이 아니라,  
> **공유 가능한 코드 세그먼트를 안전하게 유지하기 위해서도 필요**


## Implicit Approach

> explicit approach처럼 상위 비트 두 개를 세그먼트 식별에 써버리면, 그만큼 실제 주소 표현에 쓸 수 있는 공간이 줄어듬

> -> 세그먼트 번호를 주소에 직접 적지 말고, 어떤 레지스터를 통해 그 주소를 참조했는지를 보고 추론하자

- program counter를 통해 가져온 주소 → code segment
- stack pointer를 통해 가져온 주소 → stack segment

> 문맥과 사용된 레지스터로부터 **암묵적으로 유추**하는 방식

- **Explicit approach**: virtual address의 top few bits로 segment를 정함. 예시로 top 2 bits를 써서 code=00, heap=01, stack=10처럼 구분한다.
- **Implicit approach**: 주소가 어떻게 만들어졌는지를 보고 segment를 추론한다.  
    예를 들어 program counter에서 만들어진 주소면 code, stack/base pointer면 stack, 그 외는 heap처럼 본다.

## segmentation은 여전히 coarse-grained 하다

- 통짜 base-and-bounds보다 세분화되어 있고
- 코드/힙/스택을 논리적으로 분리하고
- 각 세그먼트를 독립적으로 배치할 수 있고
- 코드 sharing도 가능하다

하지만 여전히 부족함.

> 바로 segmentation은 본질적으로 **coarse-grained** 하다는 점입니다.  
> 즉, 세그먼트라는 단위 자체가 여전히 큽니다.

## external fragmentaion

> segmentation의 가장 큰 문제는 **external fragmentation**!!

예를 들어 free space가 총 24KB 있다고 합시다.  
그런데 그 free space가 연속된 한 덩어리라면 20KB짜리 세그먼트를 쉽게 넣을 수 있음
하지만 free space가 반토막 나있으면? 절대로 못넣음


![[Pasted image 20260418224734.png]]


> 즉, **남는 공간의 총량은 충분하지만, 조각나 있어서 못 쓰는 문제**가 생김 
> -> **external fragmentation**!!

- 물리 메모리에 작은 hole들이 생기고
- 총 24KB free가 있어도
- 한 contiguous segment가 아니면 20KB 요청을 못 만족시킨다.

즉 여기서의 핵심은 단순히 “segment가 커서”라기보다,

- **세그먼트가 variable-sized**
- **그리고 segment 하나를 contiguous block으로 넣어야 해서**
- hole이 쪼개지면 못 넣는다

는 점이다.

### why not compaction?

> 중간중간 떨어져 있는 세그먼트들을 한쪽으로 몰아서 free space를 연속적으로 만들까?

- 실행 중인 프로그램의 세그먼트를 옮겨야 하고
- 메모리 내용을 복사해야 하고
- 옮긴 뒤에는 각 세그먼트의 **base 주소도 전부 다시 바꿔야 함**


- segmentation에서는 **각 segment를 physical memory의 연속된 공간(contiguous block)** 으로 넣으려고 한다
- 그런데 segment들은
    - 크기가 제각각이고
    - 생성/삭제 시점도 다르고
    - 힙처럼 커질 수도 있다
- 그러다 보니 physical memory에 **중간중간 애매한 빈칸들**이 생긴다
- 그런데 새로 들어오려는 segment는 **하나의 큰 연속 공간**이 필요하니까,  
    총 빈 공간은 충분해도 못 들어가는 상황이 생긴다
- 이게 바로 **external fragmentation**이다

> physical memory에 segment를 “큰 단위의 연속 공간”으로 배치하려고 하기 때문에 external fragmentation이 잘 생긴다

> 세그먼트처럼 큰 단위가 아니라 더 작은 고정 크기 단위로 쪼개서 관리하면, 흩어진 빈 공간도 더 유연하게 활용할 수 있지 않을까?


- 초창기엔 segmentation을 실제로 썼고
- Burroughs B5000, IBM AS/400, Intel 8086/80286 같은 사례가 있으며
- 이후 80386부터 paging을 지원하고
- x86-64 64bit mode에서는 segmentation을 사실상 거의 쓰지 않는다

---
# Free-Space Management

> free space의 총량은 충분해도 그 공간이 여기저기 조각나 있으면 큰 연속 공간을 할당할 수 없고, 이를 해결하려면 compaction처럼 비싼 작업이 필요하다 -> segmentaion에서는...


> 이번에는 **빈 공간, 즉 free space를 어떻게 관리할 것인가**를 다룰 예정

## Heap

코드, 스택, 힙 중에서 free-space management를 이야기할 때 가장 복잡한 대상은 **힙(heap)**이다.

-> why? 
- 코드는 보통 프로그램 시작 시 정해짐
- 스택은 동적으로 커지긴 하지만, 일반적으로 함수 호출/반환에 따라 비교적 규칙적임
- 하지만? 힙은? malloc()으로 메모리 할당, free()로 해제함.
	- 요청 시점도 제각각이고
	- 크기도 제각각이며
	- 중간중간 비어 있는 구간을 만들어 내기 쉽다
	- -> malloc()했던게 중간 중간에 free()로 해제
		-  internal fragmentaion 발생

> free-space management는 본질적으로 **“힙 세그먼트를 어떻게 다룰 것인가”** 의 문제라고 봐도 됨

## Splitting & coalescing

### Splitting

어떤 free chunk가 충분히 크다면, 그 chunk를 두 부분으로 나눌 수 있습니다.

- 한 부분은 사용자 요청을 만족시키기 위해 할당하고
- 나머지 부분은 다시 free chunk로 남겨 둡니다

```
ex) 10byte free chunk가 있는데 1byte 할당 요청이 들어옴

00~10 / 10~20 / 20~30
free  / used  / free
---
free list:
	head -> addr:0; len:10; -> addr:20; len:10; -> NULL 


->

00~10 / 10~21 / 21~30
free  / used  / free
---
free list:
	head -> addr:0; len:10; -> addr:21; len:10; -> NULL

```

### coalescing
반대로 free chunk들이 너무 잘게 쪼개져 있으면,  
개별 chunk 크기는 작지만 서로 인접한 free chunk들을 합치면 더 큰 chunk를 만들 수 있음

> **이웃한 free chunk들을 병합하는 것**이 coalescing

> 필요할 시 한번에 coalescing 함.
> "필요시"


```
ex) 12 바이트 할당 요청이 들어옴

free list:
	head -> addr:10; len:10; -> addr:0; len:10; -> addr:20; len:10; -> NULL 

-> coalescing

free list:
	head -> addr:0; len:30; -> NULL 
	
-> splitting

free list:
	head -> addr:12; len:30; -> NULL 

```

## Free List

> 각 free chunk를 연결 리스트의 노드처럼 관리

- 시작 주소(address)
- 길이(length 또는 size)
- 다음 free chunk를 가리키는 포인터(next)

> 힙 안에 흩어져 있는 free chunk들을 논리적으로 연결해서,  
> 운영체제가 “현재 사용 가능한 빈 공간들”을 한 줄로 추적할 수 있게

### free(ptr)은 왜 size가 안필요하지?

`malloc(N)`은 크기 N을 입력으로 받습니다.  
그런데 `free(ptr)`는 포인터만 받을 뿐, **크기(size)** 는 입력으로 받지 않습니다.

-> allocator는 어떻게 해당 포인터가 가리키는 chunk가 몇 바이트였는지 알지?

> 할당된 chunk의 앞부분에 header를 숨겨서 저장!

```c
typedef struct __header_t { // 헤더는 총 8byte임 / size 4 byte / magic 4 byte
	int size; // 실제 데이터의 크기 (헤더 제외)  
	int magic; // 구조체의 무결성을 검증하기 위해 사용되는 값
} header_t;
```

-> 그래서 실제로 malloc(20)을 하더라도 앞에 header가 포함되어 28바이트가 할당된다.

```c
void free(void *ptr)
{
	header_t *hptr = (void *)ptr - sizeof(header_t); // header_t를 찾음 8byte를 빼서
	// ...
	assert(hptr->magic==1234567); // magic 검증
	// ...
}

```

### magic 값은 왜 필요한가

- 메모리 오염
- 잘못된 free
- header 덮어쓰기
같은 이상 동작을 감지하기 위한 간단한 안전장치입니다.


## free chunk의 header

> 위의 __header_t 는 allocated chunk의 header였다!! 

- allocated chunk → 사용자에게 넘긴 영역 앞에서 metadata 관리 
	- (\*ptr-8에서 시작 -> ptr의 뒷부분에 위치)
- free chunk → free list의 노드로 사용
	- (free chunk의 가장 앞부분에 위치)

```c
typedef struct __node_t {  
	int size; // chunk 크기
	struct __node_t *next; // 다음 free chunk를 가리키는 포인터
} node_t;
```


## heap intialization

```c
node_t *head = mmap(NULL, 4096, PROT_READC|PROT_WRITE, MAP_ANON|MAP_PRIVATE,-1,-0);
head->size = 4096 - sizeof(node_t); // 4096-8 = 4088
head->next=null// next: 0
```

프로그램이 처음 힙을 사용하려 하면 allocator는 보통 작은 크기의 힙부터 시작

처음에는 이 전체 공간이 아직 아무도 쓰지 않는 free space이므로,  
하나의 큰 free chunk로 free list를 초기화하면 됨.

> “큰 덩어리 free chunk 하나만 있는 힙”

- free list에서 충분히 큰 chunk를 찾고
- 그 chunk를 splitting하고
- 앞부분은 allocated chunk로 전환하고
- 남은 부분은 다시 free chunk로 남깁니다

예를 들어 처음 4KB 힙에서 100바이트 요청이 들어오면,

- 실제 allocated chunk는 header 포함 108바이트
- 나머지는 더 작은 free chunk 하나


### free space with free()

어떤 chunk를 `free(sptr)` 한다고 합시다.  
그러면 그 chunk는 다시 free list의 노드가 되어야 함.

**free list의 맨 앞(head)** 에 새로 삽입

- 기존 head를 임시 변수에 저장
- 새로 free한 chunk를 head로 바꿈
- 새 head의 next가 원래 head를 가리키게 함

```c
free(sptr)
{
	void* tmp = head;
	head = sptr - 8; // sptr는 header 아래를 가리키고 있었음.
	head->next = tmp;
}

```


여러 개의 chunk를 free하면 free list 안에는 점점 많은 노드가 쌓입니다.  
이때 어떤 두 free chunk가 실제 메모리에서 서로 인접해 있다면,  
이 둘은 coalescing해서 하나의 큰 chunk로 합쳐야 합니다.

## double free

> 이미 free한 chunk를 또 한 번 free하는 경우 dnagling 발생

이렇게 되면 같은 chunk가 free list에 두 번 들어가거나,  
리스트 연결 구조가 꼬이면서 일부 free chunk를 잃어버릴 수 있습니다.

double free는 단순한 실수가 아니라 allocator 내부 구조를 깨뜨리는 심각한 오류가 될 수 있습니다.


## growing the heap

> allocator는 보통 처음부터 매우 큰 힙을 잡지 않습니다.  
> 대신 작은 힙으로 시작한 뒤, 필요할 때 더 많은 메모리를 OS에 요청

- `sbrk()`
- `brk()`

> 즉, 힙이 꽉 차서 현재 free list로는 더 이상 요청을 만족시킬 수 없으면,  
> 운영체제에 더 큰 힙 공간을 달라고 요청해서 힙을 성장

> 가상 주소 공간상으로는 연속되어 보이지만, 실제 물리 메모리에서는 떨어져 있을 수도 있다


## free chunk를 고르는 정책

> free list 안의 여러 free chunk 중 **어느 것을 선택해서 할당할 것**

### best-fit

> 요청 크기 이상인 free chunk들 중에서 **가장 작게 맞는 것**을 고릅니다.

즉, 남는 공간을 최소화하려는 전략입니다.

### worst-fit

> 가장 큰 free chunk를 고른 뒤, 거기서 필요한 만큼 떼어 내고 나머지를 남깁니다.

즉, 큰 덩어리를 잘라 쓰는 전략입니다.

### first-fit

> free list를 앞에서부터 보다가 **처음으로 조건을 만족하는 chunk**를 고릅니다.

전체를 다 보지 않아도 되므로 빠를 수 있습니다.

### next-fit

> first-fit과 비슷하지만, 항상 리스트의 맨 앞부터 시작하지 않고 **직전에 탐색하던 위치부터 이어서** 찾습니다.

즉, 탐색 비용을 줄이려는 변형

## Segregated List: McKusik-Karels Allocator
 분리된 리스트

> 일반적인 free list 전략을 넘어서, **크기별로 메모리를 따로 관리하는 방식**

> 요청 크기별로 free list를 따로 둔다

즉, 32바이트용 리스트, 64바이트용 리스트, 128바이트용 리스트, 256바이트용 리스트처럼 **버퍼 크기별로 전용 풀(pool)** 을 만들어 두고, malloc 요청이 들어오면 그 크기에 맞는 리스트에서 바로 꺼내 쓰는 구조입니다.

- `kmemsizes[]`
	- **각 페이지가 어떤 크기의 버퍼들로 쪼개져 있는지**를 기록

어떤 페이지는 32바이트 블록들만 들어 있는 페이지일 수 있고, 어떤 페이지는 128바이트 블록들만 들어 있는 페이지일 수 있습니다.  
이런 식으로 **한 페이지 내부는 같은 크기의 블록들로만 채운다**는 점이 중요

> 페이지 단위로 관리하면서, 페이지 내부는 동일 크기의 버퍼 집합으로 운영한다


```
예를 들어 128바이트 요청이 많이 들어오면, 빈 페이지 하나를 가져와서 그것을 128바이트 버퍼 여러 개로 쪼개고, 그 버퍼들을 128바이트 free list에 연결합니다.

그러면 `malloc(128)`이 들어왔을 때는 해당 free list에서 하나 꺼내면 끝입니다.  
만약 그 크기용 free list가 비어 있으면, 그때 운영체제가 새 페이지를 하나 받아와서 잘게 나눈 뒤 공급합니다.
```

- **탐색을 빠르게 해 준다**
- **같은 크기 요청이 자주 반복될 때 효율적이다**
- 대신 **각 크기별로 얼마나 메모리를 미리 확보해 둘지**가 고민이 된다

“32바이트 요청이 앞으로 얼마나 많을까?”, “128바이트 풀은 몇 페이지나 확보해 둘까?” 같은 **운영 정책 문제**가 생깁니다.  

> 속도는 좋아질 수 있지만 관리 정책은 더 복잡

> 한번 할당하고 나면, 크기가 좀 아까움... -> 그래서 Buddy system

McKusick-karels allocator는 특정 바이트 요청이 많다면 -> 그때서야 특정 페이지를 특정 size class로 만들어 전담 시킴

## Buddy System

> 큰 블록을 반씩 계속 쪼개서 필요한 크기를 만든다

```
예를 들어 1024바이트짜리 큰 블록이 하나 있다고 합시다.  
256바이트가 필요하면, 먼저 1024를 512와 512로 나누고, 그중 하나를 다시 256과 256으로 나눠서 하나를 할당합니다.
```

> 이때 반으로 나누어서 생긴 두 블록을 **서로 buddy**라고 부름

buddy system이 좋은 이유는, 나중에 free할 때  
“지금 반환된 블록의 buddy도 비어 있는가?”를 확인해서,  
비어 있다면 둘을 다시 합쳐 더 큰 블록으로 만듦

-> coalescing에 효과적임!!!

> 이 방식은 **분할도 체계적이고 병합도 체계적**

최소 단위를 32바이트처럼 정해 두고, 그보다 큰 요청은 전부 **2의 거듭제곱 크기**로 맞춰서 처리

> bitmap으로 각 32바이트 조각의 사용 여부를 추적

```
먼저 256바이트를 할당한다고 해 봅시다.

1. 큰 블록을 반으로 나눕니다.
2. 다시 필요한 크기가 나올 때까지 반으로 나눕니다.
3. 최종적으로 256바이트 블록 하나를 사용자에게 줍니다.
4. 쪼개고 남은 나머지 블록들은 각 크기에 맞는 free list에 넣어 둡니다.

그 다음 128바이트를 요청하면, 이미 남아 있는 256바이트 블록을 다시 반으로 쪼개서 128 두 개를 만들고, 그중 하나를 줍니다.  
64바이트 요청도 같은 방식입니다.
```


![[Pasted image 20260419124424.png]]

> “필요한 크기에 도달할 때까지 절반씩 쪼개고, 남는 것은 알맞은 크기 리스트에 넣는다”

크기 체계가 2의 거듭제곱이기 때문에, 쪼개기와 합치기가 계산적으로 단순

![[Pasted image 20260419124621.png]]

![[Pasted image 20260419124828.png]]

buddy system의 병합 조건은 아주 명확합니다.

- 같은 크기여야 하고
- 서로 buddy 관계여야 하고
- 둘 다 free 상태여야 한다

**연쇄적인 coalescing**이 가능

일반 free list에서는 인접한 블록인지, 합칠 수 있는지 확인하는 과정이 더 복잡할 수 있는데,  
buddy system은 구조 자체가 규칙적이라  
**“짝 블록을 찾고, 조건이 맞으면 반복적으로 병합”**하기가 쉽습니다.

> free할 때 오히려 시스템이 적극적으로 메모리를 큰 덩어리로 복구하려고 시도하는 구조


1.  **2의 거듭제곱 단위로 할당**하기 때문에 Internal Fragmentaion이 발생할 수 있습니다.  
	- 예를 들어 100바이트를 요청했는데 128바이트를 줘야 한다면, 나머지 28바이트는 내부적으로 낭비됩니다.
2. **buddy를 찾기 쉽습니다.**  
	- 주소와 크기만 알면 짝 블록을 계산적으로 찾아낼 수 있으므로 병합이 체계적입니다.
3. **bitmap 등을 활용해 상태를 추적**할 수 있습니다.

- 장점
	- 인접한 free buffer들을 효과적으로 병합할 수 있고, 페이지 시스템과의 연동도 비교적 쉽습니다.  
	- -> 운영체제가 페이지 단위 메모리 관리와 allocator를 연결하기에 좋은 구조입니다.
- 단점  
	- free할 때마다 가능한 만큼 계속 병합을 시도하므로 오버헤드가 생길 수 있음  
	- 사용자는 그냥 `free(ptr)`만 하고 싶지만 내부적으로는 크기 정보도 중요  
	- 요청 크기를 정확히 맞춰 줄 수 없어서 Internal Fragmentaion 문제가 남습니다.
		- 2의 제곱근이라서 그거에 못맞추면 내부 단편화 심함
			- ex) 33B 요청하면 64B에 할당해줘야함
### McKusick-Karels & Buddy System

- McKusick-Karels: “서랍장을 크기별 칸으로 나눠서, 32짜리 물건은 32칸 서랍에서 바로 꺼내준다.”
- Buddy: “큰 박스를 필요할 때 반씩 잘라서 맞는 크기를 만들고, 반납되면 짝 박스와 다시 합친다.”

> McKusick-Karels allocator는 ‘크기별 버퍼 풀을 페이지 단위로 운영하는 segregated allocator’이고,  
> Buddy system은 ‘2의 거듭제곱 크기 체계 안에서 분할/병합을 규칙적으로 수행하는 allocator’다.


> 아무리 allocator를 잘 만들어도, **가변 크기 블록을 다루는 한 외부 단편화 문제는 완전히 사라지지 않음**

---
# Paging Introduction

> **가상 주소 공간을 고정 크기 단위인 page로 나누고**,  
> **물리 메모리도 같은 크기의 page frame으로 나눈다**

segmentation에서는 code, heap, stack처럼 의미가 다른 영역을 각각 하나의 연속된 덩어리로 보았습니다. 그래서 각 segment 크기가 제각각이었고, 물리 메모리에도 적당한 빈 연속 공간이 필요했습니다.

> 반면 paging에서는 그런 의미 구분보다, 그냥 전부 똑같은 크기의 page들로 자름
> 물리 메모리 어디에든 빈 frame만 있으면 하나씩 끼워 넣을 수 있음

“가상 페이지 번호가 물리 프레임 번호 어디로 가는가”  
를 기록할 표가 필요하고, 그것이 바로 **page table**!!

- 장점
	- 유연성
		- heap이 얼마나 커질지, stack이 얼마나 내려올지, code가 얼마나 클지 미리 정교하게 맞출 필요가 없음
		- 어차피 page단위로 관리
	- free-space management의 단순화
		- segmentation에서는 20KB짜리 요청을 위해 20KB 연속 공간이 필요
		- paging에서는 예를 들어 4KB frame 다섯 개만 있으면 됨
			- 이 5개가 서로 떨어져도 됨. -> 어차피 page table을 통해서 조회함
	- external fragmentation 줄임
		- paging은 물리 메모리를 고정 크기 블록으로 나누기 때문


> free-space management가 어려웠던 이유 중 하나가 “연속 공간” 때문이었는데, paging은 그 가정을 없앰!!!

> “가상 공간에서는 연속처럼 보이지만, 물리 공간에서는 흩어져 있어도 된다”

가상 주소는 두 부분으로 나뉩니다.
- **VPN**: virtual page number
- **offset**: 그 페이지 내부에서 몇 번째 바이트인가

먼저 “어느 페이지인가”를 찾고,  
그 페이지가 연결된 물리 프레임 번호를 얻은 뒤,  
마지막으로 offset은 그대로 붙이는 방식

**페이지 단위로 위치만 바꾸고, 페이지 내부 상대 위치는 그대로 유지**할 수 있음

> 아주 규칙적이고 단순한 주소 변환이 가능

## page table

> 문제: page table이 굉장히 커질 수 있다는 점

```
예를 들어 32비트 주소 공간에서 페이지 크기가 4KB라면,  
가상 페이지 개수가 매우 많아집니다.

2^32(32비트 주소 공간 -> 2^32까지 표현 가능한 주소)
2^12(페이지의 크기 4K -> 2^12)

VPN(virtual page number)의 비트 수
-> 32비트 중 몇 비트가 VPN을 나타내는 비트 수인가?

Offset은 바이트 단위로 표기!!
-> page 크기가 4KB라는 것은
-> 4K개의 offset이 존재한다는것
-> 4K는 2^12
-> 2^12 만큼의 offset이 필요하고
-> 이를 표현하려면 12비트가 필요!
-> offset은 12비트가 필요!

어? 32비트 주소 공간에서 12비트가 offset이네?
나머지 20비트는 뭐지?
-> VPN
-> 가상 공간을 최대 2^20개의 페이지까지로 표현가능
 
한 프로세스에서 사용할 수 있는 가상 페이지 수가 최대 2^20개이다. 페이지 크기가 4KB일 때.

---
여기서 만약 페이지 테이블의 매핑 개당 크기가 4Byte이다?
-> 2^20 * 4byte 
-> 4MB
-> page table의 전체 크기는 4MB
-> 꽤 큼!!
```

> 프로세스당 하나의 page table을 가짐
> 그렇기 때문에 이렇게 4MB씩 테이블이 큰거는 사고임
> -> 프로세스 100개
> -> 400MB를 메모리에서 점유하게 됨...

```
낮은 물리 주소
┌──────────────────────────────────────────────┐
│ Kernel code / Kernel data                    │
│  - 커널 텍스트, 전역 데이터, 각종 자료구조   │
├──────────────────────────────────────────────┤
│ Page table for Process A                     │
│  - A의 linear or multi-level page tables     │
├──────────────────────────────────────────────┤
│ Kernel stack for Process A                   │
│  - A가 system call / interrupt 들어오면 사용 │
├──────────────────────────────────────────────┤
│ User page of Process A (code)                │
├──────────────────────────────────────────────┤
│ User page of Process B (heap)                │
├──────────────────────────────────────────────┤
│ Page table for Process B                     │
├──────────────────────────────────────────────┤
│ Kernel stack for Process B                   │
├──────────────────────────────────────────────┤
│ User page of Process A (stack)               │
├──────────────────────────────────────────────┤
│ User page of Process C (data)                │
├──────────────────────────────────────────────┤
│ Free frame                                   │
├──────────────────────────────────────────────┤
│ Page table for Process C                     │
├──────────────────────────────────────────────┤
│ Kernel stack for Process C                   │
├──────────────────────────────────────────────┤
│ More user pages / buffer cache / etc.        │
└──────────────────────────────────────────────┘
높은 물리 주소

```

> 이렇게 physical memory 첫 프레임 근처에 page table이 생김
> 페이지 테이블은 프로세스당 하나!!!

- 먼저 page table entry를 읽고
- 그다음 실제 데이터 위치를 읽는다


```
Process A의 Virtual Address Space

높은 가상 주소
┌──────────────────────────┐
│ User Stack               │
├──────────────────────────┤
│          빈 공간         │
├──────────────────────────┤
│ Heap                     │
├──────────────────────────┤
│ Data / BSS               │
├──────────────────────────┤
│ Code (Text)              │
└──────────────────────────┘
낮은 가상 주소
```

```
[Linux x86-64: 가상 주소 공간 개념도]

낮은 가상 주소
┌──────────────────────────────┐
│ user code / heap / mmap /    │
│ user stack                   │
└──────────────────────────────┘
          (큰 hole)
┌──────────────────────────────┐
│ kernel virtual address space │  ← 높은 가상 주소
│  - direct mapping            │
│  - vmalloc/ioremap 영역      │
│  - vmemmap                   │
│  - fixmap 등                 │
│  - (여기 어딘가에)            │
│    per-thread kernel stack   │
└──────────────────────────────┘
높은 가상 주소


[Physical RAM]

┌──────────────────────────────┐
│ kernel code/data 일부        │
├──────────────────────────────┤
│ process A user page          │
├──────────────────────────────┤
│ process B page table page    │
├──────────────────────────────┤
│ process A kernel stack용 page│
├──────────────────────────────┤
│ free frame                   │
├──────────────────────────────┤
│ process C user stack page    │
└──────────────────────────────┘

-> **물리 메모리에서는** 각 page가 서로 멀리 떨어져 있을 수 있음
```

page table은 가장 단순하게 보면 **배열**입니다.  

> 운영체제가 VPN을 인덱스로 사용해서 해당 page table entry를 찾고,  

거기서 PFN과 여러 플래그를 읽어 옵니다.

즉, 선형 page table의 기본 아이디어는 단순합니다.  
가상 페이지 번호마다 “이 페이지가 물리 메모리 어디에 있는지”를 한 칸씩 적어 두는 것입니다.

> 하지만 주소 공간이 커질수록 이 배열도 커지므로,  
> 이 단순함이 성능과 공간 측면에서 부담이 될 수 있습니다.

## Common Flags of Page Table Entry

PTE에는 PFN만 들어 있는 것이 아닙니다.  
운영체제는 보호와 상태 관리를 위해 여러 비트를 함께 둡니다.

예를 들면,

- Valid bit: 이 매핑이 유효한가
	- 0이면 접근 시 오류 발생
- R/W: 쓰기 가능한가
	- 0이면 읽기 전용
- U/S(user/supervisor): 사용자 접근 가능한가
	- (0이면 커널만 접근 가능)
- Present: 현재 메모리에 있는가
	- 0이면 디스크에 있음
- Accessed: 최근 접근되었는가
	- TLB용
- Dirty: 쓰기가 발생했는가
	- TLB용

> PTE는 단순 주소 변환 표가 아니라,  
> **보호(protection), 존재 여부(presence), 접근 이력(access history)** 까지 함께 관리하는 구조

> 이후 TLB에서도 해당 정보를 기록하는 이유!!!

## Paging: Too Slow

> paging은 너무 느림!!!

메모리 한 번 접근하려고 해도  
먼저 page table entry를 읽어야 하기 때문입니다.  
즉 원래라면 데이터 한 번 읽으면 끝날 일을,  
paging 환경에서는

1. PTE 읽기
2. 실제 데이터 읽기

두 번 해야 합니다.

> 메모리 접근이 매우 자주 일어난다는 점을 생각하면, 이 추가 비용은 상당히 큼

> 그렇기 때문에 TLB를 사용

## Accessing Memory With Paging

- 가상 주소에서 VPN을 뽑습니다.
- page table base register를 이용해 해당 PTE 주소를 계산합니다.
- PTE를 메모리에서 읽습니다.
- Valid나 protection을 검사합니다.
- 이상이 없으면 PFN과 offset을 합쳐 실제 물리 주소를 만듭니다.
- 그 물리 주소로 진짜 데이터를 읽습니다.

즉, paging의 주소 변환은 생각보다 단순하지만,  
중간에 page table을 읽는 단계가 꼭 들어갑니다.  
그래서 느립니다.

또한 Valid가 false면 segmentation fault,  
보호 비트가 맞지 않으면 protection fault가 발생합니다.  
즉 paging은 주소를 바꾸는 역할뿐 아니라 **잘못된 접근을 막는 보호 장치** 역할도 수행

```c
VPN = (VirtualAddress & VPN_MASK) >> SHIFT
// 마스킹을 통해 VPN 값만 구하기
// 01010001001000000000 101010101001 // virtual address -> VPN(20) + OFFSET(12)
// 11111111111111111111 000000000000 // VPN_MASK
// 01010001001000000000 000000000000 // & 연산
// 00000000000001010001 001000000000 // shift 연산 shift 12칸

PTEAddr = PTBR + (VPN * sizeof(PTE))
// PTEAddr // page table entry address 값을 구해보자
// PTBR // Page Table Base Register // 페이지 테이블의 시작 지점에 대한 레지스터값
// VPN * sizeof(PTE) // virtual page number에 page table entry 하나의 크기를 곱함
// 그럼? page table offset이 나옴
// PTBR + paget table offset = Page Table Entry Address

PTE = AccessMemory(PTEAddr) // page table entry 값을 읽어옴 PTEAddress로부터
// 이때 첫 메모리 접근이 일어남 !!!!!!

// access 가능한지 확인하기
if (PTE.Valid == False) 
	RaiseException(SEGMENTATION_FAULT) // 매핑이 없는 곳을 접근 // segmentation fault
else if (CanAccess(PTE.ProtectionBits) == False) // 접근 권한이 있나? // U/S비트 사용
	RaiseException(Protection_FAULT) // 접근 권한 없음 // protection fault
else // access 가능!!
	offset = VirtualAddress & OFFSET_MASK // OFFSET 가져옴
	// 01010001001000000000 101010101001 // virtual address -> VPN(20) + OFFSET(12)
	// 00000000000000000000 111111111111 // OFFSET_MASK
	// 00000000000000000000 101010101001 // & 연산
	PhysAddr = (PTE.PFN << PFN_SHIFT) | offset 
	// PTE.PFN // page table entry에서 PFN 가져오기
	// PTE.PFN << PFN_SHIFT // page table entry를 왼쪽으로 쉬프트 //
	// PTE.PFN << 12 // PFN만 뽑아온뒤 offset 자리 12칸 쉬프트
	// offset // or 연산 // offset은 Virtual address에서 뽑은걸 그대로 사용
	Register = AccessMemeory(PhysAddr)
	// 실제 값이 존재하는 physical address 접근 // 2번째 접근임!!!


```

> 마지막 PDF는 한번 더 보고 들어가기!!!!!!!!!!!!!!!


---
# TLB(Translation Lookaside Buffer)

> TLB는 CPU 안의 MMU(Memory Management Unit) 일부에 들어 있는 **작은 하드웨어 캐시**

> 자주 쓰이는 **가상 주소 → 물리 주소 변환 결과**를 저장해 두는 캐시

page table 전체를 매번 메모리에서 찾아보는 대신,

- 최근에 자주 참조한 VPN
- 그에 대응하는 PFN
- 그리고 접근 권한 같은 부가 비트

를 칩 안의 빠른 저장 공간에 담아 두고, 다시 같은 페이지를 접근할 때는 page table을 거치지 않고 곧바로 물리 주소를 얻고자 하는 것

```c
VPN = (VirtualAddress & VPN_MASK) >> SHIFT
(Success, TlbEntry) = TLB_Lookup(VPN) // TLB 조회
if (Success) // TLB HIT
	if (CanAccess(TlbEntry.ProtectBit) == True) // Page Table에서 하던거 똑같이 체크
	{
		offest = VirtualAddress & OFFSET_MASK
		PhysAddr = (TlbEntry.PFN << SHIFT) | offset
		AccessMemory( PhysAddr ) // physical memory에 첫번째 접근
	} else RaiseException(PROTECTION_FAULT)
else // TLB MISS
{
	PTEAdrr = PTBR + (VPN * sizeof(PTE))
	PTE = AccessMemory(PTEaddr); // page table에 접근하여 page table entry 가져옴
	if (PTE.Valid == False) // 유효성 체크
	{
		RaiseException(SEGEMENT_FAULT)
	}
	else
	{
		TLB_INSERT( VPN, PTE.PFN, PTE.ProtectBits ) // TLB에 PTE 내용 저장
		RetryInstruction() // 다시 돌려서 TLB Hit을 노림
	}
}
```


1. TLB LookUp
	1. TLB Hit
		1. protection bit 확인 (valid도 확인하긴 함 원래)
		2. Physical Address 접근
	2. TLB Miss
		1. valid bit 확인
		2. Page Table Entry 접근
		3. Page Table의 PFN과 Protection Bit, VPN 정보 등을 담아 TLB Insert
		4. instruction 재실행

> TLB의 효과를 잘 보여 주는 전형적인 예가 **배열 순차 접근**

```c
int sum = 0;
for (int i=0; i<10; i++)
{
	sum+=a[i];
}

//
          OFFSET
VPN    00 04 08 12 16
03        a[0]a[1]a[2]
04    a[3]a[4]a[5]a[6]
05    a[7]a[8]a[9]


// 이렇게 보면 
a[0] a[1] a[2]
a[3] a[4] a[5] a[6]
a[7] a[8] a[9]
// 이렇게 각각 한 묶음으로 한 페이지로 만들어지는데
// 첫 번째 접근에서는 miss가 날 수 있지만, 그 뒤의 접근들은 hit가 많이 날 가능성이 큽니다.

a[0], a[3], a[7] - miss
a[1], a[2], a[4], a[5], a[6], a[8], a[9] -hit

// 70%는 TLB HIT이 됨
```

> 공간 지역성(spatial locality)

> 즉, 한 번 어떤 주소를 접근했다면, 곧바로 그 근처 주소를 또 접근할 가능성이 높다는 뜻

## Locality

### Temporal locality
최근에 접근한 항목은 곧 다시 접근할 가능성이 높다.

### Spatial locality
어떤 주소 x를 접근했다면, 그 근처 주소도 곧 접근할 가능성이 높다.

> TLB는 페이지 단위 번역을 캐시하므로, 특히 **spatial locality**가 아주 중요

## TLB의 처리 주체 Hardware vs OS

### CISC 계열

대표적으로 x86 계열은 **하드웨어가 TLB miss를 직접 처리**합니다.  
즉, 하드웨어가 page table을 walk해서 원하는 PTE를 찾고, TLB를 갱신한 뒤 명령을 재시도합니다.
> 이걸 hardware-managed TLB라고 부릅니다.

### RISC 계열

일부 RISC 구조에서는 TLB miss 시 하드웨어가 직접 page table을 걷지 않고,  
**예외를 발생시켜 OS의 trap handler가 처리**하게 합니다.  
즉, miss가 나면 OS가 개입해서 적절한 translation을 넣어 주는 것입니다. 
> 이를 software-managed TLB라고 부릅니다.


```c
VPN = (VirtualAddress & VPN_MASK) >> SHIFT
(Success, TlbEntry) = TLB_Lookup(VPN) // TLB 조회
if (Success) // TLB HIT
	if (CanAccess(TlbEntry.ProtectBit) == True) // Page Table에서 하던거 똑같이 체크
	{
		offest = VirtualAddress & OFFSET_MASK
		PhysAddr = (TlbEntry.PFN << SHIFT) | offset
		AccessMemory( PhysAddr ) // physical memory에 첫번째 접근
	} else RaiseException(PROTECTION_FAULT)
else // TLB MISS
{
	RaiseException(TLB_MISS) // Trap Handler로 TLB MISS -> INSERT -> RETRY
//	PTEAdrr = PTBR + (VPN * sizeof(PTE))
//	PTE = AccessMemory(PTEaddr); // page table에 접근하여 page table entry 가져옴
//	if (PTE.Valid == False) // 유효성 체크
//	{
//		RaiseException(SEGEMENT_FAULT)
//	}
//	else
//	{
//		TLB_INSERT( VPN, PTE.PFN, PTE.ProtectBits ) // TLB에 PTE 내용 저장
//		RetryInstruction() // 다시 돌려서 TLB Hit을 노림
//	}
}
```

## TLB Entry

TLB entry는 단순히 VPN과 PFN만 저장하는 것이 아님

- VPN
	- 여기서 VPN을 저장하는 것을 보면 알듯이
	- TLB Entry는 인덱싱 접근하지 않음
		- 순서 보장되지 않음
		- Page Table 처럼 모든걸 저장하지 않기 때문
- PFN
- valid bit
- protection bit
- dirty bit
- address-space identifier(ASID)
- 기타 하드웨어 캐시 관련 비트

> TLB entry는 **작은 page table entry의 캐시판**

TLB는 보통 크기가 아주 크지 않습니다.  
예를 들어 32개, 64개, 128개 정도의 entry를 갖는 경우가 많습니다.

### Fully Associative 접근

특정 VPN이 들어 있다면 TLB의 어느 슬롯에든 있을 수 있으므로, 하드웨어는 전체 entry를 병렬적으로 비교해서 원하는 VPN을 찾아냄

가능한 이유:
TLB가 작고, CPU 내부에 있기 때문

> 작은 개수의 entry를 빠르게 병렬 비교하는 구조

## Context Switch in TLB

> TLB는 딱 1개만 존재 
> CPU안에 1개

-> A의 10인지 B의 10인지 구분할 수 없음

> 그렇기 때문에 TLB Entry에 ASID(Address Space Identifier)를 추가

- 프로세스 A의 VPN 10 → PFN 100, ASID=1
- 프로세스 B의 VPN 10 → PFN 170, ASID=2

> context switch가 일어나도 TLB를 무조건 다 비우지 않고, 
> ASID를 통해 서로 다른 프로세스의 translation을 안전하게 공존

공유 페이지는 어떻게 함?
-> TLB 상에서는 뭐 
- (VPN, ASID) → PFN
로 구분되니깐... 딱히 상관 없음

그냥 같은 PFN이 있는 VPN이 다른게 같이 들어있을 뿐임...


## TLB Replacement Policy

TLB 크기는 작기 때문에 새 entry를 넣으려면 오래된 것을 빼야 할 때가 있습니다.  
이때 어떤 것을 내보낼지 결정하는 정책이 필요합니다.

> 대표적으로 **LRU(Least Recently Used)** 가 자주 소개됨

> 최근에 가장 오래 사용되지 않은 entry를 내보내는 방식

> 이것은 특히나 Temporal locality를 고려한 방식임

최근에 사용된 것은 쓰일 가능성이 높다!!!!

![[Pasted image 20260419190947.png]]


---
# Smaller Table

> 페이지 테이블이 너무 크다!!

가상 주소를 VPN과 offset으로 나누고, VPN으로 페이지 테이블을 인덱싱해서 PTE를 찾아 PFN을 얻는 구조를 봤다. 그런데 이 구조를 그대로 쓰면, 프로세스마다 **선형(linear) 페이지 테이블** 하나를 통째로 가져야 하므로 메모리 낭비가 커진다.


```
예를 들어 32비트 주소 공간, 페이지 크기 4KB, PTE 크기 4바이트라고 해 보자.  
전체 가상 주소 공간은 2^32 byte이고, 페이지 수는 2^32 / 2^12 = 2^20개다.  
각 페이지마다 PTE가 하나씩 필요하므로 페이지 테이블 크기는

2^20 × 4 byte = 4MB

-> **프로세스 하나당 페이지 테이블만 4MB**가 필요
```


## Page 크기를 키우면 되지 않나?


```
예를 들어 페이지 크기를 4KB 대신 16KB로 키우면, 전체 페이지 수는 줄어든다.  
페이지 수가 줄어들면 PTE 수도 줄어들고, 따라서 페이지 테이블도 작아진다.


2^20 × 4 byte = 4MB
->
2^32 / 2^14 = 2^18 // page entry 갯수
2^18 * 4 Byte = 1MB / 페이지 테이블 크기

```


> 하지만... 이러면 Internal Fragmentation이 커짐
> page 한 개의 크기가 커졌기 때문


## 진짜 문제

> 프로세스의 주소 공간 전체에 대해 페이지 테이블 엔트리를 만들어야 한다

현실의 프로세스는 자신의 주소 공간 전체를 사용하지 않는다.

> 예를 들어 코드 일부, 힙 일부, 스택 일부만 실제로 사용하고, 나머지 큰 구간은 비어 있는 경우가 많다

- 실제로 쓰는 페이지는 몇 개 안 되는데
- 페이지 테이블은 주소 공간 전체를 커버하도록 커다랗게 만들어야 한다.

-> 지금의 문제는 VPN이 생길 수 있는 만큼의 Page Table을 만들어야함....

페이지 테이블 안에는 **invalid entry가 대량으로 존재**하게 된다.  
이 invalid entry들은 실제로 의미 있는 매핑을 하지 않지만, 그 자리 자체는 메모리를 차지함


## Hybrid Approach

> “프로세스 주소 공간 전체를 하나의 선형 페이지 테이블로 관리하지 말고,  
> **세그먼트별로 페이지 테이블을 따로 두면 되지 않을까?**”

여기서는 가상 주소를 단순히 VPN + offset으로 나누는 것이 아니라,

- 상위 몇 비트는 **segment number(SN)**
- 그 다음 비트들은 **VPN**
- 마지막 비트들은 **offset**

> 세그먼트와 세그먼트 사이 또는 세그먼트 바깥에 존재하는 큰 unused virtual range에 대한 page-table 공간이 줄어든다

- code ↔ heap 사이
- heap ↔ stack 사이
- 그 외 세그먼트 바깥쪽 unused range

```
00 / unused segment
01 / code
10 / heap
11 / stack

2bit/18bit           /12bit
seg / vpn ---------> / offset ----->
```

- 사용하지 않는 큰 빈 영역에 대해서는 페이지 테이블을 안 둘 수 있다.
- 코드/힙/스택처럼 실제로 필요한 구간만 관리하면 된다.
- 따라서 선형 페이지 테이블 전체를 두는 것보다 공간을 절약할 수 있다.

```c
SN = (VirtualAddress & SEG_MASK) >> SN_SHIFT
VPN = (VirtualAddress & VPN_MASK) >> VPN_SHIFT
AddressOfPTE = Base[SN] + (VPN * sizeof(PTE))
```


왜냐하면 세그먼트 단위로는 줄였지만,  
각 세그먼트 내부에서는 여전히 **선형 페이지 테이블** 을 사용하기 때문이다.

예를 들어 힙이 매우 크지만 듬성듬성 쓰인다면,  
힙 세그먼트용 페이지 테이블 안에도 invalid entry가 잔뜩 생긴다.

> 희소하게(sparsely) 사용되는 세그먼트 내부 낭비는 여전히 남는다.
> -> segmentation시 external fragmentation 문제가 다시 발생할 수 있음


## Multi-Level Page Table

> 선형 페이지 테이블을 그대로 하나의 거대한 배열로 두지 말고,  
> **여러 개의 페이지 크기 조각(page-sized unit)으로 잘게 나누자.**

- **전부 invalid인 페이지 테이블 조각** 은
- **아예 물리 메모리에 할당하지 않는다.**

> “페이지 테이블도 페이지 단위로 쪼개고, 필요한 부분만 실제로 만든다”

page directory 등장!

page directory는 각 페이지 테이블 조각을 대표하는 상위 구조다.  
각 엔트리(PDE)는 “해당 페이지 테이블 페이지가 존재하는가?”를 나타내는 valid bit와,  
존재한다면 그 페이지 테이블 페이지가 들어 있는 PFN을 가진다.

- PDE(Page Directory Entry)
	- “그 아래 페이지 테이블 페이지가 있나?”
- PTE(Page Table Entry)
	- “그 가상 페이지가 어느 물리 프레임에 매핑되나?”

> 사용하지 않는 영역을 위한 페이지 테이블 페이지를 아예 만들지 않아도 된다


```
예를 들어 어떤 큰 선형 페이지 테이블을 16개의 페이지로 나눴다고 하자.  
그런데 실제로 매핑이 존재하는 엔트리가 page 0, page 4, page 15에만 몰려 있다면,  
나머지 13개의 페이지 테이블 페이지는 전부 invalid entry뿐일 것이다.

선형 페이지 테이블이라면 16개를 전부 메모리에 둬야 한다.  
하지만 멀티레벨 구조에서는

- page directory 1개
- 실제로 필요한 page table page 3개
```

- 주소 공간을 사용하는 양에 비례해서만 페이지 테이블 공간을 쓴다.
- 안 쓰는 구간은 invalid PDE 하나로 “여긴 없음”이라고 압축 표현할 수 있다.
- 그래서 희소한(sparse) 주소 공간에서 매우 효율적이다.


```
- Address space: 16KB = 2^14 byte
	- 따라서 virtual address = 14 bit
- Page size: 64 byte = 2^6 byte
	- 따라서 offset = 6 bit
	- offset 1bit는 1byte를 가리킴
- VPN = 14 - 6 = 8 bit

즉, 가상 페이지 수는 2^8 = 256개다.

PTE 크기가 4바이트이므로, 선형 페이지 테이블 전체 크기는

256 × 4 byte = 1024 byte = 1KB

이다.

그런데 페이지 크기가 64B이므로,  
이 1KB짜리 페이지 테이블을 페이지 단위로 나누면

1024 / 64 = 16페이지

가 된다.

즉, 선형 페이지 테이블은 **16개의 페이지 테이블 페이지** 로 구성된다.

---------------- - linear page table


이제 이 16개 각각을 가리키기 위해 page directory가 필요하다.  
page directory는 “페이지 테이블의 각 페이지마다 하나의 PDE”를 가진다.  
즉 PDE가 16개 필요하다.

PDE 하나도 4바이트라고 하면,

16 × 4 byte = 64 byte

가 된다.

그리고 page size가 64 byte이므로,  
**page directory 전체가 딱 한 페이지에 들어간다.**

이 예제에서 가상 주소는 결국 다음처럼 쪼개진다.

- 상위 4비트: Page Directory Index
- 그 다음 4비트: Page Table Index
- 마지막 6비트: Offset

즉,

14비트 VA = 4비트 PDI + 4비트 PTI + 6비트 offset

이 된다.
```


## Two-level Paging 실제 주소 변환

먼저 가상 주소에서 VPN을 추출하고,  
그 VPN의 상위 일부 비트는 **Page Directory Index** 로 사용한다.

- Page directory base register(PDBR)를 기준으로 PDE 주소를 계산한다.
- PDE를 읽는다.
- PDE가 invalid면, 그 영역은 아예 존재하지 않는 것이므로 예외를 발생시킨다.
- PDE가 valid면, 그 PDE가 가리키는 page table page의 PFN을 얻는다.
- 가상 주소의 나머지 VPN 비트를 **Page Table Index** 로 써서, 해당 page table page 안의 PTE를 찾는다.
- PTE에서 PFN을 얻고, 마지막 offset과 합쳐 최종 physical address를 만든다.

- single level
	- VPN → 바로 PTE
- multi level
	- VPN → PDE → PTE

> 이 과정 때문에 멀티레벨 페이지 테이블은 **공간은 절약하지만, 접근은 더 복잡**해진다.


## 왜 더 깊은 레벨이 필요한가?

실제 주소 공간이 더 크면 page directory 자체도 다시 커질 수 있다.

```
예를 들어 가상 주소가 30비트이고 페이지 크기가 512B라면,

// 2^30 -> address space 
// 2^9  -> page size
// 9bit for offset
// 21bit for vpn // 30 - 9 = 21

- offset = 9 bit
- VPN = 21 bit

가 된다.

PTE 크기가 4바이트이고 페이지 크기가 512B이면,  
한 page table page 안에는

// 4Byte -> PTE
// 512Byte -> page Size
// 512 / 4 = 128개 -> page table entry가 128개가 됨.

512 / 4 = 128 = 2^7개의 PTE

가 들어간다.

즉, VPN 21비트를 한 번에 다 처리할 수 없고,  
한 page table page가 담당할 수 있는 건 7비트 분량뿐이다.

그러면 페이지 테이블 전체는 2^14개의 page table page로 쪼개지게 되고,  
이걸 가리키는 page directory도 또 커진다.

-> page directory entry가 2^14개가 되어버림


---
그럼 3-level bit수 계산을 해봅시다.

PDE가 4byte라면?

512 Byte / 4 Byte -> page directory page의 entry가 128개

1page에 2^7 PDE가 들어감

- page directory directory index 7 bit
- page directory index 7 bit 
- page table index 7 bit 
- offset 9 bit
```


> page directory 자체도 다시 페이지 단위로 나누어야 한다.

- page directory directory
- page directory
- page table

**3-level**, 더 나아가 **4-level** 이상으로 확장된다.

> 주소 공간 크기와 페이지 크기, 그리고 한 페이지에 들어갈 엔트리 수에 따라 결정됨


## trade off with time & space

멀티레벨 페이지 테이블은 공간을 절약하지만, 그 대가로 시간이 더 든다.

왜냐하면 주소 변환 시 메모리를 여러 번 더 읽어야 하기 때문이다.

선형 페이지 테이블이라면 TLB miss 시 보통 페이지 테이블에서 PTE를 한 번 읽으면 된다.  
하지만 2-level paging에서는

- PDE 읽기
- PTE 읽기
- 실제 데이터 접근

이 필요하다.

즉, TLB miss가 났을 때 메모리 접근이 더 늘어난다.

3-level이면 더 심하다.

- 1단계 디렉토리 읽기
- 2단계 디렉토리 읽기
- PTE 읽기
- 실제 데이터 접근

처럼 된다.

그래서 멀티레벨 페이지 테이블은 전형적인 **time-space trade-off** 다.

- 공간 측면: 훨씬 효율적
- 시간 측면: TLB miss 시 더 비쌈
- 구조 측면: 더 복잡함

```c
VPN = (VirtualAddress & VPN_MASK) >> SHIFT
(Success, TlbEntry) = TLB_Lookup(VPN) // TLB 조회
if (Success) // TLB HIT
	if (CanAccess(TlbEntry.ProtectBit) == True) // Page Table에서 하던거 똑같이 체크
	{
		offest = VirtualAddress & OFFSET_MASK
		PhysAddr = (TlbEntry.PFN << SHIFT) | offset
		AccessMemory( PhysAddr ) // physical memory에 첫번째 접근
	} else RaiseException(PROTECTION_FAULT)
else // TLB MISS
{
	PDIndex = (VFN & PD_MASK) >> PD_SHIFT
	PDEAddr = PDBR + (PDIndex * sizeof(PDE))
	PDE = AccessMemory(PDEAddr)
	if (PDE.Valid == False)
		RaiseException(SEGEMENT_FAULT)
	else
	{
		PTIndex = (VFN & PT_MASK) >> PT_SHIFT
		PTEAdrr = PTBR + (VPN * sizeof(PTE))
	 	PTE = AccessMemory(PTEaddr); // page table에 접근하여 page table entry 가져옴
		if (PTE.Valid == False) // 유효성 체크
		{
			RaiseException(SEGEMENT_FAULT)
		}
		else
		{
			TLB_INSERT( VPN, PTE.PFN, PTE.ProtectBits ) // TLB에 PTE 내용 저장
			RetryInstruction() // 다시 돌려서 TLB Hit을 노림
		}
	}
}
```


> 멀티레벨 페이지 테이블은 worst-case 크기를 없애는 기법이 아니라, “sparse한 보통의 경우에는 덜 쓰고, dense한 worst-case가 되면 그때 커지는” 기법이다.

## Inverted Page Table

**Linear page table / Hybrid / Multi-level**은 전부 기본적으로  
**“가상 페이지 번호(VPN) → 물리 프레임 번호(PFN)”를 찾기 쉽게 만들려는 구조**고,  
**Inverted page table**은 반대로  
**“페이지 테이블 크기 자체를 물리 프레임 수 기준으로 줄이자”는 구조

- 프로세스마다 page table이 하나씩 필요함
- virtual address space가 크면 page table도 커짐
- multi-level로 줄여도, 결국 많은 프로세스가 있으면 page table 오버헤드가 계속 큼

> page table 크기가 virtual address space 크기에 비례한다

```
기준이 **PFN(물리 프레임 번호)** 이야.

즉:

PFN 0 -> 지금 누구의 어떤 VPN이 들어있음?  
PFN 1 -> 지금 누구의 어떤 VPN이 들어있음?  
PFN 2 -> 지금 누구의 어떤 VPN이 들어있음?  
...

즉, 물리 메모리의 각 frame마다 엔트리 하나씩만 둔다.
```


> **시스템 전체에서 물리 프레임 개수만큼만 엔트리**를 둔다


즉, 물리 메모리가 1GB고 page size가 4KB면
PFN 개수 = 1GB / 4KB

- 프로세스가 1개든 100개든
- 가상 주소 공간이 크든 작든

**page table의 총 엔트리 수는 물리 프레임 수 기준으로 정해진다**


일반 page table에서는 lookup이 쉬웠다.

VPN을 인덱스로 바로 접근

하면 됐다.

그런데 inverted page table은 표가 이렇게 생겼다:

PFN 0 : (process A, VPN 12)  
PFN 1 : (process B, VPN 3)  
PFN 2 : (process A, VPN 80)  
PFN 3 : (process C, VPN 1)  
...

이제 우리가 알고 싶은 건 보통:

> “현재 프로세스의 VPN 10은 어디 있지?”

인데,

테이블은 PFN 기준으로 되어 있으니까  
이걸 찾으려면:

- 엔트리들을 뒤져서
- `(현재 프로세스, VPN 10)`을 찾고
- 그때의 PFN을 알아내야 해

즉, 그냥 두면 **검색이 어려워진다.**

> 공간은 아끼는데, 검색이 어려워진다


---
# 메모리 가상화 정리

## 0. 배경: 프로세스마다 자기만의 메모리가 있는 것처럼 보여야 함

- **문제**
    - 실제 물리 메모리는 하나인데, 여러 프로세스가 동시에 돌아가려면 각자 **독립된 메모리 공간**을 가진 것처럼 보여야 함
    - 한 프로세스의 잘못된 접근이 다른 프로세스나 OS를 망가뜨리면 안 됨
- **필요한 것**
    - 각 프로세스에 **private address space 환상** 제공
    - **보호(isolation)** 와 **효율성**을 동시에 만족해야 함
- **출발점**
    - 8번 PDF에서 address space, virtual address 개념으로 본격 시작

---

## 1. 초기 관점: “프로세스마다 하나의 연속된 주소 공간”을 주자

- **등장한 생각**
    - 프로세스는 code, heap, stack 등을 가진 **하나의 address space**를 가진다고 보자
    - 프로그램이 보는 주소는 전부 **virtual address**이고, OS/하드웨어가 이를 실제 물리 메모리와 연결해 준다
- **좋았던 점**
    - 프로그래머 입장에서는 메모리를 단순하게 볼 수 있음
    - 각 프로세스가 전체 메모리를 혼자 쓰는 것처럼 보임
- **하지만 아직 남은 문제**
    - 이 address space를 **실제 물리 메모리 어디에 둘 것인가**
    - 다른 프로세스 영역을 침범하지 않게 하려면 어떻게 할 것인가

---

## 2. Base-and-Bounds: 연속 주소 공간을 통째로 재배치하자

- **문제**
    - 프로세스의 주소 공간은 가상적으로 0부터 시작하지만, 실제 물리 메모리에서는 아무 위치에나 놓고 싶음
    - 또한 자기 주소 공간 밖으로 나가는 접근은 막아야 함
- **해결**
    - **base register**: 이 프로세스 주소 공간이 물리 메모리 어디서 시작하는지
    - **bounds register**: 이 프로세스 주소 공간의 크기/범위가 어디까지인지
    - 주소 변환:
        - `physical = virtual + base`
        - 단, `virtual < bounds` 여야 함
- **좋았던 점**
    - 구현이 단순함
    - 빠름
    - 보호도 가능함
- **하지만 새 문제**
    - 프로세스의 주소 공간 전체를 **하나의 큰 연속 덩어리**로 취급함
    - 실제로 code/heap/stack 사이 빈 공간까지 포함해서 메모리를 잡아야 하므로 **낭비가 큼**
    - 주소 공간이 커지면 **연속된 큰 빈 공간**이 필요해서 적재가 어려움
- **그래서 다음으로**
    - “전체를 한 덩어리로 보지 말고, 의미 있는 부분별로 나누자” → **Segmentation**

---

## 3. Segmentation: code / heap / stack을 따로 두자

- **Base-and-Bounds의 핵심 문제**
    - 주소 공간 전체를 한 덩어리로 보면 내부에 비어 있는 부분까지 메모리를 낭비함
    - 특히 sparse address space에 비효율적
- **해결**
    - 주소 공간을 **논리적으로 다른 segment**로 나눔
        - code
        - heap
        - stack
    - 각 segment마다 **자기만의 base/bounds**를 둠
    - 그러면 code는 물리 메모리 한쪽, heap은 다른 쪽, stack은 또 다른 쪽에 둘 수 있음
- **좋았던 점**
    - sparse address space를 훨씬 잘 지원함
    - code sharing도 쉬움
    - translation overhead도 작음
- **하지만 새 문제**
    - segment 크기가 **가변 크기(variable-sized)** 임
    - 물리 메모리에 여기저기 segment를 넣다 보면 **external fragmentation** 발생
    - 총 free memory는 충분해도, **하나의 큰 연속 공간이 없어서** 할당을 못하는 경우가 생김
    - compaction으로 해결할 수는 있지만 비쌈
- **그래서 다음으로**
    - “가변 크기 덩어리 말고, 아예 고정 크기 단위로 쪼개자” → **Paging**

---

## 4. Free-Space Management: 가변 크기 할당 자체가 어려움

- **Segmentation과 연결된 실무 문제**
    - 가변 크기 block을 할당/해제하다 보면 memory hole이 생김
    - split, coalescing, best fit, first fit 등을 해도 단편화 문제가 계속 남음
- **해결 시도**
    - free list
    - splitting / coalescing
    - best fit / worst fit / first fit / next fit
    - McKusick-Karels allocator
    - Buddy system
- **좋았던 점**
    - 힙 관리 측면에서 다양한 최적화 가능
- **하지만 근본 한계**
    - 결국 여전히 **가변 크기 공간을 잘게 나누고 다시 합치는 문제**를 다루고 있음
    - external fragmentation을 완전히 제거하지 못함
- **그래서 다음으로**
    - “아예 모든 단위를 같은 크기로 맞추자” → **Paging**으로 넘어감

---

## 5. Paging: 가상 공간과 물리 메모리를 고정 크기 단위로 나누자

- **Segmentation / free-space management의 핵심 문제**
    - 가변 크기 segment 때문에 external fragmentation이 발생
    - 연속된 공간을 찾는 것이 어렵다
- **해결**
    - 가상 주소 공간을 **page**라는 고정 크기 단위로 분할
    - 물리 메모리도 같은 크기의 **page frame**으로 분할
    - 각 virtual page가 어떤 physical frame에 들어가는지는 **page table**이 기록
- **좋았던 점**
    - 외부 단편화를 크게 줄임
    - free-space 관리가 단순해짐
    - heap/stack이 어떻게 자랄지 미리 크게 신경 쓸 필요가 없음
- **하지만 새 문제**
    - page table이 커질 수 있음
    - 메모리 접근할 때마다
        1. page table entry 읽고
        2. 실제 데이터 읽고  
            해야 해서 **너무 느림**
- **그래서 다음으로**
    - “자주 쓰는 주소 변환 결과를 캐시하자” → **TLB**

---

## 6. TLB: paging은 좋은데 너무 느리다

- **Paging의 핵심 문제**
    - 매 메모리 참조마다 page table을 보러 가면 추가 메모리 접근이 필요함
    - 즉, address translation cost가 너무 큼
- **해결**
    - MMU 안에 **TLB(Translation Lookaside Buffer)** 라는 작은 하드웨어 캐시를 둠
    - 자주 쓰는 VPN → PFN 변환 결과를 저장
- **좋았던 점**
    - TLB hit가 나면 page table까지 안 가도 됨
    - locality를 활용해 translation 속도를 크게 개선
- **하지만 새 문제**
    - context switch 시 다른 프로세스의 translation과 섞일 수 있음
    - 그래서 **ASID** 같은 구분자가 필요
    - TLB miss 처리 방식도 하드웨어/소프트웨어 설계 차이가 생김
- **결론**
    - Paging 자체를 버린 게 아니라, **Paging을 실용적으로 만들기 위해 TLB를 붙인 것**임

---

## 7. Page Table 자체의 문제: 너무 크다

- **문제**
    - linear page table은 단순하지만 주소 공간이 커지면 너무 큼
    - 실제로는 address space 전체를 다 쓰지도 않는데, page table은 그 전체를 표현해야 함
- **해결 방향**
    - page table을 더 작고 효율적으로 만들려는 방향으로 발전
- **그 흐름**
    - 큰 단일 page table → 더 작은 구조 → 계층적 구조
    - 즉 **multi-level page table**로 발전
- **이유**
    - 실제로 사용되는 부분만 table을 두고 싶기 때문
    - sparse address space에 더 잘 맞추기 위해서
- **그래서 다음으로**
    - **Multi-Level Paging / Smaller Tables**

---

## 8. Multi-Level Page Table: page table도 필요한 부분만 만들자

- **기존 문제**
    - linear page table이 너무 큼
    - 안 쓰는 주소 영역에 대해서도 PTE 공간을 낭비
- **해결**
    - page table을 여러 단계로 나눔
    - 상위 단계가 “이 하위 page table이 존재하는가”를 가리키게 함
    - 실제로 쓰는 virtual address 범위에 대해서만 하위 table을 만듦
- **좋았던 점**
    - 메모리 절약
    - sparse address space에 적합
- **대가**
    - page walk가 더 복잡해짐
    - TLB miss 시 여러 단계 table을 따라가야 하므로 비용 증가
- **그래도 유지되는 이유**
    - table 공간 절약 효과가 매우 큼
    - 현대 시스템에서 paging을 현실적으로 운영하는 핵심 방식

---

## 9. 최종 큰 흐름 한 줄 요약

- **연속 주소 공간 하나 통째로 배치**
    - 단순하지만 낭비 큼 → **Base-and-Bounds**
- **논리 단위별로 따로 배치**
    - sparse space엔 좋지만 가변 크기라 외부 단편화 → **Segmentation**
- **가변 크기 관리 최적화 시도**
    - free list, coalescing, buddy 등 → 그래도 근본 해결 아님
- **고정 크기 page/frame으로 통일**
    - 외부 단편화 완화 → **Paging**
- **paging이 느림**
    - translation cache 추가 → **TLB**
- **page table이 큼**
    - 필요한 만큼만 만들자 → **Multi-Level Page Table**

---

## 시험용 초압축 버전

- **Base-and-Bounds**
    - 문제: 주소 공간 전체를 한 덩어리로 잡아야 해서 낭비 큼
    - 해결: base/bounds로 relocation + protection
    - 한계: sparse address space 비효율
- **Segmentation**
    - 문제: 전체를 한 덩어리로 보는 것이 비효율
    - 해결: code/heap/stack을 따로 배치
    - 한계: variable-sized allocation이라 external fragmentation
- **Free-Space Management**
    - 문제: 가변 크기 free space 관리가 어렵고 hole 발생
    - 해결: split/coalesce, fit 전략, buddy 등
    - 한계: 단편화 근본 해결 못 함
- **Paging**
    - 문제: 연속 공간 필요 / external fragmentation
    - 해결: page/frame의 고정 크기 분할 + page table
    - 한계: 주소 변환이 느림, page table이 큼
- **TLB**
    - 문제: paging의 translation overhead
    - 해결: 자주 쓰는 변환 결과 캐시
- **Multi-Level Page Table**
    - 문제: linear page table 메모리 낭비
    - 해결: 필요한 부분만 page table 생성