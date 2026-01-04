//Lotem Sharir , Ameed Halabi

const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();

function checkProductExists(req, res, next) {
  const { id } = req.params;

  const query = "SELECT * FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    req.product = results[0];

    next();
  });
}

module.exports = checkProductExists;

