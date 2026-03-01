// src/pages/dashboard/products/ProductCreate.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function ProductCreate() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const brands = ["Apple","Samsung","Xiaomi","OPPO","Motorola","Vivo","Realme","Nokia","OnePlus","Google","Huawei","Tecno","HONOR","Nothing","Nubia","Infinix","RedMagic"]

  const initialForm = { product_name:"", brand:"", price:"", original_price:"", stock:"", ram:"", storage:"", screen_size:"", resolution:"", chipset:"", os:"", rear_camera:"", front_camera:"", battery:"", dimensions:"", weight:"", image_url:"" }

  const [form, setForm] = useState(initialForm)
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token")
      await axios.post("/api/products",
        { ...form, price:Number(form.price), original_price:Number(form.original_price), stock:Number(form.stock), ram:Number(form.ram), storage:Number(form.storage), screen_size:Number(form.screen_size), battery:Number(form.battery), weight:Number(form.weight) },
        { headers:{ Authorization:`Bearer ${token}` } }
      )
      setSuccess("Thêm sản phẩm thành công. Đang chuyển trang...")
      setTimeout(() => navigate("/dashboard/products"), 1500)
    } catch {
      setError("Thêm sản phẩm thất bại.")
      setSuccess("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={() => navigate(-1)}>← Quay lại</button>

      <div className="container d-flex justify-content-center align-items-center mb-5">
        <div className="card-na border-0" style={{ maxWidth:"38rem", width:"100%" }}>
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">Thêm sản phẩm</h3>

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-medium">Tên sản phẩm <span className="text-danger">*</span></label>
                <input type="text" name="product_name" className="form-control" value={form.product_name} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Thương hiệu <span className="text-danger">*</span></label>
                  <select name="brand" className="form-select" value={form.brand} onChange={handleChange} required>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b,i)=>(<option key={i} value={b}>{b}</option>))}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Tồn kho <span className="text-danger">*</span></label>
                  <input type="number" name="stock" className="form-control" value={form.stock} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Giá <span className="text-danger">*</span></label>
                  <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Giá gốc <span className="text-danger">*</span></label>
                  <input type="number" name="original_price" className="form-control" value={form.original_price} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-4 mb-3">
                  <label className="form-label fw-medium">RAM (GB) <span className="text-danger">*</span></label>
                  <input type="number" name="ram" className="form-control" value={form.ram} onChange={handleChange} required />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label fw-medium">Bộ nhớ (GB) <span className="text-danger">*</span></label>
                  <input type="number" name="storage" className="form-control" value={form.storage} onChange={handleChange} required />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label fw-medium">Pin (mAh) <span className="text-danger">*</span></label>
                  <input type="number" name="battery" className="form-control" value={form.battery} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Kích thước màn hình (inch) <span className="text-danger">*</span></label>
                  <input type="number" step="0.1" name="screen_size" className="form-control" value={form.screen_size} onChange={handleChange} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Độ phân giải <span className="text-danger">*</span></label>
                  <input type="text" name="resolution" className="form-control" value={form.resolution} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Camera sau <span className="text-danger">*</span></label>
                  <input type="text" name="rear_camera" className="form-control" value={form.rear_camera} onChange={handleChange} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Camera trước <span className="text-danger">*</span></label>
                  <input type="text" name="front_camera" className="form-control" value={form.front_camera} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Chipset <span className="text-danger">*</span></label>
                  <input type="text" name="chipset" className="form-control" value={form.chipset} onChange={handleChange} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Hệ điều hành <span className="text-danger">*</span></label>
                  <input type="text" name="os" className="form-control" value={form.os} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Kích thước máy <span className="text-danger">*</span></label>
                  <input type="text" name="dimensions" className="form-control" value={form.dimensions} onChange={handleChange} required />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-medium">Trọng lượng (g) <span className="text-danger">*</span></label>
                  <input type="number" name="weight" className="form-control" value={form.weight} onChange={handleChange} required />
                </div>
              </div>

              {form.image_url && (
                <div className="mb-3">
                  <div className="fw-medium mb-2">Ảnh đang hiển thị</div>
                  <img src={form.image_url} alt="preview" style={{ width:"150px", height:"150px", objectFit:"cover" }} className="rounded-4 mb-2" />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-medium">URL Hình ảnh <span className="text-danger">*</span></label>
                <input type="text" name="image_url" className="form-control" value={form.image_url} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                </div>
                <div className="col-6 mb-2">
                  <button type="reset" className="btn btn-outline-secondary w-100" onClick={() => setForm(initialForm)}>Đặt lại</button>
                </div>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && <div className="alert alert-success mt-3">{success}</div>}

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCreate