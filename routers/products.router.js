const express = require("express");
const router = express.Router();
const { Products } = require("../models");
const authenticate = require("../middleware/need-signin.middleware");
const checkProductOwner = require("../middleware/checkProductOwner.middleware");
const createError = require("../utils/errorResponse");
const { handleError } = require("../utils/errorHandlers");

const productAttributes = [
  "id",
  "userId",
  "title",
  "content",
  "status",
  "createdAt",
  "updatedAt"
];

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
router.post("/products", authenticate, (req, res, next) => {
  const { title, content } = req.body;
  const userId = res.locals.user.id;
  if (!title || !content) {
    return next(createError(400, "데이터 형식이 올바르지 않습니다."));
  }
  handleError(
    Products.create({ title, content, userId }),
    res,
    next,
    "판매 상품을 등록하였습니다."
  );
});

// 상품 수정
router.put(
  "/products/:productId",
  authenticate,
  checkProductOwner,
  (req, res, next) => {
    const { title, content, status } = req.body;
    handleError(
      req.product.update({ title, content, status }),
      res,
      next,
      "상품을 수정하였습니다."
    );
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
      res.json({ message: "상품을 삭제하였습니다." });
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
