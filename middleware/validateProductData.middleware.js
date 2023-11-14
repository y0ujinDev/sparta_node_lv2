const createError = require("../utils/errorResponse");
const { StatusCodes, ErrorMessages } = require("../utils/constants");

const validateProductData = (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return next(
      createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_DATA)
    );
  }
  next();
};

module.exports = validateProductData;
