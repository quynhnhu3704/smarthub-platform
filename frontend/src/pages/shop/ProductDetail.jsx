// src/pages/shop/ProductDetail.jsx
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { CartContext } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useContext(CartContext);

  const handleAddCart = async () => {
    try {
      const existing = cart.find(i => i.product._id === product._id);
      const currentQty = existing ? existing.quantity : 0;

      if (currentQty + 1 > product.stock) {
        Swal.fire({
          icon: "warning",
          title: "Không đủ hàng",
          text: `Chỉ còn ${product.stock} sản phẩm trong kho.`,
          confirmButtonText: "Đóng",
          customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" },
          buttonsStyling: false
        });
        return;
      }

      await addToCart(product, 1);

      await Swal.fire({
        icon: "success",
        title: "Thêm thành công",
        text: "Sản phẩm đã được thêm vào giỏ hàng.",
        timer: 1300,
        showConfirmButton: false,
        customClass: { popup: "na-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Thêm thất bại",
        text: "Vui lòng thử lại sau.",
        confirmButtonText: "Đóng",
        customClass: { popup: "na-swal-popup", confirmButton: "btn btn-primary" },
        buttonsStyling: false
      });
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => setProduct(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5 py-4 position-relative">
        <div className="row g-5 placeholder-glow">
          <div className="col-lg-5">
            <div className="card-na p-5 rounded-4">
              <div className="placeholder w-100 rounded-4" style={{ height: "500px" }}></div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-na p-5 rounded-4">
              <div className="placeholder col-9 mb-3 rounded" style={{ height: "40px" }}></div>
              <div className="placeholder col-4 mb-4 rounded" style={{ height: "24px" }}></div>

              <div className="d-flex gap-3 mb-4">
                <div className="placeholder col-4 rounded" style={{ height: "32px" }}></div>
                <div className="placeholder col-4 rounded" style={{ height: "32px" }}></div>
              </div>

              <div className="mb-5">
                <div className="placeholder col-3 rounded" style={{ height: "28px" }}></div>
              </div>

              <div className="bg-light rounded-4 p-4 mb-5">
                <div className="placeholder col-5 mb-4 rounded" style={{ height: "28px" }}></div>
                <div className="row g-3">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <div className="p-3 bg-white rounded-3 shadow-sm">
                        <div className="placeholder w-100 rounded" style={{ height: "70px" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="placeholder w-100 rounded-pill" style={{ height: "60px" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-1 text-muted mb-4 d-block"></i>
        <h4 className="text-muted mb-3">Không tìm thấy sản phẩm</h4>
        <button className="btn btn-primary px-5 py-3" onClick={() => navigate("/products")}>
          Quay về cửa hàng
        </button>
      </div>
    );
  }

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const rating = Number(product.rating_value) || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = "★".repeat(fullStars) + (hasHalfStar ? "½" : "") + "☆".repeat(emptyStars);

  return (
    <div className="container mb-5 py-4" style={{ width: "97.5%" }}>
      <button type="button" className="btn btn-outline-primary mb-4 d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="row g-5">
        <div className="col-lg-5">
          <div className="card-na p-4 position-sticky rounded-4" style={{ top: "5em" }}>
            <div className="position-relative">
              <img src={product.image_url} alt={product.product_name} className="product-detail-img w-100 rounded-4 transition-all"/>
              <span className="position-absolute top-0 start-0 fs-6 badge badge-na rounded-pill fw-bold">{product.brand?.name}</span>
              {discountPercent > 0 && (
                <span className="position-absolute top-0 end-0 fs-6 badge bg-danger rounded-pill fw-bold">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card-na p-5 h-100 d-flex flex-column shadow-sm rounded-4">
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="fw-bold mb-0 section-heading">{product.product_name}</h2>
              <div className="text-center">
                <div className="text-warning">
                  {Array.from({ length: 5 }, (_, i) => {
                    const value = rating || 0
                    if (value >= i + 1) return <i key={i} className="bi bi-star-fill me-1"></i>
                    if (value >= i + 0.5) return <i key={i} className="bi bi-star-half me-1"></i>
                    return <i key={i} className="bi bi-star me-1"></i>
                  })}
                </div>
                <small className="text-muted">{rating}/5 ({product.rating_count || 0} đánh giá)</small>
              </div>
            </div>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <div className="price fs-2 fw-bold text-primary">
                {product.price?.toLocaleString("vi-VN")} ₫
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="original-price text-muted text-decoration-line-through fs-5">
                  {product.original_price.toLocaleString("vi-VN")} ₫
                </div>
              )}
            </div>

            <div className="mb-5">
              <span className="fw-semibold me-3">Tình trạng:</span>
              {product.stock > 0 ? (
                <span className="badge bg-success-subtle text-success px-4 py-2 fs-6 rounded-pill">
                  Còn hàng ({product.stock} sản phẩm)
                </span>
              ) : (
                <span className="badge bg-danger-subtle text-danger px-4 py-2 fs-6 rounded-pill">
                  Hết hàng
                </span>
              )}
            </div>

            <div className="bg-light rounded-4 p-4 mb-5 shadow-sm">
              <h5 className="fw-bold mb-4 text-primary">Thông số kỹ thuật</h5>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                    <div className="text-muted small mb-1">Chipset</div>
                    <div className="fw-semibold">{product.chipset || "Không có thông tin"}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                    <div className="text-muted small mb-1">Hệ điều hành</div>
                    <div className="fw-semibold">{product.os || "Không có thông tin"}</div>
                  </div>
                </div>

                {[
                  { label: "RAM", value: `${product.ram} GB` },
                  { label: "Bộ nhớ", value: `${product.storage} GB` },
                  { label: "Màn hình", value: `${product.screen_size} inch` },
                  { label: "Độ phân giải", value: product.resolution },
                  { label: "Camera sau", value: product.rear_camera },
                  { label: "Camera trước", value: product.front_camera },
                  { label: "Pin", value: `${product.battery} mAh` },
                  { label: "Kích thước", value: product.dimensions },
                  { label: "Trọng lượng", value: `${product.weight} g` },
                ].map((spec, idx) => (
                  <div key={idx} className="col-md-6 col-lg-4">
                    <div className="p-3 bg-white rounded-3 shadow-sm h-100">
                      <div className="text-muted small mb-1">{spec.label}</div>
                      <div className="fw-semibold">{spec.value || "Không có thông tin"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <button className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-3 rounded-pill py-3 px-5 fs-5" onClick={handleAddCart} disabled={product.stock <= 0}>
                <i className="bi bi-cart-plus fs-3"></i>
                {product.stock > 0 ? "THÊM VÀO GIỎ HÀNG" : "HẾT HÀNG"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;