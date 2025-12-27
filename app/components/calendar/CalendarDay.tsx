"use client";

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
        group relative flex aspect-square w-full flex-col items-center justify-start rounded-2xl border p-1 transition-all duration-300
        ${isToday 
          ? "border-primary/20 bg-primary/5 shadow-inner" 
          : "border-transparent bg-transparent hover:bg-secondary/50 hover:border-border/50"
        }
        ${isSelected 
          ? "ring-2 ring-primary ring-offset-2 z-10 bg-white shadow-lg scale-105" 
          : ""
        }
      `}
    >
      <span 
        className={`
          mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors
          ${isToday 
            ? "bg-primary text-white shadow-md shadow-primary/20" 
            : "text-foreground/80 group-hover:text-foreground"
          }
        `}
      >
        {Number(day)}
      </span>
      
      {hasCalories && (
        <div className="absolute bottom-2 left-0 right-0 flex w-full flex-col items-center justify-center gap-0.5 px-1 animate-in fade-in zoom-in-50 duration-300">
          <div className="h-0.5 w-6 rounded-full bg-border/50 mb-1" />
          <span className="truncate text-xs font-bold text-primary tabular-nums tracking-tight">
            {calories.toLocaleString()}
          </span>
          <span className="text-[9px] text-muted-foreground/70 font-medium -mt-1 scale-90">kcal</span>
        </div>
      )}
    </button>
  );
}
