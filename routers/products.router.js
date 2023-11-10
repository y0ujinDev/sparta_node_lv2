const express = require("express");
const router = express.Router();
const { Products } = require("../models");

// 상품 목록 조회
router.get("/products", async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: ["id", "title", "author", "status", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ data: products });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "서버 내부 오류가 발생하였습니다." });
  }
});

// 상품 상세 조회
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await Products.findOne({
      where: { id: req.params.productId },
      attributes: [
        "title",
        "author",
        "content",
        "status",
        "createdAt",
      ],
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "상품 조회에 실패하였습니다." });
    }
    res.status(200).json({ data: product });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "서버 내부 오류가 발생하였습니다." });
  }
});

// 상품 등록
router.post("/products", async (req, res) => {
  const { title, content, author, password } = req.body;
  if (!title || !content || !author || !password) {
    return res
      .status(400)
      .json({ message: "데이터 형식이 올바르지 않습니다." });
  }
  try {
    await Products.create({ title, content, author, password });
    res.json({ message: "판매 상품을 등록하였습니다." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "서버 내부 오류가 발생하였습니다." });
  }
});

module.exports = router;
