const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const createError = require("../utils/errorResponse");
const routes = require("../utils/routes");
const {
  StatusCodes,
  SuccessMessages,
  ErrorMessages
} = require("../utils/constants");
const validateSignup = require("../middleware/validateSignup.middleware");

// 사용자 등록
router.post(routes.SIGNUP, validateSignup, async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  const existingUser = await Users.findOne({ where: { email } });

  if (existingUser) {
    return next(
      createError(StatusCodes.CONFLICT, ErrorMessages.ALREADY_REGISTERED)
    );
  }

  const user = await Users.create({
    email,
    password,
    name
  });

  const { password: _, ...userWithoutPassword } = user.get();
  res.status(StatusCodes.OK).json({
    message: SuccessMessages.SIGNUP_SUCCESS,
    data: userWithoutPassword
  });
});

module.exports = router;
