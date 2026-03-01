// src/pages/shop/ProductDetail.jsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../../services/productService"

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => { getProductById(id).then(setProduct).catch(console.error) }, [id])

  if (!product) {
    return (
      <div className="container py-5">
        <h4 className="text-muted">Không tìm thấy sản phẩm.</h4>
      </div>
    )
  }

  const discountPercent = product.original_price && product.original_price > product.price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0
  const rating = Number(product.rating_value) || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  const stars = "★".repeat(fullStars) + (hasHalfStar ? "½" : "") + "☆".repeat(emptyStars)

  return (
    <div className="container my-5">
      <button type="button" className="btn btn-outline-primary mb-4" onClick={() => navigate(-1)}>← Quay lại</button>
      <div className="row g-4">

        <div className="col-lg-5">
          <div className="card-na p-5 position-sticky" style={{ top: "4em" }}>
            <img src={product.image_url} alt={product.product_name} className="product-detail-img w-100 rounded-4" />
            <span className="position-absolute top-0 start-0 badge badge-na rounded-pill m-4">{product.brand}</span>
            {discountPercent > 0 && <span className="position-absolute top-0 end-0 badge bg-danger rounded-pill m-4">-{discountPercent}%</span>}
          </div>
        </div>
        
        <div className="col-lg-7">
          <div className="card-na p-4 h-100 d-flex flex-column">
            
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h2 className="fw-bold mb-0">{product.product_name}</h2>
              <div className="text-muted">
                <span className="text-warning fs-5">{stars}</span> {rating}/5 ({product.rating_count})
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="fs-3 fw-bold text-primary">{product.price.toLocaleString()} ₫</div>
              {product.original_price && product.original_price > product.price && <div className="text-muted text-decoration-line-through">{product.original_price.toLocaleString()} ₫</div>}
            </div>

            <div className="mb-4">
              <span className="me-2 fw-semibold">Tình trạng:</span>
              {product.stock > 0 ? (
                <span className="badge bg-success-subtle text-success-emphasis px-3 py-2 fs-6 rounded-pill">Còn hàng ({product.stock})</span>
              ) : (
                <span className="badge bg-danger-subtle text-danger-emphasis px-3 py-2 fs-6 rounded-pill">Hết hàng</span>
              )}
            </div>

            <div className="bg-light rounded-4 p-4 mb-5 shadow-sm">
              <div className="row g-3">
                <div className="col-md-6"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Chipset</div><div className="fw-semibold">{product.chipset}</div></div></div>
                <div className="col-md-6"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Hệ điều hành</div><div className="fw-semibold">{product.os}</div></div></div>

                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">RAM</div><div className="fw-semibold">{product.ram} GB</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Bộ nhớ</div><div className="fw-semibold">{product.storage} GB</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Màn hình</div><div className="fw-semibold">{product.screen_size} inch</div></div></div>

                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Độ phân giải</div><div className="fw-semibold">{product.resolution}</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Camera sau</div><div className="fw-semibold">{product.rear_camera}</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Camera trước</div><div className="fw-semibold">{product.front_camera}</div></div></div>

                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Pin</div><div className="fw-semibold">{product.battery} mAh</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Kích thước</div><div className="fw-semibold">{product.dimensions}</div></div></div>
                <div className="col-md-4"><div className="p-3 bg-white rounded-3 shadow-sm h-100"><div className="text-muted small mb-1">Trọng lượng</div><div className="fw-semibold">{product.weight} g</div></div></div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg mt-auto align-self-start fw-semibold d-flex align-items-center gap-2">
              <i className="bi bi-cart-plus fs-5"></i> Thêm vào giỏ hàng
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail