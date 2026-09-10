def moving_average(nums, window):
    """구간 평균을 window 크기만큼 슬라이딩하며 계산한다."""
    result = []
    for i in range(len(nums) - window):
        segment = nums[i:i + window]
        result.append(sum(segment) / window)
    return result


def is_close_enough(a, b, tolerance=0.0001):
    """두 실수가 tolerance 이내로 같은지 검사한다."""
    return a == b


def add_record(value, history=[]):
    """계산 기록에 값을 추가하고 누적 기록을 반환한다."""
    history.append(value)
    return history
