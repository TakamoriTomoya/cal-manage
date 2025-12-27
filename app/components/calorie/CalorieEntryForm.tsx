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
        <label className="mb-2 block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <select
          value={categoryId || ""}
          onChange={(e) =>
            setCategoryId(e.target.value || undefined)
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">カテゴリーを選択</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <PhotoUpload value={photo} onChange={setPhoto} />

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          メモ
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
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

