const express = require("express");
const router = express.Router();
const { Products } = require("../models");
const authenticate = require("../middleware/need-signin.middleware");
const checkProductOwner = require("../middleware/checkProductOwner.middleware");
const createError = require("../utils/errorResponse");
const { handleError } = require("../utils/errorHandlers");
const routes = require("../utils/routes");
const {
  productAttributes,
  Status,
  StatusCodes,
  SuccessMessages,
  ErrorMessages
} = require("../utils/constants");

// 상품 목록 조회
router.get(routes.PRODUCTS, (req, res, next) => {
  handleError(
    Products.findAll({
      attributes: productAttributes,
      order: [["createdAt", "DESC"]]
    }),
    res,
    next
  );
});

// 상품 상세 조회
router.get(routes.PRODUCT_ID, (req, res, next) => {
  handleError(
    Products.findOne({
      where: { id: req.params.productId },
      attributes: productAttributes
    }),
    res,
    next
  );
});

// 상품 등록
router.post(routes.PRODUCTS, authenticate, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = res.locals.user.id;

    if (!title || !content) {
      return next(
        createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_DATA)
      );
    }

    const product = await Products.create({
      title,
      content,
      userId,
      status: Status.SELLING
    });

    res
      .status(StatusCodes.CREATED)
      .json(createProductResponse(SuccessMessages.PRODUCT_CREATED, product));
  } catch (error) {
    next(error);
  }
});

// 상품 수정
router.put(
  routes.PRODUCT_ID,
  authenticate,
  checkProductOwner,
  async (req, res, next) => {
    try {
      const { title, content, status } = req.body;

      if (status !== Status.SELLING && status !== Status.SOLD) {
        return next(
          createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_STATUS)
        );
      }

      await req.product.update({ title, content, status });

      res.json(
        createProductResponse(SuccessMessages.PRODUCT_UPDATED, req.product)
      );
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제
router.delete(
  routes.PRODUCT_ID,
  authenticate,
  checkProductOwner,
  async (req, res, next) => {
    try {
      await req.product.destroy();

      res.json({ message: SuccessMessages.PRODUCT_DELETED });
    } catch (err) {
      next(err);
    }
  }
);

const createProductResponse = (message, product) => {
  const { id, userId, title, content, status, createdAt, updatedAt } = product;

  let response = { message, product: { id, userId, title, content, status } };

  if (createdAt) response.product.createdAt = createdAt;
  if (updatedAt) response.product.updatedAt = updatedAt;

  return response;
};

module.exports = router;
