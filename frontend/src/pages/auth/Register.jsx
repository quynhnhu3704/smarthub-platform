// // src/pages/Register.jsx
// import { useState } from "react"
// import { registerUser } from "../../services/authService"
// import { useNavigate } from "react-router-dom"

// export default function Register() {
//   const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", password: "" })
//   const [error, setError] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       await registerUser(form)
//       navigate("/login")
//     } catch (err) {
//       setError(err.message)
//     }
//   }

//   const handleReset = () => {
//     setForm({ name: "", username: "", email: "", phone: "", password: "" })
//     setError("")
//   }

//   return (
//     <div className="container d-flex justify-content-center align-items-center my-5">
//       <div className="card-na border-0" style={{ maxWidth: "26.25em", width: "100%" }}>
//         <div className="card-body p-4">
//           <h3 className="text-center mb-4 fw-bold text-primary">Đăng ký</h3>

//           {error && <div className="alert alert-danger">{error}</div>}
          
//           <form onSubmit={handleSubmit} spellCheck="false">
//             <div className="mb-3">
//               <label className="form-label fw-medium">Họ tên <span className="text-danger">*</span></label>
//               <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-medium">Tên đăng nhập <span className="text-danger">*</span></label>
//               <input type="text" className="form-control" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
//               <input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
//               <input type="tel" className="form-control" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//             </div>

//             <div className="mb-5">
//               <label className="form-label fw-medium">Mật khẩu <span className="text-danger">*</span></label>
//               <div className="input-group">
//                 <input type={showPassword ? "text" : "password"} className="form-control" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
//                 <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
//                   <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
//                 </span>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-6">
//                 <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
//               </div>
//               <div className="col-6">
//                 <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>Đặt lại</button>
//               </div>
//             </div>

//             <div className="text-center mt-4 small">
//               Bạn đã có tài khoản?{" "}
//               <span className="text-primary fw-semibold" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Đăng nhập ngay</span>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }


// src/pages/Register.jsx
import { useState } from "react"
import { registerUser } from "../../services/authService"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser(form)
      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...")
      setError("")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err) {
      setError(err.message)
      setSuccess("")
    }
  }

  const handleReset = () => {
    setForm({ name: "", username: "", email: "", phone: "", password: "" })
    setError("")
    setSuccess("")
  }

  return (
    <div className="container d-flex justify-content-center align-items-center my-5">
      <div className="card-na border-0" style={{ maxWidth: "26.25em", width: "100%" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold text-primary">Đăng ký</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit} spellCheck="false">
            <div className="mb-3">
              <label className="form-label fw-medium">Họ tên <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Tên đăng nhập <span className="text-danger">*</span></label>
              <input type="text" className="form-control" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Email <span className="text-danger">*</span></label>
              <input type="email" className="form-control" placeholder="vd: example@gmail.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Số điện thoại <span className="text-danger">*</span></label>
              <input type="tel" className="form-control" placeholder="vd: 0123456789" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="mb-5">
              <label className="form-label fw-medium">Mật khẩu <span className="text-danger">*</span></label>
              <div className="input-group">
                <input type={showPassword ? "text" : "password"} className="form-control" placeholder="vd: 123456" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <span className="input-group-text" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                </span>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
              </div>
              <div className="col-6">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>Đặt lại</button>
              </div>
            </div>

            <div className="text-center mt-4 small">
              Bạn đã có tài khoản?{" "}
              <span className="text-primary fw-semibold" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Đăng nhập ngay</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}