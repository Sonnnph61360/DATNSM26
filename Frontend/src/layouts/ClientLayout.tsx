import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClientLayout() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
