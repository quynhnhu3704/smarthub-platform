// src/pages/dashboard/brands/BrandEdit.jsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

function BrandEdit() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [originalData, setOriginalData] = useState(null)

  const initialForm = { name:"", status:"active" }
  const [form, setForm] = useState(initialForm)
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await axios.get(`/api/brands/${id}`)
        setForm({ name: res.data.name || "", status: res.data.status || "active" })
        setOriginalData({ name: res.data.name || "", status: res.data.status || "active" })
      } catch {
        setError("Không tìm thấy thương hiệu.")
        setTimeout(() => navigate("/dashboard/brands"), 1500)
      } finally {
        setFetching(false)
      }
    }
    fetchBrand()
  }, [id, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token")
      await axios.put(`/api/brands/${id}`, { ...form }, { headers:{ Authorization:`Bearer ${token}` } })
      setSuccess("Cập nhật thương hiệu thành công. Đang chuyển trang...")
      setTimeout(() => navigate("/dashboard/brands"), 1500)
    } catch {
      setError("Cập nhật thương hiệu thất bại.")
      setSuccess("")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-center mt-5" style={{ minHeight:"60vh" }}>Đang tải...</div>

  return (
    <>
      <button type="button" className="btn btn-outline-primary fw-semibold ms-4 my-4" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Quay lại
      </button>

      <div className="container d-flex justify-content-center align-items-center mb-5 position-relative" style={{minHeight:"50vh"}}>
        <div className="card-na border-0" style={{ maxWidth:"38rem", width:"100%" }}>
          <div className="card-body p-4 position-relative">

            <h3 className="text-center mb-4 fw-bold text-primary">Cập nhật thương hiệu</h3>

            {loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2 rounded">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            )}

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-4">
                <label className="form-label fw-semibold">Tên thương hiệu <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required disabled={loading}/>
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
                  <button type="button" className="btn btn-outline-secondary fw-semibold w-100" onClick={() => originalData && setForm({ ...originalData })} disabled={loading}>
                    Đặt lại
                  </button>
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

export default BrandEdit