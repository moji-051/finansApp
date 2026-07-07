"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MoreVertical, Check, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  prefix?: string; // مثلاً "خوش آمدید" که قبل از نام میاد
  textAlign?: "right" | "left";
  dir?: "rtl" | "ltr";
}

export default function EditableField({
  value,
  onSave,
  prefix = "",
  textAlign = "right",
  dir = "rtl",
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // وقتی حالت ادیت فعال میشه، خودکار روی اینپوت فوکوس بشه
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    const trimmed = tempValue.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      setTempValue(value); // اگه خالی بود، مقدار قبلی برگرده
    }
    setIsEditing(false);
  }, [tempValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") handleCancel();
    },
    [handleSave, handleCancel]
  );

  return (
    <div className={`flex items-center gap-2 ${textAlign === "right" ? "flex-row" : "flex-row-reverse"}`}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-1.5"
          >
            <input
              ref={inputRef}
              dir={dir}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="px-3 py-1.5 rounded-lg border border-primary-400 text-sm w-40
                         focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              aria-label="ذخیره"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              aria-label="انصراف"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span dir={dir} className="text-sm font-medium text-slate-700">
              {prefix} <span className="text-primary-600 font-semibold">{value}</span>
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="ویرایش نام"
            >
              <MoreVertical size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}