import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 学习小组",
  description: "AI 学习小团队内部管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Sidebar />
        <div className="ml-60">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
