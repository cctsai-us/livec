# Live Commerce Flutter Starter (B)
- TikTok 風格直播電商 UI（可接 Cloudflare Stream HLS/MPEG-DASH）
- 已包含：直播間頁面、商品滑動列、聊天彈幕、右側互動按鈕、底部購買條。
- 依賴：video_player + chewie（HLS 播放）、riverpod（狀態）、carousel_slider（商品走馬燈）。

## 快速開始
```bash
flutter pub get
flutter run
```

## 替換 Cloudflare Stream
1. 取得你的 HLS `m3u8` 或 DASH `mpd` 播放 URL（Cloudflare Stream 後台 → Videos → Delivery）。
2. 將 `lib/services/stream_config.dart` 裡的 `kDemoHlsUrl` 改成你的 URL。
