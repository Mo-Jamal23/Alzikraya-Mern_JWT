const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Creates a signed token; the payload only carries the user id ("sub"), never the password
const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /api/auth/register: hash the password, save the user, return token + profile
exports.register = async (req, res, next) => {
  try {
    const { password, ...profile } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ ...profile, password: hash });
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login: compare with the stored bcrypt hash, return token + profile
exports.login = async (req, res, next) => {
  try {
    // password is excluded from queries by default, so select it explicitly
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(req.body.password, user.password));
    // Same message for unknown email and wrong password so accounts cannot be probed
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};
