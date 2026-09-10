---
name: doc-polish
description: content/ 안 문서를 교정·윤문·개선하는 전 과정을 조율한다. 스냅샷을 뜨고, 계량하고, style-guardian 에게 검수를 시키고, copy-editor 에게 적용시키고, guard.py 로 보호 구간을 검증한 뒤 결과를 기록한다. "문서 윤문해줘", "이 문서 다듬어줘", "오탈자 잡아줘", "어체 통일해줘", "교정해줘" 같은 요청에 쓴다. 파이프라인은 건드리지 않는다.
---

# Doc Polish

`content/` 문서를 고치는 작업의 오케스트레이터다. 혼자 다 하지 않는다 -
제안·적용·검증을 갈라 맡긴다. 쓴 쪽이 자기 결과를 통과시키면 게이트가 아니기 때문이다.

규범과 도구는 `polish/` 에 있다. 계약은 `polish/README.md` 를 따른다.

## 절대 하지 않는 것

- `./pipeline` 실행 (첫 실행 시 `.venv` 생성·MkDocs 설치라는 부작용이 있다)
- `tools/`·`pipeline`·`site.yml`·`theme/`·`pyproject.toml`·`.build/` 수정
- `content/toc.yml` 수정, 파일 추가·삭제·이동
- 스냅샷 없이 문서 수정

## P0 - 준비

1. **모드를 정한다.** 사용자가 말하지 않았으면 **교정 + 윤문**까지다.
   "구조를 바꿔줘"·"내용을 보강해줘" 같은 요청일 때만 개선 모드이고, 이때는
   항목마다 승인을 받는다.
2. **대상을 정한다.** 사용자가 문서를 지정하지 않았으면 **지난 파 이후 바뀐 문서**를
   고른다 - `content/` 는 계속 바뀌므로 매번 전체를 훑지 않는다.
   ```bash
   python3 polish/tools/snapshot.py diff latest
   ```
   대량 추가·삭제가 보고되면 콘텐츠 세트가 교체된 것이다. 이전 스냅샷을 기준으로
   이어가지 말고 새 기준선을 뜬 뒤, 사용자에게 어디부터 볼지 묻는다.
   한 파는 3~5쪽이다. 더 많으면 파를 나눈다.
3. **필독:** `polish/style/active.md` → `voice.md` → `checklist.md` → `page-types.md`.
4. **스냅샷:**
   ```bash
   python3 polish/tools/snapshot.py create --note "{파 번호}: {대상 요약}"
   ```

## P1 - 계량

```bash
python3 polish/tools/measure.py {대상}
```

수치가 큰 쪽부터 손댄다. 이 도구는 판정하지 않는다 - 어떤 항목도 수치만으로
고치라고 하지 않는다.

## P2 - 검수

문서마다 `style-guardian` 을 부른다. 문서당 5~10건, 원문 인용 → 대안 → 이유.
제안은 `polish/log.md` 에 append 된다. **이 단계에서 문서는 그대로다.**

## P3 - 적용

- 교정 모드: 바로 `copy-editor` 에게 넘긴다.
- 윤문 모드: 제안 목록을 사용자에게 보이고 **문서 단위 승인**을 받는다.
- 개선 모드: **항목별 승인**을 받는다.

`copy-editor` 는 제안에 없는 곳을 고치지 않는다.

## P4 - 가드

```bash
python3 polish/tools/guard.py --only {이번 파 경로} --mode {proofread|polish|revise}
```

위반이 나오면 **사람 판단을 거치지 않고** 되돌린다.

```bash
python3 polish/tools/guard.py --only {경로} --restore
```

되돌린 문서는 이번 파에서 다시 시도하지 않는다. 무엇을 어겼는지 `polish/log.md` 에
남기고 다음 파로 넘긴다. 같은 문서를 반복해서 밀어붙이면 보호 구간이 무의미해진다.

## P5 - 기록

1. 재계량해 이번 파의 전후를 비교한다.
2. `polish/log.md` 에 결과를 append 한다 - 반영 N건 / 거부 N건(사유) / 롤백 N건.
3. 이번 파에서 내린 판정 중 **다음에도 계속 적용될 것**은 `polish/style/active.md` 에
   append 한다. 같은 판정이 세 번 이상 반복되면 규범(`voice.md`·`checklist.md`)으로
   승격을 제안한다 - 하네스는 계속 도는 장치이므로, 판정이 쌓이기만 하면 읽히지 않는다.
4. 스냅샷이 많이 쌓였으면 정리한다: `python3 polish/tools/snapshot.py prune --keep 10`.

## P6 - 보고

변경 요약을 보고하고, **사용자에게** 확인을 권한다.

```
./pipeline check      목차·링크 검사
./pipeline preview    눈으로 확인
```

하네스는 이 명령을 직접 실행하지 않는다.

## 되돌리는 법

```bash
python3 polish/tools/snapshot.py restore latest --all   # 이번 파 전체
git checkout pre-polish-harness -- content/             # 하네스 도입 이전 상태
```

## 멈춰야 할 때

- 스냅샷 생성 실패 → 아무것도 고치지 않고 보고
- 한 문서에서 가드 위반이 두 번 → 그 문서는 이번 파에서 제외
- 사용자 승인 없이 개선 모드가 필요해 보임 → 제안만 하고 멈춤
- 규범과 사용자 지시가 충돌 → 사용자 지시를 따르고 `active.md` 에 판정으로 남김
