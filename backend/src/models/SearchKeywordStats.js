// models/SearchKeywordStats.js
import mongoose from "mongoose"

const searchKeywordStatsSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model("SearchKeywordStats", searchKeywordStatsSchema)