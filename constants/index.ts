import { ItemOperationType } from "@/types/invoice";

export const STORAGE_KEYS = {
  INVOICES: "company-finance-invoices",
  USER_INFO: "company-finance-user-info",
} as const;

export const INVOICE_STATUS_CONFIG = {
  paid: { label: "پرداخت شده", color: "#16a34a", bg: "#dcfce7" },
  pending: { label: "در انتظار پرداخت", color: "#d97706", bg: "#fef3c7" },
  cancelled: { label: "لغو شده", color: "#dc2626", bg: "#fee2e2" },
} as const;

// تایپ جداگانه برای تنظیمات هر نوع عملیات - جدا کردنش از خود Record باعث میشه parser مشکلی با خواندنش نداشته باشه
type OperationTypeConfigItem = {
  label: string;
  description: string;
  color: string;
  bg: string;
};

// تنظیمات نمایشی هر نوع عملیات قلم فاکتور
export const OPERATION_TYPE_CONFIG: Record<ItemOperationType, OperationTypeConfigItem> = {
  sale: {
    label: "فروش",
    description: "مبلغ این قلم به فاکتور نهایی اضافه می‌شود",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  purchase: {
    label: "خرید",
    description: "مبلغ این قلم از فاکتور نهایی کم می‌شود",
    color: "#dc2626",
    bg: "#fee2e2",
  },
  expense: {
    label: "هزینه اضافی",
    description: "مبلغ این قلم از فاکتور نهایی کم می‌شود",
    color: "#d97706",
    bg: "#fef3c7",
  },
};

export const WORLD_TIME_API = "https://timeapi.io/api/time/current/zone";
export const IRAN_TIMEZONE = "Asia/Tehran";
export const MAX_PREVIEW_ITEMS = 3;