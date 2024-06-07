const express = require('express');
const router = express.Router();
const { authenticate, generateToken } = require('../middleware/authMiddleware');
const admin = require('../firebase-admin');

// Route for user registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    const token = generateToken({ uid: userRecord.uid, email: userRecord.email });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route for user login (token verification)
router.post('/login', authenticate, async (req, res) => {
  const user = req.user;

  try {
    const token = generateToken(user);

    res.status(200).json({ message: 'User authenticated successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
