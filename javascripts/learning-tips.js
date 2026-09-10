/* AI Advanced Lab — floating course-use tips. */
(function () {
  "use strict";

  const WIDGET_ID = "ailab-learning-tips";

  function mount() {
    if (document.getElementById(WIDGET_ID)) {
      return;
    }

    const widget = document.createElement("aside");
    widget.id = WIDGET_ID;
    widget.className = "ailab-learning-tips";
    widget.innerHTML =
      '<button class="ailab-learning-tips__trigger" type="button" aria-expanded="false" aria-controls="ailab-learning-tips-panel">' +
      '<span aria-hidden="true">?</span><span class="ailab-learning-tips__trigger-label">교안 활용 팁</span></button>' +
      '<section id="ailab-learning-tips-panel" class="ailab-learning-tips__panel" role="dialog" aria-label="교안 활용 팁" hidden>' +
      '<div class="ailab-learning-tips__panel-head"><p>GUIDE</p><button class="ailab-learning-tips__close" type="button" aria-label="교안 활용 팁 닫기">×</button></div>' +
      '<h2>교안 활용 팁</h2>' +
      '<ol>' +
      '<li><strong>검색으로 바로 이동</strong><span>우측 상단 검색창에 찾고 싶은 키워드를 입력하세요.</span></li>' +
      '<li><strong>Ctrl로 자세히 보기</strong><span>Ctrl을 누른 채 텍스트·이미지·차트 위에 포인터를 두면 확대 glass가 열립니다.</span></li>' +
      '<li><strong>목차로 맥락 잡기</strong><span>좌측은 전체 교안 구조, 우측은 현재 페이지의 세부 목차입니다.</span></li>' +
      '<li><strong>섹션 제목을 눌러 이동</strong><span>우측 목차 항목을 누르면 해당 설명으로 바로 이동합니다.</span></li>' +
      '</ol>' +
      '</section>';
    document.body.appendChild(widget);

    const trigger = widget.querySelector(".ailab-learning-tips__trigger");
    const panel = widget.querySelector(".ailab-learning-tips__panel");
    const close = widget.querySelector(".ailab-learning-tips__close");

    function setOpen(open) {
      panel.hidden = !open;
      widget.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        close.focus();
      } else {
        trigger.focus();
      }
    }

    trigger.addEventListener("click", function () {
      setOpen(panel.hidden);
    });
    close.addEventListener("click", function () {
      setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        setOpen(false);
      }
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(mount);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
