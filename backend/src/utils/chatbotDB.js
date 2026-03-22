// src/utils/chatbotDB.js
import mongoose from "mongoose"

const uri = process.env.MONGO_URI
mongoose.connect(uri)
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

// Lấy reference trực tiếp đến các collection
const Product = mongoose.connection.collection("products")
const Brand = mongoose.connection.collection("brands")
const Cart = mongoose.connection.collection("carts")
const SearchHistory = mongoose.connection.collection("searchhistories")
const SearchKeywordStats = mongoose.connection.collection("searchkeywordstats")
const User = mongoose.connection.collection("users")
const Survey = mongoose.connection.collection("surveys")

// Hàm lấy products theo filter (ví dụ filter là tên hoặc brand)
export const getProductData = async (filter = {}) => {
  return Product.find(filter).limit(50).toArray()
}

// Hàm lấy brand list
export const getBrandData = async () => {
  return Brand.find({}).toArray()
  
}

// Có thể tạo các hàm tương tự để đọc carts, search histories, users, surveys...