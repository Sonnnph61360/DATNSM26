import Voucher from "../models/Voucher";
import { nextId } from "../utils/ids";
import { serialize, serializeMany } from "../utils/serialize";

export async function getVouchers(req, res) {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.code) filter.code = req.query.code;
        const vouchers = await Voucher.find(filter).sort({ id: 1 });
        return res.json(serializeMany(vouchers));
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getVoucher(req, res) {
    try {
        const id = Number(req.params.id);
        const voucher = await Voucher.findOne({ id });
        if (!voucher) return res.status(404).json({ message: "Not found" });
        return res.json(serialize(voucher));
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function createVoucher(req, res) {
    try {
        const { code } = req.body;
        if (code) {
            const existing = await Voucher.findOne({ code });
            if (existing) {
                return res.status(409).json({ message: "Mã code đã tồn tại" });
            }
        }
        const id = await nextId("vouchers");
        const voucher = await Voucher.create({ ...req.body, id });
        return res.status(201).json(serialize(voucher));
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}

export async function updateVoucher(req, res) {
    try {
        const id = Number(req.params.id);
        if (req.body.code) {
            const existing = await Voucher.findOne({
                code: req.body.code,
                id: { $ne: id }
            });
            if (existing) {
                return res.status(409).json({ message: "Mã code đã tồn tại" });
            }
        }

        const voucher = await Voucher.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true }
        );
        if (!voucher) return res.status(404).json({ message: "Not found" });
        return res.json(serialize(voucher));
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}

export async function deleteVoucher(req, res) {
    try {
        const id = Number(req.params.id);
        const voucher = await Voucher.findOneAndDelete({ id });
        if (!voucher) return res.status(404).json({ message: "Not found" });
        return res.json(serialize(voucher));
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}
