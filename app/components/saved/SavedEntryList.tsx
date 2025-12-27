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
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">
          {filterCategoryId
            ? "このカテゴリーの登録済みカロリーはありません"
            : "登録済みカロリーがありません"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

