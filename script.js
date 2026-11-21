(() => {
  /* Footer year */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Header border once the page scrolls */
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile nav */
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (toggle && panel) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      panel.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* Turntable: needle drops on load, visitor can lift it */
  const deck = document.querySelector("[data-deck]");
  const deckToggle = document.querySelector("[data-deck-toggle]");
  const deckText = document.querySelector("[data-deck-toggle-text]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (deck && deckToggle && !reduceMotion) {
    const setPlaying = (playing) => {
      deck.classList.toggle("is-playing", playing);
      deckToggle.setAttribute("aria-pressed", String(!playing));
      if (deckText) deckText.textContent = playing ? "Lift the needle" : "Drop the needle";
    };

    window.setTimeout(() => setPlaying(true), 450);

    deckToggle.addEventListener("click", () => {
      setPlaying(!deck.classList.contains("is-playing"));
    });
  }

  /* Inquiry form: composes an email in the visitor's mail app */
  const form = document.querySelector("[data-inquiry]");
  if (form) {
    const nameInput = form.querySelector("#f-name");
    const nameError = form.querySelector("#f-name-err");

    const showNameError = (show) => {
      nameInput.setAttribute("aria-invalid", String(show));
      nameError.hidden = !show;
    };

    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim()) showNameError(false);
    });

    const formatDate = (value) => {
      if (!value) return "";
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();

      if (!name) {
        showNameError(true);
        nameInput.focus();
        return;
      }

      const type = String(data.get("type") || "Event");
      const date = formatDate(String(data.get("date") || ""));
      const guests = String(data.get("guests") || "").trim();
      const venue = String(data.get("venue") || "").trim();
      const notes = String(data.get("notes") || "").trim();

      const lines = [
        "Hi Kyle and Bryan,",
        "",
        `I'd like to check your availability for a ${type.toLowerCase()}.`,
        "",
        `Name: ${name}`,
        `Kind of event: ${type}`,
        `Date: ${date || "Not set yet"}`,
        `Venue or city: ${venue || "Not set yet"}`,
        `Guests: ${guests || "Not sure yet"}`,
      ];
      if (notes) lines.push("", "How the room should feel:", notes);
      lines.push("", "Thanks,", name);

      const subject = `${type} inquiry${date ? ` for ${date}` : ""}`;
      const href =
        "mailto:maestroproductions001@gmail.com" +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(lines.join("\n"))}`;

      window.location.href = href;
    });
  }
})();
