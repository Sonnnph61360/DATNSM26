import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CalendarDays, Clock, MapPin, User, CheckCircle2, Loader2, Wallet, QrCode,
} from "lucide-react";
import {
  api, Court, Field, formatCurrency, TIME_SLOTS, getBookedSlots, isSlotConflict,
} from "../lib/api";
import { getUser, isLoggedIn } from "../lib/auth";

const DURATIONS = [
  { label: "1 giờ", value: 1 },
  { label: "1.5 giờ", value: 1.5 },
  { label: "2 giờ", value: 2 },
];

export default function Booking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fieldIdParam = params.get("fieldId");
  const courtIdParam = params.get("courtId");
  const dateParam = params.get("date");
  const timeParam = params.get("time");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState<null | { code: string; paymentMethod: string }>(null);
  const [showQr, setShowQr] = useState(false);

  const [field, setField] = useState<Field | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState<number | null>(
    courtIdParam ? Number(courtIdParam) : null
  );
  const [date, setDate] = useState(dateParam || "");
  const [time, setTime] = useState(timeParam || "");
  const [duration, setDuration] = useState(1);
  const [customer, setCustomer] = useState({
    fullName: getUser()?.fullName || "",
    phone: getUser()?.phone || "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"deposit" | "full">("deposit");
  const [bookedSlots, setBookedSlots] = useState<Awaited<ReturnType<typeof getBookedSlots>>>([]);

  const selectedCourt = courts.find((c) => c.id === courtId) || null;
  const total = useMemo(
    () => (selectedCourt ? selectedCourt.price * duration : 0),
    [selectedCourt, duration]
  );
  const deposit = total * 0.3; // 30% deposit

  useEffect(() => {
    if (!fieldIdParam) {
      setLoadingData(false);
      return;
    }
    (async () => {
      try {
        const [fRes, cRes] = await Promise.all([
          api.get<Field>(`/fields/${fieldIdParam}`),
          api.get<Court[]>(`/courts`, { params: { fieldId: fieldIdParam, status: "active" } }),
        ]);
        setField(fRes.data);
        const active = cRes.data.filter((c) => c.status === "active");
        setCourts(active);
        if (!courtId && active.length) setCourtId(active[0].id);
      } catch {
        toast.error("Không tải được thông tin sân");
      } finally {
        setLoadingData(false);
      }
    })();
  }, [fieldIdParam]);

  useEffect(() => {
    if (!courtId || !date) {
      setBookedSlots([]);
      return;
    }
    getBookedSlots(courtId, date).then(setBookedSlots).catch(() => setBookedSlots([]));
  }, [courtId, date]);

  const slotDisabled = (slot: string) =>
    bookedSlots.some((b) => isSlotConflict(b.time, b.duration, slot, duration));

  const handleCustomerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      toast.error("Vui lòng đăng nhập để đặt sân");
      navigate("/login", { state: { from: `/booking?fieldId=${fieldIdParam}` } });
      return;
    }
    if (!field || !selectedCourt) {
      toast.error("Vui lòng chọn sân");
      return;
    }
    if (!date) {
      toast.error("Vui lòng chọn ngày đặt sân");
      return;
    }
    if (!time) {
      toast.error("Vui lòng chọn giờ");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (date < today) {
      toast.error("Không thể đặt ngày trong quá khứ");
      return;
    }
    if (!customer.fullName.trim() || !customer.phone.trim()) {
      toast.error("Vui lòng nhập họ tên và số điện thoại");
      return;
    }
    if (!/^(0|\+84)[0-9]{9,10}$/.test(customer.phone.trim())) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }
    if (slotDisabled(time)) {
      toast.error("Khung giờ này đã có người đặt. Vui lòng chọn giờ khác.");
      return;
    }

    // Online payment is now required (deposit or full)
    if (!showQr) {
      setShowQr(true);
      return;
    }

    setLoading(true);
    try {
      const user = getUser();
      const payload = {
        fieldId: field.id,
        courtId: selectedCourt.id,
        fieldName: field.name,
        court: selectedCourt.name,
        date,
        time,
        duration,
        total,
        customer: {
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
          note: customer.note.trim(),
          userId: user?.id,
          email: user?.email,
        },
        paymentMethod,
        paymentStatus: "paid", // They paid the deposit or full online
        status: "pending", // Lúc mới đặt sân thì trạng thái là chờ xác nhận
        createdAt: new Date().toISOString(),
      };

      // re-check conflict
      const latest = await getBookedSlots(selectedCourt.id, date);
      if (latest.some((b) => isSlotConflict(b.time, b.duration, time, duration))) {
        toast.error("Khung giờ vừa được đặt. Chọn giờ khác.");
        setBookedSlots(latest);
        setLoading(false);
        return;
      }

      const res = await api.post("/bookings", payload);
      setSuccess({
        code: `BK${String(res.data.id).padStart(6, "0")}`,
        paymentMethod,
      });
      toast.success("Đặt sân thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Đặt sân thất bại. Kiểm tra API (npm run db).");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!fieldIdParam || !field) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <p className="text-gray-500 mb-4">Chưa chọn cơ sở để đặt sân</p>
        <Link to="/fields" className="text-blue-600 font-bold">
          Tìm sân ngay →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Đặt sân thành công!</h2>
          <p className="text-gray-500 mb-4">
            Mã đơn: <span className="font-bold text-green-700">{success.code}</span>
          </p>
          {paymentMethod === "full" ? (
            <p className="text-sm text-green-600 mb-6">Đã thanh toán 100% · Cần admin xác nhận</p>
          ) : (
            <p className="text-sm text-amber-600 mb-6">Đã đặt cọc 30% · Cần admin xác nhận</p>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-6 inline-block w-full text-center">
            <QrCode className="w-40 h-40 mx-auto text-gray-800" />
            <p className="text-xs text-gray-500 mt-2">Mã QR Check-in / Xác minh tại sân</p>
          </div>
          <div className="space-y-3">
            <Link
              to="/my-bookings"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              Xem đơn của tôi
            </Link>
            <Link to="/" className="block w-full border border-gray-200 py-3 rounded-xl font-bold text-gray-600">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-400 mb-6">
        <Link to="/" className="text-blue-600">Trang chủ</Link> /{" "}
        <Link to={`/detail/${field.id}`} className="text-blue-600">
          {field.name}
        </Link>{" "}
        / <span className="text-gray-600">Đặt sân</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Chọn sân
            </h3>
            <p className="text-sm text-gray-500 mb-4">{field.name} · {field.address}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {courts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCourtId(c.id)}
                  className={`border rounded-xl px-4 py-3 text-sm font-bold transition ${courtId === c.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:border-blue-400"
                    }`}
                >
                  {c.name}
                  <div className={`text-xs mt-1 font-medium ${courtId === c.id ? "text-blue-100" : "text-gray-400"}`}>
                    {formatCurrency(c.price)}/h
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-blue-600" /> Ngày & giờ
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Ngày</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime("");
                }}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Khung giờ</label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {TIME_SLOTS.map((t) => {
                  const disabled = !date || slotDisabled(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={disabled}
                      onClick={() => setTime(t)}
                      className={`rounded-lg py-2 text-xs font-bold border transition ${time === t
                        ? "bg-blue-600 border-blue-600 text-white"
                        : disabled
                          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                          : "border-gray-200 text-gray-700 hover:border-blue-400"
                        }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Thời lượng</label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDuration(d.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${duration === d.value
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 text-gray-600 hover:border-blue-400"
                      }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" /> Thông tin liên hệ
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Họ và tên</label>
                <input
                  name="fullName"
                  value={customer.fullName}
                  onChange={handleCustomerChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Số điện thoại</label>
                <input
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="09xxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Ghi chú</label>
                <textarea
                  name="note"
                  rows={3}
                  value={customer.note}
                  onChange={handleCustomerChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
                  placeholder="Yêu cầu thêm..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-blue-600" /> Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`block border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "deposit" ? "border-blue-600 bg-blue-50/50" : "border-gray-200"
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "deposit"}
                    onChange={() => {
                      setPaymentMethod("deposit");
                      setShowQr(false);
                    }}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <div className="font-bold text-gray-800 text-sm">Đặt cọc (30%)</div>
                    <div className="text-xs text-gray-500">Thanh toán chuyển khoản cọc</div>
                  </div>
                </div>
              </label>
              <label
                className={`block border rounded-xl p-4 cursor-pointer transition ${paymentMethod === "full" ? "border-blue-600 bg-blue-50/50" : "border-gray-200"
                  }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "full"}
                    onChange={() => {
                      setPaymentMethod("full");
                      setShowQr(false);
                    }}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <div className="font-bold text-gray-800 text-sm">Thanh toán toàn bộ (100%)</div>
                    <div className="text-xs text-gray-500">Chuyển khoản toàn bộ, không cần trả sau</div>
                  </div>
                </div>
              </label>
            </div>

            {showQr && (
              <div className="mt-6 border border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50/40 text-center">
                <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <p className="font-bold text-gray-800 mb-1">Quét mã để thanh toán</p>
                <p className="text-sm text-gray-500 mb-2">
                  Số tiền cần chuyển: <span className="font-extrabold text-blue-600">
                    {formatCurrency(paymentMethod === "deposit" ? deposit : total)}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  (Demo) Nội dung: DATSAN {field.name} {date} {time}
                </p>
                <div className="w-40 h-40 mx-auto bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">📱</span>
                </div>
                <p className="text-xs text-amber-600 mb-3">
                  Đây là mô phỏng thanh toán với db.json — bấm xác nhận sau khi “đã chuyển”.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="font-extrabold text-gray-900 mb-6">Tóm tắt đơn</h3>
              <div className="space-y-4 mb-8 text-sm font-semibold">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Cơ sở</span>
                  <span className="text-gray-900 text-right max-w-[60%]">{field.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Sân</span>
                  <span className="text-gray-900">{selectedCourt?.name || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-1" /> Ngày
                  </span>
                  <span>{date || "Chưa chọn"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Giờ
                  </span>
                  <span>{time || "Chưa chọn"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Thời lượng</span>
                  <span>{duration} giờ</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500">Tiền cọc (30%)</span>
                  <span className="text-amber-500 font-bold">{formatCurrency(deposit)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Tổng tiền</span>
                  <span className="text-blue-600 text-lg font-extrabold">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center transition disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <CalendarDays className="w-5 h-5 mr-2" />
                )}
                {loading
                  ? "Đang xử lý..."
                  : !showQr
                    ? "Tiếp tục thanh toán"
                    : "Tôi đã thanh toán & Đặt sân"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-3 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-sm"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
