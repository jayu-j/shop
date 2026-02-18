require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const products = [
  // Electronics


  {
    name: 'White Wireless Over-Ear Headphones',
    description: 'Minimalist white wireless headphones with cushioned ear cups and adjustable headband. Clean, modern design for everyday listening.',
    price: 12999,
    image: '/images/product/electronics/pexels-sound-on-3394666.jpg',
    category: 'Electronics',
    stock: 50,
    rating: 4.3,
    numReviews: 234
  },

  // Clothing
  {
    name: 'Green Plaid Three-Piece Suit',
    description: 'Distinguished olive green windowpane check three-piece suit with brown leather accent details. Includes jacket, vest, and trousers.',
    price: 39999,
    image: '/images/product/clothing/pexels-catherine-zhuang-1225716959-23915302.jpg',
    category: 'Clothing',
    stock: 12,
    rating: 4.8,
    numReviews: 47
  },
  {
    name: 'Black Hooded Winter Parka',
    description: 'Heavy-duty black winter parka with insulated hood and button-front closure. Features arm patch detail and multiple pockets.',
    price: 24999,
    image: '/images/product/clothing/pexels-god-picture-369194295-14465197.jpg',
    category: 'Clothing',
    stock: 30,
    rating: 4.6,
    numReviews: 89
  },
  {
    name: 'Black Varsity Letterman Jacket',
    description: 'Classic black varsity jacket with red striped trim and embroidered patches. Features lion crest and collegiate styling.',
    price: 14999,
    image: '/images/product/clothing/pexels-god-picture-369194295-14465203.jpg',
    category: 'Clothing',
    stock: 22,
    rating: 4.4,
    numReviews: 156
  },
  {
    name: 'Retro Arcade Print Blazer',
    description: 'Unique black blazer featuring colorful retro arcade game print with maze pattern and ghost characters. A statement piece for bold fashion.',
    price: 18999,
    image: '/images/product/clothing/pexels-roy-smoothe-3775491-6148385.jpg',
    category: 'Clothing',
    stock: 8,
    rating: 4.2,
    numReviews: 34
  },

  // Books
  {
    name: 'The $100 Startup - Business Book',
    description: 'Bestselling guide to reinventing the way you make a living, do what you love, and create a new future. Perfect for entrepreneurs.',
    price: 1299,
    image: '/images/product/books/pexels-bintimalu-1485653.jpg',
    category: 'Books',
    stock: 100,
    rating: 4.5,
    numReviews: 1250
  },
  {
    name: 'Romantic City Novel with Illustrated Cover',
    description: 'Heartwarming romance novel with beautiful illustrated cover featuring a couple sharing an umbrella in the rain. A charming love story.',
    price: 999,
    image: '/images/product/books/pexels-cerenvisuals-35503511.jpg',
    category: 'Books',
    stock: 65,
    rating: 4.3,
    numReviews: 423
  },
  {
    name: 'Guess How Much I Love You in the Autumn',
    description: 'Beloved children\'s picture book featuring Little Nutbrown Hare playing in autumn leaves. Beautifully illustrated by Anita Jeram.',
    price: 899,
    image: '/images/product/books/pexels-lina-5624371.jpg',
    category: 'Books',
    stock: 80,
    rating: 4.9,
    numReviews: 892
  },
  {
    name: 'Coffee Stories - Illustrated Short Stories',
    description: 'Charming collection of short stories with watercolor illustrations featuring birds, coffee, and cozy moments. Perfect companion for quiet afternoons.',
    price: 1499,
    image: '/images/product/books/pexels-recepcelikphoto-11260349.jpg',
    category: 'Books',
    stock: 45,
    rating: 4.4,
    numReviews: 167
  },
  {
    name: 'The Strength In Our Scars - Poetry Book',
    description: 'Powerful poetry and prose collection with minimalist white cover featuring a striking crack design. Explores healing and resilience.',
    price: 1199,
    image: '/images/product/books/pexels-thought-catalog-317580-2228580.jpg',
    category: 'Books',
    stock: 70,
    rating: 4.6,
    numReviews: 534
  },

  // Home
  {
    name: 'Modern Round Wooden Dining Table Set',
    description: 'Contemporary dining set featuring a round natural wood table with four gray woven-seat chairs. Perfect for modern kitchens.',
    price: 49999,
    image: '/images/product/home/pexels-athenea-codjambassis-rossitto-472760075-26571201.jpg',
    category: 'Home',
    stock: 6,
    rating: 4.5,
    numReviews: 28
  },
  {
    name: 'Yellow Artisan Stand Mixer',
    description: 'Professional-grade stand mixer in sunny yellow color with stainless steel bowl. 10-speed settings for all your baking needs.',
    price: 31999,
    image: '/images/product/home/pexels-david-yohanes-97693-1450903.jpg',
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    numReviews: 445
  },
  {
    name: 'Minimalist Ceramic Vase and Globe Lamp Set',
    description: 'Elegant beige wavy ceramic vase paired with white glass globe table lamp on chrome base. Includes dried palm leaf arrangement.',
    price: 7499,
    image: '/images/product/home/pexels-karola-g-6805422.jpg',
    category: 'Home',
    stock: 20,
    rating: 4.4,
    numReviews: 76
  },
  {
    name: 'Bohemian Home Decor Floating Shelf Collection',
    description: 'Curated collection of boho decor items including crystals, scented candles, woven baskets, and pampas grass. Natural earth tones.',
    price: 20999,
    image: '/images/product/home/pexels-solvej-nielsen-64837698-11051526.jpg',
    category: 'Home',
    stock: 10,
    rating: 4.6,
    numReviews: 62
  },
  {
    name: 'Mint Green Minimalist Desk Clock',
    description: 'Sleek round desk clock with mint green frame and elegant gold hands. Numberless face design for a modern aesthetic.',
    price: 3999,
    image: '/images/product/home/pexels-tara-winstead-7123551.jpg',
    category: 'Home',
    stock: 35,
    rating: 4.3,
    numReviews: 124
  },

  // Sports
  {
    name: 'Football',
    description: 'Traditional pentagon-pattern soccer ball in classic black and white. Durable leather construction for recreational play.',
    price: 2499,
    image: '/images/product/sports/pexels-fecundap6-364308.jpg',
    category: 'Sports',
    stock: 60,
    rating: 4.2,
    numReviews: 312
  },
  {
    name: 'Tennis Ball',
    description: 'High-visibility fluorescent yellow tennis ball with white seam. Regulation size and bounce for all court surfaces.',
    price: 399,
    image: '/images/product/sports/pexels-icon0-226587.jpg',
    category: 'Sports',
    stock: 200,
    rating: 4.5,
    numReviews: 567
  },

  {
    name: 'Tennis Racket with Ball',
    description: 'Vibrant orange tennis racket with black strings and white grip tape. Includes one tennis ball. Great for clay court play.',
    price: 6799,
    image: '/images/product/sports/pexels-pixabay-209977.jpg',
    category: 'Sports',
    stock: 25,
    rating: 4.3,
    numReviews: 98
  },
  {
    name: 'Table Tennis Paddle Set with Ball',
    description: 'Two-paddle table tennis set featuring red and black rubber surfaces with wooden handles. Includes white ping pong ball.',
    price: 1999,
    image: '/images/product/sports/pexels-shvetsa-3846048.jpg',
    category: 'Sports',
    stock: 45,
    rating: 4.1,
    numReviews: 156
  },
  {
    name: 'Cricket Bat',
    description: 'Expertly crafted English Willow cricket bat with large sweet spot. Perfect for professional play.',
    price: 10999,
    image: '/images/product/sports/cricket-bat.jpg',
    category: 'Sports',
    stock: 15,
    rating: 4.6,
    numReviews: 42
  },
  {
    name: 'Refrigerator',
    description: 'Spacious double-door refrigerator with smart cooling technology and energy efficiency. Stainless steel finish.',
    price: 109990,
    image: '/images/product/electronics/refrigerator.jpg',
    category: 'Electronics',
    stock: 5,
    rating: 4.7,
    numReviews: 24
  },
  {
    name: 'Macbook Pro',
    description: 'High-performance laptop with M-series chip, stunning Retina display, and all-day battery life.',
    price: 169900,
    image: '/images/product/electronics/macbook-pro.jpg',
    category: 'Electronics',
    stock: 10,
    rating: 4.9,
    numReviews: 89
  },
  {
    name: 'AirPods 4',
    description: 'Next-generation wireless earbuds with active noise cancellation and personalized spatial audio.',
    price: 14999,
    image: '/images/product/electronics/airpods-4.jpg',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    numReviews: 120
  },
  {
    name: 'iPhone 16',
    description: 'Latest model with advanced camera system, A18 chip, and durable titanium design.',
    price: 79900,
    image: '/images/product/electronics/iphone-16.jpg',
    category: 'Electronics',
    stock: 30,
    rating: 4.8,
    numReviews: 200
  },
  {
    name: 'Boat Speaker',
    description: 'Portable Bluetooth speaker with deep bass and long-lasting battery life. Rugged design for outdoor use.',
    price: 3999,
    image: '/images/product/electronics/boat-speaker.jpg',
    category: 'Electronics',
    stock: 100,
    rating: 4.3,
    numReviews: 350
  },
  {
    name: 'Apple Watch Ultra',
    description: 'Rugged and capable smartwatch designed for endurance athletes and outdoor adventurers.',
    price: 89900,
    image: '/images/product/electronics/apple-watch-ultra.jpg',
    category: 'Electronics',
    stock: 20,
    rating: 4.7,
    numReviews: 65
  },
  {
    name: 'Air Conditioner',
    description: 'Energy-efficient split air conditioner with fast cooling and silent operation.',
    price: 45999,
    image: '/images/product/electronics/air-conditioner.jpg',
    category: 'Electronics',
    stock: 8,
    rating: 4.4,
    numReviews: 15
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight and breathable running shoes with superior cushioning for maximum comfort.',
    price: 7499,
    image: '/images/product/clothing/running-shoes.jpg',
    category: 'Clothing',
    stock: 40,
    rating: 4.5,
    numReviews: 78
  },
  // New Additions

  {
    name: 'Pro Gaming Console',
    description: 'Next-gen gaming console for immersive 4K gaming. Includes wireless controller and 1TB storage.',
    price: 49999,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 15,
    rating: 4.9,
    numReviews: 340
  },
  {
    name: '4K Camera Drone',
    description: 'Professional camera drone with 3-axis gimbal and 30-minute flight time. Perfect for aerial photography.',
    price: 65999,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 8,
    rating: 4.7,
    numReviews: 85
  },
  {
    name: 'Wireless Noise Cancelling Earbuds',
    description: 'Premium true wireless earbuds with active noise cancellation and transparency mode. Deep bass and crystal clear treble.',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 60,
    rating: 4.4,
    numReviews: 210
  },
  {
    name: 'Classic Aviator Sunglasses',
    description: 'Timeless aviator sunglasses with gold frame and green lenses. 100% UV protection.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 100,
    rating: 4.5,
    numReviews: 150
  },
  {
    name: 'Genuine Leather Jacket',
    description: 'Premium brown leather jacket with biker detailing. Soft lambskin leather with satin lining.',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 20,
    rating: 4.8,
    numReviews: 95
  },
  {
    name: 'Urban White Sneakers',
    description: 'Clean and minimalist white sneakers. Comfortable rubber sole and breathable upper material.',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 50,
    rating: 4.3,
    numReviews: 180
  },

  {
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with wooden stands. Perfect for succulents and small indoor plants.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    stock: 75,
    rating: 4.7,
    numReviews: 130
  },
  {
    name: 'Yoga Mat with Strap',
    description: 'Eco-friendly non-slip yoga mat with carrying strap. Extra thick for joint protection.',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 100,
    rating: 4.5,
    numReviews: 300
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Pair of adjustable dumbbells for home workouts. Space-saving design replaces multiple weights.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 25,
    rating: 4.7,
    numReviews: 80
  },
  // Batch 2 Expansion
  // Electronics

  {
    name: 'RGB Mechanical Keyboard',
    description: 'High-performance mechanical gaming keyboard with customizable RGB lighting and tactile switches.',
    price: 4599,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 40,
    rating: 4.6,
    numReviews: 85
  },
  {
    name: 'Precision Gaming Mouse',
    description: 'Ergonomic gaming mouse with high DPI sensor and programmable buttons. Designed for esports professionals.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80',
    category: 'Electronics',
    stock: 60,
    rating: 4.5,
    numReviews: 120
  },
  // Clothing
  {
    name: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket with a vintage wash. A versatile staple for any casual wardrobe.',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1523205565295-f8e91625443b?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 35,
    rating: 4.4,
    numReviews: 90
  },
  {
    name: 'Floral Summer Dress',
    description: 'Lightweight and breezy floral print dress. Perfect for warm summer days and outdoor gatherings.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 50,
    rating: 4.7,
    numReviews: 110
  },
  {
    name: 'Soft Wool Scarf',
    description: 'Luxuriously soft wool scarf in a neutral gray tone. Keeps you warm and stylish in cold weather.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    category: 'Clothing',
    stock: 80,
    rating: 4.6,
    numReviews: 65
  },

  // Books
  {
    name: 'Epic Sci-Fi Saga',
    description: 'A gripping science fiction novel set in a distant galaxy. Explore new worlds and futuristic civilizations.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    category: 'Books',
    stock: 100,
    rating: 4.8,
    numReviews: 95
  },
  {
    name: 'Gourmet Cookbook',
    description: 'Collection of exquisite recipes from top chefs around the world. Master the art of fine dining at home.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    category: 'Books',
    stock: 40,
    rating: 4.9,
    numReviews: 180
  },
  {
    name: 'World History Volume 1',
    description: 'Comprehensive overview of world history from ancient civilizations to the middle ages.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    category: 'Books',
    stock: 55,
    rating: 4.6,
    numReviews: 70
  },

  // Restored Home Items
  {
    name: 'Modern Bedside Lamp',
    description: 'Minimalist bedside lamp with a warm glow. Features a wooden base and fabric shade.',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1513506003013-d531632103f7?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    stock: 45,
    rating: 4.5,
    numReviews: 105
  },
  {
    name: 'Decorative Throw Pillows',
    description: 'Set of 2 geometric pattern throw pillows. Adds a pop of color and comfort to your sofa or bed.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1579656381226-5fc46c9987d3?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    stock: 60,
    rating: 4.3,
    numReviews: 140
  },
  {
    name: 'Personal Smoothie Blender',
    description: 'Compact blender for making healthy smoothies on the go. Includes portable travel bottle.',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80',
    category: 'Home',
    stock: 25,
    rating: 4.7,
    numReviews: 200
  },
  // Restored Sports Items
  {
    name: 'Pro Basketball',
    description: 'Official size and weight basketball with superior grip. Indoor/outdoor versatility.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 75,
    rating: 4.7,
    numReviews: 310
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with varying difficulty levels. Perfect for strength training and physical therapy.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1517438476312-d99c51f94911?auto=format&fit=crop&w=600&q=80',
    category: 'Sports',
    stock: 90,
    rating: 4.5,
    numReviews: 250
  }
];

const adminUser = {
  name: 'Admin',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    await User.create(adminUser);
    console.log('Admin user created');

    // Insert products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
