import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import { Link } from 'react-router-dom';
import SidebarChatbot from '../components/SidebarChatbot';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCategories] = useState([
    {
      _id: 'home-decor-category', 
      name: 'Home Decor',
      image: 'https://images.meesho.com/images/marketing/1649760599511.webp'
    },
    {
      _id: 'women-category',
      name: 'Women',
      image: 'https://images.meesho.com/images/marketing/1649760442043.webp'
    }
  ]);
  const [loadingCategories] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await api.post('/api/search', { 
          query: 'trendy', 
          tags: ['trendy', 'trending', 'popular', 'latest'],
          limit: 10 
        });
        setTrendingProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoadingTrending(false);
      }
    };
    
    fetchTrendingProducts();
  }, []);

  const runSearch = async (query, nextPage = 1, extra = {}) => {
    setLoading(true);
    try {
      const body = { query, page: nextPage, limit, ...extra };
      const response = await api.post('/api/search', body);
      setProducts(response.data.products || []);
      setPage(response.data.page || nextPage);
      setPages(response.data.pages || 1);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (!error.response) {
        alert('Error connecting to the server. Please make sure the backend is running.');
      }
      setProducts([]);
      setPage(1);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (queryOrRequest, extraFilters = {}) => {
    setSearchPerformed(true);
    
    // Handle both string queries and object requests from chatbot
    let query, filters;
    if (typeof queryOrRequest === 'string') {
      query = queryOrRequest;
      filters = extraFilters;
    } else {
      // Object from chatbot with query and filters
      query = queryOrRequest.query || '';
      filters = { ...extraFilters, ...queryOrRequest };
      delete filters.query; // Remove query from filters
    }
    
    setSearchQuery(query);
    setPage(1);
    await runSearch(query, 1, filters);
  };

  const handleCategoryClick = (name) => {
    // Use the category name directly as search query
    // The backend search will find products by matching category names
    if (name === 'Women') {
      // This will match both "Women Ethnic" and "Women Western" categories
      handleSearch('Women');
    } else if (name === 'Home Decor') {
      // This will match "Home & Kitchen" category
      handleSearch('Home Kitchen');
    } else {
      handleSearch(name);
    }
  };

  const handlePageChange = async (nextPage) => {
    await runSearch(searchQuery, nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        {!searchPerformed ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-9">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-meesho-lightpink to-pink-50 rounded-lg mb-8 overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="p-6 md:p-10 md:w-1/2">
                      <h1 className="text-2xl md:text-4xl font-heading font-bold text-meesho-darkgray mb-4">
                        Lowest Prices <br/>Best Quality Shopping
                      </h1>
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-meesho-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Free Delivery</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-meesho-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Cash on Delivery</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-meesho-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium">Easy Returns</span>
                        </div>
                      </div>
                      <button className="mt-6 px-6 py-3 bg-meesho-pink text-white font-medium rounded-md hover:bg-opacity-90 transition-colors">
                        Download the Meesho App
                      </button>
                    </div>
                    <div className="md:w-1/2">
                      <img 
                        src="https://images.meesho.com/images/marketing/1631722939962.webp" 
                        alt="Meesho App" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Special Offers */}
                <div className="mb-10">
                  <h2 className="text-xl font-medium text-meesho-darkgray mb-6">Special Offers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">First Order Discount</h3>
                      <p className="text-sm text-gray-600 mb-4">Get 10% off on your first order with code FIRST10</p>
                      <Link to="/" className="text-purple-600 font-medium hover:underline">Shop Now</Link>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Bank Offers</h3>
                      <p className="text-sm text-gray-600 mb-4">10% instant discount on HDFC Bank Credit Cards</p>
                      <Link to="/" className="text-blue-600 font-medium hover:underline">Learn More</Link>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-lg p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Refer & Earn</h3>
                      <p className="text-sm text-gray-600 mb-4">Refer friends and get ₹100 off on your next purchase</p>
                      <Link to="/" className="text-green-600 font-medium hover:underline">Invite Friends</Link>
                    </div>
                  </div>
                </div>
                
                {/* Featured Categories (restricted) */}
                <div className="mb-10">
                  <h2 className="text-xl font-medium text-meesho-darkgray mb-6">Top Categories to choose from</h2>
                  {loadingCategories ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meesho-pink"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {featuredCategories.map(category => (
                        <div
                          key={category._id}
                          className="cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-auto rounded-md"
                          />
                          <p className="text-center text-sm font-medium mt-2">{category.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Trending Products Section */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium text-meesho-darkgray">Trending Products</h2>
                    <button 
                      onClick={() => handleSearch('trendy')}
                      className="text-meesho-pink text-sm font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  {loadingTrending ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meesho-pink"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
                        {trendingProducts.map((product) => (
                          <div key={product._id} className="flex-shrink-0 w-48">
                            <Link to={`/product/${product._id}`} className="group">
                              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-48 overflow-hidden">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    TRENDING
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 h-8">
                                    {product.title}
                                  </h3>
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-meesho-pink">₹{product.price}</span>
                                    <div className="flex items-center bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                                      <span>{product.rating}</span>
                                      <svg className="w-3 h-3 ml-0.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                      
                      {/* Scroll indicators */}
                      {trendingProducts.length > 0 && (
                        <>
                          <div className="absolute top-1/2 -translate-y-1/2 left-0 bg-white rounded-full shadow-md p-2 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-full shadow-md p-2 opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className="lg:col-span-3">
                <SidebarChatbot onPrompt={handleSearch} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-9">
                <div className="mb-6">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <ProductGrid 
                  products={products} 
                  loading={loading}
                  searchQuery={searchQuery}
                />
                <Pagination page={page} pages={pages} total={total} onPageChange={handlePageChange} />
              </div>
              <div className="lg:col-span-3">
                <SidebarChatbot onPrompt={handleSearch} />
              </div>
            </div>
          </>
        )}
      </div>
      
      {!searchPerformed && (
        <footer className="bg-meesho-footer mt-10 py-8 border-t border-meesho-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Shop Non-Stop on Meesho</h3>
                <p className="text-sm text-gray-500">
                  Trusted by more than 1 Crore Indians
                  Cash on Delivery | Free Delivery
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Careers</h3>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>Become a supplier</li>
                  <li>Hall of Fame</li>
                  <li>Sitemap</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Legal and Policies</h3>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>Terms & Conditions</li>
                  <li>Privacy Policy</li>
                  <li>Shipping Policy</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Reach out to us</h3>
                <div className="flex space-x-4 mb-4">
                  <Link to="/" className="text-gray-500 hover:text-meesho-pink">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                    </svg>
                  </Link>
                  <Link to="/" className="text-gray-500 hover:text-meesho-pink">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058z"></path>
                    </svg>
                  </Link>
                  <Link to="/" className="text-gray-500 hover:text-meesho-pink">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-meesho-border text-center text-sm text-gray-500">
              <p>© 2023 Meesho | All rights reserved</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default HomePage;
