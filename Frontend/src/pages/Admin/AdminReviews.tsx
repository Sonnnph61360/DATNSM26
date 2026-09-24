import { useEffect, useState } from "react";
import { Button, Popconfirm, Switch, Table, message } from "antd";
import { MessageCircle, Trash2 } from "lucide-react";
import { api, Review } from "../../lib/api";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const response = await api.get<Review[]>("/reviews");
      setReviews(response.data);
    } catch {
      message.error("Không tải được danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const toggleVisibility = async (review: Review) => {
    try {
      await api.patch(`/reviews/${review.id}`, { status: review.status === "visible" ? "hidden" : "visible" });
      message.success(review.status === "visible" ? "Đã ẩn đánh giá" : "Đã hiện đánh giá");
      loadReviews();
    } catch {
      message.error("Không thể cập nhật đánh giá");
    }
  };

  const removeReview = async (id: number) => {
    try {
      await api.delete(`/reviews/${id}`);
      message.success("Đã xóa đánh giá");
      setReviews((current) => current.filter((review) => review.id !== id));
    } catch {
      message.error("Không thể xóa đánh giá");
    }
  };

  return <div className="animate-in fade-in duration-500 pb-10">
    <div className="mb-8 flex items-center gap-3"><MessageCircle className="text-yellow-400" size={28} /><div><h1 className="text-3xl font-black text-white">Quản lý đánh giá</h1><p className="mt-2 font-medium text-gray-500">Ẩn hoặc xóa nội dung không phù hợp từ người chơi.</p></div></div>
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 p-6 shadow-2xl">
      <Table
        loading={loading}
        rowKey="id"
        dataSource={reviews}
        className="modern-table"
        columns={[
          { title: "Người đánh giá", dataIndex: "userName", render: (value: string) => <span className="font-bold text-gray-800">{value}</span> },
          { title: "Cơ sở", dataIndex: "fieldId", render: (value: number) => <span className="text-gray-600">#{value}</span> },
          { title: "Số sao", dataIndex: "rating", render: (value: number) => <span className="font-bold text-amber-600">{"★".repeat(value)}{"☆".repeat(5 - value)}</span> },
          { title: "Nội dung", dataIndex: "comment", render: (value: string) => <span className="line-clamp-2 text-gray-600">{value || "Không có bình luận"}</span> },
          { title: "Trạng thái", dataIndex: "status", render: (value: Review["status"]) => <span className={`rounded-full px-2 py-1 text-xs font-bold ${value === "visible" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{value === "visible" ? "Đang hiện" : "Đã ẩn"}</span> },
          { title: "Thao tác", key: "actions", render: (_: unknown, review: Review) => <div className="flex items-center gap-3"><Switch checked={review.status === "visible"} onChange={() => toggleVisibility(review)} /><Popconfirm title="Xóa đánh giá này?" okText="Xóa" cancelText="Hủy" onConfirm={() => removeReview(review.id)}><Button danger type="text" icon={<Trash2 size={16} />} /></Popconfirm></div> },
        ]}
      />
    </div>
  </div>;
}
