"use client";

import { useState, useEffect } from "react";
import Calendar from "./components/calendar/Calendar";
import { getToday } from "@/lib/date";

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

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        カロリー管理
      </h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <Calendar
          year={year}
          month={month}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}
