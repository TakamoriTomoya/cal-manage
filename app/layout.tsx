import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "カロリー管理アプリ",
  description: "日々のカロリーを管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-50">
          <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    カロリー管理
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    カレンダー
                  </Link>
                  <Link
                    href="/add"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    追加
                  </Link>
                  <Link
                    href="/saved"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    登録済み
                  </Link>
                </div>
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
