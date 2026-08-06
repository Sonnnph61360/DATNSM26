import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
   
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Court = mongoose.model("Court", courtSchema);

export default Court;