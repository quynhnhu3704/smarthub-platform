// src/models/Survey.js
import mongoose from "mongoose"

const surveySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  brands: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true }],
  price_min: { type: Number, required: true },
  price_max: { type: Number, required: true },
  ram_min: { type: Number, required: true },
  ram_max: { type: Number, required: true },
  storage_min: { type: Number, required: true },
  storage_max: { type: Number, required: true },
  battery_min: { type: Number, required: true },
  battery_max: { type: Number, required: true },
  screen_min: { type: Number, required: true },
  screen_max: { type: Number, required: true }
}, {
  timestamps: true,
  collection: "surveys"
})

const Survey = mongoose.model("Survey", surveySchema)
export default Survey