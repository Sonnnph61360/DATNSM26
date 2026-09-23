export type ClubTone = "navy" | "amber" | "emerald" | "blue";

export const locationOptions: Record<string, string[]> = {
  "Hồ Chí Minh": ["Tất cả khu vực", "Quận 1", "Quận 8", "Thảo Điền"],
  "Hà Nội": ["Tất cả khu vực", "Cầu Giấy", "Nam Từ Liêm", "Đống Đa"],
  "Đà Nẵng": ["Tất cả khu vực", "Sơn Trà", "Hải Châu", "Thanh Khê"],
};

export const clubs = [
  { id: 1, name: "Saigon Hoopers", area: "Quận 1, Hồ Chí Minh", sport: "Bóng rổ", members: 128, rating: 4.9, initials: "SH", tone: "navy" as ClubTone },
  { id: 2, name: "Hanoi Dunkers", area: "Cầu Giấy, Hà Nội", sport: "Bóng rổ", members: 96, rating: 4.8, initials: "HD", tone: "amber" as ClubTone },
  { id: 3, name: "Eastside Ballers", area: "Thảo Điền, Hồ Chí Minh", sport: "Bóng rổ", members: 74, rating: 4.7, initials: "EB", tone: "emerald" as ClubTone },
  { id: 4, name: "Danang Waves", area: "Sơn Trà, Đà Nẵng", sport: "Bóng rổ", members: 61, rating: 4.8, initials: "DW", tone: "blue" as ClubTone },
];

export const tournaments = [
  { id: 1, name: "GoldenState Summer Cup", sport: "Bóng rổ 5x5", date: "20/07/2026", location: "Hồ Chí Minh", teams: 16, status: "Đang mở đăng ký", image: "https://images.unsplash.com/photo-1518407613690-d9fc990e795f?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, name: "Hanoi Streetball Open", sport: "Bóng rổ 3x3", date: "02/08/2026", location: "Hà Nội", teams: 24, status: "Sắp mở", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80" },
  { id: 3, name: "Mekong Weekend League", sport: "Bóng rổ 5x5", date: "16/08/2026", location: "Cần Thơ", teams: 12, status: "Đang mở đăng ký", image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80" },
];

export const rankings = [
  { rank: 1, name: "Saigon Hoopers", initials: "SH", matches: 12, won: 11, lost: 1, points: 23 },
  { rank: 2, name: "Hanoi Dunkers", initials: "HD", matches: 12, won: 9, lost: 3, points: 21 },
  { rank: 3, name: "Eastside Ballers", initials: "EB", matches: 12, won: 8, lost: 4, points: 20 },
  { rank: 4, name: "Danang Waves", initials: "DW", matches: 12, won: 6, lost: 6, points: 18 },
];