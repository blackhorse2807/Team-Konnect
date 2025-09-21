const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories with fallback
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Fallback categories if database is not available
    const fallbackCategories = [
      {
        _id: 'fallback-women',
        name: 'Women',
        image: 'https://images.meesho.com/images/marketing/1649760442043.webp',
        order: 1
      },
      {
        _id: 'fallback-home',
        name: 'Home Decor',
        image: 'https://images.meesho.com/images/marketing/1649760557045.webp',
        order: 2
      }
    ];
    
    res.json(fallbackCategories);
  }
});

module.exports = router;
