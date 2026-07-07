"use client";

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Invoice, InvoiceStatus, InvoiceItem } from "@/types/invoice";
import { useInvoices } from "@/context/InvoiceContext";

interface InvoiceFormData {
  invoiceNumber: string;
  customerName: string;
  status: InvoiceStatus;
  description?: string;
  items: InvoiceItem[];
}

export function useInvoiceActions() {
  const { addInvoice, updateInvoice, deleteInvoice, getInvoiceById } = useInvoices();
  const router = useRouter();

  // ثبت فاکتور جدید
  const createInvoice = useCallback(
    (data: InvoiceFormData) => {
      const newInvoice: Invoice = {
        id: uuidv4(),
        ...data,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addInvoice(newInvoice);
      toast.success("فاکتور با موفقیت ثبت شد");
      return newInvoice;
    },
    [addInvoice]
  );

  // ویرایش فاکتور موجود
  const editInvoice = useCallback(
    (id: string, data: InvoiceFormData) => {
      const existing = getInvoiceById(id);
      if (!existing) {
        toast.error("فاکتور مورد نظر یافت نشد");
        return;
      }

      const updated: Invoice = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      updateInvoice(updated);
      toast.success("فاکتور با موفقیت ویرایش شد");
    },
    [getInvoiceById, updateInvoice]
  );

  // حذف فاکتور و بازگشت به صفحه اصلی
  const removeInvoice = useCallback(
    (id: string) => {
      deleteInvoice(id);
      toast.success("فاکتور حذف شد");
      router.push("/");
    },
    [deleteInvoice, router]
  );

  return { createInvoice, editInvoice, removeInvoice };
}