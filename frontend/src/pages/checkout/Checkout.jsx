// pages/checkout/Checkout.jsx
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);

  const selectedIds = location.state?.selected || [];
  
  const selectedItems = cart.filter(item => 
    item.product && selectedIds.includes(item.product._id)
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "Hồ Chí Minh",
    district: "",
    ward: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = selectedItems.reduce((sum, item) => 
    sum + item.product.price * item.quantity, 0
  );

  const shippingFee = 0; // Miễn phí
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ thông tin giao hàng.",
        customClass: { popup: "na-swal-popup" }
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1800));

      await Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        html: `
          <p class="mb-1">Cảm ơn bạn <strong>${formData.fullName}</strong></p>
          <p class="text-muted small">Đơn hàng của bạn đã được xác nhận.</p>
        `,
        timer: 2500,
        showConfirmButton: false,
        customClass: { popup: "na-swal-popup" }
      });

      clearCart();
      navigate("/order-success", { 
        state: { 
          orderId: "NA" + Date.now().toString().slice(-8),
          total 
        } 
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Đặt hàng thất bại",
        text: "Vui lòng thử lại sau.",
        customClass: { popup: "na-swal-popup" }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
        <h4>Không có sản phẩm nào được chọn</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/cart")}>
          Quay về giỏ hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 mb-5" style={{ width: "97.5%" }}>
      <button 
        className="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 shadow-sm"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i> Quay lại giỏ hàng
      </button>

      <h2 className="fw-bold mb-4 section-heading">Thanh toán</h2>

      <div className="row g-4">
        {/* ==================== LEFT: FORM ==================== */}
        <div className="col-lg-7">
          <div className="card-na p-5 rounded-4 shadow-sm">
            <h4 className="fw-bold mb-4 text-primary">
              <i className="bi bi-geo-alt me-2"></i>Thông tin giao hàng
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                  <input
                    type="tel"
                    className="form-control form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="0987654321"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="123 Đường ABC, Phường XYZ"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Tỉnh/Thành phố</label>
                  <select className="form-select form-select" name="province" value={formData.province} onChange={handleChange}>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Quận/Huyện</label>
                  <input
                    type="text"
                    className="form-control form-control"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Quận 1"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Phường/Xã</label>
                  <input
                    type="text"
                    className="form-control form-control"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="Phường Bến Nghé"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Ghi chú</label>
                  <textarea
                    className="form-control rounded-3"
                    rows="3"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Giao hàng giờ hành chính, gọi trước khi giao..."
                    style={{ resize: "none" }}
                  />
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="mt-5">
                <h4 className="fw-bold mb-4 text-primary">
                  <i className="bi bi-credit-card me-2"></i>Phương thức thanh toán
                </h4>

                <div className="d-flex flex-column gap-3">
                  <div 
                    className={`p-4 rounded-4 border ${paymentMethod === "cod" ? "border-primary bg-light" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input type="radio" checked={paymentMethod === "cod"} readOnly />
                      <div>
                        <strong>Thanh toán khi nhận hàng (COD)</strong>
                        <div className="text-muted small">Phí thu hộ: Miễn phí</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-4 border ${paymentMethod === "bank" ? "border-primary bg-light" : ""}`}
                    onClick={() => setPaymentMethod("bank")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <input type="radio" checked={paymentMethod === "bank"} readOnly />
                      <div>
                        <strong>Chuyển khoản ngân hàng</strong>
                        <div className="text-muted small">Vietcombank • 123456789 • NGUYEN VAN A</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ==================== RIGHT: ORDER SUMMARY ==================== */}
        <div className="col-lg-5">
          <div className="card-na p-4 p-lg-5 rounded-4 shadow-sm position-sticky" style={{ top: "5em" }}>
            <h4 className="fw-bold mb-4">Đơn hàng của bạn</h4>

            <div className="mb-4" style={{ maxHeight: "420px", overflowY: "auto" }}>
              {selectedItems.map(item => (
                <div key={item.product._id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.product_name}
                    className="rounded-3"
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-medium">{item.product.product_name}</div>
                    {item.product.color && <small className="text-muted">Màu: {item.product.color}</small>}
                    <div className="d-flex justify-content-between align-items-end mt-2">
                      <span className="text-muted">x{item.quantity}</span>
                      <span className="fw-bold text-primary">
                        {(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính</span>
                <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Phí vận chuyển</span>
                <span className="text-success fw-medium">Miễn phí</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Tổng cộng</h5>
                <h3 className="fw-bold text-primary mb-0">
                  {total.toLocaleString("vi-VN")} ₫
                </h3>
              </div>

              <button 
                className="btn btn-primary w-100 fw-bold py-3 rounded-pill fs-5 shadow-sm"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    ĐANG XỬ LÝ...
                  </>
                ) : (
                  `XÁC NHẬN ĐẶT HÀNG (${selectedItems.length} sản phẩm)`
                )}
              </button>

              <small className="d-block text-center text-muted mt-3">
                <i className="bi bi-shield-lock me-1"></i>
                Thanh toán an toàn • Bảo mật 100%
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}