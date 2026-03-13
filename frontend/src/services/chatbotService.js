// // src/services/chatbotService.js
// export const sendMessageToBot = async (message) => {

//   const res = await fetch("/api/chatbot/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({ message })
//   })

//   if (!res.ok) {
//     throw new Error("Failed to send message to chatbot")
//   }

//   const data = await res.json()

//   return data.reply
// }