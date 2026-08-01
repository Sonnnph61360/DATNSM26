import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronDown,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  ImageOff,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types & mock data                                                         */
/* -------------------------------------------------------------------------- */

type SportKey =
  | "bong-da"
  | "bong-chuyen"
  | "bong-ro"
  | "bong-ban"
  | "tennis"
  | "cau-long"
  | "pickleball"
  | "khac";

interface Venue {
  id: number;
  name: string;
  location: string | null;
  fields: number;
  sport: SportKey;
  hasImage: boolean;
}

const SPORTS: { key: SportKey; label: string; icon: string; gradient: string }[] = [
  { key: "bong-da", label: "Bóng đá", icon: "⚽", gradient: "from-sky-500 to-emerald-600" },
  { key: "bong-chuyen", label: "Bóng chuyền", icon: "🏐", gradient: "from-amber-400 to-orange-500" },
  { key: "bong-ro", label: "Bóng rổ", icon: "🏀", gradient: "from-orange-500 to-red-600" },
  { key: "bong-ban", label: "Bóng bàn", icon: "🏓", gradient: "from-red-500 to-rose-600" },
  { key: "tennis", label: "Quần vợt (Tennis)", icon: "🎾", gradient: "from-lime-500 to-green-600" },
  { key: "cau-long", label: "Cầu lông", icon: "🏸", gradient: "from-teal-500 to-cyan-600" },
  { key: "pickleball", label: "Pickleball", icon: "🥒", gradient: "from-fuchsia-500 to-purple-600" },
  { key: "khac", label: "Khác", icon: "🎯", gradient: "from-slate-500 to-slate-700" },
];

const sportInfo = (key: SportKey) => SPORTS.find((s) => s.key === key)!;

const VENUES: Venue[] = [
  { id: 1, name: "002 PB Club", location: "Thủ Đức, Hồ Chí Minh", fields: 2, sport: "pickleball", hasImage: true },
  { id: 2, name: "3T PB Club Q8", location: "Quận 8, Hồ Chí Minh", fields: 2, sport: "bong-ban", hasImage: true },
  { id: 3, name: "9196 Sport Q8", location: "Quận 8, Hồ Chí Minh", fields: 1, sport: "bong-ban", hasImage: true },
  { id: 4, name: "ACE PB Club", location: "Đống Đa, Hà Nội", fields: 2, sport: "pickleball", hasImage: true },
  { id: 5, name: "Ace PB Q9", location: "Thủ Đức, Hồ Chí Minh", fields: 1, sport: "pickleball", hasImage: true },
  { id: 6, name: "Aiko Pickleball Phú Đô", location: "Hà Nội", fields: 2, sport: "pickleball", hasImage: false },
  { id: 7, name: "ALP PB Q12", location: "Quận 12, Hồ Chí Minh", fields: 2, sport: "pickleball", hasImage: true },
  { id: 8, name: "Amber PB Club", location: "Quận 1, Hồ Chí Minh", fields: 1, sport: "pickleball", hasImage: true },
  { id: 9, name: "Amber Pickleball Club", location: "Hồ Chí Minh", fields: 4, sport: "pickleball", hasImage: false },
  { id: 10, name: "Bad Bunny PB Q7", location: "Quận 7, Hồ Chí Minh", fields: 2, sport: "pickleball", hasImage: true },
  { id: 11, name: "BSB PB Club", location: "Thủ Đức, Hồ Chí Minh", fields: 1, sport: "pickleball", hasImage: true },
  { id: 12, name: "Bunker PB", location: "Hoàng Mai, Hà Nội", fields: 2, sport: "pickleball", hasImage: false },
  { id: 13, name: "BUNNE PB Home", location: "Long Biên, Hà Nội", fields: 2, sport: "pickleball", hasImage: true },
  { id: 14, name: "Chanh PB Q9", location: "Thủ Đức, Hồ Chí Minh", fields: 2, sport: "pickleball", hasImage: false },
  { id: 15, name: "Chi nhánh chính", location: null, fields: 1, sport: "khac", hasImage: false },
  { id: 16, name: "Chi nhánh chính", location: null, fields: 1, sport: "khac", hasImage: false },
];

const PAGE_SIZE = 10;
const TOTAL_VENUES_LABEL = 438; // tổng số cơ sở toàn hệ thống (hiển thị theo thiết kế gốc)
const TOTAL_PAGES_LABEL = 22;

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function Thumb({ venue }: { venue: Venue }) {
  const info = sportInfo(venue.sport);
  if (!venue.hasImage) {
    return (
      <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">
        <ImageOff className="h-7 w-7" />
      </div>
    );
  }
  return (
    <div
      className={`h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br ${info.gradient} flex items-center justify-center text-3xl shadow-sm`}
    >
      {info.icon}
    </div>
  );
}

function VenueCard({ venue, view }: { venue: Venue; view: "list" | "grid" }) {
  const info = sportInfo(venue.sport);

  if (view === "grid") {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 flex flex-col gap-3">
        <div
          className={`h-32 w-full rounded-lg flex items-center justify-center text-4xl ${venue.hasImage
              ? `bg-gradient-to-br ${info.gradient}`
              : "bg-gray-100 text-gray-300 border border-gray-200"
            }`}
        >
          {venue.hasImage ? info.icon : <ImageOff className="h-8 w-8" />}
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-gray-800">
            <span>{info.icon}</span>
            {venue.name}
          </div>
          {venue.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3 text-emerald-600" />
              {venue.location}
            </div>
          )}
        </div>
        <div className="text-xs font-medium text-gray-400">{venue.fields} sân</div>
        <div className="flex gap-2 mt-auto pt-1">
          <button className="flex-1 border border-emerald-600 text-emerald-600 text-sm font-semibold rounded-md py-1.5 hover:bg-emerald-50 transition">
            Chi tiết
          </button>
          <button className="flex-1 bg-emerald-600 text-white text-sm font-semibold rounded-md py-1.5 hover:bg-emerald-700 transition">
            Đặt sân
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 p-4">
      <Thumb venue={venue} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 font-semibold text-gray-800 truncate">
          <span>{info.icon}</span>
          <span className="truncate">{venue.name}</span>
        </div>
        {venue.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
            {venue.location}
          </div>
        )}
      </div>

      <div className="text-xs font-medium text-gray-400 whitespace-nowrap hidden sm:block">
        {venue.fields} sân
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button className="border border-emerald-600 text-emerald-600 text-sm font-semibold rounded-md px-4 py-1.5 hover:bg-emerald-50 transition">
          Chi tiết
        </button>
        <button className="bg-emerald-600 text-white text-sm font-semibold rounded-md px-4 py-1.5 hover:bg-emerald-700 transition">
          Đặt sân
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function TimSan() {
  const [keyword, setKeyword] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportKey | "all">("all");
  const [sortOrder, setSortOrder] = useState<"az" | "za">("az");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = VENUES.filter((v) => {
      const matchKeyword =
        keyword.trim() === "" ||
        v.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
        (v.location ?? "").toLowerCase().includes(keyword.trim().toLowerCase());
      const matchSport = selectedSport === "all" || v.sport === selectedSport;
      return matchKeyword && matchSport;
    });

    list = [...list].sort((a, b) =>
      sortOrder === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

    return list;
  }, [keyword, selectedSport, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
      {/* ---------------------------------------------------------------- Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-800">
            <span className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              ⚽
            </span>
            Sân<span className="text-emerald-600">Bóng</span>.vn
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/tim-san" className="flex items-center gap-1 text-emerald-600">
              <Search className="h-4 w-4" />
              Tìm sân
            </Link>
            <Link to="#" className="hover:text-emerald-600">Bản đồ</Link>
            <Link to="#" className="hover:text-emerald-600">Blog</Link>
            <Link to="#" className="flex items-center gap-1 hover:text-emerald-600">
              Loại sân
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="hover:text-emerald-600">Đăng nhập</Link>
            <Link
              to="#"
              className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------------- Header/title */}
      <div className="bg-emerald-900">
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 text-white">
          <div className="text-xs text-emerald-200 mb-2">
            <Link to="/" className="hover:underline">Trang chủ</Link> <span className="mx-1">›</span>
            <span className="text-white">Tìm sân</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            Tìm sân thể thao
          </h1>
          <p className="text-emerald-200 text-sm mt-1">
            Tìm thấy <span className="font-semibold text-white">{TOTAL_VENUES_LABEL} cơ sở</span> phù hợp
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------ Search bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-md px-3">
            <Search className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              type="text"
              placeholder="Tên sân, khu vực..."
              className="w-full py-2.5 text-sm focus:outline-none"
            />
          </div>

          <select
            value={selectedSport}
            onChange={(e) => {
              setSelectedSport(e.target.value as SportKey | "all");
              setPage(1);
            }}
            className="border border-gray-200 rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none md:w-56"
          >
            <option value="all">Tất cả loại sân</option>
            {SPORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>

          <select className="border border-gray-200 rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none md:w-56">
            <option>Tất cả tỉnh thành</option>
            <option>Hồ Chí Minh</option>
            <option>Hà Nội</option>
          </select>

          <button className="bg-emerald-600 text-white font-semibold rounded-md px-6 py-2.5 flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
            <Search className="h-4 w-4" />
            Tìm ngay
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Loại sân</h3>
              <button
                onClick={() => setSelectedSport("all")}
                className="text-xs text-emerald-600 hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedSport("all");
                  setPage(1);
                }}
                className={`w-full flex items-center gap-2 text-sm rounded-md px-3 py-2 transition ${selectedSport === "all"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <span>🏟️</span> Tất cả
              </button>
              {SPORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setSelectedSport(s.key);
                    setPage(1);
                  }}
                  className={`w-full flex items-center gap-2 text-sm rounded-md px-3 py-2 transition ${selectedSport === s.key
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Sắp xếp</h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "az" | "za")}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <option value="az">Tên A-Z</option>
              <option value="za">Tên Z-A</option>
            </select>
          </div>
        </aside>

        {/* Results */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filtered.length} cơ sở</span> · Trang{" "}
              {currentPage}/{totalPages}
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded ${view === "list" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded ${view === "grid" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
              Không tìm thấy cơ sở phù hợp.
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {paginated.map((v) => (
                <VenueCard key={v.id} venue={v} view={view} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.slice(0, 5).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium ${n === currentPage
                    ? "bg-emerald-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {n}
              </button>
            ))}
            {totalPages > 5 && (
              <>
                <span className="px-1 text-gray-400">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>

      {/* --------------------------------------------------------------- Footer */}
      <footer className="bg-emerald-950 text-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-white mb-3">
              <span className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">⚽</span>
              Sân<span className="text-emerald-400">Bóng</span>.vn
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed">
              Nền tảng đặt sân thể thao trực tuyến hàng đầu Việt Nam. Kết nối người chơi với hơn{" "}
              {TOTAL_VENUES_LABEL} sân thể thao tốt nhất cả nước.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Globe className="h-4 w-4 hover:text-white cursor-pointer" />
              <span className="h-4 w-4 hover:text-white cursor-pointer text-xs font-bold">TT</span>
              <Mail className="h-4 w-4 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">KHÁM PHÁ</h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link to="/tim-san" className="hover:text-white">Tìm sân</Link></li>
              <li><Link to="#" className="hover:text-white">Bản đồ</Link></li>
              <li><Link to="#" className="hover:text-white">Sân bóng đá</Link></li>
              <li><Link to="#" className="hover:text-white">Sân tennis</Link></li>
              <li><Link to="#" className="hover:text-white">Sân cầu lông</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">HỖ TRỢ</h4>
            <ul className="space-y-2 text-sm text-emerald-300">
              <li><Link to="#" className="hover:text-white">Hướng dẫn đặt sân</Link></li>
              <li><Link to="#" className="hover:text-white">Câu hỏi thường gặp</Link></li>
              <li><Link to="#" className="hover:text-white">Liên hệ</Link></li>
              <li><Link to="#" className="hover:text-white">Chính sách hoàn tiền</Link></li>
              <li><Link to="#" className="hover:text-white">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4 tracking-wide">ĐĂNG KÝ NHẬN ƯU ĐÃI</h4>
            <p className="text-sm text-emerald-300 mb-3">
              Nhận ngay voucher giảm 20% cho lần đặt sân đầu tiên
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 min-w-0 rounded-l-md px-3 py-2 text-sm text-gray-800 focus:outline-none"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 rounded-r-md transition">
                Đăng ký
              </button>
            </div>
            <p className="text-xs text-emerald-400 mt-4">Hotline hỗ trợ 24/7</p>
            <p className="text-white font-semibold">081 22 88 111</p>
          </div>
        </div>

        <div className="border-t border-emerald-900">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-400">
            <span>© 2026 SânBóng.vn - All rights reserved.</span>
            <span>Bảo mật · Điều khoản · Liên hệ ngay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
