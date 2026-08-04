import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { fetchFields, Field, formatCurrency } from "../lib/api";
import toast from "react-hot-toast";

declare global {
  interface Window {
    L: any;
  }
}

function loadLeaflet(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Không tải được Leaflet"));
    document.body.appendChild(script);
  });
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchFields()
      .then((data) => setFields(data))
      .catch(() => {
        toast.error("Không tải được danh sách sân");
        setFields([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current || fields.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || !mapRef.current) return;

        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        const withCoords = fields.filter(
          (f) => typeof f.lat === "number" && typeof f.lng === "number"
        );
        if (withCoords.length === 0) {
          toast.error("Chưa có tọa độ lat/lng trong db.json");
          return;
        }

        const center: [number, number] = [
          withCoords[0].lat!,
          withCoords[0].lng!,
        ];
        const map = L.map(mapRef.current).setView(center, 12);
        mapInstance.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        }).addTo(map);

        const bounds: [number, number][] = [];

        withCoords.forEach((f) => {
          const marker = L.marker([f.lat!, f.lng!]).addTo(map);
          bounds.push([f.lat!, f.lng!]);
          marker.bindPopup(`
            <div style="min-width:180px">
              <strong style="font-size:14px">${f.name}</strong><br/>
              <span style="color:#666;font-size:12px">${f.address}</span><br/>
              <span style="font-size:12px;color:#2563eb">${f.sportLabel} · từ ${formatCurrency(f.priceFrom)}</span><br/>
              <a href="/detail/${f.id}" style="color:#16a34a;font-weight:600;font-size:12px">Xem chi tiết →</a>
            </div>
          `);
          marker.on("click", () => setSelectedId(f.id));
        });

        if (bounds.length > 1) {
          map.fitBounds(bounds, { padding: [40, 40] });
        }
      } catch {
        toast.error("Lỗi khởi tạo bản đồ");
      }
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading, fields]);

  const focusField = (f: Field) => {
    setSelectedId(f.id);
    if (mapInstance.current && f.lat != null && f.lng != null && window.L) {
      mapInstance.current.setView([f.lat, f.lng], 15);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-blue-600" />
          Bản đồ sân thể thao
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Các điểm lấy từ <code className="text-xs bg-gray-100 px-1 rounded">lat/lng</code> trong
          db.json — bạn có thể tự chỉnh khi đổi địa chỉ.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => focusField(f)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition hover:shadow-md ${
                  selectedId === f.id
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-100"
                }`}
              >
                <div className="font-bold text-gray-900">{f.name}</div>
                <div className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  {f.address}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {f.sportLabel} · {f.lat != null ? `${f.lat}, ${f.lng}` : "Chưa có tọa độ"}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/detail/${f.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Chi tiết
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${
                      f.lat != null ? `${f.lat},${f.lng}` : encodeURIComponent(f.address)
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <Navigation className="w-3 h-3" /> Chỉ đường
                  </a>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div
              ref={mapRef}
              className="w-full h-[70vh] min-h-[400px] rounded-2xl border border-gray-200 overflow-hidden bg-gray-100 z-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
