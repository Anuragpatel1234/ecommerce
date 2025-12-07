const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: "MANISHYA KARAM PANTS",
    description: "Elegant traditional pants crafted with premium fabric and intricate detailing. Perfect for festive occasions and cultural celebrations.",
    price: 2295,
    originalPrice: 2995,
    category: "TRADITIONAL OUTFIT",
    images: ["img/64daf4c38576b7864fb170228f26c2fc.jpg"],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["Black", "Navy", "Maroon"],
    material: "Cotton Silk",
    careInstructions: "Dry clean only",
    inStock: true,
    featured: true,
    bestseller: true,
    newArrival: false,
    onSale: true,
    rating: 4.5,
    reviews: []
  },
  {
    name: "ROYAL LEHENGA SET",
    description: "Stunning lehenga set with heavy embroidery work and mirror detailing. Comes with matching choli and dupatta.",
    price: 8999,
    originalPrice: 12999,
    category: "LEHENGAS",
    images: ["img/Untitled-4.webp"],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 4 }
    ],
    colors: ["Red", "Pink", "Gold"],
    material: "Silk with Zardozi work",
    careInstructions: "Dry clean only",
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    onSale: true,
    rating: 4.8,
    reviews: []
  },
  {
    name: "DESIGNER BLOUSE",
    description: "Contemporary designer blouse with modern cut and traditional embellishments. Perfect pairing for sarees and lehengas.",
    price: 1899,
    category: "BLOUSES",
    images: ["img/0952.webp"],
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 18 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 10 }
    ],
    colors: ["White", "Cream", "Gold"],
    material: "Silk",
    careInstructions: "Hand wash or dry clean",
    inStock: true,
    featured: false,
    bestseller: true,
    newArrival: false,
    onSale: false,
    rating: 4.3,
    reviews: []
  },
  {
    name: "BANARASI DUPATTA",
    description: "Authentic Banarasi dupatta with traditional motifs and gold thread work. A timeless piece for your ethnic collection.",
    price: 3499,
    category: "DUPATTA",
    images: ["img/dupatta1.webp"],
    sizes: [
      { size: "One Size", stock: 20 }
    ],
    colors: ["Red", "Green", "Purple"],
    material: "Pure Silk",
    careInstructions: "Dry clean only",
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    onSale: false,
    rating: 4.6,
    reviews: []
  },
  {
    name: "FLARED ETHNIC SKIRT",
    description: "Beautiful flared skirt with traditional prints and comfortable fit. Perfect for casual ethnic wear.",
    price: 1599,
    originalPrice: 1999,
    category: "SKIRTS",
    images: ["img/SKIRTS1.jpg"],
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 18 },
      { size: "XL", stock: 12 }
    ],
    colors: ["Blue", "Green", "Yellow"],
    material: "Cotton",
    careInstructions: "Machine wash cold",
    inStock: true,
    featured: false,
    bestseller: true,
    newArrival: false,
    onSale: true,
    rating: 4.2,
    reviews: []
  },
  {
    name: "KIDS LEHENGA SET",
    description: "Adorable lehenga set for little princesses. Comfortable fabric with beautiful embroidery work.",
    price: 2499,
    category: "KIDS OUTFITS",
    images: ["img/kids lehenga set.webp"],
    sizes: [
      { size: "2-3 Years", stock: 8 },
      { size: "4-5 Years", stock: 10 },
      { size: "6-7 Years", stock: 12 },
      { size: "8-9 Years", stock: 8 }
    ],
    colors: ["Pink", "Purple", "Blue"],
    material: "Cotton Silk",
    careInstructions: "Hand wash gently",
    inStock: true,
    featured: true,
    bestseller: false,
    newArrival: true,
    onSale: false,
    rating: 4.7,
    reviews: []
  },
  {
    name: "EMBROIDERED KURTA SET",
    description: "Elegant kurta set with intricate embroidery and comfortable palazzo pants. Perfect for festive occasions.",
    price: 3299,
    category: "TRADITIONAL OUTFIT",
    images: ["img/traditional outfit 2.webp"],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 8 }
    ],
    colors: ["White", "Cream", "Light Pink"],
    material: "Cotton Silk",
    careInstructions: "Dry clean recommended",
    inStock: true,
    featured: false,
    bestseller: true,
    newArrival: false,
    onSale: false,
    rating: 4.4,
    reviews: []
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rangaara', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    // Create test user if it doesn't exist
    const testUserEmail = 'test@rangaara.com';
    let testUser = await User.findOne({ email: testUserEmail });
    
    if (!testUser) {
      testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: testUserEmail,
        password: 'test123' // Will be hashed automatically by the User model
      });
      await testUser.save();
      console.log('Test user created successfully');
      console.log('Test Login Credentials:');
      console.log('Email: test@rangaara.com');
      console.log('Password: test123');
    } else {
      console.log('Test user already exists');
      console.log('Test Login Credentials:');
      console.log('Email: test@rangaara.com');
      console.log('Password: test123');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();