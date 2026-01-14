import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").put(updateProduct).delete(deleteProduct);

export default router;
