// src/controllers/productController.js
import Product from "../models/Product.js"
import mongoose from "mongoose"

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const { keyword, brand, priceRange, sortOrder } = req.query

    let query = {}

    if (keyword) query.product_name = { $regex: keyword, $options: "i" }
    if (brand) query.brand = brand
    if (priceRange === "low") query.price = { $lt: 5000000 }
    else if (priceRange === "mid") query.price = { $gte: 5000000, $lte: 15000000 }
    else if (priceRange === "high") query.price = { $gt: 15000000 }

    let sort = {}
    if (sortOrder === "asc") sort.price = 1
    else if (sortOrder === "desc") sort.price = -1

    const total = await Product.countDocuments(query)
    const products = await Product.find(query).sort(sort).skip(skip).limit(limit)
    const brands = await Product.distinct("brand", query)

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      brands
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" })
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}