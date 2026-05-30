// pages/payment/Payment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null); // "amount" | "note" | null
  const [seconds, setSeconds] = useState(15 * 60); // 15 min countdown
  const [pulse, setPulse] = useState(false);
  const [paid, setPaid] = useState(false);
  const intervalRef = useRef(null);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const isExpired = seconds === 0;
  const urgency = seconds < 60;

  /* countdown */
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(intervalRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  /* QR pulse every 5s to remind user */
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  useEffect(() => {
    if (!state?.orderId || isExpired || paid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/my-orders/${state.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const data = await res.json();

        if (data.status === "confirmed") {
          setPaid(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.log(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [state, isExpired, paid]);

  if (!state) {
    return (
      <div className="container py-5 text-center">
        <div className="card-na p-5 mx-auto" style={{ maxWidth: 420 }}>
          <i className="bi bi-exclamation-triangle display-4 text-warning mb-3 d-block"></i>
          <h5 className="fw-bold">Không tìm thấy thông tin thanh toán</h5>
          <p className="text-muted small mb-4">Phiên giao dịch không hợp lệ hoặc đã hết hạn.</p>
          <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => navigate("/cart")}>
            <i className="bi bi-arrow-left me-2"></i>Về giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  if (paid) {
    return (
      <>
        <style>{`
          @keyframes popIn {
            0%   { transform: scale(0.5); opacity: 0 }
            70%  { transform: scale(1.12) }
            100% { transform: scale(1); opacity: 1 }
          }
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(16px) }
            to   { opacity:1; transform:translateY(0) }
          }
          @keyframes ringPulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(111,66,193,.3) }
            60%      { box-shadow: 0 0 0 24px rgba(111,66,193,.0) }
          }
          .success-icon-wrap {
            width: 96px; height: 96px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--na-primary), var(--na-accent));
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 24px;
            animation: popIn .5s cubic-bezier(.22,1,.36,1) both, ringPulse 2s ease 1s infinite;
          }
          .success-card  { animation: fadeUp .5s ease .1s both }
          .success-row   { animation: fadeUp .4s ease .3s both }
          .success-btns  { animation: fadeUp .4s ease .45s both }
        `}</style>

        <div className="container py-5 mb-5 d-flex justify-content-center">
          <div className="card-na p-5 text-center success-card" style={{ maxWidth: 480, width: "100%" }}>

            {/* Icon */}
            <div className="success-icon-wrap">
              <i className="bi bi-check-lg text-white" style={{ fontSize: "2.8rem", lineHeight: 1 }}></i>
            </div>

            {/* Title */}
            <h3 className="fw-bold mb-2">Thanh toán thành công!</h3>
            <p className="text-muted mb-4" style={{ fontSize: ".85rem" }}>Đơn hàng của bạn đã được xác nhận và đang được xử lý.</p>

            {/* Info rows */}
            <div className="success-row text-start mb-4"
              style={{ background: "#f8f6ff", borderRadius: 14, padding: "16px 20px", border: "1px solid #ede8ff" }}>
              {[
                { label: "Mã đơn hàng", value: state?.transferNote || "—", mono: true },
                { label: "Số tiền",      value: `${state?.amount?.toLocaleString("vi-VN")} ₫`, color: "var(--na-primary)" },
                { label: "Trạng thái",   value: "✓ Đã thanh toán", color: "#198754" },
              ].map((row, i) => (
                <div key={i}
                  className={`d-flex justify-content-between align-items-center ${i < 2 ? "mb-3 pb-3" : ""}`}
                  style={i < 2 ? { borderBottom: "1px dashed #e0d8f8" } : {}}>
                  <span className="text-muted" style={{ fontSize: ".82rem", fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase" }}>
                    {row.label}
                  </span>
                  <span style={{
                    fontWeight: 700,
                    fontSize: ".95rem",
                    color: row.color || "var(--na-ink)",
                    fontFamily: row.mono ? "'DM Mono','Fira Code',monospace" : "inherit"
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Reassurance */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-4"
              style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 16px", border: "1px solid #bbf7d0" }}>
              <i className="bi bi-shield-check text-success"></i>
              <small style={{ color: "#166534", fontSize: ".8rem" }}>Đơn hàng đã được ghi nhận thành công trên hệ thống</small>
            </div>

            {/* Buttons */}
            <div className="success-btns d-flex gap-3 flex-column flex-sm-row">
              <button
                className="btn btn-primary fw-bold rounded-pill py-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate("/my-orders")}>
                <i className="bi bi-bag-check"></i> Xem đơn hàng
              </button>
              <button
                className="btn btn-outline-primary fw-semibold rounded-pill py-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate("/products")}>
                <i className="bi bi-shop"></i> Tiếp tục mua
              </button>
            </div>

          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center }
          100% { background-position: 200% center }
        }
        @keyframes qrPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(111,66,193,.0) }
          50%      { box-shadow: 0 0 0 16px rgba(111,66,193,.15) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes tickUrgent {
          0%,100% { color: #dc3545 }
          50%      { color: #ff6b6b; transform: scale(1.05) }
        }

        .payment-page { animation: fadeUp .5s ease both }

        .qr-wrapper {
          border-radius: 20px;
          padding: 16px;
          background: #fff;
          box-shadow: 0 8px 32px rgba(111,66,193,.18);
          transition: transform .3s ease;
          display: inline-block;
        }
        .qr-wrapper:hover { transform: scale(1.02) }
        .qr-pulse { animation: qrPulse .6s ease }

        .copy-btn {
          border: none;
          background: #f1efff;
          color: var(--na-primary);
          border-radius: 8px;
          padding: 4px 12px;
          font-size: .8rem;
          font-weight: 700;
          font-family: 'Quicksand', sans-serif;
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .copy-btn:hover { background: var(--na-primary); color: #fff }
        .copy-btn.copied { background: #198754; color: #fff }

        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #f8f6ff;
          border-radius: 12px;
          padding: 12px 16px;
          margin-bottom: 10px;
          border: 1px solid #ede8ff;
        }
          
        .info-row .label {
          font-size: .8rem;
          color: var(--na-muted);
          font-weight: 500;
        }

        .info-row .value {
          font-size: .95rem;
          font-weight: 600;
          color: #524371;
        }

        .timer-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: 1px;
          transition: all .3s;
        }
        .timer-badge.normal {
          background: #f1efff;
          color: var(--na-primary);
          border: 2px solid #d8d0f8;
        }
        .timer-badge.urgent {
          background: #fff0f0;
          color: #dc3545;
          border: 2px solid #f5c6cb;
          animation: tickUrgent 1s infinite;
        }
        .timer-badge.expired {
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #dee2e6;
        }

        .amount-highlight {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(120deg, var(--na-primary), var(--na-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--na-primary);
          color: #fff;
          font-weight: 700;
          font-size: .8rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .bank-chip {
          background: linear-gradient(135deg, var(--na-primary), var(--na-accent));
          color: #fff;
          border-radius: 50px;
          padding: 4px 14px;
          font-size: .78rem;
          font-weight: 700;
        }

        .expired-overlay {
          position: absolute; inset: 0;
          background: rgba(255,255,255,.85);
          border-radius: 20px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px;
          backdrop-filter: blur(3px);
          z-index: 10;
        }
      `}</style>

      <div className="container py-4 mb-5 payment-page" style={{ width: "97.5%" }}>

        {/* Back */}
        <button className="btn btn-outline-primary fw-semibold mb-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Quay lại
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-1">Thanh toán chuyển khoản</h2>
          <div className="text-muted fs-6">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</div>
        </div>

        <div className="row g-4 align-items-start">

          {/* LEFT – QR */}
          <div className="col-lg-5 text-center">
            <div className="card-na p-4">

              {/* Bank badge */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <i className="bi bi-bank2 fs-5 text-primary"></i>
                <span className="bank-chip">Sacombank</span>
                <span className="text-muted small">• QR Pay</span>
              </div>

              {/* QR image */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <div className={`qr-wrapper ${pulse ? "qr-pulse" : ""}`}>
                  <img src={state.qrUrl} alt="QR Code thanh toán" style={{ width: 250, height: 250, display: "block", borderRadius: 8 }}/>
                </div>
                {isExpired && (
                  <div className="expired-overlay">
                    <i className="bi bi-clock-history fs-2 text-secondary"></i>
                    <span className="fw-bold text-muted">Mã đã hết hạn</span>
                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => navigate(-1)}>Thử lại</button>
                  </div>
                )}
              </div>

              {/* Countdown */}
              <div className="mt-3 mb-2">
                <div className={`timer-badge ${isExpired ? "expired" : urgency ? "urgent" : "normal"} mx-auto`}
                  style={{ width: "fit-content" }}>
                  <i className={`bi ${isExpired ? "bi-clock" : "bi-clock-fill"}`}></i>
                  {isExpired ? "Hết hạn" : `${mm}:${ss}`}
                </div>
                <div className="text-muted small mt-2">
                  {isExpired ? "Vui lòng tạo lại đơn hàng" : "Mã QR còn hiệu lực trong"}
                </div>
              </div>

              {/* Amount big */}
              <div className="mt-3 pt-3" style={{ borderTop: "1px dashed #e0d8f8" }}>
                <div className="text-muted small mb-1">Số tiền cần chuyển</div>
                <div className="amount-highlight">
                  {state.amount?.toLocaleString("vi-VN")} ₫
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT – Info + steps */}
          <div className="col-lg-7">
            <div className="card-na p-4">

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><i className="bi bi-info-circle text-primary"></i>Thông tin chuyển khoản</h5>

              {/* Info rows */}
              <div className="info-row">
                <div>
                  <div className="label">Ngân hàng</div>
                  <div className="value">Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)</div>
                </div>
                <button className={`copy-btn ${copied === "bank" ? "copied" : ""}`} onClick={() => copyToClipboard("Sacombank", "bank")}>
                  {copied === "bank" ? <><i className="bi bi-check2 me-1"></i>Đã copy</> : <><i className="bi bi-copy me-1"></i>Copy</>}
                </button>
              </div>

              <div className="info-row">
                <div>
                  <div className="label">Số tài khoản</div>
                  <div className="value">060281585048</div>
                </div>
                <button className={`copy-btn ${copied === "acc" ? "copied" : ""}`} onClick={() => copyToClipboard("060281585048", "acc")}>
                  {copied === "acc" ? <><i className="bi bi-check2 me-1"></i>Đã copy</> : <><i className="bi bi-copy me-1"></i>Copy</>}
                </button>
              </div>

              <div className="info-row">
                <div>
                  <div className="label">Chủ tài khoản</div>
                  <div className="value">NGUYEN THI QUYNH NHU</div>
                </div>
                <button className={`copy-btn ${copied === "owner" ? "copied" : ""}`} onClick={() => copyToClipboard("NGUYEN THI QUYNH NHU", "owner")}>
                  {copied === "owner" ? <><i className="bi bi-check2 me-1"></i>Đã copy</> : <><i className="bi bi-copy me-1"></i>Copy</>}
                </button>
              </div>

              <div className="info-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="label">Số tiền</div>
                  <div className="value" style={{ color: "var(--na-primary)" }}>
                    <div className="value" style={{ color: "#16a34a", fontSize: "1.05rem", fontWeight: "800" }}>{state.amount?.toLocaleString("vi-VN")} ₫</div>
                  </div>
                </div>
                <button className={`copy-btn ${copied === "amount" ? "copied" : ""}`} onClick={() => copyToClipboard(state.amount?.toString(), "amount")}>
                  {copied === "amount" ? <><i className="bi bi-check2 me-1"></i>Đã copy</> : <><i className="bi bi-copy me-1"></i>Copy</>}
                </button>
              </div>

              <div className="info-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="label">Nội dung chuyển khoản <span className="text-danger">*</span></div>
                  <div className="value" style={{ fontSize: ".95rem", color: "var(--na-primary)" }}>
                    <div className="value" style={{ color: "#6f42c1", fontSize: "1.05rem", fontWeight: "800" }}>{state.transferNote}</div>
                  </div>
                </div>
                <button className={`copy-btn ${copied === "note" ? "copied" : ""}`} onClick={() => copyToClipboard(state.transferNote, "note")}>
                  {copied === "note" ? <><i className="bi bi-check2 me-1"></i>Đã copy</> : <><i className="bi bi-copy me-1"></i>Copy</>}
                </button>
              </div>

              {/* Steps */}
              <div className="mt-4 pt-3" style={{ borderTop: "1px dashed #e0d8f8" }}>
                <div className="fw-bold mb-3 d-flex align-items-center gap-2"><i className="bi bi-list-check text-primary"></i>Hướng dẫn thanh toán</div>
                {[
                  { icon: "bi-qr-code-scan", text: "Mở app ngân hàng → chọn QR Pay rồi quét mã bên trái" },
                  { icon: "bi-pencil-square",  text: "Hoặc chuyển khoản thủ công theo thông tin trên – nhớ điền đúng nội dung" },
                  { icon: "bi-bell-fill",       text: "Đơn hàng được xác nhận tự động ngay sau khi chuyển thành công" },
                ].map((s, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 mb-3">
                    <div className="step-dot">{i + 1}</div>
                    <div className="d-flex align-items-start gap-2 pt-1">
                      <i className={`bi ${s.icon} text-primary flex-shrink-0`}></i>
                      <span style={{ fontSize: ".88rem", color: "var(--na-ink)", lineHeight: 1.5 }}>{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="d-flex align-items-start gap-2 p-3 rounded-3 mt-2"
                style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
                <i className="bi bi-exclamation-triangle-fill text-warning flex-shrink-0 mt-1"></i>
                <small style={{ color: "#92400e", lineHeight: 1.6 }}>
                  Vui lòng điền <strong>đúng nội dung chuyển khoản</strong> để hệ thống xác nhận tự động.
                  Nếu sai nội dung, đơn hàng có thể không được duyệt.
                </small>
              </div>

            </div>

            {/* Bottom action */}
            <div className="card-na p-3 mt-3 d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-5"></i>
                <small className="text-muted">Thanh toán an toàn – Bảo mật 100%</small>
              </div>
              <button className="btn btn-outline-primary rounded-pill fw-bold px-4" onClick={() => navigate("/my-orders")}>
                <i className="bi bi-bag-check me-2"></i>Xem đơn hàng
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}