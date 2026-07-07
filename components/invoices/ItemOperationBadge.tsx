"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, ShoppingCart, TrendingUp, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ItemOperationType } from "@/types/invoice";
import { OPERATION_TYPE_CONFIG } from "@/constants";

interface ItemOperationBadgeProps {
  value: ItemOperationType;
  onChange: (type: ItemOperationType) => void;
}

const OPERATION_ICONS: Record<ItemOperationType, typeof ShoppingCart> = {
  sale: TrendingUp,
  purchase: ShoppingCart,
  expense: Receipt,
};

const OPERATION_ORDER: ItemOperationType[] = ["sale", "purchase", "expense"];

export default function ItemOperationBadge({ value, onChange }: ItemOperationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const config = OPERATION_TYPE_CONFIG[value];
  const Icon = OPERATION_ICONS[value];

  // بستن لیست کشویی با کلیک بیرون از آن
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (type: ItemOperationType) => {
      onChange(type);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
        style={{ color: config.color, backgroundColor: config.bg }}
      >
        <Icon size={13} />
        {config.label}
        <ChevronDown size={13} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full mt-1.5 right-0 bg-white rounded-xl border border-surface-border
                       shadow-lg p-1.5 w-40"
          >
            {OPERATION_ORDER.map((type) => {
              const itemConfig = OPERATION_TYPE_CONFIG[type];
              const ItemIcon = OPERATION_ICONS[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect(type)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                              hover:bg-slate-50 transition-colors ${
                                type === value ? "bg-slate-50" : ""
                              }`}
                >
                  <ItemIcon size={14} style={{ color: itemConfig.color }} />
                  <span style={{ color: itemConfig.color }}>{itemConfig.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}