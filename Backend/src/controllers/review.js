import Review from "../models/Review";
import { nextId } from "../utils/ids";
import { serialize, serializeMany } from "../utils/serialize";

export async function getReviews(req, res) {
  try {
    const filter = {};
    if (req.query.fieldId) filter.fieldId = Number(req.query.fieldId);
    if (req.user?.role !== "admin") filter.status = "visible";
    const list = await Review.find(filter).sort({ createdAt: -1, id: -1 });
    return res.json(serializeMany(list));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getReviewEligibility(req, res) {
  try {
    const fieldId = Number(req.query.fieldId);
    if (!Number.isFinite(fieldId)) return res.status(400).json({ message: "fieldId không hợp lệ" });
    return res.json({ eligible: true, reason: null, bookingId: null, existingReview: null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createReview(req, res) {
  try {
    const fieldId = Number(req.body.fieldId);
    const bookingId = Number(req.body.bookingId);
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    if (!Number.isFinite(fieldId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Thông tin đánh giá không hợp lệ" });
    }
    if (comment.length > 2000) return res.status(400).json({ message: "Bình luận tối đa 2000 ký tự" });

    const review = await Review.create({
      id: await nextId("reviews"),
      fieldId,
      ...(Number.isFinite(bookingId) ? { bookingId } : {}),
      ...(req.user?.id ? { userId: Number(req.user.id) } : {}),
      userName: req.user?.fullName || String(req.body.userName || "Khách vãng lai").trim().slice(0, 120),
      rating,
      comment,
      status: "visible",
    });
    return res.status(201).json(serialize(review));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function moderateReview(req, res) {
  try {
    const review = await Review.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: { status: req.body.status === "hidden" ? "hidden" : "visible" } },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    return res.json(serialize(review));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const deleted = await Review.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    return res.json({ message: "Đã xóa đánh giá" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
