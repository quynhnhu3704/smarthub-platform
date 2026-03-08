// routes/cartRoutes.js
import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart); // Lấy giỏ hàng của người dùng hiện tại
router.post("/add", protect, addToCart); // Thêm sản phẩm vào giỏ hàng
router.put("/update", protect, updateCartItem); // Cập nhật số lượng sản phẩm trong giỏ hàng
router.post("/remove", protect, removeFromCart); // Xóa sản phẩm khỏi giỏ hàng
router.post("/clear", protect, clearCart); // Xóa toàn bộ giỏ hàng

export default router;