import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

const contactDetails = [
  { icon: MapPin, label: "Địa chỉ", value: "Tầng 3, 21 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" },
  { icon: Phone, label: "Hotline", value: "081 22 88 111" },
  { icon: Mail, label: "Email", value: "hello@goldenstate.vn" },
  { icon: Clock3, label: "Giờ làm việc", value: "Thứ 2 - Chủ nhật · 08:00 - 22:00" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
    toast.success("Đã gửi lời nhắn đến Golden State");
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              <MessageSquare className="h-4 w-4" /> Luôn sẵn sàng lắng nghe
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Liên hệ Golden State</h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              Bạn cần hỗ trợ đặt sân, muốn hợp tác hoặc có góp ý? Gửi lời nhắn, đội ngũ của chúng tôi sẽ phản hồi sớm nhất.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-16">
        <section className="rounded-3xl bg-blue-700 p-7 text-white shadow-xl shadow-blue-900/10 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">Thông tin liên hệ</p>
          <h2 className="mt-3 text-2xl font-black">Kết nối với chúng tôi</h2>
          <p className="mt-3 text-sm leading-7 text-blue-100">Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn có trải nghiệm đặt sân thuận tiện hơn.</p>
          <div className="mt-8 space-y-6">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15"><Icon className="h-5 w-5" /></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-blue-200">{label}</p><p className="mt-1 text-sm font-semibold leading-6 text-white">{value}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-blue-50">Chúng tôi thường phản hồi tin nhắn trong vòng 24 giờ làm việc.</div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-7"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Gửi tin nhắn</p><h2 className="mt-2 text-2xl font-black">Bạn đang cần hỗ trợ gì?</h2></div>
          {sent ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-2xl bg-emerald-50 px-6 text-center"><CheckCircle2 className="h-14 w-14 text-emerald-500" /><h3 className="mt-4 text-xl font-extrabold text-slate-900">Cảm ơn bạn đã liên hệ!</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">Tin nhắn đã được ghi nhận. Đội ngũ Golden State sẽ phản hồi bạn sớm.</p><button onClick={() => setSent(false)} className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700">Gửi tin nhắn khác</button></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Họ tên</span><input required name="name" placeholder="Nguyễn Văn A" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Email</span><input required type="email" name="email" placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
              </div>
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Số điện thoại</span><input required type="tel" name="phone" placeholder="081 22 88 111" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Nội dung</span><textarea required name="message" rows={5} placeholder="Hãy chia sẻ điều bạn muốn Golden State hỗ trợ..." className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"><Send className="h-4 w-4" /> Gửi liên hệ</button>
            </form>
          )}
        </section>
      </main>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid min-h-[300px] lg:grid-cols-[1fr_1.2fr]">
            <div className="relative overflow-hidden bg-slate-200 p-8">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(25deg, transparent 45%, #cbd5e1 46%, #cbd5e1 48%, transparent 49%), linear-gradient(115deg, transparent 44%, #dbeafe 45%, #dbeafe 49%, transparent 50%), linear-gradient(170deg, transparent 60%, #cbd5e1 61%, #cbd5e1 63%, transparent 64%)", backgroundSize: "180px 160px, 220px 190px, 240px 180px" }} />
              <div className="relative flex h-full min-h-[300px] items-center justify-center"><div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-900/30"><MapPin className="h-9 w-9" /><span className="absolute inset-0 animate-ping rounded-full bg-blue-500/30" /></div><div className="absolute bottom-6 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">Golden State HQ</div></div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12"><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Bản đồ</p><h2 className="mt-3 text-2xl font-black">Ghé thăm văn phòng Golden State</h2><p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">Tầng 3, 21 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh. Bản đồ minh họa giúp bạn dễ hình dung vị trí của chúng tôi.</p><Link to="/map" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">Xem bản đồ sân thể thao <MapPin className="h-4 w-4" /></Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
