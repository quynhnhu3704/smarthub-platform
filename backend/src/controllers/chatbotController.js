// import { GoogleGenAI } from "@google/genai"

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// })

// export const chatWithBot = async (req, res) => {

//   try {

//     const { message } = req.body

//     if (!message) {
//       return res.status(400).json({
//         error: "Message is required"
//       })
//     }

//     const result = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: message
//     })

//     const reply = result.text || "Xin lỗi, tôi chưa có câu trả lời."

//     res.json({
//       reply
//     })

//   } catch (error) {

//     console.error("Chatbot error:", error)

//     res.status(500).json({
//       error: "AI error"
//     })
//   }
// }