// services/models/TouristSpot.ts

import mongoose, { Schema, model, models } from "mongoose";

const userApplicationSchema = new Schema({});

const UserApplication =
  models.UserApplication || model("UserApplication", userApplicationSchema);
export default UserApplication;
