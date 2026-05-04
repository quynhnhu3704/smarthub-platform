// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  sepayWebhook,
  getOrders,
  getOrderById,
  updateOrder,
  getMyOrders 
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/sepay-webhook", sepayWebhook); // 🔥 webhook KHÔNG cần login

router.get("/", protect, authorizeRoles("owner", "staff"), getOrders);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, authorizeRoles("owner", "staff"), getOrderById);
router.put("/:id", protect, authorizeRoles("owner", "staff"), updateOrder);

export default router;