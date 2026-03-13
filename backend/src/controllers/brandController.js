// src/controllers/brandController.js
import Brand from "../models/Brand.js"

// GET /api/brands
export const getBrands = async (req, res) => {
  try {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const keyword = req.query.keyword || ""
    const sortOrder = req.query.sortOrder || ""

    const query = keyword ? { name: { $regex: keyword, $options: "i" } } : {}
    const sort = sortOrder === "az" ? { name: 1 } : sortOrder === "za" ? { name: -1 } : { createdAt: -1 }

    let brands

    if (!page || !limit) {
      brands = await Brand.find(query).collation({ locale: "en", strength: 2 }).sort(sort)

      // thêm đoạn này
      const Product = (await import("../models/Product.js")).default
      brands = await Promise.all(
        brands.map(async (b) => {
          const count = await Product.countDocuments({ brand: b._id })
          return { ...b.toObject(), productCount: count }
        })
      )

      return res.json({ brands })
    }

    const totalBrands = await Brand.countDocuments(query)
    brands = await Brand.find(query).collation({ locale: "en", strength: 2 }).sort(sort).skip((page - 1) * limit).limit(limit)

    // thêm đoạn này
    const Product = (await import("../models/Product.js")).default
    brands = await Promise.all(
      brands.map(async (b) => {
        const count = await Product.countDocuments({ brand: b._id })
        return { ...b.toObject(), productCount: count }
      })
    )

    res.json({ brands, totalPages: Math.ceil(totalBrands / limit), totalBrands })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

// GET /api/brands/:id
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)
    if (!brand) return res.status(404).json({ message: "Brand not found" })
    res.json(brand)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

// POST
export const createBrand = async (req, res) => {
  try {
    const { name, status } = req.body
    const brand = await Brand.create({ name, status })
    res.status(201).json(brand)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

// PUT
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    )
    if (!brand) return res.status(404).json({ message: "Brand not found" })
    res.json(brand)
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id)
    if (!brand) return res.status(404).json({ message: "Brand not found" })
    res.json({ message: "Brand deleted" })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}