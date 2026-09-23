import type { Booking, Court, Field } from "../lib/api";

const demoImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80";

export const demoFields: Field[] = [
  {
    id: 101,
    name: "Golden Court Thảo Điền",
    sport: "Bóng Rổ",
    sportLabel: "Bóng Rổ",
    address: "12 Xuân Thủy, Thảo Điền, Hồ Chí Minh",
    city: "Hồ Chí Minh",
    phone: "0909000101",
    openTime: "06:00",
    closeTime: "22:00",
    description: "Cụm sân bóng rổ ngoài trời thoáng mát, phù hợp tập luyện và thi đấu.",
    image: demoImage,
    courtCount: 2,
    priceFrom: 120000,
    status: "active",
    lat: 10.803,
    lng: 106.735,
  },
];

const courtsByField: Record<number, Court[]> = {
  101: [
    { id: 1011, fieldId: 101, name: "Sân 1", type: "Bóng rổ 5x5", price: 120000, status: "active", capacity: 10 },
    { id: 1012, fieldId: 101, name: "Sân 2", type: "Bóng rổ 5x5", price: 140000, status: "active", capacity: 10 },
  ],
};

export function getDemoField(id: number | string) {
  return demoFields.find((field) => field.id === Number(id));
}

export function getDemoCourts(fieldId: number | string) {
  return courtsByField[Number(fieldId)] || [];
}

type DemoBookingCustomer = {
  fullName: string;
  phone: string;
  email?: string;
  userId?: number;
};

export function createDemoBookings(_customer: DemoBookingCustomer): Booking[] {
  return [];
}

export function getFieldGallery(field: Field) {
  return [field.image, field.imageUrl, demoImage].filter((image): image is string => Boolean(image));
}

export function getFieldReviews(_fieldId: number) {
  return [
    { id: 1, author: "Minh Anh", initial: "M", date: "Tháng này", rating: 5, comment: "Mặt sân tốt, đặt lịch nhanh và nhân viên hỗ trợ nhiệt tình." },
    { id: 2, author: "Hoàng Nam", initial: "H", date: "Tháng trước", rating: 4, comment: "Không gian thoáng, lịch sân hiển thị rõ ràng." },
  ];
}