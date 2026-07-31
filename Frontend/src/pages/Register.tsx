import { Form, Input, Button } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000";

function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Đăng ký thất bại. Email có thể đã tồn tại.";
        toast.error(typeof message === "string" ? message : "Đăng ký thất bại");
      } else {
        toast.error("Không thể kết nối server. Hãy chạy npm run db");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-[480px] rounded-3xl bg-white p-10 shadow-xl">
        <div className="flex justify-end">
          <Link
            to="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            ✕
          </Link>
        </div>

        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-4xl text-white">
          ⚽
        </div>

        <h1 className="mt-6 text-center text-4xl font-bold">Đăng ký</h1>

        <p className="mt-2 mb-8 text-center text-gray-500">
          Tạo tài khoản để đặt sân nhanh hơn và xem lịch sử
        </p>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên" },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
            ]}
          >
            <Input
              size="large"
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            size="large"
            className="!h-12 !rounded-xl !bg-green-600 hover:!bg-green-700"
          >
            Đăng ký
          </Button>
        </Form>

        <p className="mt-6 text-center">
          Đã có tài khoản?
          <Link to="/login" className="ml-1 font-semibold text-green-600">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
