import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "旅ルート最適化 - 90秒で旅の順番が決まる",
  description: "行きたい場所を入れると、最適な訪問順序と距離を瞬時に提示します",
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
