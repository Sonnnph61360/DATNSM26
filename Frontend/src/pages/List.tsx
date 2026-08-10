import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Alias: chuyển về trang tìm sân chính /fields */
export default function TimSan() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/fields", { replace: true });
  }, [navigate]);
  return null;
}
