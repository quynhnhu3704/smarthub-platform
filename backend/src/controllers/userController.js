// controllers/userController.js
import User from "../models/User.js"

// Lấy thông tin cá nhân
export const getProfile = async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// Cập nhật thông tin cá nhân
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, username } = req.body
    const user = await User.findById(req.user._id)
    if (!user) { return res.status(404).json({ message: "User not found" }) }

    // Kiểm tra username trùng (nếu đổi username)
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username })
      if (usernameExists) { return res.status(400).json({ message: "Username already exists" }) }
    }

    // Kiểm tra email trùng (nếu đổi email)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email })
      if (emailExists) { return res.status(400).json({ message: "Email already exists" }) }
    }

    user.name = name || user.name
    user.email = email || user.email
    user.phone = phone || user.phone
    user.username = username || user.username

    const updatedUser = await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}