"use client";

import { useState, useEffect } from "react";
import Calendar from "./components/calendar/Calendar";
import CalorieChart from "./components/calorie/CalorieChart";
import { getToday } from "@/lib/date";
import { getCalorieEntries } from "@/lib/storage";
import type { CalorieEntry } from "@/types";

export default function Home() {
  const today = getToday();
  const [year, setYear] = useState(() => {
    const [y] = today.split("-").map(Number);
    return y;
  });
  const [month, setMonth] = useState(() => {
    const [, m] = today.split("-").map(Number);
    return m;
  });
  const [entries, setEntries] = useState<CalorieEntry[]>([]);

  useEffect(() => {
    const loadEntries = () => {
      const storedEntries = getCalorieEntries();
      setEntries(storedEntries);
    };

    loadEntries();

    const handleStorageChange = () => {
      loadEntries();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("calorieEntriesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("calorieEntriesUpdated", handleStorageChange);
    };
  }, []);

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            ダッシュボード
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            日々の摂取カロリーをスマートに管理しましょう
          </p>
        </div>
      </div>

      {/* グラフセクション */}
      <CalorieChart entries={entries} year={year} month={month} />

      {/* カレンダーセクション */}
      <div className="rounded-3xl border border-border/60 bg-white p-8 shadow-xl shadow-black/5 ring-1 ring-black/5">
        <Calendar
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}
