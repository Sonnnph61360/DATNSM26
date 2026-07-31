import { Link } from "react-router-dom";
import {
    Search,
    Map,
    MapPin,
    Calendar,
    Globe,
    Activity,
    Medal,
    ChevronDown
} from "lucide-react";

import banner2 from "../assets/banner2.jpg";

export default function Home() {
    return (
        <>
            <section className="relative w-full pb-48 pt-20" style={{
                backgroundImage: `url(${banner2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-3 py-1 rounded-full mb-6">
                            <Globe className="w-4 h-4 text-blue-400 mr-2" />
                            <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">Hơn 438 cơ sở trên toàn quốc</span>
                        </div>
                        <div className="flex items-center space-x-4 mb-12">
                            <button className="bg-white text-gray-900 px-6 py-3.5 rounded-xl font-bold flex items-center hover:bg-gray-100 transition shadow-lg">
                                <Search className="w-5 h-5 mr-2 text-blue-600" />
                                Tìm sân ngay
                            </button>
                            <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold flex items-center hover:bg-white/20 transition shadow-lg">
                                <Map className="w-5 h-5 mr-2" />
                                Xem bản đồ
                            </button>
                        </div>

                        <div className="flex items-center space-x-12">
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">607</div>
                                <div className="text-sm font-medium text-gray-300">Cơ sở</div>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">850</div>
                                <div className="text-sm font-medium text-gray-300">Sân thể thao</div>
                            </div>
                            <div>
                                <div className="text-4xl font-extrabold text-white mb-1">2</div>
                                <div className="text-sm font-medium text-gray-300">Loại sân tiêu chuẩn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 relative -mt-24 z-20">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-900 font-bold text-lg mb-6">
                        <Search className="w-5 h-5 text-[#10b981]" />
                        <span>Tìm sân thể thao ngay</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                                <MapPin className="w-3.5 h-3.5 mr-1" /> Địa điểm
                            </label>
                            <input type="text" placeholder="Quận, phường, khu vực..." className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium" />
                        </div>

                        <div className="md:col-span-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                                <Activity className="w-3.5 h-3.5 mr-1" /> Loại sân
                            </label>
                            <div className="relative">
                                <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium">
                                    <option>Sân 5X5</option>
                                    <option>SÂN 3X3</option>
                                </select>
                                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1" /> Ngày & giờ
                            </label>
                            <div className="relative">
                                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium [&::-webkit-calendar-picker-indicator]:opacity-0" />
                                <Calendar className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <div className="md:col-span-2 text-right">
                            <Link to="/detail" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3.5 font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center">
                                <Search className="w-4 h-4 mr-2" /> Tìm ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-gray-100 py-20 pb-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <div className="inline-flex items-center bg-green-200/50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                                <Medal className="w-3.5 h-3.5 mr-1" /> Nổi bật
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Cơ sở thể thao nổi bật</h2>
                            <p className="text-gray-500">Các cơ sở chất lượng cao được người dùng yêu thích</p>
                        </div>
                        <Link to="#" className="text-sm font-medium text-gray-600 border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-200 hover:text-gray-900 transition flex items-center bg-white">
                            Xem tất cả <span className="ml-2 font-black">&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { id: 1, name: "002 PB Club", dist: "Trịnh Văn Bô, Nam Từ Liêm, Hà Nội" },
                            { id: 2, name: "3T PB Club Q8", dist: "Trịnh Văn Bô, Nam Từ Liêm, Hà Nội" },
                            { id: 3, name: "9196 Sport Q8", dist: "Trịnh Văn Bô, Nam Từ Liêm, Hà Nội" }
                        ].map(item => (
                            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col hover:shadow-xl transition-shadow cursor-pointer">
                                <div className="h-48 bg-gray-200 relative overflow-hidden group">
                                    <img src={`https://images.unsplash.com/photo-1593341646782-e0b495cff86d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} alt="Minion" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-[10px]">🏓</span>
                                    </div>
                                    <h3 className="font-extrabold text-lg text-gray-900 mb-2">{item.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center mb-6">
                                        <MapPin className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" /> <span className="line-clamp-1">{item.dist}</span>
                                    </p>

                                    <div className="mt-auto">
                                        <div className="text-right text-xs text-gray-500 font-medium mb-3">2 sân</div>
                                        <Link to="/detail" className="w-full block text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl transition">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}