// pages/checkout/Checkout.jsx
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext"; // ADDED
import { createOrder } from "../../services/orderService";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // ADDED
  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

  const selectedIds = location.state?.selected || [];
  const selectedItems = cart.filter(item => item.product && selectedIds.includes(item.product._id));

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ ADDED

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then(res => res.json())
      .then(setProvinces);
  }, []);

  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    const name = provinces.find(p => p.code == code)?.name || "";
    setFormData(prev => ({ ...prev, province: name, district: "", ward: "" }));
    const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
    const data = await res.json();
    setDistricts(data.districts);
    setWards([]);
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    const name = districts.find(d => d.code == code)?.name || "";
    setFormData(prev => ({ ...prev, district: name, ward: "" }));
    const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
    const data = await res.json();
    setWards(data.wards);
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const name = wards.find(w => w.code == code)?.name || "";
    setFormData(prev => ({ ...prev, ward: name }));
  };

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đủ thông tin giao hàng.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "na-swal-popup" }
      });
      return;
    }
    setIsProcessing(true);
    try {
      const orderData = {
        selectedItems: selectedItems.map(i => i.product._id),
        shippingAddress: {
          name: formData.fullName,
          phone: formData.phone,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          detail: formData.address,
          note: formData.note
        },
        paymentMethod: paymentMethod.toUpperCase()
      };

      const token = localStorage.getItem("token");
      
      const data = await createOrder(orderData, token);

      // 👉 nếu SEPAY thì đi trang QR, không show swal success
      if (paymentMethod.toUpperCase() === "SEPAY") {
        navigate("/payment", {
          state: {
            orderId: data._id,
            amount: data.totalPrice,
            transferNote: data.transferNote
          }
        });
        return;
      }

      // 👉 COD
      clearCart();

      await Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công!",
        text: "Đơn hàng của bạn đã được xác nhận.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "na-swal-popup" }
      });

      navigate("/order-success", {
        state: {
          orderId: data._id,
          total: data.totalPrice
        }
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Đặt hàng thất bại",
        text: "Vui lòng thử lại sau.",
        confirmButtonText: "Đóng",
        customClass: {
          popup: "na-swal-popup",
          confirmButton: "btn btn-primary fw-semibold"
        },
        buttonsStyling: false
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
        <button className="btn btn-primary fw-semibold mt-3" onClick={() => navigate("/cart")}>Quay về giỏ hàng</button>
      </div>
    );
  }

  return (
    <div className="container py-4 mb-5" style={{ width: "97.5%" }}>
      <button className="btn btn-outline-primary fw-semibold mb-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="mb-4">
        <h2 className="fw-bold mb-1">Thanh toán</h2>
        <div className="text-muted fs-6">Tổng cộng: <strong>{totalProducts.toLocaleString("vi-VN")}</strong> sản phẩm</div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card-na p-4 rounded-4 shadow-sm">
            {loading ? (
                <div className="placeholder-glow">
                <div className="placeholder col-6 mb-4 rounded" style={{ height: "24px" }}></div>

                {[...Array(6)].map((_, i) => (
                    <div key={i} className="mb-3">
                    <div className="placeholder col-4 mb-2 rounded" style={{ height: "16px" }}></div>
                    <div className="placeholder col-12 rounded" style={{ height: "38px" }}></div>
                    </div>
                ))}

                <div className="placeholder col-4 mt-4 mb-3 rounded" style={{ height: "20px" }}></div>

                {[...Array(2)].map((_, i) => (
                    <div key={i} className="d-flex gap-3 mb-3">
                    <div className="placeholder rounded" style={{ width: "50px", height: "50px" }}></div>
                    <div className="flex-grow-1">
                        <div className="placeholder col-6 mb-2 rounded" style={{ height: "16px" }}></div>
                        <div className="placeholder col-4 rounded" style={{ height: "14px" }}></div>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <>
            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-geo-alt me-2"></i>Thông tin giao hàng</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Họ và tên <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Địa chỉ chi tiết <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Tỉnh/Thành phố <span className="text-danger">*</span></label>
                  <select className="form-select" onChange={handleProvinceChange}>
                    <option value="">Chọn tỉnh</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Quận/Huyện <span className="text-danger">*</span></label>
                  <select className="form-select" onChange={handleDistrictChange}>
                    <option value="">Chọn quận</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Phường/Xã <span className="text-danger">*</span></label>
                  <select className="form-select" onChange={handleWardChange}>
                    <option value="">Chọn phường</option>
                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Ghi chú</label>
                  <textarea className="form-control rounded-3" rows="2" name="note" value={formData.note} onChange={handleChange} style={{ resize: "none" }} />
                </div>
              </div>

              <div className="mt-5">
                <h5 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
                  <i className="bi bi-credit-card-2-front"></i>Phương thức thanh toán
                </h5>

                <div className="d-flex flex-column gap-3">
                  <div className={`payment-option p-4 rounded-4 border ${paymentMethod === "cod" ? "border-primary shadow-sm bg-light" : "border-light"}`} onClick={() => setPaymentMethod("cod")} style={{ cursor: "pointer", transition: "all 0.3s ease" }}>
                    <div className="d-flex align-items-start gap-3">
                      <div className={`flex-shrink-0 rounded-3 p-3 ${paymentMethod === "cod" ? "bg-primary text-white" : "bg-light"}`}>
                        <i className="bi bi-truck fs-3"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong className="fs-6">Thanh toán khi nhận hàng (COD)</strong>
                            <div className="text-success small mt-1">✓ Phí thu hộ: <strong>Miễn phí</strong></div>
                          </div>
                          <input type="radio" className="form-check-input mt-1" checked={paymentMethod === "cod"} readOnly />
                        </div>
                        <small className="text-muted">Bạn chỉ thanh toán khi nhận được hàng</small>
                      </div>
                    </div>
                  </div>

                  <div className={`payment-option p-4 rounded-4 border ${paymentMethod === "sepay" ? "border-primary shadow-sm bg-light" : "border-light"}`} onClick={() => setPaymentMethod("sepay")} style={{ cursor: "pointer", transition: "all 0.3s ease" }}>
                    <div className="d-flex align-items-start gap-3">
                      <div className={`flex-shrink-0 rounded-3 p-3 ${paymentMethod === "sepay" ? "bg-primary text-white" : "bg-light"}`}>
                        <i className="bi bi-bank fs-3"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong className="fs-6">Chuyển khoản ngân hàng</strong>
                            <div className="text-muted small mt-1">Vietcombank • <strong>123456789</strong></div>
                            <div className="text-muted small">Chủ tài khoản: NGUYỄN VĂN A</div>
                          </div>
                          <input type="radio" className="form-check-input mt-1" checked={paymentMethod === "sepay"} readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            </>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-na p-4 rounded-4 shadow-sm position-sticky" style={{ top: "5em" }}>
            {loading ? (
                <div className="placeholder-glow">
                <div className="placeholder col-6 mb-4 rounded" style={{ height: "24px" }}></div>

                {[...Array(3)].map((_, i) => (
                    <div key={i} className="d-flex gap-3 mb-4 pb-4">
                    <div className="placeholder rounded" style={{ width: "78px", height: "78px" }}></div>
                    <div className="flex-grow-1">
                        <div className="placeholder col-8 mb-2 rounded" style={{ height: "16px" }}></div>
                        <div className="placeholder col-5 rounded" style={{ height: "16px" }}></div>
                    </div>
                    </div>
                ))}

                <div className="d-flex justify-content-between mb-2">
                    <div className="placeholder col-5 rounded" style={{ height: "16px" }}></div>
                    <div className="placeholder col-3 rounded" style={{ height: "16px" }}></div>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <div className="placeholder col-5 rounded" style={{ height: "16px" }}></div>
                    <div className="placeholder col-3 rounded" style={{ height: "16px" }}></div>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="placeholder col-4 rounded" style={{ height: "20px" }}></div>
                    <div className="placeholder col-5 rounded" style={{ height: "28px" }}></div>
                </div>

                <div className="placeholder w-100 rounded-pill mb-3" style={{ height: "52px" }}></div>
                <div className="placeholder col-8 mx-auto rounded" style={{ height: "14px" }}></div>
                </div>
            ) : (
            <>
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">Đơn hàng của bạn</h5>

            <div className="order-items mb-4" style={{ maxHeight: "380px" }}>
              {selectedItems.map((item) => (
                <div key={item.product._id} className="d-flex gap-3 mb-4 pb-4 border-bottom">
                  <div className="position-relative flex-shrink-0">
                    <img src={item.product.image_url} alt={item.product.product_name} className="rounded-3" style={{ width: "78px", height: "78px", objectFit: "cover" }} />
                  </div>
                  <div className="flex-grow-1 pt-1">
                    <div className="fw-semibold line-clamp-2 mb-2">{item.product.product_name}</div>
                    <div className="d-flex justify-content-between align-items-end">
                      <span className="text-muted fs-6">{item.product.price.toLocaleString("vi-VN")} ₫ × {item.quantity}</span>
                      <span className="fw-semibold fs-5 text-primary">{(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Phí vận chuyển</span>
              <span className="text-success fw-semibold">Miễn phí</span>
            </div>

            <hr className="my-3" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Tổng thanh toán</h5>
              <h4 className="fw-bold text-primary mb-0">{total.toLocaleString("vi-VN")} ₫</h4>
            </div>

            <button className="btn btn-primary w-100 fw-bold py-2 rounded-pill fs-5 shadow-sm d-flex align-items-center justify-content-center gap-2" onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>ĐANG XỬ LÝ...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle"></i>XÁC NHẬN ĐẶT HÀNG
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                <i className="bi bi-shield-check"></i>Thanh toán an toàn 100% - Được bảo vệ
              </small>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}