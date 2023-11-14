const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const createError = require("../utils/errorResponse");
const {
  verifyToken,
  authenticateUser
} = require("../middleware/auth.middleware");
const routes = require("../utils/routes");
const {
  StatusCodes,
  SuccessMessages,
  ErrorMessages
} = require("../utils/constants");
const { comparePassword } = require("../utils/passwordUtils");

require("dotenv").config();

// 사용자 로그인
router.post(routes.LOGIN, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await handleLogin(email, password);
    const token = generateToken(user.id);

    return res.status(StatusCodes.OK).json({
      message: SuccessMessages.LOGIN_SUCCESS,
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
router.get(
  routes.CURRENT_USER,
  verifyToken,
  authenticateUser,
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { id, email, name } = user;

      res.json({ id, email, name });
    } catch (err) {
      next(err);
    }
  }
);

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
    throw createError(StatusCodes.BAD_REQUEST, ErrorMessages.USER_NOT_FOUND);
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw createError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_PASSWORD);
  }

  return user;
};

module.exports = router;
