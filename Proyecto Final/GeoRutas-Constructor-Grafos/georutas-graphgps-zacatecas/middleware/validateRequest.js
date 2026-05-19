const AppError = require('../utils/AppError');

function requireFields(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
    if (missing.length > 0) {
      next(new AppError('Faltan campos obligatorios.', 422, { missing }));
      return;
    }
    next();
  };
}

module.exports = { requireFields };
