import { Link } from "react-router-dom";
import { Search, Map, BookOpen, LayoutGrid, ChevronDown, LogIn, Store } from "lucide-react";

type HeaderProps = {
    onOpenLogin: () => void;
};

export default function Header({ onOpenLogin }: HeaderProps) {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center">
                        <span className="text-blue-700 uppercase tracking-widest mr-1">Golden</span>
                        <span className="text-yellow-500 uppercase tracking-widest">State</span>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
                        <Link to="#" className="flex items-center hover:text-blue-600 transition-colors">
                            <Search className="w-4 h-4 mr-1.5" />
                            Tìm sân
                        </Link>
                        <Link to="#" className="flex items-center hover:text-blue-600 transition-colors">
                            <Map className="w-4 h-4 mr-1.5" />
                            Bản đồ
                        </Link>
                        <Link to="#" className="flex items-center hover:text-blue-600 transition-colors">
                            <BookOpen className="w-4 h-4 mr-1.5" />
                            Blog
                        </Link>
                        <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                            <LayoutGrid className="w-4 h-4 mr-1.5" />
                            Phần mềm quản lý
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </div>
                        <div className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                            Loại sân
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </div>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={onOpenLogin}
                        className="text-sm font-medium text-gray-700 flex items-center hover:text-green-600 transition-colors"
                    >
                        <LogIn className="w-4 h-4 mr-1.5" />
                        Đăng nhập
                    </button>
                    <Link to="#" className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors">
                        Đăng ký
                    </Link>
                    <Link to="#" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center shadow-sm transition-colors cursor-pointer">
                        <Store className="w-4 h-4 mr-2" />
                        Chủ Sân
                    </Link>
                </div>
            </div>
        </header>
    );
}
