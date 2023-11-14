const { Products } = require("../models");
const createError = require("../utils/errorResponse");
const { StatusCodes, ErrorMessages } = require("../utils/constants");

// 상품 소유자를 확인하는 미들웨어
const checkProductOwner = async (req, res, next) => {
  const id = req.params.productId;
  const userId = res.locals.user.id;
  const product = await Products.findOne({ where: { id, userId } });
  if (!product) {
    return next(
      createError(StatusCodes.FORBIDDEN, ErrorMessages.NO_PRODUCT_ACCESS)
    );
  }
  req.product = product;
  next();
};

module.exports = checkProductOwner;
