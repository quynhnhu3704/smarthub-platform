// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng của người dùng hiện tại
export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json(cart);
};

// Thêm sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu đã tồn tại
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    const newQty = cart.items[itemIndex].quantity + quantity;

    if (newQty > product.stock) {
      return res.status(400).json({
        message: `Chỉ còn ${product.stock} sản phẩm trong kho`
      });
    }

    cart.items[itemIndex].quantity = newQty;
  } else {
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Chỉ còn ${product.stock} sản phẩm trong kho`
      });
    }

    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      message: `Chỉ còn ${product.stock} sản phẩm trong kho`
    });
  }

  item.quantity = quantity;

  await cart.save();
  res.json(cart);
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = [];

  await cart.save();
  res.json(cart);
};