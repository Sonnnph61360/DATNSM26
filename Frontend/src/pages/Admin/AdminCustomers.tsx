import React, { useEffect, useState } from "react";
import { Table, Spin, Input, Card, Tag, Button, Avatar } from "antd";
import { Search, UserCircle, Star, Phone, Mail, Award, Clock } from "lucide-react";
import { api, Booking, formatCurrency } from "../../lib/api";

interface CustomerStats {
    phone: string;
    fullName: string;
    email: string;
    totalSpent: number;
    totalBookings: number;
    lastBookingTime: string;
    isVip: boolean;
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<CustomerStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get<Booking[]>("/bookings");
                const bookings = res.data.filter(b => b.status !== "cancelled");

                const customerMap = new Map<string, CustomerStats>();

                for (const b of bookings) {
                    if (!b.customer || !b.customer.phone) continue;

                    const phone = b.customer.phone;
                    if (!customerMap.has(phone)) {
                        customerMap.set(phone, {
                            phone,
                            fullName: b.customer.fullName || "Khách Hàng",
                            email: b.customer.email || "",
                            totalSpent: 0,
                            totalBookings: 0,
                            lastBookingTime: b.createdAt || b.date,
                            isVip: false
                        });
                    }

                    const c = customerMap.get(phone)!;
                    c.totalBookings += 1;
                    if (b.paymentStatus === 'paid' || b.status === 'confirmed' || b.status === "completed") {
                        c.totalSpent += (b.total || 0);
                    }
                    if (new Date(b.createdAt || b.date) > new Date(c.lastBookingTime)) {
                        c.lastBookingTime = b.createdAt || b.date;
                    }
                }

                const sortedCustomers = Array.from(customerMap.values()).map(c => ({
                    ...c,
                    isVip: c.totalSpent > 3000000 || c.totalBookings >= 5 // VIP logic
                })).sort((a, b) => b.totalSpent - a.totalSpent);

                setCustomers(sortedCustomers);
            } catch (error) {
                console.error("Lỗi khi lấy khách hàng", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredData = customers.filter(c =>
        c.phone.includes(searchText) ||
        c.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Khách hàng",
            key: "customer",
            render: (_: unknown, record: CustomerStats) => (
                <div className="flex items-center gap-4">
                    <Avatar
                        size={48}
                        className={record.isVip ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/30" : "bg-blue-100 text-blue-600"}
                        icon={!record.isVip && <UserCircle size={28} />}
                    >
                        {record.isVip && <Star size={24} color="white" fill="white" />}
                    </Avatar>
                    <div>
                        <div className="font-bold text-gray-800 text-base">{record.fullName}</div>
                        {record.isVip && <Tag color="gold" className="mt-1 border-none font-bold text-xs"><Award size={12} className="inline mr-1 mb-0.5" /> KHÁCH VIP</Tag>}
                    </div>
                </div>
            )
        },
        {
            title: "Liên hệ",
            key: "contact",
            render: (_: unknown, record: CustomerStats) => (
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                        <Phone size={14} className="mr-2 text-gray-400" /> {record.phone}
                    </div>
                    {record.email && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-2 text-gray-400" /> {record.email}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: "Tổng chi tiêu",
            dataIndex: "totalSpent",
            key: "totalSpent",
            sorter: (a: CustomerStats, b: CustomerStats) => a.totalSpent - b.totalSpent,
            render: (val: number, record: CustomerStats) => (
                <div className={`font-black text-lg ${record.totalSpent > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                    {formatCurrency(val)}
                </div>
            )
        },
        {
            title: "Số lần đặt sân",
            dataIndex: "totalBookings",
            key: "bookings",
            sorter: (a: CustomerStats, b: CustomerStats) => a.totalBookings - b.totalBookings,
            render: (val: number) => (
                <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">{val} lượt</span>
            )
        },
        {
            title: "Hoạt động gần nhất",
            dataIndex: "lastBookingTime",
            render: (val: string) => (
                <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Clock size={14} className="mr-1.5 text-gray-400" />
                    {new Date(val).toLocaleDateString('vi-VN')}
                </div>
            )
        }
    ];

    if (loading) {
        return <div className="flex justify-center items-center py-40"><Spin size="large" /></div>;
    }

    return (
        <div className="animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
                        Quản lý Khách Hàng (Mini CRM)
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Lưu trữ hành vi, định danh khách hàng thân thiết</p>
                </div>
                <div className="flex gap-4">
                    <Card className="shadow-sm border-gray-100 bg-blue-50/50 rounded-2xl p-0" bodyStyle={{ padding: '8px 16px' }}>
                        <div className="text-xs text-blue-600 font-bold uppercase mb-0.5">Tổng KH</div>
                        <div className="text-2xl font-black text-blue-700 leading-none">{customers.length}</div>
                    </Card>
                    <Card className="shadow-sm border-gray-100 bg-amber-50/50 rounded-2xl p-0" bodyStyle={{ padding: '8px 16px' }}>
                        <div className="text-xs text-amber-600 font-bold uppercase mb-0.5">Khách VIP</div>
                        <div className="text-2xl font-black text-amber-700 leading-none">{customers.filter(c => c.isVip).length}</div>
                    </Card>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 overflow-hidden">
                <div className="mb-6 max-w-md">
                    <Input
                        prefix={<Search size={18} className="text-gray-400 mr-2" />}
                        placeholder="Tìm theo Tên, Số điện thoại hoặc Email..."
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="rounded-2xl border-gray-200 px-4 py-2 text-sm font-medium focus:ring-4 ring-emerald-500/10 transition-all border outline-none"
                    />
                </div>

                <Table
                    className="modern-table"
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="phone"
                    pagination={{ pageSize: 10, className: "mt-8" }}
                    components={{
                        header: { cell: (props: any) => <th {...props} className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100 py-4 uppercase text-xs tracking-wider" /> }
                    }}
                />
            </div>
        </div>
    )
}
