// src/utils/chatbotAI.js
import 'dotenv/config'       // đảm bảo load .env
import { GoogleGenAI } from "@google/genai"
import { getProductData } from "./chatbotDB.js"
import { marked } from "marked"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  // vertexai: false,  // quan trọng: tắt Vertex AI để chỉ dùng API key
})

// Tách keyword chính từ câu hỏi
const extractProductName = (message) => {
  // loại bỏ từ thừa, giữ chữ cái và số
  return message
    .replace(/(có|bán|ko|không|giá|mua|điện|thoại|các|của|hãng|những|sản|phẩm|nào|tôi|tìm|cho)/gi, '')
    .trim()
}

const formatAIResponse = (text) => {
  if (!text) return ""

  return marked(text)                 // markdown → HTML
    .replace(/\*\*/g, '')             // fallback xoá ** nếu còn sót
    .replace(/<\/p>\s*<p>/g, '</p><p>') // gộp khoảng trắng giữa các <p>
    .replace(/\n{2,}/g, '\n')         // xoá xuống dòng dư
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
      return `Dạ có chứ! SmartHub đang có sẵn <strong>${topProducts.length} mẫu ${keyword}</strong> cực hot dành cho bạn đây! 🔥
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
        </div>Ưng mẫu nào thì bạn cứ nhấn vào xem chi tiết hoặc bảo mình so sánh giúp cho nè, SmartHub luôn sẵn sàng! 😊✨
        `.replace(/\n\s+/g, '');  
    }

    const suggestProducts = await getProductData({})
    const topSuggest = suggestProducts
      .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
      .slice(0, 3)

    // Nếu DB không có, fallback sang AI
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Bạn là trợ lý của SmartHub (cửa hàng chỉ bán điện thoại).

      Quy tắc:
      - Chỉ trả lời với vai trò cửa hàng SmartHub.
      - Nếu khách hỏi sản phẩm KHÔNG có trong hệ thống:
        + Nói rõ: SmartHub KHÔNG kinh doanh sản phẩm đó.
        + KHÔNG liệt kê sản phẩm trong câu trả lời.
        + Chỉ nói ngắn gọn, phần sản phẩm sẽ hiển thị bên dưới.
      - Không nói bạn là AI.
      - Trả lời ngắn gọn, tự nhiên như nhân viên bán hàng.
      - Giọng điệu thân thiện, dễ thương, hơi nhí nhảnh.
      - Có thể dùng emoji nhẹ (😊, 📱, ✨) nhưng KHÔNG lạm dụng (tối đa 1–2 emoji).

      Danh sách sản phẩm gợi ý (CHỈ dùng để tham khảo, KHÔNG được hiển thị lại):
      ${topSuggest.map(p => `${p.product_name} (${p.price.toLocaleString("vi-VN")}đ)`).join(', ')}

      Câu hỏi: ${message}
      `
    })

    // return `<div>${formatAIResponse(result.text)}</div>`
    return `
      <div>${formatAIResponse(result.text)}</div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:12px 0;">
        ${topSuggest.map(p => `
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
      </div>Ưng mẫu nào thì bạn cứ nhấn vào xem chi tiết hoặc bảo mình so sánh giúp cho nè, SmartHub luôn sẵn sàng! 😊✨
    `.replace(/\n\s+/g, '')

  } catch (error) {
    console.error("DB error:", error)
    return "Rất tiếc, Trợ lý ảo SmartHub hiện đang gặp sự cố. Bạn vui lòng thử lại sau."
  }
}