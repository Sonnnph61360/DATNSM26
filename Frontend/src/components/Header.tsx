import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Map,
  BookOpen,
  LogIn,
  LogOut,
  User,
  Shield,
  CalendarDays,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Header() {
  const { user, loggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /** Nút kiểm tra quyền admin → vào /admin nếu đủ quyền */
  const goAdmin = () => {
    if (!loggedIn) {
      toast.error("Vui lòng đăng nhập trước");
      navigate("/login", { state: { from: "/admin" } });
      return;
    }
    if (isAdmin) {
      navigate("/admin");
    } else {
      toast.error("Tài khoản của bạn không có quyền Admin");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight flex items-center"
          >
            <span className="text-blue-700 uppercase tracking-widest mr-1">
              Golden
            </span>
            <span className="text-yellow-500 uppercase tracking-widest">
              State
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium text-gray-700">
            <Link
              to="/fields"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              Danh Sách
            </Link>
            <Link
              to="/map"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <Map className="w-4 h-4 mr-1.5" />
              Bản đồ
            </Link>
            <Link
              to="/blog"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Blog
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {loggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="hidden sm:flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Đơn của tôi
              </Link>

              {/* Nút Admin: luôn hiện khi đã login; chỉ vào được nếu có quyền */}
              <button
                type="button"
                onClick={goAdmin}
                className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg transition ${
                  isAdmin
                    ? "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                    : "text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200"
                }`}
                title={isAdmin ? "Vào trang quản trị" : "Kiểm tra quyền Admin"}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">
                  {isAdmin ? "Trang Admin" : "Admin"}
                </span>
              </button>

              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 max-w-[100px] truncate">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="hidden md:inline truncate">
                  {user?.fullName || user?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 px-2 py-1.5"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 flex items-center hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
