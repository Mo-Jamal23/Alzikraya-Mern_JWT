const fs = require('fs');
const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(72).required(),
  location: Joi.string().trim().max(100).allow(''),
  description: Joi.string().max(500).allow(''),
  occupation: Joi.string().trim().max(100).allow(''),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().max(1000).allow(''),
});

const commentSchema = Joi.object({
  comment: Joi.string().trim().min(1).max(1000).required(),
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.details.map((d) => d.message.replaceAll('"', '')),
    });
  }
  req.body = value;
  next();
};

module.exports = { validate, registerSchema, loginSchema, photoSchema, commentSchema };
