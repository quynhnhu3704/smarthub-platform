// models/User.js
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String }, // không bắt buộc nếu đăng ký bằng google
  role: { type: String, enum: ["owner", "staff", "customer"], default: "customer" },

  googleId: { type: String, default: null }, // Mới thêm
  provider: { type: String, enum: ["local", "google"], default: "local" }, // Mới thêm
  
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true })

// pre-save hook để hash mật khẩu trước khi lưu vào database
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// method để so sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)