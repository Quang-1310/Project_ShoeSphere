import configAPI from "./configAPI";

export interface Order {
    id: number;
    receiverName: string;
    receiverPhone: string;
    deliveryAddress: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: {
        id: number;
        shoeName: string;
        imageUrl: string;
        unitPrice: number;
        size: number;
        quantity: number;
    }[];
}

export const getMyOrders = async () =>
    (await configAPI.get("/orders")).data.data as Order[];

export const cancelOrder = (id: number) =>
    configAPI.patch(`/orders/${id}/cancel`);

export const createOrder = (cartItemIds: number[]) =>
    configAPI.post("/orders", { cartItemIds });