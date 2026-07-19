(() => {
  "use strict";

  const PROGRESS_KEY = "scientificIllustration.progress.v1";
  const THEME_KEY = "scientificIllustration.theme.v1";
  const tabs = Array.from(document.querySelectorAll("[role='tab'][data-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const names = panels.map((panel) => panel.dataset.panel);
  const titles = tabs.map((tab) => tab.textContent.replace(/^\s*\d+\s*/, "").trim());
  const nav = document.querySelector("#lesson-nav");
  const menu = document.querySelector("#menu-toggle");
  const prev = document.querySelector("#prev-panel");
  const next = document.querySelector("#next-panel");
  let state = loadState();

  function loadState() {
    try {
      const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return {
        current: names.includes(data.current) ? data.current : "home",
        visited: Array.isArray(data.visited) ? data.visited.filter((name) => names.includes(name)) : ["home"]
      };
    } catch {
      return { current: "home", visited: ["home"] };
    }
  }

  function saveState() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }

  function updateProgress(index) {
    const count = new Set(state.visited).size;
    const percent = Math.round(count / panels.length * 100);
    document.querySelector("#progress-fill").style.width = percent + "%";
    document.querySelector("#progress-label").textContent = count + " / " + panels.length;
    document.querySelector(".progress-shell [role='progressbar']").setAttribute("aria-valuenow", String(percent));
    document.querySelector("#footer-current").textContent = String(index + 1).padStart(2, "0");
    document.querySelector("#footer-title").textContent = titles[index];
    prev.disabled = index === 0;
    next.disabled = index === panels.length - 1;
  }

  function selectPanel(name, options) {
    const settings = Object.assign({ updateHash: true, focus: true }, options || {});
    const index = names.indexOf(name);
    if (index < 0) return;
    panels.forEach((panel, itemIndex) => {
      panel.hidden = itemIndex !== index;
      panel.classList.toggle("is-active", itemIndex === index);
    });
    tabs.forEach((tab, itemIndex) => {
      const active = itemIndex === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    state.current = name;
    if (!state.visited.includes(name)) state.visited.push(name);
    saveState();
    updateProgress(index);
    if (settings.updateHash && location.hash !== "#" + name) history.pushState(null, "", "#" + name);
    nav.classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    if (settings.focus) {
      scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      const heading = panels[index].querySelector("h1");
      if (heading) {
        heading.tabIndex = -1;
        requestAnimationFrame(() => heading.focus({ preventScroll: true }));
      }
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPanel(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let target = index;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      tabs[target].focus();
      selectPanel(tabs[target].dataset.tab);
    });
  });

  document.querySelectorAll("[data-go], [data-tab-link]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      selectPanel(control.dataset.go || control.dataset.tabLink);
      if (control.dataset.practiceFocus) requestAnimationFrame(() => activatePractice(control.dataset.practiceFocus));
    });
  });
  prev.addEventListener("click", () => {
    const index = names.indexOf(state.current);
    if (index > 0) selectPanel(names[index - 1]);
  });
  next.addEventListener("click", () => {
    const index = names.indexOf(state.current);
    if (index < names.length - 1) selectPanel(names[index + 1]);
  });
  addEventListener("popstate", () => selectPanel(location.hash.slice(1) || "home", { updateHash: false }));
  menu.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });

  const themeButton = document.querySelector("#theme-toggle");
  function setTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "切換為淺色模式" : "切換為深色模式");
    themeButton.querySelector("span:last-child").textContent = dark ? "淺色" : "深色";
    localStorage.setItem(THEME_KEY, theme);
  }
  setTheme(localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeButton.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

  const fullscreen = document.querySelector("#fullscreen-toggle");
  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      fullscreen.title = "此瀏覽器目前不允許全螢幕";
    }
  });
  document.addEventListener("fullscreenchange", () => {
    const exit = Boolean(document.fullscreenElement);
    fullscreen.querySelector("span:last-child").textContent = exit ? "離開全螢幕" : "全螢幕";
    fullscreen.setAttribute("aria-label", exit ? "離開全螢幕" : "進入全螢幕");
  });

  document.querySelector("#restart-learning").addEventListener("click", () => {
    if (!confirm("要清除學習進度、測驗結果與觀察紀錄，重新開始嗎？")) return;
    Object.keys(localStorage).filter((key) => key.startsWith("scientificIllustration.")).forEach((key) => localStorage.removeItem(key));
    location.hash = "home";
    location.reload();
  });

  const topButton = document.querySelector("#back-to-top");
  addEventListener("scroll", () => topButton.classList.toggle("is-visible", scrollY > 500), { passive: true });
  topButton.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "image-fallback";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", image.alt || "圖片載入失敗");
      fallback.textContent = "圖片載入失敗：" + (image.alt || "請參考文字說明");
      image.replaceWith(fallback);
    }, { once: true });
  });

  const comparisons = {
    scientific: ["科學繪圖", "忠於觀察、比例與可辨識特徵；可整理或強調重要構造，常搭配標示與比例尺。"],
    art: ["藝術繪畫", "可以自由選擇色彩、構圖、情緒與變形；主要目標不一定是讓人做科學辨認。"],
    cartoon: ["卡通插畫", "透過簡化與誇張快速傳達角色或故事，但簡化後的構造不一定能用來分類。"],
    photo: ["科學攝影", "保留特定時間、角度、光線與鏡頭條件下的影像；可搭配量尺與後製標示。"]
  };
  document.querySelectorAll("[data-compare]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-compare]").forEach((item) => item.classList.toggle("is-selected", item === button));
      const readout = document.querySelector("#comparison-readout");
      readout.querySelector("h2").textContent = comparisons[button.dataset.compare][0];
      readout.querySelector("p").textContent = comparisons[button.dataset.compare][1];
    });
  });
  document.querySelectorAll("[data-classify]").forEach((button) => {
    button.addEventListener("click", () => {
      const output = document.querySelector("#classification-feedback");
      const correct = button.dataset.classify === "scientific";
      output.className = "feedback " + (correct ? "is-success" : "is-warning");
      output.textContent = correct
        ? "適合。分類紀錄需要可比較的構造、合理比例與必要標示；科學照片也能輔助，但只看照片可能受角度、遮擋與景深限制。"
        : "再想想：這個選項有它的用途，但昆蟲分類紀錄還需要清楚、可比較的構造與必要標示。";
    });
  });

  const toolChoices = Array.from(document.querySelectorAll("[data-tool-choice]"));
  toolChoices.forEach((button) => button.addEventListener("click", () => {
    button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
  }));
  document.querySelector("#check-tools").addEventListener("click", () => {
    const selected = toolChoices.filter((button) => button.getAttribute("aria-pressed") === "true");
    const wrong = selected.filter((button) => button.dataset.correct !== "true");
    const missing = toolChoices.filter((button) => button.dataset.correct === "true" && button.getAttribute("aria-pressed") !== "true");
    const output = document.querySelector("#tool-feedback");
    if (!wrong.length && !missing.length) {
      output.className = "feedback is-success";
      output.textContent = "工具箱完成！鉛筆、尺、放大鏡、紀錄本與橡皮擦足以開始葉片觀察。";
    } else {
      output.className = "feedback is-warning";
      output.textContent = wrong.length ? "有些工具只會裝飾或留下干擾。先選能觀察、量測、記錄與修正的工具。" : "還少 " + missing.length + " 個基本工具。";
    }
  });
  document.querySelector("#reset-tools").addEventListener("click", () => {
    toolChoices.forEach((button) => button.setAttribute("aria-pressed", "false"));
    document.querySelector("#tool-feedback").textContent = "先選擇，再檢查。";
  });

  const steps = [
    ["選擇觀察對象", "從葉片、花朵、果實、種子、昆蟲、羽毛、貝殼或岩石中，選一個能安全、穩定觀察的對象。", "選擇完整、光線充足、可以從不同方向看的標本。", "一開始就選太複雜或仍快速移動的對象。"],
    ["先觀察，不急著畫", "從遠近、正反與不同方向看，先說出最重要的外形與特徵。", "用手指在空中比出長寬，再找三個辨識特徵。", "只看第一眼就立刻描細節，忽略整體。"],
    ["決定觀察角度", "選正面、側面、背面、腹面、俯視或剖面，讓任務要看的構造最清楚。", "在紀錄中寫下觀察角度，必要時加畫另一視角。", "不停改變角度，讓不同部分無法對齊。"],
    ["畫出基本外形", "使用很淡的線安排長、寬、輪廓、中軸與主要比例。", "先畫大，再把複雜外形拆成幾何形。", "一開始重壓輪廓，比例錯了難以修正。"],
    ["加入構造與細節", "逐步加入葉脈、葉緣、觸角、節、斑紋、毛、鱗片或紋理。", "每畫一種細節就回到實物核對一次。", "憑記憶補上看起來應該有的花紋。"],
    ["檢查比例與對稱", "比較各部分長度、寬度、位置與數量，也檢查左右關係。", "用尺、中軸線、格線或負空間協助比較。", "只修一邊，造成同一物體比例互相矛盾。"],
    ["加入科學標示", "加入圖名、日期、地點、角度、構造名稱、比例尺與必要補充。", "標示線用直線、末端對準構造，文字整齊排列。", "標示線互相交叉，或比例尺沒有單位。"],
    ["比較、修正與完成", "再對照真實物體，修正錯誤或遺漏，並保存修改紀錄。", "說出我根據哪個證據改了哪裡。", "為了整齊把真實破損或不對稱擅自修美。"]
  ];
  let stepIndex = 0;
  let stepTimer = null;
  const stepPlay = document.querySelector("#step-play");

  function showStep(index) {
    stepIndex = (index + steps.length) % steps.length;
    const data = steps[stepIndex];
    document.querySelector("#step-counter").textContent = String(stepIndex + 1).padStart(2, "0") + " / 08";
    document.querySelector("#step-title").textContent = data[0];
    document.querySelector("#step-description").textContent = data[1];
    document.querySelector("#step-tip").textContent = data[2];
    document.querySelector("#step-mistake").textContent = data[3];
    document.querySelector("#step-caption").textContent = "步驟" + "一二三四五六七八"[stepIndex] + "：" + data[0];
    const crop = document.querySelector("#step-image-crop");
    crop.style.setProperty("--step-x", (stepIndex % 4) * 25 + "%");
    crop.style.setProperty("--step-y", (stepIndex >= 4 ? 50 : 0) + "%");
    document.querySelectorAll(".step-list li").forEach((item, itemIndex) => item.classList.toggle("is-current", itemIndex === stepIndex));
  }

  function stopSteps() {
    clearInterval(stepTimer);
    stepTimer = null;
    stepPlay.textContent = "播放";
    stepPlay.setAttribute("aria-pressed", "false");
  }

  function toggleSteps() {
    if (stepTimer) return stopSteps();
    stepPlay.textContent = "暫停";
    stepPlay.setAttribute("aria-pressed", "true");
    stepTimer = setInterval(() => showStep(stepIndex + 1), Number(document.querySelector("#step-speed").value));
  }
  document.querySelector("#step-prev").addEventListener("click", () => { stopSteps(); showStep(stepIndex - 1); });
  document.querySelector("#step-next").addEventListener("click", () => { stopSteps(); showStep(stepIndex + 1); });
  stepPlay.addEventListener("click", toggleSteps);
  document.querySelector("#step-reset").addEventListener("click", () => { stopSteps(); showStep(0); });
  document.querySelector("#step-speed").addEventListener("change", () => { if (stepTimer) { stopSteps(); toggleSteps(); } });
  showStep(0);

  const practiceTabs = Array.from(document.querySelectorAll("[data-practice-tab]"));
  const practicePanels = Array.from(document.querySelectorAll("[data-practice-panel]"));
  function activatePractice(name) {
    practiceTabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.practiceTab === name)));
    practicePanels.forEach((panel) => {
      panel.hidden = panel.dataset.practicePanel !== name;
      panel.classList.toggle("is-active", panel.dataset.practicePanel === name);
    });
  }
  practiceTabs.forEach((tab) => tab.addEventListener("click", () => activatePractice(tab.dataset.practiceTab)));

  const leafOrder = ["葉尖", "葉基", "葉緣", "主脈", "側脈", "葉柄"];
  let leafIndex = 0;
  document.querySelectorAll("[data-leaf-part]").forEach((button) => button.addEventListener("click", () => {
    const output = document.querySelector("#leaf-feedback");
    if (button.dataset.leafPart !== leafOrder[leafIndex]) {
      output.className = "feedback is-warning";
      output.textContent = "這裡是" + button.dataset.leafPart + "。目前要找的是" + leafOrder[leafIndex] + "。";
      return;
    }
    button.classList.add("is-found");
    button.disabled = true;
    const item = document.createElement("li");
    item.textContent = leafOrder[leafIndex];
    document.querySelector("#leaf-found").append(item);
    leafIndex += 1;
    if (leafIndex === leafOrder.length) {
      output.className = "feedback is-success";
      output.textContent = "六個構造都找到了！你已經能用位置證據描述一片葉子。";
      document.querySelector("#leaf-target").textContent = "完成";
    } else {
      output.className = "feedback is-success";
      output.textContent = "找到！下一個：" + leafOrder[leafIndex] + "。";
      document.querySelector("#leaf-target").textContent = leafOrder[leafIndex];
    }
  }));

  function resetLeaf() {
    leafIndex = 0;
    document.querySelector("#leaf-target").textContent = leafOrder[0];
    document.querySelector("#leaf-feedback").className = "feedback";
    document.querySelector("#leaf-feedback").textContent = "葉尖是葉片最前端的位置。";
    document.querySelector("#leaf-found").replaceChildren();
    document.querySelectorAll("[data-leaf-part]").forEach((button) => {
      button.disabled = false;
      button.classList.remove("is-found");
    });
  }

  const beetleForm = document.querySelector("#beetle-observation");
  beetleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(beetleForm);
    const answers = [form.get("body"), form.get("legs"), form.get("features"), form.get("symmetry")];
    const key = ["3", "6", "pair", "yes"];
    const count = answers.filter((answer, index) => answer === key[index]).length;
    const output = document.querySelector("#beetle-feedback");
    output.className = "feedback " + (count === 4 ? "is-success" : "is-warning");
    output.textContent = count === 4
      ? "四項都正確：昆蟲分頭、胸、腹，六足連在胸部，有一對觸角；鍬形蟲背面翅鞘大致左右對稱。"
      : "答對 " + count + " / 4。把目光移到胸部，逐隻數腳，再沿中軸比較左右翅鞘。";
  });
  beetleForm.addEventListener("reset", () => setTimeout(() => {
    document.querySelector("#beetle-feedback").className = "feedback";
    document.querySelector("#beetle-feedback").textContent = "請完成四項觀察。";
  }));

  const errorButtons = Array.from(document.querySelectorAll("[data-error]"));
  errorButtons.forEach((button) => button.addEventListener("click", () => button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"))));
  document.querySelector("#check-errors").addEventListener("click", () => {
    const count = errorButtons.filter((button) => button.getAttribute("aria-pressed") === "true").length;
    const output = document.querySelector("#error-feedback");
    output.className = "feedback " + (count === 6 ? "is-success" : "is-warning");
    output.textContent = count === 6
      ? "六項都找到！AI 可以畫出看似細緻、卻違反數量、比例或觀察證據的圖。"
      : "已選 " + count + " / 6。沿中軸比較翅形與斑紋，數足，再檢查標示線和比例尺。";
  });

  function resetButterfly() {
    errorButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    document.querySelector("#error-feedback").className = "feedback";
    document.querySelector("#error-feedback").textContent = "找出你能用觀察證據說明的問題。";
  }

  let selectedLabel = null;
  const labelButtons = Array.from(document.querySelectorAll("[data-label]"));
  const zones = Array.from(document.querySelectorAll(".drop-zone"));
  labelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedLabel = button.dataset.label;
      labelButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
      document.querySelector("#label-feedback").textContent = "已選「" + selectedLabel + "」，請點選它應放的位置。";
    });
    button.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", button.dataset.label));
  });

  function placeLabel(zone, label) {
    const output = document.querySelector("#label-feedback");
    if (!label) {
      output.className = "feedback is-warning";
      output.textContent = "請先選一個標籤。";
      return;
    }
    if (zone.dataset.accept !== label) {
      output.className = "feedback is-warning";
      output.textContent = "「" + label + "」不適合放這裡。想想它描述的是圖像、構造、尺度，還是觀察背景。";
      return;
    }
    zone.classList.add("is-filled");
    zone.replaceChildren();
    const mark = document.createElement("span");
    const text = document.createElement("b");
    mark.textContent = "✓";
    text.textContent = label;
    zone.append(mark, text);
    zone.dataset.filled = "true";
    const source = labelButtons.find((button) => button.dataset.label === label);
    source.disabled = true;
    source.classList.remove("is-selected");
    selectedLabel = null;
    const count = zones.filter((item) => item.dataset.filled === "true").length;
    output.className = "feedback is-success";
    output.textContent = count === zones.length ? "六個標示位置都完成！" : "放置正確，已完成 " + count + " / 6。";
  }
  zones.forEach((zone) => {
    zone.addEventListener("click", () => placeLabel(zone, selectedLabel));
    zone.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        placeLabel(zone, selectedLabel);
      }
    });
    zone.addEventListener("dragover", (event) => event.preventDefault());
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      placeLabel(zone, event.dataTransfer.getData("text/plain"));
    });
  });

  function resetLabels() {
    selectedLabel = null;
    const texts = ["頁面上方中央", "標示線末端", "圖像下方", "紀錄欄第一列", "紀錄欄第二列", "紀錄欄第三列"];
    const marks = ["①", "②", "③", "④", "⑤", "⑥"];
    zones.forEach((zone, index) => {
      zone.classList.remove("is-filled");
      delete zone.dataset.filled;
      zone.replaceChildren();
      const mark = document.createElement("span");
      const text = document.createElement("b");
      mark.textContent = marks[index];
      text.textContent = texts[index];
      zone.append(mark, text);
    });
    labelButtons.forEach((button) => {
      button.disabled = false;
      button.classList.remove("is-selected");
    });
    document.querySelector("#label-feedback").textContent = "選一個標籤，再選它應放的位置。";
  }
  document.querySelectorAll("[data-reset-task]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.resetTask === "leaf") resetLeaf();
    if (button.dataset.resetTask === "butterfly") resetButterfly();
    if (button.dataset.resetTask === "labels") resetLabels();
  }));

  document.querySelectorAll(".myth-card").forEach((card) => card.addEventListener("click", () => card.setAttribute("aria-expanded", String(card.getAttribute("aria-expanded") !== "true"))));

  const galleryItems = Array.from(document.querySelectorAll(".gallery-grid article"));
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-selected", item === button));
    galleryItems.forEach((item) => {
      item.hidden = button.dataset.filter !== "all" && item.dataset.category !== button.dataset.filter;
    });
  }));
  const dialog = document.querySelector("#gallery-dialog");
  let dialogTrigger = null;
  document.querySelectorAll(".gallery-open").forEach((button) => button.addEventListener("click", () => {
    dialogTrigger = button;
    const image = button.querySelector("img");
    document.querySelector("#gallery-dialog-image").src = button.dataset.src;
    document.querySelector("#gallery-dialog-image").alt = image.alt;
    document.querySelector("#gallery-dialog-title").textContent = button.dataset.title;
    dialog.showModal();
  }));
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => { if (dialogTrigger) dialogTrigger.focus(); });

  const resources = [
    ["tw", "國立自然科學博物館", "臺灣", "博物館／典藏", "學生、教師", "繁中", "線上典藏、科普與教育資源", "自然史、生物、地質與人類學的研究與教育資源。", "https://www.nmns.edu.tw/"],
    ["tw", "國立臺灣博物館", "臺灣", "博物館／典藏", "學生、教師", "繁中", "展覽、典藏與學習資源", "涵蓋臺灣自然史與文化史，可從典藏與展覽觀察紀錄方式。", "https://www.ntm.gov.tw/"],
    ["tw", "農業部林業試驗所", "臺灣", "政府研究", "教師、進階學習者", "繁中", "研究出版、植物與森林資料", "森林、植物與林業研究的官方資料來源。", "https://www.tfri.gov.tw/"],
    ["tw", "中央研究院生物多樣性研究中心", "臺灣", "研究機構", "教師、進階學習者", "繁中／英", "研究、資料庫與出版", "臺灣生物多樣性研究與資料服務入口。", "https://biodiv.sinica.edu.tw/"],
    ["tw", "臺灣生命大百科", "臺灣", "物種資料庫", "學生、教師", "繁中", "物種頁、圖片與分類資訊", "查找臺灣物種名稱、分類與特徵的公民科學資料入口。", "https://taieol.tw/"],
    ["tw", "臺灣植物資訊整合查詢系統", "臺灣", "植物資料庫", "教師、進階學習者", "繁中／英", "植物分類、標本與文獻", "查核臺灣植物分類與標本資訊的官方整合系統。", "https://tai2.ntu.edu.tw/"],
    ["tw", "國立臺灣大學植物標本館（TAI）", "臺灣", "大學標本館", "教師、進階學習者", "繁中／英", "標本館資訊與植物典藏", "以大學標本館資料比對植物形態與採集紀錄。", "https://homepage.ntu.edu.tw/~ntutai/"],
    ["tw", "國立臺灣大學昆蟲學系典藏介紹", "臺灣", "大學典藏", "學生、教師", "繁中", "昆蟲標本館藏與研究環境", "認識昆蟲標本典藏、分類研究與教學環境。", "https://entomol.ntu.edu.tw/cp_n_46842.html"],
    ["world", "Guild of Natural Science Illustrators", "美國／國際", "專業學會", "教師、進階學習者", "英文", "作品、教育與職涯資源", "自然科學繪圖專業社群，提供教育、作品與專業資訊。", "https://www.gnsi.org/"],
    ["world", "Biodiversity Heritage Library", "國際", "數位圖書館", "學生、教師", "英文／多語", "歷史書籍、圖版與開放典藏", "查閱全球生物多樣性文獻與歷史自然史圖版。", "https://www.biodiversitylibrary.org/"],
    ["world", "Smithsonian Libraries and Archives", "美國", "圖書館／檔案", "教師、進階學習者", "英文", "數位館藏、展覽與研究資料", "史密森圖書館與檔案的官方數位資源。", "https://librariesarchives.si.edu/"],
    ["world", "Royal Botanic Gardens, Kew", "英國", "植物園／研究", "學生、教師", "英文", "植物科學、典藏與教學", "植物研究、館藏與全球植物資料的權威入口。", "https://www.kew.org/"],
    ["world", "American Society of Botanical Artists", "美國／國際", "專業學會", "教師、繪圖學習者", "英文", "作品、展覽與教育", "推廣植物藝術與科學觀察的非營利專業組織。", "https://www.asba-art.org/"],
    ["world", "Society of Botanical Artists", "英國／國際", "專業學會", "繪圖學習者", "英文", "展覽、課程與作品", "提供植物藝術展覽、會員作品與教育資訊。", "https://www.soc-botanical-artists.org/"],
    ["world", "Natural History Museum, London", "英國", "自然史博物館", "學生、教師", "英文", "數位典藏、研究與學習", "自然史典藏、研究與學校學習資源。", "https://www.nhm.ac.uk/"],
    ["world", "New York Botanical Garden", "美國", "植物園／教育", "學生、教師", "英文", "植物研究、館藏與課程", "植物科學研究、數位資源與植物藝術教育。", "https://www.nybg.org/"],
    ["world", "Smithsonian National Museum of Natural History", "美國", "自然史博物館", "學生、教師", "英文", "典藏、研究與教學資料", "涵蓋生物、化石、礦物與人類學的官方資源。", "https://naturalhistory.si.edu/"],
    ["world", "Australian Museum", "澳洲", "自然史博物館", "學生、教師", "英文", "物種資料、典藏與學習", "澳洲自然史與文化典藏的研究及教育入口。", "https://australian.museum/"],
    ["world", "Cornell Lab of Ornithology", "美國", "大學研究／鳥類", "學生、教師", "英文", "鳥類資料、課程與公民科學", "從鳥類外形、羽色、喙形與行為資料練習觀察。", "https://www.birds.cornell.edu/home/"]
  ];

  const resourceGrid = document.querySelector("#resource-grid");
  function renderResources(filter) {
    const cards = resources.filter((item) => filter === "all" || item[0] === filter).map((item) => {
      const card = document.createElement("article");
      card.className = "resource-card";
      const tags = document.createElement("div");
      tags.className = "tags";
      [item[2], item[3], item[5]].forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        tags.append(span);
      });
      const title = document.createElement("h2");
      title.textContent = item[1];
      const details = document.createElement("p");
      const audience = document.createElement("b");
      audience.textContent = "適合：";
      details.append(audience, item[4], document.createElement("br"));
      const offers = document.createElement("b");
      offers.textContent = "提供：";
      details.append(offers, item[6]);
      const description = document.createElement("p");
      description.textContent = item[7];
      const link = document.createElement("a");
      link.href = item[8];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "前往官方網站 ↗";
      link.setAttribute("aria-label", "前往 " + item[1] + " 官方網站（開新分頁）");
      card.append(tags, title, details, description, link);
      return card;
    });
    resourceGrid.replaceChildren.apply(resourceGrid, cards);
  }
  renderResources("all");
  document.querySelectorAll("[data-resource-region]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-resource-region]").forEach((item) => item.classList.toggle("is-selected", item === button));
    renderResources(button.dataset.resourceRegion);
  }));

  const initial = names.includes(location.hash.slice(1)) ? location.hash.slice(1) : state.current;
  selectPanel(initial, { updateHash: false, focus: false });
})();
