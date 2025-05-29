const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); 


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).send("Server Error");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid Product ID format" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
