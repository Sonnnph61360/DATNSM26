import Booking from "../models/Booking";
import Court from "../models/Court";
import { nextId } from "../utils/ids";
import { serialize, serializeMany } from "../utils/serialize";

function toMin(t) {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + (m || 0);
}

function overlaps(aTime, aDur, bTime, bDur) {
  const a0 = toMin(aTime);
  const a1 = a0 + (aDur || 1) * 60;
  const b0 = toMin(bTime);
  const b1 = b0 + (bDur || 1) * 60;
  return a0 < b1 && b0 < a1;
}

export async function getBookings(req, res) {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.courtId) filter.courtId = Number(req.query.courtId);
    if (req.query.fieldId) filter.fieldId = Number(req.query.fieldId);
    if (req.query.status) filter.status = req.query.status;
    const list = await Booking.find(filter).sort({ id: -1 });
    return res.json(serializeMany(list));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function getBooking(req, res) {
  try {
    const id = Number(req.params.id);
    const b = await Booking.findOne({ id });
    if (!b) return res.status(404).json({ message: "Not found" });
    return res.json(serialize(b));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function createBooking(req, res) {
  try {
    const {
      fieldId,
      courtId,
      fieldName,
      court,
      date,
      time,
      duration,
      total,
      customer,
      paymentMethod,
      paymentStatus,
      status,
    } = req.body;

    if (!courtId || !date || !time) {
      return res.status(400).json({ message: "Thiếu courtId, date hoặc time" });
    }

    const existing = await Booking.find({
      courtId: Number(courtId),
      date,
      status: { $ne: "cancelled" },
    });

    const dur = Number(duration) || 1;
    const conflict = existing.find((b) =>
      overlaps(b.time, b.duration, time, dur)
    );
    if (conflict) {
      return res.status(409).json({
        message: "Khung giờ đã được đặt. Vui lòng chọn giờ khác.",
        conflictId: conflict.id,
      });
    }

    const id = await nextId("bookings");
    const booking = await Booking.create({
      id,
      fieldId: Number(fieldId),
      courtId: Number(courtId),
      fieldName: fieldName || "",
      court: court || "",
      date,
      time,
      duration: dur,
      total: Number(total) || 0,
      customer: customer || {},
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentStatus || "unpaid",
      status: status || "pending",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json(serialize(booking));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const id = Number(req.params.id);
    const b = await Booking.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );
    if (!b) return res.status(404).json({ message: "Not found" });
    return res.json(serialize(b));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const id = Number(req.params.id);
    const b = await Booking.findOneAndDelete({ id });
    if (!b) return res.status(404).json({ message: "Not found" });
    return res.json(serialize(b));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
