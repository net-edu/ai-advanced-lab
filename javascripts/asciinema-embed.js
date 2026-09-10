/*
 * AI Build LAB - asciinema recording embed
 *
 * Finds `<div class="ailab-asciinema" data-cast="...">` containers and turns
 * each into a playable asciinema-player instance. The vendored player bundle
 * (asciinema-player.min.js) is self-contained (no CDN, no wasm fetch), so this
 * keeps working on a closed network.
 */
(function () {
  "use strict";

  const HOST_SELECTOR = ".ailab-asciinema[data-cast]";
  const INITIALIZED_ATTR = "data-ailab-initialized";

  function init() {
    if (typeof window.AsciinemaPlayer === "undefined") {
      return;
    }
    document.querySelectorAll(HOST_SELECTOR).forEach(function (host) {
      if (host.getAttribute(INITIALIZED_ATTR)) {
        return;
      }
      host.setAttribute(INITIALIZED_ATTR, "true");
      const startAt = host.getAttribute("data-start-at");
      const options = {
        fit: "width",
        terminalFontSize: "small",
        autoPlay: false,
        preload: true
      };
      if (startAt) {
        options.startAt = startAt;
      }
      window.AsciinemaPlayer.create(host.getAttribute("data-cast"), host, options);
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
})();
