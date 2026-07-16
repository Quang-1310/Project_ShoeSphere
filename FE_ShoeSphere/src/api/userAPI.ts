import axios from 'axios';
import configAPI from './configAPI';
import type { ApiDataResponse, UserResponseDTO } from '../pages/type';

export interface DeliveryInfoRequest {
  fullName: string;
  phone: string;
  address: string;
}

export const updateDeliveryInfo = async (data: DeliveryInfoRequest) => {
  try {
    const response = await configAPI.put<ApiDataResponse<UserResponseDTO>>('/users/me/delivery-info', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Không thể lưu thông tin giao hàng.');
    }
    return response.data.data;
  } catch (error) {
    throw new Error(axios.isAxiosError(error) ? error.response?.data?.message || 'Không thể lưu thông tin giao hàng.' : String(error));
  }
};
