"use client";

import { useState, useEffect, useMemo } from "react";
import { getIranDateTime, getWorldDateTime } from "@/lib/dateUtils";

/**
 * هوک نمایش تاریخ و ساعت زنده (Real-time) برای ایران و جهان
 * هر ثانیه به‌صورت خودکار به‌روزرسانی می‌شه
 */
export function useDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date()); // مقدار اولیه فقط سمت کلاینت ست میشه (جلوگیری از خطای Hydration)

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // با useMemo از محاسبه اضافی جلوگیری می‌کنیم؛ فقط وقتی "now" تغییر کنه دوباره محاسبه می‌شه
  const iranTime = useMemo(() => (now ? getIranDateTime(now) : null), [now]);
  const worldTime = useMemo(() => (now ? getWorldDateTime(now) : null), [now]);

  return { iranTime, worldTime, isReady: now !== null };
}