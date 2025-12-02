// services/models/TouristSpot.ts
import mongoose, { Schema, model, models } from "mongoose";

const touristSpotSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    images: [{ type: String }], // array of URLs
    amenities: [{ type: String }], // optional
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

const TouristSpot =
  models.TouristSpot || model("TouristSpot", touristSpotSchema);
export default TouristSpot;
