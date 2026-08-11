```tsx
import {
    Table,
    Button,
    Tag,
    Space,
    Popconfirm,
    message,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Spin,
    Card,
    Statistic,
} from "antd";
import {
    CopyPlus,
    Edit,
    Trash2,
    MapPin,
    CircleDollarSign,
    CheckCircle2,
    Wrench,
    Trophy,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);
    const [form] = Form.useForm();

    const fetchCourts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/courts`);
            setData(res.data);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải danh sách sân bóng rổ!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/courts/${id}`);
            setData((prev) => prev.filter((item) => item.id !== id));
            message.success("Xoá sân bóng rổ thành công!");
        } catch (error) {
            console.error(error);
            message.error("Xoá sân thất bại!");
        }
    };

    const handleOpenModal = (court?: Court) => {
        if (court) {
            setEditingCourt(court);
            form.setFieldsValue({
                name: court.name,
                type: court.type,
                price: court.price,
                status: court.status,
            });
        } else {
            setEditingCourt(null);
            form.resetFields();
            form.setFieldsValue({
                type: "Sân bóng rổ tiêu chuẩn",
                status: "active",
            });
        }

        setIsModalOpen(true);
    };

    const handleSubmitForm = async (values: Court) => {
        try {
            if (editingCourt) {
                const res = await axios.put(
                    `${API_URL}/courts/${editingCourt.id}`,
                    values
                );

                setData((prev) =>
                    prev.map((item) =>
                        item.id === editingCourt.id ? res.data : item
                    )
                );

                message.success("Cập nhật sân bóng rổ thành công!");
            } else {
                const res = await axios.post(
                    `${API_URL}/courts`,
                    values
                );

                setData((prev) => [...prev, res.data]);
                message.success("Thêm sân bóng rổ thành công!");
            }

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error(error);
            message.error("Lưu thông tin sân thất bại!");
        }
    };

    const totalCourts = data.length;

    const activeCourts = data.filter(
        (court) => court.status === "active"
    ).length;

    const maintenanceCourts = data.filter(
        (court) => court.status === "maintenance"
    ).length;

    const averagePrice =
        data.length > 0
            ? Math.round(
                  data.reduce((total, court) => total + court.price, 0) /
                      data.length
              )
            : 0;

    const columns = [
        {
            title: "Sân bóng rổ",
            dataIndex: "name",
            key: "name",
            render: (text: string) => (
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
                        <MapPin size={21} className="text-orange-600" />
                    </div>

                    <div>
                        <div className="font-bold text-gray-800">
                            {text}
                        </div>

                        <div className="text-xs text-gray-400">
                            Basketball Court
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Loại sân",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag
                    color="orange"
                    className="px-3 py-1 rounded-full"
                >
                    {type}
                </Tag>
            ),
        },
        {
            title: "Giá thuê / giờ",
            dataIndex: "price",
            key: "price",
            render: (price: number) => (
                <div className="flex items-center gap-2">
                    <CircleDollarSign
                        size={18}
                        className="text-orange-500"
                    />

                    <span className="font-bold text-gray-800">
                        {price.toLocaleString("vi-VN")}đ
                    </span>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) =>
                status === "active" ? (
                    <Tag
                        icon={<CheckCircle2 size={14} />}
                        color="success"
                        className="px-3 py-1 rounded-full"
                    >
                        Đang hoạt động
                    </Tag>
                ) : (
                    <Tag
                        icon={<Wrench size={14} />}
                        color="error"
                        className="px-3 py-1 rounded-full"
                    >
                        Đang bảo trì
                    </Tag>
                ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: unknown, record: Court) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<Edit size={14} />}
                        onClick={() => handleOpenModal(record)}
                    >
                        Sửa
                    </Button>

                    <Popconfirm
                        title="Xoá sân bóng rổ?"
                        description="Bạn có chắc chắn muốn xoá sân này?"
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<Trash2 size={14} />}
                        >
                            Xoá
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-7">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200">
                            <Trophy size={30} className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-gray-900">
                                Quản lý sân bóng rổ
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Quản lý sân, giá thuê và tình trạng hoạt động
                            </p>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        icon={<CopyPlus size={18} />}
                        className="!bg-orange-500 hover:!bg-orange-600 !border-orange-500 !rounded-xl font-semibold"
                        onClick={() => handleOpenModal()}
                    >
                        Thêm sân bóng rổ
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                <Card
                    bordered={false}
                    className="rounded-2xl shadow-sm"
                >
                    <Statistic
                        title="Tổng số sân"
                        value={totalCourts}
                        prefix={
                            <MapPin
                                size={22}
                                className="text-orange-500"
                            />
                        }
                        suffix=" sân"
                    />
                </Card>

                <Card
                    bordered={false}
                    className="rounded-2xl shadow-sm"
                >
                    <Statistic
                        title="Đang hoạt động"
                        value={activeCourts}
                        prefix={
                            <CheckCircle2
                                size={22}
                                className="text-green-500"
                            />
                        }
                        suffix=" sân"
                    />
                </Card>

                <Card
                    bordered={false}
                    className="rounded-2xl shadow-sm"
                >
                    <Statistic
                        title="Đang bảo trì"
                        value={maintenanceCourts}
                        prefix={
                            <Wrench
                                size={22}
                                className="text-red-500"
                            />
                        }
                        suffix=" sân"
                    />
                </Card>

                <Card
                    bordered={false}
                    className="rounded-2xl shadow-sm"
                >
                    <Statistic
                        title="Giá thuê trung bình"
                        value={averagePrice}
                        prefix={
                            <CircleDollarSign
                                size={22}
                                className="text-orange-500"
                            />
                        }
                        suffix="đ / giờ"
                        formatter={(value) =>
                            Number(value).toLocaleString("vi-VN")
                        }
                    />
                </Card>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Danh sách sân bóng rổ
                        </h2>

                        <p className="text-sm text-gray-400 mt-1">
                            Quản lý tất cả sân bóng rổ trong hệ thống
                        </p>
                    </div>

                    <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full font-semibold text-sm">
                        {totalCourts} sân
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                        }}
                    />
                )}
            </div>

            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Trophy
                                size={20}
                                className="text-orange-500"
                            />
                        </div>

                        <div>
                            <div className="font-bold text-lg">
                                {editingCourt
                                    ? "Sửa sân bóng rổ"
                                    : "Thêm sân bóng rổ"}
                            </div>

                            <div className="text-xs text-gray-400 font-normal">
                                Nhập thông tin sân bên dưới
                            </div>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                footer={null}
                centered
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleSubmitForm}
                    className="mt-5"
                >
                    <Form.Item
                        label="Tên sân"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên sân",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="VD: Sân bóng rổ số 1"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Loại sân"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại sân",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            options={[
                                {
                                    value: "Sân bóng rổ tiêu chuẩn",
                                    label: "Sân bóng rổ tiêu chuẩn",
                                },
                                {
                                    value: "Sân bóng rổ 3x3",
                                    label: "Sân bóng rổ 3x3",
                                },
                                {
                                    value: "Sân bóng rổ trong nhà",
                                    label: "Sân bóng rổ trong nhà",
                                },
                                {
                                    value: "Sân bóng rổ ngoài trời",
                                    label: "Sân bóng rổ ngoài trời",
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Giá thuê / giờ"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá thuê",
                            },
                        ]}
                    >
                        <InputNumber
                            size="large"
                            className="w-full"
                            min={0}
                            formatter={(value) =>
                                `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                )
                            }
                            parser={(value) =>
                                Number(value?.replace(/,/g, "")) as 0
                            }
                            addonAfter="VNĐ"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn trạng thái",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            options={[
                                {
                                    value: "active",
                                    label: "Đang hoạt động",
                                },
                                {
                                    value: "maintenance",
                                    label: "Đang bảo trì",
                                },
                            ]}
                        />
                    </Form.Item>

                    <div className="flex gap-3 mt-6">
                        <Button
                            size="large"
                            block
                            onClick={() => {
                                setIsModalOpen(false);
                                form.resetFields();
                            }}
                        >
                            Huỷ
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            className="!bg-orange-500 hover:!bg-orange-600 !border-orange-500"
                        >
                            {editingCourt
                                ? "Lưu thay đổi"
                                : "Tạo sân bóng rổ"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
```
