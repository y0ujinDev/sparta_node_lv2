const { Products } = require("../models");
const createError = require("../utils/errorResponse");

const checkProductOwner = async (req, res, next) => {
  const id = req.params.productId;
  const userId = res.locals.user.id;
  const product = await Products.findOne({ where: { id, userId } });
  if (!product) {
    return next(
      createError(403, "해당 상품에 대한 접근 권한이 없습니다.")
    );
  }
  req.product = product;
  next();
};

module.exports = checkProductOwner;
