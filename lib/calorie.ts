/**
 * カロリー計算ユーティリティ関数
 */

import type {
  CalorieEntry,
  DailyCalorieSummary,
  MonthlyCalorieSummary,
} from "@/types";

/**
 * 指定日のカロリー合計を計算
 */
export function calculateDailyTotal(
  entries: CalorieEntry[],
  date: string
): number {
  return entries
    .filter((entry) => entry.date === date)
    .reduce((total, entry) => total + entry.calories, 0);
}

/**
 * 指定月のカロリー合計を計算
 */
export function calculateMonthlyTotal(
  entries: CalorieEntry[],
  year: number,
  month: number
): number {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;

  return entries
    .filter((entry) => entry.date.startsWith(prefix))
    .reduce((total, entry) => total + entry.calories, 0);
}

/**
 * 指定日のカロリー集計情報を取得
 */
export function getDailySummary(
  entries: CalorieEntry[],
  date: string
): DailyCalorieSummary {
  const dayEntries = entries.filter((entry) => entry.date === date);
  const totalCalories = dayEntries.reduce(
    (total, entry) => total + entry.calories,
    0
  );

  return {
    date,
    totalCalories,
    entryCount: dayEntries.length,
    entries: dayEntries,
  };
}

/**
 * 指定月のカロリー集計情報を取得
 */
export function getMonthlySummary(
  entries: CalorieEntry[],
  year: number,
  month: number
): MonthlyCalorieSummary {
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;

  const monthEntries = entries.filter((entry) =>
    entry.date.startsWith(prefix)
  );
  const totalCalories = monthEntries.reduce(
    (total, entry) => total + entry.calories,
    0
  );

  // 日別集計を計算
  const dailyMap = new Map<string, CalorieEntry[]>();
  monthEntries.forEach((entry) => {
    const dayEntries = dailyMap.get(entry.date) || [];
    dayEntries.push(entry);
    dailyMap.set(entry.date, dayEntries);
  });

  const dailySummaries: DailyCalorieSummary[] = Array.from(
    dailyMap.entries()
  ).map(([date, dayEntries]) => {
    const total = dayEntries.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );
    return {
      date,
      totalCalories: total,
      entryCount: dayEntries.length,
      entries: dayEntries,
    };
  });

  // 月の日数を取得
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysWithEntries = dailySummaries.length;
  const averageDailyCalories =
    daysWithEntries > 0 ? totalCalories / daysWithEntries : 0;

  return {
    year,
    month,
    totalCalories,
    averageDailyCalories,
    entryCount: monthEntries.length,
    dailySummaries,
  };
}

