// src/pages/account/MyOrders.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const ordersPerPage = 8;

  const fetchMyOrders = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/orders/my-orders", {
        params: { keyword, status, timeRange, page, limit: ordersPerPage },
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.totalOrders || 0);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Không thể tải đơn hàng",
        text: "Vui lòng thử lại sau",
        customClass: { popup: "na-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders(currentPage);
  }, [currentPage, keyword, status, timeRange, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, status, timeRange]);

  const getBadge = (status) => {
    const map = {
      pending: { text: "Chờ xử lý", class: "bg-warning-subtle text-warning" },
      confirmed: { text: "Đã xác nhận", class: "bg-info-subtle text-info" },
      shipping: { text: "Đang giao hàng", class: "bg-primary-subtle text-primary" },
      done: { text: "Hoàn tất", class: "bg-success-subtle text-success" },
      cancel: { text: "Đã hủy", class: "bg-danger-subtle text-danger" }
    };
    const info = map[status] || { text: status, class: "bg-secondary" };
    return <span className={`badge rounded-pill fw-bold ${info.class}`}>{info.text}</span>;
  };

  const viewOrder = (order) => {
    const getStatusHTML = (status) => {
      const map = {
        pending: "Chờ xử lý",
        confirmed: "Đã xác nhận",
        shipping: "Đang giao",
        done: "Hoàn tất",
        cancel: "Đã hủy"
      };

      const classMap = {
        pending: "bg-warning-subtle text-warning",
        confirmed: "bg-info-subtle text-info",
        shipping: "bg-primary-subtle text-primary",
        done: "bg-success-subtle text-success",
        cancel: "bg-danger-subtle text-danger"
      };

      return `
        <span class="badge rounded-pill fw-bold ${classMap[status] || "bg-secondary"}">
          ${map[status] || status}
        </span>
      `;
    };

    const itemsHtml = order.items.map(item => `
      <tr>      
        <td style="padding:12px 0; border-bottom:1px solid #eee; width:50px; text-align:center;">
        <a href="/products/${item.product}">
            <img 
            src="${item.image || '/no-image.png'}" 
            style="width:45px; height:45px; object-fit:cover; border-radius:8px;"
            />
        </a>
        </td>

        <td style="padding:12px 0; border-bottom:1px solid #eee;">
        <a href="/products/${item.product}" style="text-decoration:none; color:#212529;">
            <div style="font-weight:500;">${item.name}</div>
        </a>
        </td>

        <td style="text-align:center; padding:12px 0; border-bottom:1px solid #eee; font-weight:500;">
          x${item.quantity}
        </td>
        <td style="text-align:right; padding:12px 0; border-bottom:1px solid #eee; color:#6f42c1; font-weight:600;">
          ${(item.price * item.quantity).toLocaleString("vi-VN")} ₫
        </td>
      </tr>
    `).join("");

    Swal.fire({
      title: `<span style="color:var(--na-primary); font-weight:700;">CHI TIẾT ĐƠN HÀNG</span>`,
      width: 820,
      padding: "2.5em",
      background: "#fff",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Đóng",
      confirmButtonColor: "#6f42c1",
      customClass: {
        popup: "na-swal-popup",
        title: "text-center",
        confirmButton: "btn btn-primary fw-semibold px-5 rounded-pill"
      },
      html: `
        <div style="text-align:left; font-size:0.97em; line-height:1.6;">
          
          <!-- Header Info -->
          <div style="background:#f8f5ff; padding:18px; border-radius:12px; margin-bottom:20px;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <div><strong>Mã đơn hàng:</strong> 
                  <span style="color:#6f42c1; font-weight:700;">
                    #${order.orderCode || order._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleString("vi-VN")}</div>
                <div><strong>Trạng thái:</strong> ${getStatusHTML(order.status)}</div>
              </div>

              <div>
                <div><strong>Khách hàng:</strong> ${order.shippingAddress?.name || 'Không có tên'}</div>
                <div><strong>Số điện thoại:</strong> ${order.shippingAddress?.phone || 'Không có số điện thoại'}</div>
                <div><strong>Email:</strong> ${order.shippingAddress?.email || 'Không có email'}</div>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom:22px;">
            <h6 style="color:#6f42c1; margin-bottom:8px; font-weight:600">Địa chỉ giao hàng</h6>
            <div style="background:#f8f9fa; padding:14px; border-radius:10px;">
              ${order.shippingAddress?.detail || 'Chưa có địa chỉ'}
              ${order.shippingAddress?.ward ? `, ${order.shippingAddress.ward}` : ''}
              ${order.shippingAddress?.district ? `, ${order.shippingAddress.district}` : ''}
              ${order.shippingAddress?.province ? `, ${order.shippingAddress.province}` : ''}
            </div>
          </div>

          <!-- Order Items -->
          <h6 style="color:#6f42c1; margin:18px 0 10px; font-weight:600">Danh sách sản phẩm</h6>
          <table style="width:100%; border-collapse:collapse; background:#fff;">
            <thead>
              <tr style="background:#f1efff;">
                <th style="padding:12px; border-bottom:2px solid #6f42c1; width:90px; text-align:center;">Ảnh</th>
                <th style="text-align:left; padding:12px; border-bottom:2px solid #6f42c1; text-align:center;">Sản phẩm</th>
                <th style="text-align:center; padding:12px; border-bottom:2px solid #6f42c1; width:90px; text-align:center;">Số lượng</th>
                <th style="text-align:right; padding:12px; border-bottom:2px solid #6f42c1; text-align:center;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Total -->
          <div style="margin-top:20px; padding:18px; background:#f8f5ff; border-radius:12px; text-align:right;">
            <div style="font-size:1.1em;">
              <strong>Tổng thanh toán: </strong>
              <span style="color:#6f42c1; font-size:1.35em; font-weight:700;">
                ${order.totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <small style="color:#666;">Phí vận chuyển: Miễn phí</small>
          </div>

          ${order.shippingAddress.note ? `
          <div style="margin-top:20px; padding:14px; background:#fff9e6; border-radius:10px; border-left:4px solid #ffc107;">
            <strong>Ghi chú:</strong> ${order.shippingAddress.note}
          </div>` : ''}
        </div>
      `
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 3) pages.push("...");
    for (let i = Math.max(end + 1, totalPages - 2); i <= totalPages; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="container py-4 mb-5" style={{ width: "97.5%" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Đơn hàng của tôi</h2>
          <div className="text-muted fs-6">Tổng cộng: <strong>{totalOrders.toLocaleString("vi-VN")}</strong> đơn hàng</div>
        </div>
      </div>

      {/* FILTER */}
      <div className="card-na p-4 mb-4 rounded-4 shadow-sm">
        <div className="row g-3">
          <div className="col-lg-5">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="col-lg-3">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="done">Hoàn tất</option>
              <option value="cancel">Đã hủy</option>
            </select>
          </div>
          <div className="col-lg-2">
            <select className="form-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày qua</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
          <div className="col-lg-2 d-flex align-items-center">
            <button className="btn btn-outline-secondary fw-semibold w-100" onClick={() => { setKeyword(""); setStatus(""); setTimeRange(""); setCurrentPage(1); }}>
              <i className="bi bi-arrow-repeat me-1"></i>Xóa lọc
            </button>
          </div>
        </div>
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="row g-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="col-lg-6 col-xl-4">
              <div className="card-na p-4 placeholder-glow rounded-4">
                <div className="placeholder col-8 mb-3" style={{ height: "25px" }}></div>
                <div className="placeholder col-6 mb-4" style={{ height: "20px" }}></div>
                <div className="placeholder w-100 rounded" style={{ height: "110px" }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 my-5">
          <i className="bi bi-receipt display-1 text-muted mb-4"></i>
          <h4 className="text-muted">Bạn chưa có đơn hàng nào</h4>
          <p className="text-muted">Hãy bắt đầu mua sắm để theo dõi đơn hàng tại đây!</p>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map(order => (
            <div key={order._id} className="col-lg-6 col-xl-4">
              <div className="card-na h-100 rounded-4 overflow-hidden shadow-sm hover-shadow transition-all" style={{ cursor: "pointer" }} onClick={() => viewOrder(order)}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <strong className="text-primary"># {order.orderCode || order._id?.slice(-8).toUpperCase()}</strong>
                    </div>
                    {getBadge(order.status)}
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}</small>
                  </div>

                  <div className="mb-4">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="d-flex gap-3 mb-2">
                        <img src={item.image} alt="" className="rounded" style={{ width: "48px", height: "48px", objectFit: "cover" }} />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-medium text-truncate">{item.name}</div>
                          <small className="text-muted">x{item.quantity}</small>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && <small className="text-muted">+ {order.items.length - 2} sản phẩm khác</small>}
                  </div>

                  <div className="d-flex justify-content-between align-items-end border-top pt-3">
                    <div className="text-muted small">Tổng thanh toán</div>
                    <div className="fw-bold fs-5 text-primary">{order.totalPrice.toLocaleString("vi-VN")} ₫</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <nav>
            <ul className="pagination pagination-lg shadow-sm">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}><i className="bi bi-caret-left-fill"></i></button>
              </li>
              {getPageNumbers().map((num, i) => (
                <li key={i} className={`page-item ${num === currentPage ? "active" : ""} ${num === "..." ? "disabled" : ""}`}>
                  {num === "..." ? <span className="page-link">...</span> : <button className="page-link fw-semibold" onClick={() => setCurrentPage(num)}>{num}</button>}
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}><i className="bi bi-caret-right-fill"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}