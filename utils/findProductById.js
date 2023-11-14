const { Products } = require("../models");

const findProductById = async id => {
  return await Products.findOne({
    where: { id },
    include: ["user"]
  });
};

module.exports = findProductById;
