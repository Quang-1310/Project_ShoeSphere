import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Header } from '../components/Header';
import { cancelOrder, getMyOrders, type Order } from '../api/orderAPI';

const steps = ['CONFIRMED', 'PACKED', 'PICKED_UP', 'SHIPPING', 'DELIVERED'];
const labels = ['Đã xác nhận', 'Đã đóng gói', 'Shipper nhận đơn', 'Đang vận chuyển', 'Đã giao'];

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dq3ocm9yl/image/upload/';

const resolveImageUrl = (url: string | null | undefined) => {
  if (!url || url.trim() === '') return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80';
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
  PACKED:               { bg: '#dbeafe', text: '#1e40af' },
  PICKED_UP:            { bg: '#fef3c7', text: '#92400e' },
  SHIPPING:             { bg: '#fed7aa', text: '#9a3412' },
  CANCELLED:            { bg: '#fee2e2', text: '#991b1b' },
  DELIVERED:            { bg: '#dcfce7', text: '#14532d' },
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
        padding: '4px 12px',
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
      <main style={{ maxWidth: 1000, margin: '32px auto', padding: '0 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ marginBottom: 24, fontSize: '26px', color: '#0f172a' }}>📦 Đơn hàng của tôi</h1>

        {orders.length === 0 && (
          <div style={{ color: '#64748b', textAlign: 'center', margin: '48px 0', padding: 40, border: '1px dashed #cbd5e1', borderRadius: 12 }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Bạn chưa có đơn hàng nào.</p>
          </div>
        )}

        {orders.map(o => (
          <article key={o.id} style={{
            padding: 24,
            marginBottom: 20,
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            {/* Header đơn hàng */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
              <div>
                <b style={{ fontSize: '16px', color: '#0f172a' }}>Đơn hàng #{o.id}</b>
                <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: 12 }}>
                  {new Date(o.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              {getStatusBadge(o.status)}
            </div>

            {/* Danh sách sản phẩm mua kèm ảnh */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0' }}>
              {o.items && o.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  backgroundColor: '#f8fafc',
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid #f1f5f9'
                }}>
                  {/* Thumbnail Ảnh Sản Phẩm */}
                  <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', backgroundColor: '#e2e8f0', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.shoeName}
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Thông tin tên, size, số lượng */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.shoeName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: 4 }}>
                      Size: <span style={{ color: '#2563eb', fontWeight: 600 }}>{item.size}</span> · Số lượng: <span style={{ color: '#0f172a', fontWeight: 600 }}>{item.quantity}</span>
                    </div>
                  </div>

                  {/* Giá tiền */}
                  <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#0f172a', fontSize: '15px' }}>
                    {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              ))}
            </div>

            {/* Footer tổng tiền & nút hành động */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Tổng thành tiền: </span>
                <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '18px', marginLeft: 4 }}>
                  {o.totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setDetail(o)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    background: '#fff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  Xem chi tiết
                </button>
                {canCancel(o.status) && (
                  <button
                    onClick={() => cancel(o.id)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #fca5a5',
                      borderRadius: 8,
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
            </div>
          </article>
        ))}

        {/* Modal chi tiết đơn hàng */}
        {detail && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 80, overflow: 'auto',
            padding: 24, background: '#0f172a88', backdropFilter: 'blur(4px)',
          }}>
            <section style={{
              maxWidth: 800, margin: '20px auto', padding: 28,
              borderRadius: 16, background: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                <h2 style={{ margin: 0, color: '#0f172a' }}>Chi tiết Đơn hàng #{detail.id}</h2>
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
                        <small style={{ fontWeight: active ? 'bold' : 'normal' }}>{labels[i]}</small>
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

              <div style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, margin: '20px 0', fontSize: '14px', color: '#334155', border: '1px solid #f1f5f9' }}>
                <p style={{ margin: '4px 0' }}><b>Người nhận:</b> {detail.receiverName} · {detail.receiverPhone}</p>
                <p style={{ margin: '4px 0' }}><b>Địa chỉ giao hàng:</b> {detail.deliveryAddress}</p>
                <p style={{ margin: '4px 0' }}><b>Thời gian đặt:</b> {new Date(detail.createdAt).toLocaleString('vi-VN')}</p>
              </div>

              <h3 style={{ fontSize: '16px', color: '#0f172a', marginBottom: 12 }}>Danh sách sản phẩm</h3>
              {detail.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0', borderBottom: '1px solid #f1f5f9',
                }}>
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.shoeName}
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80'; }}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, border: '1px solid #cbd5e1' }}
                  />
                  <div style={{ flex: 1 }}>
                    <b style={{ color: '#0f172a', fontSize: '15px' }}>{item.shoeName}</b>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: 4 }}>
                      Size: {item.size} · Số lượng: {item.quantity}
                    </div>
                  </div>
                  <b style={{ color: '#0f172a', fontSize: '15px' }}>{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} đ</b>
                </div>
              ))}
              <h3 style={{ textAlign: 'right', color: '#dc2626', fontSize: '20px', marginTop: 20 }}>
                Tổng thanh toán: {detail.totalAmount.toLocaleString('vi-VN')} đ
              </h3>
            </section>
          </div>
        )}
      </main>
    </>
  );
};
