"""raw HTML 안의 상대 경로를 보정하는 MkDocs 훅.

마크다운의 `![](media/x.png)` 는 MkDocs 가 페이지 위치에 맞게 경로를 다시
써 주지만, 직접 적은 HTML(`<video src="...">` 등)은 손대지 않는다.
`use_directory_urls: true` 에서는 문서마다 디렉터리가 하나 더 생기므로
그대로 두면 경로가 한 단계 어긋나 404 가 된다.

    content/mediatest.md   ->  /mediatest/          (한 단계 깊어짐)
    content/media/demo.mp4 ->  /media/demo.mp4

이 훅은 마크다운이 HTML 로 바뀌기 전에 raw HTML 태그의 상대 경로에 필요한
만큼 `../` 를 붙여, 마크다운 이미지와 같은 규칙(문서 파일 기준 상대 경로)으로
동영상·오디오를 쓸 수 있게 한다.
"""

from __future__ import annotations

import re

# `![alt](path){ .foldable }` 를 접이식 이미지로 바꾼다. 이미지가 한 줄에 홀로 있을 때만
# 노린다(앞뒤로 다른 글이 붙은 인라인 이미지는 건드리지 않는다).
FOLDABLE_PATTERN = re.compile(
    r"^(?P<indent>[ \t]*)"
    r"!\[(?P<alt>[^\]]*)\]\((?P<target>[^)]+)\)"
    r"[ \t]*\{[ \t]*\.foldable[ \t]*\}[ \t]*$",
    re.MULTILINE,
)


def _escape(text: str) -> str:
    """HTML 속성·본문에 넣을 수 있게 최소한만 이스케이프한다."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _apply_foldable(markdown: str) -> str:
    """`{ .foldable }` 이미지를 Material 접이식 admonition(raw HTML)으로 바꾼다.

    `<details class="note">` 로 내보내면 버튼·테두리·펼침 아이콘을 Material
    테마가 직접 그린다. src 는 저자가 쓴 상대 경로 그대로 두고, 아래 raw HTML
    경로 보정 로직이 마크다운 이미지와 똑같이 `../` 를 맞춰 준다.
    """

    def replace(match: re.Match) -> str:
        alt = match.group("alt").strip()
        # `path "title"` 형태면 경로만 취한다.
        target = match.group("target").strip().split()[0]
        summary = _escape(alt) if alt else "이미지 펼치기"
        alt_attr = _escape(alt)
        src_attr = _escape(target)
        # `admonition note` 는 Material 의 접이식 admonition 클래스 조합이다 -
        # `admonition` 이 빠지면 leeum-editorial.css 의 잉크·헤어라인 재정의를
        # 받지 못하고 Material 기본 파란 note 색이 그대로 남는다. 페이지의
        # `!!! important` 블록과 같은 결로 보이게 하려면 반드시 함께 붙인다.
        # `ailab-foldable` 는 그 안의 이미지 배치와 남은 Material 기본값(아이콘
        # 등) 재정의용이다.
        return (
            f'<details class="ailab-foldable admonition note">\n'
            f"<summary>{summary}</summary>\n"
            f'<img alt="{alt_attr}" src="{src_attr}">\n'
            f"</details>"
        )

    return FOLDABLE_PATTERN.sub(replace, markdown)


# 경로를 보정할 태그와 속성. 마크다운으로는 표현할 수 없어 raw HTML 로 쓰게 되는 것들.
# div 는 asciinema-player 같은, JS 가 data-* 속성으로 소스를 읽어들이는 위젯 컨테이너용이다.
TAG_PATTERN = re.compile(
    r"<(?P<tag>img|video|audio|source|track|embed|iframe|div)\b(?P<attrs>[^>]*)>",
    re.IGNORECASE,
)
ATTR_PATTERN = re.compile(
    r"""(?P<name>\b(?:src|poster|data|data-cast)\s*=\s*)(?P<quote>["'])(?P<value>[^"']*)(?P=quote)""",
    re.IGNORECASE,
)

# 이미 절대경로거나 외부 주소인 것은 건드리지 않는다.
ABSOLUTE = re.compile(r"^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|//|/|#)")


def _prefix_for(page) -> str:
    """문서 파일 위치와 발행 URL 의 깊이 차이만큼 '../' 를 만든다."""
    depth = page.file.url.count("/") - page.file.src_uri.count("/")
    return "../" * depth if depth > 0 else ""


def on_page_markdown(markdown: str, page, config, files):  # noqa: ARG001 - MkDocs 훅 시그니처
    # 먼저 `{ .foldable }` 이미지를 raw HTML <details> 로 바꾼다. 그러면 아래 경로
    # 보정이 그 안의 <img> 도 마크다운 이미지와 똑같이 다룬다.
    markdown = _apply_foldable(markdown)

    prefix = _prefix_for(page)
    if not prefix:
        return markdown

    def fix_tag(match: re.Match) -> str:
        def fix_attr(attr: re.Match) -> str:
            value = attr.group("value").strip()
            if not value or ABSOLUTE.match(value):
                return attr.group(0)
            quote = attr.group("quote")
            return f"{attr.group('name')}{quote}{prefix}{value}{quote}"

        attrs = ATTR_PATTERN.sub(fix_attr, match.group("attrs"))
        return f"<{match.group('tag')}{attrs}>"

    return TAG_PATTERN.sub(fix_tag, markdown)
