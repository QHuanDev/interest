import mongoose from "mongoose";

const productHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    changeType: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    previousValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    note: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh theo productId
productHistorySchema.index({ productId: 1, createdAt: -1 });

export default mongoose.model("productHistory", productHistorySchema);
