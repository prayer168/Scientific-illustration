(() => {
  "use strict";

  const QUIZ_KEY = "scientificIllustration.quiz.v1";
  const questions = [
    {
      id: 1, type: "single", label: "單選題", concept: "科學繪圖目的", ability: "理解科學繪圖",
      question: "小安畫校園甲蟲，哪個做法最符合科學繪圖的目的？",
      options: ["把甲蟲畫得最可愛", "忠實記錄可辨認構造並加入必要標示", "加入想像花紋讓畫面更熱鬧", "只追求和照片一模一樣"],
      answer: [1],
      explanation: "科學繪圖是有證據的圖像紀錄。它可以簡化背景或強調構造，不必追求像照片，但不能杜撰特徵。"
    },
    {
      id: 2, type: "single", label: "情境應用題", concept: "觀察順序", ability: "規劃觀察流程",
      question: "老師給你一片陌生葉子。拿起鉛筆後，最應該先做什麼？",
      options: ["立刻描出所有細葉脈", "先從不同方向觀察整體外形與特徵", "先用深色畫出外框", "先查網路圖片再照著畫"],
      answer: [1],
      explanation: "先觀察再下筆，能避免被第一印象帶走。先看整體、角度與比例，再畫淡的基本外形。"
    },
    {
      id: 3, type: "multiple", label: "多選題", concept: "繪圖工具", ability: "選擇合適工具",
      question: "要在校園記錄葉片外形、大小與葉緣，哪些是合適的基本工具？（可複選）",
      options: ["鉛筆", "直尺", "放大鏡", "觀察紀錄本", "亮粉膠"],
      answer: [0, 1, 2, 3],
      explanation: "鉛筆、尺、放大鏡與紀錄本能協助畫線、量測、觀察與保存證據；亮粉膠只增加裝飾。"
    },
    {
      id: 4, type: "single", label: "圖像判斷題", concept: "比例與構造", ability: "辨認昆蟲構造",
      question: "觀察鍬形蟲背面圖時，哪項證據最能支持它是昆蟲？",
      image: "images/examples/beetle-dorsal.webp",
      imageAlt: "一隻可清楚數出六足的鍬形蟲背面圖",
      options: ["身體有很多黑色", "有六隻足，而且足連接胸部", "左右翅鞘一樣亮", "大顎很長"],
      answer: [1],
      explanation: "昆蟲的重要共同特徵包括頭、胸、腹三個主要部分，以及六足都連接於胸部。"
    },
    {
      id: 5, type: "order", label: "步驟排序題", concept: "完整步驟", ability: "規劃觀察流程",
      question: "把四個階段排成合理順序。使用上下按鈕調整後送出。",
      options: ["加入構造與細節", "先觀察整體", "加入圖名與比例尺", "畫淡的基本外形"],
      answer: ["先觀察整體", "畫淡的基本外形", "加入構造與細節", "加入圖名與比例尺"],
      explanation: "先觀察，再以淡線建立整體比例；確認基本外形後才加細節，最後完成標示並再次核對。"
    },
    {
      id: 6, type: "match", label: "配對題", concept: "觀察方法", ability: "運用繪圖方法",
      question: "把方法配對到最適合的任務。",
      prompts: ["中軸線與對稱法", "局部放大法", "格線比例法"],
      choices: ["確認左右翅膀關係", "畫清楚花蕊細節", "校正各部分位置"],
      answer: [0, 1, 2],
      explanation: "中軸線協助比較左右；局部放大呈現小構造；格線用來確認位置與比例。"
    },
    {
      id: 7, type: "multiple", label: "找錯題", concept: "圖像標示", ability: "診斷與修正錯誤",
      question: "哪些情況需要修改？（可複選）",
      options: ["標示線互相交叉", "比例尺沒有單位", "圖畫得夠大且清楚", "擅自補上沒有觀察到的斑紋", "日期與地點記錄完整"],
      answer: [0, 1, 3],
      explanation: "交叉標示線、缺少比例尺單位與杜撰斑紋都會降低可讀性或科學可信度。"
    },
    {
      id: 8, type: "single", label: "情境應用題", concept: "比例尺", ability: "使用科學標示",
      question: "一枚真實種子長 12 mm，但你把它放大畫成 6 cm。最好的做法是？",
      options: ["不必說明，圖越大越好", "在圖旁加入代表已知實際長度的比例尺與單位", "把圖縮回 12 mm 才算正確", "寫上『很小』就可以"],
      answer: [1],
      explanation: "科學圖可以放大；比例尺讓讀者知道圖像與實物的尺度關係。比例尺必須有明確單位。"
    },
    {
      id: 9, type: "multiple", label: "AI 素養題", concept: "AI 圖像查證", ability: "查證 AI 內容",
      question: "AI 生成一張蝴蝶圖後，哪些查證行動合適？（可複選）",
      options: ["數足與觸角", "比較左右翅脈與斑紋", "對照博物館、大學或政府資料庫", "圖片很漂亮就直接相信", "記錄查證來源與修改"],
      answer: [0, 1, 2, 4],
      explanation: "外觀精美不代表構造正確。要核對數量、位置、比例與可信來源，並留下查證及修改紀錄。"
    },
    {
      id: 10, type: "single", label: "科學誠信題", concept: "修改與反思", ability: "實踐科學誠信",
      question: "葉片一側真的被昆蟲咬缺了一角。完成科學觀察圖時，你應該怎麼做？",
      options: ["補成完美對稱，畫面才漂亮", "忠實畫出缺口，必要時註明是觀察到的損傷", "直接換成網路上的完整葉片", "把缺口改成裝飾花紋"],
      answer: [1],
      explanation: "破損本身可能是觀察證據。忠實保留並註明，能讓讀者分辨正常構造與個體狀態。"
    }
  ];

  const startButton = document.querySelector("#start-quiz");
  const intro = document.querySelector(".quiz-intro");
  const stage = document.querySelector("#quiz-stage");
  const results = document.querySelector("#quiz-results");
  let current = 0;
  let score = 0;
  let answered = false;
  let correctAbilities = [];
  let reviewConcepts = [];
  let orderState = [];

  function startQuiz() {
    current = 0;
    score = 0;
    answered = false;
    correctAbilities = [];
    reviewConcepts = [];
    intro.hidden = true;
    results.hidden = true;
    stage.hidden = false;
    renderQuestion();
  }

  function makeButton(text, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className || "";
    button.textContent = text;
    return button;
  }

  function renderQuestion() {
    answered = false;
    const item = questions[current];
    stage.replaceChildren();
    const article = document.createElement("article");
    article.className = "quiz-question";
    const meta = document.createElement("div");
    meta.className = "quiz-meta";
    const count = document.createElement("span");
    count.textContent = "第 " + (current + 1) + " / " + questions.length + " 題";
    const type = document.createElement("span");
    type.textContent = item.label;
    meta.append(count, type);
    const title = document.createElement("h2");
    title.textContent = item.question;
    article.append(meta, title);

    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.imageAlt;
      image.loading = "lazy";
      image.className = "quiz-image";
      article.append(image);
    }

    if (item.type === "single" || item.type === "multiple") article.append(renderOptions(item));
    if (item.type === "order") article.append(renderOrder(item));
    if (item.type === "match") article.append(renderMatch(item));

    const submit = makeButton("送出答案", "primary-button compact");
    submit.id = "quiz-submit";
    submit.addEventListener("click", checkAnswer);
    article.append(submit);
    stage.append(article);
  }

  function renderOptions(item) {
    const container = document.createElement("div");
    container.className = "quiz-options";
    item.options.forEach((option, index) => {
      const label = document.createElement("label");
      label.className = "quiz-option";
      const input = document.createElement("input");
      input.type = item.type === "single" ? "radio" : "checkbox";
      input.name = "quiz-answer";
      input.value = String(index);
      const text = document.createElement("span");
      text.textContent = option;
      label.append(input, text);
      container.append(label);
    });
    return container;
  }

  function renderOrder(item) {
    orderState = item.options.slice();
    const list = document.createElement("ol");
    list.className = "order-list";
    function draw() {
      list.replaceChildren();
      orderState.forEach((text, index) => {
        const row = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = text;
        const controls = document.createElement("span");
        controls.className = "order-controls";
        const up = makeButton("↑", "");
        const down = makeButton("↓", "");
        up.setAttribute("aria-label", "將「" + text + "」向上移");
        down.setAttribute("aria-label", "將「" + text + "」向下移");
        up.disabled = index === 0;
        down.disabled = index === orderState.length - 1;
        up.addEventListener("click", () => {
          [orderState[index - 1], orderState[index]] = [orderState[index], orderState[index - 1]];
          draw();
        });
        down.addEventListener("click", () => {
          [orderState[index + 1], orderState[index]] = [orderState[index], orderState[index + 1]];
          draw();
        });
        controls.append(up, down);
        row.append(label, controls);
        list.append(row);
      });
    }
    draw();
    return list;
  }

  function renderMatch(item) {
    const container = document.createElement("div");
    container.className = "match-list";
    item.prompts.forEach((prompt, index) => {
      const label = document.createElement("label");
      label.textContent = prompt;
      const select = document.createElement("select");
      select.dataset.matchIndex = String(index);
      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "請選擇任務";
      select.append(empty);
      item.choices.forEach((choice, choiceIndex) => {
        const option = document.createElement("option");
        option.value = String(choiceIndex);
        option.textContent = choice;
        select.append(option);
      });
      label.append(select);
      container.append(label);
    });
    return container;
  }

  function arraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }

  function selectedAnswer(item) {
    if (item.type === "single" || item.type === "multiple") {
      return Array.from(stage.querySelectorAll("input:checked")).map((input) => Number(input.value)).sort((a, b) => a - b);
    }
    if (item.type === "order") return orderState.slice();
    if (item.type === "match") return Array.from(stage.querySelectorAll("select")).map((select) => Number(select.value));
    return [];
  }

  function checkAnswer() {
    if (answered) return;
    const item = questions[current];
    const answer = selectedAnswer(item);
    const complete = item.type === "match" ? !answer.some((value) => Number.isNaN(value)) : answer.length > 0;
    if (!complete) {
      let warning = stage.querySelector(".quiz-warning");
      if (!warning) {
        warning = document.createElement("p");
        warning.className = "feedback is-warning quiz-warning";
        stage.querySelector(".quiz-question").append(warning);
      }
      warning.textContent = "請先完成這一題，再送出答案。";
      return;
    }
    answered = true;
    const correct = arraysEqual(answer, item.answer);
    if (correct) {
      score += 1;
      correctAbilities.push(item.ability);
    } else {
      reviewConcepts.push(item.concept);
    }
    stage.querySelectorAll("input, select, .order-controls button").forEach((control) => { control.disabled = true; });
    document.querySelector("#quiz-submit").remove();
    const explanation = document.createElement("div");
    explanation.className = "quiz-explanation" + (correct ? "" : " is-wrong");
    const heading = document.createElement("h3");
    heading.textContent = correct ? "答對了！" : "需要再想想";
    const detail = document.createElement("p");
    detail.textContent = item.explanation;
    const concept = document.createElement("p");
    const strong = document.createElement("b");
    strong.textContent = "對應概念：";
    concept.append(strong, item.concept);
    explanation.append(heading, detail, concept);
    const nextButton = makeButton(current === questions.length - 1 ? "查看結果" : "下一題 →", "primary-button compact");
    nextButton.addEventListener("click", () => {
      if (current === questions.length - 1) showResults();
      else {
        current += 1;
        renderQuestion();
      }
    });
    stage.querySelector(".quiz-question").append(explanation, nextButton);
  }

  function showResults() {
    stage.hidden = true;
    results.hidden = false;
    results.replaceChildren();
    const card = document.createElement("article");
    card.className = "quiz-results-card";
    const label = document.createElement("p");
    label.className = "section-number";
    label.textContent = "挑戰完成";
    const number = document.createElement("p");
    number.className = "result-number";
    number.textContent = score + " / " + questions.length;
    const accuracy = document.createElement("h2");
    accuracy.textContent = "正確率 " + Math.round(score / questions.length * 100) + "%";
    const mastered = document.createElement("h3");
    mastered.textContent = "已掌握的能力";
    const masteredList = document.createElement("ul");
    masteredList.className = "ability-list";
    const uniqueAbilities = Array.from(new Set(correctAbilities));
    (uniqueAbilities.length ? uniqueAbilities : ["勇於完成挑戰"]).forEach((text) => {
      const item = document.createElement("li");
      item.textContent = "✓ " + text;
      masteredList.append(item);
    });
    const review = document.createElement("h3");
    review.textContent = "建議複習";
    const reviewList = document.createElement("ul");
    reviewList.className = "review-list";
    const uniqueReviews = Array.from(new Set(reviewConcepts));
    (uniqueReviews.length ? uniqueReviews : ["所有概念都掌握，可進行觀察紀錄"]).forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      reviewList.append(item);
    });
    const retry = makeButton("重新挑戰", "primary-button");
    retry.addEventListener("click", startQuiz);
    card.append(label, number, accuracy, mastered, masteredList, review, reviewList, retry);
    results.append(card);
    localStorage.setItem(QUIZ_KEY, JSON.stringify({
      score: score,
      total: questions.length,
      accuracy: Math.round(score / questions.length * 100),
      completedAt: new Date().toISOString()
    }));
  }

  startButton.addEventListener("click", startQuiz);
})();
