window.addEventListener("DOMContentLoaded", () => {
  const textElement = document.getElementById("typing-text");
  const phrase = "KAPOO STORE";

  const TYPE_SPEED = 120; // ms per character
  const ERASE_SPEED = 80;
  const HOLD_AFTER_TYPE = 1000;
  const HOLD_AFTER_ERASE = 400;

  let index = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!textElement) return;

    if (!isDeleting) {
      textElement.textContent = phrase.slice(0, index + 1);
      index++;

      if (index === phrase.length) {
        setTimeout(() => {
          isDeleting = true;
          typeLoop();
        }, HOLD_AFTER_TYPE);
        return;
      }

      setTimeout(typeLoop, TYPE_SPEED);
    } else {
      textElement.textContent = phrase.slice(0, index - 1);
      index--;

      if (index === 0) {
        setTimeout(() => {
          isDeleting = false;
          typeLoop();
        }, HOLD_AFTER_ERASE);
        return;
      }

      setTimeout(typeLoop, ERASE_SPEED);
    }
  }

  typeLoop();

  // ------- Home page navigation & localStorage -------

  const STORAGE_KEYS = {
    LAST_SECTION: "kapoo_last_section",
  };

  function setLastSection(sectionId) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SECTION, sectionId);
    } catch {
      // ignore
    }
  }

  function getLastSection() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_SECTION);
    } catch {
      return null;
    }
  }

  // When clicking a section, open a new page with the table
  document.querySelectorAll(".code-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionId = btn.getAttribute("data-section-id");
      const sectionName =
        btn.getAttribute("data-section-name") || btn.textContent.trim();

      if (!sectionId) return;

      setLastSection(sectionId);

      const params = new URLSearchParams({
        section: sectionId,
        name: sectionName,
      });

      window.location.href = `section.html?${params.toString()}`;
    });
  });
});

