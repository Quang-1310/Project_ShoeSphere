import configAPI from './configAPI';
import type { OrderResponseDTO } from './adminOrderAPI';

export const getWarehouseOrders = async (): Promise<OrderResponseDTO[]> => {
    const res = await configAPI.get('/warehouse/orders');
    return res.data.data;
};

export const packOrder = async (id: number): Promise<OrderResponseDTO> => {
    const res = await configAPI.patch(`/warehouse/orders/${id}/pack`);
    return res.data.data;
};
