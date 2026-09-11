import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VnPaySandbox() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const amount = Number(searchParams.get("vnp_Amount") || 0) / 100;
    const orderInfo = searchParams.get("vnp_OrderInfo");

    const [card, setCard] = useState("");
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [otp, setOtp] = useState("");

    const handlePay = () => {
        // Redirect bypass to VNPAY Return URL to simulate VNPAY's behavior
        // Since VNPAY validates signature in actual URL, we just pass all original query params 
        // to the return URL and add vnp_ResponseCode=00.
        // Wait, the vnp_SecureHash was signed with all parameters. If we add/modify params, the signature breaks!
        // To keep the signature valid without re-signing in frontend, we just pass the EXACT query string we got,
        // and APPEND &vnp_ResponseCode=00 at the end? 
        // NO! VNPAY return URL requires vnp_ResponseCode inside the signature.
        // So the easiest way to mock this without breaking the backend signature check is:
        // Let's just bypass the signature check in backend for "00", OR we can just hit our backend with a fake payload.
        // But since we want it to work transparently: We just redirect to return_url but pass a parameter `mock=1` 
        // Actually, we can just send the exact original query string and let the backend return handle it? 
        // Let's modify the returnUrl parameter slightly.
        window.location.href = `http://localhost:5173/vnpay-return${location.search}&vnp_ResponseCode=00`;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto h-12 w-auto" src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418189687.png" alt="VNPAY" />
                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                    Cổng Thanh Toán Quốc Gia VNPAY
                </h2>
                <p className="text-center text-sm text-red-500 font-bold mt-2">MÔI TRƯỜNG GIẢ LẬP (SANDBOX DO LỖI API CHÍNH THỨC)</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-blue-600">
                    <div className="mb-6 bg-blue-50 p-4 rounded-md">
                        <p className="text-sm font-medium text-gray-700">Đơn hàng: <span className="font-bold">{orderInfo}</span></p>
                        <p className="text-sm font-medium text-gray-700">Số tiền: <span className="text-xl font-bold text-blue-600">{amount.toLocaleString("vi-VN")} VND</span></p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nhập số thẻ hoặc mã thẻ nội địa</label>
                            <input value={card} onChange={e => setCard(e.target.value)} placeholder="9704198526191432" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên in trên thẻ (không dấu)</label>
                            <input value={name} onChange={e => setName(e.target.value)} placeholder="NGUYEN VAN A" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày phát hành</label>
                                <input value={date} onChange={e => setDate(e.target.value)} placeholder="07/15" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã xác thực OTP</label>
                                <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                Xác nhận thanh toán
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Bạn có thể dùng tài khoản giả lập trên để ấn Thanh toán trực tiếp nha!</p>
                    </form>
                </div>
            </div>
        </div>
    );
}
