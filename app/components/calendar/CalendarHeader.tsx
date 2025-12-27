"use client";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect?: (year: number, month: number) => void;
}

export default function CalendarHeader({
  year,
  month,
  onPreviousMonth,
  onNextMonth,
  onMonthSelect,
}: CalendarHeaderProps) {
  const monthNames = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        onClick={onPreviousMonth}
        className="rounded-lg p-2 hover:bg-gray-100"
        aria-label="前月"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <h2 className="text-xl font-semibold text-gray-900">
        {year}年{monthNames[month - 1]}
      </h2>

      <button
        onClick={onNextMonth}
        className="rounded-lg p-2 hover:bg-gray-100"
        aria-label="次月"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

