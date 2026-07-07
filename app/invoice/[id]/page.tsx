"use client";

import { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Pin, PinOff, Trash2, AlertCircle } from "lucide-react";
import { useInvoices } from "@/context/InvoiceContext";
import { useInvoiceActions } from "@/hooks/useInvoiceActions";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePrintButton from "@/components/invoices/InvoicePrintButton";

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getInvoiceById, togglePin, isHydrated } = useInvoices();
  const { removeInvoice } = useInvoiceActions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const invoice = getInvoiceById(params.id);

  const handleBack = useCallback(() => router.push("/"), [router]);
  const handleTogglePin = useCallback(() => {
    if (invoice) togglePin(invoice.id);
  }, [togglePin, invoice]);
  const handleDelete = useCallback(() => {
    if (invoice) removeInvoice(invoice.id);
  }, [removeInvoice, invoice]);

  // تا زمانی که اطلاعات از localStorage خونده نشده (مثلاً بعد از رفرش صفحه)، منتظر می‌مونیم
  // این مرحله جلوی نمایش اشتباه "فاکتور یافت نشد" رو قبل از لود کامل داده‌ها می‌گیره
  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-surface-soft flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </main>
    );
  }

  // اگر فاکتوری با این آیدی پیدا نشد
  if (!invoice) {
    return (
      <main className="min-h-screen bg-surface-soft">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">فاکتور مورد نظر یافت نشد</h2>
          <p className="text-sm text-slate-500 mb-6">
            ممکن است این فاکتور حذف شده باشد یا آدرس اشتباه باشد
          </p>
          <Button onClick={handleBack} icon={ArrowRight}>
            بازگشت به لیست فاکتورها
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-soft">
      <Header />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* نوار بالای صفحه */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
          >
            <ArrowRight size={16} />
            بازگشت به لیست فاکتورها
          </button>

          <div className="flex items-center gap-2">
            <InvoicePrintButton invoice={invoice} />

            <Button
              onClick={handleTogglePin}
              variant="secondary"
              icon={invoice.isPinned ? PinOff : Pin}
              size="md"
            >
              {invoice.isPinned ? "برداشتن پین" : "پین کردن"}
            </Button>

            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              icon={Trash2}
              size="md"
            >
              حذف
            </Button>
          </div>
        </div>

        {/* تأییدیه حذف */}
        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-red-700">آیا از حذف این فاکتور مطمئن هستید؟</span>
            <div className="flex gap-2">
              <Button onClick={handleDelete} variant="danger" size="sm">
                بله، حذف شود
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="ghost" size="sm">
                انصراف
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-surface-border p-6">
          <h1 className="text-lg font-bold text-slate-800 mb-6">ویرایش فاکتور {invoice.invoiceNumber}</h1>
          <InvoiceForm existingInvoice={invoice} />
        </div>
      </div>
    </main>
  );
}