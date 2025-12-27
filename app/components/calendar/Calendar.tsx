"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import CalendarHeader from "./CalendarHeader";
import CalendarDay from "./CalendarDay";
import { getCalorieEntries } from "@/lib/storage";
import { calculateDailyTotal } from "@/lib/calorie";
import { getToday, getMonthRange, getJapaneseDate } from "@/lib/date";
import type { CalorieEntry } from "@/types";

interface CalendarProps {
  year: number;
  month: number;
  onDateClick?: (date: string) => void;
  onMonthChange?: (year: number, month: number) => void;
}

export default function Calendar({
  year,
  month,
  onDateClick,
  onMonthChange,
}: CalendarProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = getToday();

  // ローカルストレージからデータを取得
  useEffect(() => {
    const loadEntries = () => {
      const storedEntries = getCalorieEntries();
      setEntries(storedEntries);
    };

    loadEntries();

    // ストレージ変更イベントをリッスン
    const handleStorageChange = () => {
      loadEntries();
    };

    window.addEventListener("storage", handleStorageChange);
    // カスタムイベントもリッスン（同じタブ内での変更）
    window.addEventListener("calorieEntriesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("calorieEntriesUpdated", handleStorageChange);
    };
  }, []);

  // 月の開始日と終了日を取得
  const { startDate, endDate } = useMemo(
    () => getMonthRange(year, month),
    [year, month]
  );

  // カレンダーの日付配列を生成
  const calendarDays = useMemo(() => {
    const start = new Date(startDate + "T00:00:00+09:00");
    const end = new Date(endDate + "T23:59:59+09:00");
    const firstDayOfWeek = start.getDay(); // 0 (日曜日) ～ 6 (土曜日)

    const days: Array<{ date: string; isCurrentMonth: boolean }> = [];

    // 前月の日付を追加
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(start);
      date.setDate(date.getDate() - i - 1);
      days.push({
        date: getJapaneseDate(date),
        isCurrentMonth: false,
      });
    }

    // 今月の日付を追加
    const currentDate = new Date(start);
    while (currentDate <= end) {
      days.push({
        date: getJapaneseDate(currentDate),
        isCurrentMonth: true,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 次月の日付を追加（7列×6行 = 42日分確保）
    const remainingDays = 42 - days.length;
    const nextMonthStart = new Date(end);
    nextMonthStart.setDate(nextMonthStart.getDate() + 1);
    for (let i = 0; i < remainingDays; i++) {
      const date = new Date(nextMonthStart);
      date.setDate(date.getDate() + i);
      days.push({
        date: getJapaneseDate(date),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [startDate, endDate]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    if (onDateClick) {
      onDateClick(date);
    } else {
      router.push(`/day/${date}`);
    }
  };

  const handlePreviousMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    if (onMonthChange) {
      onMonthChange(newYear, newMonth);
    }
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    if (onMonthChange) {
      onMonthChange(newYear, newMonth);
    }
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="w-full">
      <CalendarHeader
        year={year}
        month={month}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <div className="grid grid-cols-7 gap-2">
        {/* 曜日ヘッダー */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* カレンダーの日付 */}
        {calendarDays.map(({ date, isCurrentMonth }) => {
          const calories = calculateDailyTotal(entries, date);
          const isToday = date === today;
          const isSelected = selectedDate === date;

          return (
            <CalendarDay
              key={date}
              date={date}
              calories={calories}
              isToday={isToday}
              isSelected={isSelected}
              onClick={() => handleDateClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
}

