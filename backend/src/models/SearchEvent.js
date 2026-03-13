// models/SearchEvent.js
import mongoose from "mongoose"

const searchEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  keyword: {
    type: String,
    required: true
  }
}, { timestamps: true })

export default mongoose.model("SearchEvent", searchEventSchema)