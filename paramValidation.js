const { Joi } = require('express-validation');

module.exports = {
  // POST /api/shop
  postShop: {
    body: Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
      phone: Joi.string().required(),
      leader: Joi.string().required(),
      note: Joi.string(),
      tag: Joi.string().required(),
    }),
  },
  putShop: {
    body: Joi.object({
      _id: Joi.string().required(),
      name: Joi.string(),
      address: Joi.string(),
      phone: Joi.string(),
      leader: Joi.string(),
      note: Joi.string(),
      tag: Joi.string(),
    }),
  },
  postTag: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
  putTag: {
    body: Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
    }),
  },
};