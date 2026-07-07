"use client";

import { useRef, useState, useCallback } from "react";
import { Printer } from "lucide-react";
import toast from "react-hot-toast";
import { Invoice } from "@/types/invoice";
import { generatePDFFromElement } from "@/lib/pdfGenerator";
import Button from "@/components/ui/Button";
import InvoicePrintTemplate from "./InvoicePrintTemplate";

interface InvoicePrintButtonProps {
  invoice: Invoice;
}

export default function InvoicePrintButton({ invoice }: InvoicePrintButtonProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    if (!printRef.current) return;

    setIsGenerating(true);
    try {
      await generatePDFFromElement(printRef.current, `فاکتور-${invoice.invoiceNumber}`);
      toast.success("فایل PDF با موفقیت دانلود شد");
    } catch (error) {
      console.error("خطا در ساخت PDF:", error);
      toast.error("مشکلی در ساخت فایل PDF پیش آمد");
    } finally {
      setIsGenerating(false);
    }
  }, [invoice.invoiceNumber]);

  return (
    <>
      <Button
        onClick={handleDownloadPDF}
        variant="secondary"
        icon={Printer}
        isLoading={isGenerating}
      >
        دریافت فایل چاپی
      </Button>

      {/* قالب مخفی که در پس‌زمینه برای گرفتن عکس آماده است */}
      <InvoicePrintTemplate ref={printRef} invoice={invoice} />
    </>
  );
}