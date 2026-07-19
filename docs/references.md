# 資料來源與查證紀錄

查核日期：2026-07-19。網站「資源地圖」收錄 19 個博物館、研究機構、大學典藏、專業學會與物種資料庫；每張資源卡均標示地區、類型、適用對象、語言與可取得內容，外部連結以新分頁開啟。

## 科學內容查證

- 昆蟲基本構造：Natural History Museum 的教學資源說明昆蟲具有頭、胸、腹三個主要體區、六足與觸角，甲蟲前翅特化為鞘翅。用於甲蟲觀察任務與標示題。[Parts of an insect](https://www.nhm.ac.uk/schools/teaching-resources/key-stage-1/animal-and-human-bodies/parts-of-an-insect.html)
- 月相：NASA 列出新月、眉月、上弦月、盈凸月、滿月、虧凸月、下弦月、殘月八個階段，並說明月光來自太陽反射。用於方法示例與測驗。[Moon Phases](https://science.nasa.gov/moon/moon-phases/)
- 扶桑花：Kew Plants of the World Online 的木槿屬形態描述包含五數花、明顯雄蕊柱、多數花藥與五個花柱分枝。用於正面／側面比較圖查核。[Hibiscus L.](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A328182-2/general-information)
- 臺北樹蛙：臺灣生命大百科記載其為臺灣特有、背面綠色、腹面白色帶黃色、瞳孔黑色橫橢圓形。用於臺灣物種示例。[Zhangixalus taipeianus](https://taieol.tw/pages/225726/articles)
- 蒲公英：臺灣植物資訊整合查詢系統記載蒲公英屬的根生葉、單生頭狀花序、瘦果與冠毛等形態。用於全株與種子形態圖查核。[Taraxacum](https://tai2.ntu.edu.tw/family/Asteraceae/Taraxacum)

## 資源連結檢查

逐一確認 19 個資源的官方網域與頁面用途。原規劃中的臺大植物標本館舊路徑回傳 404，已改為標本館官方首頁；無法解析的舊昆蟲博物館網域則改為臺大昆蟲學系的官方典藏介紹。完整結構化清單位於 `data/resources.json`，每筆保留 `checkedAt` 日期。

部分官方網站會阻擋自動化請求，因此「可連線」查核同時採瀏覽器開啟、官方搜尋結果與 HTTP 回應交叉確認。外部網站內容可能變更，教師正式授課前可再次抽查。

## 圖像製作與限制

18 張 WebP 圖像均由內建 Image 2.0 產生，再依上述官方資料人工檢視構造。兩張花部構造不準確的早期草稿未納入教材；正式版本改用可辨認五瓣、雄蕊柱與柱頭的扶桑花圖。所有正式提示詞、用途、路徑與檢查結果記錄在 `image-prompts.md`。
