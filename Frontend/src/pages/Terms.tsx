import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileText } from "lucide-react";

const sections = [
  ["overview", "1. Tổng quan"],
  ["account", "2. Tài khoản người dùng"],
  ["booking", "3. Đặt sân và thanh toán"],
  ["cancel", "4. Hủy sân và hoàn tiền"],
  ["responsibility", "5. Quyền và nghĩa vụ"],
];

export default function Terms() {
  return (
    <div className="bg-slate-50 px-4 py-10 text-slate-800 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
        <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24"><div className="mb-4 flex items-center gap-2 font-extrabold text-slate-900"><FileText className="h-5 w-5 text-blue-600" /> Mục lục</div><nav className="space-y-2">{sections.map(([id, label]) => <a key={id} href={`#${id}`} className="block rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-blue-50 hover:text-blue-700">{label}</a>)}</nav></aside>
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14">
            <div className="border-b border-slate-100 pb-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Golden State</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Điều khoản sử dụng</h1><p className="mt-4 text-sm leading-7 text-slate-500">Cập nhật lần cuối: 12 tháng 09, 2026</p></div>
            <div className="prose prose-slate mt-8 max-w-none text-sm leading-7"><section id="overview"><h2 className="text-xl font-extrabold text-slate-900">1. Tổng quan</h2><p>Chào mừng bạn đến với Golden State, nền tảng hỗ trợ tìm kiếm và đặt sân thể thao trực tuyến. Khi truy cập hoặc sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản dưới đây.</p><p>Golden State có thể cập nhật điều khoản để phù hợp với hoạt động kinh doanh và quy định pháp luật. Những thay đổi quan trọng sẽ được thông báo trên website.</p></section><section id="account" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">2. Tài khoản người dùng</h2><p>Bạn chịu trách nhiệm cung cấp thông tin chính xác khi đăng ký và bảo mật tài khoản, mật khẩu của mình. Mỗi tài khoản chỉ dành cho một người sử dụng, trừ khi có thỏa thuận khác.</p><ul className="list-disc space-y-2 pl-5"><li>Không sử dụng tài khoản để giả mạo, lừa đảo hoặc thực hiện hành vi trái pháp luật.</li><li>Thông báo ngay cho Golden State nếu phát hiện truy cập trái phép.</li><li>Golden State có thể tạm khóa tài khoản vi phạm sau khi xem xét phù hợp.</li></ul></section><section id="booking" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">3. Đặt sân và thanh toán</h2><p>Thông tin sân, khung giờ và giá được hiển thị trên hệ thống tại thời điểm bạn đặt. Đơn đặt sân chỉ được xác nhận khi hệ thống ghi nhận thành công và, nếu áp dụng, thanh toán đã hoàn tất.</p><p>Thanh toán online có thể được xử lý qua đối tác trung gian như VNPAY hoặc phương thức được hiển thị tại bước thanh toán. Bạn cần kiểm tra số tiền, thông tin sân và thời gian trước khi xác nhận giao dịch.</p></section><section id="cancel" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">4. Hủy sân và hoàn tiền</h2><p>Chính sách hủy và hoàn tiền có thể khác nhau tùy sân, thời điểm hủy và phương thức thanh toán. Chi tiết áp dụng sẽ được thông báo trong quá trình đặt hoặc trên đơn đặt sân.</p><ul className="list-disc space-y-2 pl-5"><li>Yêu cầu hủy phải được gửi qua hệ thống hoặc kênh hỗ trợ chính thức.</li><li>Khoản hoàn tiền hợp lệ sẽ được xử lý về phương thức thanh toán ban đầu hoặc theo thông tin hoàn tiền được xác nhận.</li><li>Thời gian tiền về tài khoản phụ thuộc vào ngân hàng và đơn vị thanh toán.</li></ul></section><section id="responsibility" className="mt-10"><h2 className="text-xl font-extrabold text-slate-900">5. Quyền và nghĩa vụ</h2><p>Người dùng có quyền tiếp cận thông tin dịch vụ, quản lý đơn đặt sân và nhận hỗ trợ. Người dùng có nghĩa vụ sử dụng sân đúng mục đích, tuân thủ nội quy của cơ sở và chịu trách nhiệm với thiệt hại do mình gây ra.</p><p>Golden State nỗ lực duy trì dịch vụ ổn định nhưng không chịu trách nhiệm cho gián đoạn do sự kiện ngoài khả năng kiểm soát, lỗi hạ tầng của đối tác hoặc thông tin do cơ sở cung cấp không chính xác.</p></section></div>
            <div className="mt-10 flex gap-3 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />Bạn có thể liên hệ <Link to="/contact" className="font-bold underline">bộ phận hỗ trợ</Link> nếu cần giải thích thêm về điều khoản.</div>
          </article>
        </div>
      </div>
    </div>
  );
}
