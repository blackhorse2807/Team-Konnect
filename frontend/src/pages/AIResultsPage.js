import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';

const AIResultsPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get query from URL params or state
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || location.state?.query || 'red shirt with stripes and blue jeans';
    setQuery(q);
    
    // Simulate AI processing
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [location]);

  const mockCombinations = [
    {
      id: 1,
      title: "Casual Weekend Look",
      description: "Perfect for a relaxed day out",
      mannequinImage: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=400&fit=crop",
      products: [
        {
          name: "Red Striped Cotton Shirt",
          price: "₹899",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop"
        },
        {
          name: "Classic Blue Denim Jeans",
          price: "₹1,299",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop"
        }
      ],
      totalPrice: "₹2,198",
      confidence: 95
    },
    {
      id: 2,
      title: "Smart Casual Style",
      description: "Great for casual meetings or dates",
      mannequinImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      products: [
        {
          name: "Red Checked Formal Shirt",
          price: "₹1,199",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop"
        },
        {
          name: "Slim Fit Blue Jeans",
          price: "₹1,599",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop"
        }
      ],
      totalPrice: "₹2,798",
      confidence: 88
    },
    {
      id: 3,
      title: "Trendy Urban Look",
      description: "Stay stylish in the city",
      mannequinImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
      products: [
        {
          name: "Red Striped Polo Shirt",
          price: "₹799",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop"
        },
        {
          name: "Distressed Blue Jeans",
          price: "₹1,899",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=150&fit=crop"
        }
      ],
      totalPrice: "₹2,698",
      confidence: 82
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Fashion Stylist is Working...</h2>
                <p className="text-gray-600 mb-4">Analyzing your request: "<span className="font-semibold text-purple-600">{query}</span>"</p>
              </div>
              
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Searching product database...</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Matching colors and styles...</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-700">Creating outfit combinations...</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-500">Rendering on mannequins...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link to="/" className="text-purple-600 hover:text-purple-800 mr-4">
                ← Back to Home
              </Link>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">AI Fashion Stylist Results</h1>
              <p className="text-purple-100 mb-4">Your search: "<span className="font-semibold">{query}</span>"</p>
              <div className="flex items-center">
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm mr-4">
                  🤖 AI Powered
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  3 Perfect Combinations Found
                </div>
              </div>
            </div>
          </div>

          {/* AI Results */}
          <div className="grid gap-8">
            {mockCombinations.map((combo) => (
              <div key={combo.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{combo.title}</h3>
                      <p className="text-gray-600">{combo.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {combo.confidence}% Match
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Mannequin Display */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-4 text-center relative overflow-hidden">
                        <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                          Virtual Try-On
                        </div>
                        <img 
                          src={combo.mannequinImage} 
                          alt="Mannequin wearing outfit"
                          className="w-full h-80 object-cover rounded-lg"
                        />
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Complete Look</p>
                          <p className="text-lg font-bold text-purple-600">{combo.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {combo.products.map((product, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                <p className="text-lg font-bold text-purple-600">{product.price}</p>
                                <div className="flex space-x-2 mt-2">
                                  <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors">
                                    Add to Cart
                                  </button>
                                  <button className="px-3 py-1 border border-purple-600 text-purple-600 text-sm rounded hover:bg-purple-50 transition-colors">
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">Complete Outfit</h4>
                            <p className="text-sm text-gray-600">All items in this combination</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-purple-600">{combo.totalPrice}</p>
                            <button className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                              Add Complete Outfit to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Features Showcase */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🚀 Coming Soon: Advanced AI Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Virtual Try-On</h3>
                <p className="text-sm text-purple-100">See how clothes look on you with AR technology</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 1v16a1 1 0 001 1h8a1 1 0 001-1V5H7z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Size Prediction</h3>
                <p className="text-sm text-purple-100">AI predicts your perfect size for every brand</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Style Learning</h3>
                <p className="text-sm text-purple-100">AI learns your preferences for better recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResultsPage;

