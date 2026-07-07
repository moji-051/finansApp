"use client";

import { ShoppingCart, TrendingUp, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { ItemOperationType } from "@/types/invoice";
import { OPERATION_TYPE_CONFIG } from "@/constants";

interface OperationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ItemOperationType) => void;
}

// آیکون هر نوع عملیات - چون آیکون یک کامپوننت React است، جدا از فایل ثابت‌ها (constants) نگه داشته شده
const OPERATION_ICONS: Record<ItemOperationType, typeof ShoppingCart> = {
  sale: TrendingUp,
  purchase: ShoppingCart,
  expense: Receipt,
};

const OPERATION_ORDER: ItemOperationType[] = ["purchase", "sale", "expense"];

export default function OperationTypeModal({
  isOpen,
  onClose,
  onSelect,
}: OperationTypeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="قصد انجام چه نوع عملیاتی دارید؟">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPERATION_ORDER.map((type) => {
          const config = OPERATION_TYPE_CONFIG[type];
          const Icon = OPERATION_ICONS[type];

          return (
            <motion.button
              key={type}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(type)}
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
              <span className="text-xs text-slate-400 leading-relaxed">
                {config.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </Modal>
  );
}