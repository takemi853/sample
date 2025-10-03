# 寄り道プランナー

> 移動の"ついで"が、旅のハイライトに。

出発地と目的地の間で、効率的かつ魅力的な寄り道スポットを自動提案するWebアプリケーション（MVP版）

## 特徴

- 🎯 **One Job**: 出発地・目的地・興味タグ・時間上限を入力するだけで、最適な寄り道スポット3件を提案
- 📱 **Material Design準拠**: 余白・影・色・角丸を統一した見やすいUI
- ♿ **アクセシビリティ対応**: ARIA属性、十分なコントラスト、キーボード操作対応
- 🎨 **スムーズなアニメーション**: 200-300msのトランジションで快適な操作感
- 🗺️ **Google Maps連携**: ワンクリックでナビゲーション開始
- 🚀 **外部API不要**: モックデータで即座に動作確認可能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **状態管理**: React useState（MVPのため外部Storeなし）
- **スタイリング**: Tailwind CSS + カスタムCSS（Material Design準拠）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 使い方

1. **出発地・目的地を入力**（例: 東京 → 横浜）
2. **興味タグを選択**（グルメ、絶景、温泉、建築など）
3. **寄り道時間上限を設定**（30〜300分）
4. **「寄り道プランを作る」ボタンをクリック**
5. **結果を確認**（最大3件のスポット＋地図）
6. **「この順で行く」ボタン**でGoogle Mapsへ

## プロジェクト構成

```
.
├── app/
│   ├── api/plan/route.ts    # プラン生成APIエンドポイント
│   ├── page.tsx             # メインページ
│   ├── layout.tsx           # ルートレイアウト
│   └── globals.css          # グローバルスタイル
├── components/
│   ├── PlanForm.tsx         # 入力フォーム
│   ├── PlanResults.tsx      # 結果表示
│   ├── InterestChips.tsx    # 興味タグ選択
│   ├── ResultCard.tsx       # スポットカード
│   └── MapView.tsx          # 地図表示（簡易版）
├── lib/
│   ├── geo.ts               # 地理計算・ルート最適化
│   └── score.ts             # スコアリング・POI選定
├── data/
│   └── pois.ts              # POIダミーデータ（20件）
├── types/
│   └── index.ts             # 型定義
└── docs/
    ├── design/
    │   └── material-guidelines.md  # Material Designガイドライン
    └── management/
        ├── coding-style.md         # コーディング規約
        └── project-rules.md        # プロジェクト管理ルール
```

## アルゴリズム

### スコアリング
```
スコア = タグ一致度 × 2.0 + 評価 × 1.0 - 迂回時間 × 0.05
```

### POI選定
1. 全POIのスコアを計算
2. スコア順にソート
3. 時間予算内で貪欲に選定（最大3件）
4. 訪問順序を最適化（Nearest Neighbor法）

## 対応エリア（モックジオコーディング）

- 東京、横浜、鎌倉、箱根、軽井沢
- 大阪、京都、神戸、奈良、名古屋

## コーディング規約

- **命名**: camelCase（変数・関数）、PascalCase（コンポーネント・クラス）
- **ファイル長**: 200行以内を推奨
- **コメント**: JSDocで関数の目的を明記
- **Material Design準拠**: 8pxグリッド、統一された余白・影・角丸

## 今後の拡張可能性

- 実際のGeocoding API統合（Google Maps API等）
- リアルタイム交通情報の反映
- ユーザー認証・プラン保存機能
- 多言語対応
- 厳密なTSP解法（最適化アルゴリズム強化）

## ライセンス

MIT
