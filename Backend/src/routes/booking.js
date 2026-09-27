import { Router } from "express";
import multer from "multer";
import {
  getBookings,
  getBookingAvailability,
  getBooking,
  getBookingDetail,
  getRefundRequests,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  completeRefund,
  confirmRefundReceipt,
  getRefundProof,
  checkInBooking,
  confirmBookingPayment,
  addBookingServices,
} from "../controllers/booking";
import { adminRequired, authRequired, staffRequired } from "../middleware/auth";
import { checkBookingAvailability } from "../controllers/bookingAvailability";

const router = Router();
const parseRefundProof = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) return callback(null, true);
    return callback(new Error("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP"));
  },
}).single("proof");

function handleRefundProofUpload(req, res, next) {
  parseRefundProof(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message });
    next();
  });
}

router.get("/", authRequired, getBookings);
router.get("/availability", getBookingAvailability);
router.post("/check-availability", authRequired, checkBookingAvailability);
router.get("/refunds", staffRequired, getRefundRequests);
router.get("/:id/refund-proof", authRequired, getRefundProof);
router.get("/:id/detail", authRequired, getBookingDetail);
router.get("/:id", authRequired, getBooking);
router.post("/", authRequired, createBooking);
router.post("/:id/services", staffRequired, addBookingServices);
router.post("/:id/cancel", authRequired, cancelBooking);
router.post("/:id/refund", adminRequired, handleRefundProofUpload, completeRefund);
router.patch("/:id/refund-receipt", authRequired, confirmRefundReceipt);
router.post("/:id/confirm-payment", staffRequired, confirmBookingPayment);
router.post("/:id/check-in", staffRequired, checkInBooking);
router.put("/:id", staffRequired, updateBooking);
router.patch("/:id", staffRequired, updateBooking);
router.delete("/:id", adminRequired, deleteBooking);

export default router;
