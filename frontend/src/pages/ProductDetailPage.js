import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  
  // Available sizes and colors (would come from product data in a real app)
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data } = await api.get(`/api/products/${id}`);
        if (data.success) {
          setProduct(data.product);
        } else {
          setError('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    
    try {
      const success = await addToCart(id, quantity, selectedSize, selectedColor);
      
      if (success) {
        setAddedToCart(true);
        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      }
    } finally {
      setAddingToCart(false);
    }
  };
  
  // Format price
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };
  
  // Calculate discount percentage
  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meesho-pink"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Product not found'}
          </div>
          <div className="mt-6 text-center">
            <Link to="/" className="text-meesho-pink hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Original price (20-40% higher than actual price for demonstration)
  const originalPrice = product.price * (1 + (Math.random() * 0.2 + 0.2));
  const discountPercentage = calculateDiscount(product.price, originalPrice);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-2/5 p-6 flex items-center justify-center bg-gray-100">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                className="max-w-full max-h-96 object-contain"
              />
            </div>
            
            {/* Product Details */}
            <div className="md:w-3/5 p-6 md:p-8">
              <div className="mb-4">
                <Link to="/" className="text-meesho-pink text-sm hover:underline">
                  &larr; Back to Products
                </Link>
              </div>
              
              <h1 className="text-2xl font-bold text-meesho-darkgray mb-2">{product.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="bg-green-100 text-green-800 text-sm font-medium px-2 py-0.5 rounded flex items-center">
                  <span>{product.rating}</span>
                  <svg className="w-4 h-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span className="text-gray-500 text-sm ml-2">{product.reviewCount} reviews</span>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-meesho-darkgray">{formatPrice(product.price)}</span>
                {discountPercentage > 0 && (
                  <>
                    <span className="ml-2 text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                    <span className="ml-2 text-green-600 font-medium">{discountPercentage}% off</span>
                  </>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-700 mb-6">{product.description}</p>
                
                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border ${
                          selectedSize === size 
                            ? 'border-meesho-pink bg-meesho-lightpink text-meesho-pink' 
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } rounded-md text-sm font-medium`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border ${
                          selectedColor === color 
                            ? 'border-meesho-pink bg-meesho-lightpink text-meesho-pink' 
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } rounded-md text-sm font-medium`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity Selection */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-1 border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300 text-center w-12">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-1 border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`flex-1 py-3 px-6 bg-meesho-pink text-white font-medium rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center ${
                      addingToCart ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {addingToCart ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    )}
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <Link 
                    to="/cart" 
                    className="flex-1 py-3 px-6 border border-meesho-pink text-meesho-pink font-medium rounded-md hover:bg-meesho-lightpink transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    View Cart
                  </Link>
                </div>
                
                {/* Added to Cart Notification */}
                {addedToCart && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Item added to cart successfully!
                  </div>
                )}
              </div>
              
              {/* Product Meta */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-y-2">
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 text-sm">Category:</span>
                    <span className="ml-2 text-meesho-darkgray">{product.category}</span>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <span className="text-gray-500 text-sm">Subcategory:</span>
                    <span className="ml-2 text-meesho-darkgray">{product.subcategory}</span>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="w-full mt-2">
                      <span className="text-gray-500 text-sm">Tags:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

