const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const createError = require("../utils/errorResponse");

require("dotenv").config();

router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await handleLogin(email, password);
    const token = generateToken(user.id);

    return res.status(200).json({
      message: "로그인에 성공했습니다.",
      data: {
        ...token,
        userId: user.id,
      },
    });
  } catch (err) {
    next(err);
  }
});

const generateToken = (userId) => {
  const expiresIn = "12h";
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });
  return { accessToken, expiresIn };
};

const handleLogin = async (email, password) => {
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    throw createError(
      400,
      "해당 이메일을 가진 사용자를 찾을 수 없습니다."
    );
  }

  const isValidPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw createError(400, "비밀번호가 일치하지 않습니다.");
  }

  return user;
};

module.exports = router;
