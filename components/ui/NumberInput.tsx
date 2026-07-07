"use client";

import { InputHTMLAttributes, forwardRef, KeyboardEvent } from "react";

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  allowDecimal?: boolean; // اگر false باشه، فقط عدد صحیح (Integer) قابل ورود است
}

// کلیدهایی که همیشه باید مجاز باشن (حتی اگه عدد نباشن) تا کاربر بتونه ویرایش کنه
const ALWAYS_ALLOWED_KEYS = [
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
];

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, error, allowDecimal = true, className = "", onKeyDown, ...props }, ref) => {
    // این تابع جلوی تایپ کاراکترهای غیرعددی (مثل e، +، -) رو می‌گیره
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey; // برای کپی/پیست (Ctrl+C / Ctrl+V) مزاحمت ایجاد نکنه
      const isNumberKey = /^[0-9]$/.test(e.key);
      const isDecimalPoint = allowDecimal && e.key === ".";

      const isAllowed =
        isCtrlOrCmd ||
        ALWAYS_ALLOWED_KEYS.includes(e.key) ||
        isNumberKey ||
        isDecimalPoint;

      // اگه کاراکتر نقطه بود و قبلاً یک نقطه دیگه توی مقدار فعلی وجود داشت، اجازه تایپ دوباره نده
      if (isDecimalPoint) {
        const currentValue = (e.target as HTMLInputElement).value;
        if (currentValue.includes(".")) {
          e.preventDefault();
          return;
        }
      }

      if (!isAllowed) {
        e.preventDefault();
      }

      onKeyDown?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <input
          ref={ref}
          type="number"
          inputMode={allowDecimal ? "decimal" : "numeric"} // صفحه‌کلید مناسب روی موبایل باز می‌شه
          step={allowDecimal ? "any" : "1"}
          dir="ltr" // اعداد همیشه چپ‌به‌راست نمایش داده بشن تا خوانا باشن
          onKeyDown={handleKeyDown}
          onWheel={(e) => e.currentTarget.blur()} // جلوگیری از تغییر عدد با اسکرول ماوس روی اینپوت (یک باگ رایج مرورگرها)
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800 text-right
            placeholder:text-slate-400 transition-all duration-200
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            ${error ? "border-red-400" : "border-surface-border"}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;