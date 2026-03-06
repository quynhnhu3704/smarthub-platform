// controllers/customerController.js
import User from "../models/User.js"
import mongoose from "mongoose"

// GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    const keyword = req.query.keyword || ""

    let query = { role: "customer" }
    if (keyword) query.$or = [{ name: { $regex: keyword, $options: "i" } }, { username: { $regex: keyword, $options: "i" } }, { email: { $regex: keyword, $options: "i" } }, { phone: { $regex: keyword, $options: "i" } }]

    const total = await User.countDocuments(query)
    const customers = await User.find(query).select("-password").skip(skip).limit(limit)

    res.json({ customers, currentPage: page, totalPages: Math.ceil(total / limit), totalCustomers: total })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" })
    const customer = await User.findOne({ _id: id, role: "customer" }).select("-password")
    if (!customer) return res.status(404).json({ message: "Customer not found" })
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body
    const userExists = await User.findOne({ $or: [{ email }, { username }] })
    if (userExists) return res.status(400).json({ message: "User already exists" })
    const customer = await User.create({ name, username, email, phone, password, role: "customer" })
    res.status(201).json({ _id: customer._id, name: customer.name, username: customer.username, email: customer.email, phone: customer.phone, role: customer.role })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" })
    const customer = await User.findOne({ _id: id, role: "customer" })
    if (!customer) return res.status(404).json({ message: "Customer not found" })
    customer.name = req.body.name || customer.name
    customer.username = req.body.username || customer.username
    customer.email = req.body.email || customer.email
    customer.phone = req.body.phone || customer.phone
    if (req.body.password) customer.password = req.body.password
    const updatedCustomer = await customer.save()
    res.json({ _id: updatedCustomer._id, name: updatedCustomer.name, username: updatedCustomer.username, email: updatedCustomer.email, phone: updatedCustomer.phone, role: updatedCustomer.role })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" })
    const customer = await User.findOneAndDelete({ _id: id, role: "customer" })
    if (!customer) return res.status(404).json({ message: "Customer not found" })
    res.json({ message: "Customer deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}