import Product from "../models/Product.js";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, importPrice, sellPrice, importQuantity, soldQuantity } =
      req.body;

    // Validate số lượng bán <= số lượng nhập
    if (soldQuantity > importQuantity) {
      return res.status(400).json({
        success: false,
        message: "Số lượng bán không được vượt quá số lượng nhập",
      });
    }

    const product = await Product.create({
      name,
      importPrice,
      sellPrice,
      importQuantity,
      soldQuantity: soldQuantity || 0,
    });

    // Cảnh báo nếu bán lỗ
    const warning =
      sellPrice < importPrice
        ? "Cảnh báo: Giá bán thấp hơn giá nhập, sản phẩm này sẽ lỗ!"
        : null;

    res.status(201).json({
      success: true,
      warning,
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, importPrice, sellPrice, importQuantity, soldQuantity } =
      req.body;

    // Validate số lượng bán <= số lượng nhập
    if (soldQuantity > importQuantity) {
      return res.status(400).json({
        success: false,
        message: "Số lượng bán không được vượt quá số lượng nhập",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, importPrice, sellPrice, importQuantity, soldQuantity },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Cảnh báo nếu bán lỗ
    const warning =
      sellPrice < importPrice
        ? "Cảnh báo: Giá bán thấp hơn giá nhập, sản phẩm này sẽ lỗ!"
        : null;

    res.json({
      success: true,
      warning,
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa sản phẩm",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
