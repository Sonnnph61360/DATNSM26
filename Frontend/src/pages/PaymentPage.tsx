import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, QrCode, RefreshCw } from "lucide-react";
import { api, formatCurrency, type Booking } from "../lib/api";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  const fetchData = async () => {
    if (!bookingId) return;
    try {
      const bookingRes = await api.get<Booking>(`/bookings/${bookingId}`);
      setBooking(bookingRes.data);

      const payRes = await api.post("/sepay/create-payment", {
        bookingId: Number(bookingId),
        amount: bookingRes.data.total,
      });
      setPayment(payRes.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId || !payment) return;
    const timer = setInterval(async () => {
      try {
        const res = await api.get(`/sepay/status/${bookingId}`);
        if (res.data.status === "confirmed" || res.data.paymentStatus === "success") {
          setPolling(false);
          setPayment((prev: any) => ({ ...prev, status: "success" }));
          clearInterval(timer);
        }
      } catch {
        // ignore poll errors
      }
    }, 5000);

    setPolling(true);
    return () => clearInterval(timer);
  }, [bookingId, payment]);

  const statusText = useMemo(() => {
    if (!booking) return "Đang tải";
    if (booking.status === "confirmed") return "Đã xác nhận";
    if (booking.status === "cancelled") return "Đã hủy";
    return "Chờ thanh toán";
  }, [booking]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!booking || !payment) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold">Không tìm thấy đơn thanh toán</h2>
        <button onClick={() => navigate("/")} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">
          Về trang chủ
        </button>
      </div>
    );
  }

  const isSuccess = booking.status === "confirmed" || payment.status === "success";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Thanh toán</p>
          <h1 className="text-3xl font-extrabold text-gray-900">SePay payment</h1>
        </div>
        <Link to="/my-bookings" className="rounded-xl border border-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
          Xem đơn của tôi
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Thông tin đơn hàng</h2>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isSuccess ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {isSuccess ? "Đã xác nhận" : statusText}
            </span>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Mã đơn</span><strong>BK{String(booking.id).padStart(6, "0")}</strong></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Sân</span><strong>{booking.fieldName} · {booking.court}</strong></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Ngày</span><strong>{booking.date}</strong></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Giờ</span><strong>{booking.time} ({booking.duration}h)</strong></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Mã thanh toán</span><strong>{payment.paymentCode}</strong></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><span>Nội dung</span><strong>{payment.paymentNote}</strong></div>
            <div className="flex justify-between"><span>Tổng tiền</span><strong className="text-lg text-blue-600">{formatCurrency(booking.total)}</strong></div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">QR thanh toán</h2>
            <button type="button" onClick={fetchData} className="inline-flex items-center gap-2 text-sm text-blue-600">
              <RefreshCw className="h-4 w-4" /> Làm mới
            </button>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 text-center">
            <img src={payment.qrUrl} alt="SePay QR" className="mx-auto h-56 w-56 rounded-xl border border-gray-200 bg-white p-2" />
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
            <div className="font-semibold">Tài khoản nhận: {payment.accountNumber}</div>
            <div className="mt-1">Ngân hàng: {payment.bankCode}</div>
            <div className="mt-1">Nội dung: {payment.paymentNote}</div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <QrCode className="h-4 w-4 text-blue-500" />
            {polling ? "Đang kiểm tra trạng thái thanh toán..." : "Đợi giao dịch được xác nhận"}
          </div>

          {isSuccess && (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-5 w-5" /> Thanh toán thành công</div>
              <p className="mt-2 text-sm">Đơn đặt sân của bạn đã được xác nhận và chờ check-in tại sân.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
