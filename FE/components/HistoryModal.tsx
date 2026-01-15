import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Edit2,
  Plus,
  RefreshCw,
  Trash2,
  Save,
  FileText,
} from "lucide-react";
import { ProductHistory } from "../types";
import { productService } from "../services/productService";
import toast from "react-hot-toast";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const changeTypeLabels: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  create: {
    label: "Tạo mới",
    color: "text-green-400 bg-green-400/10",
    icon: <Plus className="w-4 h-4" />,
  },
  update: {
    label: "Cập nhật",
    color: "text-blue-400 bg-blue-400/10",
    icon: <RefreshCw className="w-4 h-4" />,
  },
  delete: {
    label: "Xóa",
    color: "text-red-400 bg-red-400/10",
    icon: <Trash2 className="w-4 h-4" />,
  },
};

const fieldLabels: Record<string, string> = {
  name: "Tên",
  type: "Loại",
  importPrice: "Giá nhập",
  sellPrice: "Giá bán",
  importQuantity: "SL nhập",
  soldQuantity: "SL bán",
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");

  useEffect(() => {
    if (isOpen && productId) {
      fetchHistory();
    }
  }, [isOpen, productId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await productService.getHistory(productId);
      if (response.success) {
        setHistory(response.data);
      }
    } catch {
      toast.error("Lỗi khi tải lịch sử");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (historyItem: ProductHistory) => {
    setEditingNoteId(historyItem._id);
    setEditingNoteValue(historyItem.note || "");
  };

  const handleSaveNote = async (historyId: string) => {
    try {
      const response = await productService.updateHistoryNote(
        historyId,
        editingNoteValue
      );
      if (response.success) {
        setHistory((prev) =>
          prev.map((h) =>
            h._id === historyId ? { ...h, note: editingNoteValue } : h
          )
        );
        setEditingNoteId(null);
        toast.success("Đã cập nhật ghi chú");
      }
    } catch {
      toast.error("Lỗi khi cập nhật ghi chú");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatValue = (key: string, value: unknown) => {
    if (key === "type") return value === "product" ? "Sản phẩm" : "Vật tư";
    if (typeof value === "number" && key.includes("Price")) {
      return value.toLocaleString("vi-VN") + "đ";
    }
    return String(value);
  };

  const getChangedFields = (item: ProductHistory) => {
    if (!item.previousValues || !item.newValues) return [];
    const changes: { field: string; oldVal: string; newVal: string }[] = [];
    for (const key of Object.keys(
      item.newValues
    ) as (keyof typeof item.newValues)[]) {
      if (item.previousValues[key] !== item.newValues[key]) {
        changes.push({
          field: fieldLabels[key] || key,
          oldVal: formatValue(key, item.previousValues[key]),
          newVal: formatValue(key, item.newValues[key]),
        });
      }
    }
    return changes;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Lịch sử cập nhật
            </h2>
            <p className="text-sm text-gray-400 mt-1">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có lịch sử cập nhật</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => {
                const typeInfo = changeTypeLabels[item.changeType];
                const changes = getChangedFields(item);

                return (
                  <div
                    key={item._id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium ${typeInfo.color}`}
                        >
                          {typeInfo.icon}
                          {typeInfo.label}
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Changes */}
                    {item.changeType === "update" && changes.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="text-sm flex items-center gap-2"
                          >
                            <span className="text-gray-400">
                              {change.field}:
                            </span>
                            <span className="text-red-400 line-through">
                              {change.oldVal}
                            </span>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400">
                              {change.newVal}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Note */}
                    <div className="flex items-start gap-2">
                      {editingNoteId === item._id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={editingNoteValue}
                            onChange={(e) =>
                              setEditingNoteValue(e.target.value)
                            }
                            className="flex-1 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập ghi chú..."
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNote(item._id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 text-sm transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-500">
                            {item.note ? (
                              <span className="text-gray-300 italic">
                                "{item.note}"
                              </span>
                            ) : (
                              "Không có ghi chú"
                            )}
                          </span>
                          <button
                            onClick={() => handleEditNote(item)}
                            className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                            title="Sửa ghi chú"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
