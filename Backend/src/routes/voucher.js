import { Router } from "express";
import {
    getVouchers,
    getVoucher,
    createVoucher,
    updateVoucher,
    deleteVoucher
} from "../controllers/voucher";

const router = Router();

router.get("/", getVouchers);
router.get("/:id", getVoucher);
router.post("/", createVoucher);
router.put("/:id", updateVoucher);
router.patch("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

export default router;
