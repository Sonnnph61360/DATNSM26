import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#111827] text-gray-400 py-16 text-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="text-2xl font-extrabold tracking-tight mb-4 uppercase">
                            <span className="text-blue-500">Golden</span>
                            <span className="text-yellow-500">State</span>
                        </div>
                        <p className="mb-6 leading-relaxed">
                            Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam. Kết nối người chơi với hơn 2,400 sân tốt nhất trên cả nước.
                        </p>
                        <div className="flex space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition">
                                <span className="text-white text-xs">f</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition">
                                <span className="text-white text-xs">t</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition">
                                <span className="text-white text-xs">y</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Khám phá</h3>
                        <ul className="space-y-3">
                            <li><Link to="#" className="hover:text-white transition">Tìm sân</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Bản đồ</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Sân bóng đá</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Sân tennis</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Sân cầu lông</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Hỗ trợ</h3>
                        <ul className="space-y-3">
                            <li><Link to="#" className="hover:text-white transition">Hướng dẫn đặt sân</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Câu hỏi thường gặp</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Liên hệ</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Chính sách hoàn tiền</Link></li>
                            <li><Link to="#" className="hover:text-white transition">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Đăng ký nhận ưu đãi</h3>
                        <p className="mb-4">Nhận ngay voucher giảm 20% cho lần đặt sân đầu tiên</p>
                        <div className="flex mb-6">
                            <input type="email" placeholder="Email của bạn" className="bg-gray-800 border-none outline-none px-4 py-2 rounded-l-md w-full text-white text-sm" />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md font-bold transition">Đăng ký</button>
                        </div>
                        <p className="mb-1 text-xs">Hotline hỗ trợ 24/7</p>
                        <p className="text-blue-500 font-bold text-lg">081 22 88 111</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>© 2026 Golden State - All rights reserved.</p>
                    <p>Đăng ký chủ sân?</p>
                </div>
            </div>
        </footer>
    );
}
