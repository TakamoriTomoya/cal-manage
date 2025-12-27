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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">
          {date ? "この日のカロリー記録はありません" : "カロリー記録がありません"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

