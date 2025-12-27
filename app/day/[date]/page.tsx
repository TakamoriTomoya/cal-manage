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
    <div className="w-full max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {formatDate(date)}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            日々のカロリー詳細
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
            className="shadow-xl shadow-primary/20"
          >
            記録を追加
          </Button>
        </div>
      </div>

      <CalorieSummary
        totalCalories={summary.totalCalories}
        entryCount={summary.entryCount}
        date={date}
        period="day"
      />

      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span className="h-6 w-1 rounded-full bg-primary block"></span>
          記録一覧
        </h2>
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm">
          <CalorieEntryList
            entries={entries}
            date={date}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingEntry(undefined);
        }}
        title={editingEntry ? "記録を編集" : "記録を追加"}
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
