import mongoose, { Schema, model, models } from "mongoose";

const loyaltySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    points: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Create index for better query performance
loyaltySchema.index({ userId: 1 });

const LoyaltyPoints =
  models.LoyaltyPoints || model("LoyaltyPoints", loyaltySchema);
export default LoyaltyPoints;
