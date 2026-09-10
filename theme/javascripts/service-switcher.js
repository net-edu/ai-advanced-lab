/* Compact provider switcher: keep equivalent lessons aligned by logical route. */
(function () {
  "use strict";

  const SITE_CONFIG = window.AILAB_SITE_CONFIG || {};
  const SWITCHER_ENABLED = SITE_CONFIG.serviceSwitcherEnabled !== false;
  const SERVICES = ["claude", "codex", "gemini"];
  const LABELS = { claude: "Claude", codex: "Codex", gemini: "Gemini" };
  const ROOT_SECTIONS = [
    "codex", "gemini", "warmup", "claude-code", "concepts", "course",
    "curriculum", "mcp", "reference"
  ];

  const SPECIAL_TO_LOGICAL = {
    claude: {
      "warmup/claude-code-start": "warmup/first-run",
      "claude-code/turn-concept": "cli/turn-concept",
      "claude-code/claude-md-placement": "cli/instructions",
      "claude-code/permissions-and-commands": "cli/permissions-and-commands",
      "claude-code/terminal-features": "cli/terminal-features",
      "claude-code/session-lifecycle": "cli/session-lifecycle",
      "concepts/memory-md": "concepts/memory"
    },
    codex: {
      "warmup/codex-cli-start": "warmup/first-run",
      "codex-cli/turn-concept": "cli/turn-concept",
      "codex-cli/agents-md-placement": "cli/instructions",
      "codex-cli/permissions-and-commands": "cli/permissions-and-commands",
      "codex-cli/terminal-features": "cli/terminal-features",
      "codex-cli/session-lifecycle": "cli/session-lifecycle",
      "concepts/memories": "concepts/memory"
    },
    gemini: {
      "warmup/gemini-cli-start": "warmup/first-run",
      "gemini-cli/turn-concept": "cli/turn-concept",
      "gemini-cli/gemini-md-placement": "cli/instructions",
      "gemini-cli/permissions-and-commands": "cli/permissions-and-commands",
      "gemini-cli/terminal-features": "cli/terminal-features",
      "gemini-cli/session-lifecycle": "cli/session-lifecycle",
      "concepts/memory": "concepts/memory"
    }
  };

  const LOGICAL_TO_SPECIAL = Object.fromEntries(
    SERVICES.map(function (service) {
      return [service, Object.fromEntries(
        Object.entries(SPECIAL_TO_LOGICAL[service]).map(function (entry) {
          return [entry[1], entry[0]];
        })
      )];
    })
  );

  function normalizeRoute(value) {
    return decodeURI(value || "")
      .replace(/^\/+|\/+$/g, "")
      .replace(/\/index\.html$/, "");
  }

  function siteBasePath() {
    const path = window.location.pathname;
    for (const section of ROOT_SECTIONS) {
      const marker = "/" + section + "/";
      const index = path.indexOf(marker);
      if (index >= 0) return path.slice(0, index + 1);
    }
    return path.replace(/(?:index\.html)?$/, "");
  }

  function currentRoute() {
    return normalizeRoute(window.location.pathname.slice(siteBasePath().length));
  }

  function describeRoute(route) {
    const normalized = normalizeRoute(route);
    for (const service of ["codex", "gemini"]) {
      if (normalized === service) return { service: service, relative: "" };
      if (normalized.indexOf(service + "/") === 0) {
        return { service: service, relative: normalized.slice(service.length + 1) };
      }
    }
    return { service: "claude", relative: normalized };
  }

  function logicalRoute(service, relative) {
    return SPECIAL_TO_LOGICAL[service][relative] || relative;
  }

  function targetRoute(service, logical) {
    const relative = LOGICAL_TO_SPECIAL[service][logical] || logical;
    if (service === "claude") return relative;
    return relative ? service + "/" + relative : service;
  }

  function navigate(service) {
    const current = describeRoute(currentRoute());
    const logical = logicalRoute(current.service, current.relative);
    const target = targetRoute(service, logical);
    const base = siteBasePath();
    const next = base + (target ? target + "/" : "") + window.location.search + window.location.hash;
    const here = window.location.pathname + window.location.search + window.location.hash;
    if (next !== here) window.location.assign(next);
  }

  function closeMenu(switcher, returnFocus) {
    const trigger = switcher.querySelector(".ailab-service-switcher__trigger");
    const menu = switcher.querySelector(".ailab-service-switcher__menu");
    trigger.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    if (returnFocus) trigger.focus();
  }

  function openMenu(switcher) {
    const trigger = switcher.querySelector(".ailab-service-switcher__trigger");
    const menu = switcher.querySelector(".ailab-service-switcher__menu");
    trigger.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    const selected = menu.querySelector('[aria-selected="true"]');
    if (selected) selected.focus();
  }

  function makeSwitcher() {
    const switcher = document.createElement("div");
    switcher.className = "ailab-service-switcher";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "ailab-service-switcher__trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-label", "기준 Agent 변경");
    trigger.innerHTML = '<span class="ailab-service-switcher__current"></span><span class="ailab-service-switcher__chevron" aria-hidden="true"></span>';

    const menu = document.createElement("div");
    menu.className = "ailab-service-switcher__menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", "기준 Agent");
    menu.hidden = true;

    SERVICES.forEach(function (service) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "ailab-service-switcher__option";
      option.dataset.service = service;
      option.setAttribute("role", "option");
      option.textContent = LABELS[service];
      option.addEventListener("click", function () { navigate(service); });
      menu.appendChild(option);
    });

    trigger.addEventListener("click", function () {
      if (menu.hidden) openMenu(switcher);
      else closeMenu(switcher, false);
    });
    switcher.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu(switcher, true);
      if (event.key === "ArrowDown" && document.activeElement === trigger) {
        event.preventDefault();
        openMenu(switcher);
      }
    });
    document.addEventListener("click", function (event) {
      if (!switcher.contains(event.target)) closeMenu(switcher, false);
    });

    switcher.appendChild(trigger);
    switcher.appendChild(menu);
    return switcher;
  }

  function ensureSwitcher(service) {
    const header = document.querySelector(".md-header__inner");
    if (!header) return;
    let switcher = header.querySelector(".ailab-service-switcher");
    if (!switcher) {
      switcher = makeSwitcher();
      header.appendChild(switcher);
    }
    switcher.querySelector(".ailab-service-switcher__current").textContent = LABELS[service];
    switcher.querySelectorAll("[data-service]").forEach(function (option) {
      const active = option.dataset.service === service;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function trackFromLabel(label) {
    const match = label.match(/^\[(Codex|Gemini)\]\s*/);
    return match ? match[1].toLowerCase() : "claude";
  }

  function markTrackNavigation(service) {
    document.documentElement.dataset.ailabService = service;
    const updateItem = function (item, link) {
      if (!link) return;
      const text = (link.textContent || "").trim();
      if (!item.dataset.ailabTrack) {
        const wip = text.match(/^\(WIP\)\s*/);
        const bare = text.replace(/^\(WIP\)\s*/, "");
        item.dataset.ailabTrack = trackFromLabel(bare);
        item.dataset.ailabLabel = bare.replace(/^\[(Codex|Gemini)\]\s*/, "");
        item.dataset.ailabWip = wip ? "true" : "false";
      }
      item.hidden = item.dataset.ailabTrack !== service;
      if (!item.hidden) {
        link.textContent = (item.dataset.ailabWip === "true" ? "(WIP) " : "") + item.dataset.ailabLabel;
      }
    };
    document.querySelectorAll(".md-tabs__item").forEach(function (item) {
      updateItem(item, item.querySelector(".md-tabs__link"));
    });
    document.querySelectorAll(".md-nav--primary > .md-nav__list > .md-nav__item").forEach(function (item) {
      updateItem(item, item.querySelector(":scope > .md-nav__link"));
    });
  }

  function init() {
    const service = describeRoute(currentRoute()).service;
    if (SWITCHER_ENABLED) ensureSwitcher(service);
    markTrackNavigation(service);
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(function () { window.setTimeout(init, 0); });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
