// seed/seedOwner.js
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import dotenv from "dotenv"

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const existing = await User.findOne({ email: "owner@smarthub.com" })

if (!existing) {
  const hashedPassword = await bcrypt.hash("123456", 10)

  await User.create({
    name: "Owner SmartHub",
    email: "owner@smarthub.com",
    password: hashedPassword,
    role: "owner"
  })

  console.log("Owner created")
} else {
  console.log("Owner already exists")
}

process.exit()

// node src/seed/seedOwner.js