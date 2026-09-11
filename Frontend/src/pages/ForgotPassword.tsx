import { Form, Input, Button } from "antd";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    try {
      const response = await api.post<{ message: string; resetToken?: string }>(
        "/forgot-password",
        { email: values.email.trim() }
      );
      const token = response.data.resetToken;
      toast.success(response.data.message || "Yêu cầu đặt lại mật khẩu đã được ghi nhận");
      if (token) {
        navigate(`/reset-password?token=${encodeURIComponent(token)}`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể gửi yêu cầu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600">
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
        </Link>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/20">
          <KeyRound className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">Quên mật khẩu?</h1>
        <p className="mb-8 mt-2 text-center text-gray-500">
          Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input size="large" prefix={<Mail />} placeholder="Email đăng ký" />
          </Form.Item>
          <Button htmlType="submit" type="primary" block size="large" className="!h-12 !rounded-xl !bg-green-600 hover:!bg-green-700">
            Gửi yêu cầu đặt lại
          </Button>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Nhớ mật khẩu rồi? <Link to="/login" className="font-semibold text-green-600">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
