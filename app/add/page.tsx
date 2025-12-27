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
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {editingEntry ? "記録を編集" : "新しい記録"}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            今日の食事や運動を記録しましょう
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowSavedEntries(true)}
          className="shadow-sm"
        >
          登録済みアイテムから選択
        </Button>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl shadow-black/5 ring-1 ring-black/5">
        <CalorieEntryForm
          initialEntry={editingEntry}
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </div>

      <Modal
        isOpen={showSavedEntries}
        onClose={() => setShowSavedEntries(false)}
        title="登録済みアイテムから選択"
      >
        <SavedEntryList onSelect={handleSelectSavedEntry} />
      </Modal>
    </div>
  );
}
