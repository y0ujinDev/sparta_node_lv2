const { Products } = require("../models");
const createError = require("../utils/errorResponse");
const { StatusCodes, ErrorMessages } = require("../utils/constants");

const checkProductExistence = async (req, res, next) => {
  const product = await Products.findOne({
    where: { id: req.params.productId },
    include: ["user"]
  });

  if (!product) {
    return next(
      createError(StatusCodes.NOT_FOUND, ErrorMessages.PRODUCT_NOT_FOUND)
    );
  }

  req.product = product;
  next();
};

module.exports = checkProductExistence;
