import { Card, Col, Row, Statistic } from "antd";
import { TrendingUp, TrendingDown, Users, MapPin, DollarSign, CalendarCheck } from "lucide-react";

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Thống kê Doanh thu & Hiệu suất</h1>

            <Row gutter={[16, 16]} className="mb-6">
                <Col span={6}>
                    <Card className="shadow-sm border-0 rounded-2xl">
                        <Statistic
                            title="Tổng doanh thu tháng"
                            value={25460000}
                            precision={0}
                            valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                            prefix={<DollarSign size={20} className="mr-2" />}
                            suffix="₫"
                        />
                        <div className="text-xs text-green-600 mt-2 font-semibold">
                            <TrendingUp size={14} className="inline" /> 12% so với tháng trước
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="shadow-sm border-0 rounded-2xl">
                        <Statistic
                            title="Tổng số sân"
                            value={16}
                            valueStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                            prefix={<MapPin size={20} className="mr-2" />}
                        />
                        <div className="text-xs text-gray-400 mt-2">
                            Tại 2 cơ sở
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="shadow-sm border-0 rounded-2xl">
                        <Statistic
                            title="Tổng Đơn Đặt Sân"
                            value={142}
                            valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                            prefix={<CalendarCheck size={20} className="mr-2" />}
                        />
                        <div className="text-xs text-green-600 mt-2 font-semibold">
                            <TrendingUp size={14} className="inline" /> 8% so với tháng trước
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="shadow-sm border-0 rounded-2xl">
                        <Statistic
                            title="Khách hàng mới"
                            value={38}
                            valueStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                            prefix={<Users size={20} className="mr-2" />}
                        />
                        <div className="text-xs text-red-500 mt-2 font-semibold">
                            <TrendingDown size={14} className="inline" /> 3% so với tháng trước
                        </div>
                    </Card>
                </Col>
            </Row>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Biểu đồ Doanh thu (Tuần này)</h3>
                    <div className="h-64 flex items-end justify-between gap-4 pt-10">
                        {/* Fake Bar Chart */}
                        {[20, 60, 40, 80, 50, 100, 70].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group transition hover:bg-blue-200" style={{ height: `${h}%` }}>
                                <div className="absolute bottom-full mb-2 w-full text-center text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(h * 30000).toLocaleString()}đ
                                </div>
                                <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                                    T{i + 2 === 8 ? "CN" : i + 2}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Sân được đặt nhiều nhất</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-sm">002 PB Club - Sân 1</div>
                            <div className="text-blue-600 font-bold shrink-0">45 đơn</div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full w-4/5"></div></div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="font-semibold text-sm">3T PB Club - Sân VIP</div>
                            <div className="text-blue-600 font-bold shrink-0">38 đơn</div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-2/3"></div></div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="font-semibold text-sm">Green Stadium - Sân 5</div>
                            <div className="text-blue-600 font-bold shrink-0">22 đơn</div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full w-1/3"></div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
