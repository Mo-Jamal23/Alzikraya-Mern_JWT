const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects write routes: expects the header "Authorization: Bearer <token>"
const requireUser = async (req, res, next) => {
  try {
    const [scheme, token] = (req.header('Authorization') || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    // Throws if the signature is wrong or the token has expired
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // "sub" holds the user id; load the user so controllers can use req.user
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Please log in first' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, please log in again' });
    }
    next(err);
  }
};

module.exports = { requireUser };
