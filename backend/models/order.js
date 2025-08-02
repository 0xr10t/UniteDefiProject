const mongoose = require('mongoose');

// Define the schema for the nested 'order' object
const nestedOrderSchema = new mongoose.Schema({
  salt:         { type: String, required: true },
  maker:        { type: String, required: true },
  receiver:     { type: String, required: true },
  makerAsset:   { type: String, required: true },
  takerAsset:   { type: String, required: true },
  makingAmount: { type: String, required: true },
  takingAmount: { type: String, required: true },
  makerTraits:  { type: String, required: true },
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for the sub-document

// Define the main schema for the entire document in the 'orders' collection
const mainOrderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'filled', 'withdrawn', 'cancelled', 'expired'], // Enforce allowed values
    default: 'pending',
  },
  secretHash: {
    type: String,
    required: true,
    unique: true, // Creates a unique index to prevent duplicate orders and speed up lookups
    index: true,
  },
  srcChainId: { type: Number, required: true },
  dstChainId: { type: Number, required: true },
  order: {
    type: nestedOrderSchema,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
}, {
  // Automatically add createdAt and updatedAt timestamps
  timestamps: true,
});

// Create the model from the schema. Mongoose will create a collection named 'orders' (plural, lowercase)
const Order = mongoose.model('Order', mainOrderSchema);

module.exports = Order;
