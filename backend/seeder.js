const mongoose = require('mongoose');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

// Mock data from our previous implementation
const mockProductsDatabase = [
  // Women's Ethnic Wear
  {
    title: 'Elegant Navratri Chaniya Choli',
    price: 2499,
    description: 'Traditional Gujarati style Chaniya Choli with mirror work, perfect for Navratri celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1623500409236-8dafcbf8b4d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Chaniya Choli',
    tags: ['navratri', 'festival', 'traditional', 'mirror work', 'gujarati']
  },
  {
    title: 'Embroidered Navratri Lehenga',
    price: 2899,
    description: 'Beautifully embroidered lehenga with sequin work, suitable for garba nights.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Lehengas',
    tags: ['navratri', 'embroidered', 'sequin', 'garba', 'festival']
  },
  {
    title: 'Cotton Navratri Special Dress',
    price: 1999,
    description: 'Comfortable cotton dress with traditional prints, ideal for day events during Navratri.',
    imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Dresses',
    tags: ['navratri', 'cotton', 'comfortable', 'day wear', 'printed']
  },
  {
    title: 'Designer Navratri Outfit',
    price: 2750,
    description: 'Designer outfit with modern touch, perfect for special Navratri occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469668-c4da5b2d07c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Designer Wear',
    tags: ['navratri', 'designer', 'modern', 'special occasion']
  },
  {
    title: 'Traditional Navratri Saree',
    price: 2199,
    description: 'Elegant saree with traditional design, suitable for Navratri functions.',
    imageUrl: 'https://images.unsplash.com/photo-1602424977084-d680a7e384e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Sarees',
    tags: ['navratri', 'saree', 'traditional', 'elegant', 'function wear']
  },
  {
    title: 'Budget Navratri Dress',
    price: 1499,
    description: 'Affordable yet stylish dress for Navratri celebrations.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Dresses',
    tags: ['navratri', 'budget', 'affordable', 'stylish']
  },
  {
    title: 'Stylish Banarasi Silk Saree',
    price: 3499,
    description: 'Handwoven Banarasi silk saree with rich gold zari work for weddings and special occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469668-c4da5b2d07c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Sarees',
    tags: ['silk', 'banarasi', 'wedding', 'zari', 'handwoven']
  },
  {
    title: 'Casual Daily Wear Kurti',
    price: 499,
    description: 'Comfortable cotton kurti for everyday wear with simple embroidery.',
    imageUrl: 'https://images.unsplash.com/photo-1602424977084-d680a7e384e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Kurtis',
    tags: ['daily wear', 'casual', 'cotton', 'comfortable', 'embroidered', 'under 500']
  },
  {
    title: 'Anarkali Suit Set',
    price: 1899,
    description: 'Elegant Anarkali suit set with dupatta, perfect for festive occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Suits',
    tags: ['anarkali', 'suit set', 'festive', 'elegant', 'under 2000']
  },
  {
    title: 'Printed Palazzo Set',
    price: 799,
    description: 'Comfortable printed kurti with matching palazzo pants for casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1623500409236-8dafcbf8b4d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Ethnic',
    subcategory: 'Palazzo Sets',
    tags: ['printed', 'palazzo', 'set', 'casual', 'comfortable', 'under 1000']
  },
  
  // Women's Western Wear
  {
    title: 'Casual Denim Jeans',
    price: 899,
    description: 'Comfortable high-waist denim jeans for everyday casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Western',
    subcategory: 'Jeans',
    tags: ['denim', 'casual', 'high-waist', 'everyday', 'under 1000']
  },
  {
    title: 'Stylish Crop Top',
    price: 399,
    description: 'Trendy crop top for casual outings and parties.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Western',
    subcategory: 'Tops',
    tags: ['crop top', 'trendy', 'casual', 'party wear', 'under 500']
  },
  {
    title: 'Floral Summer Dress',
    price: 699,
    description: 'Light and airy floral printed dress perfect for summer outings.',
    imageUrl: 'https://images.unsplash.com/photo-1623500409236-8dafcbf8b4d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Western',
    subcategory: 'Dresses',
    tags: ['floral', 'summer', 'light', 'printed', 'under 1000']
  },
  {
    title: 'Office Wear Formal Shirt',
    price: 599,
    description: 'Crisp formal shirt for professional office wear.',
    imageUrl: 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Western',
    subcategory: 'Shirts',
    tags: ['formal', 'office', 'professional', 'crisp', 'under 1000']
  },
  {
    title: 'Trendy Jumpsuit',
    price: 1299,
    description: 'Stylish jumpsuit for casual and semi-formal occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Women Western',
    subcategory: 'Jumpsuits',
    tags: ['jumpsuit', 'trendy', 'casual', 'semi-formal', 'under 1500']
  },
  
  // Men's Wear
  {
    title: 'Casual Cotton T-shirt',
    price: 299,
    description: 'Comfortable cotton t-shirt for everyday casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Men',
    subcategory: 'T-shirts',
    tags: ['cotton', 'casual', 'everyday', 'comfortable', 'under 300']
  },
  {
    title: 'Formal Office Shirt',
    price: 799,
    description: 'Crisp formal shirt for professional office wear.',
    imageUrl: 'https://images.unsplash.com/photo-1563630423918-b58f07336ac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Men',
    subcategory: 'Shirts',
    tags: ['formal', 'office', 'professional', 'crisp', 'under 1000']
  },
  {
    title: 'Slim Fit Denim Jeans',
    price: 999,
    description: 'Stylish slim fit denim jeans for casual outings.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Men',
    subcategory: 'Jeans',
    tags: ['denim', 'slim fit', 'casual', 'stylish', 'under 1000']
  },
  {
    title: 'Ethnic Kurta Pajama Set',
    price: 1499,
    description: 'Traditional kurta pajama set for festivals and special occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Men',
    subcategory: 'Ethnic Wear',
    tags: ['ethnic', 'kurta', 'traditional', 'festival', 'under 1500']
  },
  {
    title: 'Casual Hooded Sweatshirt',
    price: 699,
    description: 'Comfortable hooded sweatshirt for winter casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Men',
    subcategory: 'Sweatshirts',
    tags: ['hooded', 'winter', 'casual', 'comfortable', 'under 1000']
  },
  
  // Kids Wear
  {
    title: 'Girls Party Dress',
    price: 899,
    description: 'Beautiful party dress for little girls with bow detailing.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Kids',
    subcategory: 'Girls Dresses',
    tags: ['party', 'dress', 'girls', 'bow', 'under 1000']
  },
  {
    title: 'Boys Casual T-shirt',
    price: 299,
    description: 'Comfortable cotton t-shirt for boys everyday wear.',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Kids',
    subcategory: 'Boys T-shirts',
    tags: ['casual', 't-shirt', 'boys', 'cotton', 'under 300']
  },
  {
    title: 'Kids School Uniform Set',
    price: 799,
    description: 'Complete school uniform set for kids with shirt and pants/skirt.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Kids',
    subcategory: 'School Uniforms',
    tags: ['school', 'uniform', 'kids', 'set', 'under 1000']
  },
  
  // Home & Kitchen
  {
    title: 'Stainless Steel Cookware Set',
    price: 2499,
    description: 'Complete stainless steel cookware set with 5 pieces for everyday cooking.',
    imageUrl: 'https://images.unsplash.com/photo-1584990347449-716dc7a30b07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Home & Kitchen',
    subcategory: 'Cookware',
    tags: ['stainless steel', 'cookware', 'set', 'kitchen', 'under 3000']
  },
  {
    title: 'Decorative Cushion Covers',
    price: 299,
    description: 'Set of 5 decorative cushion covers with different patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Home & Kitchen',
    subcategory: 'Home Decor',
    tags: ['cushion', 'covers', 'decorative', 'patterns', 'under 500']
  },
  
  // Beauty & Health
  {
    title: 'Herbal Skincare Set',
    price: 899,
    description: 'Complete herbal skincare set with face wash, toner, and moisturizer.',
    imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Beauty & Health',
    subcategory: 'Skincare',
    tags: ['herbal', 'skincare', 'set', 'face', 'under 1000']
  },
  {
    title: 'Hair Care Combo',
    price: 599,
    description: 'Hair care combo with shampoo, conditioner, and hair oil.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Beauty & Health',
    subcategory: 'Hair Care',
    tags: ['hair', 'care', 'combo', 'shampoo', 'under 1000']
  },
  
  // Jewellery & Accessories
  {
    title: 'Traditional Jhumka Earrings',
    price: 499,
    description: 'Beautiful traditional jhumka earrings for festive occasions.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Jewellery & Accessories',
    subcategory: 'Earrings',
    tags: ['jhumka', 'traditional', 'earrings', 'festive', 'under 500']
  },
  {
    title: 'Stylish Watch for Men',
    price: 1299,
    description: 'Elegant watch for men with metal strap and analog display.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Jewellery & Accessories',
    subcategory: 'Watches',
    tags: ['watch', 'men', 'elegant', 'analog', 'under 1500']
  },
  
  // Bags & Footwear
  {
    title: 'Casual Sneakers',
    price: 799,
    description: 'Comfortable casual sneakers for everyday wear.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Bags & Footwear',
    subcategory: 'Footwear',
    tags: ['sneakers', 'casual', 'comfortable', 'everyday', 'under 1000']
  },
  {
    title: 'Women\'s Handbag',
    price: 699,
    description: 'Stylish handbag for women with multiple compartments.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Bags & Footwear',
    subcategory: 'Bags',
    tags: ['handbag', 'women', 'stylish', 'compartments', 'under 1000']
  },
  
  // Electronics
  {
    title: 'Wireless Bluetooth Earphones',
    price: 999,
    description: 'High-quality wireless bluetooth earphones with noise cancellation.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Electronics',
    subcategory: 'Audio',
    tags: ['wireless', 'bluetooth', 'earphones', 'noise cancellation', 'under 1000']
  },
  {
    title: 'Mobile Phone Cover',
    price: 299,
    description: 'Durable mobile phone cover with attractive design.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    category: 'Electronics',
    subcategory: 'Mobile Accessories',
    tags: ['mobile', 'cover', 'durable', 'design', 'under 300']
  }
];

// Sample users data
const usersData = [
  {
    name: 'Test User',
    phone: '9876543210',
    email: 'test@example.com',
    password: 'password123',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    }
  },
  {
    name: 'Admin User',
    phone: '9876543211',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true
  }
];

// Categories data
const categoriesData = [
  {
    name: 'Women Ethnic',
    image: 'https://images.meesho.com/images/marketing/1649760442043.webp',
    order: 1
  },
  {
    name: 'Women Western',
    image: 'https://images.meesho.com/images/marketing/1649760423313.webp',
    order: 2
  },
  {
    name: 'Men',
    image: 'https://images.meesho.com/images/marketing/1649760808952.webp',
    order: 3
  },
  {
    name: 'Kids',
    image: 'https://images.meesho.com/images/marketing/1649760786763.webp',
    order: 4
  },
  {
    name: 'Home & Kitchen',
    image: 'https://images.meesho.com/images/marketing/1649760599511.webp',
    order: 5
  },
  {
    name: 'Beauty & Health',
    image: 'https://images.meesho.com/images/marketing/1649760557045.webp',
    order: 6
  }
];

// Function to import data to DB
const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('Existing products, categories, and users deleted');
    
    // Insert new data
    await Category.insertMany(categoriesData);
    console.log('Categories imported successfully');
    
    await Product.insertMany(mockProductsDatabase);
    console.log('Products imported successfully');
    
    // Create users with hashed passwords
    const createdUsers = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );
    console.log('Users imported successfully');
    console.log(`Admin user created: ${createdUsers[1].name} (${createdUsers[1].email})`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('All products, categories, and users deleted');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
