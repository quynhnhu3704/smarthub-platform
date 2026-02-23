// src/app.js
import express from "express"
import mongoose from "mongoose"
import Product from "./models/Product.js"

class App {
  constructor() {
    this.app = express()
    this.setupMiddleware()
    this.connectDB()
    this.setupRoutes()
  }

  setupMiddleware() {
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
    this.app.get("/api/products", async (req, res) => {
      try {
        const products = await Product.find()
        res.json(products)
      } catch (err) {
        res.status(500).json({ message: err.message })
      }
    })
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