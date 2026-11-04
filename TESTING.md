# v4.0.21 β テスト手順

- `node verify.js` : モック画面、採点への戻り先、認識後の遷移、手動中断・無音・エラー、人物設定、100チャンク×4シーンの和訳形式など（56件）。
- `python browser_tests.py` : Playwright + Chromium による実画面のクリックとDOM検証、音声認識APIの模擬（20件）。
- iOS Safari、ホーム画面PWA、Androidは実機で音声/マイク権限を確認する必要があります。

詳細な実施結果と公開前の残課題は QUALITY_REPORT.md を参照してください。
