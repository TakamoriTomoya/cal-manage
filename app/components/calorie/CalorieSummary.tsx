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
    <Card className="border-border bg-gradient-to-br from-card to-secondary/30 shadow-sm">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {date && period === "day" && (
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-2">{formatDate(date)}</p>
        )}
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-6xl font-black tracking-tighter text-foreground tabular-nums drop-shadow-sm">
            {totalCalories.toLocaleString()}
          </p>
          <span className="text-xl font-bold text-muted-foreground">kcal</span>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <p className="text-sm font-medium text-muted-foreground">
            <span className="font-bold text-foreground">{entryCount}</span> 件の記録
          </p>
        </div>
      </div>
    </Card>
  );
}
