// models/SearchHistory.js
import mongoose from "mongoose"

const searchHistorySchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    count: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
)

searchHistorySchema.index({ keyword: 1, user: 1 }, { unique: true })

export default mongoose.model("SearchHistory", searchHistorySchema)