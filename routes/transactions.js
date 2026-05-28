const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Transfer money
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { recipientAccountNumber, amount, description } = req.body;

    // Validate input
    if (!recipientAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid recipient account and amount' });
    }

    // Get sender
    const sender = await User.findById(req.userId);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Check balance
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Get recipient
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Prevent self-transfer
    if (sender._id.toString() === recipient._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    // Create transaction
    const transaction = new Transaction({
      fromUser: sender._id,
      toUser: recipient._id,
      amount,
      description,
      status: 'completed',
      transactionType: 'transfer'
    });

    // Update balances
    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();
    await transaction.save();

    res.json({
      message: 'Transfer successful',
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        from: sender.username,
        to: recipient.username,
        status: transaction.status,
        createdAt: transaction.createdAt
      },
      senderBalance: sender.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
});

// Get transaction history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromUser: req.userId },
        { toUser: req.userId }
      ]
    })
    .populate('fromUser', 'username email accountNumber')
    .populate('toUser', 'username email accountNumber')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      message: 'Transaction history retrieved',
      count: transactions.length,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

// Get transaction by ID
router.get('/:transactionId', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.transactionId })
      .populate('fromUser', 'username email accountNumber')
      .populate('toUser', 'username email accountNumber');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction', error: error.message });
  }
});

// Request money
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { fromAccountNumber, amount, description } = req.body;

    if (!fromAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide valid account and amount' });
    }

    const requester = await User.findById(req.userId);
    const payer = await User.findOne({ accountNumber: fromAccountNumber });

    if (!payer) {
      return res.status(404).json({ message: 'Payer not found' });
    }

    // Create pending transaction request
    const transaction = new Transaction({
      fromUser: payer._id,
      toUser: requester._id,
      amount,
      description: description || 'Payment request',
      status: 'pending',
      transactionType: 'receive'
    });

    await transaction.save();

    res.json({
      message: 'Payment request sent',
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        from: payer.username,
        to: requester.username,
        status: transaction.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

module.exports = router;
