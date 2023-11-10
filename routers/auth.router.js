const express = require("express");
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const router = express.Router();

router.post("/auth/signup", async (req, res) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "이메일 입력이 필요합니다.",
    });
  }

  const existingUser = await Users.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "이미 가입 된 이메일입니다.",
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      success: false,
      message: "비밀번호가 일치하지 않습니다.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await Users.create({
    email,
    password: hashedPassword,
    name,
  });

  const { password: _, ...userWithoutPassword } = user.get();
  res.status(200).json({
    success: true,
    message: "회원가입에 성공했습니다.",
    data: {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
    },
  });
});

module.exports = router;
