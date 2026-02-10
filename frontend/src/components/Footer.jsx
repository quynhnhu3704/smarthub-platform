export default function Footer() {
  return (
    <footer className="pt-5" style={{
      background:'linear-gradient(180deg,var(--na-primary), var(--na-primary-2))',
      color:'#fff'
    }}>
      <div className="container pb-4">
        <h5 className="fw-bold">
          <i className="bi bi-mortarboard me-2"></i>
          THCS Ngũ Anh Một Nàng
        </h5>
        <p className="opacity-75">
          Hệ thống quản lý và thống kê thiết bị dạy học.
        </p>
        <div className="small opacity-75">
          © 2025 THCS Ngũ Anh Một Nàng
        </div>
      </div>
    </footer>
  )
}
