import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Map, MapPin, Calendar, Globe, Activity, Medal, ChevronDown, Loader2,
} from "lucide-react";
import banner2 from "../assets/banner2.jpg";
import { fetchFields, Field, formatCurrency } from "../lib/api";

export default function Home() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchFields()
      .then((data) => setFields(data.slice(0, 6)))
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="relative w-full pb-48 pt-20"
        style={{
          backgroundImage: `url(${banner2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-3 py-1 rounded-full mb-6">
              <Globe className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">
                Hơn {fields.length || "..."} cơ sở trên hệ thống
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-12">
              <Link
                to="/fields"
                className="bg-white text-gray-900 px-6 py-3.5 rounded-xl font-bold flex items-center hover:bg-gray-100 transition shadow-lg"
              >
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Tìm sân ngay
              </Link>
              <Link
                to="/fields"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3.5 rounded-xl font-bold flex items-center hover:bg-white/20 transition shadow-lg"
              >
                <Map className="w-5 h-5 mr-2" />
                Xem danh sách
              </Link>
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
            <div className="md:col-span-5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Địa điểm / tên sân
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Quận, phường, tên sân..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-medium"
              />
            </div>
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1" /> Loại sân
              </label>
              <div className="relative">
                <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3.5 appearance-none focus:outline-none font-medium">
                  <option>Tất cả</option>
                  <option>5x5</option>
                  <option>3x3</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="md:col-span-3">
              <Link
                to={`/fields${keyword ? `?q=${encodeURIComponent(keyword)}` : ""}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3.5 font-bold shadow-lg transition-all flex justify-center items-center"
              >
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
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                Cơ sở thể thao nổi bật
              </h2>
              <p className="text-gray-500">Dữ liệu lấy từ API (db.json)</p>
            </div>
            <Link
              to="/fields"
              className="text-sm font-medium text-gray-600 border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-200 bg-white"
            >
              Xem tất cả →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fields.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex flex-col hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden group">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs font-bold text-blue-600 mb-2">
                      {item.sportLabel}
                    </div>
                    <h3 className="font-extrabold text-lg text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mb-6">
                      <MapPin className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" />
                      <span className="line-clamp-1">{item.address}</span>
                    </p>
                    <div className="mt-auto">
                      <div className="text-right text-xs text-gray-500 font-medium mb-3">
                        {item.courtCount} sân · từ {formatCurrency(item.priceFrom)}
                      </div>
                      <Link
                        to={`/detail/${item.id}`}
                        className="w-full block text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl transition"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
