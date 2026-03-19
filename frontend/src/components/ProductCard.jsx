import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const discountPercent = product.original_price && product.original_price > product.price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <div className="card-na h-100 shadow-sm border-0">
      <div className="position-relative overflow-hidden">
        <Link to={`/products/${product._id}`}>
          <img src={product.image_url} className="w-100 product-img" alt={product.product_name} style={{ height: "200px", objectFit: "contain" }} />
        </Link>
        {discountPercent > 0 && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-danger rounded-pill">-{discountPercent}%</span>
        )}
      </div>
      <div className="p-3">
        <h6 className="fw-bold mb-2 text-truncate">
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">{product.product_name}</Link>
        </h6>
        <div className="price text-danger fw-bold">{product.price?.toLocaleString()} ₫</div>
      </div>
    </div>
  );
};

export default ProductCard;