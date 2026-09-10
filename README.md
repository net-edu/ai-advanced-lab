# GitHub Pages 문서 파이프라인

`content/` 에 Markdown 파일과 목차(`toc.yml`)를 넣고 **스크립트 하나만 실행**하면
GitHub Pages 사이트로 변환·배포되는 파이프라인입니다.

```bash
./pipeline preview   # 테스트용 - 빌드 후 로컬 서버에서 확인
./pipeline deploy    # 실배포  - gh-pages 브랜치로 푸시
```

---

## 설치

**파이썬 3.10 이상만 있으면 됩니다.** 첫 실행 때 `./pipeline` 이 `.venv` 를 만들고
MkDocs 등 의존성을 설치하므로 별도 준비 절차가 없습니다. 두 번째 실행부터는 바로 뜹니다.

```bash
./pipeline check      # 처음이면 여기서 .venv 생성 + 의존성 설치가 함께 일어납니다
```

Windows 에서는 `./pipeline` 대신 `pipeline` 을 실행하세요 (`pipeline.cmd`).

??? details "Debian / Ubuntu 에서 가상환경 생성이 실패한다면"
    venv 모듈이 별도 패키지입니다.

    ```bash
    sudo apt install python3-venv python3-pip
    ```

??? details "설치가 네트워크에서 막힌다면"
    기본 패키지 인덱스는 사내 Artifactory 미러입니다. 아래 환경변수로 바꿀 수 있습니다.

    ```bash
    PIPELINE_PIP_INDEX= ./pipeline check                        # 공개 PyPI 사용
    PIPELINE_PIP_ARGS='--cert /경로/사내CA.pem' ./pipeline check  # 사내 CA 인증서 지정
    export HTTPS_PROXY=http://proxy:8080                        # 프록시가 필요한 망
    ```

    이미 만들어 둔 가상환경을 쓰게 하려면 `PIPELINE_VENV=/경로/venv` 를 지정하거나,
    그 환경을 활성화한 채 `./pipeline` 을 실행하면 됩니다.

---

## 사용법

### 1. 문서를 넣는다

`content/` 아래에 `.md` 파일을 둡니다. 이미지 등 첨부 파일도 `content/` 안에
같이 두면 그대로 배포됩니다.

```
content/
├── toc.yml                    # 목차 메타데이터
├── index.md                   # 첫 화면
├── media/                     # 이미지·동영상 등 첨부 파일
│   ├── screenshot.png
│   └── demo.mp4
├── guide/
│   ├── getting-started.md
│   └── writing.md
└── day1/                      # 디렉터리는 그대로 목차의 분류가 됩니다
    ├── index.md               #   '1일차' 탭을 눌렀을 때 열리는 페이지
    ├── ch1.md                 #   /day1/ch1/
    └── ch2.md                 #   /day1/ch2/
```

새 문서를 만드는 명령도 있습니다.

```bash
./pipeline new guide/install --title "설치"
```

#### 이미지와 동영상

첨부 파일도 `content/` 안에 두고 **문서 파일 기준 상대 경로**로 참조합니다.
이미지는 클릭하면 확대되는 라이트박스가 자동 적용됩니다.

```markdown
![화면 예시](media/screenshot.png)
![다이어그램](media/diagram.png){ width="150" }
```

동영상은 마크다운 문법이 없어 HTML 을 쓰지만, **경로 규칙은 이미지와 같습니다.**

```html
<video controls width="100%" poster="media/screenshot.png">
  <source src="media/demo.mp4" type="video/mp4">
</video>
```

자세한 내용은 [문서 작성법](content/guide/writing.md) 문서를 참고하세요.

### 2. 목차를 정의한다

`content/toc.yml` 에 적은 순서대로 사이트 메뉴가 만들어집니다.
경로는 `content/` 기준 상대 경로입니다.

```yaml
- 홈: index.md
- 가이드:
    - 시작하기: guide/getting-started.md
    - 문서 작성법: guide/writing.md
```

#### 디렉터리는 분류가 됩니다

`content/day1/ch1.md` 처럼 디렉터리를 나누면 `day1` 이 상단 탭이자 분류가 되고,
`ch1` 은 `/day1/ch1/` 로 발행되는 별도 페이지가 됩니다.

```yaml
- 1일차:
    - day1/index.md        # 제목 없이 맨 앞 → '1일차' 탭을 눌렀을 때 열리는 페이지
    - 1교시: day1/ch1.md
    - 2교시: day1/ch2.md
- 2일차:
    - 1교시: day2/ch1.md
```

#### 등록하지 않아도 사라지지 않습니다

`toc.yml` 에 없는 `.md` 는 **디렉터리 구조를 그대로 목차 계층으로 옮겨** 자동
편입되고, 실행할 때 `toc.yml 미등록` 경고가 표시됩니다.

- 섹션 이름은 그 디렉터리의 `index.md` 첫 `# 제목`, 없으면 디렉터리명을 씁니다.
- 페이지 제목은 각 문서의 첫 `# 제목` 을 씁니다.
- `toc.yml` 에 이미 있는 섹션의 문서라면 새 섹션을 만들지 않고 그 안으로 들어갑니다.

자동 편입은 이름 순으로만 정렬되므로, 순서가 중요한 문서는 `toc.yml` 에 적으세요.

### 3. 사이트 정보를 채운다

`site.yml` 을 열어 이름과 주소를 바꿉니다.

```yaml
site_name: 우리 팀 문서
site_url: https://<GITHUB_OWNER>.github.io/<REPOSITORY>/

deploy:
  remote: origin
  branch: gh-pages
```

!!! warning
    `site_url` 이 예시값(`example.com` 또는 `<GITHUB_OWNER>`)으로 남아 있으면 `deploy` 가 중단됩니다.
    canonical 링크와 `sitemap.xml` 이 잘못된 주소를 가리키는 것을 막기 위한 장치입니다.

### 4-A. 테스트 흐름 - 로컬에서 확인

```bash
./pipeline preview
```

빌드 후 <http://127.0.0.1:8080/> 이 열립니다. `content/`, `theme/`, `site.yml` 을
저장할 때마다 자동으로 다시 빌드되므로 브라우저만 새로고침하면 됩니다.
빌드가 실패해도 서버는 살아 있고 직전 결과물이 계속 서빙됩니다.

```bash
./pipeline preview --port 9000     # 포트 변경
./pipeline preview --host 0.0.0.0  # 같은 네트워크의 다른 PC에서 접속 허용
./pipeline preview --no-open       # 브라우저 자동 실행 안 함
```

### 4-B. 실배포 흐름 - GitHub Pages 로 게시

```bash
./pipeline deploy
```

리모트와 브랜치, 사이트 주소를 보여주고 확인을 받은 뒤 푸시합니다.
확인 없이 바로 배포하려면 `-y` 를 붙입니다.

```bash
./pipeline deploy -y -m "가이드 문서 추가"
```

**최초 1회만** 저장소 **Settings > Pages** 에서 다음과 같이 설정하세요.

| 항목 | 값 |
|---|---|
| Source | Deploy from a branch |
| Branch | `gh-pages` |
| Folder | `/ (root)` |

`main` 에는 원본 Markdown 만 남고 생성된 HTML 은 `gh-pages` 로만 올라갑니다.
main 브랜치 diff 가 깨끗하게 유지되고, 여러 사람이 동시에 작업해도 빌드
산출물 때문에 충돌하지 않습니다.

---

## 명령어

| 명령 | 설명 |
|---|---|
| `./pipeline preview` | 빌드 + 로컬 서버 + 변경 감시 (테스트 흐름) |
| `./pipeline deploy` | 빌드 + `gh-pages` 푸시 (실배포 흐름) |
| `./pipeline check` | 목차와 링크만 검사. 빌드하지 않음 |
| `./pipeline build` | 빌드만 수행 (`.build/site` 에 생성) |
| `./pipeline new <경로>` | 새 문서 파일 생성 |
| `./pipeline clean` | `.build/` 작업 디렉터리 삭제 |

`--help` 로 각 명령의 옵션을 볼 수 있습니다.

---

## 파이프라인이 자동으로 검사하는 것

실행할 때마다 다음을 확인하고, 문제가 있으면 배포 전에 알려줍니다.

- **목차 정합성** - `toc.yml` 이 없는 파일을 가리키면 **오류로 중단**합니다.
- **미등록 문서** - `toc.yml` 에 없는 `.md` 는 경고 후 디렉터리 구조대로 자동 편입합니다.
- **중복 등록** - 같은 문서가 `toc.yml` 에 여러 번 있으면 경고합니다.
- **깨진 링크** - 존재하지 않는 파일을 가리키는 상대 링크·이미지를 찾아냅니다.
  `<video>`, `<img>` 같은 HTML 태그의 `src` / `poster` 도 함께 검사합니다.
  코드 블록 안의 문법 예시는 검사 대상에서 제외됩니다.
- **`site_url` 예시값** - `preview` 에서는 경고, `deploy` 에서는 오류입니다.

---

## 프로젝트 구조

```
.
├── pipeline               # 단일 진입점 (macOS/Linux/WSL)
├── pipeline.cmd           # 단일 진입점 (Windows)
├── site.yml               # 사이트 이름·주소·배포 대상·테마 색상
│
├── content/               # ← 여기만 편집하면 됩니다
│   ├── toc.yml            #   목차 메타데이터
│   └── *.md               #   문서 원본
│
├── theme/                 # 사이트 외형 (CSS/JS). 보통 손댈 일이 없습니다
│   ├── stylesheets/
│   └── javascripts/
│
├── tools/
│   ├── pipeline.py        # 파이프라인 본체
│   └── mkdocs_hooks.py    # raw HTML(<video> 등) 상대 경로 보정 훅
│
├── polish/                # 문서 윤문 하네스 (어체·표기 검수) - 아래 참고
├── .claude/               #   하네스가 쓰는 에이전트·스킬 정의
├── pyproject.toml         # 의존성 정의
├── .build/                # 생성물 (git 추적 제외)
│   ├── mkdocs.yml         #   site.yml + toc.yml 로부터 자동 생성
│   ├── src/               #   content/ + theme/ 를 합친 빌드 입력
│   └── site/              #   빌드된 정적 사이트
│
└── github-page-sample/    # 이 파이프라인의 원본이 된 참조용 샘플
```

`.build/mkdocs.yml` 은 매 실행마다 새로 생성되므로 직접 수정하지 마세요.
사이트 설정을 바꾸려면 `site.yml` 을, 목차를 바꾸려면 `content/toc.yml` 을
편집합니다.

---

## 문서 윤문 하네스

`content/` 문서의 어체·표기·문장을 다듬는 장치가 `polish/` 에 있습니다.
문서를 여러 사람이(또는 여러 세션이) 쓰다 보면 어체와 용어 표기가 갈라지는데,
그걸 상시로 잡아 주는 쪽입니다.

```bash
python3 polish/tools/measure.py                  # 지금 문서 상태를 수치로
python3 polish/tools/snapshot.py create          # 손대기 전 원본을 떠 둔다
python3 polish/tools/guard.py                    # 고치면 안 될 것을 고쳤는지 검증
```

에이전트에게 "`content/mcp` 세 쪽 윤문해줘" 처럼 시키면 `doc-polish` 스킬이
스냅샷 → 계량 → 검수 → 적용 → 검증까지 진행합니다. 자세한 내용은
[polish/README.md](polish/README.md) 를 보세요.

**파이프라인과는 분리되어 있습니다.** 하네스는 `content/**/*.md` 의 본문과
`polish/` 밖으로 쓰지 않고, `./pipeline` 을 실행하지 않으며, 파이썬 표준
라이브러리만 씁니다. `polish/` 와 `.claude/` 는 빌드 입력이 아니라서
사이트 결과물에 들어가지 않습니다.

---

## 설계 메모

- **폐쇄망 대응** - Google Fonts 를 쓰지 않고(`font: false`), 검색·라이트박스
  스크립트도 모두 로컬 번들입니다. 빌드 결과물에 외부 호스트 요청이 없습니다.
- **`mkdocs serve` 를 쓰지 않는 이유** - 사내 PC, WSL, 네트워크 드라이브, 동기화
  폴더에서는 파일시스템 이벤트가 유실될 수 있습니다. `preview` 는 대신 1초 간격
  폴링으로 소스 지문(경로+mtime+크기)을 비교해 재빌드합니다.
- **raw HTML 경로 보정** - `use_directory_urls: true` 에서는 문서마다 디렉터리가
  하나 더 생기지만, MkDocs 는 마크다운 링크의 경로만 다시 씁니다. 직접 적은
  `<video src="...">` 는 그대로 남아 404 가 되므로, `tools/mkdocs_hooks.py` 가
  빌드 시 raw HTML 의 상대 경로도 같은 규칙으로 보정합니다.
- **의존성 설치 방식** - 별도 패키지 관리자에 의존하지 않고, `pipeline` 스크립트가
  표준 `venv` + `pip` 으로 `.venv` 를 직접 준비합니다. 사내망에서 패키지 관리자마다
  인증서·프록시 설정이 제각각인 문제를 피하기 위한 선택입니다. 인덱스 주소와 pip 인자는
  `PIPELINE_PIP_INDEX` / `PIPELINE_PIP_ARGS` 로 조정합니다.
