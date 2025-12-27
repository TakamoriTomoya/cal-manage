# 開発ガイドライン

## 概要

カロリー管理アプリの開発におけるコーディング規約、ディレクトリ構造、開発フローを定義します。

## プロジェクト構成

```
cal-manage/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ
│   ├── globals.css              # グローバルスタイル
│   ├── (routes)/                # ルートグループ
│   │   ├── add/
│   │   │   └── page.tsx
│   │   ├── day/
│   │   │   └── [date]/
│   │   │       └── page.tsx
│   │   └── saved/
│   │       └── page.tsx
│   └── components/              # コンポーネント
│       ├── ui/                  # 共通UIコンポーネント
│       ├── calendar/
│       ├── calorie/
│       ├── category/
│       └── saved/
├── lib/                         # ユーティリティ関数
│   ├── storage.ts               # ローカルストレージ操作
│   ├── date.ts                  # 日付操作
│   ├── calorie.ts              # カロリー計算
│   └── utils.ts                # その他のユーティリティ
├── types/                       # TypeScript型定義
│   ├── index.ts                # 型定義のエクスポート
│   └── ...
├── docs/                        # ドキュメント
│   ├── requirements.md
│   ├── data-structure.md
│   ├── component-design.md
│   ├── local-storage.md
│   └── development-guide.md
├── public/                      # 静的ファイル
└── package.json
```

## コーディング規約

### TypeScript

- 型定義を必ず使用する
- `any` の使用を避ける
- インターフェースは `PascalCase` で命名
- 型定義は `types/` ディレクトリに集約

```typescript
// 良い例
interface CalorieEntry {
  id: string;
  title: string;
  calories: number;
}

// 悪い例
const entry: any = { ... };
```

### React コンポーネント

- 関数コンポーネントを使用
- コンポーネント名は `PascalCase`
- Props の型定義を必ず記述
- デフォルトエクスポートを使用

```typescript
// 良い例
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### ファイル命名規則

- コンポーネント: `PascalCase.tsx`（例: `CalorieEntry.tsx`）
- ユーティリティ: `camelCase.ts`（例: `dateUtils.ts`）
- 型定義: `camelCase.ts`（例: `types.ts`）

### インポート順序

1. React 関連
2. 外部ライブラリ
3. 内部コンポーネント
4. ユーティリティ関数
5. 型定義
6. スタイル

```typescript
// 良い例
import { useState } from 'react';
import { format } from 'date-fns';

import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/date';
import type { CalorieEntry } from '@/types';
```

### コメント

- 複雑なロジックにはコメントを追加
- JSDoc コメントで関数の説明を記述

```typescript
/**
 * 指定日のカロリー合計を計算します
 * @param entries カロリーエントリの配列
 * @param date 日付（YYYY-MM-DD形式）
 * @returns 合計カロリー（kcal）
 */
export function calculateDailyTotal(
  entries: CalorieEntry[],
  date: string
): number {
  // ...
}
```

## スタイリング

### Tailwind CSS

- Tailwind CSS のユーティリティクラスを使用
- カスタムクラスは `globals.css` に定義
- レスポンシブデザインを考慮

```typescript
// 良い例
<div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
  <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
    保存
  </button>
</div>
```

### カラーシステム

カテゴリーの色は以下のパレットを使用：

```typescript
const colors = {
  breakfast: '#FFB84D',  // 朝食
  lunch: '#4DA6FF',      // 昼食
  dinner: '#FF6B6B',     // 夕食
  snack: '#95E1D3',      // 間食
  drink: '#A8E6CF',      // 飲み物
};
```

## 状態管理

### ローカル状態

- `useState` でコンポーネント内の状態を管理
- 複雑な状態は `useReducer` を検討

### グローバル状態

- 現時点では不要（ローカルストレージで管理）
- 将来的に Context API や状態管理ライブラリを検討

### データフェッチング

- ローカルストレージからの読み込みは `useEffect` で実行
- サーバーコンポーネントを活用（Next.js App Router）

## エラーハンドリング

### バリデーション

- フォーム入力のバリデーションを実装
- エラーメッセージをユーザーフレンドリーに表示

```typescript
function validateCalorieEntry(data: Partial<CalorieEntry>): string[] {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('タイトルを入力してください');
  }
  
  if (data.calories === undefined || data.calories < 0) {
    errors.push('カロリーは0以上の数値を入力してください');
  }
  
  return errors;
}
```

### エラー表示

- トースト通知またはインラインエラーで表示
- ユーザーに分かりやすいメッセージを提供

## テスト

### テストファイルの配置

```
__tests__/
├── components/
│   └── CalorieEntry.test.tsx
├── lib/
│   └── date.test.ts
└── utils/
    └── validation.test.ts
```

### テストの種類

- ユニットテスト: ユーティリティ関数
- コンポーネントテスト: UIコンポーネント
- 統合テスト: 主要な機能フロー

## パフォーマンス最適化

### 画像最適化

- Base64画像のサイズを制限
- 必要に応じて画像のリサイズ

### レンダリング最適化

- `React.memo` で不要な再レンダリングを防止
- `useMemo` と `useCallback` を適切に使用

```typescript
const MemoizedCard = React.memo(CalorieEntryCard);

const filteredEntries = useMemo(() => {
  return entries.filter(e => e.date === selectedDate);
}, [entries, selectedDate]);
```

## アクセシビリティ

### セマンティックHTML

- 適切なHTML要素を使用（`<button>`, `<nav>`, `<main>` など）
- ARIA属性を必要に応じて追加

### キーボード操作

- すべてのインタラクティブ要素がキーボードで操作可能
- フォーカス管理を適切に実装

### コントラスト比

- WCAG 2.1 AA基準を満たす（4.5:1以上）

## Git ワークフロー

### ブランチ命名

- `feature/` - 新機能
- `fix/` - バグ修正
- `refactor/` - リファクタリング
- `docs/` - ドキュメント

### コミットメッセージ

```
feat: カロリー登録フォームを追加
fix: カレンダーの日付選択バグを修正
refactor: ストレージユーティリティをリファクタリング
docs: 開発ガイドラインを更新
```

## 開発環境

### 必要な環境

- Node.js 18以上
- npm または yarn

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# リント
npm run lint
```

## デプロイ

### Vercel

- `main` ブランチへのプッシュで自動デプロイ
- 環境変数の設定（将来の拡張用）

## 今後の拡張時の考慮事項

### 認証機能追加時

- 認証状態の管理
- 保護されたルートの実装
- ユーザーごとのデータ分離

### データベース移行時

- API ルートの作成
- データマイグレーションスクリプト
- ローカルストレージからの移行機能

### 外部ストレージ移行時

- 画像アップロードAPIの実装
- Base64からURLへの変換処理
- エラーハンドリングとフォールバック

