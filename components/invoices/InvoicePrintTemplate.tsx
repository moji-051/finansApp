"use client";

import { forwardRef, useMemo } from "react";
import { Invoice } from "@/types/invoice";
import { formatInvoiceDate } from "@/lib/dateUtils";
import { calculateInvoiceTotal, getItemSignedAmount } from "@/lib/invoiceUtils";
import { INVOICE_STATUS_CONFIG, OPERATION_TYPE_CONFIG } from "@/constants";

interface InvoicePrintTemplateProps {
  invoice: Invoice;
}

const InvoicePrintTemplate = forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
  ({ invoice }, ref) => {
    const totalAmount = useMemo(() => calculateInvoiceTotal(invoice.items), [invoice.items]);
    const statusConfig = INVOICE_STATUS_CONFIG[invoice.status];

    return (
      <div style={{ position: "fixed", top: 0, left: "-9999px", zIndex: -1 }} aria-hidden="true">
        <div
          ref={ref}
          dir="rtl"
          style={{
            width: "800px",
            padding: "40px",
            backgroundColor: "#ffffff",
            fontFamily: "Vazirmatn, sans-serif",
            color: "#1e293b",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "3px solid #3b82f6",
              paddingBottom: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0, color: "#1e293b" }}>
                فاکتور فروش
              </h1>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0" }}>
                شماره: {invoice.invoiceNumber}
              </p>
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "bold",
                color: statusConfig.color,
                backgroundColor: statusConfig.bg,
              }}
            >
              {statusConfig.label}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "13px" }}>
            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px" }}>نام مشتری</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>{invoice.customerName}</p>
            </div>
            <div>
              <p style={{ color: "#94a3b8", margin: "0 0 4px" }}>تاریخ صدور</p>
              <p style={{ fontWeight: "bold", margin: 0 }}>{formatInvoiceDate(invoice.createdAt)}</p>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "24px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f1f5f9" }}>
                <th style={{ padding: "10px", textAlign: "right", borderBottom: "2px solid #e2e8f0" }}>
                  عنوان کالا/خدمات
                </th>
                <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                  نوع
                </th>
                <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                  تعداد
                </th>
                <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #e2e8f0" }}>
                  قیمت واحد
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #e2e8f0" }}>
                  مبلغ
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => {
                const operationType = item.operationType ?? "sale";
                const opConfig = OPERATION_TYPE_CONFIG[operationType];
                const signedAmount = getItemSignedAmount(item);

                return (
                  <tr key={item.id}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #f1f5f9" }}>{item.title}</td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        borderBottom: "1px solid #f1f5f9",
                        color: opConfig.color,
                        fontWeight: "bold",
                      }}
                    >
                      {opConfig.label}
                    </td>
                    <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
                      {item.unitPrice.toLocaleString("fa-IR")}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "left",
                        borderBottom: "1px solid #f1f5f9",
                        color: signedAmount < 0 ? "#dc2626" : "#16a34a",
                        fontWeight: "bold",
                      }}
                    >
                      {signedAmount < 0 ? "-" : ""}
                      {Math.abs(signedAmount).toLocaleString("fa-IR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
            <div style={{ width: "260px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  backgroundColor: totalAmount < 0 ? "#fee2e2" : "#eff6ff",
                  borderRadius: "10px",
                }}
              >
                <span style={{ fontWeight: "bold", color: totalAmount < 0 ? "#dc2626" : "#1d4ed8" }}>
                  مبلغ نهایی
                </span>
                <span style={{ fontWeight: "bold", color: totalAmount < 0 ? "#dc2626" : "#1d4ed8" }}>
                  {totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          </div>

          {invoice.description && (
            <div style={{ fontSize: "12px", color: "#64748b", borderTop: "1px dashed #e2e8f0", paddingTop: "14px" }}>
              <p style={{ margin: "0 0 4px", fontWeight: "bold" }}>توضیحات:</p>
              <p style={{ margin: 0 }}>{invoice.description}</p>
            </div>
          )}

          <div style={{ marginTop: "30px", textAlign: "center", fontSize: "11px", color: "#94a3b8" }}>
            این فاکتور به‌صورت الکترونیکی توسط پلتفرم مدیریت مالی شرکت صادر شده است
          </div>
        </div>
      </div>
    );
  }
);

InvoicePrintTemplate.displayName = "InvoicePrintTemplate";
export default InvoicePrintTemplate;