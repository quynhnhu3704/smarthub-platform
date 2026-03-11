// src/pages/shop/ProductCatalog.jsx
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getProducts } from "../../services/productService"
import Header from "../../components/Header"

function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)
  const productsPerPage = 10
  const navigate = useNavigate()

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const keyword = queryParams.get("keyword") || ""

  useEffect(() => {
    setSelectedBrand("")
    setPriceRange("")
    setSortOrder("")
    setCurrentPage(1)
  }, [keyword])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBrand, priceRange, sortOrder])

  useEffect(() => {
    setLoading(true)
    getProducts(currentPage, productsPerPage, keyword, selectedBrand, priceRange, sortOrder)      
      .then(data => {
        const activeBrands = (data.brands || []).filter(b => b.status !== "inactive")

        const activeProducts = (data.products || []).filter(
          p => p.brand && p.brand.status !== "inactive"
        )

        setProducts(activeProducts)
        setTotalPages(data.totalPages || 1)
        setBrands(activeBrands)
        setTotalProducts(data.totalProducts || 0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentPage, keyword, selectedBrand, priceRange, sortOrder])

  const getPageNumbers = () => {
    const pages = []
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 3) pages.push("...")
    for (let i = Math.max(end + 1, totalPages - 2); i <= totalPages; i++) pages.push(i)
    return pages
  }

  return (
    <>
      <Header />
      <section id="products" className="py-5">
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap align-items-end justify-content-between mb-4 gap-3 position-relative" style={{zIndex: 5}}>
                <div>

                  {keyword || selectedBrand || priceRange || sortOrder ? (
                    <>
                      {keyword ? (
                        <h2 className="section-heading mb-1">Kết quả tìm kiếm cho "<span className="text-primary">{keyword}</span>"</h2>
                      ) : (
                        <h2 className="section-heading mb-1">Danh sách sản phẩm</h2>
                      )}
                      <div className="text-muted fs-6">Tìm thấy <strong className="text-dark">{totalProducts.toLocaleString()}</strong> sản phẩm phù hợp</div>
                    </>
                  ) : (
                    <>
                      <h2 className="section-heading mb-1">Danh sách sản phẩm</h2>
                      <div className="text-muted fs-6">Khám phá những sản phẩm công nghệ mới nhất tại <strong className="text-primary">SmartHub</strong></div>
                    </>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <select className="form-select" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                    <option value="">Tất cả brand</option>
                    {brands.map((brand) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
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
                  <div className="col-md-3 col-sm-6 d-flex align-items-center">
                    <button className="btn btn-outline-secondary w-100" onClick={() => { setSelectedBrand(""); setPriceRange(""); setSortOrder(""); setCurrentPage(1); navigate("/products") }}>
                      <i className="bi bi-arrow-repeat me-1"></i>Xóa bộ lọc
                    </button>
                  </div>
                </div>
              </div>

              <div className="position-relative">
                {loading ? (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="col">
                        <div className="card-na h-100 shadow-sm border-0 p-3 placeholder-glow">
                          <div className="placeholder w-100 rounded mb-3" style={{ height: "220px" }}></div>
                          <div className="placeholder col-10 mb-2 rounded" style={{ height: "24px" }}></div>
                          <div className="placeholder col-8 mb-3 rounded" style={{ height: "20px" }}></div>
                          <div className="d-flex gap-2 mb-3">
                            <div className="placeholder col-5 rounded" style={{ height: "28px" }}></div>
                            <div className="placeholder col-5 rounded" style={{ height: "28px" }}></div>
                          </div>
                          <div className="placeholder col-6 rounded" style={{ height: "28px" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-5 my-5">
                    <i className="bi bi-search display-1 text-muted mb-4 d-block"></i>
                    <h4 className="text-muted mb-3">Không tìm thấy sản phẩm nào</h4>
                    <p className="text-muted mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé!</p>
                    <Link to="/products" className="btn btn-primary">Xem tất cả sản phẩm</Link>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                    {products.map(product => {
                      const discountPercent = product.original_price && product.original_price > product.price ? Math.round((1 - product.price / product.original_price) * 100) : 0
                      return (
                        <div key={product._id} className="col">
                          <div className="card-na h-100 shadow-sm border-0">
                            <div className="position-relative overflow-hidden">
                              <Link to={`/products/${product._id}`}>
                                <img src={product.image_url} className="w-100 product-img" alt={product.product_name} />
                              </Link>
                              <span className="position-absolute top-0 start-0 m-3 badge badge-na rounded-pill">{product.brand?.name}</span>
                              {discountPercent > 0 && (
                                <span className="position-absolute top-0 end-0 m-3 badge bg-danger rounded-pill">-{discountPercent}%</span>
                              )}
                            </div>
                            <div className="p-3 p-lg-4 d-flex flex-column">
                              <h6 className="fw-bold mb-2 product-title">
                                <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">{product.product_name}</Link>
                              </h6>
                              <div className="d-flex gap-2 mb-2">
                                <span className="badge badge-light-gray px-2 py-2">{product.ram}GB RAM</span>
                                <span className="badge badge-light-gray px-2 py-2">{product.storage}GB</span>
                              </div>
                              <div className="price text-danger fw-bold fs-5">{product.price?.toLocaleString()} ₫</div>
                              {product.original_price && product.original_price > product.price && (
                                <div className="original-price text-muted">{product.original_price.toLocaleString()} ₫</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {loading ? null : (
                  <div className="d-flex justify-content-center mt-5">
                    <nav>
                      <ul className="pagination pagination-lg shadow-sm">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link rounded-start" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}><i className="bi bi-caret-left-fill"></i></button>
                        </li>
                        {getPageNumbers().map((pageNum, idx) => (
                          <li key={idx} className={`page-item ${pageNum === currentPage ? "active" : ""} ${pageNum === "..." ? "disabled" : ""}`}>
                            {pageNum === "..." ? <span className="page-link">...</span> : <button className="page-link fw-semibold" onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>}
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link rounded-end" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}><i className="bi bi-caret-right-fill"></i></button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductCatalog