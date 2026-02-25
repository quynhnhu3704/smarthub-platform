// controllers/authController.js
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword
    })

    res.status(201).json({ message: "User created successfully" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}