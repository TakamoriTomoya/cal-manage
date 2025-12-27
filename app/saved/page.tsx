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
    if (confirm("この登録済みカロリーを削除しますか？")) {
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
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          登録済みカロリー
        </h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingEntry(undefined);
            setShowAddForm(true);
          }}
        >
          新規登録
        </Button>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          カテゴリーでフィルター
        </label>
        <select
          value={filterCategoryId || ""}
          onChange={(e) =>
            setFilterCategoryId(e.target.value || undefined)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
        >
          <option value="">すべて</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
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
        title={editingEntry ? "登録済みカロリーを編集" : "登録済みカロリーを追加"}
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

