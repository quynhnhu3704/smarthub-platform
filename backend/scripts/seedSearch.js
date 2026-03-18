// scripts/seedSearch.js
import mongoose from "mongoose"
import dotenv from "dotenv"

import User from "../src/models/User.js"
import Product from "../src/models/Product.js"
import SearchEvent from "../src/models/SearchEvent.js"
import SearchHistory from "../src/models/SearchHistory.js"
import SearchKeywordStats from "../src/models/SearchKeywordStats.js"

// random int
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// shuffle
const shuffle = (arr) => arr.sort(() => 0.5 - Math.random())

// random thời gian trong X ngày
const randomDate = (days = 7) => {
  const now = Date.now()
  const past = now - days * 24 * 60 * 60 * 1000
  return new Date(rand(past, now))
}

// ===== TẠO PREFIX KEYWORDS =====
const generateKeywordsFromProducts = (products) => {
  const keywords = []

  products.forEach(p => {
    const words = p.product_name.trim().split(" ")

    for (let i = 1; i <= words.length; i++) {
      const prefix = words.slice(0, i).join(" ")
      keywords.push(prefix)
    }
  })

  return keywords
}

async function seedSearch() {
  dotenv.config()
  await mongoose.connect(process.env.MONGO_URI)

  console.log("Đang seed search...")

  await SearchEvent.deleteMany({})
  await SearchHistory.deleteMany({})
  await SearchKeywordStats.deleteMany({})

  const users = await User.find({ role: "customer" })
  const products = await Product.find()

  if (!users.length || !products.length) {
    console.log("Thiếu users hoặc products")
    process.exit()
  }

  // ===== KEYWORD POOL =====
  const allKeywords = generateKeywordsFromProducts(products)

  // tạo pool thiên về trùng (duplicate 30%)
  const duplicatePool = []
  allKeywords.forEach(k => {
    if (Math.random() < 0.3) {
      duplicatePool.push(k, k)
    } else {
      duplicatePool.push(k)
    }
  })

  const keywordPool = shuffle(duplicatePool)

  const searchEvents = []
  const searchHistoryMap = new Map()
  const keywordStatsMap = new Map()

  users.forEach(user => {

    // ===== CHIA NHÓM USER =====
    let numSearch
    const r = Math.random()

    if (r < 0.5) {
      numSearch = rand(3, 6)
    } else if (r < 0.85) {
      numSearch = rand(7, 12)
    } else {
      numSearch = rand(13, 20)
    }

    let baseTime = randomDate(7)

    for (let i = 0; i < numSearch; i++) {
      const keyword = keywordPool[rand(0, keywordPool.length - 1)]

      // ===== SEARCH EVENT =====
      searchEvents.push({
        user: user._id,
        keyword,
        createdAt: baseTime,
        updatedAt: baseTime
      })

      // ===== SEARCH HISTORY =====
      const key = `${user._id}_${keyword}`

      if (!searchHistoryMap.has(key)) {
        searchHistoryMap.set(key, {
          user: user._id,
          keyword,
          count: 1,
          createdAt: baseTime,
          updatedAt: baseTime
        })
      } else {
        const item = searchHistoryMap.get(key)
        item.count += 1
        item.updatedAt = baseTime
      }

      // ===== KEYWORD STATS =====
      if (!keywordStatsMap.has(keyword)) {
        keywordStatsMap.set(keyword, {
          keyword,
          count: 1,
          createdAt: baseTime,
          updatedAt: baseTime
        })
      } else {
        const stat = keywordStatsMap.get(keyword)
        stat.count += 1
        stat.updatedAt = baseTime
      }

      // tăng thời gian (1–5 phút)
      baseTime = new Date(baseTime.getTime() + rand(1, 5) * 60 * 1000)
    }
  })

  const searchHistories = Array.from(searchHistoryMap.values())
  const keywordStats = Array.from(keywordStatsMap.values())

  await SearchEvent.insertMany(searchEvents)
  await SearchHistory.insertMany(searchHistories)
  await SearchKeywordStats.insertMany(keywordStats)

  console.log(`OK: ${users.length} users`)
  console.log(`Events: ${searchEvents.length}`)
  console.log(`Histories: ${searchHistories.length}`)
  console.log(`Keywords stats: ${keywordStats.length}`)

  process.exit()
}

seedSearch()


// node scripts/seedSearch.js