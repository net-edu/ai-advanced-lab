#!/usr/bin/env python3
"""마크다운 문서를 '고쳐도 되는 곳'과 '고치면 안 되는 곳'으로 갈라 읽는 공용 모듈.

measure.py(계량)와 guard.py(회귀 검증)가 같은 눈으로 문서를 보게 하려고 한 곳에 모았다.
표준 라이브러리만 쓴다 - 파이프라인의 .venv 나 의존성에 기대지 않는다.

링크·HTML 미디어 경로를 찾는 정규식은 tools/pipeline.py 의 것과 같은 규칙을 쓴다.
파이프라인의 링크 검사와 하네스의 판정이 어긋나지 않게 하기 위해서다.
"""

from __future__ import annotations

import re
import unicodedata
from collections import Counter

FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")
LINK_RE = re.compile(r"!\[[^\]]*\]\(([^)]+)\)|(?<!!)\[[^\]]+\]\(([^)]+)\)")
HTML_SRC_RE = re.compile(
    r"""<(?:img|video|audio|source|track|embed)\b[^>]*?\b(?:src|poster)\s*=\s*["']([^"']+)["']""",
    re.IGNORECASE,
)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
CALLOUT_RE = re.compile(
    r"^(\s*)(!!!|\?\?\?\+?|\?\?\?)\s+([a-zA-Z-]+)(?:\s+\"([^\"]*)\")?\s*$"
)
LIST_RE = re.compile(r"^\s*(?:[-+]|\*(?!\*)|\d+[.)])\s+")
TABLE_RE = re.compile(r"^\s*\|")
HTML_LINE_RE = re.compile(r"^\s*</?[a-zA-Z][^>]*>")
NUMBER_RE = re.compile(r"\d+(?:[.,]\d+)*")

# 마커: 표 안에서 'TODO' 를 단어로 언급한 줄까지 잡지 않도록 형식을 좁혔다.
MARKER_RE = re.compile(
    r"<!--\s*(?:TODO|FIXME|TBD)\b.*?-->"
    r"|(?:^|\s)(?:TODO|FIXME|TBD)\s*[:：]"
    r"|\[작성\s*중\]|\[미완성\]|\(작성\s*예정\)|\(확인\s*필요\)|\(사실\s*확인\s*필요\)",
    re.IGNORECASE | re.MULTILINE,
)


def split_fences(text):
    """(펜스 밖 줄들, 펜스 블록들) 을 돌려준다.

    펜스 블록은 (언어태그, 본문) 튜플이다. 줄 목록은 원본 줄 번호를 살려
    (줄번호, 내용) 형태로 준다 - 보고에 줄 번호를 붙이기 위해서다.
    """
    outside = []
    blocks = []
    fence = None
    lang = ""
    buf = []
    for no, line in enumerate(text.splitlines(), 1):
        match = FENCE_RE.match(line)
        if fence is not None:
            if match and line.strip().startswith(fence):
                blocks.append((lang, "\n".join(buf)))
                fence, lang, buf = None, "", []
            else:
                buf.append(line)
            continue
        if match:
            fence = match.group(1)
            lang = match.group(2).strip()
            buf = []
            continue
        outside.append((no, line))
    if fence is not None:  # 닫히지 않은 펜스
        blocks.append((lang, "\n".join(buf)))
    return outside, blocks


def prose_lines(text):
    """산문으로 볼 수 있는 줄만 (줄번호, 내용) 으로 돌려준다.

    헤딩·표·HTML·콜아웃 선언줄은 뺀다. 리스트 항목은 서술 문장을 담는 일이
    많으므로 남기되, 표식은 지운다.
    """
    outside, _ = split_fences(text)
    result = []
    for no, line in outside:
        stripped = line.strip()
        if not stripped:
            continue
        if HEADING_RE.match(line) or TABLE_RE.match(line) or HTML_LINE_RE.match(line):
            continue
        if CALLOUT_RE.match(line):
            continue
        result.append((no, LIST_RE.sub("", line).strip()))
    return result


def strip_inline(text):
    """인라인 코드와 링크 주소를 지운다 (링크의 표시 문구는 남긴다)."""
    text = INLINE_CODE_RE.sub(" ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", " ", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return text


def headings(text):
    outside, _ = split_fences(text)
    found = []
    for no, line in outside:
        match = HEADING_RE.match(line)
        if match:
            found.append((no, len(match.group(1)), match.group(2).strip()))
    return found


def links(text):
    """마크다운 링크·이미지와 raw HTML 의 src/poster 를 모두 모은다."""
    outside, _ = split_fences(text)
    body = "\n".join(line for _, line in outside)
    body = INLINE_CODE_RE.sub(" ", body)
    found = []
    for match in LINK_RE.finditer(body):
        found.append((match.group(1) or match.group(2)).split()[0].strip("<>"))
    found += [src.strip() for src in HTML_SRC_RE.findall(body)]
    return found


def inline_codes(text):
    outside, _ = split_fences(text)
    body = "\n".join(line for _, line in outside)
    return [code.strip("`").strip() for code in INLINE_CODE_RE.findall(body)]


def numbers(text):
    """산문에 등장하는 숫자 토큰. 코드·링크 주소 안의 숫자는 세지 않는다."""
    outside, _ = split_fences(text)
    body = strip_inline("\n".join(line for _, line in outside))
    return Counter(NUMBER_RE.findall(body))


def callouts(text):
    """(종류, 시작 줄번호, 본문) 목록. `!!! warning` 처럼 선언된 블록만 본다."""
    outside, _ = split_fences(text)
    lines = dict(outside)
    found = []
    order = [no for no, _ in outside]
    for index, no in enumerate(order):
        match = CALLOUT_RE.match(lines[no])
        if not match:
            continue
        indent = len(match.group(1))
        kind = match.group(3).lower()
        body = []
        for next_no in order[index + 1 :]:
            line = lines[next_no]
            if line.strip() and (len(line) - len(line.lstrip())) <= indent:
                break
            body.append(line.strip())
        found.append((kind, no, "\n".join(body)))
    return found


SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+")

# 순서가 곧 우선순위다. '아니다' 는 평어체인데 '니다' 로 끝나므로 앞에서 제외하고,
# '참고하세요' 같은 지시문은 해요체로 세지 않도록 명령형을 먼저 본다.
ENDINGS = [
    ("합니다체", re.compile(r"(?<!아)니다$|십시오$|시죠$")),
    ("명령형", re.compile(r"(하라|해라|하자|보자|하시오|세요|십시다)$")),
    ("해요체", re.compile(r"(에요|예요|어요|아요|네요)$")),
    ("평어체", re.compile(r"다$")),
    ("명사종결", re.compile(r"(음|함|됨|임|점|것)$")),
]

# 어체 통계에서 빼는 줄. 강의 흐름 문서의 `▶ *…*` 서사 캡션처럼, 본문과 다른 어체를
# 쓰는 것이 의도인 장치가 있다. 이걸 위반으로 몰면 규약이 의도를 지우게 된다.
CAPTION_RE = re.compile(r"^\s*(?:[▶▷»→]|>\s*[▶▷])|^\s*[*_][^*_].*[*_]\s*$")


def sentence_endings(text):
    """종결어미 분포와 표본 문장을 돌려준다.

    문장부호로 끝난 문장만 센다. 헤딩·표·코드는 애초에 제외되고,
    서사 캡션(CAPTION_RE)은 '캡션(제외)' 로 따로 세어 어체 판정에서 뺀다.
    """
    counts = Counter()
    samples = {}
    for no, line in prose_lines(text):
        if CAPTION_RE.match(line):
            counts["캡션(제외)"] += 1
            samples.setdefault("캡션(제외)", (no, line[:60]))
            continue
        body = strip_inline(line)
        for raw in SENTENCE_SPLIT_RE.split(body):
            sentence = raw.strip()
            if not sentence or sentence[-1] not in ".!?":
                continue
            tail = sentence.rstrip(".!?").rstrip()
            tail = "".join(ch for ch in tail if unicodedata.category(ch)[0] in "LN")
            if not tail:
                continue
            for name, pattern in ENDINGS:
                if pattern.search(tail):
                    counts[name] += 1
                    samples.setdefault(name, (no, sentence[:60]))
                    break
    return counts, samples


def words(text):
    """어절 수. bold 밀도 계산의 분모다 (코드·링크 주소 제외)."""
    outside, _ = split_fences(text)
    body = strip_inline("\n".join(line for _, line in outside))
    return len(re.findall(r"\S+", body))


def bolds(text):
    outside, _ = split_fences(text)
    body = INLINE_CODE_RE.sub(" ", "\n".join(line for _, line in outside))
    return re.findall(r"\*\*[^*\n]+\*\*", body)


def markers(text):
    outside, _ = split_fences(text)
    found = []
    for no, line in outside:
        if MARKER_RE.search(line):
            found.append((no, line.strip()))
    return found


def lead_paragraph(text):
    """H1 다음 첫 블록이 문단인지 판정한다.

    `**굵은 문장**` 으로 시작하는 줄은 리스트가 아니라 문단이다 - 이걸 구분하지
    못하면 오탐이 난다.
    """
    outside, _ = split_fences(text)
    seen_h1 = False
    for no, line in outside:
        stripped = line.strip()
        if not stripped:
            continue
        match = HEADING_RE.match(line)
        if not seen_h1:
            if match and len(match.group(1)) == 1:
                seen_h1 = True
            continue
        if match:
            return False, no, stripped
        if LIST_RE.match(line) or TABLE_RE.match(line) or CALLOUT_RE.match(line):
            return False, no, stripped
        return True, no, stripped
    return False, 0, ""


def list_ratio(text):
    outside, _ = split_fences(text)
    body = [line for _, line in outside if line.strip()]
    if not body:
        return 0.0
    listed = sum(1 for line in body if LIST_RE.match(line))
    return listed / len(body)
