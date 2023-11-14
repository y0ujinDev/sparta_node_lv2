const moment = require("moment");

const transformProduct = (
  product,
  message = null,
  includeCreatedAt = false
) => {
  const { id, title, content, status, user } = product.get();
  const transformedProduct = {
    id,
    title,
    name: user.name,
    content,
    status,
    updatedAt: moment(product.updatedAt).format("YYYY-MM-DD HH:mm:ss")
  };
  if (includeCreatedAt) {
    transformedProduct.createdAt = moment(product.createdAt).format(
      "YYYY-MM-DD HH:mm:ss"
    );
  }
  return message
    ? { message, product: transformedProduct }
    : { product: transformedProduct };
};

module.exports = transformProduct;
