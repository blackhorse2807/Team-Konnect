import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, searchQuery }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center mt-10 py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meesho-pink"></div>
        <p className="mt-4 text-sm text-gray-500">Finding products for you...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 py-16">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 className="mt-4 text-lg font-medium text-meesho-darkgray">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">Try a different search query or browse categories</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchQuery && (
        <div className="mb-4">
          <h2 className="text-lg font-medium text-meesho-darkgray">
            Search results for "{searchQuery}"
          </h2>
          <p className="text-sm text-gray-500">
            {products.length} products found
          </p>
        </div>
      )}
      
      {/* Filter options */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-meesho-border">
        <div className="flex items-center gap-4">
          <button className="flex items-center text-sm text-meesho-darkgray">
            <span>Sort by:</span>
            <span className="ml-1 font-medium">Relevance</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <button className="flex items-center text-sm text-meesho-darkgray">
            <span>Filter</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-1.5 border border-meesho-border rounded">
            <svg className="w-4 h-4 text-meesho-darkgray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </button>
          <button className="p-1.5 border border-meesho-pink bg-meesho-lightpink rounded">
            <svg className="w-4 h-4 text-meesho-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
