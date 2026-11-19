const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { password, ...profile } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ ...profile, password: hash });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(req.body.password, user.password));
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};
