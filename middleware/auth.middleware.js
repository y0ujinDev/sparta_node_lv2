const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { StatusCodes, ErrorMessages } = require("../utils/constants");

/// 토큰 유효성 검사
const verifyToken = (req, res, next) => {
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

    res.locals.decoded = decoded;

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

// 사용자 유효성 검사
const authenticateUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: { id: res.locals.decoded.userId }
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
    next(err);
  }
};

module.exports = {
  verifyToken,
  authenticateUser
};
