const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const createError = require("../utils/errorResponse");
const authenticate = require("../middleware/need-signin.middleware");

const {
  ERR_USER_NOT_FOUND,
  ERR_INVALID_PASSWORD,
  MSG_LOGIN_SUCCESS
} = require("../utils/constants");

require("dotenv").config();

// 사용자 로그인
router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await handleLogin(email, password);
    const token = generateToken(user.id);

    return res.status(200).json({
      message: MSG_LOGIN_SUCCESS,
      data: {
        ...token,
        userId: user.id
      }
    });
  } catch (err) {
    next(err);
  }
});

// 사용자 정보 확인
router.get("/auth/me", authenticate, async (req, res, next) => {
  try {
    const user = res.locals.user;
    const { id, email, name } = user;
    res.json({ id, email, name });
  } catch (err) {
    next(err);
  }
});

const generateToken = userId => {
  const expiresIn = "12h";
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn
  });
  return { accessToken, expiresIn };
};

const handleLogin = async (email, password) => {
  const user = await Users.findOne({ where: { email } });

  if (!user) {
    throw createError(400, ERR_USER_NOT_FOUND);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createError(400, ERR_INVALID_PASSWORD);
  }

  return user;
};

module.exports = router;
