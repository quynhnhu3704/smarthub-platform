// frontend/src/components/RecommendationSection.jsx
// Phần của Oanh
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Component thẻ sản phẩm
const ProductCard = ({ product }) => {
  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
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
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            {product.product_name}
          </Link>
        </h6>

        <div className="d-flex gap-2 mb-2">
          <span className="badge badge-light-gray px-2 py-2">{product.ram}GB RAM</span>
          <span className="badge badge-light-gray px-2 py-2">{product.storage}GB</span>
        </div>

        <div className="price text-danger fw-bold fs-5">
          {product.price?.toLocaleString()} ₫
        </div>

        {product.original_price && product.original_price > product.price && (
          <div className="original-price text-muted">{product.original_price.toLocaleString()} ₫</div>
        )}
      </div>
    </div>
  );
};

// Component danh sách gợi ý
const RecommendationSection = ({ userId }) => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Gọi qua Node.js (cổng 5000)
        const res = await axios.get(`/api/recommendations/${userId}`);
        if (res.data.status === "success") setProducts(res.data.data);
      } catch (error) {
        console.error("Lỗi khi gọi API gợi ý sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRecommendations();
    else setLoading(false);
  }, [userId]);

  if (loading) return (
    <div className="d-flex align-items-center justify-content-center gap-2 text-primary">
      <div className="spinner-border spinner-border-sm"></div>
      <span>Đang tải gợi ý sản phẩm...</span>
    </div>
  );

  if (products.length === 0) return null;

  return (
  <div className="recommendation-section">
    <div className="mb-4">
      <h2 className="section-heading mb-1"><i class="bi bi-magic me-2"></i>
  Gợi ý dành cho{" "}
  <span className="text-primary">
    { user?.username || user?.name || "bạn"}
  </span>
      </h2>
      <div className="text-muted fs-6">
        Những sản phẩm được đề xuất dựa trên nhu cầu của bạn tại <strong className="text-primary">SmartHub</strong>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
      {products.map(product => (
        <div className="col" key={product._id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  </div>
);
};

export default RecommendationSection;