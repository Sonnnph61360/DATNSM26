import { useEffect, useState } from "react";
import { Table, Tag, Select, message, Spin, Button } from "antd";
import { api, type Booking, formatCurrency, formatSlotRange } from "../../lib/api";
import { formatDateVi } from "../../lib/locale";
export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get<Booking[]>("/bookings");
      setBookings([...res.data].reverse());
    } catch {
      message.error("Không tải được danh sách đơn. Kiểm tra Backend đang chạy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    const current = bookings.find((b) => b.id === id);
    if (current?.status === "cancelled" && newStatus === "confirmed") {
      message.error("Đơn đã hủy — không thể xác nhận lại");
      return;
    }
    if (current?.status === "cancelled" && newStatus === "pending") {
      message.error("Đơn đã hủy — không thể chuyển về chờ xác nhận");
      return;
    }
    try {
      await api.patch(`/bookings/${id}`, { status: newStatus });
      message.success("Cập nhật trạng thái thành công!");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Cập nhật thất bại.";
      message.error(msg);
    }
  };

  const markPaid = async (id: number) => {
    try {
      await api.patch(`/bookings/${id}`, { paymentStatus: "paid" });
      message.success("Đã đánh dấu thanh toán");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, paymentStatus: "paid" } : b))
      );
    } catch {
      message.error("Thất bại");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      render: (text: number) => (
        <span className="font-bold text-green-700">
          BK{String(text).padStart(6, "0")}
        </span>
      ),
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_: unknown, record: Booking) => (
        <div>
          <div className="font-bold">{record.customer?.fullName}</div>
          <div className="text-gray-500 text-xs">{record.customer?.phone}</div>
        </div>
      ),
    },
    {
      title: "Sân",
      key: "courtInfo",
      render: (_: unknown, record: Booking) => (
        <div className="text-sm">
          <div className="font-semibold">{record.fieldName}</div>
          <div className="text-gray-500">{record.court}</div>
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_: unknown, r: Booking) => (
        <span className="text-sm">
          {formatDateVi(r.date)} · {formatSlotRange(r.time, r.duration || 1)} ({r.duration} giờ)
        </span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (v: number) => (
        <span className="font-bold text-blue-600">{formatCurrency(v)}</span>
      ),
    },
    {
      title: "Thanh toán",
      key: "pay",
      render: (_: unknown, r: Booking) => (
        <div className="text-xs">
          <div>{r.paymentMethod === "transfer" ? "Chuyển khoản" : "Tại sân"}</div>
          <Tag color={r.paymentStatus === "paid" ? "green" : "default"}>
            {r.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_: unknown, record: Booking) => (
        <Select
          value={record.status}
          style={{ width: 140 }}
          onChange={(v) => updateStatus(record.id, v)}
          options={[
            { value: "pending", label: "Chờ xác nhận", disabled: record.status === "cancelled" },
            { value: "confirmed", label: "Đã xác nhận", disabled: record.status === "cancelled" },
            { value: "completed", label: "Hoàn thành" },
            { value: "cancelled", label: "Đã hủy" },
          ]}
        />
      ),
    },
    {
      title: "TT",
      key: "actions",
      render: (_: unknown, r: Booking) =>
        r.paymentStatus !== "paid" ? (
          <Button size="small" type="link" onClick={() => markPaid(r.id)}>
            Đánh dấu đã TT
          </Button>
        ) : null,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách đơn đặt sân</h1>
      <Table
        rowKey="id"
        dataSource={bookings}
        columns={columns}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
