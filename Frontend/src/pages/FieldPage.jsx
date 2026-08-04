import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Select, Spin, Pagination } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { fetchFields } from "../lib/api";

const PAGE_SIZE = 6;

export default function FieldPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sport, setSport] = useState("all");
  const [city, setCity] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFields();
        setFields(data);
      } catch {
        setFields([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sports = useMemo(() => {
    const s = new Set(fields.map((f) => f.sportLabel));
    return ["all", ...Array.from(s)];
  }, [fields]);

  const cities = useMemo(() => {
    const s = new Set(fields.map((f) => f.city));
    return ["all", ...Array.from(s)];
  }, [fields]);

  const filtered = useMemo(() => {
    return fields.filter((f) => {
      const kw = keyword.trim().toLowerCase();
      const matchKw =
        !kw ||
        f.name.toLowerCase().includes(kw) ||
        f.address.toLowerCase().includes(kw);
      const matchSport = sport === "all" || f.sportLabel === sport;
      const matchCity = city === "all" || f.city === city;
      return matchKw && matchSport && matchCity;
    });
  }, [fields, keyword, sport, city]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
          <div className="text-xs text-emerald-200 mb-2">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>{" "}
            › Danh Sách
          </div>
          <h1 className="text-3xl font-bold mb-2"> Tìm sân thể thao</h1>
          <p className="text-emerald-200">
            Tìm thấy <strong className="text-white">{filtered.length}</strong> cơ sở phù hợp
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-3">
          <Input
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Tên sân, khu vực..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            className="flex-1"
          />
          <Select
            size="large"
            value={sport}
            onChange={(v) => {
              setSport(v);
              setPage(1);
            }}
            className="md:w-48"
            options={sports.map((s) => ({
              value: s,
              label: s === "all" ? "Tất cả loại sân" : s,
            }))}
          />
          <Select
            size="large"
            value={city}
            onChange={(v) => {
              setCity(v);
              setPage(1);
            }}
            className="md:w-48"
            options={cities.map((c) => ({
              value: c,
              label: c === "all" ? "Tất cả tỉnh" : c,
            }))}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            Không tìm thấy cơ sở phù hợp
          </div>
        ) : (
          <div className="space-y-4">
            {paginated.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-40 h-28 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <EnvironmentOutlined className="mr-1 text-emerald-600" />
                    {item.address}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                      {item.sportLabel}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.courtCount} sân · từ{" "}
                      {item.priceFrom?.toLocaleString("vi-VN")}đ/h
                    </span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 justify-center">
                  <Link
                    to={`/detail/${item.id}`}
                    className="border border-emerald-600 text-emerald-600 text-sm font-semibold rounded-md px-4 py-2 text-center hover:bg-emerald-50"
                  >
                    Chi tiết
                  </Link>
                  <Link
                    to={`/booking?fieldId=${item.id}`}
                    className="bg-emerald-600 text-white text-sm font-semibold rounded-md px-4 py-2 text-center hover:bg-emerald-700"
                  >
                    Đặt sân
                  </Link>
                </div>
              </div>
            ))}
            <div className="flex justify-center pt-6">
              <Pagination
                current={page}
                total={filtered.length}
                pageSize={PAGE_SIZE}
                onChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
