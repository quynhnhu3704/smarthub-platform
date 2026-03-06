// controllers/staffController.js
import User from "../models/User.js"
import mongoose from "mongoose"

// GET /api/staff
export const getStaff = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const keyword = req.query.keyword || ""

    let query = { role: "staff" }
    if (keyword)
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } }
      ]

    const total = await User.countDocuments(query)
    const staff = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)

    res.json({
      staff,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStaff: total
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// GET /api/staff/:id
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" })

    const staff = await User.findOne({ _id: id, role: "staff" }).select("-password")

    if (!staff)
      return res.status(404).json({ message: "Staff not found" })

    res.json(staff)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// POST /api/staff
export const createStaff = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body

    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (userExists)
      return res.status(400).json({ message: "User already exists" })

    const staff = await User.create({
      name,
      username,
      email,
      phone,
      password,
      role: "staff"
    })

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      username: staff.username,
      email: staff.email,
      phone: staff.phone,
      role: staff.role
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// PUT /api/staff/:id
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" })

    const staff = await User.findOne({ _id: id, role: "staff" })

    if (!staff)
      return res.status(404).json({ message: "Staff not found" })

    staff.name = req.body.name || staff.name
    staff.username = req.body.username || staff.username
    staff.email = req.body.email || staff.email
    staff.phone = req.body.phone || staff.phone

    if (req.body.password) staff.password = req.body.password

    const updatedStaff = await staff.save()

    res.json({
      _id: updatedStaff._id,
      name: updatedStaff.name,
      username: updatedStaff.username,
      email: updatedStaff.email,
      phone: updatedStaff.phone,
      role: updatedStaff.role
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE /api/staff/:id
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid ID" })

    const staff = await User.findOneAndDelete({ _id: id, role: "staff" })

    if (!staff)
      return res.status(404).json({ message: "Staff not found" })

    res.json({ message: "Staff deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}