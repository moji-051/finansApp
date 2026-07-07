"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Pin, PinOff, Edit3, User, Calendar, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { Invoice } from "@/types/invoice";
import { formatInvoiceDate } from "@/lib/dateUtils";
import { calculateInvoiceTotal } from "@/lib/invoiceUtils";
import { INVOICE_STATUS_CONFIG, MAX_PREVIEW_ITEMS } from "@/constants";
import { useInvoices } from "@/context/InvoiceContext";

interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const router = useRouter();
  const { togglePin } = useInvoices();

  // حالا از تابع مشترک calculateInvoiceTotal استفاده می‌کنیم تا با فرم و فایل چاپی هماهنگ باشه
  const totalAmount = useMemo(() => calculateInvoiceTotal(invoice.items), [invoice.items]);

  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status];

  const handleOpenInvoice = useCallback(() => {
    router.push(`/invoice/${invoice.id}`);
  }, [router, invoice.id]);

  const handleTogglePin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      togglePin(invoice.id);
    },
    [togglePin, invoice.id]
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={handleOpenInvoice}
      className={`
        relative bg-white rounded-2xl border p-5 cursor-pointer
        hover:shadow-lg hover:shadow-slate-200/60 transition-shadow duration-300
        ${invoice.isPinned ? "border-primary-300 ring-1 ring-primary-100" : "border-surface-border"}
      `}
    >
      {invoice.isPinned && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full p-1.5 shadow-md">
          <Pin size={12} fill="white" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            <Receipt size={18} className="text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{invoice.invoiceNumber}</p>
            <span
              className="text-[11px] px-2 py-0.5 rounded-md font-medium"
              style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded-lg transition-colors ${
              invoice.isPinned
                ? "text-primary-600 hover:bg-primary-50"
                : "text-slate-400 hover:bg-slate-100"
            }`}
            aria-label={invoice.isPinned ? "برداشتن پین" : "پین کردن"}
          >
            {invoice.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>

          <button
            onClick={handleOpenInvoice}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition-colors"
            aria-label="ویرایش فاکتور"
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-2">
        <User size={14} className="text-slate-400" />
        <span>{invoice.customerName}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <Calendar size={13} />
        <span>{formatInvoiceDate(invoice.createdAt)}</span>
      </div>

      {invoice.items.length > 0 && (
        <div className="border-t border-dashed border-slate-200 pt-3 mb-3">
          {invoice.items.slice(0, MAX_PREVIEW_ITEMS).map((item) => (
            <div key={item.id} className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{item.title}</span>
              <span>{item.quantity} عدد</span>
            </div>
          ))}
          {invoice.items.length > MAX_PREVIEW_ITEMS && (
            <span className="text-xs text-primary-500">
              + {invoice.items.length - MAX_PREVIEW_ITEMS} مورد دیگر
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">مبلغ کل</span>
        <span
          className={`text-base font-bold ${totalAmount < 0 ? "text-red-600" : "text-slate-800"}`}
        >
          {totalAmount.toLocaleString("fa-IR")} تومان
        </span>
      </div>
    </motion.div>
  );
}