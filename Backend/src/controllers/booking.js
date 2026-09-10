import Booking from "../models/Booking";
import Court from "../models/Court";
import { nextId } from "../utils/ids";
import { serialize, serializeMany } from "../utils/serialize";
import Voucher from "../models/Voucher";
import { sendMail } from "../utils/mailer";

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
      recurringDates,
      time,
      duration,
      total,
      customer,
      services,
      paymentMethod,
      paymentStatus,
      status,
      voucherCode,
      discount,
    } = req.body;

    const targetDates = (recurringDates && recurringDates.length > 0) ? recurringDates : [date];
    const dur = Number(duration) || 1;

    for (const d of targetDates) {
      if (!courtId || !d || !time) {
        return res.status(400).json({ message: "Thiếu courtId, date hoặc time" });
      }

      const existing = await Booking.find({
        courtId: Number(courtId),
        date: d,
        status: { $ne: "cancelled" },
      });

      const conflict = existing.find((b) =>
        overlaps(b.time, b.duration, time, dur)
      );
      if (conflict) {
        return res.status(409).json({
          message: `Khung giờ ngày ${d} đã được đặt. Vui lòng chọn giờ khác.`,
          conflictId: conflict.id,
        });
      }
    }

    let firstBooking = null;
    const singleTotal = Number(total) / targetDates.length || 0;

    for (const d of targetDates) {
      const id = await nextId("bookings");
      const booking = await Booking.create({
        id,
        fieldId: Number(fieldId),
        courtId: Number(courtId),
        fieldName: fieldName || "",
        court: court || "",
        date: d,
        time,
        duration: dur,
        total: singleTotal,
        customer: customer || {},
        services: services || [],
        paymentMethod: paymentMethod || "cash",
        paymentStatus: paymentStatus || "unpaid",
        status: status || "pending",
        voucherCode: voucherCode || "",
        discount: discount || 0,
        createdAt: new Date().toISOString(),
      });
      if (!firstBooking) firstBooking = booking;
    }

    // Cập nhật lượt dùng của voucher
    if (voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: voucherCode },
        { $inc: { used: 1 } }
      );
    }

    if (firstBooking.paymentMethod === "deposit" || firstBooking.paymentMethod === "full" || firstBooking.paymentMethod === "transfer") {
      const isDeposit = firstBooking.paymentMethod === "deposit";
      let subject = `Xác nhận đặt sân và thanh toán: BK${String(firstBooking.id).padStart(6, '0')}`;
      if (targetDates.length > 1) {
        subject = `Xác nhận đặt nhiều buổi (${targetDates.length} buổi) và thanh toán: BK${String(firstBooking.id).padStart(6, '0')}`;
      }

      const qrData = `CHECKIN-BK${String(firstBooking.id).padStart(6, '0')} | Sân: ${firstBooking.fieldName} - ${firstBooking.court} | Tên: ${firstBooking.customer.fullName} | ĐT: ${firstBooking.customer.phone}`;
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=250`;

      const msg = `Xin chào ${firstBooking.customer.fullName},<br/><br/>
      Bạn đã ${isDeposit ? 'cọc tiền' : 'thanh toán hết'} cho đơn đặt sân.<br/>
      <b>Cơ sở:</b> ${firstBooking.fieldName} - ${firstBooking.court}<br/>
      <b>Ngày đầu tiên:</b> ${firstBooking.date} lúc ${firstBooking.time} (${firstBooking.duration} giờ)<br/>
      <b>Số lượng buổi:</b> ${targetDates.length}<br/>
      <br/>
      <b>Mã QR CHECK-IN SÂN CỦA BẠN:</b><br/>
      <img src="${qrUrl}" alt="QR Check-in" /><br/>
      Vui lòng đưa mã QR này cho nhân viên tại sân khi đến check-in.<br/><br/>
      Cảm ơn bạn!`;

      const toEmail = firstBooking.customer.email;
      if (toEmail) {
        sendMail(toEmail, subject, msg);
      }
    }

    return res.status(201).json(serialize(firstBooking));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const id = Number(req.params.id);
    const current = await Booking.findOne({ id });
    if (!current) return res.status(404).json({ message: "Not found" });

    if (current.status === "cancelled" && req.body.status && req.body.status !== "cancelled") {
      return res.status(400).json({ message: "Đơn đã hủy không thể thay đổi trạng thái" });
    }

    const b = await Booking.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );

    console.log("=== CHECK CANCEL CONDITIONS ===");
    console.log("req.body.status:", req.body.status);
    console.log("req.body.refundStk:", req.body.refundStk);
    console.log("b.customer:", JSON.stringify(b.customer));

    // Gửi mail hoàn tiền nếu có
    if (req.body.status === "cancelled" && req.body.refundStk && b.customer?.email) {
      console.log("Sending cancel email to:", b.customer.email);
      sendMail(b.customer.email, `Xác nhận yêu cầu hủy và hoàn tiền đơn BK${String(b.id).padStart(6, '0')}`,
        `Xin chào ${b.customer.fullName},<br/>Bạn đã yêu cầu hủy đơn. Hệ thống đang tiến hành hoàn tiền vào STK ${req.body.refundStk} - ${req.body.refundBank}.<br/>`);
      console.log("Cancel email sent (async).");
    } else if (req.body.paymentStatus === "refunded" && b.customer?.email) {
      console.log("Sending refunded email to:", b.customer.email);
      sendMail(b.customer.email, `Đã hoàn tiền đơn BK${String(b.id).padStart(6, '0')}`,
        `Xin chào ${b.customer.fullName},<br/>Đơn đặt sân của bạn đã được hoàn tiền thành công. Vui lòng kiểm tra STK ${b.refundStk || ''} - Ngân hàng ${b.refundBank || ''}.<br/>`);
      console.log("Refunded email sent (async).");
    }

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
