# Travel Ledger 旅遊記帳本

多人旅遊分帳與費用追蹤 Web App，使用 Firebase 實現多裝置即時同步，離線亦可使用。適合旅行中快速記錄花費、事後自動結算分摊金額。

## 功能特色

- **多人協作**：用 6 位邀請碼建立或加入旅行，成員可即時看到同一分帳資料
- **多幣種記錄**：支援外幣現金支出（掛接兑換批次）與信用卡支出（手動輸入匯率）
- **匯兑批次管理**：記錄每次兑換的台幣/外幣金額，自動推導契率作為現金支出基準
- **分摊計算**：可指定每筆費用的受益人與金額（均分或自定義），自動計算每人應付/應收金額
- **自動結算**：提供最少轉帳筆數的還款建議，一鍵複製結算文字摘要
- **離線支援**：利用 Firestore 本地持久化，網路不穩定仍可記帳，待網路恢復後自動同步
- **Google 登入**：支援匯名模式或 Google 帳戶登入建立旅行

## 技術架構

- 前端：精簡化 HTML + CSS + Vanilla JavaScript（单檔部署，方便放到 GitHub Pages 或任何静態主機）
- 後端：Firebase Authentication（匯名/Google）+ Cloud Firestore（即時資料庫，支援離線持久化）
- 不需建置工具链，不需 Node.js server

## 快速開始

1. 到 [Firebase Console](https://console.firebase.google.com/) 建立新專案，啟用 **Authentication**（匯名登入 + 可選 Google 登入）與 **Firestore Database**
2. 將專案的 Firebase 設定值（apiKey、authDomain、projectId 等）填入 `index.html` 中的 `firebaseConfig` 區塊
3. 設定 Firestore 安全規則，限定只有登入使用者可讀写自己參與的旅行資料
4. 直接用瀏覽器打開 `index.html`，或部署到 GitHub Pages / Firebase Hosting / 任何静態網頁服務
5. 建立新旅行，獲得 6 位字邀請碼，分享給同行旅伴加入

## 資料結構

- `trips/{tripId}`：旅行基本資訊（名稱、建立者、子分類標籤）
- `trips/{tripId}/members`：旅行成員名單
- `trips/{tripId}/batches`：匯兑批次（外幣金額、台幣金額、標籤）
- `trips/{tripId}/expenses`：單筆支出（日期、分類、支付方式、金額、付款人、受益人列表）

## 待完成

- [ ] 上傳完整的 `index.html` 主程式檔
- [ ] 填入实時的 Firebase 設定值
- [ ] 部署至 GitHub Pages 或 Firebase Hosting
