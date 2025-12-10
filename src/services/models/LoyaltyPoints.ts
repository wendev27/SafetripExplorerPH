import mongoose, { Schema, model, models } from "mongoose";
import { int } from "zod";

const loyaltySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true, trim: true },
});
