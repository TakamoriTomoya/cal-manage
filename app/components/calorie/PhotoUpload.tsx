"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Button from "../ui/Button";

interface PhotoUploadProps {
  value?: string; // Base64データ
  onChange: (base64: string | undefined) => void;
  maxSize?: number; // 最大サイズ（バイト）
}

export default function PhotoUpload({
  value,
  onChange,
  maxSize = 5 * 1024 * 1024, // デフォルト5MB
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // ファイルサイズチェック
    if (file.size > maxSize) {
      setError(`ファイルサイズが大きすぎます（最大${maxSize / 1024 / 1024}MB）`);
      return;
    }

    // 画像ファイルかチェック
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }

    // Base64に変換
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChange(base64);
    };
    reader.onerror = () => {
      setError("ファイルの読み込みに失敗しました");
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-foreground">
        写真
      </label>
      <div className="space-y-2">
        {value ? (
          <div className="relative group">
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={value}
                alt="アップロードされた写真"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleRemove}
                className="shadow-lg"
              >
                削除
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-input bg-secondary/30 transition-colors hover:border-primary/50 hover:bg-primary/5"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-10 w-10 text-muted-foreground"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-foreground">
                クリックして写真を選択
              </p>
              <p className="text-xs text-muted-foreground">
                またはドラッグ&ドロップ
              </p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    </div>
  );
}
