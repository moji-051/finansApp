// تایپ هر آیتم داخل فاکتور (Item)
// نوع عملیات هر قلم: فروش (مبلغ اضافه میشه) | خرید (مبلغ کم میشه) | هزینه اضافی (مبلغ کم میشه)
export type ItemOperationType = "sale" | "purchase" | "expense";

export interface InvoiceItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  operationType: ItemOperationType;
}

// تایپ اصلی فاکتور
export interface Invoice {
  id: string;
  invoiceNumber: string; // شماره فاکتور
  customerName: string; // نام مشتری
  items: InvoiceItem[]; // لیست اقلام
  createdAt: string; // تاریخ ایجاد (ISO String)
  updatedAt: string; // تاریخ آخرین ویرایش
  isPinned: boolean; // پین شده یا نه
  description?: string; // توضیحات اختیاری
  status: InvoiceStatus; // وضعیت فاکتور
}

// وضعیت‌های ممکن فاکتور
export type InvoiceStatus = "paid" | "pending" | "cancelled";

// تایپ اطلاعات کاربر (هدر بالای صفحه)
export interface UserInfo {
  nameFa: string; // نام فارسی (سمت راست)
  nameEn: string; // نام انگلیسی (سمت چپ)
}

// Action های Reducer برای مدیریت فاکتورها
export type InvoiceAction =
  | { type: "SET_INVOICES"; payload: Invoice[] }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "DELETE_INVOICE"; payload: string }
  | { type: "TOGGLE_PIN"; payload: string };

// تایپ State مدیریت فاکتورها
export interface InvoiceState {
  invoices: Invoice[];
}