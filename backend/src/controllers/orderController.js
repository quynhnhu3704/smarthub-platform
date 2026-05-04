// controllers/orderController.js
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const { selectedItems, shippingAddress, paymentMethod } = req.body;

    // ✅ thêm đoạn này ngay dưới
    if (!shippingAddress.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const items = cart.items.filter(i =>
      selectedItems.includes(i.product._id.toString())
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    // check stock
    for (const item of items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Sản phẩm ${item.product.product_name} không đủ hàng`
        });
      }
    }

    // snapshot items
    const orderItems = items.map(i => ({
      product: i.product._id,
      name: i.product.product_name,
      image: i.product.image_url,
      price: i.product.price,
      quantity: i.quantity
    }));

    const totalPrice = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // tạo order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        ...shippingAddress,
        email: shippingAddress.email.toLowerCase().trim() // ✅ chuẩn hóa
      },
      paymentMethod,
      totalPrice
    });

    // nếu là SEPAY → tạo transferNote
    if (paymentMethod === "SEPAY") {
      order.transferNote = "DH" + order._id.toString().slice(-6);
      await order.save();
    }

    // trừ kho
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // xóa khỏi cart
    cart.items = cart.items.filter(
      i => !selectedItems.includes(i.product._id.toString())
    );
    await cart.save();

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create order failed" });
  }
};


// Webhook SePay (auto xác nhận thanh toán)
export const sepayWebhook = async (req, res) => {
  try {
    const { content, amount } = req.body;

    const order = await Order.findOne({ transferNote: content });

    if (!order) {
      return res.sendStatus(200);
    }

    // check số tiền (tránh fake hoặc sai)
    if (amount && amount < order.totalPrice) {
      return res.sendStatus(200);
    }

    // cập nhật trạng thái
    order.status = "paid";
    await order.save();

    res.sendStatus(200);

  } catch (error) {
    console.error("SePay webhook error:", error);
    res.sendStatus(500);
  }
};

// GET /api/orders (ADMIN LIST)
export const getOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.ordersPerPage) || 10;
    const skip = (page - 1) * limit;

    const { keyword, status, timeRange } = req.query;

    let query = {};

    const now = new Date();

    if (timeRange === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    if (timeRange === "7d") {
      const start = new Date();
      start.setDate(start.getDate() - 7);

      query.createdAt = { $gte: start };
    }

    if (timeRange === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      query.createdAt = { $gte: start };
    }

    // filter status
    if (status) query.status = status;

    // search theo tên khách hàng hoặc phone
    if (keyword) {
      query.$or = [
        { "shippingAddress.name": { $regex: keyword, $options: "i" } },
        { "shippingAddress.phone": { $regex: keyword, $options: "i" } },
        { "shippingAddress.email": { $regex: keyword, $options: "i" } } // ✅ thêm
      ];
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/orders/:id (UPDATE STATUS)
export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // nếu chuyển sang cancel và trước đó KHÔNG phải cancel → hoàn kho
    if (status === "cancel" && order.status !== "cancel") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/my-orders (USER)
// GET /api/orders/my (USER)
export const getMyOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const { keyword, status, timeRange } = req.query;

    let query = {
      user: req.user._id // 🔥 luôn giới hạn theo user
    };

    const now = new Date();

    // ===== FILTER TIME =====
    if (timeRange === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    if (timeRange === "7d") {
      const start = new Date();
      start.setDate(start.getDate() - 7);

      query.createdAt = { $gte: start };
    }

    if (timeRange === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);

      query.createdAt = { $gte: start };
    }

    // ===== FILTER STATUS =====
    if (status) {
      query.status = status;
    }

    // ===== SEARCH =====
    if (keyword) {
      query.$or = [
        { _id: { $regex: keyword, $options: "i" } }, // 🔥 tìm theo mã đơn
        { "items.name": { $regex: keyword, $options: "i" } } // 🔥 tìm theo tên sản phẩm
      ];
    }

    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};