import { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { Wallet, CalendarCheck, Gauge, TrendingUp, Activity, Clock3, CircleCheck, LayoutGrid, CalendarRange } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api, Booking, Court, Field, formatCurrency } from "../../lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Period = "week" | "month";

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function periodRange(period: Period, reference: string) {
  const selected = new Date(`${reference}T00:00:00`);
  const start = new Date(selected);
  if (period === "week") {
    const day = start.getDay();
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
  } else {
    start.setDate(1);
  }
  const end = new Date(start);
  if (period === "week") end.setDate(start.getDate() + 6);
  else {
    end.setMonth(start.getMonth() + 1, 0);
  }
  return { startKey: dateKey(start), endKey: dateKey(end), days: period === "week" ? 7 : end.getDate() };
}

function addDays(value: string, amount: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

function hoursBetween(openTime: string, closeTime: string) {
  const [openHour, openMinute] = String(openTime || "06:00").split(":").map(Number);
  const [closeHour, closeMinute] = String(closeTime || "22:00").split(":").map(Number);
  return Math.max(0, closeHour * 60 + closeMinute - openHour * 60 - openMinute) / 60;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [period, setPeriod] = useState<Period>("week");
  const [referenceDate, setReferenceDate] = useState(() => dateKey(new Date()));

  useEffect(() => {
    (async () => {
      try {
        const [bRes, cRes, fRes] = await Promise.all([
          api.get<Booking[]>("/bookings"),
          api.get<Court[]>("/courts"),
          api.get<Field[]>("/fields"),
        ]);
        setBookings(bRes.data);
        setCourts(cRes.data);
        setFields(fRes.data);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const range = periodRange(period, referenceDate);
    const inPeriod = bookings.filter((b) => b.status !== "cancelled" && b.date >= range.startKey && b.date <= range.endKey);
    const paidOrConfirmed = inPeriod.filter(
      (b) => b.paymentStatus === "paid" || b.status === "confirmed" || b.status === "completed"
    );
    const revenue = paidOrConfirmed.reduce((s, b) => s + (b.total || 0), 0);

    const bookedHours = inPeriod.reduce((s, b) => s + (b.duration || 1), 0);
    const capacityHours = Math.max(courts.length, 1) * 16 * range.days;
    const fillRate = Math.min(100, Math.round((bookedHours / capacityHours) * 1000) / 10);

    const byField = fields.map((f) => {
      const fieldCourts = courts.filter((court) => court.fieldId === f.id && court.status === "active");
      const list = inPeriod.filter((b) => b.fieldId === f.id);
      const rev = list
        .filter((b) => b.paymentStatus === "paid" || b.status === "confirmed" || b.status === "completed")
        .reduce((s, b) => s + (b.total || 0), 0);
      const fieldCapacityHours = Math.max(fieldCourts.length, 1) * hoursBetween(f.openTime, f.closeTime) * range.days;
      const fieldBookedHours = list.reduce((s, b) => s + (b.duration || 1), 0);
      return {
        id: f.id,
        name: f.name,
        bookings: list.length,
        revenue: rev,
        bookedHours: fieldBookedHours,
        fillRate: Math.min(100, Math.round((fieldBookedHours / fieldCapacityHours) * 1000) / 10),
        operatingStatus: f.status === "active" && fieldCourts.length > 0 ? "Đang vận hành" : "Tạm dừng",
      };
    }).sort((a, b) => b.revenue - a.revenue);

    const chartData = [];
    const chartDays = period === "week" ? 7 : range.days;
    for (let index = 0; index < chartDays; index += 1) {
      const dateStr = addDays(range.startKey, index);
      const dayBookings = inPeriod.filter((b) => b.date === dateStr);
      const dayRev = dayBookings
        .filter((b) => b.paymentStatus === "paid" || b.status === "confirmed" || b.status === "completed")
        .reduce((s, b) => s + (b.total || 0), 0);

      chartData.push({
        date: dateStr.slice(5).replace("-", "/"),
        revenue: dayRev,
        bookings: dayBookings.length,
      });
    }

    return {
      revenue,
      bookings: inPeriod.length,
      fillRate: Math.round(fillRate * 10) / 10,
      byField,
      chartData,
      pending: inPeriod.filter((b) => b.status === "pending").length,
      confirmed: inPeriod.filter((b) => b.status === "confirmed").length,
      courts: courts.filter((court) => court.status === "active").length,
      range,
    };
  }, [bookings, courts, fields, period, referenceDate]);

  if (loading) {
    return (
      <div className="space-y-6 pb-10" aria-busy="true" aria-label="Đang tải tổng quan">
        <div className="skeleton h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[148px] !rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="skeleton h-[400px] !rounded-3xl xl:col-span-2" />
          <div className="skeleton h-[400px] !rounded-3xl" />
        </div>
      </div>
    );
  }

  const kpis: Array<{ label: string; value: string; unit: string; icon: LucideIcon; note: string; accent?: boolean }> = [
    { label: `Doanh thu ${period === "week" ? "tuần" : "tháng"}`, value: new Intl.NumberFormat("vi-VN").format(stats.revenue), unit: "₫", icon: Wallet, note: `${stats.range.startKey} đến ${stats.range.endKey}`, accent: true },
    { label: "Số giờ đã đặt", value: new Intl.NumberFormat("vi-VN").format(stats.byField.reduce((sum, field) => sum + field.bookedHours, 0)), unit: "giờ", icon: TrendingUp, note: `${stats.bookings} lượt đặt trong kỳ` },
    { label: "Tổng đơn đặt", value: String(stats.bookings), unit: "đơn", icon: CalendarCheck, note: `${stats.confirmed} đơn đã xác nhận` },
    { label: "Tỷ lệ lấp đầy", value: String(stats.fillRate), unit: "%", icon: Gauge, note: `Theo ${period === "week" ? "7 ngày" : "tháng đã chọn"}` },
  ];

  const statusRows = [
    { label: "Chờ xác nhận", desc: "Đơn cần duyệt xử lý", value: String(stats.pending), icon: Clock3, tone: "bg-brand-50 text-brand-700 ring-brand-100" },
    { label: "Đã thanh toán / Giữ chỗ", desc: "Đơn xác nhận hợp lệ", value: String(stats.confirmed), icon: CircleCheck, tone: "bg-emerald-50 text-emerald-700 ring-emerald-100" },
    { label: "Cơ sở vật chất", desc: "Tổng số sân hoạt động", value: `${stats.courts} sân`, icon: LayoutGrid, tone: "bg-stone-100 text-stone-700 ring-stone-200" },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Thanh công cụ: tiêu đề đã nằm trên top bar của layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 max-w-xl text-sm text-stone-600">Thống kê doanh thu, tỷ lệ lấp đầy và tình trạng vận hành các sân bóng rổ.</p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1" aria-label="Khoảng thời gian thống kê">
            <button type="button" onClick={() => setPeriod("week")} className={`min-h-8 rounded-lg px-3 text-xs font-bold transition ${period === "week" ? "bg-brand-600 text-white" : "text-stone-600 hover:bg-stone-100"}`}>Theo tuần</button>
            <button type="button" onClick={() => setPeriod("month")} className={`min-h-8 rounded-lg px-3 text-xs font-bold transition ${period === "month" ? "bg-brand-600 text-white" : "text-stone-600 hover:bg-stone-100"}`}>Theo tháng</button>
          </div>
          <label className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600">
            <span className="sr-only">Chọn ngày tham chiếu</span>
            <input type="date" value={referenceDate} onChange={(event) => setReferenceDate(event.target.value)} className="bg-transparent text-xs font-bold text-stone-700 outline-none" />
          </label>
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-600">
            <CalendarRange size={14} className="text-brand-600" aria-hidden="true" />
            {stats.range.startKey} – {stats.range.endKey}
          </span>
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> {stats.courts} sân đang hoạt động
          </span>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return kpi.accent ? (
            <div key={kpi.label} data-reveal style={{ "--reveal-index": i } as React.CSSProperties} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-brand">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" aria-hidden="true" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-white/90">{kpi.label}</div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white"><Icon size={20} aria-hidden="true" /></span>
              </div>
              <div className="relative mt-3 font-display text-[28px] font-extrabold leading-tight tracking-tight tabular-nums">
                {kpi.value} <span className="text-lg font-bold text-white/85">{kpi.unit}</span>
              </div>
              <div className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                <TrendingUp size={12} aria-hidden="true" /> {kpi.note}
              </div>
            </div>
          ) : (
            <div key={kpi.label} data-reveal style={{ "--reveal-index": i } as React.CSSProperties} className="card hover-lift p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-stone-500">{kpi.label}</div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100"><Icon size={20} aria-hidden="true" /></span>
              </div>
              <div className="mt-3 font-display text-[28px] font-extrabold leading-tight tracking-tight text-stone-950 tabular-nums">
                {kpi.value} <span className="text-lg font-bold text-brand-600">{kpi.unit}</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">{kpi.note}</div>
            </div>
          );
        })}
      </div>

      {/* Biểu đồ + trạng thái */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="card min-w-0 p-5 sm:p-6 xl:col-span-2" aria-labelledby="chart-title">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="chart-title" className="m-0 text-base font-extrabold text-stone-950">Doanh thu theo ngày trong {period === "week" ? "tuần" : "tháng"}</h2>
              <p className="m-0 mt-0.5 text-xs text-stone-500">Đơn vị: VNĐ · Chọn ngày để đổi kỳ thống kê</p>
            </div>
            <span className="chip">Theo thời gian thực</span>
          </div>
          <div className="h-[260px] w-full sm:h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 24, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#78716c", fontSize: 12, fontWeight: 600 }} dy={8} padding={{ left: 8, right: 8 }} />
                <YAxis axisLine={false} tickLine={false} width={52} tickFormatter={(val: number) => `${val / 1000}k`} tick={{ fill: "#78716c", fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                  cursor={{ stroke: "#fdba74", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", background: "#fff", boxShadow: "0 16px 32px -12px rgba(28,25,23,.18)", fontWeight: 600, color: "#1c1917" }}
                  labelStyle={{ color: "#b23d0a", marginBottom: 4, fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" activeDot={{ r: 5, fill: "#F97316", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card flex flex-col p-5 sm:p-6" aria-labelledby="ops-title">
          <h2 id="ops-title" className="m-0 mb-4 text-base font-extrabold text-stone-950">Trạng thái vận hành</h2>
          <ul className="m-0 flex flex-1 list-none flex-col gap-3 p-0">
            {statusRows.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.label} className="flex flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${row.tone}`}><Icon size={18} aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-stone-900">{row.label}</div>
                    <div className="truncate text-xs text-stone-500">{row.desc}</div>
                  </div>
                  <div className="shrink-0 font-display text-2xl font-extrabold text-stone-950 tabular-nums">{row.value}</div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Bảng doanh thu theo cơ sở */}
      <section className="card overflow-hidden" aria-labelledby="field-rev-title">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-6">
          <h2 id="field-rev-title" className="m-0 text-base font-extrabold text-stone-950">Doanh thu theo cơ sở sân</h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500"><Activity size={14} className="text-brand-600" aria-hidden="true" /> Top 5</span>
        </div>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={stats.byField.slice(0, 5)}
          className="modern-table"
          scroll={{ x: 720 }}
          columns={[
            {
              title: "Tên cơ sở",
              dataIndex: "name",
              ellipsis: true,
              width: 240,
              // Trước đây chữ dùng text-white trên nền bảng trắng nên cột trông như bị trống.
              render: (t: string) => <span className="text-sm font-bold text-stone-900">{t || "Chưa đặt tên"}</span>,
            },
            {
              title: "Số đơn",
              dataIndex: "bookings",
              width: 130,
              render: (v: number) => <span className="text-sm font-semibold text-stone-600 tabular-nums">{v} lượt đặt</span>,
            },
            {
              title: "Doanh thu",
              dataIndex: "revenue",
              width: 170,
              align: "right" as const,
              render: (v: number) => <span className="text-sm font-extrabold text-brand-700 tabular-nums">{formatCurrency(v)}</span>,
            },
            {
              title: "Giờ đã đặt",
              dataIndex: "bookedHours",
              width: 130,
              render: (v: number) => <span className="text-sm font-semibold text-stone-600 tabular-nums">{v} giờ</span>,
            },
            {
              title: "Lấp đầy",
              dataIndex: "fillRate",
              width: 150,
              render: (v: number) => <span className="text-sm font-extrabold text-emerald-700 tabular-nums">{v}%</span>,
            },
            {
              title: "Vận hành",
              dataIndex: "operatingStatus",
              width: 150,
              render: (v: string) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${v === "Đang vận hành" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{v}</span>,
            },
            {
              title: "Tỷ trọng",
              key: "share",
              width: 220,
              render: (_: unknown, r: { revenue: number }) => {
                const pct = stats.revenue ? Math.round((r.revenue / stats.revenue) * 100) : 0;
                return (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full max-w-[140px] overflow-hidden rounded-full bg-stone-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-9 text-right text-xs font-bold text-stone-600 tabular-nums">{pct}%</span>
                  </div>
                );
              },
            },
          ]}
        />
      </section>
    </div>
  );
}
