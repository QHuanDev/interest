import React, { useState, useEffect } from "react";
import { X, Save, CreditCard, Banknote } from "lucide-react";

type PaymentMethod = "transfer" | "cash" | "";

interface NoteInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  initialNote?: string;
  title?: string;
  isSubmitting?: boolean;
}

export const NoteInputModal: React.FC<NoteInputModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialNote = "",
  title = "Nhập ghi chú",
  isSubmitting = false,
}) => {
  const [note, setNote] = useState(initialNote);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");

  useEffect(() => {
    setNote(initialNote);
    setPaymentMethod("");
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kết hợp phương thức thanh toán với ghi chú
    const paymentText =
      paymentMethod === "transfer"
        ? "[Chuyển khoản]"
        : paymentMethod === "cash"
        ? "[Tiền mặt]"
        : "";
    const fullNote = paymentText ? `${paymentText} ${note}`.trim() : note;
    onConfirm(fullNote);
  };

  const handleSkip = () => {
    onConfirm("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phương thức thanh toán
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod(
                    paymentMethod === "transfer" ? "" : "transfer"
                  )
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  paymentMethod === "transfer"
                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Chuyển khoản
              </button>
              <button
                type="button"
                onClick={() =>
                  setPaymentMethod(paymentMethod === "cash" ? "" : "cash")
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  paymentMethod === "cash"
                    ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <Banknote className="w-5 h-5" />
                Tiền mặt
              </button>
            </div>
          </div>

          {/* Note Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho lần cập nhật này..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              rows={3}
              autoFocus
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-all"
              disabled={isSubmitting}
            >
              Bỏ qua
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
