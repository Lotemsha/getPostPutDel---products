function validateProduct(req, res, next) {
  const { name, price, stock } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  if (price === undefined) {
    return res.status(400).json({ message: "price is required" });
  }

  if (isNaN(price)) {
    return res.status(400).json({ message: "price must be a number" });
  }

  if (price < 0) {
    return res.status(400).json({ message: "price cannot be negative" });
  }

  if (stock !== undefined) {
    if (isNaN(stock)) {
      return res.status(400).json({ message: "stock must be a number" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "stock cannot be negative" });
    }
  }

  next();
}

module.exports = validateProduct;
