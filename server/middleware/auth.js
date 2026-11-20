const mongoose = require('mongoose');
const User = require('../models/User');

const requireUser = async (req, res, next) => {
  try {
    const id = req.header('x-user-id');
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(401).json({ message: 'Please log in first' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: 'Please log in first' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { requireUser };
