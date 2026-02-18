const express = require('express');
const Product = require('../models/Product');
const UserActivity = require('../models/UserActivity');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: Calculate similarity score between products
const calculateSimilarity = (product1, product2) => {
  let score = 0;
  
  // Same category: +40 points
  if (product1.category === product2.category) score += 40;
  
  // Similar price range (within 30%): +30 points
  const priceDiff = Math.abs(product1.price - product2.price);
  const avgPrice = (product1.price + product2.price) / 2;
  if (priceDiff / avgPrice <= 0.3) score += 30;
  else if (priceDiff / avgPrice <= 0.5) score += 15;
  
  // Similar rating (within 1 star): +20 points
  const ratingDiff = Math.abs(product1.rating - product2.rating);
  if (ratingDiff <= 1) score += 20;
  
  // Boost for highly rated products
  if (product2.rating >= 4.5) score += 10;
  
  return score;
};

// @route   GET /api/recommendations/personalized
// @desc    Get personalized recommendations for logged-in user
// @access  Private
router.get('/personalized', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 8;

    // Get user's activity history
    const [viewedActivities, purchasedActivities] = await Promise.all([
      UserActivity.find({ user: userId, activityType: 'view' })
        .sort({ timestamp: -1 })
        .limit(20)
        .populate('product'),
      UserActivity.find({ user: userId, activityType: 'purchase' })
        .populate('product')
    ]);

    // Extract categories and price ranges from user history
    const viewedProducts = viewedActivities.map(a => a.product).filter(p => p);
    const purchasedProducts = purchasedActivities.map(a => a.product).filter(p => p);
    
    const userCategories = {};
    const priceRange = { min: Infinity, max: 0 };
    
    [...viewedProducts, ...purchasedProducts].forEach(product => {
      if (product) {
        userCategories[product.category] = (userCategories[product.category] || 0) + 1;
        priceRange.min = Math.min(priceRange.min, product.price);
        priceRange.max = Math.max(priceRange.max, product.price);
      }
    });

    // Get user's interacted product IDs to exclude
    const excludeIds = [...new Set([
      ...viewedProducts.map(p => p._id.toString()),
      ...purchasedProducts.map(p => p._id.toString())
    ])];

    // Sort categories by interest
    const sortedCategories = Object.entries(userCategories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);

    // Build recommendation query
    let recommendations = [];

    if (sortedCategories.length > 0) {
      // Content-based: Get products from user's preferred categories
      const categoryProducts = await Product.find({
        _id: { $nin: excludeIds },
        category: { $in: sortedCategories.slice(0, 3) }
      })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit * 2);

      // Score and rank products
      const scoredProducts = categoryProducts.map(product => {
        let score = 0;
        
        // Category preference score
        const categoryIndex = sortedCategories.indexOf(product.category);
        score += (sortedCategories.length - categoryIndex) * 10;
        
        // Price range score
        if (priceRange.min !== Infinity) {
          const expandedMin = priceRange.min * 0.5;
          const expandedMax = priceRange.max * 1.5;
          if (product.price >= expandedMin && product.price <= expandedMax) {
            score += 20;
          }
        }
        
        // Rating and popularity boost
        score += product.rating * 5;
        score += Math.min(product.numReviews / 10, 20);

        return { product, score };
      });

      recommendations = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.product);
    }

    // If not enough recommendations, fill with top-rated products
    if (recommendations.length < limit) {
      const topRated = await Product.find({
        _id: { $nin: [...excludeIds, ...recommendations.map(p => p._id)] }
      })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit - recommendations.length);
      
      recommendations = [...recommendations, ...topRated];
    }

    res.json({
      type: 'personalized',
      products: recommendations,
      basedOn: sortedCategories.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/similar/:productId
// @desc    Get similar products (content-based filtering)
// @access  Public
router.get('/similar/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get products in same category
    const candidates = await Product.find({
      _id: { $ne: productId },
      $or: [
        { category: product.category },
        { 
          price: { 
            $gte: product.price * 0.5, 
            $lte: product.price * 1.5 
          } 
        }
      ]
    }).limit(50);

    // Score by similarity
    const scoredProducts = candidates.map(candidate => ({
      product: candidate,
      score: calculateSimilarity(product, candidate)
    }));

    const similar = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);

    res.json({
      type: 'similar',
      baseProduct: product.name,
      products: similar
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/frequently-bought/:productId
// @desc    Get products frequently bought together
// @access  Public
router.get('/frequently-bought/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    // Get orders containing this product
    const orders = await Order.find({
      'items.product': productId
    }).select('items');

    // Count co-purchased products
    const coProducts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.toString() !== productId) {
          coProducts[item.product] = (coProducts[item.product] || 0) + 1;
        }
      });
    });

    // Sort by frequency
    const sortedProducts = Object.entries(coProducts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    let products = [];
    if (sortedProducts.length > 0) {
      products = await Product.find({ _id: { $in: sortedProducts } });
    }

    // If not enough, get products from same category
    if (products.length < limit) {
      const product = await Product.findById(productId);
      if (product) {
        const categoryProducts = await Product.find({
          _id: { $nin: [productId, ...products.map(p => p._id)] },
          category: product.category
        })
          .sort({ rating: -1 })
          .limit(limit - products.length);
        
        products = [...products, ...categoryProducts];
      }
    }

    res.json({
      type: 'frequently-bought-together',
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/trending
// @desc    Get trending products based on recent activity
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const daysAgo = 7;
    const dateThreshold = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Aggregate recent activities
    const trending = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: dateThreshold }
        }
      },
      {
        $group: {
          _id: '$product',
          viewCount: {
            $sum: { $cond: [{ $eq: ['$activityType', 'view'] }, 1, 0] }
          },
          cartCount: {
            $sum: { $cond: [{ $eq: ['$activityType', 'cart_add'] }, 2, 0] }
          },
          purchaseCount: {
            $sum: { $cond: [{ $eq: ['$activityType', 'purchase'] }, 5, 0] }
          }
        }
      },
      {
        $addFields: {
          trendScore: { $add: ['$viewCount', '$cartCount', '$purchaseCount'] }
        }
      },
      { $sort: { trendScore: -1 } },
      { $limit: limit }
    ]);

    let products = [];
    if (trending.length > 0) {
      const productIds = trending.map(t => t._id);
      products = await Product.find({ _id: { $in: productIds } });
      
      // Sort products by trending score
      const scoreMap = {};
      trending.forEach(t => { scoreMap[t._id.toString()] = t.trendScore; });
      products.sort((a, b) => (scoreMap[b._id.toString()] || 0) - (scoreMap[a._id.toString()] || 0));
    }

    // If not enough trending, fill with top rated
    if (products.length < limit) {
      const topRated = await Product.find({
        _id: { $nin: products.map(p => p._id) }
      })
        .sort({ rating: -1, numReviews: -1 })
        .limit(limit - products.length);
      
      products = [...products, ...topRated];
    }

    res.json({
      type: 'trending',
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/recommendations/for-you
// @desc    Get recommendations for homepage (works for guests too)
// @access  Public
router.get('/for-you', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    // Get mix of top-rated and new products
    const [topRated, newest] = await Promise.all([
      Product.find({})
        .sort({ rating: -1, numReviews: -1 })
        .limit(Math.ceil(limit / 2)),
      Product.find({})
        .sort({ createdAt: -1 })
        .limit(Math.ceil(limit / 2))
    ]);

    // Merge and deduplicate
    const seen = new Set();
    const products = [];
    
    [...topRated, ...newest].forEach(product => {
      if (!seen.has(product._id.toString()) && products.length < limit) {
        seen.add(product._id.toString());
        products.push(product);
      }
    });

    res.json({
      type: 'for-you',
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/recommendations/track
// @desc    Track user activity for recommendations
// @access  Private
router.post('/track', protect, async (req, res) => {
  try {
    const { productId, activityType } = req.body;

    if (!['view', 'cart_add', 'wishlist'].includes(activityType)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await UserActivity.recordActivity(
      req.user._id,
      productId,
      activityType,
      { category: product.category, price: product.price }
    );

    res.json({ message: 'Activity tracked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
