import React, { useState, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => `₹${Number(price).toFixed(2)}`;

  // Deterministic discount: 20% - 40% based on a stable hash of _id/title
  const discountMultiplier = useMemo(() => {
    const key = String(product?._id || product?.title || 'x');
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    // Map hash to 0.20 - 0.40
    const pct = 0.20 + ((hash % 21) / 100); // 0.20 to 0.40
    return 1 + pct;
  }, [product?._id, product?.title]);

  const originalPrice = useMemo(() => {
    const base = Number(product?.price || 0) * discountMultiplier;
    return Math.round(base);
  }, [product?.price, discountMultiplier]);

  const discountPercentage = useMemo(() => {
    const p = Number(product?.price || 0);
    if (!p || originalPrice <= p) return 0;
    return Math.round(((originalPrice - p) / originalPrice) * 100);
  }, [originalPrice, product?.price]);

  const handleQuickAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await addToCart(product._id, 1);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link 
      to={`/product/${product._id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-3 px-4 transform transition-transform duration-300 ${
              isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <button
              onClick={handleQuickAddToCart}
              disabled={isAddingToCart}
              className="w-full py-2 bg-meesho-pink text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              )}
              {isAddingToCart ? 'Adding...' : 'Quick Add'}
            </button>
          </div>
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-meesho-pink text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-meesho-darkgray font-medium text-sm mb-1 line-clamp-2 h-10">
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline">
              <span className="text-meesho-darkgray font-bold">{formatPrice(product.price)}</span>
              {discountPercentage > 0 && (
                <span className="ml-2 text-gray-400 text-xs line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            <div className="flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <svg className="w-3 h-3 ml-0.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span>Free Delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;