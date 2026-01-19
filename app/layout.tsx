import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "五险一金计算器",
  description: "计算公司为员工缴纳的五险一金费用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-white border-t mt-8 py-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© 2024 五险一金计算器 - 仅供演示使用</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
