# Next.js App Router ベストプラクティス

## 概要

このドキュメントは、Next.js App Router を使用した開発におけるベストプラクティスをまとめたものです。公式ドキュメントに基づき、カロリー管理アプリの開発において推奨されるパターンと実装方法を記載しています。

## 目次

1. [Server Components と Client Components](#server-components-と-client-components)
2. [データフェッチング](#データフェッチング)
3. [ルーティングとレンダリング](#ルーティングとレンダリング)
4. [パフォーマンス最適化](#パフォーマンス最適化)
5. [エラーハンドリング](#エラーハンドリング)
6. [セキュリティ](#セキュリティ)
7. [型安全性](#型安全性)

---

## Server Components と Client Components

### 基本原則

**デフォルトは Server Components** - Next.js App Router では、すべてのコンポーネントがデフォルトで Server Components です。

### いつ Client Components を使うか

以下の場合に `'use client'` ディレクティブを使用します：

- ✅ **状態管理**: `useState`, `useReducer` など
- ✅ **イベントハンドラー**: `onClick`, `onChange` など
- ✅ **ライフサイクル**: `useEffect`, `useLayoutEffect` など
- ✅ **ブラウザ API**: `localStorage`, `window`, `Navigator.geolocation` など
- ✅ **カスタムフック**: クライアント側のロジックを含むフック

### いつ Server Components を使うか

以下の場合に Server Components を使用します：

- ✅ **データフェッチング**: データベースや API からのデータ取得
- ✅ **機密情報の使用**: API キー、トークンなどの秘密情報
- ✅ **JavaScript バンドルサイズの削減**: クライアントに送信する JavaScript を最小化
- ✅ **パフォーマンス向上**: FCP（First Contentful Paint）の改善

### 実装パターン

#### パターン 1: Server Component でデータを取得し、Client Component に渡す

```typescript
// app/page.tsx (Server Component)
import { getCalorieEntries } from "@/lib/storage";
import CalorieList from "@/app/components/calorie/CalorieList";

export default async function Page() {
  const entries = await getCalorieEntries();

  return <CalorieList entries={entries} />;
}
```

```typescript
// app/components/calorie/CalorieList.tsx (Client Component)
"use client";

import { useState } from "react";
import type { CalorieEntry } from "@/types";

interface CalorieListProps {
  entries: CalorieEntry[];
}

export default function CalorieList({ entries }: CalorieListProps) {
  const [filteredEntries, setFilteredEntries] = useState(entries);

  // クライアント側のインタラクティブな処理
  return <div>{/* ... */}</div>;
}
```

#### パターン 2: Client Component の境界を最小限に

大きな UI を Client Component にするのではなく、必要な部分だけを Client Component にします。

```typescript
// ❌ 悪い例: 全体を Client Component にする
'use client'

export default function Layout({ children }) {
  return (
    <nav>
      <Logo /> {/* 静的コンテンツ */}
      <Search /> {/* インタラクティブ */}
    </nav>
    <main>{children}</main>
  )
}
```

```typescript
// ✅ 良い例: 必要な部分だけを Client Component にする
// app/layout.tsx (Server Component)
import Search from './components/Search'
import Logo from './components/Logo'

export default function Layout({ children }) {
  return (
    <nav>
      <Logo /> {/* Server Component */}
      <Search /> {/* Client Component */}
    </nav>
    <main>{children}</main>
  )
}
```

#### パターン 3: Server Component を Client Component の children として渡す

```typescript
// app/components/ui/Modal.tsx (Client Component)
"use client";

interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>開く</button>
      {isOpen && <div>{children}</div>}
    </>
  );
}
```

```typescript
// app/page.tsx (Server Component)
import Modal from "./components/ui/Modal";
import CalorieEntryList from "./components/calorie/CalorieEntryList";

export default async function Page() {
  const entries = await getCalorieEntries();

  return (
    <Modal>
      <CalorieEntryList entries={entries} /> {/* Server Component */}
    </Modal>
  );
}
```

### 環境の分離

#### server-only パッケージの使用

サーバー専用のコードを誤ってクライアントにインポートしないようにします。

```typescript
// lib/storage.ts
import "server-only";

export function getCalorieEntries() {
  // このコードはサーバーでのみ実行される
  // クライアントからインポートするとビルドエラーになる
}
```

#### client-only パッケージの使用

クライアント専用のコード（`window` オブジェクトへのアクセスなど）をマークします。

```typescript
// lib/browser-utils.ts
import "client-only";

export function getLocalStorage() {
  // このコードはクライアントでのみ実行される
  return window.localStorage;
}
```

---

## データフェッチング

### Server Components でのデータフェッチング

Server Components では、以下の方法でデータを取得できます：

1. **fetch API**
2. **ORM やデータベースクライアント**
3. **ファイルシステム（Node.js API）**

#### fetch API の使用

```typescript
// app/day/[date]/page.tsx
export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  // Server Component では直接 await できる
  const entries = await getCalorieEntriesByDate(date);

  return (
    <div>
      <h1>{date} のカロリー</h1>
      <CalorieEntryList entries={entries} />
    </div>
  );
}
```

#### ローカルストレージからのデータ取得

**注意**: ローカルストレージはブラウザ API のため、Server Component では直接使用できません。

```typescript
// ❌ 悪い例: Server Component で localStorage を使用
export default async function Page() {
  const entries = localStorage.getItem("calorie_entries"); // エラー！
}

// ✅ 良い例: Client Component で localStorage を使用
("use client");

export default function Page() {
  const [entries, setEntries] = useState<CalorieEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("calorie_entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

  return <CalorieEntryList entries={entries} />;
}
```

**推奨パターン**: カロリー管理アプリでは、ローカルストレージを使用するため、データ取得は Client Component で行います。

### Client Components でのデータフェッチング

#### React の `use` フックを使用したストリーミング

```typescript
// app/page.tsx (Server Component)
import { Suspense } from "react";
import CalorieEntries from "./components/CalorieEntries";

export default function Page() {
  // await せずに Promise を渡す
  const entriesPromise = getCalorieEntries();

  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <CalorieEntries entriesPromise={entriesPromise} />
    </Suspense>
  );
}
```

```typescript
// app/components/CalorieEntries.tsx (Client Component)
"use client";

import { use } from "react";

interface CalorieEntriesProps {
  entriesPromise: Promise<CalorieEntry[]>;
}

export default function CalorieEntries({
  entriesPromise,
}: CalorieEntriesProps) {
  const entries = use(entriesPromise);

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>{entry.title}</li>
      ))}
    </ul>
  );
}
```

### リクエストの重複排除とキャッシュ

#### fetch の自動重複排除

同じ URL とオプションの `fetch` リクエストは自動的に重複排除されます。

```typescript
// これらのリクエストは1つにまとめられる
const data1 = fetch("https://api.example.com/data");
const data2 = fetch("https://api.example.com/data");
```

#### React の `cache` 関数を使用

`fetch` を使用しない場合（ORM やデータベースクライアントなど）は、`cache` 関数でラップします。

```typescript
import { cache } from "react";
import { getCalorieEntries } from "@/lib/storage";

export const getCachedCalorieEntries = cache(async (date: string) => {
  return await getCalorieEntries(date);
});
```

### 並列データフェッチング

複数のデータリクエストを並列で実行します。

```typescript
// ❌ 悪い例: 順次実行
export default async function Page({ params }) {
  const { date } = await params;
  const entries = await getCalorieEntries(date); // 1つ目
  const categories = await getCategories(); // 2つ目（1つ目が終わるまで待つ）

  return <div>...</div>;
}

// ✅ 良い例: 並列実行
export default async function Page({ params }) {
  const { date } = await params;

  // 両方のリクエストを同時に開始
  const entriesPromise = getCalorieEntries(date);
  const categoriesPromise = getCategories();

  // 両方の結果を待つ
  const [entries, categories] = await Promise.all([
    entriesPromise,
    categoriesPromise,
  ]);

  return <div>...</div>;
}
```

### ストリーミング

#### loading.js を使用

ページ全体をストリーミングする場合、`loading.js` ファイルを作成します。

```typescript
// app/day/[date]/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>;
}
```

#### Suspense を使用

より細かい粒度でストリーミングする場合、`<Suspense>` を使用します。

```typescript
import { Suspense } from "react";
import CalorieEntryList from "./components/CalorieEntryList";
import CalorieSummary from "./components/CalorieSummary";

export default function Page() {
  return (
    <div>
      <header>
        <h1>カロリー管理</h1>
      </header>
      <main>
        {/* この部分は即座に表示される */}
        <Suspense fallback={<div>サマリー読み込み中...</div>}>
          <CalorieSummary />
        </Suspense>
        <Suspense fallback={<div>エントリ読み込み中...</div>}>
          <CalorieEntryList />
        </Suspense>
      </main>
    </div>
  );
}
```

---

## ルーティングとレンダリング

### Layouts の使用

共通の UI を共有するために Layouts を使用します。

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header>
          <nav>{/* ナビゲーション */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* フッター */}</footer>
      </body>
    </html>
  );
}
```

### Link コンポーネントの使用

クライアント側のナビゲーションとプリフェッチのために `<Link>` を使用します。

```typescript
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">ホーム</Link>
      <Link href="/add">追加</Link>
      <Link href="/saved">登録済み</Link>
    </nav>
  );
}
```

### 動的ルート

```typescript
// app/day/[date]/page.tsx
export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  // params は Promise なので await が必要
  return <div>{date} のページ</div>;
}
```

---

## パフォーマンス最適化

### 自動最適化

Next.js は以下の最適化を自動的に行います：

- ✅ **Server Components**: デフォルトで Server Components を使用
- ✅ **コード分割**: ルートセグメントごとに自動的にコード分割
- ✅ **プリフェッチ**: リンクがビューポートに入ると自動的にプリフェッチ
- ✅ **静的レンダリング**: 可能な限り静的レンダリング
- ✅ **キャッシング**: データリクエスト、レンダリング結果、静的アセットをキャッシュ

### クライアントバンドルサイズの削減

- Client Component の境界を最小限に保つ
- 必要な部分だけを `'use client'` でマーク
- 大きなライブラリは動的インポートを使用

```typescript
// 動的インポートの例
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>読み込み中...</p>,
});
```

### 画像の最適化

`next/image` コンポーネントを使用します。

```typescript
import Image from "next/image";

export default function PhotoUpload({ photo }: { photo: string }) {
  return (
    <Image src={photo} alt="カロリーエントリの写真" width={400} height={300} />
  );
}
```

---

## エラーハンドリング

### error.tsx の使用

ルートセグメントごとにエラーハンドリングを追加します。

```typescript
// app/day/[date]/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  );
}
```

### not-found.tsx の使用

404 エラーを処理します。

```typescript
// app/day/[date]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>ページが見つかりません</h2>
      <p>指定された日付のデータは存在しません。</p>
    </div>
  );
}
```

### グローバルエラーハンドリング

```typescript
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>アプリケーションエラー</h2>
        <button onClick={() => reset()}>再試行</button>
      </body>
    </html>
  );
}
```

---

## セキュリティ

### Server Actions の使用

フォーム送信やデータ更新には Server Actions を使用します。

```typescript
// app/actions/calorie.ts
"use server";

import { saveCalorieEntry } from "@/lib/storage";
import { revalidatePath } from "next/cache";

export async function createCalorieEntry(formData: FormData) {
  const title = formData.get("title") as string;
  const calories = Number(formData.get("calories"));

  // バリデーション
  if (!title || calories < 0) {
    throw new Error("無効なデータです");
  }

  await saveCalorieEntry({ title, calories });
  revalidatePath("/");
}
```

```typescript
// app/components/CalorieEntryForm.tsx
"use client";

import { createCalorieEntry } from "@/app/actions/calorie";

export default function CalorieEntryForm() {
  return (
    <form action={createCalorieEntry}>
      <input name="title" type="text" />
      <input name="calories" type="number" />
      <button type="submit">保存</button>
    </form>
  );
}
```

### 環境変数

- 機密情報は `NEXT_PUBLIC_` プレフィックスを付けない
- `.env.local` を `.gitignore` に追加

```bash
# .env.local
DATABASE_URL=secret_database_url
NEXT_PUBLIC_APP_NAME=カロリー管理アプリ
```

---

## 型安全性

### TypeScript の使用

すべてのコンポーネントと関数に型を付けます。

```typescript
// types/index.ts
export interface CalorieEntry {
  id: string;
  title: string;
  calories: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

### 動的パラメータの型

```typescript
// app/day/[date]/page.tsx
export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  // ...
}
```

---

## カロリー管理アプリでの適用例

### 推奨されるコンポーネント構成

1. **Server Components**:

   - `app/page.tsx` - カレンダーページ（データ取得）
   - `app/day/[date]/page.tsx` - 日別詳細ページ（データ取得）
   - `app/layout.tsx` - ルートレイアウト

2. **Client Components**:

   - `app/components/calorie/CalorieEntryForm.tsx` - フォーム（状態管理）
   - `app/components/calendar/Calendar.tsx` - カレンダー（インタラクション）
   - `app/components/ui/Modal.tsx` - モーダル（状態管理）

3. **データ取得**:
   - ローカルストレージを使用するため、Client Component で `useEffect` を使用
   - 将来的にデータベースに移行する場合は、Server Components でデータ取得

### 実装時の注意点

- ローカルストレージはブラウザ API のため、Client Component でのみ使用可能
- データ取得は `useEffect` で行う
- Server Actions は将来的なデータベース移行を考慮して設計
- 型定義を必ず使用する

---

## 参考リンク

- [Next.js 公式ドキュメント - Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js 公式ドキュメント - Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js 公式ドキュメント - Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
