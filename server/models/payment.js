const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    memberNameSnapshot: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    periodCovered: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);