const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const ElectricityRecord = require('../models/ElectricityRecord');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/mine', auth, async (req, res) => {
  try {
    console.log('GET /mine - User:', req.user._id);
    const records = await ElectricityRecord.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    console.log('Records found:', records.length);
    res.json(records);
  } catch (err) {
    console.error('Error in /mine:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/last', auth, async (req, res) => {
  try {
    console.log('GET /last - User:', req.user._id);
    const last = await ElectricityRecord.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });
    console.log('Last record:', last ? last._id : 'none');
    res.json(last || null);
  } catch (err) {
    console.error('Error in /last:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post(
  '/',
  auth,
  upload.single('billImage'),
  [
    body('currentReading').isFloat({ min: 0 }),
    body('dueDate').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('POST / - Request body:', req.body);
      console.log('POST / - File:', req.file);
      
      const last = await ElectricityRecord.findOne({ user: req.user._id })
        .sort({ createdAt: -1 });

      const previousReading = last ? last.currentReading : Number(req.body.previousReading || 0);
      const currentReading = Number(req.body.currentReading);
      const ratePerUnit = Number(req.body.ratePerUnit || 8);

      console.log('POST / - Calculated values:', {
        previousReading,
        currentReading,
        ratePerUnit,
        lastRecord: last ? last._id : 'none'
      });

      if (currentReading < previousReading) {
        return res.status(400).json({ message: 'Current reading cannot be less than previous reading' });
      }

      const recordData = {
        user: req.user._id,
        meterNumber: req.user.meterNumber,
        previousReading,
        currentReading,
        ratePerUnit,
        dueDate: new Date(req.body.dueDate),
        billImage: req.file ? `/uploads/${req.file.filename}` : undefined,
        remarks: req.body.remarks || ''
      };

      console.log('POST / - Record data to save:', recordData);

      const record = new ElectricityRecord(recordData);

      await record.save();
      console.log('POST / - Record saved successfully:', record._id);
      res.status(201).json(record);
    } catch (err) {
      console.error('Error in POST /:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

module.exports = router; 