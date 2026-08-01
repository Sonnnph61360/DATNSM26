import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000";

function Login() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const res = await axios.post(`${API_URL}/login`, {
                email: values.email,
                password: values.password,
            });
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            toast.success("Đăng nhập thành công!");
            navigate("/");
        } catch (error) {
            toast.error("Sai email hoặc mật khẩu!");
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

                <h1 className="mt-6 text-center text-4xl font-bold">
                    Đăng nhập
                </h1>

                <p className="mt-2 mb-8 text-center text-gray-500">
                    Đăng nhập để đặt sân nhanh hơn và xem lịch sử
                </p>

                <Form layout="vertical" onFinish={onFinish}>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập email",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<MailOutlined />}
                            placeholder="Email"
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
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        type="primary"
                        block
                        size="large"
                        className="!h-12 !rounded-xl !bg-green-600 hover:!bg-green-700"
                    >
                        Đăng nhập
                    </Button>

                </Form>

                <p className="mt-6 text-center">
                    Chưa có tài khoản?

                    <Link
                        to="/register"
                        className="ml-1 font-semibold text-green-600"
                    >
                        Đăng ký ngay
                    </Link>
                </p>

            </div>

        </div>
    );
}
export default Login;