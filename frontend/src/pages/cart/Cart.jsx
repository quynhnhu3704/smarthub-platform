// src/pages/cart/Cart.jsx
import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const totalProducts = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(timer); }, []);
  useEffect(() => { if (cart.length > 0) { setSelected(cart.map((item) => item.product._id)); } }, [cart]);

  const toggleSelect = (id) => { setSelected((prev) => prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]); };
  const toggleSelectAll = () => { if (selected.length === cart.length) { setSelected([]); } else { setSelected(cart.map((item) => item.product._id)); } };

  const handleRemoveSelected = async () => {
    try {
      for (const id of selected) {
        await removeFromCart(id);
      }
      setSelected([]);
      await Swal.fire({ icon: "success", title: "Đã xóa", text: "Đã xóa các sản phẩm khỏi giỏ hàng.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Xóa thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Sản phẩm sẽ bị xóa khỏi giỏ hàng.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      customClass: { popup: "na-swal-popup", confirmButton: "btn btn-danger", cancelButton: "btn btn-outline-secondary", actions: "d-flex justify-content-center gap-3 mt-4" },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;
    try {
      await removeFromCart(id);
      await Swal.fire({ icon: "success", title: "Đã xóa", text: "Sản phẩm đã được xóa khỏi giỏ hàng.", timer: 1500, showConfirmButton: false, customClass: { popup: "na-swal-popup" } });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Xóa thất bại", text: "Vui lòng thử lại sau.", confirmButtonText: "Đóng", customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" }, buttonsStyling: false });
    }
  };

  const total = cart.filter((item) => selected.includes(item.product._id)).reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const selectedQuantity = cart.filter((item) => selected.includes(item.product._id)).reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (message) => {
    if (toastRef.current) {
      toastRef.current.querySelector(".toast-body").textContent = message;
      const toast = new bootstrap.Toast(toastRef.current);
      toast.show();
    }
  };

  if (cart.length === 0 && !isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="text-center py-5 my-5"><i className="bi bi-cart-x display-1 text-muted mb-4 d-block"></i><h4 className="text-muted mb-3">Giỏ hàng của bạn đang trống</h4><p className="text-muted mb-4">Thêm vài món đồ yêu thích để bắt đầu mua sắm nào!</p><Link to="/products" className="btn btn-primary">Khám phá sản phẩm</Link></div>
      </div>
    );
  }

  return (
    <div className="container py-4 mb-5" style={{ width: "97.5%" }}>
      <button type="button" className="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate(-1)}><i className="bi bi-arrow-left"></i> Quay lại</button>
      <div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="fw-bold mb-1">Giỏ hàng của bạn</h2><div className="text-muted fs-6">Tổng cộng: <strong>{totalProducts.toLocaleString()}</strong> sản phẩm</div></div>{selected.length > 0 && <button className="btn btn-outline-danger btn-sm" onClick={handleRemoveSelected}>Xóa {selected.length} mục đã chọn</button>}</div>
      <div className="row g-4 position-relative">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden rounded-4">
            <div className="card-body p-0">
              {isLoading ? (
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead className="table-light">
                      <tr><th className="ps-4 py-3" style={{ width: "40px" }}><div className="placeholder col-12 rounded"></div></th><th className="py-3"><div className="placeholder col-6 rounded"></div></th><th className="text-center py-3"><div className="placeholder col-8 rounded"></div></th><th className="text-end py-3"><div className="placeholder col-8 rounded"></div></th><th className="text-end py-3"><div className="placeholder col-8 rounded"></div></th><th className="py-3"><div className="placeholder col-6 rounded"></div></th></tr>
                    </thead>
                    <tbody>
                      {[...Array(4)].map((_, i) => (
                        <tr key={i} className="placeholder-glow">
                          <td className="ps-4 py-4"><div className="placeholder col-12 rounded" style={{ height: "20px" }}></div></td>
                          <td className="py-4"><div className="d-flex align-items-center gap-3"><div className="placeholder rounded" style={{ width: "60px", height: "60px" }}></div><div className="flex-grow-1"><div className="placeholder col-10 rounded mb-2" style={{ height: "20px" }}></div><div className="placeholder col-6 rounded" style={{ height: "16px" }}></div></div></div></td>
                          <td className="text-center py-4"><div className="placeholder col-6 rounded mx-auto" style={{ height: "32px" }}></div></td>
                          <td className="text-end py-4"><div className="placeholder col-8 rounded ms-auto" style={{ height: "20px" }}></div></td>
                          <td className="text-end py-4"><div className="placeholder col-8 rounded ms-auto" style={{ height: "20px" }}></div></td>
                          <td className="text-end py-4"><div className="placeholder col-6 rounded ms-auto" style={{ height: "32px" }}></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive h-100">
                  <table className="table table-striped table-borderless table-hover align-middle mb-0 h-100">
                    <thead className="table-light">
                      <tr><th scope="col" className="ps-4 py-3" style={{ width: "40px" }}><input className="form-check-input" type="checkbox" checked={selected.length === cart.length && cart.length > 0} onChange={toggleSelectAll} /></th>
                      <th scope="col" className="text-center py-3">Sản phẩm</th><th scope="col" className="text-center py-3">Số lượng</th><th scope="col" className="text-center py-3">Đơn giá</th><th scope="col" className="text-center py-3">Thành tiền</th><th scope="col" className="text-center py-3"></th></tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.product._id} className="hover-bg-light">
                          <td className="ps-4 py-3"><input type="checkbox" className="form-check-input" checked={selected.includes(item.product._id)} onChange={() => toggleSelect(item.product._id)} /></td>
                          <td className="py-3"><div className="d-flex align-items-center gap-3 product-title"><Link to={`/products/${item.product._id}`}><img src={item.product.image_url} alt={item.product.product_name} className="rounded object-fit-cover transition-all hover-scale" style={{ width: "50px", height: "50px" }} /></Link><div className="flex-grow-1"><Link to={`/products/${item.product._id}`} className="text-dark fw-medium text-decoration-none d-block hover-underline">{item.product.product_name}</Link>{item.product.color && <small className="text-muted d-block mt-1">Màu: {item.product.color}</small>}</div></div></td>
                          <td className="text-center py-3"><div className="d-inline-flex align-items-center bg-light rounded-pill px-2 py-1"><button className={`btn btn-sm px-3 py-0 fw-bold qty-btn ${item.quantity <= 1 ? "qty-disabled" : ""}`} onClick={() => { if (item.quantity <= 1) return; updateQuantity(item.product._id, item.quantity - 1); }}>−</button><span className="px-4 fw-bold text-secondary">{item.quantity}</span><button className={`btn btn-sm px-3 py-0 fw-bold qty-btn ${item.quantity >= item.product.stock ? "qty-disabled" : ""}`} onClick={() => { if (item.quantity >= item.product.stock) { showToast(`Chỉ còn ${item.product.stock} sản phẩm`); return; } updateQuantity(item.product._id, item.quantity + 1); }}>+</button></div></td>
                          <td className="text-end py-3 fw-medium">{item.product.price.toLocaleString("vi-VN")} ₫</td>
                          <td className="text-end py-3 fw-bold text-primary">{(item.product.price * item.quantity).toLocaleString("vi-VN")} ₫</td>
                          <td className="text-end ps-4 py-3"><button className="btn btn-sm btn-danger d-flex align-items-center gap-1 rounded-pill" title="Xóa sản phẩm" onClick={() => handleDelete(item.product._id)}><i className="bi bi-trash"></i></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg position-sticky rounded-4" style={{ top: "5em" }}>
            <div className="card-body p-4">
              {isLoading ? (
                <div className="placeholder-glow">
                  <div className="placeholder col-6 mb-4 rounded" style={{ height: "24px" }}></div>
                  <div className="d-flex justify-content-between mb-2"><div className="placeholder col-6 rounded" style={{ height: "20px" }}></div><div className="placeholder col-4 rounded" style={{ height: "20px" }}></div></div>
                  <div className="d-flex justify-content-between mb-3"><div className="placeholder col-6 rounded" style={{ height: "20px" }}></div><div className="placeholder col-4 rounded" style={{ height: "20px" }}></div></div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between align-items-center mb-4"><div className="placeholder col-4 rounded" style={{ height: "24px" }}></div><div className="placeholder col-5 rounded" style={{ height: "32px" }}></div></div>
                  <div className="placeholder w-100 rounded-pill" style={{ height: "50px" }}></div>
                  <div className="placeholder col-8 mx-auto mt-3 rounded" style={{ height: "16px" }}></div>
                </div>
              ) : (
                <>
                  <h5 className="fw-bold mb-4">Tổng đơn hàng</h5>
                  <div className="d-flex justify-content-between mb-2"><span className="text-muted">Tạm tính ({selectedQuantity} sản phẩm)</span><span className="fw-medium">{total.toLocaleString("vi-VN")} ₫</span></div>
                  <div className="d-flex justify-content-between mb-3"><span className="text-muted">Phí vận chuyển</span><span className="text-success fw-medium">Miễn phí</span></div>
                  <hr className="my-3" />
                  <div className="d-flex justify-content-between align-items-center mb-4"><h5 className="fw-bold mb-0">Tổng cộng</h5><h4 className="fw-bold text-primary mb-0">{total.toLocaleString("vi-VN")} ₫</h4></div>
                  <button className="btn btn-primary w-100 fw-bold py-2 rounded-pill" disabled={selected.length === 0} onClick={() => navigate("/checkout")}>THANH TOÁN NGAY</button>
                  <small className="d-block text-center text-muted mt-3"><i className="bi bi-lock me-1"></i>Thanh toán an toàn 100% - Được bảo vệ</small>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div ref={toastRef} className="toast align-items-center text-bg-success border-0" role="alert"><div className="d-flex"><div className="toast-body fw-medium"></div><button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>
      </div>
    </div>
  );
}