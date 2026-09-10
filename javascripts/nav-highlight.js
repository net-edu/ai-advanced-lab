/*
 * AI Build LAB - current navigation highlighter
 *
 * Material for MkDocs already applies active states, but this script makes the
 * states explicit and consistent for the AI Build LAB classroom layout:
 * - left sidebar: exact current page link gets .ailab-nav-current
 * - right sidebar: section closest to the current scroll position gets
 *   .ailab-toc-current
 */
(function () {
  "use strict";

  const PRIMARY_LINK_SELECTOR = ".md-sidebar--primary .md-nav__link[href]";
  const SECONDARY_LINK_SELECTOR = ".md-sidebar--secondary .md-nav__link[href*='#']";
  const CURRENT_PAGE_CLASS = "ailab-nav-current";
  const CURRENT_TOC_CLASS = "ailab-toc-current";
  const HEADING_OFFSET = 120;

  let ticking = false;
  let initialized = false;

  function toArray(nodeList) {
    return Array.prototype.slice.call(nodeList || []);
  }

  function normalizePath(pathname) {
    let path = pathname || "/";

    try {
      path = decodeURI(path);
    } catch (error) {
      // Keep the original path if decoding fails.
    }

    path = path.replace(/\/index\.html$/, "/");

    if (path.length > 1) {
      path = path.replace(/\/$/, "");
    }

    return path;
  }

  function linkUrl(link) {
    try {
      return new URL(link.getAttribute("href"), window.location.href);
    } catch (error) {
      return null;
    }
  }

  function isSamePage(url) {
    if (!url) {
      return false;
    }

    return normalizePath(url.pathname) === normalizePath(window.location.pathname);
  }

  function markCurrentPage() {
    const links = toArray(document.querySelectorAll(PRIMARY_LINK_SELECTOR));

    links.forEach(function (link) {
      link.classList.remove(CURRENT_PAGE_CLASS);

      if (link.getAttribute("aria-current") === "page") {
        link.removeAttribute("aria-current");
      }

      const url = linkUrl(link);
      if (!isSamePage(url)) {
        return;
      }

      // Ignore pure hash links if they appear in the primary nav.
      link.classList.add(CURRENT_PAGE_CLASS);
      link.setAttribute("aria-current", "page");
    });
  }

  function decodeHash(hash) {
    if (!hash || hash === "#") {
      return "";
    }

    const raw = hash.slice(1);
    try {
      return decodeURIComponent(raw);
    } catch (error) {
      return raw;
    }
  }

  function targetForTocLink(link) {
    const url = linkUrl(link);
    if (!url || !isSamePage(url)) {
      return null;
    }

    const id = decodeHash(url.hash);
    if (!id) {
      return null;
    }

    return document.getElementById(id);
  }

  function currentTocPair(pairs) {
    if (!pairs.length) {
      return null;
    }

    let active = pairs[0];

    pairs.forEach(function (pair) {
      const top = pair.target.getBoundingClientRect().top;

      if (top <= HEADING_OFFSET) {
        active = pair;
      }
    });

    // If the page is above the first heading, keep the first TOC item active.
    return active;
  }

  function markCurrentToc() {
    const links = toArray(document.querySelectorAll(SECONDARY_LINK_SELECTOR));
    const pairs = [];

    links.forEach(function (link) {
      link.classList.remove(CURRENT_TOC_CLASS);

      if (link.getAttribute("aria-current") === "location") {
        link.removeAttribute("aria-current");
      }

      const target = targetForTocLink(link);
      if (target) {
        pairs.push({ link: link, target: target });
      }
    });

    const active = currentTocPair(pairs);
    if (!active) {
      return;
    }

    active.link.classList.add(CURRENT_TOC_CLASS);
    active.link.setAttribute("aria-current", "location");
  }

  function refreshHighlights() {
    markCurrentPage();
    markCurrentToc();
  }

  function scheduleRefresh() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      markCurrentToc();
    });
  }

  function init() {
    refreshHighlights();

    if (initialized) {
      return;
    }

    initialized = true;

    window.addEventListener("scroll", scheduleRefresh, { passive: true });
    window.addEventListener("resize", scheduleRefresh, { passive: true });
    window.addEventListener("hashchange", function () {
      window.setTimeout(refreshHighlights, 80);
    });
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
  window.ailabNavHighlightStatus = function () {
    return {
      currentPageLinks: document.querySelectorAll("." + CURRENT_PAGE_CLASS).length,
      currentTocLinks: document.querySelectorAll("." + CURRENT_TOC_CLASS).length,
      primaryLinks: document.querySelectorAll(PRIMARY_LINK_SELECTOR).length,
      secondaryLinks: document.querySelectorAll(SECONDARY_LINK_SELECTOR).length
    };
  };
})();
