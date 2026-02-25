// scripts/seedUsers.js
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import User from "../src/models/User.js"
import dotenv from "dotenv"

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)

const users = [
  { name: "Nguyễn Thị Quỳnh Như", username: "owner", email: "owner@smarthub.com", phone: "0900000001", password: "123456", role: "owner" },
  { name: "Lê Thị Kim Oanh", username: "staff1", email: "staff1@smarthub.com", phone: "0900000002", password: "123456", role: "staff" },
  { name: "Nguyễn Thanh Trúc", username: "staff2", email: "staff2@smarthub.com", phone: "0900000003", password: "123456", role: "staff" },
  { name: "Nguyễn Minh Tâm", username: "staff3", email: "staff3@smarthub.com", phone: "0900000004", password: "123456", role: "staff" }
]

for (const u of users) {
  const existing = await User.findOne({ email: u.email })
  if (!existing) {
    const hashed = await bcrypt.hash(u.password, 10)
    await User.create({
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      password: hashed,
      role: u.role
    })
    console.log(`${u.role} created: ${u.email}`)
  } else {
    console.log(`${u.role} already exists: ${u.email}`)
  }
}

process.exit()

// To run this script, use the command: node scripts/seedUsers.js