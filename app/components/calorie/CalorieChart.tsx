"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { getCalorieEntries } from "@/lib/storage";
import { getDailySummary } from "@/lib/calorie";
import { getToday, getMonthRange } from "@/lib/date";
import type { CalorieEntry } from "@/types";

interface CalorieChartProps {
  entries: CalorieEntry[];
  year: number;
  month: number;
}

export default function CalorieChart({
  entries,
  year,
  month,
}: CalorieChartProps) {
  const chartData = useMemo(() => {
    const { startDate, endDate } = getMonthRange(year, month);
    const start = new Date(startDate + "T00:00:00+09:00");
    const end = new Date(endDate + "T23:59:59+09:00");
    const today = getToday();

    const data: Array<{
      date: string;
      day: number;
      calories: number;
      isToday: boolean;
    }> = [];

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
        currentDate.getDate()
      ).padStart(2, "0")}`;
      const summary = getDailySummary(entries, dateStr);

      data.push({
        date: dateStr,
        day: currentDate.getDate(),
        calories: summary.totalCalories,
        isToday: dateStr === today,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }, [entries, year, month]);

  return (
    <div className="w-full space-y-8">
      {/* 棒グラフ */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-black/5 ring-1 ring-black/5">
        <h3 className="mb-6 text-xl font-bold text-gray-900 tracking-tight">
          日別カロリー摂取量
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#F9FAFB" }}
                formatter={(value: number) => [`${value} kcal`, "カロリー"]}
                labelFormatter={(label) => `${year}年${month}月${label}日`}
              />
              <Bar
                dataKey="calories"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                barSize={20}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* エリアチャート（折れ線グラフよりリッチに見える） */}
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-black/5 ring-1 ring-black/5">
        <h3 className="mb-6 text-xl font-bold text-gray-900 tracking-tight">
          カロリー推移
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#F9FAFB" }}
                formatter={(value: number) => [`${value} kcal`, "カロリー"]}
                labelFormatter={(label) => `${year}年${month}月${label}日`}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="#8B5CF6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCalories)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
