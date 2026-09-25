const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    item: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Item', required: true 
    },
    claimant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    message: {
      type: String,
      required: [true, 'A message describing why you are claiming this item is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);