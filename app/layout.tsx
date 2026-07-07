import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { InvoiceProvider } from "@/context/InvoiceContext";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";

// فونت Vazirmatn از گوگل فونت لود میشه و به یک متغیر CSS تبدیل میشه
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  display: "swap", // (Display Swap) یعنی تا فونت لود بشه، از فونت پیش‌فرض سیستم استفاده میشه تا صفحه سفید نمونه
});

export const metadata: Metadata = {
  title: "پلتفرم مدیریت مالی شرکت",
  description: "سیستم مدیریت فاکتورهای مالی شرکت",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-vazir antialiased bg-surface-soft`}>
        {/* UserProvider و InvoiceProvider کل برنامه رو در بر می‌گیرن تا همه‌جا در دسترس باشن */}
        <UserProvider>
          <InvoiceProvider>
            {children}
            {/* Toaster یعنی جایی که پیام‌های موفقیت/خطا (Toast) نمایش داده میشن */}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-vazir)",
                  direction: "rtl",
                },
              }}
            />
          </InvoiceProvider>
        </UserProvider>
      </body>
    </html>
  );
}