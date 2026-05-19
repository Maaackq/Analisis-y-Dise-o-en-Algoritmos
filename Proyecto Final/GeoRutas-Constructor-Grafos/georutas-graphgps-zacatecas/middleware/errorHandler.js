function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const payload = {
    ok: false,
    message: statusCode === 500 ? 'Error interno del servidor.' : error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    payload.debug = error.message;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
