import { Button, Modal, Form, Input, InputNumber, Select, message } from "antd";
import { CopyPlus } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

interface Court {
    id: number;
    name: string;
    type: string;
    price: number;
    status: string;
}

interface AddCourtProps {
    onCourtAdded: (newCourt: Court) => void;
}

export default function AddCourt({ onCourtAdded }: AddCourtProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleOpenModal = () => {
        form.resetFields();
        form.setFieldsValue({ status: "active", type: "Bóng rổ tiêu chuẩn" }); // Giá trị mặc định cho bóng rổ
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
    const handleDelete = async (id: number) => {
        try {
          await axios.delete(`${API_URL}/courts/${id}`);
      
          setData((prev) => prev.filter((item) => item.id !== id));
      
          message.success("Xoá sân thành công");
        } catch (error) {
          message.error("Xoá sân thất bại");
        }
      };




    return (
        <div>
            <Button
                type="primary"
                size="large"
                icon={<CopyPlus size={18} />}
                className="bg-blue-600"
                onClick={handleOpenModal}
            >
                Thêm sân bóng rổ
            </Button>

            <Modal
                title="Thêm sân bóng rổ mới"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmitForm} className="mt-4">
                    <Form.Item label="Tên Sân Bóng Rổ" name="name" rules={[{ required: true, message: "Vui lòng nhập tên sân" }]}>
                        <Input placeholder="VD: Sân Bóng Rổ Indoor 01" size="large" />
                    </Form.Item>

                    <Form.Item label="Loại sân" name="type" rules={[{ required: true }]}>
                        <Select size="large" options={[
                            { value: 'Bóng rổ tiêu chuẩn', label: 'Bóng rổ tiêu chuẩn (Full-court)' },
                            { value: 'Bóng rổ nửa sân', label: 'Bóng rổ nửa sân (Half-court)' },
                            { value: 'Bóng rổ trong nhà', label: 'Bóng rổ trong nhà (Indoor)' },
                            { value: 'Bóng rổ ngoài trời', label: 'Bóng rổ ngoài trời (Outdoor)' },
                        ]} />
                    </Form.Item>

                    <Form.Item label="Giá thuê / Giờ" name="price" rules={[{ required: true, message: "Nhập giá tiền" }]}>
                        <InputNumber 
                            size="large" 
                            className="w-full" 
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                        />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" rules={[{ required: true }]}>
                        <Select size="large" options={[
                            { value: 'active', label: 'Đang hoạt động (Rảnh)' },
                            { value: 'maintenance', label: 'Bảo trì (Tạm khoá)' },
                        ]} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" size="large" block className="bg-blue-600 mt-2">
                        Tạo sân bóng rổ mới
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}