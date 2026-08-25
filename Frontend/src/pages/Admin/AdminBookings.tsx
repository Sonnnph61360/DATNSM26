import React, { useEffect, useState } from "react";
import { Table, Select, message, Spin, Button } from "antd";
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

  const markPaymentStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/bookings/${id}`, { paymentStatus: status });
      message.success(`Đã cập nhật thanh toán: ${status}`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, paymentStatus: status } : b))
      );
    } catch {
      message.error("Thất bại");
    }
  };

  const markCheckIn = async (id: number) => {
    try {
      await api.patch(`/bookings/${id}`, { status: "completed" });
      message.success("Khách đã Check-in (Hoàn thành đơn)");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b))
      );
    } catch {
      message.error("Lỗi khi Check-in");
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
      render: (_: unknown, record: Booking & { refundStk?: string, refundBank?: string }) => (
        <div>
          <div className="font-bold">{record.customer?.fullName}</div>
          <div className="text-gray-500 text-xs">{record.customer?.phone}</div>
          {record.refundStk && (
            <div className="text-xs text-red-600 mt-1 font-semibold">
              Hoàn tiền: {record.refundBank} - {record.refundStk}
            </div>
          )}
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
        <div className="flex flex-col gap-1 items-start">
          <div className="text-xs text-gray-500 mb-1">
            {r.paymentMethod === "transfer" ? "Chuyển khoản" : (r.paymentMethod === "deposit" ? "Chuyển khoản (Cọc)" : "Tại sân")}
          </div>
          <Select
            value={r.paymentStatus || "unpaid"}
            size="small"
            style={{ width: 135 }}
            onChange={(v) => markPaymentStatus(r.id, v)}
            options={[
              { value: "unpaid", label: "Chưa thanh toán" },
              { value: "deposit_paid", label: "Đã cọc tiền" },
              { value: "paid", label: "Đã thanh toán đủ" },
              { value: "refunded", label: "Đã hoàn tiền" },
            ]}
          />
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
      title: "Hành động",
      key: "actions",
      render: (_: unknown, r: Booking & { refundStk?: string }) => (
        <div className="flex flex-col gap-1">
          {r.status === "cancelled" && r.paymentStatus !== "refunded" && r.refundStk && (
            <Button size="small" danger onClick={() => markPaymentStatus(r.id, "refunded")}>
              Đã hoàn tiền
            </Button>
          )}
          {r.status === "confirmed" && (
            <Button size="small" type="primary" className="bg-green-600" onClick={() => markCheckIn(r.id)}>
              Check-in
            </Button>
          )}
        </div>
      ),
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
