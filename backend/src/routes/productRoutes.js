// routes/productRoutes.js
import express from "express"
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get("/", getProducts) // Lấy danh sách sản phẩm
router.get("/:id", getProductById) // Lấy chi tiết sản phẩm theo ID

router.post("/", protect, authorizeRoles("owner", "staff"), createProduct) // Tạo sản phẩm mới chỉ dành cho owner và staff
router.put("/:id", protect, authorizeRoles("owner", "staff"), updateProduct) // Cập nhật sản phẩm chỉ dành cho owner và staff
router.delete("/:id", protect, authorizeRoles("owner", "staff"), deleteProduct) // Xóa sản phẩm chỉ dành cho owner và staff

export default router