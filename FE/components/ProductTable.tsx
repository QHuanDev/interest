import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { Edit2, Trash2, AlertCircle, ArrowDown, ArrowUp, Package, TrendingUp } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-xl border border-slate-700">
        <p className="text-slate-400">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const isWarningPrice = product.sellPrice < product.importPrice;
          const inventory = product.importQuantity - product.soldQuantity;
          
          return (
            <div key={product._id} className="bg-surface p-4 rounded-xl border border-slate-700 shadow-lg active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    {product.name}
                    {isWarningPrice && (
                      <span className="text-amber-500" title="Giá bán thấp hơn giá nhập">
                        <AlertCircle size={16} />
                      </span>
                    )}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                       Kho: {inventory}
                    </span>
                    <span>•</span>
                    <span>Đã bán: {product.soldQuantity}</span>
                  </div>
                </div>
                <div className={`text-right font-bold ${product.isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {product.isLoss ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                    {formatCurrency(product.profit)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal uppercase mt-0.5">Lợi nhuận</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Giá nhập</span>
                  <span>{formatCurrency(product.importPrice)}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs text-slate-500">Giá bán</span>
                  <span className={isWarningPrice ? 'text-amber-500' : 'text-white'}>
                    {formatCurrency(product.sellPrice)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
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
              <th className="p-4 font-semibold">Tên Sản Phẩm</th>
              <th className="p-4 font-semibold text-right">Giá Nhập</th>
              <th className="p-4 font-semibold text-right">Giá Bán</th>
              <th className="p-4 font-semibold text-center">Tồn Kho</th>
              <th className="p-4 font-semibold text-center">Đã Bán</th>
              <th className="p-4 font-semibold text-right">Doanh Thu</th>
              <th className="p-4 font-semibold text-right">Chi Phí</th>
              <th className="p-4 font-semibold text-right">Lãi/Lỗ</th>
              <th className="p-4 font-semibold text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map((product) => {
              const isWarningPrice = product.sellPrice < product.importPrice;
              const inventory = product.importQuantity - product.soldQuantity;

              return (
                <tr 
                  key={product._id} 
                  className="group hover:bg-slate-800/50 transition-colors duration-150"
                >
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      {product.name}
                      {isWarningPrice && (
                        <span className="text-amber-500 tooltip" title="Giá bán thấp hơn giá nhập">
                          <AlertCircle size={16} />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right text-slate-300">{formatCurrency(product.importPrice)}</td>
                  <td className={`p-4 text-right font-medium ${isWarningPrice ? 'text-amber-500' : 'text-slate-300'}`}>
                    {formatCurrency(product.sellPrice)}
                  </td>
                  <td className="p-4 text-center">
                     <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                      {inventory} / {product.importQuantity}
                     </span>
                  </td>
                  <td className="p-4 text-center text-slate-300">{product.soldQuantity}</td>
                  <td className="p-4 text-right text-blue-400">{formatCurrency(product.revenue)}</td>
                  <td className="p-4 text-right text-slate-400">{formatCurrency(product.cost)}</td>
                  <td className="p-4 text-right font-bold">
                    <div className={`flex items-center justify-end gap-1 ${product.isLoss ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {product.isLoss ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                      {formatCurrency(product.profit)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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