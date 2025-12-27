"use client";

import { useRef, useState } from "react";
import Image from "next/image";

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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        写真
      </label>
      <div className="space-y-2">
        {value ? (
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-300">
              <Image
                src={value}
                alt="アップロードされた写真"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 text-sm text-red-600 hover:text-red-700"
            >
              写真を削除
            </button>
          </div>
        ) : (
          <div
            className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <p className="mt-2 text-sm text-gray-600">
                クリックして写真を選択
              </p>
              <p className="text-xs text-gray-500">
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
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

