import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductHistory,
  updateHistoryNote,
} from "../controllers/product.controller.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(createProduct);

router.route("/:id").put(updateProduct).delete(deleteProduct);

// History routes
router.route("/:id/history").get(getProductHistory);
router.route("/history/:historyId/note").put(updateHistoryNote);

export default router;
