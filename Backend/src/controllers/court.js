import Court from "../models/Court";
import Field from "../models/Field";
import { nextId } from "../utils/ids";
import { serialize, serializeMany } from "../utils/serialize";

export async function getCourts(req, res) {
  try {
    const filter = {};
    if (req.query.fieldId) filter.fieldId = Number(req.query.fieldId);
    if (req.query.status) filter.status = req.query.status;
    const courts = await Court.find(filter).sort({ id: 1 });
    return res.json(serializeMany(courts));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function getCourt(req, res) {
  try {
    const id = Number(req.params.id);
    const court = await Court.findOne({ id });
    if (!court) return res.status(404).json({ message: "Not found" });
    return res.json(serialize(court));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}

export async function createCourt(req, res) {
  try {
    const id = await nextId("courts");
    const body = {
      ...req.body,
      id,
      fieldId: Number(req.body.fieldId),
      price: Number(req.body.price) || 0,
    };
    const court = await Court.create(body);
    // cập nhật courtCount
    if (body.fieldId) {
      const count = await Court.countDocuments({ fieldId: body.fieldId });
      await Field.findOneAndUpdate({ id: body.fieldId }, { courtCount: count });
    }
    return res.status(201).json(serialize(court));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

export async function updateCourt(req, res) {
  try {
    const id = Number(req.params.id);
    const court = await Court.findOneAndUpdate(
      { id },
      { $set: req.body },
      { new: true }
    );
    if (!court) return res.status(404).json({ message: "Not found" });
    return res.json(serialize(court));
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

export async function deleteCourt(req, res) {
  try {
    const id = Number(req.params.id);
    const court = await Court.findOneAndDelete({ id });
    if (!court) return res.status(404).json({ message: "Not found" });
    if (court.fieldId) {
      const count = await Court.countDocuments({ fieldId: court.fieldId });
      await Field.findOneAndUpdate({ id: court.fieldId }, { courtCount: count });
    }
    return res.json(serialize(court));
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
