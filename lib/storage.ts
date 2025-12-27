/**
 * ローカルストレージ操作関数
 * カロリー管理アプリのデータをlocalStorageに保存・取得
 */

import type {
  CalorieEntry,
  SavedCalorieEntry,
  Category,
} from "@/types";

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

// UUID生成関数
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 現在の日時をISO形式で取得（日本時間）
function getCurrentISOString(): string {
  const now = new Date();
  const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jstDate.toISOString();
}

// ==================== カロリーエントリ関連 ====================

/**
 * カロリーエントリ一覧を取得
 */
export function getCalorieEntries(): CalorieEntry[] {
  return getStorageItem<CalorieEntry[]>(STORAGE_KEYS.CALORIE_ENTRIES, []);
}

/**
 * カロリーエントリを保存（新規作成または更新）
 */
export function saveCalorieEntry(
  entry: Omit<CalorieEntry, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): CalorieEntry {
  const entries = getCalorieEntries();
  const now = getCurrentISOString();

  let savedEntry: CalorieEntry;

  if (entry.id) {
    // 更新
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      savedEntry = {
        ...entries[index],
        ...entry,
        updatedAt: now,
      };
      entries[index] = savedEntry;
    } else {
      // IDが指定されているが存在しない場合は新規作成
      savedEntry = {
        ...entry,
        id: entry.id,
        createdAt: now,
        updatedAt: now,
      } as CalorieEntry;
      entries.push(savedEntry);
    }
  } else {
    // 新規作成
    savedEntry = {
      ...entry,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as CalorieEntry;
    entries.push(savedEntry);
  }

  setStorageItem(STORAGE_KEYS.CALORIE_ENTRIES, entries);
  return savedEntry;
}

/**
 * カロリーエントリを削除
 */
export function deleteCalorieEntry(id: string): void {
  const entries = getCalorieEntries();
  const filtered = entries.filter((e) => e.id !== id);
  setStorageItem(STORAGE_KEYS.CALORIE_ENTRIES, filtered);
}

/**
 * カロリーエントリを更新
 */
export function updateCalorieEntry(entry: CalorieEntry): CalorieEntry {
  return saveCalorieEntry(entry);
}

/**
 * 指定日のカロリーエントリを取得
 */
export function getCalorieEntriesByDate(date: string): CalorieEntry[] {
  const entries = getCalorieEntries();
  return entries.filter((entry) => entry.date === date);
}

// ==================== 登録済みエントリ関連 ====================

/**
 * 登録済みカロリーエントリ一覧を取得
 */
export function getSavedCalorieEntries(): SavedCalorieEntry[] {
  return getStorageItem<SavedCalorieEntry[]>(
    STORAGE_KEYS.SAVED_CALORIE_ENTRIES,
    []
  );
}

/**
 * 登録済みカロリーエントリを保存（新規作成または更新）
 */
export function saveSavedCalorieEntry(
  entry: Omit<SavedCalorieEntry, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): SavedCalorieEntry {
  const entries = getSavedCalorieEntries();
  const now = getCurrentISOString();

  let savedEntry: SavedCalorieEntry;

  if (entry.id) {
    // 更新
    const index = entries.findIndex((e) => e.id === entry.id);
    if (index >= 0) {
      savedEntry = {
        ...entries[index],
        ...entry,
        updatedAt: now,
      };
      entries[index] = savedEntry;
    } else {
      // IDが指定されているが存在しない場合は新規作成
      savedEntry = {
        ...entry,
        id: entry.id,
        createdAt: now,
        updatedAt: now,
      } as SavedCalorieEntry;
      entries.push(savedEntry);
    }
  } else {
    // 新規作成
    savedEntry = {
      ...entry,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as SavedCalorieEntry;
    entries.push(savedEntry);
  }

  setStorageItem(STORAGE_KEYS.SAVED_CALORIE_ENTRIES, entries);
  return savedEntry;
}

/**
 * 登録済みカロリーエントリを削除
 */
export function deleteSavedCalorieEntry(id: string): void {
  const entries = getSavedCalorieEntries();
  const filtered = entries.filter((e) => e.id !== id);
  setStorageItem(STORAGE_KEYS.SAVED_CALORIE_ENTRIES, filtered);
}

/**
 * 登録済みカロリーエントリを更新
 */
export function updateSavedCalorieEntry(
  entry: SavedCalorieEntry
): SavedCalorieEntry {
  return saveSavedCalorieEntry(entry);
}

// ==================== カテゴリー関連 ====================

/**
 * デフォルトカテゴリーを作成
 */
function createDefaultCategories(): Category[] {
  const now = getCurrentISOString();
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

/**
 * カテゴリー一覧を取得（初回起動時はデフォルトカテゴリーを設定）
 */
export function getCategories(): Category[] {
  const categories = getStorageItem<Category[]>(
    STORAGE_KEYS.CATEGORIES,
    []
  );

  // 初回起動時はデフォルトカテゴリーを設定
  if (categories.length === 0) {
    const defaultCategories = createDefaultCategories();
    setStorageItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
    return defaultCategories;
  }

  return categories;
}

/**
 * カテゴリーを保存（新規作成または更新）
 */
export function saveCategory(
  category: Omit<Category, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
  }
): Category {
  const categories = getCategories();
  const now = getCurrentISOString();

  let savedCategory: Category;

  if (category.id) {
    // 更新
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      savedCategory = {
        ...categories[index],
        ...category,
        updatedAt: now,
      };
      categories[index] = savedCategory;
    } else {
      // IDが指定されているが存在しない場合は新規作成
      savedCategory = {
        ...category,
        id: category.id,
        createdAt: now,
        updatedAt: now,
      } as Category;
      categories.push(savedCategory);
    }
  } else {
    // 新規作成
    savedCategory = {
      ...category,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as Category;
    categories.push(savedCategory);
  }

  setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
  return savedCategory;
}

/**
 * カテゴリーを削除
 */
export function deleteCategory(id: string): void {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.CATEGORIES, filtered);
}

/**
 * カテゴリーを更新
 */
export function updateCategory(category: Category): Category {
  return saveCategory(category);
}

/**
 * IDでカテゴリーを取得
 */
export function getCategoryById(id: string): Category | undefined {
  const categories = getCategories();
  return categories.find((c) => c.id === id);
}

// ==================== ユーティリティ関数 ====================

/**
 * ストレージの使用状況を確認（開発・デバッグ用）
 */
export function getStorageUsage(): { used: number; available: number } {
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
}

/**
 * ストレージの内容をエクスポート（バックアップ用）
 */
export function exportStorageData(): string {
  const data = {
    calorieEntries: getCalorieEntries(),
    savedCalorieEntries: getSavedCalorieEntries(),
    categories: getCategories(),
    exportedAt: getCurrentISOString(),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * ストレージのクリア（開発・デバッグ用）
 */
export function clearAllStorage(): void {
  if (typeof window === "undefined") return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

