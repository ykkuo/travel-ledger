# Travel Ledger 旅費帳本

多人旅遊分帳與費用追蹤 Web App，使用 Firebase 實現多裝置即時同步，離線亦可使用。適合旅行中快速記錄花費、事後自動結算分攤金額。

線上使用：https://un-buen-viaje.web.app

## 功能特色

- **多人協作**：用 6 位邀請碼建立或加入旅行，成員可即時看到同一分帳資料
- **身份綁定**：加入旅行時選擇自己的名字，身份會綁定到你的登入帳號（`claimedUid`），下次打開會自動恢復，避免不小心被記成別人
- **多幣種記錄**：
  - 現金支出：選擇幣別 + 輸入外幣金額，依「匯率」頁設定的即時匯率自動換算台幣，之後更新匯率會連動更新所有相關支出
  - 信用卡支出：直接輸入信用卡帳單上的台幣金額，不受匯率頁影響
- **匯率管理**：取代舊版的「換匯批次」，改為每種幣別維護一個可編輯的台幣匯率
- **分攤計算**：每筆支出可指定受益人與金額（外幣支出直接用原幣別輸入分攤金額；均分或自訂皆可）
- **雙結算模式**：
  - 折合台幣結算：所有支出換算成台幣後統一結算一次
  - 依幣別分開結算：每種幣別各自算淨額與轉帳建議，適合人還在當地、想直接用現金找補
- **最少轉帳建議**：自動用債務簡化演算法算出最少轉帳筆數，一鍵複製結算文字摘要
- **離線支援**：Firestore 本地持久化，網路不穩定仍可記帳，恢復連線後自動同步
- **旅程管理**：Google 帳號登入者可建立旅程（確保刪除權限）、自訂旅程圖示與名稱；加入既有旅程不需登入

## 技術架構

- 前端：單一 `index.html`（HTML + CSS + Vanilla JavaScript），無需建置工具，直接部署到任何靜態主機
- 後端：Firebase Authentication（匿名 / Google 登入）+ Cloud Firestore（即時資料庫，支援離線持久化）
- 部署：Firebase Hosting，透過 GitHub Actions 在 push 到 `main` 時自動部署

## 快速開始

1. 到 [Firebase Console](https://console.firebase.google.com/) 建立新專案，啟用 **Authentication**（匿名登入 + Google 登入）與 **Firestore Database**
2. 將專案的 Firebase 設定值（apiKey、authDomain、projectId 等）填入 `index.html` 中的 `firebaseConfig` 區塊
3. 設定 Firestore 安全規則，限定只有登入使用者可讀寫自己參與的旅行資料
4. 部署到 Firebase Hosting（或其他靜態網頁服務；注意 Google 登入需要瀏覽器能存取的網址，`file://` 直接開啟無法使用）
5. 建立新旅程，取得 6 位邀請碼，分享給同行旅伴加入

## 資料結構

- `trips/{tripId}`：旅程基本資訊（名稱、圖示、建立者 uid、次分類清單、幣別清單、各幣別匯率 `currencyRates`）
- `trips/{tripId}/members`：旅程成員名單（含 `claimedUid` 綁定登入帳號）
- `trips/{tripId}/expenses`：單筆支出（日期、分類、支付方式、幣別、外幣/台幣金額、付款人、受益人列表及分攤金額）

## 版本

目前版本：v2a4（詳見 `index.html` 內頁首版本標籤）
