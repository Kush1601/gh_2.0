(() => {
  const CONFIG = {
    useRemoteSheet: false,
    sheetId: "",
    sheetGid: "0",
    localCsvUrl: "assets/sheets/roadmap2026.csv",
    lockedMonth: "april",
    defaultStep: 0
  };

  const CSV_URL = (CONFIG.useRemoteSheet && CONFIG.sheetId)
    ? `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv&gid=${CONFIG.sheetGid}`
    : CONFIG.localCsvUrl;

  const STEP_META = [
    { title: "Day 0",       sub: "Registration" },
    { title: "Day 1", sub: "Prep + Onboarding + Hacking + Workshops" },
    { title: "Day 2",          sub: "Demos + Winners" },

  ];

  
  // DOM
  const agendaList = document.getElementById("ghAgendaList");
  const stepper    = document.getElementById("ghStepperTrack");
  const cardTitle  = document.getElementById("ghCardTitle");
  const cardSub    = document.getElementById("ghCardSubtitle");
  const cardDate   = document.getElementById("ghCardDate");
  const pillsWrap  = document.getElementById("ghFilterPills");

  if (!agendaList || !stepper || !cardTitle || !cardSub || !pillsWrap) return;

  
  let events = [];
  let currentStep = CONFIG.defaultStep;         
  let currentFilter = "all";   

  
  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      if (rows.length <= 1) throw new Error("CSV empty");

      const dataRows = rows.slice(1);

      events = dataRows.map((c, i) => ({
        id: Number(c[0]) || i,
        date: (c[1] || "").trim(),
        month: (c[2] || "").toLowerCase().trim(),
        step: Number(c[3]) || 0,
        time: c[4] || "",
        title: c[5] || "",
        loc: c[6] || "",
        cat: (c[7] || "").toLowerCase().trim(),
        desc: c[8] || ""
      }));

      syncStepperUI();
      render();
    })
    .catch(() => {
      agendaList.textContent = "Could not load roadmap data.";
      agendaList.style.padding = "20px";
      agendaList.style.opacity = ".7";
    });

  function render() {
    const meta = STEP_META[currentStep] || { title: "Timeline", sub: "" };
    cardTitle.textContent = meta.title;
    cardSub.textContent = meta.sub;

    agendaList.innerHTML = "";

    const visible = events.filter(e =>
      e.month === CONFIG.lockedMonth &&
      e.step === currentStep &&
      (currentFilter === "all" || e.cat === currentFilter)
    );

    updateCardDate(visible);

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.style.padding = "20px";
      empty.style.opacity = ".7";
      empty.textContent = `No sessions for this phase in ${CONFIG.lockedMonth}.`;
      agendaList.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    visible.forEach((e, index) => {
      const item = document.createElement("div");
      item.className = "gh-agenda-item";
      const time = document.createElement("div");
      time.className = "gh-time";
      time.textContent = [e.date, e.time].filter(Boolean).join(" ");

      const info = document.createElement("div");
      info.className = "gh-info";

      const title = document.createElement("h5");
      title.textContent = e.title;

      const desc = document.createElement("p");
      desc.textContent = e.desc;

      const loc = document.createElement("span");
      loc.className = "gh-loc";
      loc.textContent = `@ ${e.loc}`;

      info.appendChild(title);
      info.appendChild(desc);
      info.appendChild(loc);

      item.appendChild(time);
      item.appendChild(info);

      if (currentStep === 0 && index === visible.length - 1) {
        const registerWrap = document.createElement("div");
        registerWrap.className = "wrap-btn style3 style3-container";
        registerWrap.innerHTML = `
          <a target="_blank" class="tf-button btn-effect" href="https://forms.office.com/pages/responsepage.aspx?id=2zWeD09UYE-9zF6kFubccHmtLSqBYbBDoSCkHgfKhHpUNURKVEdNMUpRUUxVRURRODk1RE5MSEJWRy4u&route=shorturl">
            <span class="boder-fade"></span>
            <span class="effect">Register</span>
          </a>
        `;
        info.appendChild(registerWrap);
      }

      frag.appendChild(item);
    });
    agendaList.appendChild(frag);
  }

  function updateCardDate(visible) {
    if (!cardDate) return;

    const dates = [];
    visible.forEach(e => {
      const value = (e.date || "").trim();
      if (value && !dates.includes(value)) dates.push(value);
    });

    let label = "";
    if (dates.length === 1) label = `Date: ${dates[0]}`;
    else if (dates.length > 1) label = `Dates: ${dates.join(", ")}`;

    cardDate.textContent = label;
    cardDate.style.display = label ? "" : "none";
  }

  function syncStepperUI() {
    stepper.querySelectorAll(".gh-step-item").forEach(s => {
      s.classList.toggle("is-active", Number(s.dataset.step) === currentStep);
    });
  }

  
  stepper.querySelectorAll(".gh-step-item").forEach(item => {
    item.addEventListener("click", () => {
      currentStep = Number(item.dataset.step);
      syncStepperUI();
      render();
    });
  });

  
  pillsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".gh-pill");
    if (!btn) return;

    currentFilter = (btn.dataset.filter || "all").toLowerCase();

    pillsWrap.querySelectorAll(".gh-pill").forEach(p => p.classList.remove("is-active"));
    btn.classList.add("is-active");

    render();
  });

  // Parses CSV with quoted values and commas; supports multiline quoted cells.
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (inQuotes) {
        if (ch === '"') {
          const next = text[i + 1];
          if (next === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += ch;
        }
        continue;
      }

      if (ch === '"') {
        inQuotes = true;
        continue;
      }

      if (ch === ",") {
        row.push(cell);
        cell = "";
        continue;
      }

      if (ch === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }

      if (ch === "\r") {
        continue;
      }

      cell += ch;
    }

    row.push(cell);
    rows.push(row);
    return rows;
  }
})();
