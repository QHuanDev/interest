import React, { useState, useEffect } from 'react';
import { Product, ProductInput } from '../types';
import { X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductInput) => Promise<void>;
  initialData?: Product | null;
  isSubmitting: boolean;
}

const initialFormState: ProductInput = {
  name: '',
  importPrice: 0,
  sellPrice: 0,
  importQuantity: 0,
  soldQuantity: 0,
};

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<ProductInput>(initialFormState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        importPrice: initialData.importPrice,
        sellPrice: initialData.sellPrice,
        importQuantity: initialData.importQuantity,
        soldQuantity: initialData.soldQuantity,
      });
    } else {
      setFormData(initialFormState);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.soldQuantity > formData.importQuantity) {
      const msg = 'Số lượng bán không được lớn hơn số lượng nhập!';
      setError(msg);
      toast.error(msg);
      return;
    }
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi lưu sản phẩm.');
    }
  };

  if (!isOpen) return null;

  const isLossWarning = formData.sellPrice > 0 && formData.importPrice > 0 && formData.sellPrice < formData.importPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center bg-black/70 backdrop-blur-sm sm:p-4">
      <div className="bg-surface border-t sm:border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in fixed bottom-0 sm:relative h-[90vh] sm:h-auto flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 sm:py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Giá nhập (VNĐ)</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name="importPrice"
                required
                min="0"
                value={formData.importPrice}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 sm:py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Giá bán (VNĐ)</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name="sellPrice"
                required
                min="0"
                value={formData.sellPrice}
                onChange={handleChange}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-3 sm:py-2 text-white focus:ring-2 focus:border-transparent outline-none transition-all ${
                  isLossWarning ? 'border-amber-500 focus:ring-amber-500' : 'border-slate-700 focus:ring-primary'
                }`}
              />
              {isLossWarning && (
                <p className="text-amber-500 text-xs mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Cảnh báo: Giá bán thấp hơn giá nhập
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">SL Nhập</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name="importQuantity"
                required
                min="0"
                value={formData.importQuantity}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 sm:py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">SL Bán</label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                name="soldQuantity"
                required
                min="0"
                value={formData.soldQuantity}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 sm:py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </form>

        <div className="p-4 sm:p-6 border-t border-slate-700 bg-surface flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 sm:py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 sm:py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập Nhật' : 'Tạo Mới'}
            </button>
          </div>
      </div>
    </div>
  );
};