const mongoose = require('mongoose');

const electricityRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  previousReading: {
    type: Number,
    required: true
  },
  currentReading: {
    type: Number,
    required: true
  },
  unitsConsumed: {
    type: Number,
    required: false // Will be calculated by middleware
  },
  ratePerUnit: {
    type: Number,
    required: true,
    default: 8 // Default rate, can be configured
  },
  totalAmount: {
    type: Number,
    required: false // Will be calculated by middleware
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date,
    required: true
  },
  billImage: {
    type: String // Path to uploaded image
  },
  remarks: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate units consumed and total amount
electricityRecordSchema.pre('save', function(next) {
  this.unitsConsumed = this.currentReading - this.previousReading;
  this.totalAmount = this.unitsConsumed * this.ratePerUnit;
  this.updatedAt = Date.now();
  next();
});

// Post-save validation to ensure calculated fields are set
electricityRecordSchema.post('save', function(doc) {
  if (typeof doc.unitsConsumed !== 'number' || typeof doc.totalAmount !== 'number') {
    console.error('Calculated fields not set properly:', {
      unitsConsumed: doc.unitsConsumed,
      totalAmount: doc.totalAmount
    });
  }
});

module.exports = mongoose.model('ElectricityRecord', electricityRecordSchema); 