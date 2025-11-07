# 泰國金流整合說明（Kapook 直播帶貨）

## 1. 支付方式（含市佔率、說明、整合重點）

| 支付方式           | 市佔率    | 說明               | 整合重點             | API 來源（PSP）             |
|--------------------|-----------|--------------------|----------------------|-----------------------------|
| PromptPay(QR)      | 30–35%    | 全國最普及 QR 支付 | 動態 QR、Webhook     | 2C2P / Opn / SiamPay        |
| TrueMoney Wallet   | 15–20%    | 電商常用電子錢包   | API、授權、退款       | 2C2P / Opn                  |
| Rabbit LINE Pay    | 10–12%    | LINE 生態支付      | LINE Pay API         | Opn / 2C2P                  |
| COD（貨到付款）     | 5–8%      | 直播常用付款方式   | 物流同步、對帳        | 不需 PSP                    |
| 信用卡（Card）     | 20–25%    | 傳統主流支付方式   | PCI、3DS、收單        | 2C2P / Opn / AsiaPay        |
| 銀行轉帳（Bank）    | 8–12%     | 高額訂單常見       | 虛擬帳號、自動對帳     | 2C2P / SiamPay              |

---

## 2. 為何 Opn Payments 是最佳選擇（優勢）

### ✅ (1) 支援泰國最主流的支付方式
- PromptPay（動態 QR）
- TrueMoney Wallet
- Rabbit LINE Pay
- 信用卡／借記卡
- 銀行轉帳（含 Slip Upload）

### ✅ (2) API 清楚、整合容易
- REST API 結構強、容易讀
- Webhook 可靠（直播付款必須）
- 不強迫用 SDK（前後端可彈性整合）

### ✅ (3) 支援 Marketplace 分帳（Split Payment）
- Kapook 直播帶貨需分帳：
  - 平台抽成（例：10%）
  - 主播／商家（90%）
- Opn 原生支援，不需自建複雜金流系統

### ✅ (4) 審核速度快
- 通常 3–7 天通過
- 沒有 2C2P 那麼多限制

### ✅ (5) 適合直播帶貨（即時支付）
- PromptPay 動態 QR + 即時 Webhook
- Wallet 支付速度快、成功率高

---

## 3. Opn Payments 費率
| 支付方式                | 費率區間              | 說明                               |
|------------------------|---------------------|------------------------------------|
| PromptPay（QR Code）    | 0.9% – 1.65%        | 最普及的支付方式，支援動態 QR       |
| 信用卡（Visa/Master/JCB）| 2.75% – 3.65%       | 綁定卡片；直播常用；費率依風險調整   |
| TrueMoney Wallet       | 1.8% – 2.65%        | 年輕族群與電商使用者常用            |
| Rabbit LINE Pay        | 1.5% – 2.5%         | LINE 生態支付；用戶量大             |
| 銀行轉帳（Bank Transfer）| 1.5% – 3.0%         | 視銀行與交易類型而定                |
| Google Pay / Apple Pay | 依信用卡費率          | 本質為信用卡交易                    |
| 退款（Refund）           | 0 THB（費率不退還）   | 無退款手續費（但原交易費不退）       |


---

## 4. 技術整合需求
- REST API
- Webhook（付款成功通知）
- HMAC 簽名
- Callback URL
- 測試環境（sandbox）
- 對帳 API

---

## 5. 商務整合需求
- 泰國公司文件
- 泰國銀行帳戶
- 費率協議
- 退款政策
- 結算週期

