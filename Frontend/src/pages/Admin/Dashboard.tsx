import { useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Statistic, Spin, Table, Tag } from "antd";
import { DollarSign, CalendarCheck, MapPin, Users } from "lucide-react";
import { api, Booking, Court, Field, formatCurrency } from "../../lib/api";

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [fields, setFields] = useState<Field[]>([]);

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
    const active = bookings.filter((b) => b.status !== "cancelled");
    const paidOrConfirmed = active.filter(
      (b) => b.paymentStatus === "paid" || b.status === "confirmed"
    );
    const revenue = paidOrConfirmed.reduce((s, b) => s + (b.total || 0), 0);

    const monthStart = startOfMonth();
    const weekStart = daysAgo(7);
    const inMonth = active.filter((b) => new Date(b.date) >= monthStart);
    const inWeek = active.filter((b) => new Date(b.date) >= weekStart);
    const revenueMonth = inMonth
      .filter((b) => b.paymentStatus === "paid" || b.status === "confirmed")
      .reduce((s, b) => s + (b.total || 0), 0);
    const revenueWeek = inWeek
      .filter((b) => b.paymentStatus === "paid" || b.status === "confirmed")
      .reduce((s, b) => s + (b.total || 0), 0);

    // occupancy rough: booked hours / (courts * 16h * 30d) month
    const bookedHours = inMonth.reduce((s, b) => s + (b.duration || 1), 0);
    const capacityHours = Math.max(courts.length, 1) * 16 * 30;
    const fillRate = Math.min(100, Math.round((bookedHours / capacityHours) * 1000) / 10);

    const byField = fields.map((f) => {
      const list = active.filter((b) => b.fieldId === f.id);
      const rev = list
        .filter((b) => b.paymentStatus === "paid" || b.status === "confirmed")
        .reduce((s, b) => s + (b.total || 0), 0);
      return {
        id: f.id,
        name: f.name,
        bookings: list.length,
        revenue: rev,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      revenue,
      revenueMonth,
      revenueWeek,
      bookings: active.length,
      courts: courts.length,
      fields: fields.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      paid: bookings.filter((b) => b.paymentStatus === "paid").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      fillRate,
      byField,
    };
  }, [bookings, courts, fields]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thống kê sân bóng rổ</h1>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Doanh thu (đã TT / xác nhận)"
              value={stats.revenue}
              precision={0}
              valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
              prefix={<DollarSign size={20} className="mr-2" />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Doanh thu 7 ngày"
              value={stats.revenueWeek}
              prefix={<DollarSign size={20} className="mr-2" />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Doanh thu tháng này"
              value={stats.revenueMonth}
              prefix={<DollarSign size={20} className="mr-2" />}
              suffix="₫"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Tỷ lệ lấp đầy (ước tính tháng)"
              value={stats.fillRate}
              suffix="%"
              prefix={<Users size={20} className="mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Tổng đơn (không hủy)"
              value={stats.bookings}
              prefix={<CalendarCheck size={20} className="mr-2" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic title="Chờ xác nhận" value={stats.pending} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic title="Đã xác nhận / Đã TT" value={stats.confirmed} suffix={`/ ${stats.paid}`} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-0 rounded-2xl">
            <Statistic
              title="Sân / Cơ sở"
              value={stats.courts}
              suffix={`/ ${stats.fields}`}
              prefix={<MapPin size={20} className="mr-2" />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Doanh thu theo cơ sở" className="rounded-2xl shadow-sm">
        <Table
          rowKey="id"
          pagination={false}
          dataSource={stats.byField}
          columns={[
            { title: "Cơ sở", dataIndex: "name" },
            { title: "Số đơn", dataIndex: "bookings" },
            {
              title: "Doanh thu",
              dataIndex: "revenue",
              render: (v: number) => (
                <span className="font-semibold text-emerald-700">{formatCurrency(v)}</span>
              ),
            },
            {
              title: "Tỷ trọng",
              key: "share",
              render: (_: unknown, r: { revenue: number }) => {
                const pct = stats.revenue
                  ? Math.round((r.revenue / stats.revenue) * 100)
                  : 0;
                return <Tag color="blue">{pct}%</Tag>;
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}
