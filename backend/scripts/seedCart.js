// scripts/seedCart.js
import mongoose from "mongoose"
import User from "../src/models/User.js"
import Product from "../src/models/Product.js"
import Cart from "../src/models/Cart.js"
import CartEvent from "../src/models/CartEvent.js"
import dotenv from "dotenv"

// random int
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// shuffle array
const shuffle = (arr) => arr.sort(() => 0.5 - Math.random())

// random thời gian trong X ngày gần đây
const randomDate = (days = 7) => {
  const now = Date.now()
  const past = now - days * 24 * 60 * 60 * 1000
  return new Date(rand(past, now))
}

async function seedCart() {
  dotenv.config()
  await mongoose.connect(process.env.MONGO_URI)

  console.log("Đang seed cart...")

  // clear dữ liệu cũ
  await Cart.deleteMany({})
  await CartEvent.deleteMany({})

  const users = await User.find({ role: "customer" })
  const products = await Product.find()

  if (!users.length || !products.length) {
    console.log("Thiếu users hoặc products")
    process.exit()
  }

  const productPool = shuffle([...products])

  const carts = []
  const cartEvents = []

  users.forEach((user) => {
    const numItems = rand(1, 5)

    const usedProductIds = new Set()
    const items = []

    // ===== timeline riêng cho từng user =====
    let baseTime = randomDate(7)

    // ưu tiên product chưa dùng
    while (items.length < numItems && productPool.length > 0) {
      const p = productPool.pop()
      const quantity = rand(1, 3)

      items.push({
        product: p._id,
        quantity
      })

      // log event
      cartEvents.push({
        user: user._id,
        items: [{
          product: p._id,
          quantity
        }],
        createdAt: baseTime,
        updatedAt: baseTime
      })

      // tăng thời gian (1–10 phút)
      baseTime = new Date(baseTime.getTime() + rand(1, 10) * 60 * 1000)

      usedProductIds.add(p._id.toString())
    }

    // random thêm
    while (items.length < numItems) {
      const p = products[rand(0, products.length - 1)]

      if (!usedProductIds.has(p._id.toString())) {
        const quantity = rand(1, 3)

        items.push({
          product: p._id,
          quantity
        })

        // log event
        cartEvents.push({
          user: user._id,
          items: [{
            product: p._id,
            quantity
          }],
          createdAt: baseTime,
          updatedAt: baseTime
        })

        // tăng thời gian
        baseTime = new Date(baseTime.getTime() + rand(1, 10) * 60 * 1000)

        usedProductIds.add(p._id.toString())
      }
    }

    // cart (gộp)
    carts.push({
      user: user._id,
      items,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  })

  // ===== nếu còn product chưa dùng =====
  while (productPool.length > 0) {
    const p = productPool.pop()
    const randomUserIndex = rand(0, carts.length - 1)
    const quantity = rand(1, 3)

    carts[randomUserIndex].items.push({
      product: p._id,
      quantity
    })

    // random baseTime riêng cho event này
    let baseTime = randomDate(7)

    cartEvents.push({
      user: carts[randomUserIndex].user,
      items: [{
        product: p._id,
        quantity
      }],
      createdAt: baseTime,
      updatedAt: baseTime
    })
  }

  await Cart.insertMany(carts)
  await CartEvent.insertMany(cartEvents)

  console.log(`OK: ${users.length} users, ${products.length} products`)
  process.exit()
}

seedCart()

// node scripts/seedCart.js