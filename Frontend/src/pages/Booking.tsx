import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
    CalendarDays,
    Clock,
    MapPin,
    User,
    CheckCircle2,
    Loader2,
} from "lucide-react";
 
const API_URL = "http://localhost:3000";
 
const COURTS = ["Sân PB 1", "Sân PB 2"];
const TIME_SLOTS = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00",
];
const DURATIONS = [
    { label: "1 giờ", value: 1 },
    { label: "1.5 giờ", value: 1.5 },
    { label: "2 giờ", value: 2 },
];
const PRICE_PER_HOUR = 130000;
 
function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN") + "đ";
}
 
export default function Booking() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<null | { code: string }>(null);
 
    const [court, setCourt] = useState(COURTS[0]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(1);
    const [customer, setCustomer] = useState({
        fullName: "",
        phone: "",
        note: "",
    });
 
    const total = useMemo(() => PRICE_PER_HOUR * duration, [duration]);
 
    const handleCustomerChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };
 
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
 
        if (!date) {
            toast.error("Vui lòng chọn ngày đặt sân");
            return;
        }
        if (!time) {
            toast.error("Vui lòng chọn giờ đặt sân");
            return;
        }
        if (!customer.fullName.trim()) {
            toast.error("Vui lòng nhập họ và tên");
            return;
        }
        if (!customer.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
 
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/bookings`, {
                fieldName: "002 PB Club",
                court,
                date,
                time,
                duration,
                total,
                customer,
                status: "pending",
                createdAt: new Date().toISOString(),
            });
 
            const code = `BK${String(res.data?.id ?? Date.now()).padStart(6, "0")}`;
            setSuccess({ code });
            toast.success("Đặt sân thành công!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error("Đặt sân thất bại. Vui lòng thử lại.");
            } else {
                toast.error("Không thể kết nối server. Hãy chạy npm run db");
            }
        } finally {
            setLoading(false);
        }
    };
 
    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                    <CheckCircle2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                        Đặt sân thành công!
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Mã đặt sân của bạn là{" "}
                        <span className="font-bold text-blue-600">{success.code}</span>.
                        Chủ sân sẽ liên hệ xác nhận trong ít phút.
                    </p>
                    <div className="bg-gray-50 rounded-2xl p-6 text-left text-sm font-semibold text-gray-700 space-y-2 mb-8">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sân</span>
                            <span>{court} - 002 PB Club</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ngày</span>
                            <span>{date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Giờ</span>
                            <span>
                                {time} ({duration} giờ)
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-500">Tổng tiền</span>
                            <span className="text-blue-600">{formatCurrency(total)}</span>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
                        >
                            Về trang chủ
                        </Link>
                        <button
                            onClick={() => setSuccess(null)}
                            className="border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
                        >
                            Đặt thêm sân khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }
 
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* BREADCRUMB */}
            <div className="text-sm font-medium text-gray-400 flex items-center space-x-2 mb-6">
                <Link to="/" className="text-blue-600 hover:underline">
                    Trang chủ
                </Link>
                <span>/</span>
                <Link to="/detail" className="text-blue-600 hover:underline">
                    002 PB Club
                </Link>
                <span>/</span>
                <span className="text-gray-600">Đặt sân</span>
            </div>
 
            <h1 className="text-2xl font-extrabold text-gray-900 mb-8">
                Đặt sân - 002 PB Club
            </h1>
 
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* LEFT: booking form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Chọn sân
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {COURTS.map((c) => (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => setCourt(c)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition ${
                                        court === c
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "border-gray-200 text-gray-600 hover:border-blue-400"
                                    }`}
                                >
                                    🏓 {c}
                                </button>
                            ))}
                        </div>
                    </div>
 
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-blue-600" /> Chọn
                            ngày &amp; giờ
                        </h3>
 
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Ngày đặt sân
                        </label>
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full md:w-64 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold mb-6 outline-none focus:border-blue-500"
                        />
 
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Khung giờ
                        </label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
                            {TIME_SLOTS.map((t) => (
                                <button
                                    type="button"
                                    key={t}
                                    onClick={() => setTime(t)}
                                    className={`border rounded-lg py-2 text-center text-xs font-bold transition ${
                                        time === t
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
 
                        <label className="block text-sm font-semibold text-gray-600 mb-2">
                            Thời lượng
                        </label>
                        <div className="flex gap-3">
                            {DURATIONS.map((d) => (
                                <button
                                    type="button"
                                    key={d.value}
                                    onClick={() => setDuration(d.value)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                                        duration === d.value
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "border-gray-200 text-gray-600 hover:border-blue-400"
                                    }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
 
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center">
                            <User className="w-4 h-4 mr-2 text-blue-600" /> Thông tin liên
                            hệ
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-semibold text-gray-600 mb-1"
                                >
                                    Họ và tên
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="Nhập họ và tên"
                                    value={customer.fullName}
                                    onChange={handleCustomerChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-semibold text-gray-600 mb-1"
                                >
                                    Số điện thoại
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="09xxxxxxxx"
                                    value={customer.phone}
                                    onChange={handleCustomerChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="note"
                                    className="block text-sm font-semibold text-gray-600 mb-1"
                                >
                                    Ghi chú (không bắt buộc)
                                </label>
                                <textarea
                                    id="note"
                                    name="note"
                                    rows={3}
                                    placeholder="Yêu cầu thêm cho chủ sân..."
                                    value={customer.note}
                                    onChange={handleCustomerChange}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
 
                {/* RIGHT: order summary (sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                            <h3 className="font-extrabold text-gray-900 mb-6">
                                Tóm tắt đơn đặt sân
                            </h3>
 
                            <div className="space-y-4 mb-8 text-sm font-semibold">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 flex items-center">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5" /> Sân
                                    </span>
                                    <span className="text-gray-900">{court}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 flex items-center">
                                        <CalendarDays className="w-3.5 h-3.5 mr-1.5" /> Ngày
                                    </span>
                                    <span className="text-gray-900">
                                        {date || "Chưa chọn"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500 flex items-center">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" /> Giờ
                                    </span>
                                    <span className="text-gray-900">
                                        {time || "Chưa chọn"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500">Thời lượng</span>
                                    <span className="text-gray-900">{duration} giờ</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-gray-500">Tổng tiền</span>
                                    <span className="text-blue-600 text-lg font-extrabold">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>
 
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center transition shadow-lg shadow-blue-500/20 disabled:opacity-60"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <CalendarDays className="w-5 h-5 mr-2" />
                                )}
                                {loading ? "Đang xử lý..." : "Xác nhận đặt sân"}
                            </button>
 
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full mt-3 border border-gray-200 hover:border-blue-400 text-gray-600 py-3 rounded-xl font-bold transition text-sm"
                            >
                                Quay lại
                            </button>
 
                            <div className="text-center mt-4 text-xs font-semibold text-gray-400">
                                🛡️ Đặt cọc an toàn - Hủy trước 2h miễn phí
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
 