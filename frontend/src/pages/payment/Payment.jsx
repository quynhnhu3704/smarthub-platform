// pages/payment/Payment.jsx
import { useLocation } from "react-router-dom";

export default function Payment() {
  const { state } = useLocation();

  const { orderId, amount, transferNote } = state || {};

  const qrUrl = `https://qr.sepay.vn/img?account=123456789&bank=VCB&amount=${amount}&des=${transferNote}`;

  return (
    <div className="container text-center py-5">
      <h3>Quét mã để thanh toán</h3>

      <img src={qrUrl} alt="QR Code" style={{ width: 250 }} />

      <p className="mt-3">
        Số tiền: <strong>{amount?.toLocaleString()} ₫</strong>
      </p>

      <p>
        Nội dung: <strong>{transferNote}</strong>
      </p>
    </div>
  );
}