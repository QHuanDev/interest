export type ProductType = "product" | "material";

export interface Product {
  _id: string;
  name: string;
  type: ProductType;
  importPrice: number;
  sellPrice: number;
  importQuantity: number;
  soldQuantity: number;
  revenue: number;
  cost: number;
  profit: number;
  isLoss: boolean;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  type: ProductType;
  importPrice: number;
  sellPrice: number;
  importQuantity: number;
  soldQuantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  warning?: string | null;
  message?: string; // For error handling
}

export interface DashboardStats {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}
