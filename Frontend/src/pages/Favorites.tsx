import { useEffect, useState } from "react";
import { Heart, Loader2, MapPin, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchFields, Field, formatCurrency } from "../lib/api";
import { useFavorites } from "../hooks/useFavorites";

export default function Favorites() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoriteIds, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchFields().then(setFields).catch(() => { toast.error("Không tải được danh sách sân"); setFields([]); }).finally(() => setLoading(false));
  }, []);

  const favoriteFields = fields.filter((field) => favoriteIds.has(field.id));

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-amber-500" /></div>;

  return <div className="min-h-screen bg-[#f7f8f6] px-4 py-10 text-slate-900 sm:py-14"><div className="mx-auto max-w-7xl">
    <div className="mb-8"><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-red-500"><Heart className="h-4 w-4 fill-current" /> Danh sách cá nhân</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">Sân yêu thích</h1><p className="mt-2 text-slate-500">Các sân bạn đã lưu để xem và đặt nhanh hơn.</p></div>
    {!favoriteFields.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><Heart className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-extrabold">Chưa có sân yêu thích</h2><p className="mt-2 text-sm text-slate-500">Nhấn biểu tượng tim trên card sân để lưu địa điểm bạn thích.</p><Link to="/fields" className="btn-primary mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-bold">Khám phá sân</Link></div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{favoriteFields.map((field) => <article key={field.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="relative h-52 bg-slate-100"><img src={field.imageUrl || field.image} alt={field.name} className="h-full w-full object-cover" /><button type="button" aria-label={`Bỏ ${field.name} khỏi yêu thích`} onClick={() => toggleFavorite(field.id)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow"><Heart className="h-5 w-5 fill-current" /></button></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-extrabold text-slate-950">{field.name}</h2><span className="flex shrink-0 items-center gap-1 text-sm font-bold text-slate-700"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{field.rating?.toFixed(1) || "4.8"}</span></div><p className="mt-2 flex gap-2 text-sm leading-5 text-slate-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{field.address}</p><p className="mt-4 font-extrabold text-amber-600">Từ {formatCurrency(field.priceFrom || field.pricePerHour)} / giờ</p><div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4"><Link to={`/field/${field.id}`} className="btn-primary flex-1 rounded-xl py-2.5 text-center text-sm font-bold">Xem chi tiết</Link><button type="button" onClick={() => toggleFavorite(field.id)} aria-label="Bỏ yêu thích" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-red-200 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>}
  </div></div>;
}
