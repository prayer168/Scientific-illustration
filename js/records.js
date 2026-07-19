(() => {
  "use strict";

  const KEY = "scientificIllustration.record.v1";
  const form = document.querySelector("#observation-record");
  const fields = Array.from(form.elements).filter((element) => element.name);
  const progressFill = document.querySelector("#record-progress-fill");
  const progressLabel = document.querySelector("#record-progress-label");
  const progressBar = progressFill.parentElement;
  const feedback = document.querySelector("#record-feedback");
  let timer = null;

  function formDataObject() {
    const data = {};
    fields.forEach((field) => {
      data[field.name] = field.type === "checkbox" ? field.checked : field.value;
    });
    data.savedAt = new Date().toISOString();
    return data;
  }

  function save(silent) {
    const data = formDataObject();
    localStorage.setItem(KEY, JSON.stringify(data));
    updateProgress();
    if (!silent) {
      feedback.className = "feedback is-success";
      feedback.textContent = "已儲存在這台裝置的瀏覽器中。";
    } else {
      feedback.className = "feedback";
      feedback.textContent = "已自動儲存 " + new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" });
    }
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}");
      fields.forEach((field) => {
        if (!(field.name in data)) return;
        if (field.type === "checkbox") field.checked = Boolean(data[field.name]);
        else field.value = data[field.name];
      });
      if (!form.elements.date.value) form.elements.date.value = new Date().toISOString().slice(0, 10);
      if (data.savedAt) {
        feedback.textContent = "已載入上次紀錄，儲存時間：" + new Date(data.savedAt).toLocaleString("zh-TW");
      }
    } catch {
      feedback.className = "feedback is-warning";
      feedback.textContent = "舊紀錄格式無法讀取，請重新填寫。";
    }
    updateProgress();
  }

  function updateProgress() {
    const complete = fields.filter((field) => field.type === "checkbox" ? field.checked : field.value.trim() !== "").length;
    const percent = Math.round(complete / fields.length * 100);
    progressFill.style.width = percent + "%";
    progressLabel.textContent = percent + "%";
    progressBar.setAttribute("aria-valuenow", String(percent));
  }

  function scheduleSave() {
    clearTimeout(timer);
    timer = setTimeout(() => save(true), 350);
    updateProgress();
  }

  form.addEventListener("input", scheduleSave);
  form.addEventListener("change", scheduleSave);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    save(false);
  });

  function markdown() {
    const data = formDataObject();
    const checkLabels = Array.from(form.querySelectorAll(".self-check label")).map((label) => {
      const input = label.querySelector("input");
      return "- [" + (input.checked ? "x" : " ") + "] " + label.textContent.trim();
    }).join("\n");
    return [
      "# " + (data.title || "我的科學繪圖紀錄"),
      "",
      "- 觀察日期：" + (data.date || "未填"),
      "- 觀察地點：" + (data.location || "未填"),
      "- 觀察對象：" + (data.subject || "未填"),
      "- 使用工具：" + (data.tools || "未填"),
      "- 物體實際大小：" + (data.size || "未填"),
      "",
      "## 主要外形",
      "",
      data.shape || "未填",
      "",
      "## 特殊構造",
      "",
      data.structures || "未填",
      "",
      "## 顏色與紋理",
      "",
      data.texture || "未填",
      "",
      "## 我的發現",
      "",
      data.findings || "未填",
      "",
      "## 尚未確定的地方",
      "",
      data.uncertain || "未填",
      "",
      "## 資料查證來源",
      "",
      data.sources || "未填",
      "",
      "## 修改紀錄",
      "",
      data.revisions || "未填",
      "",
      "## 自我評量",
      "",
      data.selfRating || "未填",
      "",
      "## 完成檢核",
      "",
      checkLabels,
      "",
      "> 由「科學繪圖探究室」匯出。AI 生成或協助內容仍應配合可信資料查證。",
      ""
    ].join("\n");
  }

  document.querySelector("#export-record").addEventListener("click", () => {
    save(true);
    const blob = new Blob(["\ufeff" + markdown()], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    const title = (form.elements.title.value || "scientific-illustration-record").replace(/[\\/:*?"<>|]/g, "-");
    link.href = URL.createObjectURL(blob);
    link.download = title + ".md";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    feedback.className = "feedback is-success";
    feedback.textContent = "已匯出 Markdown 文字檔。";
  });

  document.querySelector("#print-record").addEventListener("click", () => {
    save(true);
    print();
  });

  document.querySelector("#clear-record").addEventListener("click", () => {
    if (!confirm("確定清除這台裝置中儲存的觀察紀錄嗎？此動作無法復原。")) return;
    localStorage.removeItem(KEY);
    form.reset();
    form.elements.date.value = new Date().toISOString().slice(0, 10);
    updateProgress();
    feedback.className = "feedback is-success";
    feedback.textContent = "紀錄已清除，可重新開始。";
  });

  load();
})();
