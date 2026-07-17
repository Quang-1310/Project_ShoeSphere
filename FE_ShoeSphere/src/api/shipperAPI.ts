import configAPI from './configAPI';
import type { OrderResponseDTO } from './adminOrderAPI';

export const getShipperOrders = async (status?: string): Promise<OrderResponseDTO[]> => {
    const params = status ? { params: { status } } : {};
    const res = await configAPI.get('/shipper/orders', params);
    return res.data.data;
};

export const pickupOrder = async (id: number): Promise<OrderResponseDTO> => {
    const res = await configAPI.patch(`/shipper/orders/${id}/pickup`);
    return res.data.data;
};

export const shipOrder = async (id: number): Promise<OrderResponseDTO> => {
    const res = await configAPI.patch(`/shipper/orders/${id}/ship`);
    return res.data.data;
};

export const deliverOrder = async (id: number): Promise<OrderResponseDTO> => {
    const res = await configAPI.patch(`/shipper/orders/${id}/deliver`);
    return res.data.data;
};
