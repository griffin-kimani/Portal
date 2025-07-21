const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  endpoint: {
    type: String,
    required: true,
    unique: true,
    index: true 
  },
  keys: {
    auth: {
      type: String,
      required: true
    },
    p256dh: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true 
});


pushSubscriptionSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Subscription already exists for this endpoint.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
