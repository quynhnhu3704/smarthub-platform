import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../../services/productService"
import Header from "../../components/Header"

function ProductList() {
  const [products, setProducts] = useState([])
  const [selectedBrand, setSelectedBrand] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error)
  }, [])

  // Lấy danh sách brand không trùng
  const brands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))]
  }, [products])

  // Filter logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      let matchBrand = true
      let matchPrice = true

      if (selectedBrand) {
        matchBrand = product.brand === selectedBrand
      }

      if (priceRange === "low") {
        matchPrice = product.price < 5000000
      } else if (priceRange === "mid") {
        matchPrice = product.price >= 5000000 && product.price <= 15000000
      } else if (priceRange === "high") {
        matchPrice = product.price > 15000000
      }

      return matchBrand && matchPrice
    })

    if (sortOrder === "asc") {
      result = result.sort((a, b) => a.price - b.price)
    } else if (sortOrder === "desc") {
      result = result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, selectedBrand, priceRange, sortOrder])

  return (
    <>
      <Header />
      <section id="products" className="py-5">
        <div className="container-fluid px-4">
          <div className="row">
            <div className="col-12">

              {/* Header */}
              <div className="d-flex flex-wrap align-items-end justify-content-between mb-4 gap-3">
                <div>
                  <h2 className="section-heading mb-1">Danh sách sản phẩm</h2>
                  <div className="text-muted">
                    Khám phá và lựa chọn những sản phẩm mới nhất tại SmartHub
                  </div>
                </div>

                {/* Filter */}
                <div className="d-flex gap-2">

                  {/* Filter brand */}
                  <select
                    className="form-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="">Tất cả brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>

                  {/* Filter price */}
                  <select
                    className="form-select"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="">Tất cả giá</option>
                    <option value="low">Dưới 5 triệu</option>
                    <option value="mid">5 - 15 triệu</option>
                    <option value="high">Trên 15 triệu</option>
                  </select>

                  <select
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="">Sắp xếp</option>
                    <option value="asc">Giá: Thấp → Cao</option>
                    <option value="desc">Giá: Cao → Thấp</option>
                  </select>

                </div>
              </div>

              {/* Danh sách */}
              <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">

                {filteredProducts.length === 0 && (
                  <h5 className="text-muted">
                    Không có sản phẩm phù hợp.
                  </h5>
                )}

                {filteredProducts.map(product => (
                  <div key={product._id} className="col">
                    <div className="card-na h-100">

                      <div className="position-relative overflow-hidden">
                        <Link to={`/products/${product._id}`}>
                          <img
                            src={product.image_url}
                            className="w-100 product-img"
                            alt={product.product_name}
                          />
                        </Link>

                        <span className="position-absolute top-0 start-0 m-3 badge badge-na rounded-pill">
                          {product.brand}
                        </span>
                      </div>

                      <div className="p-3 p-lg-4 d-flex flex-column">
                        <h6 className="fw-bold mb-2 product-title">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-decoration-none text-dark"
                          >
                            {product.product_name}
                          </Link>
                        </h6>

                        <div className="d-flex gap-2 mb-2">
                          <span className="badge badge-light-gray">
                            {product.ram}GB RAM
                          </span>
                          <span className="badge badge-light-gray">
                            {product.storage}GB
                          </span>
                        </div>

                        <div className="price text-danger fw-bold">
                          {product.price.toLocaleString()} ₫
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductList