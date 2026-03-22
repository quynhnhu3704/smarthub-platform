// routes/productRoutes.js
import express from "express"
import mongoose from "mongoose"
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

// route chỉ có ở đoạn đầu, dùng để lấy danh sách sản phẩm theo mảng ids (dành cho AI)
router.post("/by-ids", async (req, res) => {
  try {
    const { ids } = req.body

    // kiểm tra ids hợp lệ
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Danh sách ids không hợp lệ" })
    }

    // chuyển các id sang ObjectId của MongoDB
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id))

    // lấy sản phẩm theo danh sách objectIds
    const products = await Product.find({ _id: { $in: objectIds } })

    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/", getProducts) // Lấy danh sách sản phẩm
router.get("/:id", getProductById) // Lấy chi tiết sản phẩm theo ID

router.post("/", protect, authorizeRoles("owner", "staff"), createProduct) // Tạo sản phẩm mới chỉ dành cho owner và staff
router.put("/:id", protect, authorizeRoles("owner", "staff"), updateProduct) // Cập nhật sản phẩm chỉ dành cho owner và staff
router.delete("/:id", protect, authorizeRoles("owner", "staff"), deleteProduct) // Xóa sản phẩm chỉ dành cho owner và staff

export default router