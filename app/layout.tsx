import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "寄り道プランナー - 移動のついでが旅のハイライトに",
  description: "出発地と目的地の間で、効率的かつ魅力的な寄り道を自動提案するWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
