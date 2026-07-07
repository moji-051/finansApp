"use client";

import { useState, useCallback } from "react";
import { Plus,  } from "lucide-react";
import Header from "@/components/layout/Header";
import InvoiceList from "@/components/invoices/InvoiceList";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import BackupControls from "@/components/backup/BackupControls";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <main className="min-h-screen bg-surface-soft">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* نوار عنوان و دکمه‌های اصلی */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">فاکتورهای شرکت</h1>
            <p className="text-sm text-slate-500">مدیریت و پیگیری فاکتورهای مالی</p>
          </div>

          <div className="flex items-center gap-3">
            <BackupControls />
            <Button onClick={handleOpenModal} icon={Plus} size="md">
              ثبت فاکتور جدید
            </Button>
          </div>
        </div>

        <InvoiceList onCreateClick={handleOpenModal} />
      </div>

      {/* Modal ثبت فاکتور جدید */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="ثبت فاکتور جدید">
        <InvoiceForm onSuccess={handleCloseModal} />
      </Modal>
    </main>
  );
}
