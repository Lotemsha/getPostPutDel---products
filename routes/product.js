const express = require("express");
const router = express.Router();
const dbSingleton = require("../dbSingleton");
const db = dbSingleton.getConnection();
const validateProduct = require("../middlewares/validateProduct");
const validateId = require("../middlewares/validateId");
const checkProductExists = require("../middlewares/checkProductExists");

// get product by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(results[0]);
  });
});

// create new product
router.post("/", validateProduct, (req, res) => {
  const { id, name, price, stock = 0 } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "name and price are required" });
  }

  const insertProduct = () => {
    const query = id
      ? "INSERT INTO products (id, name, price, stock) VALUES (?, ?, ?, ?)"
      : "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";

    const params = id ? [id, name, price, stock] : [name, price, stock];

    db.query(query, params, (err) => {
      if (err) {
        return res.status(400).json({ message: "Database error", error: err });
      }

      res.status(201).json({ message: "Product created successfully" });
    });
  };

  if (id) {
    const checkQuery = "SELECT * FROM products WHERE id = ?";

    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        return res.status(400).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Product with this ID already exists" });
      }

      insertProduct();
    });
  } else {
    insertProduct();
  }
});

// update existing product
router.put(
  "/:id",
  validateId,
  validateProduct,
  checkProductExists,
  (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const updateQuery =
      "UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?";
    db.query(updateQuery, [name, price, stock, id], (err) => {
      if (err) return res.status(500).json({ error: err });
    });
    res.json({ message: "Product updated successfully" });
  }
);

router.delete("/:id", validateId, checkProductExists, (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM products WHERE id = ?";
  db.query(deleteQuery, [id], (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Product deleted successfully" });
  });
});

// get all products
router.get("/", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;