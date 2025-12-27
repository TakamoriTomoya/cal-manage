# データ構造定義書

## 概要

カロリー管理アプリで使用するデータ構造と型定義を定義します。

## 型定義

### CalorieEntry（カロリーエントリ）

1 日のカロリー記録を表すデータ構造です。

```typescript
interface CalorieEntry {
  id: string; // 一意のID（UUID形式を推奨）
  title: string; // タイトル
  calories: number; // カロリー数（kcal）
  photo?: string; // 写真のBase64データ（オプション）
  categoryId?: string; // カテゴリーID（オプション）
  date: string; // 日付（YYYY-MM-DD形式、日本時間）
  createdAt: string; // 作成日時（ISO 8601形式、日本時間）
  updatedAt: string; // 更新日時（ISO 8601形式、日本時間）
  memo?: string; // メモ（オプション）
}
```

### Category（カテゴリー）

カロリーエントリを分類するためのカテゴリーです。

```typescript
interface Category {
  id: string; // 一意のID（UUID形式を推奨）
  name: string; // カテゴリー名
  color?: string; // カテゴリーの色（HEX形式、オプション）
  createdAt: string; // 作成日時（ISO 8601形式、日本時間）
  updatedAt: string; // 更新日時（ISO 8601形式、日本時間）
}
```

### SavedCalorieEntry（登録済みカロリーエントリ）

再利用可能なカロリーエントリのテンプレートです。

```typescript
interface SavedCalorieEntry {
  id: string; // 一意のID（UUID形式を推奨）
  title: string; // タイトル
  calories: number; // カロリー数（kcal）
  photo?: string; // 写真のBase64データ（オプション）
  categoryId?: string; // カテゴリーID（オプション）
  createdAt: string; // 作成日時（ISO 8601形式、日本時間）
  updatedAt: string; // 更新日時（ISO 8601形式、日本時間）
  memo?: string; // メモ（オプション）
}
```

### DailyCalorieSummary（日別カロリー集計）

特定の日のカロリー集計情報です。

```typescript
interface DailyCalorieSummary {
  date: string; // 日付（YYYY-MM-DD形式、日本時間）
  totalCalories: number; // 合計カロリー（kcal）
  entryCount: number; // エントリ数
  entries: CalorieEntry[]; // その日のエントリ一覧
}
```

### MonthlyCalorieSummary（月別カロリー集計）

特定の月のカロリー集計情報です。

```typescript
interface MonthlyCalorieSummary {
  year: number; // 年
  month: number; // 月（1-12）
  totalCalories: number; // 合計カロリー（kcal）
  averageDailyCalories: number; // 1日あたりの平均カロリー（kcal）
  entryCount: number; // エントリ数
  dailySummaries: DailyCalorieSummary[]; // 日別集計の配列
}
```

## ローカルストレージの構造

### ストレージキー

```typescript
const STORAGE_KEYS = {
  CALORIE_ENTRIES: "calorie_entries", // カロリーエントリ一覧
  SAVED_CALORIE_ENTRIES: "saved_calorie_entries", // 登録済みカロリーエントリ一覧
  CATEGORIES: "categories", // カテゴリー一覧
} as const;
```

### データ形式

#### calorie_entries

```typescript
CalorieEntry[]
```

#### saved_calorie_entries

```typescript
SavedCalorieEntry[]
```

#### categories

```typescript
Category[]
```

## デフォルトカテゴリー

アプリ起動時に以下のデフォルトカテゴリーを用意します。

```typescript
const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt" | "updatedAt">[] = [
  { name: "ご飯・パン", color: "#FFB84D" },
  { name: "麺類", color: "#4DA6FF" },
  { name: "肉類", color: "#FF6B6B" },
  { name: "魚介類", color: "#95E1D3" },
  { name: "野菜", color: "#A8E6CF" },
  { name: "果物", color: "#FFD93D" },
  { name: "乳製品", color: "#C9E4DE" },
  { name: "お菓子・スイーツ", color: "#F4A261" },
  { name: "飲み物", color: "#E76F51" },
  { name: "その他", color: "#6C757D" },
];
```

## 日付フォーマット

- **表示用**: `YYYY年MM月DD日`（例: 2024 年 1 月 15 日）
- **保存用**: `YYYY-MM-DD`（例: 2024-01-15）
- **ISO 8601**: `YYYY-MM-DDTHH:mm:ss+09:00`（例: 2024-01-15T12:30:45+09:00）

## バリデーションルール

### CalorieEntry

- `id`: 必須、空文字不可
- `title`: 必須、1 文字以上 100 文字以下
- `calories`: 必須、0 以上の数値
- `date`: 必須、YYYY-MM-DD 形式
- `photo`: オプション、Base64 形式の文字列（最大 5MB 相当）

### Category

- `id`: 必須、空文字不可
- `name`: 必須、1 文字以上 50 文字以下、重複不可
- `color`: オプション、HEX 形式（#RRGGBB）

### SavedCalorieEntry

- `id`: 必須、空文字不可
- `title`: 必須、1 文字以上 100 文字以下
- `calories`: 必須、0 以上の数値
