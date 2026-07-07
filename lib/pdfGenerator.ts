import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * دریافت یک المان HTML و تبدیل اون به فایل PDF قابل دانلود
 * @param element - المانی که باید عکس گرفته بشه (قالب فاکتور)
 * @param fileName - نام فایل خروجی
 */
export async function generatePDFFromElement(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  // scale: 2 یعنی کیفیت تصویر دو برابر می‌شه تا PDF شارپ (واضح) باشه
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  // محاسبه ابعاد PDF بر اساس سایز A4 (میلی‌متر)
  const pdfWidth = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
}