"use client";

import { useCallback, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Invoice, InvoiceStatus, ItemOperationType } from "@/types/invoice";
import { useInvoiceActions } from "@/hooks/useInvoiceActions";
import { calculateInvoiceTotal, normalizeInvoiceItems } from "@/lib/invoiceUtils";
import Input from "@/components/ui/Input";
import NumberInput from "@/components/ui/NumberInput";
import Button from "@/components/ui/Button";
import OperationTypeModal from "./OperationTypeModal";
import ItemOperationBadge from "./ItemOperationBadge";

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "شماره فاکتور الزامی است"),
  customerName: z.string().min(2, "نام مشتری باید حداقل ۲ حرف باشد"),
  status: z.enum(["paid", "pending", "cancelled"]),
  description: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "عنوان کالا الزامی است"),
        // به‌جای min(1) از positive() استفاده شد تا اعداد اعشاری کوچک مثل 0.5 هم معتبر باشن
        quantity: z.coerce.number().positive("تعداد باید بزرگتر از صفر باشد"),
        unitPrice: z.coerce.number().min(0, "قیمت نمی‌تواند منفی باشد"),
        operationType: z.enum(["sale", "purchase", "expense"]),
      })
    )
    .min(1, "حداقل یک قلم کالا باید اضافه شود"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  existingInvoice?: Invoice;
  onSuccess?: () => void;
}

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: "pending", label: "در انتظار پرداخت" },
  { value: "paid", label: "پرداخت شده" },
  { value: "cancelled", label: "لغو شده" },
];

export default function InvoiceForm({ existingInvoice, onSuccess }: InvoiceFormProps) {
  const { createInvoice, editInvoice } = useInvoiceActions();
  const isEditMode = Boolean(existingInvoice);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: existingInvoice
      ? {
          invoiceNumber: existingInvoice.invoiceNumber,
          customerName: existingInvoice.customerName,
          status: existingInvoice.status,
          description: existingInvoice.description || "",
          items: normalizeInvoiceItems(existingInvoice.items),
        }
      : {
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
          customerName: "",
          status: "pending",
          description: "",
          items: [
            {
              id: crypto.randomUUID(),
              title: "",
              quantity: 1,
              unitPrice: 0,
              operationType: "sale",
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems = watch("items");

  const totalAmount = useMemo(() => calculateInvoiceTotal(watchedItems), [watchedItems]);

  const handleAddItemClick = useCallback(() => {
    setIsTypeModalOpen(true);
  }, []);

  const handleSelectOperationType = useCallback(
    (type: ItemOperationType) => {
      append({
        id: crypto.randomUUID(),
        title: "",
        quantity: 1,
        unitPrice: 0,
        operationType: type,
      });
      setIsTypeModalOpen(false);
    },
    [append]
  );

  const onSubmit = useCallback(
    (data: InvoiceFormValues) => {
      if (isEditMode && existingInvoice) {
        editInvoice(existingInvoice.id, data);
      } else {
        createInvoice(data);
      }
      onSuccess?.();
    },
    [isEditMode, existingInvoice, editInvoice, createInvoice, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="شماره فاکتور"
          {...register("invoiceNumber")}
          error={errors.invoiceNumber?.message}
        />
        <Input
          label="نام مشتری"
          placeholder="مثلاً: شرکت پارس صنعت"
          {...register("customerName")}
          error={errors.customerName?.message}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">وضعیت فاکتور</label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-white
                         focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">اقلام فاکتور</label>
          <button
            type="button"
            onClick={handleAddItemClick}
            className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-700"
          >
            <Plus size={14} /> افزودن قلم جدید
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-slate-50 p-3 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <Controller
                  control={control}
                  name={`items.${index}.operationType`}
                  render={({ field: opField }) => (
                    <ItemOperationBadge value={opField.value} onChange={opField.onChange} />
                  )}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="حذف ردیف"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="عنوان کالا یا خدمات"
                    {...register(`items.${index}.title`)}
                    error={errors.items?.[index]?.title?.message}
                  />
                </div>
                <div className="w-24">
                  {/* اینجا از NumberInput استفاده شد تا هم اعشار پشتیبانی بشه، هم فقط عدد قابل تایپ باشه */}
                  <NumberInput
                    placeholder="تعداد"
                    allowDecimal
                    {...register(`items.${index}.quantity`)}
                    error={errors.items?.[index]?.quantity?.message}
                  />
                </div>
                <div className="w-32">
                  <NumberInput
                    placeholder="قیمت واحد"
                    allowDecimal
                    {...register(`items.${index}.unitPrice`)}
                    error={errors.items?.[index]?.unitPrice?.message}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.items?.root && (
          <span className="text-xs text-red-500 mt-1 block">{errors.items.root.message}</span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">توضیحات (اختیاری)</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-surface-border bg-white
                     focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
          placeholder="توضیحات تکمیلی درباره فاکتور..."
        />
      </div>

      <div
        className={`flex items-center justify-between rounded-xl px-4 py-3 ${
          totalAmount < 0 ? "bg-red-50" : "bg-primary-50"
        }`}
      >
        <span
          className={`text-sm font-medium ${totalAmount < 0 ? "text-red-700" : "text-primary-700"}`}
        >
          مبلغ نهایی فاکتور
        </span>
        <span
          className={`text-lg font-bold ${totalAmount < 0 ? "text-red-700" : "text-primary-700"}`}
        >
          {totalAmount.toLocaleString("fa-IR")} تومان
        </span>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        {isEditMode ? "ذخیره تغییرات" : "ثبت فاکتور"}
      </Button>

      <OperationTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelect={handleSelectOperationType}
      />
    </form>
  );
}