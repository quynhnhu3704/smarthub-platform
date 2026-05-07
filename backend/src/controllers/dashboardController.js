// controllers/dashboardController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import SearchKeywordStats from "../models/SearchKeywordStats.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { period = "30" } = req.query;

    const matchStage = { status: { $ne: "cancel" } };
    if (period !== "all") {
      const days = parseInt(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      matchStage.createdAt = { $gte: startDate };
    }

    // TỔNG QUAN
    const [totalRevenue] = await Order.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalOrders = await Order.countDocuments(matchStage);
    const pendingOrders = await Order.countDocuments({ ...matchStage, status: "pending" });
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 }, status: "active" });
    const totalProducts = await Product.countDocuments();

    // DOANH THU THEO THỜI GIAN
    const revenueByDate = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" }, 
            day: { $dayOfMonth: "$createdAt" } 
          },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // TRẠNG THÁI ĐƠN HÀNG
    const orderStatus = await Order.aggregate([
      { $match: matchStage },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // TOP SẢN PHẨM BÁN CHẠY
    const topProducts = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // TOP BRAND
    const topBrands = await Order.aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "prod" }
      },
      { $unwind: "$prod" },
      {
        $group: {
          _id: "$prod.brand",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // TOP TÌM KIẾM
    const topKeywords = await SearchKeywordStats.find().sort({ count: -1 }).limit(6);

    res.json({
      overview: { revenue: totalRevenue?.total || 0, orders: totalOrders, customers: totalCustomers, pendingOrders, lowStock, products: totalProducts },
      revenueByDate,
      orderStatus,
      topProducts,
      topBrands,
      topKeywords,
      period
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};