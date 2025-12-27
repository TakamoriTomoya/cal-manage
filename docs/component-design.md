# コンポーネント設計書

## 概要

カロリー管理アプリのコンポーネント構成と設計方針を定義します。

## ディレクトリ構造

```
app/
├── layout.tsx                    # ルートレイアウト
├── page.tsx                      # ホームページ（カレンダー表示）
├── (routes)/
│   ├── add/
│   │   └── page.tsx             # カロリー登録ページ
│   ├── day/
│   │   └── [date]/
│   │       └── page.tsx         # 日別詳細ページ
│   └── saved/
│       └── page.tsx             # 登録済みカロリー一覧ページ
└── components/
    ├── ui/                      # 共通UIコンポーネント
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Modal.tsx
    │   └── Card.tsx
    ├── calendar/                # カレンダー関連コンポーネント
    │   ├── Calendar.tsx
    │   ├── CalendarHeader.tsx
    │   ├── CalendarDay.tsx
    │   └── CalendarMonth.tsx
    ├── calorie/                 # カロリー関連コンポーネント
    │   ├── CalorieEntryForm.tsx
    │   ├── CalorieEntryCard.tsx
    │   ├── CalorieEntryList.tsx
    │   ├── CalorieSummary.tsx
    │   └── PhotoUpload.tsx
    ├── category/                # カテゴリー関連コンポーネント
    │   ├── CategorySelect.tsx
    │   ├── CategoryList.tsx
    │   └── CategoryForm.tsx
    └── saved/                   # 登録済みカロリー関連コンポーネント
        ├── SavedEntryList.tsx
        └── SavedEntryCard.tsx
```

## 主要コンポーネント

### 1. Calendar（カレンダー）

月単位のカレンダーを表示するコンポーネント。

**Props:**

```typescript
interface CalendarProps {
  year: number;
  month: number;
  onDateClick: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}
```

**機能:**

- 月のカレンダー表示
- 各日のカロリー合計を表示
- 日付クリックで詳細ページへ遷移
- 前月・次月への切り替え
- 任意の年月への移動

### 2. CalendarHeader（カレンダーヘッダー）

カレンダーのヘッダー部分（年月表示、ナビゲーション）。

**Props:**

```typescript
interface CalendarHeaderProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (year: number, month: number) => void;
}
```

### 3. CalendarDay（カレンダー日付セル）

カレンダーの 1 日分のセル。

**Props:**

```typescript
interface CalendarDayProps {
  date: string; // YYYY-MM-DD
  calories: number;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}
```

### 4. CalorieEntryForm（カロリー登録フォーム）

新しいカロリーエントリを登録するフォーム。

**Props:**

```typescript
interface CalorieEntryFormProps {
  initialDate?: string; // 初期日付
  onSave: (entry: Omit<CalorieEntry, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}
```

**機能:**

- 写真アップロード
- タイトル入力
- カロリー入力
- カテゴリー選択
- 日付選択
- メモ入力

### 5. CalorieEntryCard（カロリーエントリカード）

1 つのカロリーエントリを表示するカード。

**Props:**

```typescript
interface CalorieEntryCardProps {
  entry: CalorieEntry;
  onEdit?: (entry: CalorieEntry) => void;
  onDelete?: (id: string) => void;
}
```

### 6. CalorieEntryList（カロリーエントリ一覧）

カロリーエントリの一覧を表示。

**Props:**

```typescript
interface CalorieEntryListProps {
  entries: CalorieEntry[];
  date: string;
  onEdit?: (entry: CalorieEntry) => void;
  onDelete?: (id: string) => void;
}
```

### 7. CalorieSummary（カロリー集計）

カロリーの合計や統計を表示。

**Props:**

```typescript
interface CalorieSummaryProps {
  totalCalories: number;
  entryCount: number;
  date?: string; // 日付（日別表示の場合）
  period?: "day" | "month"; // 集計期間
}
```

### 8. PhotoUpload（写真アップロード）

写真をアップロード・プレビューするコンポーネント。

**Props:**

```typescript
interface PhotoUploadProps {
  value?: string; // Base64データ
  onChange: (base64: string | undefined) => void;
  maxSize?: number; // 最大サイズ（バイト）
}
```

### 9. CategorySelect（カテゴリー選択）

カテゴリーを選択するドロップダウン。

**Props:**

```typescript
interface CategorySelectProps {
  value?: string; // 選択中のカテゴリーID
  onChange: (categoryId: string | undefined) => void;
  categories: Category[];
}
```

### 10. SavedEntryList（登録済みエントリ一覧）

登録済みカロリーエントリの一覧を表示。

**Props:**

```typescript
interface SavedEntryListProps {
  entries: SavedCalorieEntry[];
  categories: Category[];
  onSelect: (entry: SavedCalorieEntry) => void;
  onEdit?: (entry: SavedCalorieEntry) => void;
  onDelete?: (id: string) => void;
  filterCategoryId?: string; // カテゴリーフィルター
}
```

### 11. CategoryForm（カテゴリーフォーム）

カテゴリーの追加・編集フォーム。

**Props:**

```typescript
interface CategoryFormProps {
  category?: Category; // 編集時は既存のカテゴリー
  onSave: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}
```

## 共通 UI コンポーネント

### Button

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
```

### Input

```typescript
interface InputProps {
  type?: "text" | "number" | "date" | "file";
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
}
```

### Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

### Card

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
```

## 状態管理

### ローカルストレージ管理

`lib/storage.ts` にローカルストレージの操作関数を定義。

```typescript
// カロリーエントリの取得・保存
export const getCalorieEntries: () => CalorieEntry[];
export const saveCalorieEntry: (entry: CalorieEntry) => void;
export const deleteCalorieEntry: (id: string) => void;
export const updateCalorieEntry: (entry: CalorieEntry) => void;

// 登録済みエントリの取得・保存
export const getSavedCalorieEntries: () => SavedCalorieEntry[];
export const saveSavedCalorieEntry: (entry: SavedCalorieEntry) => void;
export const deleteSavedCalorieEntry: (id: string) => void;

// カテゴリーの取得・保存
export const getCategories: () => Category[];
export const saveCategory: (category: Category) => void;
export const deleteCategory: (id: string) => void;
export const updateCategory: (category: Category) => void;
```

### 日付ユーティリティ

`lib/date.ts` に日付操作関数を定義。

```typescript
export const formatDate: (date: string) => string; // YYYY-MM-DD → YYYY年MM月DD日
export const getToday: () => string; // 今日の日付をYYYY-MM-DD形式で返す
export const getJapaneseDate: (date: Date) => string; // Date → YYYY-MM-DD（JST）
export const parseDate: (dateString: string) => Date; // YYYY-MM-DD → Date（JST）
```

### カロリー計算ユーティリティ

`lib/calorie.ts` にカロリー計算関数を定義。

```typescript
export const calculateDailyTotal: (
  entries: CalorieEntry[],
  date: string
) => number;
export const calculateMonthlyTotal: (
  entries: CalorieEntry[],
  year: number,
  month: number
) => number;
export const getDailySummary: (
  entries: CalorieEntry[],
  date: string
) => DailyCalorieSummary;
export const getMonthlySummary: (
  entries: CalorieEntry[],
  year: number,
  month: number
) => MonthlyCalorieSummary;
```

## スタイリング方針

- Tailwind CSS を使用
- モバイルファーストのレスポンシブデザイン
- ダークモード対応（将来の拡張）
- アクセシビリティを考慮したコントラスト比
