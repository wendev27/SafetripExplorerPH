// services/models/Logs.ts

import mongoose, { Schema, model, models } from "mongoose";
const logSchema = new Schema({
  action: { type: String, required: true, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, trim: true },
});

const LogSchema = models.Log || model("Log", logSchema);

export default LogSchema;
