// routes/customerRoutes.js
import express from "express"
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../controllers/customerController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get("/", protect, authorizeRoles("owner"), getCustomers) // Lấy danh sách khách hàng (dùng cho owner)
router.get("/:id", protect, authorizeRoles("owner"), getCustomerById) // Lấy chi tiết khách hàng theo ID (dùng cho owner)
router.post("/", protect, authorizeRoles("owner"), createCustomer) // Tạo khách hàng mới (dùng cho owner)
router.put("/:id", protect, authorizeRoles("owner"), updateCustomer) // Cập nhật khách hàng (dùng cho owner)
router.delete("/:id", protect, authorizeRoles("owner"), deleteCustomer) // Xóa khách hàng (dùng cho owner)

export default router