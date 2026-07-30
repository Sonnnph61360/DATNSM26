///detail
import { Link } from "react-router-dom";
import {
    Heart, Share2, MapPin, Clock, Phone, LayoutGrid, CheckCircle2,
    CalendarDays, Map
} from "lucide-react";

export default function Detail() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* BREADCRUMB */}
            <div className="text-sm font-medium text-gray-400 flex items-center space-x-2 mb-6">
                <Link to="/" className="text-blue-600 hover:underline">Trang chủ</Link>
                <span>/</span>
                <Link to="/" className="text-blue-600 hover:underline">Tìm sân</Link>
                <span>/</span>
                <span className="text-gray-600">002 PB Club</span>
            </div>

            {/* HERO BANNER */}
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-3xl overflow-hidden mb-8 relative">
                <img src="https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Banner" className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Info Box */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center text-xs font-bold text-gray-700">
                                <span className="text-[10px] mr-2">🏓</span> Pickleball
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex items-center border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
                                    <Heart className="w-3.5 h-3.5 mr-1.5" /> Lưu
                                </button>
                                <button className="flex items-center border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
                                    <Share2 className="w-3.5 h-3.5 mr-1.5" /> Chia sẻ
                                </button>
                            </div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">002 PB Club</h1>
                        <p className="text-gray-500 font-medium flex items-start mb-6 text-sm">
                            <MapPin className="w-4 h-4 mr-1.5 text-blue-600 flex-shrink-0 mt-0.5" /> Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                        </p>

                        <div className="flex flex-wrap gap-y-4 gap-x-6 text-sm font-medium text-gray-700">
                            <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-gray-400" /> Mở cửa: <span className="font-bold ml-1">06:00 - 22:00</span></div>
                            <div className="flex items-center"><Phone className="w-4 h-4 mr-1.5 text-blue-600" /> Hotline: <span className="font-bold text-blue-600 ml-1">0987400019</span></div>
                            <div className="flex items-center"><LayoutGrid className="w-4 h-4 mr-1.5 text-gray-400" /> Quy mô: <span className="font-bold ml-1">2 sân</span></div>
                            <div className="flex items-center text-blue-600"><CheckCircle2 className="w-4 h-4 mr-1.5" /> Đang hoạt động</div>
                        </div>

                        <hr className="my-8 border-gray-100" />

                        <h3 className="font-extrabold text-gray-900 mb-4 text-lg">Giới thiệu</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Cơ sở thể thao chất lượng.
                        </p>
                    </div>

                    {/* Sân List */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-blue-700 mb-4 flex items-center">
                            <LayoutGrid className="w-4 h-4 mr-2" /> Danh sách sân (2)
                        </h3>
                        <div className="flex gap-4">
                            <div className="border border-gray-100 rounded-xl px-4 py-2 flex items-center text-sm font-semibold shadow-sm">
                                <span className="text-pink-500 mr-2">🏓</span> Sân PB 1 <span className="text-gray-400 text-xs ml-1 font-normal">(4 người)</span>
                            </div>
                            <div className="border border-gray-100 rounded-xl px-4 py-2 flex items-center text-sm font-semibold shadow-sm">
                                <span className="text-pink-500 mr-2">🏓</span> Sân PB 2 <span className="text-gray-400 text-xs ml-1 font-normal">(4 người)</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center font-extrabold text-gray-900">
                            <span className="text-blue-600 mr-2">🏷️</span> Bảng giá thuê sân
                        </div>
                        <table className="w-full text-sm font-semibold">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="py-3 px-6 text-left">Khung giờ</th>
                                    <th className="py-3 px-6 text-center">Thứ 2-6</th>
                                    <th className="py-3 px-6 text-center">Thứ 7-CN</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 px-6 text-left font-medium">06:00 - 09:00</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">100K/h</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">130K/h</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 px-6 text-left font-medium">09:00 - 12:00</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">130K/h</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">160K/h</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 px-6 text-left font-medium">12:00 - 17:00</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">130K/h</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">160K/h</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 text-left font-medium">17:00 - 22:00</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">200K/h</td>
                                    <td className="py-4 px-6 text-center text-blue-600 font-extrabold">250K/h</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="bg-gray-50 text-gray-400 text-xs py-3 px-6 italic">
                            ℹ Giá đã bao gồm thuế sân và đèn chiếu sáng.
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-blue-700 mb-6 flex items-center">
                            <Clock className="w-5 h-5 mr-2" /> Lịch trống hôm nay
                        </h3>

                        {/* Sân 1 */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-extrabold flex items-center text-gray-900"><span className="text-pink-500 mr-2">🏓</span> Sân PB 1</div>
                                <div className="font-extrabold text-blue-600 text-sm">100K/h</div>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                                    <div key={t} className="border border-gray-200 rounded-lg py-2 text-center text-xs font-bold text-gray-700 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:text-blue-600 transition">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sân 2 */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-extrabold flex items-center text-gray-900"><span className="text-pink-500 mr-2">🏓</span> Sân PB 2</div>
                                <div className="font-extrabold text-blue-600 text-sm">100K/h</div>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(t => (
                                    <div key={t} className="border border-gray-200 rounded-lg py-2 text-center text-xs font-bold text-gray-700 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:text-blue-600 transition">
                                        {t}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center space-x-6 mt-6 text-xs font-bold text-gray-500">
                                <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-sm mr-2" /> Trống</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-gray-200 rounded-sm mr-2" /> Đã đặt</div>
                            </div>

                            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center transition shadow-lg shadow-green-500/20">
                                <CalendarDays className="w-4 h-4 mr-2" /> Đặt sân ngay
                            </button>
                        </div>
                    </div>

                    {/* Map area */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-extrabold text-blue-700 mb-6 flex items-center">
                            <Map className="w-5 h-5 mr-2" /> Vị trí
                        </h3>
                        <div className="bg-gray-200 h-64 rounded-2xl w-full mb-4 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="map" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-md relative group cursor-pointer border border-blue-500 text-gray-900">
                                    002 PB Club
                                </div>
                                <div className="w-6 h-6 bg-green-500 mx-auto rounded-full mt-1 border-2 border-white shadow-md flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="border border-blue-500 text-blue-600 px-4 py-2 rounded-full text-sm font-bold flex items-center hover:bg-green-50 transition">
                                <MapPin className="w-4 h-4 mr-2" /> Chỉ đường
                            </button>
                            <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-bold flex items-center hover:bg-gray-50 transition">
                                <Map className="w-4 h-4 mr-2" /> Xem bản đồ
                            </button>
                        </div>
                    </div>


                </div>

                {/* RIGHT COLUMN (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        {/* Booking Box */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                            <div className="text-2xl font-extrabold text-blue-600 mb-6">2 sân</div>

                            <div className="space-y-4 mb-8 text-sm font-semibold">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500">Ngày đặt</span>
                                    <span className="text-gray-900">Chọn ngày</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500">Giờ đặt</span>
                                    <span className="text-gray-900">Chọn giờ</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-gray-500">Thời lượng</span>
                                    <span className="text-gray-900">1 giờ</span>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center transition shadow-lg shadow-green-500/20 mb-3">
                                <CalendarDays className="w-5 h-5 mr-2" /> Đặt sân ngay
                            </button>

                            <button className="w-full bg-white border-2 border-blue-500 hover:bg-green-50 text-blue-600 py-3.5 rounded-xl font-bold flex justify-center items-center transition">
                                <Phone className="w-5 h-5 mr-2" /> Gọi: 0987400019
                            </button>

                            <div className="text-center mt-4 text-xs font-semibold text-gray-400">
                                🛡️ Đặt cọc an toàn - Hủy trước 2h miễn phí
                            </div>
                        </div>

                        {/* Contact Box */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="font-extrabold text-gray-900 mb-6 text-sm">Thông tin liên hệ</h3>
                            <div className="space-y-4 text-sm font-medium text-gray-600">
                                <div className="flex items-center text-blue-600 font-bold"><Phone className="w-4 h-4 mr-2" /> 0987400019</div>
                                <div className="flex items-start"><MapPin className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" /> Trịnh Văn Bô, Hà Nội</div>
                                <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-600" /> 06:00 - 22:00 hàng ngày</div>
                            </div>

                            <button className="w-full mt-6 bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 py-2.5 rounded-full text-xs font-bold flex justify-center items-center transition">
                                <Phone className="w-3.5 h-3.5 mr-2" /> Liên hệ chủ sân
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* FLOAT CHAT BUTTON */}
            <button className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full font-bold shadow-xl flex items-center hover:bg-blue-700 transition z-50">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span> Chat với chủ sân
            </button>

        </div>
    )
}
