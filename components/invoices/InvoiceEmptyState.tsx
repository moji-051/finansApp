"use client";

import { FileX2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface InvoiceEmptyStateProps {
  onCreateClick: () => void;
}

export default function InvoiceEmptyState({ onCreateClick }: InvoiceEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <FileX2 size={36} className="text-primary-900" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        هنوز هیچ فاکتوری ثبت نشده است
      </h3>
      <p className="text-sm text-slate-900 mb-6 max-w-sm">
        برای شروع مدیریت مالی شرکت خود، جهت ثبت فاکتور جدید دکمه ثبت را بزنید
      </p>
      <Button onClick={onCreateClick} icon={Plus} size="lg">
        ثبت فاکتور جدید
      </Button>
    </motion.div>
  );
}