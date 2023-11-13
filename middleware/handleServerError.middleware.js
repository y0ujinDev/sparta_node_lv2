const handleServerError = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "서버 내부 오류가 발생하였습니다.";
  res.status(status).json({ error: { message } });
};

module.exports = handleServerError;
