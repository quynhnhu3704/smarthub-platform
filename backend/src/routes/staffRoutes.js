// routes/staffRoutes.js
import express from "express"
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff } from "../controllers/staffController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get("/", protect, authorizeRoles("owner"), getStaff) // Lấy danh sách nhân viên (dùng cho owner)
router.get("/:id", protect, authorizeRoles("owner"), getStaffById) // Lấy chi tiết nhân viên theo ID (dùng cho owner)
router.post("/", protect, authorizeRoles("owner"), createStaff) // Tạo nhân viên mới (dùng cho owner)
router.put("/:id", protect, authorizeRoles("owner"), updateStaff) // Cập nhật nhân viên (dùng cho owner)
router.delete("/:id", protect, authorizeRoles("owner"), deleteStaff) // Xóa nhân viên (dùng cho owner)

export default router