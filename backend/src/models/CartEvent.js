// models/CartEvent.js
import mongoose from "mongoose"

const cartEventItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const cartEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [cartEventItemSchema]
}, { timestamps: true })

export default mongoose.model("CartEvent", cartEventSchema)