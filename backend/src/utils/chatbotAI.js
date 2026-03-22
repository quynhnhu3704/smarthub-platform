// // src/utils/chatbotAI.js
// import 'dotenv/config'       // đảm bảo load .env
// import { GoogleGenAI } from "@google/genai"

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// //   vertexai: false,  // quan trọng: tắt Vertex AI để chỉ dùng API key
// })

// export const getAIReply = async (message) => {
//   if (!message) return "Bạn chưa nhập câu hỏi. Vui lòng thử lại."
//   try {
//     const result = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: message
//     })

//     // Nếu API trả về rỗng, dùng câu fallback liên quan SmartHub
//     return result.text || "Xin lỗi, mình chưa tìm thấy thông tin phù hợp. Bạn có thể hỏi về điện thoại tại SmartHub."
//   } catch (error) {
//     console.error("AI error:", error)
//     return "Rất tiếc, Trợ lý ảo SmartHub hiện đang gặp sự cố. Bạn vui lòng thử lại sau."
//   }
// }


import 'dotenv/config'
import { GoogleGenAI } from "@google/genai"
import { getProductData } from "./chatbotDB.js"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Tách keyword chính từ câu hỏi
const extractProductName = (message) => {
  // loại bỏ từ thừa, giữ chữ cái và số
  return message
    .replace(/(có|bán|ko|không|giá|mua)/gi, '')
    .trim()
}

export const getAIReply = async (message) => {
  if (!message) return "Bạn chưa nhập câu hỏi. Vui lòng thử lại."

  try {
    const keyword = extractProductName(message)
    console.log("Query:", keyword)

    const productResults = await getProductData({ product_name: { $regex: keyword, $options: "i" } })
    console.log("Product results:", productResults)

    if (productResults.length > 0) {
      return `Mình tìm thấy sản phẩm SmartHub phù hợp:\n` +
        productResults.map(p => `- ${p.product_name} (${p.brand}) - ${p.price.toLocaleString("vi-VN")}đ`).join("\n")
    }

    // Nếu DB không có, trả lời mặc định, KHÔNG gọi AI
    return "Rất tiếc, hiện tại SmartHub chưa có sản phẩm bạn hỏi."
  } catch (error) {
    console.error("DB error:", error)
    return "Rất tiếc, Trợ lý ảo SmartHub hiện đang gặp sự cố. Bạn vui lòng thử lại sau."
  }
}