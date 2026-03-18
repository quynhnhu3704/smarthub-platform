// src/routes/chatbotRoutes.js
import express from "express"
import { getAIReply } from "../utils/chatbotAI.js"

const router = express.Router()

// Gửi tin nhắn tới chatbot và nhận phản hồi
router.post("/", async (req, res) => {
  const { message } = req.body
  const reply = await getAIReply(message)
  res.json({ reply })
})

export default router