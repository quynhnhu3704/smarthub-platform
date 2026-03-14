// src/controllers/surveyController.js
import Survey from "../models/Survey.js"
import mongoose from "mongoose"

// GET /api/surveys/me
export const getMySurvey = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const survey = await Survey.findOne({ user_id: userId })

    res.json({ survey })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

// POST /api/surveys
export const createSurvey = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { brands, price_min, price_max, ram_min, ram_max, storage_min, storage_max, battery_min, battery_max, screen_min, screen_max } = req.body

    const existed = await Survey.findOne({ user_id: userId })
    if (existed) {
      return res.status(400).json({ message: "Bạn đã gửi khảo sát rồi" })
    }

    const survey = await Survey.create({
      user_id: userId, brands, price_min, price_max, ram_min, ram_max, storage_min, storage_max, battery_min, battery_max, screen_min, screen_max
    })

    res.status(201).json(survey)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}