const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "헤더에 유효한 토큰이 없습니다.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "유효한 사용자가 아닙니다.",
      });
    }

    req.locals = {
      user,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "토큰의 유효기간이 지났습니다.",
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "토큰 검증에 실패하였습니다.",
      });
    }
  }

  res.status(500).json({
    success: false,
    message: "서버 내부 오류입니다.",
  });
};

module.exports = authenticate;
