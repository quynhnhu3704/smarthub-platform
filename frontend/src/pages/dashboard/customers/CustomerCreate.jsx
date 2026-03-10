// src/pages/dashboard/customers/CustomerCreate.jsx
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {createCustomer} from "../../../services/userService"

function CustomerCreate(){
  const navigate=useNavigate()
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState("")
  const[success,setSuccess]=useState("")
  const[showPassword,setShowPassword]=useState(false)

  const initialForm={name:"",username:"",email:"",phone:"",password:"",status:"active"}
  const[form,setForm]=useState(initialForm)

  const handleChange=e=>setForm({...form,[e.target.name]:e.target.value})

  const handleSubmit=async e=>{
    e.preventDefault()
    try{
      setLoading(true);setError("");setSuccess("")
      await createCustomer(form)
      setSuccess("Tạo khách hàng thành công. Đang chuyển trang...")
      setTimeout(()=>navigate("/dashboard/customers"),1500)
    }catch(err){
      setError(err.message||"Tạo khách hàng thất bại.")
      setSuccess("")
    }finally{
      setLoading(false)
    }
  }

  return(
    <>
      <button type="button" className="btn btn-outline-primary ms-4 my-4" onClick={()=>navigate(-1)}><i className="bi bi-arrow-left"></i> Quay lại</button>

      <div className="container d-flex justify-content-center align-items-center mb-5 position-relative">
        <div className="card-na border-0" style={{maxWidth:"32rem",width:"100%"}}>
          <div className="card-body p-4 position-relative">
            <h3 className="text-center mb-4 fw-bold text-primary">Thêm khách hàng</h3>

            {loading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-2 rounded">
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            )}

            <form onSubmit={handleSubmit} spellCheck="false">

              <div className="mb-3">
                <label className="form-label fw-medium">Tên khách hàng <span className="text-danger">*</span></label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Username <span className="text-danger">*</span></label>
                <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
                <input type="text" name="phone" className="form-control" value={form.phone} onChange={handleChange} required disabled={loading}/>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Mật khẩu tạm thời <span className="text-danger">*</span></label>
                <div className="input-group">
                  <input type={showPassword?"text":"password"} name="password" className="form-control" value={form.password} onChange={handleChange} required disabled={loading}/>
                  <span className="input-group-text" style={{cursor:"pointer"}} onClick={()=>setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword?"bi-eye":"bi-eye-slash"}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Trạng thái</label>
                <select name="status" className="form-select" value={form.status} onChange={handleChange} disabled={loading}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              <div className="row">
                <div className="col-6 mb-2">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading?"Đang lưu...":"Lưu"}</button>
                </div>
                <div className="col-6 mb-2">
                  <button type="reset" className="btn btn-outline-secondary w-100" onClick={()=>setForm(initialForm)} disabled={loading}>Đặt lại</button>
                </div>
              </div>

              {error&&<div className="alert alert-danger mt-3">{error}</div>}
              {success&&<div className="alert alert-success mt-3">{success}</div>}

            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomerCreate