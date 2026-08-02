import { Calendar, Badge } from "antd";
import type { Dayjs } from "dayjs";
import { PlusCircle } from "lucide-react";

export default function CalendarPage() {

    // Fake event function
    const getListData = (value: Dayjs) => {
        let listData;
        switch (value.date()) {
            case 1:
                listData = [
                    { type: "success", content: "17:00 - hoang (Sân 1)" },
                    { type: "success", content: "21:00 - hoang (Sân 2)" },
                ];
                break;
            case 8:
                listData = [
                    { type: "warning", content: "08:00 - V.I.P (Sân 1)" },
                    { type: "success", content: "09:30 - Nhóm ABC" },
                ];
                break;
            case 15:
                listData = [
                    { type: "error", content: "Bảo trì tất cả sân" },
                ];
                break;
            default:
        }
        return listData || [];
    };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
            <ul className="m-0 p-0 list-none text-xs">
                {listData.map((item, index) => (
                    <li key={index} className="mb-1">
                        <Badge status={item.type as any} text={<span className="text-xs font-semibold text-gray-700">{item.content}</span>} />
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lịch Biểu Đặt Sân</h1>
                    <p className="text-gray-500 text-sm">Xem lịch trực quan để chống trùng lấp hoặc xếp lịch offline</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold flex items-center transition shadow-sm">
                    <PlusCircle size={18} className="mr-2" /> Xếp lịch khách vãng lai
                </button>
            </div>

            <div className="border border-gray-100 p-4 rounded-xl mt-4">
                <Calendar cellRender={dateCellRender} />
            </div>
        </div>
    )
}
