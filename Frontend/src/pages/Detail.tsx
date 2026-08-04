import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Heart, Share2, MapPin, Clock, Phone, LayoutGrid, CheckCircle2,
  CalendarDays, Map, Loader2,
} from "lucide-react";
import { api, Court, Field, formatCurrency, TIME_SLOTS, getBookingsByDate, Booking } from "../lib/api";
import toast from "react-hot-toast";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [bookedByCourt, setBookedByCourt] = useState<Record<number, Booking[]>>({});

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [fRes, cRes] = await Promise.all([
          api.get<Field>(`/fields/${id}`),
          api.get<Court[]>(`/courts`, { params: { fieldId: id } }),
        ]);
        setField(fRes.data);
        setCourts(cRes.data);
      } catch {
        toast.error("Không tìm thấy cơ sở");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!courts.length || !selectedDate) return;
    let cancelled = false;
    (async () => {
      try {
        // 1 request cho cả ngày, lọc theo courtId ở client
        const list = await getBookingsByDate(selectedDate);
        if (cancelled) return;
        const map: Record<number, Booking[]> = {};
        for (const c of courts) {
          map[c.id] = list.filter(
            (b) => b.courtId === c.id && b.status !== "cancelled"
          );
        }
        setBookedByCourt(map);
      } catch {
        if (!cancelled) setBookedByCourt({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courts, selectedDate]);

  const isBooked = (courtId: number, slot: string) => {
    const list = bookedByCourt[courtId] || [];
    return list.some((b) => {
      const start = b.time;
      const [h, m] = start.split(":").map(Number);
      const startMin = h * 60 + m;
      const endMin = startMin + b.duration * 60;
      const [sh, sm] = slot.split(":").map(Number);
      const slotMin = sh * 60 + sm;
      return slotMin >= startMin && slotMin < endMin;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!field) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Không tìm thấy cơ sở</p>
        <Link to="/fields" className="text-blue-600 font-semibold">
          ← Quay lại tìm sân
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm font-medium text-gray-400 flex items-center space-x-2 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Trang chủ</Link>
        <span>/</span>
        <Link to="/fields" className="text-blue-600 hover:underline">Tìm sân</Link>
        <span>/</span>
        <span className="text-gray-600">{field.name}</span>
      </div>

      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-3xl overflow-hidden mb-8 relative">
        <img src={field.image} alt={field.name} className="w-full h-full object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center text-xs font-bold text-gray-700">
                {field.sportLabel}
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50">
                  <Heart className="w-3.5 h-3.5 mr-1.5" /> Lưu
                </button>
                <button className="flex items-center border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-50">
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Chia sẻ
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{field.name}</h1>
            <p className="text-gray-500 font-medium flex items-start mb-6 text-sm">
              <MapPin className="w-4 h-4 mr-1.5 text-blue-600 flex-shrink-0 mt-0.5" />
              {field.address}
            </p>

            <div className="flex flex-wrap gap-y-4 gap-x-6 text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" /> Mở cửa:{" "}
                <span className="font-bold ml-1">
                  {field.openTime} - {field.closeTime}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1.5 text-blue-600" /> Hotline:{" "}
                <span className="font-bold text-blue-600 ml-1">{field.phone}</span>
              </div>
              <div className="flex items-center">
                <LayoutGrid className="w-4 h-4 mr-1.5 text-gray-400" /> Quy mô:{" "}
                <span className="font-bold ml-1">{courts.length} sân</span>
              </div>
              <div className="flex items-center text-blue-600">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Đang hoạt động
              </div>
            </div>

            <hr className="my-8 border-gray-100" />
            <h3 className="font-extrabold text-gray-900 mb-4 text-lg">Giới thiệu</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{field.description}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-blue-700 mb-4 flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2" /> Danh sách sân ({courts.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {courts.map((c) => (
                <div
                  key={c.id}
                  className="border border-gray-100 rounded-xl px-4 py-2 flex items-center text-sm font-semibold shadow-sm"
                >
                  {c.name}
                  <span className="text-gray-400 text-xs ml-2 font-normal">
                    {formatCurrency(c.price)}/h
                  </span>
                  {c.status === "maintenance" && (
                    <span className="ml-2 text-xs text-orange-500">Bảo trì</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="font-extrabold text-blue-700 flex items-center">
                <Clock className="w-5 h-5 mr-2" /> Lịch trống
              </h3>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>

            {courts
              .filter((c) => c.status === "active")
              .map((c) => (
                <div key={c.id} className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="font-extrabold text-gray-900">{c.name}</div>
                    <div className="font-extrabold text-blue-600 text-sm">
                      {formatCurrency(c.price)}/h
                    </div>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const booked = isBooked(c.id, t);
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={booked}
                          onClick={() =>
                            navigate(
                              `/booking?fieldId=${field.id}&courtId=${c.id}&date=${selectedDate}&time=${t}`
                            )
                          }
                          className={`rounded-lg py-2 text-center text-xs font-bold border transition ${
                            booked
                              ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                              : "border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            <div className="flex items-center space-x-6 mt-2 text-xs font-bold text-gray-500">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-2" /> Trống
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded-sm mr-2" /> Đã đặt
              </div>
            </div>

            <button
              onClick={() => navigate(`/booking?fieldId=${field.id}`)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex justify-center items-center transition shadow-lg"
            >
              <CalendarDays className="w-4 h-4 mr-2" /> Đặt sân ngay
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-extrabold text-blue-700 mb-4 flex items-center">
              <Map className="w-5 h-5 mr-2" /> Vị trí
            </h3>
            <p className="text-sm text-gray-600 mb-4 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600 shrink-0" />
              {field.address}
            </p>
            {/* Google Maps embed */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-200 mb-4 bg-gray-100">
              <iframe
                title={`Bản đồ ${field.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  field.address + ", " + (field.city || "Việt Nam")
                )}&z=15&output=embed`}
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  field.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-blue-500 text-blue-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition"
              >
                <MapPin className="w-4 h-4 mr-2" /> Chỉ đường
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  field.address
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition"
              >
                <Map className="w-4 h-4 mr-2" /> Mở Google Maps
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="text-2xl font-extrabold text-blue-600 mb-2">
                từ {formatCurrency(field.priceFrom)}
              </div>
              <div className="text-sm text-gray-500 mb-6">/ giờ · {courts.length} sân</div>
              <button
                onClick={() => navigate(`/booking?fieldId=${field.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex justify-center items-center transition mb-3"
              >
                <CalendarDays className="w-5 h-5 mr-2" /> Đặt sân ngay
              </button>
              <a
                href={`tel:${field.phone}`}
                className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3.5 rounded-xl font-bold flex justify-center items-center"
              >
                <Phone className="w-5 h-5 mr-2" /> Gọi: {field.phone}
              </a>
              <div className="text-center mt-4 text-xs font-semibold text-gray-400">
                🛡️ Đặt cọc an toàn - Hủy trước 2h miễn phí
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
