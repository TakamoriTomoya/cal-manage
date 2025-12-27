# カロリー管理アプリ

日々のカロリーを管理するためのWebアプリケーションです。

## 機能

- 📸 **写真付きカロリー登録**: 写真、タイトル、カロリーを入力して記録
- 📅 **カレンダー表示**: 月単位でカロリーを確認
- 📊 **日別・月別集計**: その日の摂取カロリーを自動計算
- 🔄 **登録済みカロリーの再利用**: よく食べるものを登録して簡単に追加
- 🏷️ **カテゴリー管理**: 朝食、昼食、夕食などで分類

## 技術スタック

- **Next.js 16.1.1** (App Router)
- **React 19.2.3**
- **TypeScript**
- **Tailwind CSS 4**
- **ローカルストレージ** (データ保存)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
cal-manage/
├── app/                    # Next.js App Router
│   ├── components/         # Reactコンポーネント
│   ├── add/               # カロリー追加ページ
│   ├── day/[date]/        # 日別詳細ページ
│   └── saved/             # 登録済みカロリー一覧
├── lib/                   # ユーティリティ関数
├── types/                 # TypeScript型定義
└── docs/                  # ドキュメント
```

## ドキュメント

詳細なドキュメントは `docs/` ディレクトリを参照してください。

- [要件定義書](./docs/requirements.md)
- [データ構造定義書](./docs/data-structure.md)
- [コンポーネント設計書](./docs/component-design.md)
- [Next.js App Router ベストプラクティス](./docs/nextjs-app-router-best-practices.md)

## ライセンス

MIT
