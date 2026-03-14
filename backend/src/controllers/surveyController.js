// src/controllers/surveyController.js
import Survey from "../models/Survey.js"
import mongoose from "mongoose"

// POST /api/surveys
export const createSurvey = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const { brands, price_min, price_max, ram_min, ram_max, storage_min, storage_max, battery_min, battery_max, screen_min, screen_max } = req.body

    const survey = await Survey.create({
      user_id: userId, brands, price_min, price_max, ram_min, ram_max, storage_min, storage_max, battery_min, battery_max, screen_min, screen_max
    })

    res.status(201).json(survey)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}