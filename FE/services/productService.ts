import axiosInstance from "./axiosConfig";
import {
  Product,
  ProductInput,
  ProductUpdateInput,
  ProductHistory,
  ApiResponse,
} from "../types";

export const productService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get<ApiResponse<Product[]>>(
      "/products"
    );
    return response.data;
  },

  create: async (product: ProductInput): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.post<ApiResponse<Product>>(
      "/products",
      product
    );
    return response.data;
  },

  update: async (
    id: string,
    product: ProductUpdateInput
  ): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.put<ApiResponse<Product>>(
      `/products/${id}`,
      product
    );
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/products/${id}`
    );
    return response.data;
  },

  getHistory: async (
    productId: string
  ): Promise<ApiResponse<ProductHistory[]>> => {
    const response = await axiosInstance.get<ApiResponse<ProductHistory[]>>(
      `/products/${productId}/history`
    );
    return response.data;
  },

  updateHistoryNote: async (
    historyId: string,
    note: string
  ): Promise<ApiResponse<ProductHistory>> => {
    const response = await axiosInstance.put<ApiResponse<ProductHistory>>(
      `/products/history/${historyId}/note`,
      { note }
    );
    return response.data;
  },
};
