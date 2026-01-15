import Product from "../models/Product.js";
import ProductHistory from "../models/ProductHistory.js";

// Helper: Tạo bản ghi lịch sử
const createHistoryRecord = async (
  productId,
  changeType,
  previousValues,
  newValues,
  note = null
) => {
  try {
    await ProductHistory.create({
      productId,
      changeType,
      previousValues,
      newValues,
      note,
    });
  } catch (error) {
    console.error("Error creating history record:", error);
  }
};

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
    const { name, type, importPrice, sellPrice, importQuantity, soldQuantity } =
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
      type: type || "product",
      importPrice,
      sellPrice,
      importQuantity,
      soldQuantity: soldQuantity || 0,
    });

    // Tạo lịch sử cho hành động tạo mới
    await createHistoryRecord(
      product._id,
      "create",
      null,
      {
        name,
        type: type || "product",
        importPrice,
        sellPrice,
        importQuantity,
        soldQuantity: soldQuantity || 0,
      },
      "Tạo sản phẩm mới"
    );

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
    const {
      name,
      type,
      importPrice,
      sellPrice,
      importQuantity,
      soldQuantity,
      note,
    } = req.body;

    // Validate số lượng bán <= số lượng nhập
    if (soldQuantity > importQuantity) {
      return res.status(400).json({
        success: false,
        message: "Số lượng bán không được vượt quá số lượng nhập",
      });
    }

    // Lấy giá trị cũ trước khi update
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const previousValues = {
      name: oldProduct.name,
      type: oldProduct.type,
      importPrice: oldProduct.importPrice,
      sellPrice: oldProduct.sellPrice,
      importQuantity: oldProduct.importQuantity,
      soldQuantity: oldProduct.soldQuantity,
    };

    const product = await Product.findByIdAndUpdate(
      id,
      { name, type, importPrice, sellPrice, importQuantity, soldQuantity },
      { new: true, runValidators: true }
    );

    // Tạo lịch sử cho hành động cập nhật
    await createHistoryRecord(
      id,
      "update",
      previousValues,
      { name, type, importPrice, sellPrice, importQuantity, soldQuantity },
      note || null
    );

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
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Tạo lịch sử trước khi xóa
    await createHistoryRecord(
      id,
      "delete",
      {
        name: product.name,
        type: product.type,
        importPrice: product.importPrice,
        sellPrice: product.sellPrice,
        importQuantity: product.importQuantity,
        soldQuantity: product.soldQuantity,
      },
      null,
      "Xóa sản phẩm"
    );

    await Product.findByIdAndDelete(id);

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

// Lấy lịch sử cập nhật của sản phẩm
export const getProductHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await ProductHistory.find({ productId: id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật ghi chú của lịch sử
export const updateHistoryNote = async (req, res) => {
  try {
    const { historyId } = req.params;
    const { note } = req.body;

    const history = await ProductHistory.findByIdAndUpdate(
      historyId,
      { note },
      { new: true }
    );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi lịch sử",
      });
    }

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
