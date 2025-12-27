"use client";

import { getCategories } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { Category } from "@/types";

interface CategorySelectProps {
  value?: string;
  onChange: (categoryId: string | undefined) => void;
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">カテゴリーを選択</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

