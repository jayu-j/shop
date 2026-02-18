const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  activityType: {
    type: String,
    enum: ['view', 'cart_add', 'purchase', 'wishlist'],
    required: true
  },
  category: {
    type: String
  },
  price: {
    type: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userActivitySchema.index({ user: 1, activityType: 1, timestamp: -1 });
userActivitySchema.index({ product: 1, activityType: 1 });

// Static method to record activity
userActivitySchema.statics.recordActivity = async function(userId, productId, activityType, productData = {}) {
  try {
    await this.create({
      user: userId,
      product: productId,
      activityType,
      category: productData.category,
      price: productData.price
    });
  } catch (error) {
    console.error('Error recording activity:', error);
  }
};

// Static method to get user's viewed products
userActivitySchema.statics.getUserViews = async function(userId, limit = 10) {
  return this.find({ user: userId, activityType: 'view' })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('product');
};

// Static method to get user's purchased products
userActivitySchema.statics.getUserPurchases = async function(userId) {
  return this.find({ user: userId, activityType: 'purchase' })
    .populate('product');
};

// Static method to get products frequently bought together
userActivitySchema.statics.getFrequentlyBoughtTogether = async function(productId, limit = 5) {
  // Find users who purchased this product
  const purchasers = await this.distinct('user', { 
    product: productId, 
    activityType: 'purchase' 
  });

  if (purchasers.length === 0) return [];

  // Find other products these users purchased
  const relatedPurchases = await this.aggregate([
    {
      $match: {
        user: { $in: purchasers },
        product: { $ne: mongoose.Types.ObjectId(productId) },
        activityType: 'purchase'
      }
    },
    {
      $group: {
        _id: '$product',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);

  return relatedPurchases.map(p => p._id);
};

module.exports = mongoose.model('UserActivity', userActivitySchema);
