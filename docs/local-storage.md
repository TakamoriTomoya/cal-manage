# ローカルストレージ設計書

## 概要

カロリー管理アプリのローカルストレージ（localStorage）の構造と使用方法を定義します。

## ストレージキー

```typescript
const STORAGE_KEYS = {
  CALORIE_ENTRIES: "calorie_entries",
  SAVED_CALORIE_ENTRIES: "saved_calorie_entries",
  CATEGORIES: "categories",
  APP_VERSION: "app_version", // アプリのバージョン（将来のマイグレーション用）
} as const;
```

## データ構造

### calorie_entries

カロリーエントリの配列を JSON 形式で保存します。

```typescript
// 保存形式
CalorieEntry[]

// 例
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "ハンバーガー",
    "calories": 500,
    "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "categoryId": "cat-001",
    "date": "2024-01-15",
    "createdAt": "2024-01-15T12:30:45+09:00",
    "updatedAt": "2024-01-15T12:30:45+09:00",
    "memo": "ランチ"
  }
]
```

### saved_calorie_entries

登録済みカロリーエントリの配列を JSON 形式で保存します。

```typescript
// 保存形式
SavedCalorieEntry[]

// 例
[
  {
    "id": "saved-001",
    "title": "ハンバーガー",
    "calories": 500,
    "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "categoryId": "cat-001",
    "createdAt": "2024-01-15T12:30:45+09:00",
    "updatedAt": "2024-01-15T12:30:45+09:00",
    "memo": "ランチ"
  }
]
```

### categories

カテゴリーの配列を JSON 形式で保存します。

```typescript
// 保存形式
Category[]

// 例
[
  {
    "id": "cat-001",
    "name": "朝食",
    "color": "#FFB84D",
    "createdAt": "2024-01-01T00:00:00+09:00",
    "updatedAt": "2024-01-01T00:00:00+09:00"
  },
  {
    "id": "cat-002",
    "name": "昼食",
    "color": "#4DA6FF",
    "createdAt": "2024-01-01T00:00:00+09:00",
    "updatedAt": "2024-01-01T00:00:00+09:00"
  }
]
```

## 実装例

### ストレージユーティリティ関数

`lib/storage.ts` に以下の関数を実装します。

```typescript
// 型定義のインポート
import type { CalorieEntry, SavedCalorieEntry, Category } from "@/types";

// ストレージキー
const STORAGE_KEYS = {
  CALORIE_ENTRIES: "calorie_entries",
  SAVED_CALORIE_ENTRIES: "saved_calorie_entries",
  CATEGORIES: "categories",
} as const;

// 汎用の取得関数
function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to get storage item: ${key}`, error);
    return defaultValue;
  }
}

// 汎用の保存関数
function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set storage item: ${key}`, error);
    // ストレージが満杯の場合のエラーハンドリング
    if (error instanceof DOMException && error.code === 22) {
      alert("ストレージの容量が不足しています。古いデータを削除してください。");
    }
  }
}

// カロリーエントリ関連
export const getCalorieEntries = (): CalorieEntry[] => {
  return getStorageItem<CalorieEntry[]>(STORAGE_KEYS.CALORIE_ENTRIES, []);
};

export const saveCalorieEntry = (entry: CalorieEntry): void => {
  const entries = getCalorieEntries();
  const index = entries.findIndex((e) => e.id === entry.id);

  if (index >= 0) {
    entries[index] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    entries.push(entry);
  }

  setStorageItem(STORAGE_KEYS.CALORIE_ENTRIES, entries);
};

export const deleteCalorieEntry = (id: string): void => {
  const entries = getCalorieEntries();
  const filtered = entries.filter((e) => e.id !== id);
  setStorageItem(STORAGE_KEYS.CALORIE_ENTRIES, filtered);
};

export const updateCalorieEntry = (entry: CalorieEntry): void => {
  saveCalorieEntry(entry);
};

// 登録済みエントリ関連
export const getSavedCalorieEntries = (): SavedCalorieEntry[] => {
  return getStorageItem<SavedCalorieEntry[]>(
    STORAGE_KEYS.SAVED_CALORIE_ENTRIES,
    []
  );
};

export const saveSavedCalorieEntry = (entry: SavedCalorieEntry): void => {
  const entries = getSavedCalorieEntries();
  const index = entries.findIndex((e) => e.id === entry.id);

  if (index >= 0) {
    entries[index] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    entries.push(entry);
  }

  setStorageItem(STORAGE_KEYS.SAVED_CALORIE_ENTRIES, entries);
};

export const deleteSavedCalorieEntry = (id: string): void => {
  const entries = getSavedCalorieEntries();
  const filtered = entries.filter((e) => e.id !== id);
  setStorageItem(STORAGE_KEYS.SAVED_CALORIE_ENTRIES, filtered);
};

// カテゴリー関連
export const getCategories = (): Category[] => {
  const categories = getStorageItem<Category[]>(STORAGE_KEYS.CATEGORIES, []);

  // 初回起動時はデフォルトカテゴリーを設定
  if (categories.length === 0) {
    const defaultCategories = createDefaultCategories();
    setStorageItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
    return defaultCategories;
  }

  return categories;
};

export const saveCategory = (category: Category): void => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === category.id);

  if (index >= 0) {
    categories[index] = { ...category, updatedAt: new Date().toISOString() };
  } else {
    categories.push(category);
  }

  setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.CATEGORIES, filtered);
};

export const updateCategory = (category: Category): void => {
  saveCategory(category);
};

// デフォルトカテゴリーの作成
function createDefaultCategories(): Category[] {
  const now = new Date().toISOString();
  const defaults = [
    { name: "朝食", color: "#FFB84D" },
    { name: "昼食", color: "#4DA6FF" },
    { name: "夕食", color: "#FF6B6B" },
    { name: "間食", color: "#95E1D3" },
    { name: "飲み物", color: "#A8E6CF" },
  ];

  return defaults.map((cat, index) => ({
    id: `cat-${String(index + 1).padStart(3, "0")}`,
    ...cat,
    createdAt: now,
    updatedAt: now,
  }));
}

// ストレージのクリア（開発・デバッグ用）
export const clearAllStorage = (): void => {
  if (typeof window === "undefined") return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
```

## ストレージ容量の制限

- **localStorage の容量制限**: 通常 5-10MB（ブラウザによって異なる）
- **Base64 画像のサイズ**: 1 枚あたり約 1-2MB（元画像の約 1.33 倍）
- **推奨**: 写真は最大 5MB 相当まで、または合計で 10 枚程度まで

## エラーハンドリング

### ストレージが満杯の場合

```typescript
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error instanceof DOMException && error.code === 22) {
    // QUOTA_EXCEEDED_ERR
    // ユーザーに通知し、古いデータの削除を促す
  }
}
```

### データの破損

```typescript
try {
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  return data;
} catch (error) {
  // データが破損している場合はデフォルト値を返す
  console.error("Storage data corrupted, using default value");
  return defaultValue;
}
```

## 将来の拡張

### データベース移行時の考慮事項

- ローカルストレージのデータをエクスポートする機能
- データベースへのインポート機能
- 移行スクリプトの準備

### 外部ストレージ移行時の考慮事項

- 写真の Base64 データを外部ストレージ URL に変換
- 既存の Base64 データを段階的に移行
- フォールバック機能（外部ストレージが利用できない場合）

## デバッグ用関数

開発時にストレージの内容を確認するための関数。

```typescript
// ストレージの使用状況を確認
export const getStorageUsage = (): { used: number; available: number } => {
  if (typeof window === "undefined") return { used: 0, available: 0 };

  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // 概算値（実際の容量はブラウザによって異なる）
  const available = 5 * 1024 * 1024 - used; // 5MB - used

  return { used, available };
};

// ストレージの内容をダウンロード（バックアップ用）
export const exportStorageData = (): string => {
  const data = {
    calorieEntries: getCalorieEntries(),
    savedCalorieEntries: getSavedCalorieEntries(),
    categories: getCategories(),
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(data, null, 2);
};
```
