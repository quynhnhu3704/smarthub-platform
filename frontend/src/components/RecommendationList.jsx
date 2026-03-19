// src/components/RecommendationList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
// Import Component thẻ sản phẩm thực tế của bạn
import ProductCard from "./ProductCard"; 

const RecommendationList = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Gọi qua Node.js (cổng 5000)
        const res = await axios.get(`/api/recommendations/${userId}`);
        if (res.data.status === "success") {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý AI:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRecommendations();
    else setLoading(false);
  }, [userId]);

  if (loading) return (
    <div className="d-flex align-items-center gap-2 text-primary">
      <div className="spinner-border spinner-border-sm"></div>
      <span>Đang tìm kiếm sản phẩm phù hợp với bạn...</span>
    </div>
  );
  
  if (products.length === 0) return null;

  return (
    <div className="recommendation-section bg-light p-4 rounded-4 shadow-sm mb-5">
      <h4 className="fw-bold mb-4 text-primary">
        <i className="bi bi-magic me-2"></i>Gợi ý dành riêng cho {userId ? "bạn" : "khách"}
      </h4>
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
        {products.map((product) => (
          <div className="col" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;