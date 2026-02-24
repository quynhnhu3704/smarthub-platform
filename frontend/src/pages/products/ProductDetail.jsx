import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../../services/productService"

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .catch(console.error)
  }, [id])

  if (!product) {
    return (
      <div className="container py-5">
        <h4 className="text-muted">Không tìm thấy sản phẩm.</h4>
      </div>
    )
  }

  return (
    <div className="container my-5">

      <button
        type="button"
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </button>

      <div className="row g-4">

        {/* Ảnh */}
        <div className="col-lg-5">
          <div className="card-na p-3 position-sticky" style={{ top: "4em" }}>
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-100 rounded-4 shadow-sm"
            />

            <span className="position-absolute top-0 start-0 badge badge-na rounded-pill m-4">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Thông tin */}
        <div className="col-lg-7">
          <div className="card-na p-4 h-100 d-flex flex-column">

            <h2 className="mb-3 fw-bold">
              {product.product_name}
            </h2>

            <div className="fs-4 fw-bold text-primary mb-4">
              {product.price.toLocaleString()} ₫
            </div>

            {/* Grid thông số */}
            <div className="row row-cols-1 row-cols-md-2 g-3 text-sm bg-light rounded-4 mb-4 p-2">

              <div className="col">
                <div className="p-3">
                  <strong>RAM:</strong> {product.ram} GB
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Bộ nhớ:</strong> {product.storage} GB
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Màn hình:</strong> {product.screen_size} inch
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Độ phân giải:</strong> {product.resolution}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Chipset:</strong> {product.chipset}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Hệ điều hành:</strong> {product.os}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Camera sau:</strong> {product.rear_camera}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Camera trước:</strong> {product.front_camera}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Pin:</strong> {product.battery} mAh
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Kích thước:</strong> {product.dimensions}
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Trọng lượng:</strong> {product.weight} g
                </div>
              </div>

              <div className="col">
                <div className="p-3">
                  <strong>Đánh giá:</strong> {product.rating_value} ⭐ ({product.rating_count})
                </div>
              </div>

            </div>

            <button className="btn btn-primary btn-lg mt-auto align-self-start fw-semibold">
              Thêm vào giỏ hàng
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetail