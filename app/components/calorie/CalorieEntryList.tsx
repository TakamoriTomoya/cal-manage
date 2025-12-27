"use client";

import CalorieEntryCard from "./CalorieEntryCard";
import type { CalorieEntry } from "@/types";

interface CalorieEntryListProps {
  entries: CalorieEntry[];
  date?: string;
  onEdit?: (entry: CalorieEntry) => void;
  onDelete?: (id: string) => void;
}

export default function CalorieEntryList({
  entries,
  date,
  onEdit,
  onDelete,
}: CalorieEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-secondary/10 p-16 text-center transition-colors hover:bg-secondary/20">
        <div className="rounded-full bg-background p-4 shadow-sm">
          <svg className="h-8 w-8 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="mt-4 text-base font-medium text-foreground/70">
          {date ? "この日の記録はありません" : "記録がありません"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          新しいカロリー記録を追加して管理を始めましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <CalorieEntryCard
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
