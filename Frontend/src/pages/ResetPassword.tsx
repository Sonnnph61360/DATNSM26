import { Form, Input, Button } from "antd";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const onFinish = async (values: { password: string; confirmPassword: string }) => {
    if (!token) {
      toast.error("Liên kết đặt lại mật khẩu không hợp lệ");
      return;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await api.post<{ message: string }>("/reset-password", {
        token,
        newPassword: values.password,
      });
      toast.success(response.data.message || "Đặt lại mật khẩu thành công");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Liên kết đã hết hạn hoặc không hợp lệ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-[480px] rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <Link to="/login" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600">
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
        </Link>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/20">
          <LockKeyhole className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
        <p className="mb-8 mt-2 text-center text-gray-500">Tạo mật khẩu mới cho tài khoản của bạn.</p>

        {!token ? (
          <div className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã bị thiếu.
          </div>
        ) : (
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password size="large" prefix={<LockKeyhole className="h-4 w-4" />} placeholder="Mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return !value || getFieldValue("password") === value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" prefix={<CheckCircle2 className="h-4 w-4" />} placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>
            <Button htmlType="submit" type="primary" block size="large" className="!h-12 !rounded-xl !bg-green-600 hover:!bg-green-700">
              Lưu mật khẩu mới
            </Button>
          </Form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link to="/forgot-password" className="font-semibold text-green-600">Gửi lại yêu cầu</Link>
        </p>
      </div>
    </div>
  );
}
