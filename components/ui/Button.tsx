"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

// تعریف حالت‌های مختلف ظاهری دکمه (Variant)
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon; // آیکون اختیاری از lucide-react
  isLoading?: boolean;
}

// استایل هر حالت به‌صورت جداگانه تعریف شده تا کد تمیزتر باشه
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-black hover:bg-primary-700 shadow-sm shadow-primary-200",
  secondary: "bg-white text-slate-700 border border-surface-border hover:bg-slate-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading = false,
  disabled,
  className = "",
  ...props // (Rest Props) یعنی بقیه‌ی پراپرتی‌های استاندارد دکمه که خودکار پاس داده میشن
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }} // با کلیک، دکمه کمی کوچک میشه (افکت لمسی)
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center rounded-xl font-medium
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
}