// import { useState } from "react"
// import { sendMessageToBot } from "../../services/chatbotService"
// import "./chatbot.css"

// function Chatbot(){

//   const [message,setMessage] = useState("")
//   const [messages,setMessages] = useState([])
//   const [open,setOpen] = useState(false)

//   const send = async () => {

//     if(!message) return

//     const userMsg = {role:"user",text:message}

//     setMessages(prev=>[...prev,userMsg])

//     const reply = await sendMessageToBot(message)

//     setMessages(prev=>[
//       ...prev,
//       {role:"bot",text:reply}
//     ])

//     setMessage("")
//   }

//   return (

//     <div className="chatbot-container">

//       {!open && (
//         <button
//           className="chatbot-button"
//           onClick={()=>setOpen(true)}
//         >
//           💬
//         </button>
//       )}

//       {open && (

//         <div className="chatbot-box">

//           <div className="chatbot-header">
//             SmartHub Assistant
//             <span onClick={()=>setOpen(false)}>✖</span>
//           </div>

//           <div className="chatbot-messages">

//             {messages.map((m,i)=>(
//               <div key={i} className={`msg ${m.role}`}>
//                 {m.text}
//               </div>
//             ))}

//           </div>

//           <div className="chatbot-input">

//             <input
//               value={message}
//               onChange={(e)=>setMessage(e.target.value)}
//               placeholder="Hỏi về điện thoại..."
//               onKeyDown={(e)=>e.key==="Enter" && send()}
//             />

//             <button onClick={send}>Gửi</button>

//           </div>

//         </div>

//       )}

//     </div>
//   )
// }

// export default Chatbot