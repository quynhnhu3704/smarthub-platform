// controllers/searchController.js
import SearchHistory from "../models/SearchHistory.js"
import SearchKeywordStats from "../models/SearchKeywordStats.js" // ADDED: model dùng cho thống kê trending
import SearchEvent from "../models/SearchEvent.js" // ADDED: lưu log hành vi search

export const saveSearch = async (req, res) => {
  try {
    const { keyword } = req.body

    if (!keyword) {
      return res.status(400).json({ message: "Keyword required" })
    }

    const userId = req.user._id
    const normalizedKeyword = keyword.toLowerCase() // ADDED: chuẩn hóa keyword để dùng chung

    const existing = await SearchHistory.findOne({
      keyword: normalizedKeyword, // CHANGED: dùng normalizedKeyword
      user: userId
    })

    if (existing) {
      existing.count += 1
      await existing.save()

      await SearchKeywordStats.findOneAndUpdate( // ADDED: tăng thống kê trending
        { keyword: normalizedKeyword },
        { $inc: { count: 1 } },
        { upsert: true }
      )

      await SearchEvent.create({ // ADDED
        user: userId,
        keyword: normalizedKeyword
      })

      return res.json(existing)
    }

    const search = await SearchHistory.create({
      keyword: normalizedKeyword, // CHANGED: dùng normalizedKeyword
      user: userId
    })

    await SearchKeywordStats.findOneAndUpdate( // ADDED: tăng thống kê trending
      { keyword: normalizedKeyword },
      { $inc: { count: 1 } },
      { upsert: true }
    )

    await SearchEvent.create({ // ADDED
      user: userId,
      keyword: normalizedKeyword
    })

    res.json(search)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getMySearchHistory = async (req, res) => {
  try {
    const userId = req.user._id

    const history = await SearchHistory
      .find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5) // Giới hạn lịch sử tìm kiếm = 5
      .select("keyword")

    res.json({ history })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


export const deleteSearchKeyword = async (req, res) => {
  try {
    const userId = req.user._id
    const { keyword } = req.params

    await SearchHistory.deleteOne({
      user: userId,
      keyword: keyword.toLowerCase()
    })

    res.json({ message: "Deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


export const clearSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id

    await SearchHistory.deleteMany({ user: userId })

    res.json({ message: "All deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


export const getTrendingKeywords = async (req, res) => {
  try {
    const trending = await SearchKeywordStats // CHANGED: lấy từ collection thống kê thay vì SearchHistory
      .find()
      .sort({ count: -1 })
      .limit(10) // Giới hạn trending = 10 keyword có count cao nhất

    res.json({
      trending: trending.map(i => i.keyword) // CHANGED: trả keyword thay vì _id
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// API này chỉ insert SearchEvent, không update stats hay history.
export const logSearchEvent = async (req, res) => {
  try {
    const { keyword } = req.body

    if (!keyword) {
      return res.status(400).json({ message: "Keyword required" })
    }

    const userId = req.user._id

    await SearchEvent.create({
      user: userId,
      keyword: keyword.toLowerCase()
    })

    res.json({ message: "Event logged" })

  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}