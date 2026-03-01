import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

function ProductEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const brands = ["Apple","Samsung","Xiaomi","OPPO","Motorola","Vivo","Realme","Nokia","OnePlus","Google","Huawei","Tecno","HONOR","Nothing","Nubia","Infinix","RedMagic"]

  const initialForm = {
    product_name: "", brand: "", price: "", original_price: "", stock: "",
    ram: "", storage: "", screen_size: "", resolution: "", chipset: "", os: "",
    rear_camera: "", front_camera: "", battery: "", dimensions: "", weight: "",
    image_url: ""
  }

  const [form, setForm] = useState(initialForm)

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`)
        setForm(res.data)
      } catch {
        alert("Không tìm thấy sản phẩm.")
        navigate("/dashboard/products")
      } finally {
        setFetching(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      await axios.put(
        `/api/products/${id}`,
        {
          ...form,
          price: Number(form.price),
          original_price: Number(form.original_price),
          stock: Number(form.stock),
          ram: Number(form.ram),
          storage: Number(form.storage),
          screen_size: Number(form.screen_size),
          battery: Number(form.battery),
          weight: Number(form.weight)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert("Cập nhật sản phẩm thành công.")
      navigate("/dashboard/products")
    } catch {
      alert("Cập nhật sản phẩm thất bại.")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-center mt-5">Đang tải...</div>

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-primary ms-4 my-4"
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </button>

      <div className="container d-flex justify-content-center align-items-center mb-5">
        <div className="card-na border-0" style={{ maxWidth: "38rem", width: "100%" }}>
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">
              Cập nhật sản phẩm
            </h3>

            <form onSubmit={handleSubmit} spellCheck="false">

              {/* Tên sản phẩm */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  className="form-control"
                  value={form.product_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Hình ảnh hiện tại */}
              {form.image_url && (
                <div className="mb-3 text-center">
                  <img
                    src={form.image_url}
                    alt="product"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    className="rounded-4 mb-2"
                  />
                </div>
              )}

              {/* Các field còn lại giữ y như Create */}

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Thương hiệu *</label>
                  <select
                    name="brand"
                    className="form-select"
                    value={form.brand}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Tồn kho *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Copy toàn bộ block price, ram, storage, ... giống file Create */}

              <div className="mb-4">
                <label className="form-label fw-medium">
                  URL Hình ảnh <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="image_url"
                  className="form-control"
                  value={form.image_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
                <div className="col-6 mb-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => setForm(initialForm)}
                  >
                    Đặt lại
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductEdit