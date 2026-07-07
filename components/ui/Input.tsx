"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// از forwardRef استفاده شده چون بعداً با react-hook-form باید بتونیم ref رو پاس بدیم
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border bg-white text-slate-800
            placeholder:text-slate-400 transition-all duration-200
            focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
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

Input.displayName = "Input";
export default Input;