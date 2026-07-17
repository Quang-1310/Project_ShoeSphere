import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getWarehouseOrders, packOrder } from '../api/warehouseAPI';
import type { OrderResponseDTO } from '../api/adminOrderAPI';

export const WarehousePage: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = await getWarehouseOrders();
            setOrders(data);
        } catch {
            Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handlePack = async (order: OrderResponseDTO) => {
        const result = await Swal.fire({
            title: `Xác nhận đóng gói đơn #${order.id}?`,
            text: 'Đơn hàng sẽ chuyển sang trạng thái Đã đóng gói (PACKED).',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đóng gói',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#7c3aed',
        });
        if (!result.isConfirmed) return;
        try {
            await packOrder(order.id);
            Swal.fire({ icon: 'success', title: 'Đã đóng gói!', timer: 1600, showConfirmButton: false });
            load();
        } catch (e: any) {
            Swal.fire('Lỗi', e.response?.data?.message || 'Đóng gói thất bại.', 'error');
        }
    };

    return (
        <div style={{ padding: 28, fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1e293b' }}>
                    📦 Kho hàng — Đóng gói đơn hàng
                </h1>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
                    Danh sách đơn hàng đã được admin xác nhận, chờ đóng gói để giao cho shipper.
                </p>
            </div>

            {/* Stats badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#ede9fe', color: '#5b21b6', borderRadius: 8,
                padding: '6px 16px', fontSize: 14, fontWeight: 600, marginBottom: 20,
            }}>
                📋 {orders.length} đơn hàng chờ đóng gói
            </div>

            {loading ? (
                <p style={{ color: '#64748b' }}>Đang tải...</p>
            ) : orders.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 16,
                    background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001'
                }}>
                    ✅ Không có đơn hàng nào cần đóng gói.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {orders.map(order => (
                        <div key={order.id} style={{
                            background: '#fff', borderRadius: 12, padding: '20px 24px',
                            boxShadow: '0 2px 8px #0000000d',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>
                                        Đơn hàng #{order.id}
                                    </span>
                                    <span style={{
                                        padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                        background: '#d1fae5', color: '#065f46'
                                    }}>Đã xác nhận</span>
                                </div>
                                <p style={{ margin: '0 0 4px', color: '#374151', fontWeight: 600 }}>
                                    👤 {order.receiverName} · 📞 {order.receiverPhone}
                                </p>
                                <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: 13 }}>
                                    📍 {order.deliveryAddress}
                                </p>
                                <div style={{ marginTop: 8 }}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={{
                                            fontSize: 13, color: '#475569',
                                            padding: '3px 0', borderBottom: '1px dashed #f1f5f9'
                                        }}>
                                            • {item.shoeName} — Size {item.size} × {item.quantity}
                                        </div>
                                    ))}
                                </div>
                                <p style={{ margin: '10px 0 0', fontWeight: 700, color: '#dc2626' }}>
                                    Tổng: {order.totalAmount.toLocaleString('vi-VN')} đ
                                </p>
                            </div>
                            <button
                                onClick={() => handlePack(order)}
                                style={{
                                    padding: '10px 20px', background: '#7c3aed', color: '#fff',
                                    border: 'none', borderRadius: 8, cursor: 'pointer',
                                    fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#6d28d9'}
                                onMouseLeave={e => e.currentTarget.style.background = '#7c3aed'}
                            >
                                📦 Đóng gói
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
