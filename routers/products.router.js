const express = require("express");
const router = express.Router();
const { Products, Users } = require("../models");
const {
  verifyToken,
  authenticateUser
} = require("../middleware/auth.middleware");
const checkProductOwner = require("../middleware/checkProductOwner.middleware");
const validateProductData = require("../middleware/validateProductData.middleware");
const createError = require("../utils/errorResponse");
const checkProductExistence = require("../middleware/checkProductExistence.middleware");
const routes = require("../utils/routes");
const findProductById = require("../utils/findProductById");
const transformProduct = require("../utils/transformProduct");
const {
  productAttributes,
  Status,
  StatusCodes,
  SuccessMessages,
  ErrorMessages
} = require("../utils/constants");

// 상품 목록 조회
router.get(routes.PRODUCTS, async (req, res, next) => {
  try {
    const products = await Products.findAll({
      ...queryOptions,
      order: [["createdAt", "DESC"]]
    });

    if (!products || products.length === 0) {
      res.json({
        message: ErrorMessages.PRODUCT_NOT_FOUND,
        products: []
      });
    } else {
      const result = products.map(product =>
        transformProduct(product, "", false)
      );

      res.json(result);
    }
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회
router.get(routes.PRODUCT_ID, checkProductExistence, async (req, res, next) => {
  try {
    res.json(transformProduct(req.product, "", false));
  } catch (err) {
    next(err);
  }
});

// 상품 등록
router.post(
  routes.PRODUCTS,
  verifyToken,
  authenticateUser,
  validateProductData,
  async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const userId = res.locals.user.id;

      const createdProduct = await Products.create({
        title,
        content,
        userId,
        status: Status.SELLING
      });

      const product = await findProductById(createdProduct.id);

      res
        .status(StatusCodes.CREATED)
        .json(transformProduct(product, SuccessMessages.PRODUCT_CREATED));
    } catch (error) {
      next(error);
    }
  }
);

// 상품 수정
router.put(
  routes.PRODUCT_ID,
  verifyToken,
  authenticateUser,
  checkProductExistence,
  checkProductOwner,
  validateProductData,
  async (req, res, next) => {
    try {
      const { title, content, status } = req.body;

      if (status && status !== Status.SELLING && status !== Status.SOLD) {
        return next(
          createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_STATUS)
        );
      }

      await req.product.update({
        title,
        content,
        status: status || Status.SELLING
      });

      const updatedProduct = await findProductById(req.product.id);

      res.json(
        transformProduct(updatedProduct, SuccessMessages.PRODUCT_UPDATED, false)
      );
    } catch (error) {
      next(error);
    }
  }
);

// 상품 삭제
router.delete(
  routes.PRODUCT_ID,
  verifyToken,
  authenticateUser,
  checkProductExistence,
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

const queryOptions = {
  attributes: productAttributes,
  include: [
    {
      model: Users,
      as: "user",
      attributes: ["name"]
    }
  ]
};

module.exports = router;
