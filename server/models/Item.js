const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
     type: String,
     required: [true, 'Title is required'], 
     trim: true
     },
    description: { 
     type: String, 
     required: [true, 'Description is required'] 
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Documents', 'Accessories', 'Bags', 'Keys', 'Clothing', 'Other'],
    },
    type: { 
      type: String, 
      required: true, 
      enum: ['Lost', 'Found'] 
    },
    location: { 
      type: String, 
      required: [true, 'Location is required'], 
      trim: true 
    },
    date: { 
     type: Date, 
     required: [true, 'Date is required'] 
    },
    image: { 
      type: String, 
      default: null 
    },
    status: {
      type: String,
      enum: ['Active', 'Claimed', 'Resolved'],
      default: 'Active',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);