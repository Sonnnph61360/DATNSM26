import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },
        code: { type: String, required: true, trim: true, unique: true },
        discount: { type: Number, required: true },
        type: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
        limit: { type: Number, required: true },
        used: { type: Number, default: 0 },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Voucher", voucherSchema);
