// scripts/seedSurvey.js
import mongoose from "mongoose"
import dotenv from "dotenv"
import Survey from "../src/models/Survey.js"
import User from "../src/models/User.js"
import Brand from "../src/models/Brand.js"

dotenv.config()

// ===== CONFIG =====
const MONGO_URI = process.env.MONGO_URI
const NUM_USERS = 1000

// ===== RANDOM UTILS =====
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const pickOne = (arr) => arr[rand(0, arr.length - 1)]

// shuffle + lấy n phần tử
const pickMany = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

// random thời gian trong 6 tháng gần đây
const randomDate = () => {
  const now = new Date()
  const past = new Date()
  past.setMonth(now.getMonth() - 6)

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  )
}

// ===== OPTIONS giống UI =====
const priceOptions = [
  [0, 5000000],
  [5000000, 15000000],
  [15000000, 99999999]
]

const ramOptions = [
  [0, 4],
  [4, 8],
  [8, 12],
  [12, 24]
]

const storageOptions = [
  [0, 64],
  [64, 128],
  [128, 256],
  [256, 512],
  [512, 2048]
]

const batteryOptions = [
  [0, 4000],
  [4000, 5000],
  [5000, 10000]
]

const screenOptions = [
  [0, 6.4],
  [6.4, 6.7],
  [6.7, 10]
]

// ===== MAIN =====
const seedSurvey = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected DB")

    // lấy user role customer
    const users = await User.find({ role: "customer" }).limit(NUM_USERS)
    const brands = await Brand.find()

    if (!users.length || !brands.length) {
      console.log("Thiếu users hoặc brands")
      return
    }

    const brandIds = brands.map(b => b._id)

    const surveys = []

    for (const user of users) {
      // ===== random brands 1-5 =====
      const numBrands = rand(1, Math.min(5, brandIds.length))
      const selectedBrands = pickMany(brandIds, numBrands)

      // ===== random các option =====
      const [price_min, price_max] = pickOne(priceOptions)
      const [ram_min, ram_max] = pickOne(ramOptions)
      const [storage_min, storage_max] = pickOne(storageOptions)
      const [battery_min, battery_max] = pickOne(batteryOptions)
      const [screen_min, screen_max] = pickOne(screenOptions)

      const createdAt = randomDate()

      surveys.push({
        user_id: user._id,
        brands: selectedBrands,
        price_min,
        price_max,
        ram_min,
        ram_max,
        storage_min,
        storage_max,
        battery_min,
        battery_max,
        screen_min,
        screen_max,
        createdAt,
        updatedAt: createdAt
      })
    }

    // clear cũ (nếu muốn)
    await Survey.deleteMany()

    await Survey.insertMany(surveys)

    console.log(`Seeded ${surveys.length} surveys`)
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seedSurvey()

// node scripts/seedSurvey.js