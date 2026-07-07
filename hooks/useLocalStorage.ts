"use client";

import { useState, useEffect, useCallback } from "react";
import { readFromStorage, writeToStorage } from "@/lib/storageUtils";

/**
 * هوک عمومی برای همگام نگه داشتن یک state با localStorage
 * هر تغییری در state، خودکار در localStorage هم ذخیره می‌شه
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // در اولین رندر (فقط سمت کلاینت)، مقدار واقعی از localStorage خونده می‌شه
  useEffect(() => {
    setStoredValue(readFromStorage(key, initialValue));
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;
        writeToStorage(key, newValue);
        return newValue;
      });
    },
    [key]
  );

  return { value: storedValue, setValue, isHydrated };
}