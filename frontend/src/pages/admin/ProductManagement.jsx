import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/products?keyword=${keyword}&limit=1000&page=1`)
      setProducts(data.products || [])
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSearch = (e) => { e.preventDefault(); fetchProducts() }

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return
    try {
      await axios.delete(`/api/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h2 className="text-center fw-semibold my-3">Danh sách sản phẩm</h2>

      <div className="d-flex mx-auto justify-content-between align-items-center" style={{ width: "95%" }}>
        <Link to="/admin/products/create" className="btn btn-primary fw-semibold">
          <i className="bi bi-database-add me-1"></i> Thêm sản phẩm
        </Link>

        <form className="d-flex" onSubmit={handleSearch}>
          <input className="form-control me-2" type="text" placeholder="Tìm kiếm sản phẩm..." style={{ width: "220px" }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button className="btn btn-outline-primary" type="submit"><i className="bi bi-search"></i></button>
        </form>
      </div>

      <div className="d-flex justify-content-center">
        <div className="table-responsive my-5" style={{ width: "95%" }}>
          <table className="table table-striped table-hover table-borderless align-middle" style={{ fontSize: "0.85em" }}>
            <thead className="text-center">
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>RAM</th>
                <th>Bộ nhớ</th>
                <th>Pin</th>
                <th>Đánh giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10">
                    <h5 className="text-center text-muted">Đang tải dữ liệu...</h5>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p, index) => (
                  <tr key={p._id}>
                    <td className="text-center"><strong>{index + 1}</strong></td>
                    <td title={p.product_name}>{p.product_name}</td>
                    <td><img src={p.image_url} width="40" height="40" className="rounded d-block mx-auto" alt="" /></td>
                    <td className="text-center">{p.brand}</td>
                    <td className="text-center">{p.price?.toLocaleString()} ₫</td>
                    <td className="text-center">{p.ram} GB</td>
                    <td className="text-center">{p.storage} GB</td>
                    <td className="text-center">{p.battery} mAh</td>
                    <td className="text-center">{p.rating_value} ({p.rating_count})</td>
                    <td className="text-center">
                      <Link to={`/admin/products/edit/${p._id}`} className="btn btn-sm btn-warning" style={{ fontSize: "0.95em" }}>
                        <i className="bi bi-pencil-square"></i> Sửa
                      </Link>&nbsp;
                      <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger" style={{ fontSize: "0.95em" }}>
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">
                    <h5 className="text-center text-muted">Hiện chưa có sản phẩm nào.</h5>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`th, td { max-width: 12.5em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`}</style>
    </>
  )
}

export default ProductManagement