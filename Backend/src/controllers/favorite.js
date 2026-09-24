import Favorite from "../models/Favorite";
import Field from "../models/Field";
import { nextId } from "../utils/ids";
import { serializeMany } from "../utils/serialize";

export async function getFavorites(req, res) {
  try {
    const favorites = await Favorite.find({ userId: Number(req.user.id) }).sort({ createdAt: -1 });
    return res.json(serializeMany(favorites));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function addFavorite(req, res) {
  try {
    const fieldId = Number(req.body.fieldId);
    if (!Number.isFinite(fieldId)) return res.status(400).json({ message: "fieldId không hợp lệ" });
    if (!await Field.exists({ id: fieldId })) return res.status(404).json({ message: "Không tìm thấy sân" });
    const favorite = await Favorite.findOneAndUpdate(
      { userId: Number(req.user.id), fieldId },
      { $setOnInsert: { id: await nextId("favorites"), userId: Number(req.user.id), fieldId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ id: favorite.id, fieldId: favorite.fieldId });
  } catch (error) {
    return res.status(error?.code === 11000 ? 409 : 400).json({ message: error.message });
  }
}

export async function removeFavorite(req, res) {
  try {
    const fieldId = Number(req.params.fieldId);
    await Favorite.deleteOne({ userId: Number(req.user.id), fieldId });
    return res.json({ message: "Đã bỏ yêu thích" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
