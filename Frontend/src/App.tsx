import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white text-gray-700 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <img 
              src="logo.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6 font-medium text-sm">
            <Link to="#" className="hover:text-emerald-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm sân
            </Link>
            <Link to="#" className="hover:text-emerald-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Blog
            </Link>
            
            <div className="relative group cursor-pointer h-16 flex items-center">
              <span className="hover:text-emerald-600 flex items-center gap-1">
                Loại sân
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              
              <div className="absolute top-16 left-0 hidden group-hover:block bg-white shadow-lg rounded-md py-2 w-40 border border-gray-100 z-50">
                <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                  Sân 5x5
                </Link>
                <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600">
                  Sân 3x3
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
            <Link to="/login" className="hover:text-emerald-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Đăng nhập
            </Link>
            <Link to="#" className="hover:text-emerald-600">
              Đăng ký
            </Link>
          </div>
        </div>
      </nav>

      <div 
        className="relative w-full h-[500px] bg-emerald-800 flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url('Banner.png')` }} 
      >
        <div className="absolute inset-0 bg-emerald-900/80"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="inline-block bg-white/20 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-emerald-400/30">
             <span className="mr-1">◎</span> HƠN 400 CƠ SỞ TRÊN TOÀN QUỐC
          </div>
          <div className="flex space-x-4 mb-12">
            <button className="bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Tìm sân ngay
            </button>
            <button className="border border-white text-white font-semibold px-6 py-2.5 rounded-md flex items-center gap-2 hover:bg-white/10 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Xem bản đồ
            </button>
          </div>

          <div className="flex gap-10 text-white">
            <div>
              <div className="text-2xl font-bold">400</div>
              <div className="text-emerald-200 text-sm">Cơ sở</div>
            </div>
            <div>
              <div className="text-2xl font-bold">850</div>
              <div className="text-emerald-200 text-sm">Sân thể thao</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-emerald-200 text-sm">Loại sân</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-16 mb-20">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Tìm sân thể thao ngay
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                ĐỊA ĐIỂM
              </label>
              <input 
                type="text" 
                placeholder="Quận, phường, khu vực..." 
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                LOẠI SÂN
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white">
                <option value="">Tất cả loại sân</option>
                <option value="5x5">Sân 5x5 tiêu chuẩn</option>
                <option value="3x3">3x3 Sân nhỏ</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                NGÀY & GIỜ
              </label>
              <input 
                type="datetime-local" 
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-600"
              />
            </div>

            <div className="w-full">
              <button className="w-full bg-emerald-600 text-white font-semibold rounded-md p-2.5 flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;