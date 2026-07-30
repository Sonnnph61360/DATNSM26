import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button, Select } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const nav = useNavigate();

  const { mutate } = useMutation({
    mutationFn: async (value: any) => {
      await axios.post(`http://localhost:3000/users`, value);
    },

    onSuccess: () => {
      toast.success("Đăng ký thành công");
      nav("/login");
    },

    onError: () => {
      toast.error("Đăng ký thất bại");
    },
  });

  const onSubmit = (value: any) => {
    console.log("Success", value);
    mutate(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Đăng ký</h1>

      <Form layout="vertical" onFinish={onSubmit} className="space-y-6">

        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input placeholder="username" />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Form.Item label="Role" name="role" rules={[{ required: true, message: "Chọn role" }]}>
          <Select
            options={[
              { value: "admin", label: "Admin" },
              { value: "editor", label: "Editor" }
            ]}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>

      </Form>
    </div>
  );
}

export default Register;