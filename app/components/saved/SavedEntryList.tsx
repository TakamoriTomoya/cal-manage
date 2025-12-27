"use client";

import { useState, useEffect } from "react";
import SavedEntryCard from "./SavedEntryCard";
import { getSavedCalorieEntries, getCategories } from "@/lib/storage";
import type { SavedCalorieEntry, Category } from "@/types";

interface SavedEntryListProps {
  onSelect?: (entry: SavedCalorieEntry) => void;
  onEdit?: (entry: SavedCalorieEntry) => void;
  onDelete?: (id: string) => void;
  filterCategoryId?: string;
}

export default function SavedEntryList({
  onSelect,
  onEdit,
  onDelete,
  filterCategoryId,
}: SavedEntryListProps) {
  const [entries, setEntries] = useState<SavedCalorieEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadData = () => {
      let savedEntries = getSavedCalorieEntries();
      const allCategories = getCategories();

      // カテゴリーフィルター適用
      if (filterCategoryId) {
        savedEntries = savedEntries.filter(
          (entry) => entry.categoryId === filterCategoryId
        );
      }

      setEntries(savedEntries);
      setCategories(allCategories);
    };

    loadData();

    // ストレージ変更イベントをリッスン
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("savedCalorieEntriesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "savedCalorieEntriesUpdated",
        handleStorageChange
      );
    };
  }, [filterCategoryId]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-secondary/10 p-16 text-center transition-colors hover:bg-secondary/20 col-span-full">
        <div className="rounded-full bg-background p-4 shadow-sm">
          <svg className="h-8 w-8 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="mt-4 text-base font-medium text-foreground/70">
          {filterCategoryId
            ? "このカテゴリーの登録済みアイテムはありません"
            : "登録済みアイテムがありません"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          よく使う食品を登録して、入力を効率化しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-fr">
      {entries.map((entry) => (
        <SavedEntryCard
          key={entry.id}
          entry={entry}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
