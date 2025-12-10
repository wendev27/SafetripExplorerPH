import mongoose, { Schema, model, models } from "mongoose";

const reviewSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "UserApplication",
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    spotId: {
      type: Schema.Types.ObjectId,
      ref: "TouristSpot",
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create indexes for better query performance
reviewSchema.index({ spotId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true }); // One review per booking

const Review = models.Review || model("Review", reviewSchema);
export default Review;
