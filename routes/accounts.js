const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get account details
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account', error: error.message });
  }
});

// Update account details
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, phoneNumber, address },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Account updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating account', error: error.message });
  }
});

// Add balance (admin function - for demo purposes)
router.post('/add-balance', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { balance: amount } },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Balance added successfully',
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding balance', error: error.message });
  }
});

// Get user by account number
router.get('/search/:accountNumber', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.params.accountNumber }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error searching user', error: error.message });
  }
});

module.exports = router;
