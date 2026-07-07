import { InvoiceItem, ItemOperationType } from "@/types/invoice";

/**
 * مبلغ یک قلم را با علامت مثبت یا منفی برمی‌گرداند (فروش: مثبت / خرید و هزینه: منفی)
 * نکته: اگر operationType موجود نباشد (فاکتورهای قدیمی)، پیش‌فرض "فروش" در نظر گرفته می‌شود
 */
export function getItemSignedAmount(item: InvoiceItem): number {
  const rawAmount = item.quantity * item.unitPrice;
  const operationType: ItemOperationType = item.operationType ?? "sale";
  return operationType === "sale" ? rawAmount : -rawAmount;
}

/**
 * محاسبه مبلغ نهایی فاکتور با در نظر گرفتن نوع عملیات هر قلم
 */
export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + getItemSignedAmount(item), 0);
}

/**
 * اطمینان از اینکه اقلام فاکتورهای قدیمی (بدون operationType)، وقتی در فرم باز می‌شوند، مقدار پیش‌فرض "فروش" بگیرند
 */
export function normalizeInvoiceItems(items: InvoiceItem[]): InvoiceItem[] {
  return items.map((item) => ({
    ...item,
    operationType: item.operationType ?? "sale",
  }));
}