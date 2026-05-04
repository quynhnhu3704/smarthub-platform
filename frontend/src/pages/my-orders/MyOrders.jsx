// src/pages/my-orders/MyOrders.jsx
// src/pages/dashboard/orders/OrderList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const ordersPerPage = 15;

  const fetchOrders = async (page = currentPage, key = keyword, st = status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get("/api/orders", {
        params: { keyword: key, status: st, timeRange, page, ordersPerPage },
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.totalOrders || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, status]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, keyword, status, timeRange]);

  const getBadge = (status) => {
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

    return (
      <span className={`badge rounded-pill fw-bold ${classMap[status] || "bg-secondary"}`}>
        {map[status] || status}
      </span>
    );
  };

  const getPaymentLabel = (method) => {
    const map = {
      COD: "Tiền mặt",
      SEPAY: "Chuyển khoản"
    };

    return map[method] || method;
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `/api/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders(currentPage);

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công",
        text: "Trạng thái đơn hàng đã được cập nhật.",
        timer: 1300,
        showConfirmButton: false,
        customClass: { popup: "na-swal-popup" }
      });

    } catch {
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Vui lòng thử lại.",
        confirmButtonText: "Đóng",
        customClass: {
          popup: "na-swal-popup",
          confirmButton: "btn btn-primary fw-semibold"
        },
        buttonsStyling: false
      });
    }
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
          <img 
            src="${item.image || '/no-image.png'}" 
            style="width:45px; height:45px; object-fit:cover; border-radius:8px;"
          />
        </td>
        <td style="padding:12px 0; border-bottom:1px solid #eee;">
          <div style="font-weight:600;">${item.name}</div>
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
    <div className="container-fluid py-4" style={{ width: "97.5%", minHeight: "67.5vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Danh sách đơn hàng</h2>
          <div className="text-muted fs-6">Tổng cộng: <strong>{totalOrders.toLocaleString("vi-VN")}</strong> đơn hàng</div>
        </div>
      </div>

      {/* FILTER */}
      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4 col-md-6">
              <form className="input-group" onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); fetchOrders(1, keyword, status); }}>
                <input type="text" className="form-control" placeholder="Tìm theo tên hoặc số điện thoại khách hàng..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
              </form>
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

            <div className="col-lg-3">
              <select className="form-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <option value="">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="7d">7 ngày gần nhất</option>
                <option value="month">Tháng này</option>
              </select>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-6 d-flex align-items-center">
              <button className="btn btn-outline-secondary fw-semibold w-100" onClick={() => { setKeyword(""); setStatus(""); setTimeRange(""); setCurrentPage(1); }}>
                <i className="bi bi-arrow-repeat me-1"></i>Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm overflow-hidden rounded-3">
        <div className="card-body p-0 position-relative">
          {loading ? (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead><tr><th colSpan="9"><div className="placeholder-glow"><div className="placeholder col-12 bg-secondary rounded" style={{ height: "40px" }}></div></div></th></tr></thead>
                <tbody>
                  {[...Array(ordersPerPage)].map((_, i) => (
                    <tr key={i}>
                      <td><div className="placeholder col-3 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-5 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-3 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-5 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-6 bg-secondary rounded"></div></td>
                      <td><div className="placeholder col-4 bg-secondary rounded"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam display-1 text-muted mb-3 d-block"></i>
              <h5 className="text-muted">Chưa có đơn hàng nào</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-borderless table-hover mb-0 align-middle rounded-3">
                <thead className="table-light">
                  <tr className="text-center">
                    <th>STT</th>
                    <th>Tên khách hàng</th>
                    <th>Điện thoại</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, index) => (
                    <tr key={o._id}>
                      <td className="text-center fw-bold text-dark" style={{ fontSize: "0.95em" }}>{(currentPage - 1) * ordersPerPage + index + 1}</td>

                      <td className="text-center text-dark" style={{ fontSize: "0.95em"}}>{o.shippingAddress?.name}</td>

                      <td className="text-center text-dark" style={{ fontSize: "0.95em" }}>
                        {o.shippingAddress?.phone
                          ? o.shippingAddress?.phone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
                          : "-"}
                      </td>

                      <td className="text-center text-dark"><span className="badge rounded-pill bg-secondary-subtle text-secondary fw-bold" style={{ width: "3.25em" }}>{o.items.length}</span></td>

                      <td className="text-end fw-semibold text-primary" style={{ fontSize: "0.95em"}}>{o.totalPrice?.toLocaleString("vi-VN")} ₫</td>

                      <td className="text-center" style={{ fontSize: "0.95em" }}>{getPaymentLabel(o.paymentMethod)}</td>

                      <td className="text-center">{getBadge(o.status)}</td>

                      <td className="text-center" style={{ fontSize: "0.95em" }}>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>

                      <td>
                        <div className="d-flex gap-2 justify-content-center">
                          <button className="btn btn-sm btn-info d-flex align-items-center gap-1 rounded-pill" onClick={() => viewOrder(o)}>
                            <i className="bi bi-eye"></i>
                          </button>

                          <select className="form-select form-select-sm w-auto" value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                            <option value="pending">Chờ xử lý</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="shipping">Đang giao</option>
                            <option value="done">Hoàn tất</option>
                            <option value="cancel">Đã hủy</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {!loading && (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <nav aria-label="Product pagination">
            <ul className="pagination pagination-lg mb-0 shadow-sm">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}><i className="bi bi-caret-left-fill"></i></button>
              </li>
              {getPageNumbers().map((pageNum, idx) => (
                <li key={idx} className={`page-item ${pageNum === currentPage ? "active" : ""} ${pageNum === "..." ? "disabled" : ""}`}>
                  {pageNum === "..." ? <span className="page-link">...</span> : <button className="page-link fw-semibold" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>}
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}><i className="bi bi-caret-right-fill"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      )}

    </div>
  );
}

export default OrderList;