import configAPI from './configAPI';

export interface AdminDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  totalCustomers: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
  orderCount: number;
}

export interface TopSellingProduct {
  shoeId: number;
  shoeName: string;
  imageUrl?: string;
  brand?: string;
  price: number;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface BrandSales {
  brand: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface AdminStatisticsResponse {
  selectedYear: number;
  summary: AdminDashboardSummary;
  monthlyRevenue: MonthlyRevenue[];
  topProducts: TopSellingProduct[];
  brandSales: BrandSales[];
}

export interface ApiDataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getAdminStatisticsAPI = async (year?: number): Promise<AdminStatisticsResponse> => {
  const query = year ? `?year=${year}` : '';
  const response = await configAPI.get<ApiDataResponse<AdminStatisticsResponse>>(`/admin/statistics${query}`);
  return response.data.data;
};
