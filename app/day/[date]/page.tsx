"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CalorieEntryList from "../../components/calorie/CalorieEntryList";
import CalorieSummary from "../../components/calorie/CalorieSummary";
import CalorieEntryForm from "../../components/calorie/CalorieEntryForm";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { getCalorieEntriesByDate, deleteCalorieEntry } from "@/lib/storage";
import { getDailySummary } from "@/lib/calorie";
import { formatDate, isValidDate } from "@/lib/date";
import type { CalorieEntry } from "@/types";

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<CalorieEntry | undefined>(
    undefined
  );
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!isValidDate(date)) {
      router.push("/");
      return;
    }

    const loadEntries = () => {
      const dayEntries = getCalorieEntriesByDate(date);
      setEntries(dayEntries);
    };

    loadEntries();

    const handleStorageChange = () => {
      loadEntries();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("calorieEntriesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("calorieEntriesUpdated", handleStorageChange);
    };
  }, [date, router]);

  const summary = getDailySummary(entries, date);

  const handleEdit = (entry: CalorieEntry) => {
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("このカロリー記録を削除しますか？")) {
      deleteCalorieEntry(id);
      window.dispatchEvent(new Event("calorieEntriesUpdated"));
      const updatedEntries = entries.filter((e) => e.id !== id);
      setEntries(updatedEntries);
    }
  };

  const handleSave = (entry: CalorieEntry) => {
    window.dispatchEvent(new Event("calorieEntriesUpdated"));
    setShowAddForm(false);
    setEditingEntry(undefined);
    // エントリを再読み込み
    const updatedEntries = getCalorieEntriesByDate(date);
    setEntries(updatedEntries);
  };

  if (!isValidDate(date)) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {formatDate(date)}
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingEntry(undefined);
            setShowAddForm(true);
          }}
        >
          カロリーを追加
        </Button>
      </div>

      <div className="mb-6">
        <CalorieSummary
          totalCalories={summary.totalCalories}
          entryCount={summary.entryCount}
          date={date}
          period="day"
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <CalorieEntryList
          entries={entries}
          date={date}
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
        title={editingEntry ? "カロリーを編集" : "カロリーを追加"}
        showCloseButton={false}
      >
        <CalorieEntryForm
          initialDate={date}
          initialEntry={editingEntry}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingEntry(undefined);
          }}
        />
      </Modal>
    </div>
  );
}

