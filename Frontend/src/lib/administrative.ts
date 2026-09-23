export type District = {
  code: number;
  name: string;
  division_type?: string;
};

type MajorCity = {
  code: number;
  name: string;
};

export const majorCities: MajorCity[] = [
  { code: 79, name: "Hồ Chí Minh" },
  { code: 1, name: "Hà Nội" },
  { code: 48, name: "Đà Nẵng" },
];

export async function fetchDistricts(cityCode: number): Promise<District[]> {
  const response = await fetch(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
  if (!response.ok) throw new Error("Không tải được danh sách quận huyện");
  const data = await response.json() as { districts?: District[] };
  return data.districts || [];
}