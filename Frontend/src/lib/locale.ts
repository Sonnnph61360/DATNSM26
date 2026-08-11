/** Định dạng tiếng Việt dùng chung */

export function formatCurrencyVi(value: number): string {
    if (value == null || Number.isNaN(Number(value))) return "0 ₫";
    return (
      Number(value).toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      }) + " ₫"
    );
  }
  
  /** YYYY-MM-DD → dd/MM/yyyy */
  export function formatDateVi(dateStr?: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  
  /** ISO → dd/MM/yyyy HH:mm */
  export function formatDateTimeVi(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  export function formatPhoneVi(phone?: string): string {
    if (!phone) return "—";
    const p = phone.replace(/\s/g, "");
    if (p.length === 10 && p.startsWith("0")) {
      return `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;
    }
    return phone;
  }
  
  export const STATUS_LABEL_VI: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    cancelled: "Đã hủy",
    completed: "Hoàn thành",
    active: "Hoạt động",
    maintenance: "Bảo trì",
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    cash: "Thanh toán tại sân",
    transfer: "Chuyển khoản / Online",
  };
  
  export function statusLabelVi(key?: string): string {
    if (!key) return "—";
    return STATUS_LABEL_VI[key] || key;
  }
  