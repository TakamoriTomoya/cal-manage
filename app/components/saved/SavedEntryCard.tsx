"use client";

import Image from "next/image";
import Card from "../ui/Card";
import Button from "../ui/Button";
import type { SavedCalorieEntry } from "@/types";
import { getCategoryById } from "@/lib/storage";

interface SavedEntryCardProps {
  entry: SavedCalorieEntry;
  onSelect?: (entry: SavedCalorieEntry) => void;
  onEdit?: (entry: SavedCalorieEntry) => void;
  onDelete?: (id: string) => void;
}

export default function SavedEntryCard({
  entry,
  onSelect,
  onEdit,
  onDelete,
}: SavedEntryCardProps) {
  const category = entry.categoryId
    ? getCategoryById(entry.categoryId)
    : undefined;

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect?.(entry)}
    >
      <div className="flex gap-4">
        {entry.photo && (
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={entry.photo}
              alt={entry.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
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
          <p className="mt-2 text-xl font-bold text-blue-600">
            {entry.calories} kcal
          </p>
          {entry.memo && (
            <p className="mt-1 text-sm text-gray-600">{entry.memo}</p>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-4 flex gap-2">
          {onSelect && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(entry);
              }}
            >
              選択
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(entry);
              }}
            >
              編集
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry.id);
              }}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

