const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 
const Order = require('./models/order'); 
const app = express();


app.use(cors()); // Allow cross-origin requests from your frontend
app.use(express.json()); // Allow the server to parse JSON request bodies

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Connection error', err));


app.post('/orders', async (req, res) => {
  try {
    const { order, signature, extension, srcChainId, dstChainId } = req.body;

    if (!order || !signature || !extension || !srcChainId || !dstChainId) {
      return res.status(400).json({ error: 'Missing required order data.' });
    }

    // Create a new document using the Order model
    const newOrder = new Order({
      secretHash: extension, // This is the secretHash from the frontend
      srcChainId: srcChainId,
      dstChainId: dstChainId,
      order: order,       // The entire nested order object
      signature: signature,
    });

    // Save the document to the database
    const savedOrder = await newOrder.save();

    console.log('New order received and stored:', savedOrder._id);
    res.status(201).json(savedOrder);

  } catch (error) {
    // Handle the specific error for a duplicate unique key (secretHash)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An order with this secret hash already exists.' });
    }
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// Endpoint for Resolvers to GET pending orders
app.get('/orders', async (req, res) => {
  try {
    // Find all documents where the status is 'pending'
    const pendingOrders = await Order.find({ status: 'pending' })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Relayer server listening on port ${PORT}`);
});