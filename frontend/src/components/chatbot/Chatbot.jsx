import { useState, useRef, useEffect } from "react";
import { sendMessageToBot } from "../../services/chatbotService";
import "./chatbot.css";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const send = async () => {
    if (!message.trim() || isSending) return;
    const userMsg = { role: "user", text: message.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);
    try {
      const reply = await sendMessageToBot(userMsg.text);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Có lỗi xảy ra, bạn thử lại nhé nhé..." }]);
    } finally { setIsSending(false); }
  };

  const toggleChat = () => { setOpen((prev) => !prev); };

  return (
    <>
      <button className={`chatbot-fab ${open ? "open" : ""}`} onClick={toggleChat} aria-label={open ? "Đóng chatbot" : "Mở chatbot"}>
        {open ? <span className="fab-icon"><i className="bi bi-x"></i></span> : <span className="fab-icon"><i className="bi bi-robot"></i></span>}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-left">
              <div className="avatar-online">
                <img src="https://api.dicebear.com/9.x/bottts/svg?seed=SmartHub" alt="Bot avatar" />
              </div>
              <div className="header-info">
                <h5 className="fw-semibold mb-0">Trợ lý ảo SmartHub</h5>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setOpen(false)} aria-label="Đóng chatbot"><i class="bi bi-x"></i></button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>Xin chào! 👋</p>
                <p>Bạn đang tìm điện thoại nào ạ? Mình giúp được ngay nè!</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role === "user" ? "user" : "bot"}`}>
                {msg.role === "bot" && (
                  <div className="bot-avatar">
                    <img src="https://api.dicebear.com/9.x/bottts/svg?seed=SmartHub" alt="Bot" />
                  </div>
                )}
                <div className={`bubble ${msg.role}`}><div className="bubble-content">{msg.text}</div></div>
              </div>
            ))}

            {isSending && (
              <div className="message-row bot">
                <div className="bot-avatar">
                  <img src="https://api.dicebear.com/9.x/bottts/svg?seed=SmartHub" alt="Bot" />
                </div>
                <div className="bubble bot typing">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hỏi về điện thoại, so sánh, giá tốt..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              disabled={isSending}
            />
            <button className={`send-btn ${!message.trim() || isSending ? "disabled" : ""}`} onClick={send} disabled={!message.trim() || isSending} aria-label="Gửi tin nhắn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;