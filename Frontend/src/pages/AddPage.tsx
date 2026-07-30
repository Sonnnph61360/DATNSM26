import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, Switch } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddPage() {
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (value: any) => {
      await axios.post(`http://localhost:3000/Students`, value);
    },
    onSuccess: () => {
      toast.success("Thêm thành công");
      nav("/list");
    },
    onError: () => {
      toast.error("Thêm thất bại");
    },
  });

  const onSubmit = (value: any) => {
    mutate(value);
  };

  return (
    <div className="p-6">
      <h1>Thêm Mới</h1>
      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item name="fullName" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Tuổi" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="active" label="Active" valuePropName="checked" rules={[{ required: true }]}>
          <Switch />
        </Form.Item>
        <Button htmlType="submit" type="primary">
          Thêm
        </Button>
      </Form>
    </div>
  );
}

export default AddPage;