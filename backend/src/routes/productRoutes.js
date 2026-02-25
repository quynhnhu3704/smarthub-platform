// routes/productRoutes.js
import express from "express"
import Product from "../models/Product.js"
import mongoose from "mongoose"

import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

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

// Thêm sản phẩm (owner + staff) CREATE (http://localhost:5000/api/products)
router.post(
  "/",
  protect,
  authorizeRoles("owner", "staff"),
  async (req, res) => {
    try {
      const product = await Product.create(req.body)
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ message: "Server error" })
    }
  }
)

// Sửa sản phẩm (owner + staff) UPDATE (http://localhost:5000/api/products/699bfb97cce13ad8a7cc7aa3)
router.put(
  "/:id",
  protect,
  authorizeRoles("owner", "staff"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }

      res.json(product)
    } catch (error) {
      res.status(500).json({ message: "Server error" })
    }
  }
)

// Xóa sản phẩm (owner + staff) DELETE (http://localhost:5000/api/products/699bfb97cce13ad8a7cc7aa3)
router.delete(
  "/:id",
  protect,
  authorizeRoles("owner", "staff"),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id)

      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }

      res.json({ message: "Product deleted" })
    } catch (error) {
      res.status(500).json({ message: "Server error" })
    }
  }
)

export default router