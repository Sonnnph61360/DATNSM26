import { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, Select, InputNumber, Switch, message, Spin } from "antd";
import { Ticket, Plus, Search, Percent, DollarSign } from "lucide-react";
import { api, formatCurrency } from "../../lib/api";

interface Voucher {
    id: number;
    code: string;
    discount: number;
    type: 'percent' | 'fixed';
    limit: number;
    used: number;
    status: 'active' | 'inactive';
}

export default function AdminVouchers() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");

    const fetchVouchers = async () => {
        try {
            const res = await api.get<Voucher[]>("/vouchers");
            setVouchers(res.data.reverse());
        } catch (error) {
            console.error("Lỗi lấy vouchers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleCreate = async (values: any) => {
        try {
            await api.post("/vouchers", { ...values, used: 0, status: values.status ? 'active' : 'inactive' });
            message.success("Tạo mã thành công!");
            setIsModalOpen(false);
            form.resetFields();
            fetchVouchers();
        } catch {
            message.error("Lỗi!");
        }
    };

    const toggleStatus = async (id: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await api.patch(`/vouchers/${id}`, { status: newStatus });
            message.success("Đã cập nhật trạng thái");
            fetchVouchers();
        } catch {
            message.error("Lỗi cập nhật");
        }
    };

    const columns = [
        {
            title: "Mã Khuyến Mãi",
            dataIndex: "code",
            render: (text: string) => <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-lg">{text}</span>
        },
        {
            title: "Loại giảm giá",
            dataIndex: "type",
            render: (type: string, record: Voucher) => (
                <div className="flex items-center font-bold text-gray-700 font-sans">
                    {type === "percent" ? <Percent size={14} className="mr-1 text-red-500" /> : <DollarSign size={14} className="mr-1 text-emerald-500" />}
                    {type === "percent" ? `Giảm ${record.discount}%` : `Giảm ${formatCurrency(record.discount)}`}
                </div>
            )
        },
        {
            title: "Đã dùng / Giới hạn",
            key: "usage",
            render: (_: any, r: Voucher) => (
                <span className="font-semibold text-gray-600">
                    <span className="text-blue-500">{r.used}</span> / {r.limit}
                </span>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (s: string, r: Voucher) => (
                <Switch
                    checked={s === 'active'}
                    onChange={() => toggleStatus(r.id, s)}
                    className={s === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}
                />
            )
        }
    ];

    if (loading) return <div className="flex justify-center py-40"><Spin size="large" /></div>;

    const filtered = vouchers.filter(v => v.code.toLowerCase().includes(searchText.toLowerCase()));

    return (
        <div className="animate-in fade-in duration-500 pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent tracking-tight flex items-center gap-2">
                        Quản lý Mã Giảm Giá
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Tạo và quản lý các chiến dịch Voucher/Khuyến mãi</p>
                </div>
                <Button size="large" type="primary" onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-0 shadow-lg shadow-pink-500/30 font-bold px-6 flex items-center h-12 rounded-2xl transition-all hover:scale-105 hover:-translate-y-0.5">
                    <Plus className="mr-2" size={20} /> Tạo mã mới
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 overflow-hidden">
                <Input
                    prefix={<Search size={18} className="text-gray-400 mr-2" />}
                    placeholder="Tìm mã code..."
                    size="large"
                    className="rounded-2xl mb-6 max-w-sm border-gray-200 px-4 py-2 text-sm font-medium focus:ring-4 ring-pink-500/10 transition-all border outline-none"
                    onChange={e => setSearchText(e.target.value)}
                />

                <Table
                    className="modern-table"
                    dataSource={filtered}
                    columns={columns}
                    rowKey="id"
                    components={{ header: { cell: (props: any) => <th {...props} className="bg-gray-50/50 text-gray-500 font-bold uppercase text-xs tracking-wider border-b border-gray-100 py-4" /> } }}
                />
            </div>

            <Modal
                title={<div className="font-black text-xl flex items-center gap-2"><Ticket className="text-emerald-500" /> Tạo Mã Giảm Giá (Voucher)</div>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={500}
                className="rounded-2xl"
            >
                <Form form={form} layout="vertical" onFinish={handleCreate} className="mt-4" initialValues={{ type: 'percent', status: true }}>
                    <Form.Item name="code" label={<span className="font-semibold text-gray-700">Mã Code (VD: GIOVANG50)</span>} rules={[{ required: true }]}>
                        <Input size="large" className="rounded-xl font-bold uppercase text-blue-600" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item name="type" label={<span className="font-semibold text-gray-700">Loại giảm</span>}>
                            <Select size="large" className="rounded-xl">
                                <Select.Option value="percent">% Phần trăm</Select.Option>
                                <Select.Option value="fixed">VNĐ Tiền mặt</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="discount" label={<span className="font-semibold text-gray-700">Giá trị giảm</span>} rules={[{ required: true }]}>
                            <InputNumber size="large" className="w-full rounded-xl" min={1} />
                        </Form.Item>
                    </div>

                    <Form.Item name="limit" label={<span className="font-semibold text-gray-700">Số lượng sử dụng tối đa</span>} rules={[{ required: true }]}>
                        <InputNumber size="large" className="w-full rounded-xl" min={1} />
                    </Form.Item>

                    <Form.Item name="status" valuePropName="checked">
                        <Switch checkedChildren="Kích hoạt ngay" unCheckedChildren="Lưu nháp" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" size="large" block className="mt-4 bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-black tracking-wide shadow-lg shadow-emerald-500/30 rounded-xl">
                        TẠO MÃ
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
