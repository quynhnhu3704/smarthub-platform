// backend/src/controllers/recommendationController.js
import axios from "axios"
import Product from "../models/Product.js"
import mongoose from "mongoose"

// GET /api/recommendations/:userId
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { userId } = req.params

    const aiResponse = await axios.get(`http://localhost:5001/recommend/${userId}`)

    // Lấy đúng key "recommendations" từ Flask trả về
    const recommendedIds = aiResponse.data.recommendations

    if (!recommendedIds || !Array.isArray(recommendedIds) || recommendedIds.length === 0) {
      return res.json({ status: "success", data: [] })
    }

    // Chuyển đổi ID chuỗi sang ObjectId để query MongoDB
    const objectIds = recommendedIds
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id))

    const products = await Product.find({ _id: { $in: objectIds } }).populate("brand")

    // Sắp xếp lại danh sách sản phẩm theo đúng thứ tự ưu tiên mà AI trả về
    const sortedProducts = recommendedIds
      .map(id => products.find(p => p._id.toString() === id.toString()))
      .filter(p => p !== undefined)

    res.json({
      status: "success",
      data: sortedProducts
    })
  } catch (error) {
    console.error("Recommendation service error:", error.message)
    res.json({ status: "error", data: [], message: "Recommendation service is currently unavailable" })
  }
}