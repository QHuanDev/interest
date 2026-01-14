const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
