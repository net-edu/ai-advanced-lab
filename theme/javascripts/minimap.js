/*
 * AI Build LAB - document minimap
 *
 * VSCode-style minimap for the current page. Instead of drawing abstract
 * blocks, it clones the rendered `.md-content__inner` subtree and shrinks it
 * with a CSS transform, so the map shows the actual rendered Markdown:
 * headings, syntax-highlighted code, tables and images all keep their shape.
 *
 * Layout: a fixed strip placed to the LEFT of the right-hand table of
 * contents, so the page stays visually balanced.
 *
 * Design notes:
 * - No external dependency and no CDN, so it keeps working on a closed network.
 * - The clone is inert: ids stripped, scripts removed, pointer events off.
 * - Only the transform is touched while scrolling; the clone is rebuilt just
 *   when the document itself changes.
 * - Desktop only by design; no mobile breakpoint handling.
 */
(function () {
  "use strict";

  const CONTENT_SELECTOR = ".md-content__inner";
  const TOC_SELECTOR = ".md-sidebar--secondary";
  const HOST_CLASS = "ailab-minimap";
  const DOC_CLASS = "ailab-minimap__doc";
  const VIEWPORT_CLASS = "ailab-minimap__viewport";

  const REBUILD_DELAY = 150;
  const BOTTOM_GAP = 12;

  let host = null;
  let doc = null;
  let viewport = null;
  let content = null;

  let footer = null;

  let resizeObserver = null;
  let mutationObserver = null;
  let schemeObserver = null;

  let rebuildTimer = 0;
  let scrollTicking = false;
  let dragging = false;

  // Geometry of the last layout pass, reused by the cheap scroll updates.
  let geo = {
    top: 0,
    contentTop: 0,
    contentHeight: 1,
    scale: 1,
    mapHeight: 0,
    stripHeight: 0,
    offset: 0
  };

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /*
   * Pin the strip below the sticky header/tab bar, and to the left edge of the
   * table of contents. Both are measured rather than hard-coded so responsive
   * breakpoints and scrollbar widths stay correct.
   */
  function updateOffsets() {
    const header = document.querySelector(".md-header");
    const tabs = document.querySelector(".md-tabs");

    let top = 0;
    if (header) {
      top += header.offsetHeight;
    }
    // Material removes the tab bar from the flow on pages without tabs.
    if (tabs && tabs.offsetParent !== null) {
      top += tabs.offsetHeight;
    }

    const root = document.documentElement;
    root.style.setProperty("--ailab-minimap-top", top + "px");

    const toc = document.querySelector(TOC_SELECTOR);
    if (toc) {
      const tocRect = toc.getBoundingClientRect();
      if (tocRect.width > 0) {
        const right = Math.max(window.innerWidth - tocRect.left, 0);
        root.style.setProperty("--ailab-minimap-right", right + "px");
      }
    }

    return top;
  }

  /* Copy the rendered content and strip everything that must not be duplicated. */
  function buildClone() {
    const clone = content.cloneNode(true);

    // Duplicate ids would break in-page anchors and `getElementById`.
    clone.removeAttribute("id");
    toArray(clone.querySelectorAll("[id]")).forEach(function (element) {
      element.removeAttribute("id");
    });

    toArray(clone.querySelectorAll("script, iframe, .md-clipboard")).forEach(
      function (element) {
        element.remove();
      }
    );

    // Lazy images never enter the viewport inside the map, so force them.
    toArray(clone.querySelectorAll("img")).forEach(function (img) {
      img.loading = "eager";
    });

    doc.replaceChildren(clone);
  }

  /*
   * Visible height of the strip.
   *
   * The map is fixed, so at the end of the page it would sit on top of the
   * footer ("Made with Material for MkDocs"). Clamp it to whatever room is
   * left above the footer, which shrinks the strip as the footer scrolls in.
   */
  function stripHeight() {
    let bottom = window.innerHeight - BOTTOM_GAP;

    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      if (footerTop < bottom) {
        bottom = footerTop - BOTTOM_GAP;
      }
    }

    return clamp(bottom - geo.top, 0, geo.mapHeight);
  }

  /* Cheap per-scroll update: resize, slide the map and move the viewport box. */
  function update() {
    if (!doc || geo.scale <= 0) {
      return;
    }

    geo.stripHeight = stripHeight();
    host.style.height = geo.stripHeight + "px";

    const scrolled = window.scrollY - geo.contentTop;
    const maxOffset = Math.max(geo.mapHeight - geo.stripHeight, 0);
    const scrollRange = Math.max(geo.contentHeight - window.innerHeight, 1);
    const ratio = clamp(scrolled / scrollRange, 0, 1);

    geo.offset = maxOffset * ratio;

    doc.style.transform =
      "translateY(" + -geo.offset + "px) scale(" + geo.scale + ")";

    viewport.style.height = window.innerHeight * geo.scale + "px";
    viewport.style.transform =
      "translateY(" + (scrolled * geo.scale - geo.offset) + "px)";
  }

  /* Full layout pass: re-measure, rescale and rebuild the clone. */
  function render() {
    if (!content || !host) {
      return;
    }

    const top = updateOffsets();

    const contentWidth = content.offsetWidth;
    const contentHeight = content.offsetHeight;
    const stripWidth = host.clientWidth;

    if (contentWidth <= 0 || stripWidth <= 0) {
      return;
    }

    const scale = stripWidth / contentWidth;

    // The clone must lay out at the real content width, otherwise line breaks
    // and wrapping differ and the map stops matching the page.
    doc.style.width = contentWidth + "px";

    footer = document.querySelector(".md-footer");

    geo = {
      top: top,
      contentTop: content.getBoundingClientRect().top + window.scrollY,
      contentHeight: contentHeight,
      scale: scale,
      // Short pages should not stretch an empty strip down to the fold.
      mapHeight: contentHeight * scale,
      stripHeight: 0,
      offset: 0
    };

    buildClone();
    update();
  }

  function scheduleRender() {
    window.clearTimeout(rebuildTimer);
    rebuildTimer = window.setTimeout(render, REBUILD_DELAY);
  }

  function onScroll() {
    if (scrollTicking) {
      return;
    }
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      scrollTicking = false;
      update();
    });
  }

  /* Map a pointer position on the strip back to a document scroll offset. */
  function scrollToPointer(event) {
    if (geo.scale <= 0) {
      return;
    }

    const rect = host.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const contentY = (y + geo.offset) / geo.scale;
    const target = geo.contentTop + contentY - window.innerHeight / 2;

    window.scrollTo({ top: Math.max(target, 0), behavior: "auto" });
  }

  function bindPointer() {
    host.addEventListener("pointerdown", function (event) {
      dragging = true;
      host.setPointerCapture(event.pointerId);
      scrollToPointer(event);
      event.preventDefault();
    });

    host.addEventListener("pointermove", function (event) {
      if (dragging) {
        scrollToPointer(event);
      }
    });

    ["pointerup", "pointercancel"].forEach(function (type) {
      host.addEventListener(type, function (event) {
        dragging = false;
        if (host.hasPointerCapture(event.pointerId)) {
          host.releasePointerCapture(event.pointerId);
        }
      });
    });
  }

  function disconnectObservers() {
    [resizeObserver, mutationObserver, schemeObserver].forEach(function (observer) {
      if (observer) {
        observer.disconnect();
      }
    });
    resizeObserver = null;
    mutationObserver = null;
    schemeObserver = null;
  }

  function observe() {
    if (window.ResizeObserver) {
      // Covers width changes and late-loading images that shift the height.
      resizeObserver = new ResizeObserver(scheduleRender);
      resizeObserver.observe(content);
    }

    if (window.MutationObserver) {
      // Catches <details> toggles, glightbox wrappers and injected nodes.
      // Our own writes land on the clone, which lives outside `content`.
      mutationObserver = new MutationObserver(scheduleRender);
      mutationObserver.observe(content, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["open", "class", "style", "hidden"]
      });

      // Material stores the active palette on <body>.
      schemeObserver = new MutationObserver(scheduleRender);
      schemeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-md-color-scheme", "data-md-color-primary"]
      });
    }
  }

  function ensureHost() {
    host = document.querySelector("." + HOST_CLASS);
    if (host) {
      return;
    }

    host = document.createElement("div");
    host.className = HOST_CLASS;
    host.setAttribute("aria-hidden", "true");

    doc = document.createElement("div");
    doc.className = DOC_CLASS + " md-content";

    viewport = document.createElement("div");
    viewport.className = VIEWPORT_CLASS;

    host.appendChild(doc);
    host.appendChild(viewport);
    document.body.appendChild(host);

    bindPointer();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleRender, { passive: true });
    window.addEventListener("load", scheduleRender);
  }

  function init() {
    content = document.querySelector(CONTENT_SELECTOR);

    if (!content) {
      if (host) {
        host.hidden = true;
      }
      return;
    }

    ensureHost();
    host.hidden = false;

    doc = host.querySelector("." + DOC_CLASS);
    viewport = host.querySelector("." + VIEWPORT_CLASS);

    disconnectObservers();
    observe();
    render();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () {
      window.setTimeout(init, 80);
    });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Small diagnostic helper for troubleshooting in browser devtools.
  window.ailabMinimapStatus = function () {
    return {
      mounted: Boolean(host && !host.hidden),
      scale: geo.scale,
      mapHeight: geo.mapHeight,
      stripHeight: geo.stripHeight,
      offset: geo.offset
    };
  };

  window.ailabMinimapRedraw = render;
})();
