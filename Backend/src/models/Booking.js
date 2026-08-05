import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    note: String,
    userId: Number,
    email: String,
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    fieldId: { type: Number, required: true, index: true },
    courtId: { type: Number, required: true, index: true },
    fieldName: { type: String, default: "" },
    court: { type: String, default: "" },
    date: { type: String, required: true, index: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 1 },
    total: { type: Number, default: 0 },
    customer: customerSchema,
    paymentMethod: { type: String, default: "cash" },
    paymentStatus: { type: String, default: "unpaid" },
    status: { type: String, default: "pending" },
    createdAt: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Booking", bookingSchema);
