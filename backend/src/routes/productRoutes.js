// routes/productRoutes.js
import express from "express"
import Product from "../models/Product.js"
import mongoose from "mongoose"

const router = express.Router()

// GET ALL (http://localhost:5000/api/products)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// GET BY ID (http://localhost:5000/api/products/699bfb97cce13ad8a7cc7aa3)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

export default router