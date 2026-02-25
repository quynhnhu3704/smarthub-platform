// src/pages/products/ProductList.jsx
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { getProducts } from "../../services/productService"
import Header from "../../components/Header"

function ProductList() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const productsPerPage = 10

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get("keyword") || ""

  useEffect(() => { setCurrentPage(1) }, [keyword, selectedBrand, priceRange, sortOrder])

  useEffect(() => {
    getProducts(currentPage, productsPerPage, keyword, selectedBrand, priceRange, sortOrder)
      .then(data => {
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
        setBrands(data.brands || [])
      })
      .catch(console.error)
  }, [currentPage, keyword, selectedBrand, priceRange, sortOrder])

  return (
    <>
      <Header />
      <section id="products" className="py-5">
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-12">

              <div className="d-flex flex-wrap align-items-end justify-content-between mb-4 gap-3">
                <div>
                  {keyword ? (
                    <>
                      <h2 className="section-heading mb-1">Kết quả tìm kiếm cho "<span className="text-primary">{keyword}</span>"</h2>
                      <div className="text-muted">Tìm thấy {products.length} sản phẩm phù hợp</div>
                    </>
                  ) : (
                    <>
                      <h2 className="section-heading mb-1">Danh sách sản phẩm</h2>
                      <div className="text-muted">Khám phá và lựa chọn những sản phẩm mới nhất tại SmartHub</div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <select className="form-select" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                    <option value="">Tất cả brand</option>
                    {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                  </select>

                  <select className="form-select" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                    <option value="">Tất cả giá</option>
                    <option value="low">Dưới 5 triệu</option>
                    <option value="mid">5 - 15 triệu</option>
                    <option value="high">Trên 15 triệu</option>
                  </select>

                  <select className="form-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="">Sắp xếp</option>
                    <option value="asc">Giá: Thấp → Cao</option>
                    <option value="desc">Giá: Cao → Thấp</option>
                  </select>
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
                {products.length === 0 && <div className="col-12"><h5 className="text-muted">Không có sản phẩm phù hợp.</h5></div>}
                {products.map(product => (
                  <div key={product._id} className="col">
                    <div className="card-na h-100 shadow-sm border-0">
                      <div className="position-relative overflow-hidden">
                        <Link to={`/products/${product._id}`}>
                          <img src={product.image_url} className="w-100 product-img" alt={product.product_name} />
                        </Link>
                        <span className="position-absolute top-0 start-0 m-3 badge badge-na rounded-pill">{product.brand}</span>
                      </div>
                      <div className="p-3 p-lg-4 d-flex flex-column">
                        <h6 className="fw-bold mb-2 product-title">
                          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">{product.product_name}</Link>
                        </h6>
                        <div className="d-flex gap-2 mb-2">
                          <span className="badge badge-light-gray">{product.ram}GB RAM</span>
                          <span className="badge badge-light-gray">{product.storage}GB</span>
                        </div>
                        <div className="price text-danger fw-bold">{product.price?.toLocaleString()} ₫</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mt-5">
                <nav>
                  <ul className="pagination pagination-lg shadow-sm">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link rounded-start" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>←</button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link fw-semibold" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link rounded-end" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>→</button>
                    </li>
                  </ul>
                </nav>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductList