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

export interface ProductUpdateInput extends ProductInput {
  note?: string;
}

export interface ProductHistory {
  _id: string;
  productId: string;
  changeType: "create" | "update" | "delete";
  previousValues: Partial<ProductInput> | null;
  newValues: Partial<ProductInput> | null;
  note: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  warning?: string | null;
  message?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}
