const express = require("express");
const router = express.Router();
const { Products } = require("../models");
const authenticate = require("../middleware/need-signin.middleware");
const checkProductOwner = require("../middleware/checkProductOwner.middleware");
const createError = require("../utils/errorResponse");
const { handleError } = require("../utils/errorHandlers");

const {
  productAttributes,
  Status,
  ERR_INVALID_DATA,
  ERR_INVALID_STATUS,
  MSG_PRODUCT_CREATED,
  MSG_PRODUCT_UPDATED,
  MSG_PRODUCT_DELETED
} = require("../utils/constants");

// 상품 목록 조회
router.get("/products", (req, res, next) => {
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
router.get("/products/:productId", (req, res, next) => {
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
router.post("/products", authenticate, async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = res.locals.user.id;
    if (!title || !content) {
      return next(createError(400, ERR_INVALID_DATA));
    }
    const product = await Products.create({
      title,
      content,
      userId,
      status: Status.SELLING
    });
    res.status(201).json(createProductResponse(MSG_PRODUCT_CREATED, product));
  } catch (error) {
    next(error);
  }
});

// 상품 수정
router.put(
  "/products/:productId",
  authenticate,
  checkProductOwner,
  async (req, res, next) => {
    try {
      const { title, content, status } = req.body;
      if (status !== Status.SELLING && status !== Status.SOLD) {
        return next(createError(400, ERR_INVALID_STATUS));
      }
      await req.product.update({ title, content, status });
      res.json(createProductResponse(MSG_PRODUCT_UPDATED, req.product));
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제
router.delete(
  "/products/:productId",
  authenticate,
  checkProductOwner,
  async (req, res, next) => {
    try {
      await req.product.destroy();
      res.json({ message: MSG_PRODUCT_DELETED });
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
