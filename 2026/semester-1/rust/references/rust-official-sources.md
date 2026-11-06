# Rust 공식 문서 소스 + 강의 모듈 매핑

위키 작성 시 **모든 모듈은 반드시 아래 공식 문서 중 1개 이상을 출처로 링크**해야 합니다.
한국 초보 개발자를 위한 자료이므로 **한국어 번역(doc.rust-kr.org)을 1순위**, 영문 원본을 2순위로 둡니다.

## 1순위: 공식 한국어 자료

| 자료 | URL | 용도 |
|---|---|---|
| **The Rust Programming Language (한국어 2021 에디션)** | https://doc.rust-kr.org/ | 모든 개념 설명의 기본 출처. 강의 모듈의 거의 모든 항목이 이 책 챕터에 1:1 매핑됨. |
| 한국 러스트 사용자 그룹 | https://rust-kr.org/ | 커뮤니티 링크/리소스 모음 |
| 러스트 프로그래밍 공식 가이드 (제이펍, 2024) | 종이책 | "더 깊이 보기" 추천 도서로만 언급 |

## 2순위: 공식 영어 자료

| 자료 | URL | 용도 |
|---|---|---|
| The Rust Book (원본) | https://doc.rust-lang.org/book/ | 한국어판에 없는 최신 챕터(예: async)는 여기 사용 |
| Rust by Example | https://doc.rust-lang.org/rust-by-example/ | 짧은 코드 예제가 필요할 때 |
| std 라이브러리 문서 | https://doc.rust-lang.org/std/ | API 시그니처/예제 출처 |
| Rustlings (인터랙티브 연습) | https://rustlings.cool/ | 각 step 끝의 "더 연습하기"로 추천 |
| Cargo Book | https://doc.rust-lang.org/cargo/ | Step 2, Step 8 모듈에서 의존성/명령어 출처 |
| crates.io | https://crates.io/ | 외부 크레이트 검색 |
| docs.rs | https://docs.rs/ | 외부 크레이트 API 문서 |
| rustup 공식 사이트 | https://rustup.rs/ | Step 2 설치 절의 권위 있는 출처 |

## 강의 모듈 → Rust Book(한국어) 챕터 매핑

각 모듈의 "📚 공식 문서" 블록에 아래 링크를 그대로 사용하세요. 한 모듈에 1~3개 링크가 적절합니다.

### Step 1 — 강의 개요 / 왜 Rust인가
- 들어가기에 앞서: https://doc.rust-kr.org/foreword.html
- 소개: https://doc.rust-kr.org/ch00-00-introduction.html

### Step 2 — 개발환경
- **M1 (설치/Cargo)**:
  - 1.1 설치: https://doc.rust-kr.org/ch01-01-installation.html
  - 1.2 Hello, World!: https://doc.rust-kr.org/ch01-02-hello-world.html
  - 1.3 Hello, Cargo!: https://doc.rust-kr.org/ch01-03-hello-cargo.html
  - rustup 공식: https://rustup.rs/
- **M2 (디버거)**:
  - 한국어판에는 디버거 챕터가 없음 → CodeLLDB 공식 문서 https://github.com/vadimcn/codelldb 와 rust-analyzer https://rust-analyzer.github.io/ 사용

### Step 3 — 변수·타입·제어흐름·함수
- **M1 불변성/mut/const/섀도잉**: https://doc.rust-kr.org/ch03-01-variables-and-mutability.html
- **M2 데이터 타입/타입 추론/튜플/배열/&str vs String**:
  - https://doc.rust-kr.org/ch03-02-data-types.html
  - String vs &str (8장): https://doc.rust-kr.org/ch08-02-strings.html
- **M3 제어흐름**: https://doc.rust-kr.org/ch03-05-control-flow.html
  - 표현식 vs 구문: https://doc.rust-kr.org/ch03-03-how-functions-work.html
- **M4 함수 + cargo test**:
  - 함수: https://doc.rust-kr.org/ch03-03-how-functions-work.html
  - 테스트: https://doc.rust-kr.org/ch11-01-writing-tests.html

### Step 4 — Ownership·Borrowing·Lifetime
- **M1 소유권**: https://doc.rust-kr.org/ch04-01-what-is-ownership.html
- **M2 빌림/참조**: https://doc.rust-kr.org/ch04-02-references-and-borrowing.html
  - 슬라이스: https://doc.rust-kr.org/ch04-03-slices.html
- **M3 라이프타임**: https://doc.rust-kr.org/ch10-03-lifetime-syntax.html

### Step 5 — Structs·Enums·Pattern Matching·Traits
- **M1 구조체**: https://doc.rust-kr.org/ch05-00-structs.html, https://doc.rust-kr.org/ch05-03-method-syntax.html
- **M2 열거형/Option**: https://doc.rust-kr.org/ch06-01-defining-an-enum.html
- **M3 패턴 매칭**:
  - match: https://doc.rust-kr.org/ch06-02-match.html
  - if let: https://doc.rust-kr.org/ch06-03-if-let.html
  - 패턴 전반: https://doc.rust-kr.org/ch18-00-patterns.html
- **M4 트레이트**: https://doc.rust-kr.org/ch10-02-traits.html
  - 트레이트 객체(dyn): https://doc.rust-kr.org/ch17-02-trait-objects.html

### Step 6 — 프로젝트 계획 (강의 운영, 직접 매핑 챕터 없음)
- 참고: Cargo Book — 새 프로젝트 생성 https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html

### Step 7 — Generics·Error·Closure·Iterator
- **M1 제네릭**: https://doc.rust-kr.org/ch10-01-syntax.html
- **M2 에러 처리**:
  - https://doc.rust-kr.org/ch09-00-error-handling.html
  - panic!: https://doc.rust-kr.org/ch09-01-unrecoverable-errors-with-panic.html
  - Result/?: https://doc.rust-kr.org/ch09-02-recoverable-errors-with-result.html
- **M3 클로저**: https://doc.rust-kr.org/ch13-01-closures.html
- **M4 이터레이터**: https://doc.rust-kr.org/ch13-02-iterators.html

### Step 8 — Modules·Smart Pointers·Concurrency·Async
- **M1 모듈/Cargo**:
  - https://doc.rust-kr.org/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html
  - Cargo.toml 의존성: https://doc.rust-lang.org/cargo/guide/dependencies.html
  - crates.io: https://crates.io/
- **M2 스마트 포인터**: https://doc.rust-kr.org/ch15-00-smart-pointers.html
  - Box<T>: https://doc.rust-kr.org/ch15-01-box.html
  - Rc<T>: https://doc.rust-kr.org/ch15-04-rc.html
  - RefCell<T>/내부 가변성: https://doc.rust-kr.org/ch15-05-interior-mutability.html
- **M3 동시성**: https://doc.rust-kr.org/ch16-00-concurrency.html
  - 스레드: https://doc.rust-kr.org/ch16-01-threads.html
  - 채널: https://doc.rust-kr.org/ch16-02-message-passing.html
  - Mutex/Send/Sync: https://doc.rust-kr.org/ch16-03-shared-state.html, https://doc.rust-kr.org/ch16-04-extensible-concurrency-sync-and-send.html
- **M4 async/await**:
  - 한국어 번역에 정식 챕터가 없을 수 있음 → 영문 사용:
  - https://doc.rust-lang.org/book/ch17-00-async-await.html
  - tokio 공식 튜토리얼: https://tokio.rs/tokio/tutorial

### Step 9 — 팀 프로젝트 진행 (수업 없음)
- Cargo Book 워크스페이스: https://doc.rust-lang.org/cargo/reference/workspaces.html
- Rustlings: https://rustlings.cool/ (자율 연습 추천)

### Step 10 — 발표·회고
- 직접 매핑 없음. 자료 정리만.

## 한국 초보 개발자를 위한 배려 사항 (콘텐츠에 반드시 반영)

1. **Windows 사용자가 가장 많을 것을 가정.** 모든 OS 탭에서 Windows를 첫 번째로 두지는 않더라도, Windows 환경에서 자주 발생하는 문제(MSVC 빌드 도구, 한글 사용자명 폴더 경로, PowerShell vs cmd)를 명시적으로 다룹니다.
2. **한글 경로/사용자명 주의.** Step 2에 "Windows 사용자명에 한글이 포함되면 일부 크레이트 빌드가 실패할 수 있습니다. `C:\dev\` 같은 영문 경로에서 작업하세요." 같은 callout을 추가합니다.
3. **터미널/CLI 친숙도가 낮을 수 있음.** 명령어 직전에 항상 한 줄 안내. `cd`, `ls`/`dir` 같은 기초 명령은 한 번은 풀어 설명. PowerShell vs WSL의 차이도 짚어줍니다.
4. **영어 에러 메시지 두려움 완화.** 컴파일러 에러가 등장하는 모듈(특히 Step 4 소유권)에서는 "**rustc의 에러는 친구입니다**" 같은 톤으로, 에러 메시지를 그대로 복사해 한국어로 번역+해석하는 블록을 둡니다.
5. **번역 용어 통일.** doc.rust-kr.org의 번역을 따릅니다. 예:
   - ownership → **소유권**
   - borrowing → **빌림**
   - reference → **참조**
   - lifetime → **라이프타임** (생명주기 X)
   - trait → **트레이트**
   - crate → **크레이트**
   - closure → **클로저**
   - iterator → **반복자** (또는 이터레이터, doc.rust-kr.org 표기 우선)
   - panic → **패닉**
   - shadowing → **섀도잉**
6. **rustup 한국 미러 또는 IPv4 이슈.** 일부 학교 망에서 `sh.rustup.rs`가 막히는 경우가 있으므로, "막히면 https://rustup.rs 페이지에서 직접 설치 파일을 다운로드하세요" 안내를 Step 2에 포함합니다.
7. **VS Code 사용 가정.** 한국 학부생 다수가 VS Code를 씁니다. rust-analyzer + CodeLLDB + Even Better TOML 세 확장만 명시적으로 안내합니다 (강의 계획서와 일치).
