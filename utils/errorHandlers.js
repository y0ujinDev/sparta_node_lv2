const handleError = async (promise, res, next) => {
  try {
    const data = await promise;
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleError };
