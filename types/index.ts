/**
 * カロリー管理アプリの型定義
 */

/**
 * カロリーエントリ
 * 1 日のカロリー記録を表すデータ構造
 */
export interface CalorieEntry {
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

/**
 * カテゴリー
 * カロリーエントリを分類するためのカテゴリー
 */
export interface Category {
  id: string; // 一意のID（UUID形式を推奨）
  name: string; // カテゴリー名
  color?: string; // カテゴリーの色（HEX形式、オプション）
  createdAt: string; // 作成日時（ISO 8601形式、日本時間）
  updatedAt: string; // 更新日時（ISO 8601形式、日本時間）
}

/**
 * 登録済みカロリーエントリ
 * 再利用可能なカロリーエントリのテンプレート
 */
export interface SavedCalorieEntry {
  id: string; // 一意のID（UUID形式を推奨）
  title: string; // タイトル
  calories: number; // カロリー数（kcal）
  photo?: string; // 写真のBase64データ（オプション）
  categoryId?: string; // カテゴリーID（オプション）
  createdAt: string; // 作成日時（ISO 8601形式、日本時間）
  updatedAt: string; // 更新日時（ISO 8601形式、日本時間）
  memo?: string; // メモ（オプション）
}

/**
 * 日別カロリー集計
 * 特定の日のカロリー集計情報
 */
export interface DailyCalorieSummary {
  date: string; // 日付（YYYY-MM-DD形式、日本時間）
  totalCalories: number; // 合計カロリー（kcal）
  entryCount: number; // エントリ数
  entries: CalorieEntry[]; // その日のエントリ一覧
}

/**
 * 月別カロリー集計
 * 特定の月のカロリー集計情報
 */
export interface MonthlyCalorieSummary {
  year: number; // 年
  month: number; // 月（1-12）
  totalCalories: number; // 合計カロリー（kcal）
  averageDailyCalories: number; // 1日あたりの平均カロリー（kcal）
  entryCount: number; // エントリ数
  dailySummaries: DailyCalorieSummary[]; // 日別集計の配列
}

