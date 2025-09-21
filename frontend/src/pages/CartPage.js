import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';

const CartPage = () => {
  const { cart, loading, error, fetchCart, updateCartItem, removeFromCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Fetch cart on component mount
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      navigate('/login');
    }
  }, [currentUser, fetchCart, navigate]);
  
  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity, size, color) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity, size, color);
  };
  
  // Handle remove item
  const handleRemoveItem = async (productId, size, color) => {
    await removeFromCart(productId, size, color);
  };
  
  // Format price
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-meesho-darkgray mb-6">Your Shopping Cart</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meesho-pink"></div>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-6xl text-gray-300 mb-4">
                <svg className="inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/" className="inline-block px-6 py-3 bg-meesho-pink text-white font-medium rounded-md hover:bg-opacity-90 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-meesho-darkgray">Cart Items ({cart.totalItems})</h2>
                  </div>
                  
                  <ul className="divide-y divide-gray-200">
                    {cart.items.map((item, index) => (
                      <li key={`${item.product._id}-${item.size}-${item.color}-${index}`} className="p-4 flex flex-col sm:flex-row">
                        <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 sm:ml-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <Link to={`/product/${item.product._id}`} className="text-meesho-darkgray font-medium hover:text-meesho-pink">
                                {item.product.title}
                              </Link>
                              
                              <div className="mt-1 text-sm text-gray-500">
                                {item.size && <span className="mr-2">Size: {item.size}</span>}
                                {item.color && <span>Color: {item.color}</span>}
                              </div>
                              
                              <div className="mt-1 font-semibold text-meesho-darkgray">
                                {formatPrice(item.price)}
                              </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0 flex items-center">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1, item.size, item.color)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1, item.size, item.color)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => handleRemoveItem(item.product._id, item.size, item.color)}
                                className="ml-4 text-red-500 hover:text-red-700"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-meesho-darkgray mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 text-meesho-darkgray">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.totalItems} items)</span>
                      <span>{formatPrice(cart.totalPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200 font-semibold flex justify-between">
                      <span>Total</span>
                      <span>{formatPrice(cart.totalPrice)}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 py-3 bg-meesho-pink text-white font-medium rounded-md hover:bg-opacity-90 transition-colors">
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-4 text-center">
                    <Link to="/" className="text-meesho-pink hover:underline text-sm">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

