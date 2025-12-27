"use client";

import Image from "next/image";
import Card from "../ui/Card";
import Button from "../ui/Button";
import type { SavedCalorieEntry } from "@/types";
import { getCategoryById } from "@/lib/storage";

interface SavedEntryCardProps {
  entry: SavedCalorieEntry;
  onSelect?: (entry: SavedCalorieEntry) => void;
  onEdit?: (entry: SavedCalorieEntry) => void;
  onDelete?: (id: string) => void;
}

export default function SavedEntryCard({
  entry,
  onSelect,
  onEdit,
  onDelete,
}: SavedEntryCardProps) {
  const category = entry.categoryId
    ? getCategoryById(entry.categoryId)
    : undefined;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 h-full flex flex-col ${
        onSelect ? "cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-primary/20 hover:-translate-y-1" : ""
      }`}
      onClick={() => onSelect?.(entry)}
    >
      <div className="flex flex-1 gap-5 p-5">
        {entry.photo ? (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border shadow-sm">
            <Image
              src={entry.photo}
              alt={entry.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/30 text-muted-foreground/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {entry.title}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-1 mb-2">
            <p className="text-xl font-extrabold text-foreground tabular-nums tracking-tight">
              {entry.calories.toLocaleString()}
            </p>
            <span className="text-xs font-semibold text-muted-foreground">kcal</span>
          </div>

          <div className="mt-auto">
            {category && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm uppercase"
                style={{ backgroundColor: category.color || "#6B7280" }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {entry.memo && (
        <div className="px-5 pb-4">
           <p className="line-clamp-2 text-xs text-muted-foreground bg-secondary/30 p-2 rounded-lg leading-relaxed">
             {entry.memo}
           </p>
        </div>
      )}

      {(onEdit || onDelete) && (
        <div className="mt-auto border-t border-border/50 bg-secondary/10 p-2 flex gap-2">
          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1 h-9 text-xs shadow-none"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(entry);
              }}
            >
              選択
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-9 text-xs bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(entry);
              }}
            >
              編集
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              className="flex-1 h-9 text-xs shadow-none bg-red-50 hover:bg-red-100 border-transparent text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
