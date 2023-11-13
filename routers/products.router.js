const express = require("express");
const router = express.Router();
const { Products } = require("../models");
const authenticate = require("../middleware/need-signin.middleware");
const checkProductOwner = require("../middleware/checkProductOwner.middleware");
const createError = require("../utils/errorResponse");

// 상품 목록 조회
router.get("/products", async (req, res, next) => {
  try {
    const products = await Products.findAll({
      attributes: [
        "id",
        "userId",
        "title",
        "content",
        "status",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
});

// 상품 상세 조회
router.get("/products/:productId", async (req, res, next) => {
  try {
    const product = await Products.findOne({
      where: { id: req.params.productId },
      attributes: [
        "id",
        "userId",
        "title",
        "content",
        "status",
        "createdAt",
      ],
    });
    if (!product) {
      throw createError(404, "상품 조회에 실패하였습니다.");
    }
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
});

// 상품 등록
router.post("/products", authenticate, async (req, res, next) => {
  const { title, content } = req.body;
  const userId = res.locals.user.id;
  if (!title || !content) {
    return next(createError(400, "데이터 형식이 올바르지 않습니다."));
  }
  try {
    const product = await Products.create({ title, content, userId });
    const { id, status, createdAt } = product;
    res.status(201).json({
      message: "판매 상품을 등록하였습니다.",
      product: { id, userId, title, content, status, createdAt },
    });
  } catch (err) {
    next(err);
  }
});

// 상품 수정
router.put(
  "/products/:productId",
  authenticate,
  checkProductOwner,
  async (req, res, next) => {
    const { title, content, status } = req.body;
    try {
      await req.product.update({ title, content, status });
      const { id, userId, updatedAt } = req.product;
      res.json({
        message: "상품을 수정하였습니다.",
        product: { id, userId, title, content, status, updatedAt },
      });
    } catch (err) {
      next(err);
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
      res.json({ message: "상품을 삭제하였습니다." });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
