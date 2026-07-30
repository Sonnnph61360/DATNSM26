import { useMutation } from "@tanstack/react-query";
import { Input, Form, Button } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (value: any) => {
      const res = await axios.post("http://localhost:3000/login", value);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Token:", data.accessToken);
      // 👉 lưu token (có thể dùng localStorage hoặc zustand)
      localStorage.setItem("token", data.accessToken);
      toast.success("Đăng nhập thành công");
      nav("/list");
    },

    onError: () => {
      toast.error("Sai tài khoản hoặc mật khẩu");
    },
  });

  const onSubmit = (value: any) => {
    console.log("Login", value);
    mutate(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Đăng nhập</h1>

      <Form layout="vertical" onFinish={onSubmit} className="space-y-6">

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input placeholder="email" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="password" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>

      </Form>
    </div>
  );
}

export default Login;