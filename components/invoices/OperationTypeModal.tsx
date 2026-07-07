"use client";

import { useState, useCallback, useEffect } from "react";
import { ShoppingCart, TrendingUp, ArrowUpDown, Percent, PlusCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { ItemOperationType } from "@/types/invoice";
import { OPERATION_TYPE_CONFIG } from "@/constants";

interface OperationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ItemOperationType) => void;
}

// آیکون هر نوع عملیات (چون کامپوننت React هستن، جدا از فایل ثابت‌ها نگه‌داری می‌شن)
const OPERATION_ICONS: Record<ItemOperationType, typeof ShoppingCart> = {
  sale: TrendingUp,
  purchase: ShoppingCart,
  deduction: Percent,
  addition: PlusCircle,
};

// مرحله دوم فقط بین این دو نوع انتخاب می‌کنه
const ADJUSTMENT_OPTIONS: ItemOperationType[] = ["deduction", "addition"];

type ModalStep = "main" | "adjustment";

export default function OperationTypeModal({
  isOpen,
  onClose,
  onSelect,
}: OperationTypeModalProps) {
  const [step, setStep] = useState<ModalStep>("main");

  // هر بار که مودال دوباره باز می‌شه، برگرده به مرحله اول
  useEffect(() => {
    if (isOpen) setStep("main");
  }, [isOpen]);

  const handleSelect = useCallback(
    (type: ItemOperationType) => {
      onSelect(type);
    },
    [onSelect]
  );

  const handleOpenAdjustment = useCallback(() => {
    setStep("adjustment");
  }, []);

  const handleBackToMain = useCallback(() => {
    setStep("main");
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === "main" ? "قصد انجام چه نوع عملیاتی دارید؟" : "این مورد کسر شود یا اضافه؟"}
    >
      <AnimatePresence mode="wait">
        {step === "main" ? (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {/* دکمه خرید */}
            <OperationButton
              type="purchase"
              onClick={() => handleSelect("purchase")}
            />

            {/* دکمه فروش */}
            <OperationButton
              type="sale"
              onClick={() => handleSelect("sale")}
            />

            {/* دکمه ترکیبی کسر/اضافه - این خودش یک تایپ مشخص نیست، فقط مرحله دوم رو باز می‌کنه */}
            <motion.button
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenAdjustment}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-surface-border
                         hover:border-primary-300 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                <ArrowUpDown size={22} className="text-slate-600" />
              </div>
              <span className="text-sm font-bold text-slate-800">کسر / اضافه</span>
              <span className="text-xs text-slate-400 leading-relaxed">
                مانند مالیات (کسر) یا اجرت کار (اضافه)
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="adjustment"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {ADJUSTMENT_OPTIONS.map((type) => (
                <OperationButton key={type} type={type} onClick={() => handleSelect(type)} />
              ))}
            </div>

            <button
              type="button"
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 transition-colors"
            >
              <ArrowRight size={14} />
              بازگشت به مرحله قبل
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

// دکمه‌ی مشترک برای نمایش هر نوع عملیات - چون هم در مرحله اول و هم دوم استفاده می‌شه، جدا شده
function OperationButton({
  type,
  onClick,
}: {
  type: ItemOperationType;
  onClick: () => void;
}) {
  const config = OPERATION_TYPE_CONFIG[type];
  const Icon = OPERATION_ICONS[type];

  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-surface-border
                 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-center"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: config.bg }}
      >
        <Icon size={22} style={{ color: config.color }} />
      </div>
      <span className="text-sm font-bold text-slate-800">{config.label}</span>
      <span className="text-xs text-slate-400 leading-relaxed">{config.description}</span>
    </motion.button>
  );
}