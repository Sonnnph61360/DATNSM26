import { Link } from "react-router-dom";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";

const sections = [
  ["collect", "1. Thông tin chúng tôi thu thập"],
  ["use", "2. Cách chúng tôi sử dụng thông tin"],
  ["share", "3. Chia sẻ thông tin"],
  ["security", "4. Bảo mật và lưu trữ"],
  ["rights", "5. Quyền của bạn"],
];

export default function Privacy() {
  return (
    <div className="bg-slate-50 px-4 py-10 text-slate-800 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
        <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"><div className="mb-4 flex items-center gap-2 font-extrabold text-slate-900"><LockKeyhole className="h-5 w-5 text-blue-600" /> Mục lục</div><nav className="space-y-2">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-blue-50 hover:text-blue-700">{label}</a>)}</nav></aside>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14">
            <div className="border-b border-slate-100 pb-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Golden State</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Chính sách bảo mật</h1><p className="mt-4 text-sm leading-7 text-slate-500">Cập nhật lần cuối: 12 tháng 09, 2026</p></div>
            <div className="prose prose-slate mt-8 max-w-none text-sm leading-7"><section id="collect"><h2 className="text-xl font-extrabold text-slate-900">1. Thông tin chúng tôi thu thập</h2><p>Golden State thu thập thông tin cần thiết để cung cấp dịch vụ đặt sân, bao gồm họ tên, email, số điện thoại, thông tin đơn đặt sân và dữ liệu giao dịch.</p><p>Khi bạn sử dụng website, một số dữ liệu kỹ thuật như loại thiết bị, trình duyệt và nhật ký truy cập có thể được ghi nhận nhằm cải thiện hiệu năng và an toàn hệ thống.</p></section><section id="use" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">2. Cách chúng tôi sử dụng thông tin</h2><ul className="list-disc space-y-2 pl-5"><li>Xác nhận, quản lý và hỗ trợ các đơn đặt sân.</li><li>Gửi thông báo về giao dịch, thay đổi lịch hoặc yêu cầu hỗ trợ.</li><li>Cải thiện sản phẩm, cá nhân hóa trải nghiệm và ngăn chặn gian lận.</li><li>Gửi thông tin ưu đãi khi bạn đồng ý nhận thông báo tiếp thị.</li></ul></section><section id="share" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">3. Chia sẻ thông tin</h2><p>Golden State chỉ chia sẻ thông tin cần thiết với cơ sở thể thao để hoàn tất đơn đặt sân và với đối tác thanh toán để xử lý giao dịch. Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.</p><p>Thông tin có thể được cung cấp cho cơ quan có thẩm quyền khi pháp luật yêu cầu hoặc để bảo vệ quyền lợi hợp pháp của người dùng và Golden State.</p></section><section id="security" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">4. Bảo mật và lưu trữ</h2><p>Chúng tôi áp dụng các biện pháp kỹ thuật và quy trình phù hợp để bảo vệ dữ liệu khỏi truy cập, thay đổi hoặc tiết lộ trái phép. Mật khẩu được lưu trữ dưới dạng mã hóa; thông tin thanh toán nhạy cảm được xử lý bởi đơn vị thanh toán chuyên nghiệp.</p><p>Dữ liệu được lưu trong thời gian cần thiết để cung cấp dịch vụ, giải quyết tranh chấp và đáp ứng nghĩa vụ pháp lý.</p></section><section id="rights" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">5. Quyền của bạn</h2><p>Bạn có quyền xem, cập nhật thông tin tài khoản, yêu cầu giải thích về việc sử dụng dữ liệu hoặc đề nghị xóa thông tin trong phạm vi pháp luật cho phép. Một số dữ liệu giao dịch có thể cần được lưu lại theo quy định.</p><p>Để thực hiện quyền của mình, hãy liên hệ chúng tôi qua <Link to="/contact" className="font-bold text-blue-600 hover:underline">trang Liên hệ</Link> hoặc email hello@goldenstate.vn.</p></section></div>
            <div className="mt-10 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800"><ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />Chúng tôi tôn trọng quyền riêng tư và chỉ sử dụng thông tin cho mục đích cung cấp dịch vụ an toàn, minh bạch.</div>
          </article>
        </div>
      </div>
    </div>
  );
}
