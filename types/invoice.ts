// نوع عملیات هر قلم فاکتور
// sale (فروش) و addition (اضافه) → به مبلغ اضافه می‌شوند
// purchase (خرید) و deduction (کسر) → از مبلغ کم می‌شوند
export type ItemOperationType = "sale" | "purchase" | "deduction" | "addition";

export interface InvoiceItem {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  operationType: ItemOperationType;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  description?: string;
  status: InvoiceStatus;
}

export type InvoiceStatus = "paid" | "pending" | "cancelled";

export interface UserInfo {
  nameFa: string;
  nameEn: string;
}

export type InvoiceAction =
  | { type: "HYDRATE"; payload: Invoice[] }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "DELETE_INVOICE"; payload: string }
  | { type: "TOGGLE_PIN"; payload: string };

export interface InvoiceState {
  invoices: Invoice[];
  isHydrated: boolean;
}