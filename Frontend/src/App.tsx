import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import FieldPage from "./pages/FieldPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminBookings from "./pages/AdminBookings";
import Dashboard from "./pages/admin/Dashboard";
import Courts from "./pages/admin/Courts";
import CalendarPage from "./pages/admin/CalendarPage";
import ClientLayout from "./layouts/ClientLayout";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="detail" element={<Detail />} />
          <Route path="booking" element={<Booking />} />
          <Route path="fields" element={<FieldPage />} />
          <Route path="blog" element={<Blog />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="ban-do" element={<MapPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="courts" element={<Courts />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
