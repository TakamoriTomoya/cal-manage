"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CalorieEntryForm from "../components/calorie/CalorieEntryForm";
import Modal from "../components/ui/Modal";
import SavedEntryList from "../components/saved/SavedEntryList";
import Button from "../components/ui/Button";
import type { CalorieEntry, SavedCalorieEntry } from "@/types";
import { saveCalorieEntry } from "@/lib/storage";
import { getToday } from "@/lib/date";

export default function AddPage() {
  const router = useRouter();
  const [showSavedEntries, setShowSavedEntries] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CalorieEntry | undefined>(
    undefined
  );

  const handleSave = (entry: CalorieEntry) => {
    // ストレージ更新イベントを発火
    window.dispatchEvent(new Event("calorieEntriesUpdated"));
    router.push(`/day/${entry.date}`);
  };

  const handleSelectSavedEntry = (savedEntry: SavedCalorieEntry) => {
    // 登録済みエントリを選択して、今日の日付で新規エントリを作成
    const newEntry = saveCalorieEntry({
      title: savedEntry.title,
      calories: savedEntry.calories,
      photo: savedEntry.photo,
      categoryId: savedEntry.categoryId,
      memo: savedEntry.memo,
      date: getToday(),
    });

    window.dispatchEvent(new Event("calorieEntriesUpdated"));
    router.push(`/day/${newEntry.date}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {editingEntry ? "カロリーを編集" : "カロリーを追加"}
        </h1>
        <Button
          variant="secondary"
          onClick={() => setShowSavedEntries(true)}
        >
          登録済みから選択
        </Button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <CalorieEntryForm
          initialEntry={editingEntry}
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </div>

      <Modal
        isOpen={showSavedEntries}
        onClose={() => setShowSavedEntries(false)}
        title="登録済みカロリーから選択"
      >
        <SavedEntryList onSelect={handleSelectSavedEntry} />
      </Modal>
    </div>
  );
}

