## Summary

대학교 다니면서 공부했던 내용들에 대해서 정리하는 Repository입니다.

## Index

- grade-1
  - semester-2
    - [객체지향프로그래밍(Java)](grade-1/semester-2/OOP-Java/README.md)
    - [소프트웨어프로젝트2(PyQt-python)](grade-1/semester-2/SoftwareProject2_PyQt-python/README.md)
    - 프로젝트
      - [임베디드SW\_경진대회(Home++-webOS)](https://github.com/webOS-KOSS/HomePlusPlus)
- grade-2
  - semester-1
    - [논리회로설계(QM_Method-python)](grade-2/semester-1/QM_Method-python/)
    - [창업연계공학설계입문(Arduino)](grade-2/semester-1/Arduino/)
    - [C++\_C-Snake(C++)](https://github.com/C-Snake/C-Snake-main)
    - 프로젝트
      - [캡스톤디자인전시회(모두의\_환승)](https://github.com/AgainIoT/Everyones-Transfer_Main)
  - semestger-2
    - [알파프로젝트(Open-Set-Go)](https://github.com/AgainIoT/Open-Set-Go)

## 2026학년도 1학기 강의 아카이브

[강의 아카이브 열기](https://ymw0407.github.io/UnivStudy/)

| 강의 | 강의 노트 | 소스 |
| --- | --- | --- |
| 운영체제 | [강의 보기](https://ymw0407.github.io/UnivStudy/os/) | [os](2026/semester-1/os/) |
| 시스템최신기술 (양자컴퓨팅) | [강의 보기](https://ymw0407.github.io/UnivStudy/quantum/) | [quantum](2026/semester-1/quantum/) |
| 시스템최신기술 (Rust) | [강의 보기](https://ymw0407.github.io/UnivStudy/rust/) | [rust](2026/semester-1/rust/) |

### 로컬에서 실행하기

Node.js 24와 pnpm 10.33.3을 사용합니다. 저장소 루트에서 다음 명령을 실행한 뒤 브라우저에서 `http://localhost:8000/`을 엽니다.

```sh
pnpm install --frozen-lockfile
pnpm build
python3 -m http.server 8000 --directory dist
```

강의 하나만 수정할 때는 `pnpm --filter os-book dev`, `pnpm --filter quantum-book dev`, `pnpm --filter rust-wiki dev` 중 하나를 실행합니다. `main`에 푸시하면 GitHub Actions가 세 강의를 빌드해 GitHub Pages에 배포합니다.

원본 저장소의 커밋은 이 저장소의 Git 이력에 포함되어 있습니다. `git tag -l 'archive/*'`로 통합 당시의 브랜치별 태그를 확인할 수 있습니다.
