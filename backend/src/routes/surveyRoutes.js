// src/routes/surveyRoutes.js
import express from "express"
import { createSurvey, getMySurvey } from "../controllers/surveyController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createSurvey) // lưu khảo sát (bắt buộc đăng nhập)
router.get("/me", protect, getMySurvey) // kiểm tra survey đã làm chưa

export default router