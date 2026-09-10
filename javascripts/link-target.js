/*
 * AI Build LAB - open in-content links in a new tab
 *
 * Authoring principle (authoring-principles.md): a hyperlink in the lesson body
 * opens in a new tab, so a learner who follows a reference during class keeps
 * the current page open. Applied at runtime instead of editing every Markdown
 * link by hand.
 *
 * Scope: anchors inside `.md-content` only - the sidebar nav and TOC keep
 * Material's normal same-tab navigation. In-page anchors (`#...`) and the
 * heading permalinks are skipped so section jumps stay in place.
 */
(function () {
  "use strict";

  function apply() {
    const links = document.querySelectorAll(".md-content a[href]");
    Array.prototype.forEach.call(links, function (a) {
      const href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") {
        return;
      }
      if (a.classList.contains("headerlink")) {
        return;
      }
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    });
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(apply);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
