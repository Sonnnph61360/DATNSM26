import { Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../paget/Login/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}