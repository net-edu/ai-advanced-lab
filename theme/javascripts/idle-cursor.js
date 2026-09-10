/*
 * AI Advanced Lab - idle pointer signal
 *
 * A small editorial pointer replaces the system cursor. After 1.5 seconds
 * without pointer movement it unfolds into an agent-status marker. Any user
 * action clears only the idle state. It is disabled on touch devices and for
 * users who request reduced motion.
 */
(function () {
  "use strict";

  const IDLE_DELAY = 1500;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let marker;
  let idleTimer;
  let hasPointerPosition = false;
  let lastX = 0;
  let lastY = 0;
  let ctrlPressed = false;
  let lensSource;

  function isEnabled() {
    return finePointer.matches && !reducedMotion.matches;
  }

  function createMarker() {
    if (marker) {
      return marker;
    }

    marker = document.createElement("div");
    marker.className = "ailab-idle-cursor";
    marker.setAttribute("aria-hidden", "true");
    marker.innerHTML =
      '<span class="ailab-idle-cursor__ring"></span>' +
      '<span class="ailab-idle-cursor__crosshair"></span>' +
      '<span class="ailab-idle-cursor__dots"><i></i><i></i><i></i></span>' +
      '<span class="ailab-cursor-lens"><span class="ailab-cursor-lens__scene"></span><span class="ailab-cursor-lens__text"></span></span>';
    document.body.appendChild(marker);
    return marker;
  }

  function hideMarker() {
    if (marker) {
      marker.classList.remove("is-tracking", "is-idle");
    }
  }

  function clearIdleState() {
    if (marker) {
      marker.classList.remove("is-idle");
    }
  }

  function clearIdleTimer() {
    if (idleTimer) {
      window.clearTimeout(idleTimer);
      idleTimer = undefined;
    }
  }

  function showMarker() {
    if (!isEnabled() || !hasPointerPosition || document.hidden) {
      return;
    }

    const element = createMarker();
    element.style.left = lastX + "px";
    element.style.top = lastY + "px";
    element.classList.add("is-idle");
  }

  function scheduleIdleMarker() {
    clearIdleTimer();
    if (!isEnabled()) {
      return;
    }
    idleTimer = window.setTimeout(showMarker, IDLE_DELAY);
  }

  function textSliceAtPoint(x, y) {
    let range;

    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(x, y);
      if (position) {
        range = document.createRange();
        range.setStart(position.offsetNode, position.offset);
      }
    }

    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) {
      return "";
    }

    const text = range.startContainer.textContent || "";
    const offset = Math.min(range.startOffset, text.length);
    const start = Math.max(0, offset - 1);
    const end = Math.min(text.length, offset + 2);
    return text.slice(start, end).replace(/\s+/g, " ");
  }

  function updateLens(element, x, y) {
    const lensText = element.querySelector(".ailab-cursor-lens__text");
    const textSlice = textSliceAtPoint(x, y);

    if (!lensText) {
      return false;
    }

    lensText.textContent = textSlice;
    return Boolean(textSlice.trim());
  }

  function syncLensScene(element, x, y) {
    const stage = element.querySelector(".ailab-cursor-lens__scene");
    const source = document.querySelector(".md-content__inner");

    if (!stage || !source) {
      return;
    }

    if (lensSource !== source) {
      const copy = source.cloneNode(true);
      copy.classList.add("ailab-cursor-lens__document");
      copy.setAttribute("aria-hidden", "true");
      copy.querySelectorAll("[id]").forEach(function (node) {
        node.removeAttribute("id");
      });
      stage.replaceChildren(copy);
      lensSource = source;
    }

    const copy = stage.firstElementChild;
    const bounds = source.getBoundingClientRect();
    const zoom = 4.704;
    const lensRadius = stage.clientWidth / 2;

    if (!copy || !bounds.width || !lensRadius) {
      return;
    }

    copy.style.width = bounds.width + "px";
    copy.style.left = lensRadius - (x - bounds.left) * zoom + "px";
    copy.style.top = lensRadius - (y - bounds.top) * zoom + "px";
    copy.style.transform = "scale(" + zoom + ")";
  }

  function isVisualTargetAtPoint(x, y) {
    const target = document.elementFromPoint(x, y);

    if (!target || typeof target.closest !== "function") {
      return false;
    }

    return Boolean(
      target.closest("img, svg, canvas, video, iframe, .mermaid, .glightbox, .md-typeset__table")
    );
  }

  function refreshPointerMarker() {
    if (!hasPointerPosition) {
      return;
    }

    const element = createMarker();
    element.style.left = lastX + "px";
    element.style.top = lastY + "px";
    clearIdleState();
    const isVisualTarget = isVisualTargetAtPoint(lastX, lastY);

    if (ctrlPressed && isVisualTarget) {
      element.classList.add("has-lens", "is-tracking");
      syncLensScene(element, lastX, lastY);
      scheduleIdleMarker();
    } else if (!isVisualTarget && updateLens(element, lastX, lastY)) {
      element.classList.toggle("has-lens", ctrlPressed);
      if (ctrlPressed) {
        syncLensScene(element, lastX, lastY);
      }
      element.classList.add("is-tracking");
      scheduleIdleMarker();
    } else if (isVisualTarget) {
      // Visual content has no text to magnify, but the pointer must remain visible.
      element.classList.remove("has-lens");
      element.classList.add("is-tracking");
      clearIdleTimer();
    } else {
      hideMarker();
      clearIdleTimer();
    }
  }

  function onPointerMove(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    hasPointerPosition = true;
    ctrlPressed = Boolean(event.ctrlKey);
    refreshPointerMarker();
  }

  function onModifierChange(event) {
    const controlReleased = event.type === "keyup" && event.key === "Control";
    const controlPressed = event.key === "Control";
    const modifierState = typeof event.getModifierState === "function" &&
      event.getModifierState("Control");
    const nextCtrlPressed = controlReleased
      ? false
      : Boolean(event.ctrlKey || modifierState || controlPressed);

    if (ctrlPressed === nextCtrlPressed) {
      return;
    }

    ctrlPressed = nextCtrlPressed;
    refreshPointerMarker();
  }

  function onActivity() {
    clearIdleState();
    clearIdleTimer();
  }

  function createClickRipple(event) {
    if (!isEnabled() || event.pointerType === "touch") {
      return;
    }

    const ripple = document.createElement("span");
    ripple.className = "ailab-click-ripple";
    ripple.setAttribute("aria-hidden", "true");
    ripple.style.left = event.clientX + "px";
    ripple.style.top = event.clientY + "px";
    ripple.innerHTML = "<i></i><i></i><i></i>";
    document.body.appendChild(ripple);
    window.setTimeout(function () {
      ripple.remove();
    }, 2200);
  }

  function onPointerLeave() {
    hasPointerPosition = false;
    hideMarker();
    clearIdleTimer();
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", function (event) {
    onActivity();
    createClickRipple(event);
  }, { passive: true });
  window.addEventListener("scroll", onActivity, { passive: true });
  window.addEventListener("keydown", function (event) {
    onActivity();
    onModifierChange(event);
  }, { passive: true });
  window.addEventListener("keyup", onModifierChange, { passive: true });
  window.addEventListener("blur", onActivity);
  document.addEventListener("visibilitychange", onActivity);
  document.documentElement.addEventListener("mouseleave", onPointerLeave);
})();
