import { Form, Input, Button } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

type Props = {
  onClose: () => void;
};

function Login({ onClose }: Props) {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[480px] rounded-3xl bg-white p-10 shadow-2xl">

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-gray-600 hover:bg-blue-100 transition"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-4xl text-white shadow-md">
          ⚽
        </div>

        {/* Tiêu đề */}
        <h1 className="mt-6 text-center text-4xl font-bold text-gray-800">
          Đăng nhập
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-500">
          Đăng nhập để đặt sân nhanh hơn và xem lịch sử đặt sân
        </p>

        <Form layout="vertical" onFinish={onFinish}>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<PhoneOutlined className="text-blue-600" />}
              placeholder="Số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-blue-600" />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            size="large"
            className="!h-12 !rounded-xl !bg-blue-600 hover:!bg-blue-700"
          >
            Đăng nhập
          </Button>

        </Form>

        <div className="mt-6 text-center text-gray-600">
          Chưa có tài khoản?

          <Link
            to="/register"
            className="ml-1 font-semibold text-blue-600 hover:text-blue-700"
          >
            Đăng ký ngay
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;