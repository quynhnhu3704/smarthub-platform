// src/utils/chatbotAI.js
import 'dotenv/config'       // đảm bảo load .env
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
//   vertexai: false,  // quan trọng: tắt Vertex AI để chỉ dùng API key
})

export const getAIReply = async (message) => {
  if (!message) return "Bạn chưa nhập câu hỏi. Vui lòng thử lại."
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    })

    // Nếu API trả về rỗng, dùng câu fallback liên quan SmartHub
    return result.text || "Xin lỗi, mình chưa tìm thấy thông tin phù hợp. Bạn có thể hỏi về điện thoại tại SmartHub."
  } catch (error) {
    console.error("AI error:", error)
    return "Rất tiếc, SmartHub Assistant hiện đang gặp sự cố. Bạn vui lòng thử lại sau."
  }
}