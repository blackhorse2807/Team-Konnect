import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Header.css';

const Header = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const { currentUser, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const promptRef = useRef(null);
  const profileRef = useRef(null);

  // Example suggestions based on input
  const exampleSuggestions = [
    "Navratri clothes under 3000",
    "Sarees under 500",
    "Men's t-shirts under 300",
    "Kids dresses for party",
    "Home decor items",
    "Kitchen storage containers",
    "Jewelry sets for wedding",
    "Women ethnic wear",
    "Casual jeans for men"
  ];

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (promptRef.current && !promptRef.current.contains(event.target)) {
        setShowPromptInput(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
    
    // Filter suggestions based on input
    if (input.length > 0) {
      const filtered = exampleSuggestions.filter(
        suggestion => suggestion.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsLoading(true);
      onSearch(searchInput);
      setShowSuggestions(false);
      
      // Simulate search completion
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handlePromptSearch = (e) => {
    e.preventDefault();
    if (promptInput.trim()) {
      setIsLoading(true);
      setShowPromptInput(false);
      
      // Navigate to AI results page with the query
      navigate(`/ai-results?q=${encodeURIComponent(promptInput)}`);
      setPromptInput('');
      
      // Reset loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileDropdown(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {/* Top promotional banner */}
      <div className="header-gradient text-white text-center py-2 text-sm">
        <span className="font-medium">🎉 Free Delivery on Orders Above ₹499 | Download App & Get Extra 10% Off</span>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-meesho-pink font-heading text-3xl font-bold">meesho</Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-32 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-meesho-pink focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400 search-glow"
                  placeholder="Search for sarees, kurtas, ethnic wear..."
                  value={searchInput}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPromptInput(prev => !prev)}
                    className="h-full px-4 text-meesho-pink border-l-2 border-gray-200 font-medium text-sm hover:bg-meesho-lightpink transition-colors rounded-r-full flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    AI
                  </button>
                  <button
                    type="submit"
                    className={`h-full px-6 bg-meesho-pink text-white font-medium rounded-r-full hover:bg-pink-600 transition-colors ${isLoading ? 'opacity-70' : ''} flex items-center`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto search-suggestions">
                <ul className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <li 
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <span className="text-gray-700">{suggestion}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Prompt Input */}
            {showPromptInput && (
              <div ref={promptRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-6">
                <form onSubmit={handlePromptSearch}>
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3 profile-avatar">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">AI Fashion Stylist</h3>
                      <p className="text-xs text-purple-600 font-medium">Your Personal Shopping Assistant</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold text-purple-700">🤖 AI Salesman:</span> Tell me what you're looking for, and I'll create the perfect outfit combination for you!
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• "Red shirt with stripes + blue jeans" → See complete outfit on mannequin</p>
                      <p>• "Wedding saree under ₹3000" → Get styled recommendations</p>
                      <p>• "Casual office wear for women" → Complete professional looks</p>
                    </div>
                  </div>

                  <textarea
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="w-full p-4 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                    placeholder="Try: 'Show me a red shirt with stripes and matching blue jeans for a casual look' or 'I need ethnic wear for a festival, budget ₹2000'"
                    rows={3}
                  ></textarea>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      AI will show products on virtual mannequins
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowPromptInput(false)}
                        className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Style Me
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Download App (Desktop) */}
            <Link to="https://play.google.com/store/apps/details?id=com.meesho.supply&hl=en_IN">
            <div className="hidden xl:flex items-center text-gray-700 hover:text-meesho-pink transition-colors cursor-pointer group">
              <div className="p-2 rounded-lg group-hover:bg-meesho-lightpink transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium ml-1">Download App</span>
            </div>
            </Link>
            {/* Become Supplier (Desktop) */}
            <Link to="https://supplier.meesho.com/">
            <div className="hidden xl:flex items-center text-gray-700 hover:text-meesho-pink transition-colors cursor-pointer group">
              <div className="p-2 rounded-lg group-hover:bg-meesho-lightpink transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <span className="text-sm font-medium ml-1">Become Supplier</span>
            </div>
            </Link>
            {/* Profile/Login */}
            <div className="relative" ref={profileRef}>
              {currentUser ? (
                <div className="flex items-center">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-meesho-pink to-pink-600 rounded-full flex items-center justify-center profile-avatar">
                      <span className="text-white font-semibold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">Hi, {currentUser.name.split(' ')[0]}</span>
                      <span className="text-xs text-gray-500">My Account</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-meesho-pink to-pink-600 rounded-full flex items-center justify-center profile-avatar">
                            <span className="text-white font-semibold">
                              {currentUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{currentUser.name}</p>
                            <p className="text-sm text-gray-500">{currentUser.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                          </svg>
                          <span>My Orders</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-meesho-pink to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="relative">
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-meesho-pink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  {currentUser && cart && cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center cart-bounce">
                      {cart.totalItems > 9 ? '9+' : cart.totalItems}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-meesho-pink transition-colors">Cart</span>
                  {currentUser && cart && cart.totalItems > 0 && (
                    <span className="text-xs text-gray-500">{cart.totalItems} items</span>
                  )}
                </div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="lg:hidden px-4 py-3 border-t border-gray-100">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-meesho-pink focus:border-transparent text-gray-700 placeholder-gray-400"
              placeholder="Search for products..."
              value={searchInput}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-meesho-pink border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 text-meesho-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 mobile-menu-slide">
          <div className="px-4 py-4 space-y-4">
            <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span className="text-gray-700 font-medium">Download App</span>
            </div>
            <div className="flex items-center space-x-3 py-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span className="text-gray-700 font-medium">Become Supplier</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;