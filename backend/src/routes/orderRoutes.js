// routes/orderRoutes.js
import express from "express";
import { createOrder, sepayWebhook } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.post("/sepay-webhook", sepayWebhook); // 🔥 webhook KHÔNG cần login

export default router;