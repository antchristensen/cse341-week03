const Joi = require('joi');

// Mountain Bike schema — at least 7 fields
const bikeSchema = Joi.object({
  brand: Joi.string().min(1).max(100).required(),
  model: Joi.string().min(1).max(120).required(),
  year: Joi.number().integer().min(1990).max(2100).required(),
  frameSize: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL').required(),
  wheelSize: Joi.number().valid(26, 27.5, 29).required(),
  suspensionType: Joi.string().valid('hardtail', 'full-suspension').required(),
  drivetrain: Joi.string().min(2).max(40).required(), // e.g., "1x12 SRAM SX"
  brakeType: Joi.string().valid('hydraulic-disc', 'mechanical-disc', 'rim').required(),
  weightKg: Joi.number().min(5).max(30).required(),
  priceUSD: Joi.number().precision(2).min(0).required(),
  inStock: Joi.boolean().default(true)
}).options({ stripUnknown: true });

function validateBody(schema) {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) return next(error);
    req.validated = value; // sanitized inputs
    next();
  };
}

module.exports = { bikeSchema, validateBody };
