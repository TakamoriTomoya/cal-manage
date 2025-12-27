"use client";

import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PhotoUpload from "./PhotoUpload";
import { getCategories, saveCalorieEntry } from "@/lib/storage";
import { getToday } from "@/lib/date";
import type { CalorieEntry, Category } from "@/types";

interface CalorieEntryFormProps {
  initialDate?: string;
  initialEntry?: CalorieEntry;
  onSave: (entry: CalorieEntry) => void;
  onCancel: () => void;
}

export default function CalorieEntryForm({
  initialDate,
  initialEntry,
  onSave,
  onCancel,
}: CalorieEntryFormProps) {
  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [date, setDate] = useState(initialDate || getToday());
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [memo, setMemo] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // カテゴリーを読み込み
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    // 初期値の設定
    if (initialEntry) {
      setTitle(initialEntry.title);
      setCalories(initialEntry.calories);
      setDate(initialEntry.date);
      setPhoto(initialEntry.photo);
      setCategoryId(initialEntry.categoryId);
      setMemo(initialEntry.memo || "");
    }
  }, [initialEntry]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "タイトルを入力してください";
    } else if (title.length > 100) {
      newErrors.title = "タイトルは100文字以内で入力してください";
    }

    if (calories === "" || calories === null || calories === undefined) {
      newErrors.calories = "カロリーを入力してください";
    } else if (typeof calories === "number" && calories < 0) {
      newErrors.calories = "カロリーは0以上の数値を入力してください";
    }

    if (!date) {
      newErrors.date = "日付を選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const entryData: Omit<CalorieEntry, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    } = {
      title: title.trim(),
      calories: Number(calories),
      date,
      photo,
      categoryId: categoryId || undefined,
      memo: memo.trim() || undefined,
    };

    if (initialEntry) {
      entryData.id = initialEntry.id;
    }

    const savedEntry = saveCalorieEntry(entryData);

    // ストレージ更新イベントを発火
    window.dispatchEvent(new Event("calorieEntriesUpdated"));

    onSave(savedEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        required
      />

      <div>
        <Input
          label="カロリー (kcal)"
          type="number"
          value={calories}
          onChange={(e) =>
            setCalories(e.target.value === "" ? "" : Number(e.target.value))
          }
          error={errors.calories}
          required
          min={0}
        />
      </div>

      <div>
        <Input
          label="日付"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          カテゴリー
        </label>
        <div className="relative">
          <select
            value={categoryId || ""}
            onChange={(e) =>
              setCategoryId(e.target.value || undefined)
            }
            className="w-full rounded-lg border border-input bg-background px-4 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
          >
            <option value="">カテゴリーを選択</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <PhotoUpload value={photo} onChange={setPhoto} />

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          メモ
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {initialEntry ? "更新" : "保存"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
