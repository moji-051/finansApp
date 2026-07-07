import { InvoiceItem, ItemOperationType } from "@/types/invoice";

// نوع‌هایی که مبلغشون به فاکتور اضافه می‌شه
const ADDING_TYPES: ItemOperationType[] = ["sale", "addition"];

/**
 * نوع عملیات یک قلم را برمی‌گرداند و سازگاری با داده‌های قدیمی را تضمین می‌کند
 * - اگر نوع مشخص نبود (فاکتورهای خیلی قدیمی) → "فروش" در نظر گرفته می‌شود
 * - اگر نوع قدیمی "expense" بود (نسخه قبلی برنامه) → به "کسر" تبدیل می‌شود، چون هر دو از مبلغ کم می‌کنند
 */
export function resolveOperationType(rawType: string | undefined | null): ItemOperationType {
  if (!rawType) return "sale";
  if (rawType === "expense") return "deduction"; // سازگاری با نسخه قبلی برنامه
  return rawType as ItemOperationType;
}

/**
 * مبلغ یک قلم را با علامت مثبت یا منفی برمی‌گرداند
 */
export function getItemSignedAmount(item: InvoiceItem): number {
  const rawAmount = item.quantity * item.unitPrice;
  const operationType = resolveOperationType(item.operationType);
  return ADDING_TYPES.includes(operationType) ? rawAmount : -rawAmount;
}

/**
 * محاسبه مبلغ نهایی فاکتور با در نظر گرفتن نوع عملیات هر قلم
 */
export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + getItemSignedAmount(item), 0);
}

/**
 * اطمینان از اینکه اقلام فاکتورهای قدیمی، وقتی در فرم باز می‌شوند، نوع معتبر و به‌روزی داشته باشند
 */
export function normalizeInvoiceItems(items: InvoiceItem[]): InvoiceItem[] {
  return items.map((item) => ({
    ...item,
    operationType: resolveOperationType(item.operationType),
  }));
}