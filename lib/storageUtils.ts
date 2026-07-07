/**
 * خواندن داده از localStorage به‌صورت type-safe (ایمن از نظر تایپ)
 * اگر مرورگر localStorage نداشته باشه یا داده خراب باشه، مقدار پیش‌فرض برمی‌گرده
 */
export function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback; // برای جلوگیری از خطا در Server-Side

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (error) {
    console.error(`خطا در خواندن ${key} از localStorage:`, error);
    return fallback;
  }
}

/**
 * نوشتن داده در localStorage
 */
export function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`خطا در ذخیره ${key} در localStorage:`, error);
  }
}

/**
 * گرفتن بکاپ کامل از تمام اطلاعات ذخیره‌شده به‌صورت یک فایل JSON
 */
export function exportBackup(): void {
  const allData: Record<string, unknown> = {};

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith("company-finance")) {
      allData[key] = JSON.parse(window.localStorage.getItem(key) || "null");
    }
  }

  const blob = new Blob([JSON.stringify(allData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().split("T")[0];

  link.href = url;
  link.download = `backup-mali-shirkat-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * بازیابی اطلاعات از فایل بکاپ JSON
 */
export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
    reader.readAsText(file);
  });
}