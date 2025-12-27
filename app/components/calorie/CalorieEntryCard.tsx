"use client";

import Image from "next/image";
import Card from "../ui/Card";
import type { CalorieEntry } from "@/types";
import { getCategoryById } from "@/lib/storage";
import { formatDate } from "@/lib/date";

interface CalorieEntryCardProps {
  entry: CalorieEntry;
  onEdit?: (entry: CalorieEntry) => void;
  onDelete?: (id: string) => void;
}

export default function CalorieEntryCard({
  entry,
  onEdit,
  onDelete,
}: CalorieEntryCardProps) {
  const category = entry.categoryId
    ? getCategoryById(entry.categoryId)
    : undefined;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 duration-300 border-border/60">
      <div className="flex gap-6 p-4">
        {entry.photo ? (
          <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-secondary/20 shadow-sm">
            <Image
              src={entry.photo}
              alt={entry.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/30 text-muted-foreground/30">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <h3 className="truncate text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  {entry.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {category && (
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm uppercase"
                      style={{ backgroundColor: category.color || "#6B7280" }}
                    >
                      {category.name}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDate(entry.date)}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline justify-end gap-1">
                  <p className="text-2xl font-extrabold text-foreground tabular-nums tracking-tight">
                    {entry.calories.toLocaleString()}
                  </p>
                  <span className="text-xs font-semibold text-muted-foreground">kcal</span>
                </div>
              </div>
            </div>
            {entry.memo && (
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
                {entry.memo}
              </p>
            )}
          </div>
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex border-t border-border/50 divide-x divide-border/50 bg-secondary/10">
          {onEdit && (
            <button
              onClick={() => onEdit(entry)}
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground hover:bg-white hover:text-primary transition-colors"
            >
              編集
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              削除
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
