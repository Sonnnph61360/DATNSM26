import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { setAuth } from "../lib/auth";

type GoogleSignInButtonProps = {
  onSuccess: () => void;
};

export default function GoogleSignInButton({ onSuccess }: GoogleSignInButtonProps) {
  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async ({ credential }) => {
          if (!credential) {
            toast.error("Không nhận được thông tin từ Google");
            return;
          }
          try {
            const response = await api.post("/auth/google", { credential });
            setAuth(response.data.accessToken, response.data.user);
            toast.success("Đăng nhập Google thành công!");
            onSuccess();
          } catch {
            toast.error("Đăng nhập Google thất bại");
          }
        }}
        onError={() => toast.error("Đăng nhập Google thất bại")}
        width="320"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
