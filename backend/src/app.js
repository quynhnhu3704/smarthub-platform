// src/app.js
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
import staffRoutes from "./routes/staffRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import brandRoutes from "./routes/brandRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import surveyRoutes from "./routes/surveyRoutes.js"
import recommendationRoutes from "./routes/recommendationRoutes.js"; // router AI recommend
// import chatbotRoutes from "./routes/chatbotRoutes.js"

class App {
  constructor() {
    this.app = express()
    this.setupMiddleware()
    this.connectDB()
    this.setupRoutes()
  }

  setupMiddleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log("MongoDB connected")
    } catch (err) {
      console.error("MongoDB connection error:", err.message)
      process.exit(1)
    }
  }

  setupRoutes() {
    this.app.use("/api/recommendations", recommendationRoutes); // router AI recommend
    this.app.use("/api/products", productRoutes)
    this.app.use("/api/auth", authRoutes)
    this.app.use("/api/users", userRoutes)
    this.app.use("/api/customers", customerRoutes)
    this.app.use("/api/staff", staffRoutes)
    this.app.use("/api/cart", cartRoutes)
    this.app.use("/api/brands", brandRoutes)
    this.app.use("/api", searchRoutes)
    this.app.use("/api/surveys", surveyRoutes)
    
    // this.app.use("/api/chatbot", chatbotRoutes)
    
  }

  start() {
    const PORT = process.env.PORT || 5000
    this.server = this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }

  async stop() {
    await mongoose.disconnect()
    this.server.close()
    console.log("Server stopped")
  }
}

export default App