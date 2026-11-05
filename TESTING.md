# v4.0.22 β 検証方法

`python quality_lab/run_suite.py` でWAV波形・JavaScript・Chromium UIテストを実行します。実行結果は `quality_lab/suite-report.json` に記録されます。

`quality_lab/README.md` に音声条件、権利、動作条件、iPhone実機テストの限界を記載しました。

Web Speech APIは通常のブラウザー環境ではWAV直接入力に対応していません。この版ではWAVが実際に英文として認識されたことを検証していません。

v4.0.23 マイク使用中の最上段表示
- 音声認識開始で赤太字「マイクON中です。」が最上段へ表示されることを確認。
- 正常認識、通信エラー、手動停止で表示が消えることを確認。
- 正常認識で Safari の onend を待たずに認識セッションを明示的に abort する。
- Chromium の模擬音声認識23ケースおよび node verify.js の回帰テストを実施。
- iOSの物理マイク状態はWeb Speech APIから読めないため、実機のマイク使用ランプと一致することは未保証。
