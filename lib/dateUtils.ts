import { IRAN_TIMEZONE } from "@/constants";

/**
 * دریافت تاریخ شمسی و ساعت به‌صورت فرمت‌شده برای منطقه زمانی ایران
 */
export function getIranDateTime(date: Date = new Date()): {
  fullDate: string;
  time: string;
} {
  const fullDate = new Intl.DateTimeFormat("fa-IR", {
    timeZone: IRAN_TIMEZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const time = new Intl.DateTimeFormat("fa-IR", {
    timeZone: IRAN_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return { fullDate, time };
}

/**
 * دریافت تاریخ و ساعت جهانی (UTC) به فرمت میلادی
 */
export function getWorldDateTime(date: Date = new Date()): {
  fullDate: string;
  time: string;
} {
  const fullDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return { fullDate, time };
}

/**
 * تبدیل تاریخ ISO به فرمت خوانا فارسی (برای نمایش تاریخ ایجاد فاکتور)
 */
export function formatInvoiceDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: IRAN_TIMEZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}