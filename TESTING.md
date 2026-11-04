# v4.0.22 β 検証方法

`python quality_lab/run_suite.py` でWAV波形・JavaScript・Chromium UIテストを実行します。実行結果は `quality_lab/suite-report.json` に記録されます。

`quality_lab/README.md` に音声条件、権利、動作条件、iPhone実機テストの限界を記載しました。

Web Speech APIは通常のブラウザー環境ではWAV直接入力に対応していません。この版ではWAVが実際に英文として認識されたことを検証していません。
