"use client";

import { getCalorieEntriesByDate } from "@/lib/storage";
import { calculateDailyTotal } from "@/lib/calorie";
import { useEffect, useState } from "react";
import type { CalorieEntry } from "@/types";

interface CalendarDayProps {
  date: string; // YYYY-MM-DD
  calories: number;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  date,
  calories,
  isToday,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const day = date.split("-")[2];
  const hasCalories = calories > 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative flex h-12 w-full items-center justify-center rounded-lg border transition-colors
        ${isToday ? "border-blue-500 bg-blue-50 font-semibold" : "border-gray-200"}
        ${isSelected ? "bg-blue-100 ring-2 ring-blue-500" : ""}
        ${hasCalories ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}
      `}
    >
      <span className={`${isToday ? "text-blue-700" : "text-gray-700"}`}>
        {day}
      </span>
      {hasCalories && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-green-600">
          {calories}kcal
        </span>
      )}
    </button>
  );
}

