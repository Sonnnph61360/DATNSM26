import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function VnPayReturn() {
    const location = useLocation();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (!searchParams.has("vnp_SecureHash")) {
            setStatus("failed");
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await api.get("/vnpay/return" + location.search);
                setBookingId(res.data.bookingId);
                if (res.data.code === "00") {
                    setStatus("success");
                } else {
                    setStatus("failed");
                    setErrorMessage(res.data.message || "Failed from server");
                }
            } catch (err: any) {
                setStatus("failed");
                setErrorMessage(err.response?.data?.message || err.message || "Network Error");
            }
        };

        verifyPayment();
    }, [location.search]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang xác thực thanh toán VNPAY...</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto py-20 px-4">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
                {status === "success" ? (
                    <>
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Thanh toán thành công!</h2>
                        <p className="text-gray-500 mb-4 text-sm">Cảm ơn bạn đã đặt sân. Giao dịch qua VNPAY đã hoàn tất.</p>
                        {bookingId && <p className="font-bold text-gray-800 mb-8">Mã đơn: BK{String(bookingId).padStart(6, '0')}</p>}
                    </>
                ) : (
                    <>
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Thanh toán thất bại</h2>
                        <p className="text-gray-500 mb-2 text-sm">Giao dịch đã bị hủy hoặc có lỗi xảy ra trong quá trình thanh toán qua VNPAY.</p>
                        {errorMessage && <p className="text-red-500 font-bold mb-8 text-sm">Cụ thể: {errorMessage}</p>}
                    </>
                )}
                <div className="space-y-3">
                    <Link
                        to="/my-bookings"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition"
                    >
                        Xem đơn đặt sân của tôi
                    </Link>
                    <Link to="/" className="block w-full border border-gray-200 hover:bg-gray-50 py-3.5 rounded-xl font-bold text-gray-600 transition">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
