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
  title: "CalManager - Smart Calorie Tracking",
  description: "日々のカロリーをスマートに管理するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60 transition-all duration-300">
            <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 lg:px-8">
              <div className="flex items-center gap-10">
                <Link href="/" className="group flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
                     <span className="text-xl font-bold">C</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    CalManager
                  </span>
                </Link>
                
                <div className="hidden md:flex md:items-center md:gap-8">
                  <Link
                    href="/"
                    className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    ダッシュボード
                  </Link>
                  <Link
                    href="/saved"
                    className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                  >
                    登録済みアイテム
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  href="/add"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  記録する
                </Link>
              </div>
            </nav>
          </header>
          
          <main className="flex-1 w-full mx-auto max-w-6xl px-6 py-10 lg:px-8 animate-in fade-in duration-500">
            {children}
          </main>
          
          <footer className="border-t border-border/40 bg-card/50 py-10 mt-auto">
            <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} CalManager. Designed for better health.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
