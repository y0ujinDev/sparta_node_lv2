const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const createError = require("../utils/errorResponse");

const {
  ERR_MISSING_EMAIL,
  ERR_ALREADY_REGISTERED,
  ERR_PASSWORD_MISMATCH,
  MSG_SIGNUP_SUCCESS
} = require("../utils/constants");

router.post("/auth/signup", async (req, res, next) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email) {
    return next(createError(400, ERR_MISSING_EMAIL));
  }

  const existingUser = await Users.findOne({ where: { email } });

  if (existingUser) {
    return next(createError(409, ERR_ALREADY_REGISTERED));
  }

  if (password !== passwordConfirm) {
    return next(createError(400, ERR_PASSWORD_MISMATCH));
  }

  const user = await Users.create({
    email,
    password,
    name
  });

  const { password: _, ...userWithoutPassword } = user.get();
  res.status(200).json({
    message: MSG_SIGNUP_SUCCESS,
    data: userWithoutPassword
  });
});

module.exports = router;
