const Joi = require('joi');

const brandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
  foundedYear: Joi.number().integer().min(1900).max(2100).required(),
  website: Joi.string().uri().required(),
  headquarters: Joi.string().min(2).max(120).required(),
  warrantyYears: Joi.number().integer().min(0).max(15).required(),
  makesEbike: Joi.boolean().default(false)
}).options({ stripUnknown: true });

function validateBody(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) return next(error);
    req.validated = value;
    next();
  };
}

module.exports = { brandSchema, validateBody };
