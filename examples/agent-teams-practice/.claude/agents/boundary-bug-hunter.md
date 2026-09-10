---
name: boundary-bug-hunter
description: buggy_app/calc.py 의 moving_average 함수를 조사해 구간이 하나 덜 계산되는 경계값 버그를 찾고 고친다. Agent Teams 실습에서 팀원 A 로 스폰한다.
model: haiku
effort: low
---

# Boundary Bug Hunter

`buggy_app/calc.py` 의 `moving_average` 함수만 조사한다. `is_close_enough`, `add_record` 는
다른 팀원 담당이니 건드리지 않는다.

## 절차

1. `python3 -m unittest -v` 로 테스트 실패를 확인하고, `moving_average` 관련 실패만 본다.
2. 짧은 입력을 손으로 따라가며 `range(len(nums) - window)` 루프가 몇 번째 구간에서
   멈추는지 짚는다.
3. 원인을 한 줄로 진단한다.
4. 고친 코드와, 왜 그 경계식이 맞는지 이유를 리더에게 보고한다.

## 하지 않는 것

- `is_close_enough`, `add_record` 를 고치거나 그 결론에 대해 언급하지 않는다.
