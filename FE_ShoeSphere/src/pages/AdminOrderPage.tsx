import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrdersThunk, confirmAdminOrderThunk } from '../api/adminOrderAPI';
import { setSearchTerm, setSelectedStatus, setCurrentPage } from '../redux/slices/adminOrderSlice';
import type { AppDispatch, RootState } from '../redux/store/store';
import { PackageCheck, Search, Filter, CheckCircle, Clock, Truck, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

export const AdminOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, currentPage, totalPages, searchTerm, selectedStatus, loading } = useSelector((state: RootState) => state.adminOrderSlice);

  useEffect(() => {
    dispatch(getAdminOrdersThunk({ page: currentPage, size: 8, status: selectedStatus || undefined, orderId: searchTerm ? Number(searchTerm) : undefined }));
  }, [dispatch, currentPage, searchTerm, selectedStatus]);

  const handleConfirm = async (orderId: number) => {
    const result = await Swal.fire({
      title: 'Xác nhận duyệt đơn hàng?',
      text: `Đơn hàng #${orderId} sẽ chuyển sang trạng thái Đã xác nhận (CONFIRMED).`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Duyệt đơn hàng',
      cancelButtonText: 'Hủy',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#2563eb'
    });

    if (result.isConfirmed) {
      const res = await dispatch(confirmAdminOrderThunk(orderId));
      if (res.meta.requestStatus === 'fulfilled') {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: `Đã duyệt đơn hàng #${orderId}`,
          timer: 1800,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#f8fafc'
        });
        dispatch(getAdminOrdersThunk({ page: currentPage, size: 8, status: selectedStatus || undefined, orderId: searchTerm ? Number(searchTerm) : undefined }));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: res.payload as string,
          background: '#1e293b',
          color: '#f8fafc'
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', fontSize: '12px', fontWeight: 'bold' }}>⏳ Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', fontSize: '12px', fontWeight: 'bold' }}>✓ Đã xác nhận</span>;
      case 'PACKED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(129,140,248,0.15)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.3)', fontSize: '12px', fontWeight: 'bold' }}>📦 Đã đóng gói</span>;
      case 'PICKED_UP':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)', fontSize: '12px', fontWeight: 'bold' }}>🛵 Shipper đã nhận</span>;
      case 'SHIPPING':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)', fontSize: '12px', fontWeight: 'bold' }}>🚚 Đang vận chuyển</span>;
      case 'DELIVERED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontSize: '12px', fontWeight: 'bold' }}>🎉 Giao thành công</span>;
      case 'CANCELLED':
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', fontSize: '12px', fontWeight: 'bold' }}>✕ Đã hủy</span>;
      default:
        return <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: '#334155', color: '#cbd5e1', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📦 Quản Lý Đơn Hàng
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Theo dõi trạng thái đơn hàng, phê duyệt đơn mới và kiểm tra quy trình vận chuyển ShoeSphere
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', marginBottom: '28px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="number"
            placeholder="Tìm theo Mã đơn hàng (ID)..."
            value={searchTerm}
            onChange={(e) => {
              dispatch(setCurrentPage(1));
              dispatch(setSearchTerm(e.target.value));
            }}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="#38bdf8" />
          <select
            value={selectedStatus}
            onChange={(e) => {
              dispatch(setCurrentPage(1));
              dispatch(setSelectedStatus(e.target.value));
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#38bdf8',
              fontWeight: 'bold',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Tất cả trạng thái</option>
            <option value="PENDING_CONFIRMATION" style={{ backgroundColor: '#1e293b', color: '#fff' }}>⏳ Chờ xác nhận</option>
            <option value="CONFIRMED" style={{ backgroundColor: '#1e293b', color: '#fff' }}>✓ Đã xác nhận</option>
            <option value="PACKED" style={{ backgroundColor: '#1e293b', color: '#fff' }}>📦 Đã đóng gói</option>
            <option value="PICKED_UP" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🛵 Shipper đã nhận</option>
            <option value="SHIPPING" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🚚 Đang vận chuyển</option>
            <option value="DELIVERED" style={{ backgroundColor: '#1e293b', color: '#fff' }}>🎉 Đã giao thành công</option>
            <option value="CANCELLED" style={{ backgroundColor: '#1e293b', color: '#fff' }}>✕ Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
                <th style={{ padding: '16px 20px' }}>Mã ĐH</th>
                <th style={{ padding: '16px 20px' }}>Khách nhận</th>
                <th style={{ padding: '16px 20px' }}>Điện thoại</th>
                <th style={{ padding: '16px 20px' }}>Chi tiết sản phẩm</th>
                <th style={{ padding: '16px 20px' }}>Tổng tiền</th>
                <th style={{ padding: '16px 20px' }}>Trạng thái</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #334155', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ marginTop: '12px' }}>Đang tải danh sách đơn hàng...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    Không có đơn hàng nào khớp với tìm kiếm
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #334155', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#38bdf8' }}>#{order.id}</td>
                    
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 'bold', color: '#f8fafc' }}>{order.receiverName}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.deliveryAddress}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{order.receiverPhone}</td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {order.items.map(item => (
                          <div key={item.id} style={{ fontSize: '13px', color: '#cbd5e1' }}>
                            • <strong>{item.shoeName}</strong> (Size {item.size}) x<strong style={{ color: '#fb923c' }}>{item.quantity}</strong>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', color: '#4ade80', fontWeight: '800', fontSize: '15px' }}>
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </td>

                    <td style={{ padding: '16px 20px' }}>{getStatusBadge(order.status)}</td>

                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {order.status === 'PENDING_CONFIRMATION' ? (
                        <button
                          onClick={() => handleConfirm(order.id)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            boxShadow: '0 4px 10px rgba(37,99,235,0.3)',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✓ Duyệt đơn
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '28px', gap: '10px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 14px',
              backgroundColor: currentPage === 1 ? '#1e293b' : '#334155',
              color: currentPage === 1 ? '#64748b' : '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={18} /> Trước
          </button>
          
          <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 600, padding: '0 10px' }}>
            Trang {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 14px',
              backgroundColor: currentPage === totalPages ? '#1e293b' : '#334155',
              color: currentPage === totalPages ? '#64748b' : '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Sau <ChevronRight size={18} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
