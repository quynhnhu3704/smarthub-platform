// routes/brandRoutes.js
import express from "express"
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand
} from "../controllers/brandController.js"

import { protect } from "../middlewares/authMiddleware.js"
import { authorizeRoles } from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get("/", getBrands)
router.get("/:id", getBrandById)

router.post("/", protect, authorizeRoles("owner"), createBrand)
router.put("/:id", protect, authorizeRoles("owner"), updateBrand)
router.delete("/:id", protect, authorizeRoles("owner"), deleteBrand)

export default router