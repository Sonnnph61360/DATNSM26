import { useEffect, useState } from "react";
import { Calendar, Badge, Spin } from "antd";
import type { Dayjs } from "dayjs";
import { api, Booking } from "../../lib/api";

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Booking[]>("/bookings")
      .then((res) => setBookings(res.data.filter((b) => b.status !== "cancelled")))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const getListData = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    return bookings
      .filter((b) => b.date === dateStr)
      .map((b) => ({
        type:
          b.status === "confirmed"
            ? "success"
            : b.status === "pending"
            ? "warning"
            : "default",
        content: `${b.time} - ${b.customer?.fullName || "?"} (${b.court})`,
      }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="m-0 p-0 list-none text-xs">
        {listData.map((item, index) => (
          <li key={index} className="mb-1">
            <Badge
              status={item.type as "success" | "warning" | "default"}
              text={
                <span className="text-xs font-semibold text-gray-700">
                  {item.content}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lịch đặt sân</h1>
      <p className="text-sm text-gray-500 mb-4">
        Hiển thị bookings từ API · {bookings.length} đơn
      </p>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <Calendar cellRender={dateCellRender} />
      </div>
    </div>
  );
}
