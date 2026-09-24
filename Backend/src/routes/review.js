import { Router } from "express";
import { adminRequired, attachUser } from "../middleware/auth";
import { createReview, deleteReview, getReviewEligibility, getReviews, moderateReview } from "../controllers/review";

const router = Router();
router.get("/", attachUser, getReviews);
router.get("/eligibility", attachUser, getReviewEligibility);
router.post("/", attachUser, createReview);
router.patch("/:id", adminRequired, moderateReview);
router.delete("/:id", adminRequired, deleteReview);

export default router;
