import { Table, Button, Tag, Space, Popconfirm, message, Modal, Form, Input, InputNumber, Select, Spin } from "antd";
import { CopyPlus, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

interface Court {
id: number;
name: string;
type: string;
price: number;
status: string;
}

export default function Courts() {

const [data, setData] = useState<Court[]>([]);
const [loading, setLoading] = useState(true);

// Modal state
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingCourt, setEditingCourt] = useState<Court | null>(null);
const [form] = Form.useForm();

const fetchCourts = async () => {
    try {
        const res2 = await axios.get("http://localhost:3000/api/courts")
        console.log(res2);
        setData(res2.data);

        // const res = await axios.get(`${API_URL}/courts`);
        // setData(res.data);
    } catch (error) {
        message.error("Không thể tải dữ liệu sân, JSON Server có đang chạy không?");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchCourts();
}, []);

const handleDelete = async (id: number) => {
    try {
        const res3 = await axios.delete(`http://localhost:3000/api/courts/${id}`);
        console.log(res3);
        await fetchCourts(); 
        setData(data.filter(item => item.id !== id));
        message.success("Xoá sân thành công");
    } catch (error) {
        message.error("Xoá sân thất bại");
    }
};

const handleOpenModal = (court?: Court) => {
    if (court) {
        setEditingCourt(court);
        form.setFieldsValue(court);
    } else {
        setEditingCourt(null);
        form.resetFields();
        form.setFieldsValue({ status: "active", type: "Pickleball" }); // defaults
    }
    setIsModalOpen(true);
};

const handleSubmitForm = async (values: any) => {
    try {
        if (editingCourt) {
            // Sửa sân
            const res = await axios.put(`${API_URL}/courts/${editingCourt.id}`, values);
            setData(data.map(item => item.id === editingCourt.id ? res.data : item));
            message.success("Cập nhật sân thành công!");
        } else {
            // Thêm sân mới
            const res = await axios.post(`${API_URL}/courts`, values);
            setData([...data, res.data]);
            message.success("Thêm sân mới thành công!");
        }
        setIsModalOpen(false);
    } catch (error) {
        message.error("Lưu thông tin thất bại!");
    }
};

const columns = [
    {
        title: "Tên Sân Bãi",
        dataIndex: "name",
        key: "name",
        render: (text: string) => <strong className="text-gray-800">{text}</strong>
    },
    // {
    //     title: "Bộ môn",
    //     dataIndex: "type",
    //     key: "type",
    //     render: (type: string) => <Tag color="blue">{type}</Tag>
    // },
    // {
    //     title: "Giá thuê / Giờ",
    //     dataIndex: "price",
    //     key: "price",
    //     render: (price: number) => <span className="text-green-600 font-bold">{price.toLocaleString()}đ</span>
    // },
    // {
    //     title: "Tình trạng",
    //     dataIndex: "status",
    //     key: "status",
    //     render: (status: string) => status === "active"
    //         ? <Tag color="green">Đang rảnh</Tag>
    //         : <Tag color="red">Bảo trì</Tag>
    // },
    {
        title: "Hành động",
        key: "action",
        render: (_: any, record: Court) => (
            <Space size="middle">
                <Button type="primary" ghost size="small" icon={<Edit size={14} />} onClick={() => handleOpenModal(record)}>
                    Sửa
                </Button>
                <Popconfirm title="Chắc chắn xoá sân này?" onConfirm={() => handleDelete(record.id)}>
                    <Button danger size="small" icon={<Trash2 size={14} />}>Xoá</Button>
                </Popconfirm>
            </Space>
        )
    }
];

return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Sân Bóng</h1>
                <p className="text-gray-500 text-sm">Thêm, sửa, xoá và cập nhật giá thuê sân</p>
            </div>
            <Button
                type="primary"
                size="large"
                icon={<CopyPlus size={18} />}
                className="bg-blue-600"
                onClick={() => handleOpenModal()}
            >
                Thêm sân mới
            </Button>
        </div>

        {loading ? (
            <div className="flex justify-center p-12"><Spin size="large" /></div>
        ) : (
            <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
        )}

        <Modal
            title={editingCourt ? "Sửa thông tin sân" : "Thêm sân mới"}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form layout="vertical" form={form} onFinish={handleSubmitForm} className="mt-4">
                <Form.Item label="Tên Sân" name="name" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                    <Input placeholder="VD: Sân Bóng số 1" size="large" />
                </Form.Item>

                <Form.Item label="Bộ môn" name="type" rules={[{ required: true }]}>
                    <Select size="large" options={[
                        { value: 'Pickleball', label: 'Pickleball' },
                        { value: 'Bóng đá 5 người', label: 'Bóng đá 5 người' },
                        { value: 'Bóng đá 7 người', label: 'Bóng đá 7 người' },
                        { value: 'Cầu lông', label: 'Cầu lông' },
                    ]} />
                </Form.Item>

                <Form.Item label="Giá thuê / Giờ" name="price" rules={[{ required: true, message: "Nhập giá tiền" }]}>
                    <InputNumber size="large" className="w-full" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
                    <Select size="large" options={[
                        { value: 'active', label: 'Đang hoạt động (Rảnh)' },
                        { value: 'maintenance', label: 'Bảo trì (Tạm khoá)' },
                    ]} />
                </Form.Item>

                <Button type="primary" htmlType="submit" size="large" block className="bg-blue-600 mt-2">
                    {editingCourt ? "Lưu thay đổi" : "Tạo sân mới"}
                </Button>
            </Form>
        </Modal>
    </div>
)


}