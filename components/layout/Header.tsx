"use client";

import { useUser } from "@/context/UserContext";
import DateTimeDisplay from "./DateTimeDisplay";
import EditableField from "@/components/ui/EditableField";
import { Wallet } from "lucide-react";

export default function Header() {
  const { userInfo, updateNameFa, updateNameEn } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* سمت چپ برنامه (از نظر بصری) = بخش انگلیسی زبان */}
        <div className="flex-1 flex">
          <EditableField
            value={userInfo.nameFa}
            onSave={updateNameFa}
            prefix="خوش آمدید"
            textAlign="right"
            dir="rtl"
          />
        </div>

        {/* وسط = لوگو + تاریخ و ساعت */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 text-primary-600">
            <Wallet size={20} />
            <span className=" text-md">مدیریت مالی</span>
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <DateTimeDisplay />
        </div>

        {/* سمت راست برنامه (از نظر بصری) = بخش فارسی زبان */}
        <div dir="ltr" className="flex-1 flex justify-start">
          <EditableField
            value={userInfo.nameEn}
            onSave={updateNameEn}
            prefix="Welcome"
            textAlign="left"
            dir="ltr"
          />
        </div>
        
      </div>

      {/* نمایش تاریخ/ساعت در حالت موبایل (زیر هدر اصلی) */}
      <div className="lg:hidden flex justify-center pb-2.5 border-t border-slate-100 pt-2">
        <DateTimeDisplay />
      </div>
    </header>
  );
}