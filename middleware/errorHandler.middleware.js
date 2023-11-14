const { StatusCodes } = require("../utils/constants");

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR);
  res.json({ error: { message: err.message, stack: err.stack } });
}

module.exports = errorHandler;
