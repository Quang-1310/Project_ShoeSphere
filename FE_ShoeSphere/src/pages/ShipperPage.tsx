import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getShipperOrders, pickupOrder, shipOrder, deliverOrder } from '../api/shipperAPI';
import type { OrderResponseDTO } from '../api/adminOrderAPI';

// Cấu hình nút hành động cho từng trạng thái
const NEXT_ACTION: Record<string, {
    label: string;
    action: (id: number) => Promise<OrderResponseDTO>;
    color: string;
    emoji: string;
}> = {
    PACKED:    { label: 'Nhận đơn',      action: pickupOrder,  color: '#2563eb', emoji: '🚚' },
    PICKED_UP: { label: 'Bắt đầu giao', action: shipOrder,    color: '#d97706', emoji: '📍' },
    SHIPPING:  { label: 'Giao thành công', action: deliverOrder, color: '#16a34a', emoji: '✅' },
};

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    PACKED:    { bg: '#dbeafe', text: '#1e40af', label: 'Đã đóng gói' },
    PICKED_UP: { bg: '#fef3c7', text: '#92400e', label: 'Shipper nhận đơn' },
    SHIPPING:  { bg: '#fed7aa', text: '#9a3412', label: 'Đang vận chuyển' },
    DELIVERED: { bg: '#dcfce7', text: '#14532d', label: 'Đã giao' },
};

const FILTER_OPTIONS = [
    { value: '',         label: '📋 Tất cả đang xử lý' },
    { value: 'PACKED',   label: '📦 Đã đóng gói' },
    { value: 'PICKED_UP',label: '🚚 Đã nhận đơn' },
    { value: 'SHIPPING', label: '📍 Đang vận chuyển' },
];

export const ShipperPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');

    const load = async (status: string) => {
        setLoading(true);
        try {
            const data = await getShipperOrders(status || undefined);
            setOrders(data);
        } catch {
            Swal.fire('Lỗi', 'Không thể tải danh sách đơn hàng.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(selectedStatus); }, [selectedStatus]);

    const handleAdvance = async (order: OrderResponseDTO) => {
        const next = NEXT_ACTION[order.status];
        if (!next) return;

        const result = await Swal.fire({
            title: `${next.emoji} ${next.label} — đơn #${order.id}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: next.label,
            cancelButtonText: 'Hủy',
            confirmButtonColor: next.color,
        });
        if (!result.isConfirmed) return;

        try {
            await next.action(order.id);
            Swal.fire({ icon: 'success', title: 'Cập nhật thành công!', timer: 1600, showConfirmButton: false });
            load(selectedStatus);
        } catch (e: any) {
            Swal.fire('Lỗi', e.response?.data?.message || 'Cập nhật thất bại.', 'error');
        }
    };

    const currentLabel = FILTER_OPTIONS.find(f => f.value === selectedStatus)?.label ?? '';

    return (
        <div style={{ padding: 28, fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1e293b' }}>
                    🚚 Shipper — Quản lý giao hàng
                </h1>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
                    Theo dõi và cập nhật trạng thái tất cả đơn hàng đang trong quá trình giao.
                </p>
            </div>

            {/* Bộ lọc trạng thái */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 22, flexWrap: 'wrap',
            }}>
                {FILTER_OPTIONS.map(opt => {
                    const isActive = selectedStatus === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => setSelectedStatus(opt.value)}
                            style={{
                                padding: '8px 18px',
                                borderRadius: 20,
                                border: isActive ? '2px solid #2563eb' : '2px solid #e2e8f0',
                                background: isActive ? '#2563eb' : '#fff',
                                color: isActive ? '#fff' : '#475569',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: 13,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                boxShadow: isActive ? '0 2px 8px #2563eb33' : 'none',
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Badge số đơn */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#dbeafe', color: '#1e40af', borderRadius: 8,
                padding: '5px 14px', fontSize: 13, fontWeight: 600, marginBottom: 18,
            }}>
                {currentLabel} · {orders.length} đơn
            </div>

            {/* Nội dung */}
            {loading ? (
                <p style={{ color: '#64748b' }}>⏳ Đang tải...</p>
            ) : orders.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 16,
                    background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001',
                }}>
                    ✅ Không có đơn hàng nào trong bộ lọc này.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {orders.map(order => {
                        const badge = STATUS_BADGE[order.status];
                        const next = NEXT_ACTION[order.status];
                        return (
                            <div key={order.id} style={{
                                background: '#fff', borderRadius: 12, padding: '20px 24px',
                                boxShadow: '0 2px 8px #0000000d',
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'flex-start', gap: 16,
                                borderLeft: `4px solid ${badge?.bg.replace('#', '') ? badge.text : '#e2e8f0'}`,
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                        <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>
                                            Đơn hàng #{order.id}
                                        </span>
                                        {badge && (
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 12,
                                                fontSize: 12, fontWeight: 700,
                                                background: badge.bg, color: badge.text,
                                            }}>
                                                {badge.label}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: '0 0 4px', color: '#374151', fontWeight: 600 }}>
                                        👤 {order.receiverName} · 📞 {order.receiverPhone}
                                    </p>
                                    <p style={{ margin: '0 0 10px', color: '#64748b', fontSize: 13 }}>
                                        📍 {order.deliveryAddress}
                                    </p>
                                    <div>
                                        {order.items.map(item => (
                                            <div key={item.id} style={{
                                                fontSize: 13, color: '#475569',
                                                padding: '3px 0', borderBottom: '1px dashed #f1f5f9',
                                            }}>
                                                • {item.shoeName} — Size {item.size} × {item.quantity}
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ margin: '10px 0 0', fontWeight: 700, color: '#dc2626' }}>
                                        Tổng: {order.totalAmount.toLocaleString('vi-VN')} đ
                                    </p>
                                </div>

                                {/* Nút hành động — chỉ hiện khi còn bước tiếp theo */}
                                {next ? (
                                    <button
                                        onClick={() => handleAdvance(order)}
                                        style={{
                                            padding: '10px 18px',
                                            background: next.color,
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            fontSize: 14,
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        {next.emoji} {next.label}
                                    </button>
                                ) : (
                                    <span style={{
                                        padding: '8px 14px', borderRadius: 8,
                                        background: '#dcfce7', color: '#15803d',
                                        fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0,
                                    }}>
                                        ✅ Đã hoàn thành
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
