import { Router } from "express";
import {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking";

const router = Router();
router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.patch("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
