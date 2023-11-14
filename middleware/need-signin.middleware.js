const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { StatusCodes, ErrorMessages } = require("../utils/constants");

// 사용자 인증을 처리하는 미들웨어
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessages.MISSING_TOKEN
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      where: { id: decoded.userId }
    });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessages.INVALID_USER
      });
    }

    res.locals.user = user;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessages.TOKEN_EXPIRED
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: ErrorMessages.TOKEN_VERIFICATION_FAILED
      });
    } else {
      next(err);
    }
  }
};

module.exports = authenticate;
