"use client";

import Image from "next/image";
import Card from "../ui/Card";
import type { CalorieEntry } from "@/types";
import { getCategoryById } from "@/lib/storage";
import { formatDate } from "@/lib/date";

interface CalorieEntryCardProps {
  entry: CalorieEntry;
  onEdit?: (entry: CalorieEntry) => void;
  onDelete?: (id: string) => void;
}

export default function CalorieEntryCard({
  entry,
  onEdit,
  onDelete,
}: CalorieEntryCardProps) {
  const category = entry.categoryId
    ? getCategoryById(entry.categoryId)
    : undefined;

  return (
    <Card className="relative">
      <div className="flex gap-4">
        {entry.photo && (
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={entry.photo}
              alt={entry.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {entry.title}
              </h3>
              {category && (
                <span
                  className="mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: category.color || "#6B7280" }}
                >
                  {category.name}
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">
                {entry.calories} kcal
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(entry.date)}
              </p>
            </div>
          </div>
          {entry.memo && (
            <p className="mt-2 text-sm text-gray-600">{entry.memo}</p>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(entry)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              編集
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              削除
            </button>
          )}
        </div>
      )}
    </Card>
  );
}

