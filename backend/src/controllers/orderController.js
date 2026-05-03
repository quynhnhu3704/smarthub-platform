// controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const { selectedItems, shippingAddress, paymentMethod } = req.body;

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
      shippingAddress,
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