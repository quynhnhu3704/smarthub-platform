// backend/src/routes/recommendationRoutes.js
import express from "express"
import { getPersonalizedRecommendations } from "../controllers/recommendationController.js"

const router = express.Router()

router.get("/:userId", getPersonalizedRecommendations) // Lấy danh sách gợi ý sản phẩm theo user

export default router