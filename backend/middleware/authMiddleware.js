const jwt = require('jsonwebtoken');
const admin = require('../firebase-admin');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

const generateToken = async (user) => {
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { authenticate, generateToken };
