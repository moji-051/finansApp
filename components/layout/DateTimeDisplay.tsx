"use client";

import { Clock, Globe } from "lucide-react";
import { useDateTime } from "@/hooks/useDateTime";

export default function DateTimeDisplay() {
  const { iranTime, worldTime, isReady } = useDateTime();

  // تا زمانی که سمت کلاینت آماده نشده (برای جلوگیری از خطای Hydration)، اسکلت (Skeleton) نشون بده
  if (!isReady || !iranTime || !worldTime) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5 text-xs text-slate-700">
      {/* ساعت ایران */}
      <div className="flex items-center gap-1.5">
        <Clock size={14} className="text-primary-500" />
        <span className="font-bold text-lg text-slate-700">{iranTime.time}</span>
        <span className="hidden md:inline">{iranTime.fullDate}</span>
        <span className="font-bold text-lg bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-md">
          ایران
        </span>
      </div>

      <div className="w-px h-4 bg-slate-200" />

      {/* ساعت جهانی */}
      <div className="flex items-center gap-1.5">
        <Globe size={14} className="text-slate-600" />
        <span className="text-lg text-slate-900">{worldTime.time}</span>
        <span className="hidden md:inline">{worldTime.fullDate}</span>
        <span className="text-[15px] font-bold bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded-md">
          UTC
        </span>
      </div>
    </div>
  );
}