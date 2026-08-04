import { Link, useNavigate } from "react-router-dom";
import { Search, Map, BookOpen, LayoutGrid, ChevronDown, LogIn, Store, LogOut, User as UserIcon } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center">
                        <span className="text-blue-700 uppercase tracking-widest mr-1">Golden</span>
                        <span className="text-yellow-500 uppercase tracking-widest">State</span>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
                        <Link to="/fields" className="flex items-center hover:text-blue-600 transition-colors">
                            Danh Sách
                        </Link>
                        <Link to="#" className="flex items-center hover:text-blue-600 transition-colors">
                            <Map className="w-4 h-4 mr-1.5" />
                            Bản đồ
                        </Link>
                        <Link to="/blog" className="flex items-center hover:text-blue-600 transition-colors">
                            <BookOpen className="w-4 h-4 mr-1.5" />
                            Blog
                        </Link>
                        <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                            Loại sân
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </div>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700 flex items-center">
                                <UserIcon className="w-4 h-4 mr-2" />
                                Xin chào, {user.fullName || user.email}
                            </span>
                            <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700 transition flex items-center">
                                <LogOut className="w-4 h-4 mr-1" /> Thoát
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-gray-700 flex items-center hover:text-blue-600 transition-colors">
                                <LogIn className="w-4 h-4 mr-1.5" />
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                                Đăng ký
                            </Link>
                        </>
                    )}
                    <Link to="#" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center shadow-sm transition-colors cursor-pointer">
                        <Store className="w-4 h-4 mr-2" />
                        Chủ Sân
                    </Link>
                </div>
            </div>
        </header>
    );
}
