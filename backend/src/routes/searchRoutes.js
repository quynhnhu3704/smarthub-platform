// routes/searchRoutes.js
import express from "express"
import {
  saveSearch,
  getMySearchHistory,
  deleteSearchKeyword,
  clearSearchHistory,
  getTrendingKeywords,
  logSearchEvent
} from "../controllers/searchController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/search-history", protect, saveSearch)
router.get("/search-history", protect, getMySearchHistory)
router.delete("/search-history/:keyword", protect, deleteSearchKeyword)
router.delete("/search-history", protect, clearSearchHistory)
router.get("/trending-keywords", getTrendingKeywords)
router.post("/search-event", protect, logSearchEvent)

export default router