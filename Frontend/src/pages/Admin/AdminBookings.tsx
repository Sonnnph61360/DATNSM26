import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Select, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { CalendarDays, Wallet, CheckCircle, Clock } from "lucide-react";

const API_URL = "http://localhost:3000";

interface Booking {
    id: number;
    fieldName: string;
    court: string;
    date: string;
    time: string;
    duration: number;
    total: number;
    status: string;
    paymentMethod: string;
    customer: {
        fullName: string;
        phone: string;
        note: string;
    };
    createdAt: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/bookings`);
            setBookings(res.data.reverse()); 
        } catch (error) {
            message.error("Lỗi khi tải danh sách đặt sân. Hãy bật npm run db");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await axios.patch(`${API_URL}/bookings/${id}`, { status: newStatus });
            message.success("Cập nhật trạng thái thành công!");
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            message.error("Cập nhật thất bại.");
        }
    };

    const columns = [
        {
            title: "Mã Đơn",
            dataIndex: "id",
            key: "id",
            render: (text: number) => <span className="font-bold text-green-700">BK{String(text).padStart(6, "0")}</span>,
        },
        {
            title: "Khách hàng",
            key: "customer",
            render: (_, record: Booking) => (
                <div>
                    <div className="font-bold">{record.customer.fullName}</div>
                    <div className="text-gray-500 text-xs">{record.customer.phone}</div>
                </div>
            ),
        },
        {
            title: "Thông tin Sân",
            key: "courtInfo",
            render: (_, record: Booking) => (
                <div className="text-sm">
                    <div className="font-semibold text-gray-800">{record.court} - {record.fieldName}</div>
                    <div className="text-gray-500 text-xs flex items-center mt-1">
                        <CalendarDays className="w-3 h-3 mr-1" /> {record.date}
                        <Clock className="w-3 h-3 ml-2 mr-1" /> {record.time} ({record.duration}h)
                    </div>
                </div>
            ),
        },
        {
            title: "Thanh toán",
            key: "payment",
            render: (_, record: Booking) => (
                <div>
                    <div className="text-red-500 font-bold">{record.total.toLocaleString("vi-VN")}đ</div>
                    <div className="text-xs text-gray-500 flex items-center mt-0.5">
                        <Wallet className="w-3 h-3 mr-1" />
                        {record.paymentMethod === "cash" ? "Tại sân" : "Chuyển khoản"}
                    </div>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (_, record: Booking) => (
                <Select
                    value={record.status}
                    style={{ width: 140 }}
                    onChange={(val) => updateStatus(record.id, val)}
                    options={[
                        { value: 'pending', label: <Tag color="gold">Chờ xác nhận</Tag> },
                        { value: 'approved', label: <Tag color="green">Đã duyệt</Tag> },
                        { value: 'cancelled', label: <Tag color="red">Đã huỷ</Tag> },
                    ]}
                />
            ),
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                            <CheckCircle className="text-green-600" />
                            Quản lý Đơn Đặt Sân
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Dành cho Admin phê duyệt yêu cầu từ khách hàng</p>
                    </div>
                    <Link to="/" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">
                        Quay về Trang chủ
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><Spin size="large" /></div>
                ) : (
                    <Table
                        dataSource={bookings}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                    />
                )}
            </div>
        </div>
    );
}
