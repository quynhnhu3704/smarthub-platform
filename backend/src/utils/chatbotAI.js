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
// import { GoogleGenAI } from "@google/genai"
import { getProductData } from "./chatbotDB.js"

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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
    // console.log("Query:", keyword)

    const productResults = await getProductData({
      product_name: { $regex: keyword, $options: "i" }
    })
    // console.log("Product results:", productResults)

    if (productResults.length > 0) {
      const topProducts = productResults.slice(0, 10) // chỉ show 10 sp đầu
      // return `Mình tìm thấy <strong>${topProducts.length} sản phẩm</strong> hot hit cho bạn đây! 🔥<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:12px 0;">${topProducts.map(p => `<div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s;"><a href="/products/${p._id}" target="_blank" style="text-decoration:none;color:inherit;"><img src="${p.image_url}" alt="${p.product_name}" style="width:100%;height:120px;object-fit:cover;display:block;"/><div style="padding:8px;"><div style="font-weight:700;font-size:13px;line-height:1.2;margin-bottom:4px;">${p.product_name}</div><div style="color:#e74c3c;font-size:14px;font-weight:700;margin-bottom:4px;">${p.price.toLocaleString("vi-VN")}đ${p.original_price && p.original_price > p.price ? `<span style="font-size:11px;color:#999;text-decoration:line-through;margin-left:6px;">${p.original_price.toLocaleString("vi-VN")}đ</span>` : ''}</div></div></a></div>`).join('')}</div>Muốn xem thêm theo mức giá, hãng, hay cấu hình cụ thể không nè? 😊`;
      return `Mình tìm thấy <strong>${topProducts.length} sản phẩm</strong> hot hit cho bạn đây! 🔥
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:12px 0;">
        ${topProducts.map(p => `
          <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:transform 0.2s;">
            <a href="/products/${p._id}" target="_blank" style="text-decoration:none;color:inherit;">
              <img src="${p.image_url}" alt="${p.product_name}" style="width:100%;height:120px;object-fit:contain;display:block;" />
              <div style="padding:8px 10px;">
                <div style="font-weight:700;font-size:13px;line-height:1.2;margin-bottom:4px;">
                  ${p.product_name}
                </div>
                <div style="color:#e74c3c;font-size:14px;font-weight:700;margin-bottom:4px;">
                  ${p.price.toLocaleString("vi-VN")}đ
                  ${p.original_price && p.original_price > p.price 
                    ? `<span style="font-size:11px;color:#999;text-decoration:line-through;margin-left:6px;">
                        ${p.original_price.toLocaleString("vi-VN")}đ
                      </span>` 
                    : ''
                  }
                </div>
              </div>
            </a>
          </div>
        `).join('')}
        </div>Muốn xem thêm theo mức giá, hãng, hay cấu hình cụ thể không nè? 😊
        `.replace(/\n\s+/g, '');  
    }

    // Nếu DB không có, trả lời mặc định, KHÔNG gọi AI
    return "Rất tiếc, hiện tại SmartHub chưa có sản phẩm bạn hỏi."
  } catch (error) {
    console.error("DB error:", error)
    return "Rất tiếc, Trợ lý ảo SmartHub hiện đang gặp sự cố. Bạn vui lòng thử lại sau."
  }
}