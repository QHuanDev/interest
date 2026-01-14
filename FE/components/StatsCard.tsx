import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Package } from "lucide-react";
import { formatCurrency } from "../utils";

interface StatsCardProps {
  title: string;
  value: number;
  type: "revenue" | "cost" | "profit" | "importCost";
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, type }) => {
  let icon = <DollarSign className="w-6 h-6 text-white" />;
  let bgColor = "bg-blue-500";
  let textColor = "text-blue-500";

  if (type === "cost") {
    icon = <TrendingDown className="w-6 h-6 text-white" />;
    bgColor = "bg-rose-500";
    textColor = "text-rose-500";
  } else if (type === "profit") {
    icon = <TrendingUp className="w-6 h-6 text-white" />;
    bgColor = value >= 0 ? "bg-emerald-500" : "bg-rose-500";
    textColor = value >= 0 ? "text-emerald-500" : "text-rose-500";
  } else if (type === "importCost") {
    icon = <Package className="w-6 h-6 text-white" />;
    bgColor = "bg-orange-500";
    textColor = "text-orange-500";
  }

  return (
    <div className="bg-surface p-6 rounded-xl border border-slate-700 shadow-lg flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
          {title}
        </p>
        <h3 className={`text-2xl font-bold mt-1 ${textColor}`}>
          {formatCurrency(value)}
        </h3>
      </div>
      <div className={`p-3 rounded-lg ${bgColor} shadow-md`}>{icon}</div>
    </div>
  );
};
