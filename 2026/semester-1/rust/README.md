# rust-wiki-builder

dpas-lab.pages.dev 스타일의 Rust 강의 위키를 만드는 Claude 스킬 번들입니다.

## 구성

```
rust-wiki-builder/
├── SKILL.md              # 스킬 정의 (Claude가 자동 인식)
├── CLAUDE.md             # 사이트 레포지토리 루트에 둘 Claude Code 설정
├── MASTER_PROMPT.md      # 새 채팅 시작용 마스터 프롬프트
├── README.md             # 이 파일
├── templates/
│   ├── index.html        # 10개 step 카드 인덱스 (그대로 복사해서 시작)
│   ├── step.html         # 회차 페이지 템플릿 (모듈 4단 구조)
│   ├── os-tabs.html      # macOS/Linux/Windows 분기용 컴포넌트 (JS 없음)
│   └── style.css         # 공통 CSS (Rust 오렌지 #ce422b)
└── references/
    └── dpas-lab-notes.md # 모토 사이트 스타일 분석 노트
```

## 사용법 (3단계)

### 1. 스킬 등록

- **Claude.ai 웹/앱**: 이 zip을 채팅에 업로드하면 됩니다.
- **Claude Code**: zip을 풀어 `~/.claude/skills/rust-wiki-builder/`에 두거나, 작업 폴더에 둡니다.

### 2. 강의 계획서 업로드

`rust_강의계획.xlsx`를 같이 올립니다.

### 3. 마스터 프롬프트 붙여넣기

`MASTER_PROMPT.md` 안의 "붙여넣기 시작 ↓↓↓ ~ 끝 ↑↑↑" 사이 내용을 복사해 첫 메시지로 보내세요.

## 결과물 구조

생성되는 사이트는 다음과 같습니다.

```
.
├── index.html              # 카드 인덱스
├── step-1-intro.html
├── step-2-setup.html       # OS 탭 포함
├── step-3-basics.html
├── step-4-ownership.html
├── step-5-types.html
├── step-6-project-plan.html
├── step-7-generics.html
├── step-8-advanced.html
├── step-9-project.html
├── step-10-wrapup.html
└── assets/
    └── style.css
```

로컬 확인:

```sh
python3 -m http.server 8000
# http://localhost:8000
```

배포: 위 폴더 전체를 Cloudflare Pages 또는 GitHub Pages에 그대로 올리면 끝입니다. 빌드 단계 없음.

## 핵심 디자인 결정

- **모듈 = 섹션 1:1 매핑.** 강의 계획서의 M1~M4를 그대로 페이지 섹션으로 옮겨, 강의와 위키를 같은 단위로 동기화.
- **OS 분기는 라디오 버튼 기반 탭** (JS 없이 CSS만으로). 한 페이지에 macOS/Linux/Windows 명령을 모두 담아 학생이 자기 환경만 골라 보면 됩니다.
- **본문 폭 760px 고정.** 긴 줄을 끊어 가독성을 강제.
- **빌드 도구 없음.** 학생이 위키 사이트 자체를 fork해서 수정하는 데 진입장벽이 없도록.
