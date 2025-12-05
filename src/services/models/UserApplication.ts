import mongoose, { Schema, model, models } from "mongoose";

const applicationSchema = new Schema(
  {
    spotId: { type: Schema.Types.ObjectId, ref: "TouristSpot", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const UserApplication =
  models.UserApplication || model("UserApplication", applicationSchema);
export default UserApplication;
