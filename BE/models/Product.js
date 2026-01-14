import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["product", "material"],
      default: "product",
    },
    importPrice: {
      type: Number,
      required: [true, "Vui lòng nhập giá nhập"],
      min: [0, "Giá nhập không được âm"],
    },
    sellPrice: {
      type: Number,
      required: [true, "Vui lòng nhập giá bán"],
      min: [0, "Giá bán không được âm"],
    },
    importQuantity: {
      type: Number,
      required: [true, "Vui lòng nhập số lượng nhập"],
      min: [0, "Số lượng nhập không được âm"],
    },
    soldQuantity: {
      type: Number,
      required: [true, "Vui lòng nhập số lượng bán"],
      min: [0, "Số lượng bán không được âm"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: Doanh thu = giá bán × số lượng bán
productSchema.virtual("revenue").get(function () {
  return this.sellPrice * this.soldQuantity;
});

// Virtual: Chi phí = giá nhập × số lượng bán
productSchema.virtual("cost").get(function () {
  return this.importPrice * this.soldQuantity;
});

// Virtual: Lợi nhuận = doanh thu - chi phí
productSchema.virtual("profit").get(function () {
  return this.revenue - this.cost;
});

// Virtual: Kiểm tra có lỗ không
productSchema.virtual("isLoss").get(function () {
  return this.sellPrice < this.importPrice;
});

// Validation: số lượng bán không được vượt quá số lượng nhập
productSchema.pre("save", function (next) {
  if (this.soldQuantity > this.importQuantity) {
    const error = new Error("Số lượng bán không được vượt quá số lượng nhập");
    error.name = "ValidationError";
    return next(error);
  }
  next();
});

export default mongoose.model("product", productSchema);
