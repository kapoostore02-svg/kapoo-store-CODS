const sectionGreetingEl = document.getElementById("section-greeting");
const sectionNameEl = document.getElementById("section-name");
const codesTbody = document.getElementById("codes-tbody");
const noCodesMessage = document.getElementById("no-codes-message");
const backButton = document.getElementById("back-button");

const SECTIONS = {
  pubg: {
    greeting: "أهلاً بك في قسم ببجي",
    codes: [
      "950bet512d",
      "652ljgu065",
      "hgn8762gt2",
      "0186g25g4k",
      "053hty60u5",
      "h05k8j8p94",
      "fhtd059mku",
      "ftnla0585i",
      "plzgtl69d0",
      "gj5yfy5f9f",
    ],
  },
  freefire: {
    greeting: "أهلاً بك في قسم فري فاير",
    codes: [
      "trgnmi854o",
      "hfg625hty8",
      "uft5l87hlf",
      "uytdv859mj",
      "yt05hgu850",
      "fuj589jhy5",
      "olj580fuiy",
      "okjdtn058d",
      "kf87f26fl8",
      "dro862hfy0",
    ],
  },
  hacks: {
    greeting: "أهلاً بك في قسم طرق وثغرات",
    codes: [
      "hfy875fli0",
      "hfynzf5809",
      "ytd528jdhu",
      "tdy58jun20",
      "fsr54ung20",
      "dgch5860ju",
      "nchgdu058k",
      "jfuyf058lk",
      "jhku58bg20",
      "mcj015hyf9",
    ],
  },
  charging: {
    greeting: "أهلاً بك في قسم الشحن",
    codes: [
      "ufy58fvki8",
      "jfuio58li89",
      "jyxcf85760",
      "juh985jh20",
      "015lom569k",
      "jfy802f8p5",
      "jfy58202kfi",
      "jhy594l,j2",
      "frd520jfu0",
      "uyd520li05",
    ],
  },
  design: {
    greeting: "أهلاً بك في قسم تصميم",
    codes: [
      "jfy876jfu8",
      "dtv21lifh8",
      "sfvum8759m",
      "afrncy2580",
      "dhy8754kim",
      "hdy018lfj0",
      "jdu58fim0v",
      "hdgy856of0",
      "jdu875dhy0",
      "hstf025kh0",
    ],
  },
};

const STORAGE_KEYS = {
  LAST_SECTION: "kapoo_last_section",
  COPY_COUNTS: "kapoo_copy_counts",
};

function loadCopyCounts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COPY_COUNTS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCopyCounts(counts) {
  try {
    localStorage.setItem(STORAGE_KEYS.COPY_COUNTS, JSON.stringify(counts));
  } catch {
    // ignore
  }
}

let copyCounts = loadCopyCounts();

function setLastSection(sectionId) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_SECTION, sectionId);
  } catch {
    // ignore
  }
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    sectionId: params.get("section") || "",
    sectionName: params.get("name") || "",
  };
}

function renderSection(sectionId, sectionName) {
  const config = SECTIONS[sectionId] || {
    greeting: `أهلاً بك في ${sectionName}`,
    codes: [],
  };

  sectionGreetingEl.textContent = config.greeting;
  sectionNameEl.textContent = sectionName || "";

  codesTbody.innerHTML = "";

  if (!config.codes || config.codes.length === 0) {
    noCodesMessage.hidden = false;
  } else {
    noCodesMessage.hidden = true;

    config.codes.forEach((code, index) => {
      const tr = document.createElement("tr");

      const tdIndex = document.createElement("td");
      tdIndex.textContent = index + 1;

      const tdCode = document.createElement("td");
      tdCode.classList.add("code-cell");

      const codeText = document.createElement("span");
      codeText.textContent = code;

      const copiedLabel = document.createElement("span");
      copiedLabel.textContent = " - تم النسخ مسبقاً";
      copiedLabel.className = "copied-label";
      copiedLabel.hidden = true;

      const key = `${sectionId}:${code}`;
      if (copyCounts[key] && copyCounts[key] > 0) {
        copiedLabel.hidden = false;
      }

      tdCode.appendChild(codeText);
      tdCode.appendChild(copiedLabel);

      const tdAction = document.createElement("td");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "نسخ";

      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code);

          copyCounts[key] = (copyCounts[key] || 0) + 1;
          saveCopyCounts(copyCounts);
          copiedLabel.hidden = false;

          const oldText = btn.textContent;
          btn.textContent = "تم النسخ";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = oldText;
            btn.classList.remove("copied");
          }, 900);
        } catch {
          const oldText = btn.textContent;
          btn.textContent = "خطأ في النسخ";
          btn.classList.add("error");
          setTimeout(() => {
            btn.textContent = oldText;
            btn.classList.remove("error");
          }, 900);
        }
      });

      tdAction.appendChild(btn);

      tr.appendChild(tdIndex);
      tr.appendChild(tdCode);
      tr.appendChild(tdAction);

      codesTbody.appendChild(tr);
    });
  }

  setLastSection(sectionId);
}

backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

const { sectionId, sectionName } = getQueryParams();

if (sectionId) {
  renderSection(sectionId, sectionName || "القسم");
} else {
  // If no section id in URL, go back to home
  window.location.href = "index.html";
}