import React, { useEffect, useState, useMemo } from "react";
import { Calculator, Package, Plus, RefreshCw, ServerOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Product, ProductInput } from "./types";
import { productService } from "./services/productService";
import { StatsCard } from "./components/StatsCard";
import { ProductForm } from "./components/ProductForm";
import { ProductTable } from "./components/ProductTable";
import { MaterialTable } from "./components/MaterialTable";
import { SimpleCalculator } from "./components/SimpleCalculator";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await productService.getAll();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("API connection error:", error);
      setIsError(true);
      setErrorMessage(
        "Không thể kết nối đến máy chủ (localhost:5000). Vui lòng đảm bảo Backend đang chạy."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Compute dashboard stats
  const stats = useMemo(() => {
    return products.reduce(
      (acc, product) => ({
        totalRevenue: acc.totalRevenue + product.revenue,
        totalCost: acc.totalCost + product.cost,
        totalProfit: acc.totalProfit + product.profit,
        totalImportCost:
          acc.totalImportCost + product.importPrice * product.importQuantity,
      }),
      { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalImportCost: 0 }
    );
  }, [products]);

  // Separate products by type
  const productItems = useMemo(
    () => products.filter((p) => p.type === "product"),
    [products]
  );
  const materialItems = useMemo(
    () => products.filter((p) => p.type === "material"),
    [products]
  );

  // Handlers
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    const toastId = toast.loading("Đang xóa...");
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Đã xóa sản phẩm", { id: toastId });
    } catch (error) {
      toast.error("Xóa thất bại", { id: toastId });
    }
  };

  const handleSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Đang xử lý...");
    try {
      if (editingProduct) {
        // Edit mode
        const res = await productService.update(editingProduct._id, data);
        if (res.success) {
          await fetchProducts();
          toast.success("Cập nhật thành công", { id: toastId });
        }
      } else {
        // Create mode
        const res = await productService.create(data);
        if (res.success) {
          await fetchProducts();
          toast.success("Thêm mới thành công", { id: toastId });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra", { id: toastId });
      throw err; // Re-throw to let ProductForm know it failed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-20">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {/* Header */}
      <header className="bg-surface border-b border-slate-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Package className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              ProfitFlow{" "}
              <span className="text-slate-500 font-normal">Manager</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700/50 rounded-lg"
              title="Mở máy tính"
            >
              <Calculator size={20} />
            </button>
            <button
              onClick={() => {
                fetchProducts();
                toast.success("Đã làm mới dữ liệu");
              }}
              className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700/50 rounded-lg"
              title="Tải lại dữ liệu"
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error State */}
        {isError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex items-center gap-4 text-rose-500">
            <ServerOff size={32} />
            <div>
              <h3 className="font-bold text-lg">Lỗi Kết Nối</h3>
              <p className="text-rose-400/80">{errorMessage}</p>
            </div>
            <button
              onClick={fetchProducts}
              className="ml-auto px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatsCard
            title="Tổng Doanh Thu"
            value={stats.totalRevenue}
            type="revenue"
          />
          <StatsCard
            title="Tổng CP Nhập"
            value={stats.totalImportCost}
            type="importCost"
          />
          <StatsCard title="Tổng Chi Phí" value={stats.totalCost} type="cost" />
          <StatsCard
            title="Tổng Lợi Nhuận"
            value={stats.totalProfit}
            type="profit"
          />
        </div>

        {/* Action Bar (Hidden on mobile, showing FAB instead) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Danh Sách Sản Phẩm
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Quản lý nhập xuất và theo dõi hiệu quả kinh doanh
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Plus size={20} />
            Thêm mới
          </button>
        </div>

        {/* Content */}
        {isLoading && !isError ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bảng Sản phẩm */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                  Sản phẩm ({productItems.length})
                </h3>
              </div>
              <ProductTable
                products={productItems}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            </section>

            {/* Bảng Vật tư */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  Vật tư ({materialItems.length})
                </h3>
              </div>
              <MaterialTable
                products={materialItems}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            </section>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={handleOpenCreate}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-blue-600 text-white rounded-full shadow-xl shadow-blue-500/40 flex items-center justify-center sm:hidden z-40 transition-transform active:scale-90"
        aria-label="Thêm sản phẩm"
      >
        <Plus size={32} />
      </button>

      {/* Modal Form */}
      <ProductForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      {/* Calculator Modal */}
      <SimpleCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

export default App;
