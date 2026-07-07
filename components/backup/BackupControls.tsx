"use client";

import { useRef, useCallback, useState } from "react";
import { Download, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { exportBackup, importBackup } from "@/lib/storageUtils";

export default function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = useCallback(() => {
    try {
      exportBackup();
      toast.success("فایل بکاپ با موفقیت دانلود شد");
    } catch (error) {
      console.error("خطا در بکاپ‌گیری:", error);
      toast.error("مشکلی در گرفتن بکاپ پیش آمد");
    }
  }, []);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        await importBackup(file);
        toast.success("اطلاعات با موفقیت بازیابی شد، صفحه رفرش می‌شود...");
        // چون داده‌ها مستقیم در localStorage تغییر کردن، برای بارگذاری مجدد در Context نیاز به رفرش داریم
        setTimeout(() => window.location.reload(), 1200);
      } catch (error) {
        console.error("خطا در بازیابی فایل:", error);
        toast.error("فایل بکاپ نامعتبر است");
      } finally {
        setIsImporting(false);
        e.target.value = ""; // ریست کردن اینپوت فایل
      }
    },
    []
  );

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleExport} variant="secondary" icon={Download} size="md">
        دریافت بکاپ
      </Button>
      <Button
        onClick={handleImportClick}
        variant="ghost"
        icon={Upload}
        size="md"
        isLoading={isImporting}
      >
        بازیابی بکاپ
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}