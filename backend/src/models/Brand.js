// src/models/Brand.js
import mongoose from "mongoose"

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true,
    collection: "brands"
  }
)

const Brand = mongoose.model("Brand", brandSchema)

export default Brand