// src/routes/surveyRoutes.js
import express from "express"
import { createSurvey } from "../controllers/surveyController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createSurvey) // lưu khảo sát (bắt buộc đăng nhập)

export default router