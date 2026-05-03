// src/pages/dashboard/products/ProductEdit.jsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

function ProductEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [originalData, setOriginalData] = useState(null)
  const [brands, setBrands] = useState([])

  const initialForm = { product_name:"", brand:"", price:"", original_price:"", stock:"", ram:"", storage:"", screen_size:"", resolution:"", chipset:"", os:"", rear_camera:"", front_camera:"", battery:"", dimensions:"", weight:"", image_url:"", status:"active" }

  const [form, setForm] = useState(initialForm)
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get("/api/brands")
        setBrands(data.brands || [])
      } catch {}
    }
    fetchBrands()
  }, [])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`)
        setForm({
          ...res.data,
          brand: res.data.brand?._id || "",
          status: res.data.status || "active"
        })

        setOriginalData({
          ...res.data,
          brand: res.data.brand?._id || "",
          status: res.data.status || "active"
        })
      } catch {
        setError("Không tìm thấy sản phẩm.")
        setTimeout(() => navigate("/dashboard/products"), 1500)
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
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token")
      await axios.put(
        `/api/products/${id}`,
        { ...form, price:Number(form.price), original_price:Number(form.original_price), stock:Number(form.stock), ram:Number(form.ram), storage:Number(form.storage), screen_size:Number(form.screen_size), battery:Number(form.battery), weight:Number(form.weight) },
        { headers:{ Authorization:`Bearer ${token}` } }
      )
      setSuccess("Cập nhật sản phẩm thành công. Đang chuyển trang...")
      setTimeout(() => navigate("/dashboard/products"), 1500)
    } catch {
      setError("Cập nhật sản phẩm thất bại.")
      setSuccess("")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-center mt-5" style={{ minHeight:"60vh" }}>Đang tải...</div>

  return (
    <>
      <button type="button" className="btn btn-outline-primary fw-semibold ms-4 my-4" onClick={() => navigate(-1)}><i className="bi bi-arrow-left"></i> Quay lại</button>

      <div className="container d-flex justify-content-center align-items-center mb-5 position-relative">
        <div className="card-na border-0" style={{ maxWidth:"38rem", width:"100%" }}>
          <div className="card-body p-4 position-relative">
            <h3 className="text-center mb-4 fw-bold text-primary">Cập nhật sản phẩm</h3>

            {loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2 rounded">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            )}

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-semibold">Tên sản phẩm <span className="text-danger">*</span></label>
                <input type="text" name="product_name" className="form-control" value={form.product_name} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Thương hiệu <span className="text-danger">*</span></label>
                  <select name="brand" className="form-select" value={form.brand} onChange={handleChange} required disabled={loading}>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(b=>(<option key={b._id} value={b._id}>{b.name}</option>))}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Tồn kho <span className="text-danger">*</span></label>
                  <input type="number" name="stock" className="form-control" value={form.stock} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Giá <span className="text-danger">*</span></label>
                  <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Giá gốc <span className="text-danger">*</span></label>
                  <input type="number" name="original_price" className="form-control" value={form.original_price} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-4 mb-3">
                  <label className="form-label fw-semibold">RAM (GB) <span className="text-danger">*</span></label>
                  <input type="number" name="ram" className="form-control" value={form.ram} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label fw-semibold">Bộ nhớ (GB) <span className="text-danger">*</span></label>
                  <input type="number" name="storage" className="form-control" value={form.storage} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-4 mb-3">
                  <label className="form-label fw-semibold">Pin (mAh) <span className="text-danger">*</span></label>
                  <input type="number" name="battery" className="form-control" value={form.battery} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Kích thước màn hình (inch) <span className="text-danger">*</span></label>
                  <input type="number" step="0.1" name="screen_size" className="form-control" value={form.screen_size} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Độ phân giải <span className="text-danger">*</span></label>
                  <input type="text" name="resolution" className="form-control" value={form.resolution} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Camera sau <span className="text-danger">*</span></label>
                  <input type="text" name="rear_camera" className="form-control" value={form.rear_camera} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Camera trước <span className="text-danger">*</span></label>
                  <input type="text" name="front_camera" className="form-control" value={form.front_camera} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Chipset <span className="text-danger">*</span></label>
                  <input type="text" name="chipset" className="form-control" value={form.chipset} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Hệ điều hành <span className="text-danger">*</span></label>
                  <input type="text" name="os" className="form-control" value={form.os} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Kích thước máy <span className="text-danger">*</span></label>
                  <input type="text" name="dimensions" className="form-control" value={form.dimensions} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Trọng lượng (g) <span className="text-danger">*</span></label>
                  <input type="number" name="weight" className="form-control" value={form.weight} onChange={handleChange} required disabled={loading} />
                </div>
              </div>

              {form.image_url && (
                <div className="mb-3">
                  <div className="fw-medium mb-2">Ảnh đang hiển thị</div>
                  <img src={form.image_url} alt="product" style={{ width:"150px", height:"150px", objectFit:"cover" }} className="rounded-4 mb-2" />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-semibold">URL Hình ảnh <span className="text-danger">*</span></label>
                <input type="text" name="image_url" className="form-control" value={form.image_url} onChange={handleChange} required disabled={loading} />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange} disabled={loading}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button type="submit" className="btn btn-primary fw-semibold w-100" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                </div>
                <div className="col-6 mb-2">
                  <button type="button" className="btn btn-outline-secondary fw-semibold w-100" onClick={() => originalData && setForm({ ...originalData })} disabled={loading}>Đặt lại</button>
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

export default ProductEdit