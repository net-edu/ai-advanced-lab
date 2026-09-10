/*
 * AI Advanced Lab - contextual sticky-header title
 *
 * Material reveals `header-topic` as the page scrolls. Replace its single
 * document title with "current page - current section", based on the heading
 * nearest the sticky header.
 */
(function () {
  "use strict";

  let ticking = false;

  function cleanText(element) {
    if (!element) {
      return "";
    }

    const copy = element.cloneNode(true);
    copy.querySelectorAll(".headerlink, .md-annotation").forEach(function (node) {
      node.remove();
    });
    return (copy.textContent || "").replace(/\s+/g, " ").trim();
  }

  function headerOffset() {
    const header = document.querySelector(".md-header");
    const tabs = document.querySelector(".md-tabs");
    let offset = header ? header.offsetHeight : 0;

    if (tabs && tabs.offsetParent !== null) {
      offset += tabs.offsetHeight;
    }

    return offset + 20;
  }

  function currentHeading(headings) {
    const threshold = headerOffset();
    let current = headings[0] || null;

    headings.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= threshold) {
        current = heading;
      }
    });

    return current;
  }

  function updateHeaderTopic() {
    const topic = document.querySelector(
      '.md-header [data-md-component="header-topic"] .md-ellipsis'
    );
    const pageHeading = document.querySelector(".md-typeset h1");

    if (!topic || !pageHeading) {
      return;
    }

    const pageTitle = cleanText(pageHeading);
    const headings = Array.prototype.slice.call(
      document.querySelectorAll(".md-typeset h2[id], .md-typeset h3[id], .md-typeset h4[id]")
    );
    const section = cleanText(currentHeading(headings));
    const title = section ? pageTitle + " - " + section : pageTitle;

    if (topic.textContent.trim() !== title) {
      topic.textContent = title;
      topic.setAttribute("title", title);
    }
  }

  function scheduleUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      updateHeaderTopic();
    });
  }

  function init() {
    window.setTimeout(updateHeaderTopic, 0);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
