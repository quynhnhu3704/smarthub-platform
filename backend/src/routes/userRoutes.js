// src/routes/userRoutes.js
import express from "express"
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/profile", protect, getProfile) // Lấy thông tin cá nhân
router.put("/profile", protect, updateProfile) // Cập nhật thông tin cá nhân
router.put("/change-password", protect, changePassword) // Đổi mật khẩu

export default router