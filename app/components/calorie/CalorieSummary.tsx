"use client";

import Card from "../ui/Card";
import { formatDate } from "@/lib/date";

interface CalorieSummaryProps {
  totalCalories: number;
  entryCount: number;
  date?: string; // 日付（日別表示の場合）
  period?: "day" | "month"; // 集計期間
}

export default function CalorieSummary({
  totalCalories,
  entryCount,
  date,
  period = "day",
}: CalorieSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center">
        {date && period === "day" && (
          <p className="text-sm text-gray-600">{formatDate(date)}</p>
        )}
        <p className="mt-2 text-4xl font-bold text-blue-700">
          {totalCalories.toLocaleString()} kcal
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {entryCount}件の記録
        </p>
      </div>
    </Card>
  );
}

