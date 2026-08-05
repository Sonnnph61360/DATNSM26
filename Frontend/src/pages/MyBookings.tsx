import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CalendarDays } from "lucide-react";
import { api, Booking, formatCurrency } from "../lib/api";
import { getUser } from "../lib/auth";
import toast from "react-hot-toast";

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Đã xác nhận", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-700" },
  completed: { label: "Hoàn thành", className: "bg-blue-100 text-blue-700" },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Booking[]>("/bookings");
        const mine = res.data
          .filter(
            (b) =>
              b.customer?.userId === user?.id ||
              b.customer?.email === user?.email ||
              b.customer?.phone === user?.phone
          )
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        setBookings(mine);
      } catch {
        toast.error("Không tải được đơn đặt sân");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, user?.email, user?.phone]);

  const cancelBooking = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn hủy đơn này?")) return;
    try {
      await api.patch(`/bookings/${id}`, { status: "cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Đã hủy đơn");
    } catch {
      toast.error("Hủy thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-blue-600" />
        Đơn đặt sân của tôi
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Xin chào {user?.fullName || user?.email}
      </p>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Chưa có đơn nào.{" "}
          <Link to="/fields" className="text-blue-600 font-semibold">
            Đặt sân ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const st = statusMap[b.status] || statusMap.pending;
            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
              >
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <span className="font-bold text-green-700">
                    BK{String(b.id).padStart(6, "0")}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.className}`}>
                    {st.label}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Cơ sở: </span>
                    <span className="font-semibold">{b.fieldName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Sân: </span>
                    <span className="font-semibold">{b.court}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ngày: </span>
                    <span className="font-semibold">
                      {b.date} · {b.time} ({b.duration}h)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Tổng: </span>
                    <span className="font-extrabold text-blue-600">
                      {formatCurrency(b.total)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Thanh toán: </span>
                    <span className="font-semibold">
                      {b.paymentMethod === "transfer" ? "Online" : "Tại sân"} ·{" "}
                      {b.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa TT"}
                    </span>
                  </div>
                </div>
                {b.status === "pending" || b.status === "confirmed" ? (
                  <button
                    onClick={() => cancelBooking(b.id)}
                    className="mt-4 text-sm font-semibold text-red-600 hover:underline"
                  >
                    Hủy đơn
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
