const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Helper function to filter products based on query and optional filters
const buildSearchQuery = (query, filters = {}) => {
  const searchQuery = {};

  if (query) {
    query = String(query || '').toLowerCase();

    // Extract price constraints if present in free text
    let maxPrice = Infinity;
    const underPriceMatch = query.match(/under\s+(\d+)/i);
    if (underPriceMatch) {
      maxPrice = parseInt(underPriceMatch[1]);
    }

    if (maxPrice !== Infinity) {
      searchQuery.price = { $lte: maxPrice };
    }

    // Extract category keyword
    const categoriesList = [
      'women ethnic', 'women western', 'men', 'kids', 
      'home & kitchen', 'beauty & health', 'jewellery & accessories',
      'bags & footwear', 'electronics'
    ];

    for (const cat of categoriesList) {
      if (query.includes(cat.toLowerCase())) {
        searchQuery.category = { $regex: new RegExp(cat, 'i') };
        break;
      }
    }

    // Free-text terms
    const searchTerms = query
      .replace(/under\s+\d+/i, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (searchTerms.length > 0) {
      const textSearchConditions = searchTerms.map(term => ({
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { description: { $regex: term, $options: 'i' } },
          { subcategory: { $regex: term, $options: 'i' } },
          { tags: { $in: [new RegExp(term, 'i')] } }
        ]
      }));
      if (textSearchConditions.length > 0) {
        searchQuery.$and = textSearchConditions;
      }
    }
  }

  // Structured filters (override/add)
  if (filters.category) {
    searchQuery.category = { $regex: new RegExp(String(filters.category), 'i') };
  }
  if (filters.subcategory) {
    searchQuery.subcategory = { $regex: new RegExp(String(filters.subcategory), 'i') };
  }
  if (Array.isArray(filters.tags) && filters.tags.length > 0) {
    searchQuery.tags = { $all: filters.tags.map(t => new RegExp(String(t), 'i')) };
  }
  if (filters.priceRange && (filters.priceRange.min || filters.priceRange.max)) {
    searchQuery.price = {
      ...(filters.priceRange.min ? { $gte: Number(filters.priceRange.min) } : {}),
      ...(filters.priceRange.max ? { $lte: Number(filters.priceRange.max) } : {})
    };
  }

  return searchQuery;
};

// Search endpoint with pagination
router.post('/', async (req, res) => {
  try {
    const { query, page = 1, limit = 20, category, subcategory, tags, priceRange } = req.body;
    console.log('Search query received:', query);
    
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build MongoDB query based on search terms + filters
    const searchQuery = buildSearchQuery(query, { category, subcategory, tags, priceRange });
    
    // Count total
    const total = await Product.countDocuments(searchQuery);

    // Find products with stable sort
    const products = await Product.find(searchQuery)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limitNum);
    
    res.json({
      success: true,
      query,
      products,
      page: pageNum,
      pages: Math.max(Math.ceil(total / limitNum), 1),
      total,
      limit: limitNum
    });
  } catch (error) {
    console.error('Error in search endpoint:', error);
    
    // Return empty results if database is not available
    res.json({
      success: true,
      query,
      products: [],
      page: 1,
      pages: 1,
      total: 0,
      limit: limitNum || 20,
      message: 'Database temporarily unavailable. Please try again later.'
    });
  }
});

module.exports = router;