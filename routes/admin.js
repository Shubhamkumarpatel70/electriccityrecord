const express = require('express');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const ElectricityRecord = require('../models/ElectricityRecord');

const router = express.Router();

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/records', adminAuth, async (req, res) => {
  try {
    const query = {};
    if (req.query.status) query.paymentStatus = req.query.status;

    const records = await ElectricityRecord.find(query)
      .populate('user', 'name email meterNumber')
      .select('user previousReading currentReading unitsConsumed totalAmount paymentStatus paymentDate dueDate billImage remarks createdAt')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/records/:id/payment', adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'pending' | 'paid' | 'overdue'
    const record = await ElectricityRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    record.paymentStatus = status;
    record.paymentDate = status === 'paid' ? new Date() : undefined;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 