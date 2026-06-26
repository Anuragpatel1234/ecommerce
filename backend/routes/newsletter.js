const express = require('express');
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    let subscription = await Newsletter.findOne({ email });
    
    if (subscription) {
      if (subscription.subscribed) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        subscription.subscribed = true;
        await subscription.save();
        return res.json({ message: 'Successfully resubscribed to newsletter' });
      }
    }

    subscription = new Newsletter({ email });
    await subscription.save();

    res.json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const subscription = await Newsletter.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Email not found in newsletter' });
    }

    subscription.subscribed = false;
    await subscription.save();

    res.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;