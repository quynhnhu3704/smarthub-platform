// src/services/chatbotService.js
import axios from "axios"

/**
 * Gửi message tới backend chatbot
 * @param {string} message
 * @returns {Promise<string>}
 */
export const sendMessageToBot = async (message) => {
  try {
    const res = await axios.post("/api/chatbot", { message })
    return res.data.reply
  } catch (err) {
    console.error(err)
    return "Xin lỗi, Trợ lý ảo SmartHub đang tạm thời không hoạt động. Vui lòng thử lại sau."
  }
}