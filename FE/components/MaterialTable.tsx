import React from "react";
import { Product } from "../types";
import { formatCurrency } from "../utils";
import { Edit2, Trash2, Wrench, History } from "lucide-react";

interface MaterialTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewHistory: (product: Product) => void;
}

export const MaterialTable: React.FC<MaterialTableProps> = ({
  products,
  onEdit,
  onDelete,
  onViewHistory,
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-surface rounded-xl border border-slate-700">
        <p className="text-slate-400">Chưa có vật tư nào.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const inventory = product.importQuantity - product.soldQuantity;

          return (
            <div
              key={product._id}
              className="bg-surface p-4 rounded-xl border border-slate-700 shadow-lg active:scale-[0.99] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 bg-orange-500/20 text-orange-400">
                      <Wrench size={12} />
                      VT
                    </span>
                    {product.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Giá nhập</span>
                  <span>{formatCurrency(product.importPrice)}</span>
                </div>
                <div className="flex flex-col text-center">
                  <span className="text-xs text-slate-500">Tổng CP Nhập</span>
                  <span className="text-orange-400">
                    {formatCurrency(
                      product.importPrice * product.importQuantity
                    )}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-500">Tồn kho</span>
                  <span className="text-purple-400">
                    {inventory} / {product.importQuantity}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onViewHistory(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-500/10 text-purple-500 font-medium hover:bg-purple-500 hover:text-white transition-colors"
                >
                  <History size={16} /> Lịch sử
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/10 text-blue-500 font-medium hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Edit2 size={16} /> Sửa
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500/10 text-rose-500 font-medium hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-700 shadow-xl bg-surface">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-700">
              <th className="p-4 font-semibold">Tên Vật Tư</th>
              <th className="p-4 font-semibold text-right">Giá Nhập</th>
              <th className="p-4 font-semibold text-right">Tổng CP Nhập</th>
              <th className="p-4 font-semibold text-center">Tồn Kho</th>
              <th className="p-4 font-semibold text-right">Tổng Giá Tồn</th>
              <th className="p-4 font-semibold text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map((product) => {
              const inventory = product.importQuantity - product.soldQuantity;

              return (
                <tr
                  key={product._id}
                  className="group hover:bg-slate-800/50 transition-colors duration-150"
                >
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 bg-orange-500/20 text-orange-400">
                        <Wrench size={12} />
                        VT
                      </span>
                      {product.name}
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-300">
                    {formatCurrency(product.importPrice)}
                  </td>
                  <td className="p-4 text-right text-orange-400 font-medium">
                    {formatCurrency(
                      product.importPrice * product.importQuantity
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      {inventory} / {product.importQuantity}
                    </span>
                  </td>
                  <td className="p-4 text-right text-purple-400 font-medium">
                    {formatCurrency(inventory * product.importPrice)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewHistory(product)}
                        className="p-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
                        title="Lịch sử"
                      >
                        <History size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
