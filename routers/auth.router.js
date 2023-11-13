const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const createError = require("../utils/errorResponse");

router.post("/auth/signup", async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email) {
    return next(createError(400, "이메일 입력이 필요합니다."));
  }

  const existingUser = await Users.findOne({ where: { email } });

  if (existingUser) {
    return next(createError(409, "이미 가입 된 이메일입니다."));
  }

  if (password !== passwordConfirm) {
    return next(createError(400, "비밀번호가 일치하지 않습니다."));
  }

  const user = await Users.create({
    email,
    password,
    name
  });

  const { password: _, ...userWithoutPassword } = user.get();
  res.status(200).json({
    message: "회원가입에 성공했습니다.",
    data: userWithoutPassword
  });
});

module.exports = router;
