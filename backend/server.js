const express = require("express");
const cors = require("cors");
const db = require("./mysql");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Inventory Management API is running");
});

// CREATE Product
app.post("/api/products", (req, res) => {
  const { name, quantity, price } = req.body;

  const sql = "INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)";

  db.query(sql, [name, quantity, price], (err, result) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO logs (action, product_id) VALUES (?, ?)",
      ["Product Added", result.insertId]
    );

    res.status(201).json({ id: result.insertId });
  });
});

// READ All Products
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// UPDATE Product Quantity
app.put("/api/products/:id", (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  const sql = "UPDATE products SET quantity = ? WHERE id = ?";

  db.query(sql, [quantity, id], (err, result) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO logs (action, product_id) VALUES (?, ?)",
      ["Quantity Updated", id]
    );

    res.json({ updated: result.affectedRows });
  });
});

// DELETE Product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    db.query(
      "INSERT INTO logs (action, product_id) VALUES (?, ?)",
      ["Product Deleted", id]
    );

    res.json({ deleted: result.affectedRows });
  });
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});