"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SavedEntryList from "../components/saved/SavedEntryList";
import CalorieEntryForm from "../components/calorie/CalorieEntryForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import {
  getCategories,
  saveSavedCalorieEntry,
  deleteSavedCalorieEntry,
  saveCalorieEntry,
} from "@/lib/storage";
import { getToday } from "@/lib/date";
import type { SavedCalorieEntry } from "@/types";

export default function SavedPage() {
  const router = useRouter();
  const [filterCategoryId, setFilterCategoryId] = useState<string | undefined>(
    undefined
  );
  const [editingEntry, setEditingEntry] = useState<
    SavedCalorieEntry | undefined
  >(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categories, setCategories] = useState(
    getCategories()
  );

  const handleSelect = (entry: SavedCalorieEntry) => {
    // 登録済みエントリを選択して、今日の日付で新規エントリを作成
    const newEntry = saveCalorieEntry({
      title: entry.title,
      calories: entry.calories,
      photo: entry.photo,
      categoryId: entry.categoryId,
      memo: entry.memo,
      date: getToday(),
    });
    window.dispatchEvent(new Event("calorieEntriesUpdated"));
    router.push(`/day/${newEntry.date}`);
  };

  const handleEdit = (entry: SavedCalorieEntry) => {
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("この登録済みアイテムを削除しますか？")) {
      deleteSavedCalorieEntry(id);
      window.dispatchEvent(new Event("savedCalorieEntriesUpdated"));
    }
  };

  const handleSave = (entry: SavedCalorieEntry) => {
    window.dispatchEvent(new Event("savedCalorieEntriesUpdated"));
    setShowAddForm(false);
    setEditingEntry(undefined);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            登録済みアイテム
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            よく使う項目を登録して素早く入力できます
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setEditingEntry(undefined);
              setShowAddForm(true);
            }}
          >
            新規登録
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-border/60 shadow-sm">
        <label className="text-sm font-semibold text-foreground whitespace-nowrap">
          カテゴリーで絞り込み:
        </label>
        <div className="relative max-w-xs w-full">
          <select
            value={filterCategoryId || ""}
            onChange={(e) =>
              setFilterCategoryId(e.target.value || undefined)
            }
            className="w-full h-10 rounded-xl border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none shadow-sm hover:bg-secondary/20 transition-colors"
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 md:p-8 shadow-sm">
        <SavedEntryList
          filterCategoryId={filterCategoryId}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingEntry(undefined);
        }}
        title={editingEntry ? "登録済みアイテムを編集" : "登録済みアイテムを追加"}
        showCloseButton={false}
      >
        <CalorieEntryForm
          initialEntry={editingEntry}
          onSave={(entry) => {
            // CalorieEntryをSavedCalorieEntryに変換
            const savedEntry: SavedCalorieEntry = {
              id: editingEntry?.id || entry.id,
              title: entry.title,
              calories: entry.calories,
              photo: entry.photo,
              categoryId: entry.categoryId,
              memo: entry.memo,
              createdAt: editingEntry?.createdAt || entry.createdAt,
              updatedAt: entry.updatedAt,
            };
            saveSavedCalorieEntry(savedEntry);
            handleSave(savedEntry);
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEntry(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
