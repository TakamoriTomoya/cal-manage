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
    <div className="mb-8 flex items-center justify-between px-2">
      <button
        onClick={onPreviousMonth}
        className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md active:scale-95"
        aria-label="前月"
      >
        <svg
          className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
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

      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          <span className="text-3xl mr-2 tabular-nums">{year}</span>
          <span className="text-muted-foreground font-light">年</span>
          <span className="text-3xl ml-2 tabular-nums text-primary">{monthNames[month - 1]}</span>
        </h2>
      </div>

      <button
        onClick={onNextMonth}
        className="group flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md active:scale-95"
        aria-label="次月"
      >
        <svg
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
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
