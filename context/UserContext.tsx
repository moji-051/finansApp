"use client";

import { createContext, useContext, useCallback, useMemo, ReactNode } from "react";
import { UserInfo } from "@/types/invoice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants";

interface UserContextValue {
  userInfo: UserInfo;
  updateNameFa: (name: string) => void;
  updateNameEn: (name: string) => void;
}

const defaultUserInfo: UserInfo = { nameFa: "کاربر", nameEn: "User" };

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { value: userInfo, setValue: setUserInfo } = useLocalStorage<UserInfo>(
    STORAGE_KEYS.USER_INFO,
    defaultUserInfo
  );

  const updateNameFa = useCallback(
    (name: string) => {
      setUserInfo((prev) => ({ ...prev, nameFa: name }));
    },
    [setUserInfo]
  );

  const updateNameEn = useCallback(
    (name: string) => {
      setUserInfo((prev) => ({ ...prev, nameEn: name }));
    },
    [setUserInfo]
  );

  const value = useMemo(
    () => ({ userInfo, updateNameFa, updateNameEn }),
    [userInfo, updateNameFa, updateNameEn]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser باید داخل UserProvider استفاده بشه");
  }
  return context;
}