import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import banner2 from "../assets/banner2.jpg";

const features = [
  {
    icon: Search,
    title: "Tìm sân trong vài giây",
    description: "Lọc theo khu vực, loại sân và thời gian để tìm đúng địa điểm phù hợp.",
  },
  {
    icon: ShieldCheck,
    title: "Thông tin minh bạch",
    description: "Xem giá, hình ảnh, tiện ích và đánh giá trước khi bạn quyết định.",
  },
  {
    icon: Clock3,
    title: "Đặt lịch chủ động",
    description: "Giữ chỗ nhanh chóng, quản lý lịch đặt và nhận xác nhận ngay trên hệ thống.",
  },
];

const reasons = [
  "Mạng lưới sân thể thao được tuyển chọn kỹ lưỡng",
  "Giá và tình trạng sân rõ ràng trước khi đặt",
  "Hỗ trợ người chơi trong suốt hành trình",
  "Không ngừng nâng cấp trải nghiệm đặt sân",
];

const team = [
  { name: "Đội ngũ vận hành", role: "Kết nối sân tốt với người chơi mỗi ngày", color: "from-blue-600 to-cyan-500" },
  { name: "Đội ngũ sản phẩm", role: "Biến việc đặt sân thành trải nghiệm đơn giản", color: "from-amber-500 to-orange-500" },
  { name: "Đội ngũ hỗ trợ", role: "Luôn sẵn sàng khi bạn cần", color: "from-emerald-500 to-teal-500" },
];

export default function About() {
  return (
    <div className="overflow-hidden bg-slate-50 text-slate-900">
      <section
        className="relative isolate min-h-[520px] bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(7, 18, 39, .92), rgba(7, 18, 39, .55)), url(${banner2})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-400/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" /> Chơi hết mình, đặt sân dễ dàng
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Golden State kết nối bạn với sân chơi phù hợp.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              Nền tảng đặt sân thể thao giúp người chơi tìm kiếm, so sánh và đặt lịch nhanh hơn, để mọi cuộc vui bắt đầu đúng lúc.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/fields" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50">
                Tìm sân ngay <ArrowRight className="h-4 w-4 text-blue-600" />
              </Link>
              <a href="#mission" className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
                Khám phá câu chuyện
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="relative mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:grid-cols-3 sm:p-8">
          <div className="border-b border-slate-100 pb-5 sm:border-b-0 sm:border-r sm:pb-0"><p className="text-4xl font-black text-blue-600">2,400+</p><p className="mt-2 text-sm font-semibold text-slate-500">Sân thể thao trên hệ thống</p></div>
          <div className="border-b border-slate-100 pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pl-6"><p className="text-4xl font-black text-amber-500">50K+</p><p className="mt-2 text-sm font-semibold text-slate-500">Người chơi tin tưởng</p></div>
          <div className="sm:pl-6"><p className="text-4xl font-black text-emerald-500">24/7</p><p className="mt-2 text-sm font-semibold text-slate-500">Sẵn sàng hỗ trợ bạn</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Sứ mệnh của chúng tôi</p>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">Đưa thể thao đến gần hơn với mọi người.</h2>
            <p className="mt-5 leading-8 text-slate-600">Golden State được tạo ra từ một nhu cầu rất đơn giản: việc tìm sân và rủ bạn bè chơi thể thao không nên mất nhiều thời gian. Chúng tôi xây dựng một nơi đáng tin cậy để người chơi dễ dàng tìm được sân phù hợp và chủ sân vận hành hiệu quả hơn.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {reasons.map((reason) => <div key={reason} className="flex items-start gap-3 text-sm font-semibold text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />{reason}</div>)}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-blue-900/10 sm:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl" />
            <MapPin className="relative mb-8 h-10 w-10 text-blue-300" />
            <p className="relative text-2xl font-black leading-snug sm:text-3xl">“Mỗi sân bóng là một nơi những mối quan hệ và khoảnh khắc đáng nhớ bắt đầu.”</p>
            <p className="relative mt-8 text-sm font-bold text-blue-200">Golden State · Nền tảng đặt sân thể thao</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center"><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Vì sao chọn Golden State</p><h2 className="text-3xl font-black sm:text-4xl">Mọi thứ bạn cần để chơi tốt hơn</h2><p className="mt-4 text-slate-500">Một trải nghiệm rõ ràng, nhanh gọn và được thiết kế quanh nhu cầu của người chơi.</p></div>
          <div className="grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <div key={title} className="rounded-3xl border border-slate-100 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20"><Icon className="h-5 w-5" /></div><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{description}</p></div>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Những người đứng sau</p><h2 className="text-3xl font-black sm:text-4xl">Một đội ngũ cùng chung nhịp chơi</h2></div><Users className="h-10 w-10 text-blue-200" /></div>
        <div className="grid gap-5 md:grid-cols-3">{team.map((member) => <div key={member.name} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${member.color} text-2xl font-black text-white`}>{member.name.charAt(0)}</div><h3 className="text-lg font-extrabold">{member.name}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{member.role}</p><Award className="mt-6 h-5 w-5 text-amber-500 transition group-hover:scale-110" /></div>)}</div>
      </section>

      <section className="bg-blue-700 px-4 py-20 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl"><h2 className="text-3xl font-black sm:text-4xl">Sẵn sàng cho trận đấu tiếp theo?</h2><p className="mx-auto mt-4 max-w-xl text-blue-100">Tìm một sân chơi mới, rủ đồng đội và bắt đầu kế hoạch hôm nay.</p><Link to="/fields" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-blue-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-blue-50">Khám phá sân gần bạn <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
    </div>
  );
}
