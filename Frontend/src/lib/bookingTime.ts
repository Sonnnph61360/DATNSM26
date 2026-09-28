const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

export const vietnamTodayIso = (nowMs = Date.now()) =>
  new Date(nowMs + VIETNAM_OFFSET_MS).toISOString().slice(0, 10);

export const isPastVietnamSlot = (
  slotDate: string,
  slotTime: string,
  nowMs = Date.now(),
) => {
  if (!slotDate || !slotTime) return false;

  const vietnamNow = new Date(nowMs + VIETNAM_OFFSET_MS);
  const today = vietnamNow.toISOString().slice(0, 10);
  if (slotDate < today) return true;
  if (slotDate > today) return false;

  const [hour, minute] = slotTime.split(":").map(Number);
  const currentMinute = vietnamNow.getUTCHours() * 60 + vietnamNow.getUTCMinutes();
  return hour * 60 + minute <= currentMinute;
};

export type VietnamSlotPhase = "upcoming" | "playing" | "finished";

export const getVietnamSlotPhase = (
  slotDate: string,
  slotTime: string,
  duration: number,
  checkedInAt?: string | null,
  nowMs = Date.now(),
) : VietnamSlotPhase | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slotDate) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(slotTime)) return null;
  const hours = Number(duration);
  if (!Number.isFinite(hours) || hours <= 0) return null;

  const [year, month, day] = slotDate.split("-").map(Number);
  const [hour, minute] = slotTime.split(":").map(Number);
  const startMs = Date.UTC(year, month - 1, day, hour - 7, minute);
  const endMs = startMs + hours * 60 * 60 * 1000;
  if (nowMs >= endMs) return "finished";
  if (nowMs >= startMs) return checkedInAt ? "playing" : null;
  if (nowMs >= startMs - 30 * 60 * 1000) return "upcoming";
  return null;
};
