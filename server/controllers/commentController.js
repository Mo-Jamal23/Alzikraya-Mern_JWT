const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

exports.getForPhoto = async (req, res, next) => {
  try {
    if (!(await Photo.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const comments = await Comment.find({ photoId: req.params.id })
      .sort({ dateTime: 1 })
      .populate('userId', 'firstName lastName');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (!(await Photo.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const comment = await Comment.create({
      photoId: req.params.id,
      userId: req.user._id,
      comment: req.body.comment,
    });
    await comment.populate('userId', 'firstName lastName');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
