import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import ClientLayout from "./layouts/ClientLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="detail" element={<Detail />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
