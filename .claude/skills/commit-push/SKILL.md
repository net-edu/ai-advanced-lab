---
name: commit-push
description: 작업한 변경을 검토해 커밋하고 origin 에 push 한다. git status 로 대상을 확인하고, 민감정보·불필요한 산출물을 걸러낸 뒤, 무엇을·왜 바꿨는지 요약한 메시지로 커밋하고 현재 브랜치를 push 한다. "커밋하고 push 해줘", "작업 내용 커밋해줘", "commit and push", "지금까지 한 거 올려줘" 같은 요청에 쓴다. 빌드 배포(gh-pages)는 하지 않는다.
---

# Commit & Push

이 저장소는 원본을 `main` 에 두고, 빌드 결과는 `./pipeline deploy` 로 `gh-pages` 에
따로 올린다. 이 스킬은 **원본 변경을 현재 브랜치에 커밋하고 push** 하는 데까지만 한다.
사이트 배포는 하지 않는다.

## 하지 않는 것

- `./pipeline deploy` 실행 (배포는 이 스킬의 일이 아니다)
- `git push --force`, `git rebase`, `git reset --hard` 등 히스토리 재작성·파괴적 명령
- `.gitignore` 로 걸러지는 산출물(`.build/`, `.venv/`)을 억지로 추가
- 사용자가 지정하지 않은 브랜치로 옮겨 타기

## 절차

### 1. 무엇이 바뀌었는지 확인한다

```bash
git status --short
git diff --stat
```

바뀐 게 없으면 여기서 멈추고 "커밋할 변경이 없다"고 알린다.

### 2. 검토 - 민감정보와 불필요한 파일을 거른다

- `.env`·`*.token`·`credentials*`·`id_rsa`·키 파일이 목록에 있으면 **멈추고** 사용자에게
  확인한다. 이런 건 커밋하지 않는다.
- 추적되지 않던 대용량·생성물(`.build/`, `.venv/`, 스냅샷 아카이브 등)이 보이면 스테이징에서
  뺀다.
- 파일명이 평범해 보여도 의심스러우면 내용을 열어 확인한 뒤 진행한다.

### 3. 스테이징한다

```bash
git add -A
```

2에서 뺄 것이 있으면 `git reset -- <경로>` 로 제외한다. 스테이징 후 한 번 더 확인한다.

```bash
git status --short
```

무대에 올라온 목록이 의도한 "작업한 내용"과 일치하는지 눈으로 본다.

### 4. 커밋한다

메시지는 **무엇을·왜** 바꿨는지 한 줄로 요약한다. 여러 갈래면 본문에 불릿으로 나눈다.
커밋 메시지 끝에는 아래 트레일러를 넣는다.

```bash
git commit -m "<한 줄 요약>" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### 5. push 한다

```bash
git push
```

업스트림이 없다는 오류가 나면 현재 브랜치를 명시해 올린다.

```bash
git push -u origin "$(git rev-parse --abbrev-ref HEAD)"
```

### 6. 결과를 보고한다

커밋 해시, push 된 브랜치, 반영된 파일 수를 알린다.

## 주의

- 이 저장소는 원본을 `main` 에 바로 커밋하는 흐름이다(원본은 `main`, 배포는 `gh-pages`).
  다른 브랜치를 쓰라는 지시가 없으면 현재 브랜치 그대로 커밋·push 한다.
- push 는 되돌리기 어려운 외부 반영이다. 스테이징 목록이 의도와 다르면 push 전에 멈추고
  사용자에게 확인한다.
