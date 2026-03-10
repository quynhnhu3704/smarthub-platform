// src/models/Product.js
import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true
    },
    price: { type: Number, required: true },
    ram: { type: Number },
    storage: { type: Number },
    screen_size: { type: Number },
    resolution: { type: String },
    chipset: { type: String },
    os: { type: String },
    rear_camera: { type: String },
    front_camera: { type: String },
    battery: { type: Number },
    dimensions: { type: String },
    weight: { type: Number },
    rating_value: { type: Number },
    rating_count: { type: Number },
    original_price: { type: Number },
    stock: { type: Number },
    image_url: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  }, 
  {
    timestamps: true,
    collection: "products"
  }
)

const Product = mongoose.model("Product", productSchema)

export default Product