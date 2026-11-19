const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const authorFields = 'firstName lastName';

exports.getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find().sort({ dateTime: -1 }).populate('userId', authorFields);
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', authorFields);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'An image file is required' });
    const photo = await Photo.create({
      userId: req.user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description,
    });
    await photo.populate('userId', authorFields);
    res.status(201).json(photo);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (!photo.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'You can only delete your own photos' });
    }
    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    fs.unlink(path.join(uploadsDir, photo.fileName), () => {});
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
