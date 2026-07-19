# 科學繪圖探究室

Scientific Illustration Lab 是一套繁體中文、免登入、可離線使用的單頁互動教材。它帶領國小中高年級與國中學生從觀察開始，練習忠實記錄比例、構造、紋理、比例尺與科學標示。

線上教材：[https://prayer168.github.io/Scientific-illustration/](https://prayer168.github.io/Scientific-illustration/)

原始碼：[https://github.com/prayer168/Scientific-illustration](https://github.com/prayer168/Scientific-illustration)

## 教材內容

- 12 個循序單元：概念、比較、工具、八步驟、技法、觀察任務、規範、作品欣賞、資源、測驗與學習紀錄。
- 4 個動手任務、10 題混合題型挑戰、即時回饋與能力分析。
- 18 張原創 AI 教學圖像，附替代文字與圖片載入失敗提示。
- 自動儲存進度與觀察紀錄，可列印、下載空白學習單或匯出 Markdown。
- 支援手機、平板、桌機、深色模式、鍵盤操作、減少動態與列印版面。

## 使用方式

直接開啟 `index.html` 即可；所有功能均使用相對路徑且不依賴後端。若要以本機伺服器預覽：

```bash
python -m http.server 8000
```

再開啟 `http://localhost:8000/`。執行靜態檢查：

```bash
node scripts/validate.mjs
```

## 教師使用建議

- 一節課：首頁導入 → 科學繪圖比較 → 一項觀察任務 → 學習挑戰。
- 兩節課：第一節完成概念與技法，第二節帶實物觀察、紀錄與同儕檢核。
- 完整教學流程、提問句與評量方式見 [`docs/lesson-plan.md`](docs/lesson-plan.md)。
- 資料來源與查證紀錄見 [`docs/references.md`](docs/references.md)。

## 專案結構

```text
index.html          12 單元與語意化頁面結構
css/style.css       響應式、深色模式、列印與無障礙樣式
js/                 教材互動、測驗、紀錄與 LocalStorage
images/             原創教學圖像
data/               題庫與資源清單的可讀資料
downloads/          可列印空白學習單
docs/               設計、教案、查證與測試文件
```

## 授權與素材

程式碼與原創教材文字採 MIT License。AI 生成圖像用於本教材示意；涉及物種辨識時，仍應以實物、標本與可信資料庫交叉查證。外部資源各依原網站授權與使用條款。
