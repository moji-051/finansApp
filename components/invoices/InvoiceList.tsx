"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pin } from "lucide-react";
import { useInvoices } from "@/context/InvoiceContext";
import InvoiceCard from "./InvoiceCard";
import InvoiceEmptyState from "./InvoiceEmptyState";

interface InvoiceListProps {
  onCreateClick: () => void;
}

export default function InvoiceList({ onCreateClick }: InvoiceListProps) {
  const { invoices, pinnedInvoices, unpinnedInvoices } = useInvoices();

  // اگر هیچ فاکتوری وجود نداشت، پیام راهنما نمایش داده میشه
  if (invoices.length === 0) {
    return <InvoiceEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-8">
      {/* بخش فاکتورهای پین‌شده */}
      {pinnedInvoices.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Pin size={16} className="text-primary-500" />
            <h2 className="text-sm font-bold text-slate-700">فاکتورهای پین‌شده</h2>
            <span className="text-xs text-slate-400">({pinnedInvoices.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {pinnedInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* بخش سایر فاکتورها */}
      {unpinnedInvoices.length > 0 && (
        <section>
          {pinnedInvoices.length > 0 && (
            <h2 className="text-sm font-bold text-slate-700 mb-4">سایر فاکتورها</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {unpinnedInvoices.map((invoice) => (
                <motion.div key={invoice.id} layout>
                  <InvoiceCard invoice={invoice} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
    </div>
  );
}