import { createAsyncThunk } from '@reduxjs/toolkit';
import configAPI from './configAPI';

// Interfaces for response
export interface OrderItemResponseDTO {
  id: number;
  shoeName: string;
  unitPrice: number;
  quantity: number;
  size: number;
}

export interface OrderResponseDTO {
  id: number;
  receiverName: string;
  receiverPhone: string;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemResponseDTO[];
}

export interface PageResponseDTO<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface ApiDataResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Lấy danh sách đơn hàng có phân trang, lọc, tìm kiếm
export const getAdminOrdersThunk = createAsyncThunk<
  PageResponseDTO<OrderResponseDTO>,
  { page?: number; size?: number; status?: string; orderId?: number }
>(
  'adminOrder/getOrders',
  async (params, { rejectWithValue }) => {
    try {
      const { page = 1, size = 10, status, orderId } = params;
      const query = new URLSearchParams();
      query.append('page', page.toString());
      query.append('size', size.toString());
      if (status) query.append('status', status);
      if (orderId) query.append('orderId', orderId.toString());

      const response = await configAPI.get(`/admin/orders?${query.toString()}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách đơn hàng.'
      );
    }
  }
);

// Cập nhật trạng thái đơn hàng (Duyệt đơn)
export const confirmAdminOrderThunk = createAsyncThunk<
  OrderResponseDTO,
  number
>(
  'adminOrder/confirmOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await configAPI.patch(`/admin/orders/${orderId}/confirm`);
      if (response.data?.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data?.message || 'Không thể duyệt đơn hàng này.');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể duyệt đơn hàng này.'
      );
    }
  }
);
