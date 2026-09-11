import express from "express";
import crypto from "crypto";
import Booking from "../models/Booking";
import Payment from "../models/Payment";

const router = express.Router();

function normalizeText(value) {
  if (value == null) return "";
  return String(value).trim();
}

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getSePayConfig() {
  return {
    apiKey: process.env.SEPAY_API_KEY || "test_api_key",
    accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || "0000000000",
    bankCode: process.env.SEPAY_BANK_CODE || "VCB",
    accountName: process.env.SEPAY_ACCOUNT_NAME || "Golden State",
    webhookUrl: process.env.SEPAY_WEBHOOK_URL || "https://example.com/api/sepay/webhook",
  };
}

function buildQrUrl({ amount, note, accountNumber, bankCode, accountName }) {
  const encodedNote = encodeURIComponent(note || "");
  const encodedName = encodeURIComponent(accountName || "Golden State");
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedNote}&accountName=${encodedName}`;
}

function createPaymentCode(bookingId) {
  const suffix = Date.now().toString().slice(-6);
  return `GS${String(bookingId).padStart(6, "0")}${suffix}`;
}

async function ensurePaymentRecord(bookingId, amount) {
  let payment = await Payment.findOne({ bookingId });
  const paymentCode = payment?.paymentCode || createPaymentCode(bookingId);
  const note = `DATSAN ${paymentCode}`;

  if (!payment) {
    payment = await Payment.create({
      bookingId,
      paymentCode,
      gateway: "sepay",
      bankCode: getSePayConfig().bankCode,
      accountNumber: getSePayConfig().accountNumber,
      amount: safeNumber(amount),
      status: "pending",
      reference: note,
      rawData: { note },
    });
  }

  const qrUrl = buildQrUrl({
    amount: payment.amount,
    note: payment.reference || note,
    accountNumber: payment.accountNumber || getSePayConfig().accountNumber,
    bankCode: payment.bankCode || getSePayConfig().bankCode,
    accountName: getSePayConfig().accountName,
  });

  return {
    ...payment.toObject(),
    qrUrl,
    note,
  };
}

router.get("/health", (_req, res) => {
  res.json({ ok: true, gateway: "sepay", config: getSePayConfig() });
});

router.post("/create-payment", async (req, res) => {
  try {
    const bookingId = Number(req.body.bookingId);
    const amount = safeNumber(req.body.amount);
    if (!bookingId || !amount) {
      return res.status(400).json({ message: "Thiếu bookingId hoặc amount" });
    }

    const booking = await Booking.findOne({ id: bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking" });
    }

    const payment = await ensurePaymentRecord(bookingId, amount || booking.total);

    return res.json({
      bookingId,
      bookingStatus: booking.status,
      paymentCode: payment.paymentCode,
      paymentNote: payment.reference,
      amount: payment.amount,
      status: payment.status,
      qrUrl: payment.qrUrl,
      bankCode: payment.bankCode,
      accountNumber: payment.accountNumber,
      accountName: getSePayConfig().accountName,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "SePay create-payment failed" });
  }
});

router.get("/status/:bookingId", async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const booking = await Booking.findOne({ id: bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const payment = await Payment.findOne({ bookingId }) || {
      status: "pending",
      paymentCode: "",
      amount: booking.total || 0,
    };

    return res.json({
      bookingId,
      status: booking.status,
      paymentStatus: payment.status,
      paymentCode: payment.paymentCode || "",
      amount: payment.amount || booking.total || 0,
      message: booking.status === "confirmed" ? "Thanh toán đã được xác nhận" : "Đang chờ thanh toán",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "SePay status failed" });
  }
});

router.get("/payments", async (_req, res) => {
  try {
    const list = await Payment.find({}).sort({ createdAt: -1 });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load payments" });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const payload = req.body || {};
    const rawAmount = safeNumber(payload.amount || payload.transferAmount || payload.total || payload.vndAmount);
    const bookingCodeText = normalizeText(payload.paymentCode || payload.content || payload.note || payload.orderInfo || payload.reference || "");
    const accountNumber = normalizeText(payload.accountNumber || payload.bankAccount || payload.senderAccount || "");
    const bankCode = normalizeText(payload.bankCode || payload.senderBank || payload.bank || "");
    const transactionCode = normalizeText(payload.transactionCode || payload.transactionId || payload.gatewayTxId || "");
    const status = normalizeText(payload.status || payload.transactionStatus || "pending");

    const paymentCodeMatch = bookingCodeText.match(/GS\d+/i);
    if (!paymentCodeMatch) {
      return res.status(400).json({ message: "Nội dung chuyển khoản không chứa paymentCode hợp lệ" });
    }

    const paymentCode = paymentCodeMatch[0];
    const payment = await Payment.findOne({ paymentCode });
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy paymentCode" });
    }

    const booking = await Booking.findOne({ id: payment.bookingId });
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking liên kết" });
    }

    const expectedAccount = getSePayConfig().accountNumber;
    const expectedBank = getSePayConfig().bankCode;

    if (accountNumber && expectedAccount && accountNumber !== expectedAccount) {
      return res.status(400).json({ message: "Tài khoản ngân hàng không khớp" });
    }

    if (bankCode && expectedBank && bankCode !== expectedBank) {
      return res.status(400).json({ message: "Ngân hàng không khớp" });
    }

    if (rawAmount <= 0 || rawAmount < payment.amount - 1 || rawAmount > payment.amount + 1) {
      return res.status(400).json({ message: "Số tiền không hợp lệ" });
    }

    if (status && status.toLowerCase() !== "success") {
      return res.status(200).json({ message: "Giao dịch chưa thành công" });
    }

    if (payment.status === "success") {
      return res.json({ message: "Duplicate webhook ignored" });
    }

    payment.status = "success";
    payment.transactionCode = transactionCode || payment.transactionCode;
    payment.amount = rawAmount;
    payment.bankCode = bankCode || payment.bankCode;
    payment.accountNumber = accountNumber || payment.accountNumber;
    payment.paidAt = new Date();
    payment.rawData = payload;
    payment.reference = bookingCodeText;
    await payment.save();

    await Booking.findOneAndUpdate(
      { id: booking.id },
      { $set: { paymentStatus: "paid", status: "confirmed" } },
      { new: true }
    );

    return res.json({ message: "Webhook processed successfully", paymentCode, bookingId: booking.id });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Webhook failed" });
  }
});

export default router;
