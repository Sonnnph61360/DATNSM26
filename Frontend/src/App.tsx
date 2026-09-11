import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import List from "./pages/List";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import FieldPage from "./pages/FieldPage";
import MapPage from "./pages/MapPage";
import MyBookings from "./pages/MyBookings";
import AdminLayout from "./layouts/AdminLayout";
import AdminBookings from "./pages/Admin/AdminBookings";
import Dashboard from "./pages/Admin/Dashboard";
import Courts from "./pages/Admin/Courts";
import CalendarPage from "./pages/Admin/CalendarPage";
import AdminCustomers from "./pages/Admin/AdminCustomers";
import AdminVouchers from "./pages/Admin/AdminVouchers";
import AdminEmployees from "./pages/Admin/AdminEmployees";
import ClientLayout from "./layouts/ClientLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Paygate from "./pages/Paygate";
import VnPayReturn from "./pages/VnPayReturn";
import VnPaySandbox from "./pages/VnPaySandbox";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="detail" element={<Detail />} />
          <Route path="booking" element={<Booking />} />
          <Route path="tim-san" element={<List />} />
          <Route path="fields" element={<FieldPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="ban-do" element={<MapPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="paygate" element={<Paygate />} />
          <Route path="vnpay-return" element={<VnPayReturn />} />
          <Route path="vnpay-sandbox" element={<VnPaySandbox />} />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="courts" element={<Courts />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="vouchers" element={<AdminVouchers />} />
          <Route path="employees" element={<AdminEmployees />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
