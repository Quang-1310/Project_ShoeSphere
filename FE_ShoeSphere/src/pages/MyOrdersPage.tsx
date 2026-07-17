import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Header } from '../components/Header';
import { cancelOrder, getMyOrders, type Order } from '../api/orderAPI';

const steps = ['CONFIRMED', 'PACKED', 'PICKED_UP', 'SHIPPING', 'DELIVERED'];
const labels = ['Đã xác nhận', 'Đã đóng gói', 'Shipper nhận đơn', 'Đang vận chuyển', 'Đã giao'];

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dq3ocm9yl/image/upload/';

const resolveImageUrl = (url: string | null | undefined) => {
  if (!url) return 'https://placehold.co/80x80?text=No+Image';
  if (url.startsWith('http')) return url;
  return `${CLOUDINARY_BASE}${url}`;
};

const STATUS_LABEL: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PACKED: 'Đã đóng gói',
  PICKED_UP: 'Shipper nhận đơn',
  SHIPPING: 'Đang vận chuyển',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  PENDING_CONFIRMATION: { bg: '#fef3c7', text: '#92400e' },
  CONFIRMED:            { bg: '#d1fae5', text: '#065f46' },
  CANCELLED:            { bg: '#fee2e2', text: '#991b1b' },
  DELIVERED:            { bg: '#dbeafe', text: '#1e40af' },
};

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [detail, setDetail] = useState<Order | null>(null);

  const load = () => getMyOrders().then(setOrders);
  useEffect(() => { load(); }, []);

  const cancel = async (id: number) => {
    const r = await Swal.fire({
      title: 'Hủy đơn hàng?',
      text: 'Bạn có chắc muốn hủy đơn hàng này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Quay lại',
      confirmButtonColor: '#dc2626',
    });
    if (r.isConfirmed) {
      await cancelOrder(id);
      Swal.fire({ icon: 'success', title: 'Đã hủy đơn hàng', timer: 1500, showConfirmButton: false });
      setDetail(null);
      load();
    }
  };

  const canCancel = (status: string) =>
    status === 'PENDING_CONFIRMATION' || status === 'CONFIRMED';

  const getStatusBadge = (status: string) => {
    const colors = STATUS_COLOR[status] || { bg: '#f3f4f6', text: '#374151' };
    return (
      <span style={{
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 700,
        backgroundColor: colors.bg,
        color: colors.text,
      }}>
        {STATUS_LABEL[status] || status}
      </span>
    );
  };

  return (
    <>
      <Header onAuthWarning={() => {}} />
      <main style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
        <h1 style={{ marginBottom: 24 }}>Đơn hàng của tôi</h1>

        {orders.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: 48 }}>Bạn chưa có đơn hàng nào.</p>
        )}

        {orders.map(o => (
          <article key={o.id} style={{
            padding: 20,
            marginBottom: 14,
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 2px 8px #0000000d',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <b>Đơn hàng #{o.id}</b>
              {getStatusBadge(o.status)}
            </div>
            <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
              Thời gian đặt: {new Date(o.createdAt).toLocaleString('vi-VN')}
            </p>
            <p style={{ color: '#dc2626', fontWeight: 700, margin: '4px 0 12px' }}>
              {o.totalAmount.toLocaleString('vi-VN')} đ
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setDetail(o)}
                style={{
                  padding: '6px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Xem chi tiết
              </button>
              {canCancel(o.status) && (
                <button
                  onClick={() => cancel(o.id)}
                  style={{
                    padding: '6px 14px',
                    border: '1px solid #fca5a5',
                    borderRadius: 6,
                    background: '#fff1f2',
                    color: '#dc2626',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </article>
        ))}

        {/* Modal chi tiết đơn hàng */}
        {detail && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 80, overflow: 'auto',
            padding: 24, background: '#0f172a88',
          }}>
            <section style={{
              maxWidth: 800, margin: '20px auto', padding: 28,
              borderRadius: 14, background: '#fff',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Đơn hàng #{detail.id}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {canCancel(detail.status) && (
                    <button
                      onClick={() => cancel(detail.id)}
                      style={{
                        padding: '6px 14px',
                        border: '1px solid #fca5a5',
                        borderRadius: 6,
                        background: '#fff1f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      Hủy đơn
                    </button>
                  )}
                  <button
                    onClick={() => setDetail(null)}
                    style={{
                      padding: '6px 14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      background: '#f8fafc',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>

              {/* Progress bar trạng thái */}
              {!['PENDING_CONFIRMATION', 'CANCELLED'].includes(detail.status) && (
                <div style={{ display: 'flex', margin: '30px 0', overflowX: 'auto' }}>
                  {steps.map((s, i) => {
                    const active = steps.indexOf(detail.status) >= i;
                    return (
                      <div key={s} style={{
                        minWidth: 110, flex: 1, textAlign: 'center',
                        position: 'relative', color: active ? '#2563eb' : '#94a3b8',
                      }}>
                        {i > 0 && (
                          <div style={{
                            position: 'absolute', top: 10, right: '50%',
                            width: '100%', height: 3,
                            background: active ? '#2563eb' : '#cbd5e1',
                          }} />
                        )}
                        <div style={{
                          width: 22, height: 22, margin: 'auto', position: 'relative',
                          borderRadius: '50%', background: active ? '#2563eb' : '#cbd5e1',
                          border: '3px solid white',
                        }} />
                        <small>{labels[i]}</small>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Trạng thái chờ / đã hủy */}
              {['PENDING_CONFIRMATION', 'CANCELLED'].includes(detail.status) && (
                <div style={{ margin: '20px 0', textAlign: 'center' }}>
                  {getStatusBadge(detail.status)}
                </div>
              )}

              <p><b>Người nhận:</b> {detail.receiverName} · {detail.receiverPhone}</p>
              <p><b>Địa chỉ:</b> {detail.deliveryAddress}</p>
              <p><b>Thời gian đặt:</b> {new Date(detail.createdAt).toLocaleString('vi-VN')}</p>

              <h3>Sản phẩm</h3>
              {detail.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 0', borderBottom: '1px solid #e2e8f0',
                }}>
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.shoeName}
                    onError={e => { e.currentTarget.src = 'https://placehold.co/80x80?text=No+Image'; }}
                    style={{ width: 58, height: 58, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <b>{item.shoeName}</b>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>Size: {item.size} · Số lượng: {item.quantity}</div>
                  </div>
                  <b>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ</b>
                </div>
              ))}
              <h3 style={{ textAlign: 'right', color: '#dc2626' }}>
                Tổng: {detail.totalAmount.toLocaleString('vi-VN')} đ
              </h3>
            </section>
          </div>
        )}
      </main>
    </>
  );
};
