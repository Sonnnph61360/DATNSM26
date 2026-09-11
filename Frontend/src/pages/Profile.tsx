import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  Save,
  User,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { getToken, getUser, setAuth, type AuthUser } from "../lib/auth";

function initials(user: AuthUser | null) {
  return (user?.fullName || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const [user, setUser] = useState<AuthUser | null>(() => getUser());
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (!profile.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await api.patch<AuthUser>(`/users/${user.id}`, {
        fullName: profile.fullName.trim(),
        phone: profile.phone.trim(),
      });
      const updatedUser = response.data;
      const token = getToken();
      if (token) setAuth(token, updatedUser);
      setUser(updatedUser);
      toast.success("Đã cập nhật thông tin tài khoản");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể cập nhật thông tin");
    } finally {
      setProfileLoading(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    if (passwords.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setPasswordLoading(true);
    try {
      await api.patch(`/users/${user.id}/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Đã đổi mật khẩu thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể đổi mật khẩu");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="relative overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">Tài khoản cá nhân</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Xin chào, {user.fullName || "bạn"}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">Quản lý thông tin cá nhân và bảo mật tài khoản Golden State.</p>
          </div>
          <Link
            to="/my-bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <CalendarDays className="h-4 w-4" />
            Lịch sử đặt sân
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white shadow-xl shadow-blue-600/20">
              {user.avatar ? <img src={user.avatar} alt={user.fullName || "Avatar"} className="h-full w-full object-cover" /> : initials(user)}
              <span className="absolute bottom-2 right-2 rounded-lg bg-white p-1.5 text-blue-600 shadow-sm" title="Ảnh đại diện">
                <Camera className="h-4 w-4" />
              </span>
            </div>
            <div className="text-center">
              <h2 className="font-extrabold text-slate-900">{user.fullName || "Chưa cập nhật họ tên"}</h2>
              <p className="mt-1 break-all text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Mail className="h-4 w-4 text-blue-600" />{user.email}</div>
              <div className="flex items-center gap-3 text-slate-600"><Phone className="h-4 w-4 text-blue-600" />{user.phone || "Chưa cập nhật số điện thoại"}</div>
            </div>
          </aside>

          <div className="space-y-6">
            <form onSubmit={updateProfile} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><UserRound className="h-5 w-5" /></div>
                <div><h2 className="text-xl font-extrabold text-slate-900">Thông tin cơ bản</h2><p className="mt-1 text-sm text-slate-500">Cập nhật thông tin để việc đặt sân thuận tiện hơn.</p></div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2"><span className="mb-2 block text-sm font-bold text-slate-700">Họ và tên</span><div className="relative"><User className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div></label>
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Email</span><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={user.email} disabled className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-500" /></div><span className="mt-1.5 block text-xs text-slate-400">Email đăng nhập không thể chỉnh sửa.</span></label>
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Số điện thoại</span><div className="relative"><Phone className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} placeholder="Nhập số điện thoại" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div></label>
              </div>
              <button disabled={profileLoading} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4" />{profileLoading ? "Đang lưu..." : "Lưu thay đổi"}</button>
            </form>

            <form onSubmit={updatePassword} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-start gap-3"><div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><LockKeyhole className="h-5 w-5" /></div><div><h2 className="text-xl font-extrabold text-slate-900">Đổi mật khẩu</h2><p className="mt-1 text-sm text-slate-500">Dùng mật khẩu dài và khó đoán để bảo vệ tài khoản.</p></div></div>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu hiện tại</span><div className="relative"><KeyRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input required type="password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></div></label>
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Mật khẩu mới</span><input required type="password" minLength={6} value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
                <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Xác nhận mật khẩu</span><input required type="password" minLength={6} value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /></label>
              </div>
              <button disabled={passwordLoading} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"><Check className="h-4 w-4" />{passwordLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Đang cập nhật...</> : "Cập nhật mật khẩu"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
