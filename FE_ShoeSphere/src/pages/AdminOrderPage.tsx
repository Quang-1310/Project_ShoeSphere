import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminOrdersThunk, confirmAdminOrderThunk } from '../api/adminOrderAPI';
import { setSearchTerm, setSelectedStatus, setCurrentPage } from '../redux/slices/adminOrderSlice';
import type { AppDispatch, RootState } from '../redux/store/store';
import Swal from 'sweetalert2';

export const AdminOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, currentPage, totalPages, searchTerm, selectedStatus, loading } = useSelector((state: RootState) => state.adminOrderSlice);

  useEffect(() => {
    dispatch(getAdminOrdersThunk({ page: currentPage, size: 10, status: selectedStatus || undefined, orderId: searchTerm ? Number(searchTerm) : undefined }));
  }, [dispatch, currentPage, searchTerm, selectedStatus]);

  const handleConfirm = async (orderId: number) => {
    const result = await Swal.fire({
      title: 'Xác nhận duyệt đơn?',
      text: 'Đơn hàng sẽ chuyển sang trạng thái Đã xác nhận (CONFIRMED).',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Duyệt',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      const res = await dispatch(confirmAdminOrderThunk(orderId));
      if (res.meta.requestStatus === 'fulfilled') {
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Đã duyệt đơn hàng', timer: 1800, showConfirmButton: false });
        // Reload lại danh sách từ server để đồng bộ với database
        dispatch(getAdminOrdersThunk({ page: currentPage, size: 10, status: selectedStatus || undefined, orderId: searchTerm ? Number(searchTerm) : undefined }));
      } else {
        Swal.fire('Lỗi', res.payload as string, 'error');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION': return <span style={{ padding: '4px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Chờ xác nhận</span>;
      case 'CONFIRMED': return <span style={{ padding: '4px 8px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã xác nhận</span>;
      case 'PACKED': return <span style={{ padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã đóng gói</span>;
      case 'PICKED_UP': return <span style={{ padding: '4px 8px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Shipper nhận đơn</span>;
      case 'SHIPPING': return <span style={{ padding: '4px 8px', backgroundColor: '#fed7aa', color: '#9a3412', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đang vận chuyển</span>;
      case 'DELIVERED': return <span style={{ padding: '4px 8px', backgroundColor: '#dcfce7', color: '#14532d', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã giao</span>;
      case 'CANCELLED': return <span style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Đã hủy</span>;
      default: return <span style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b' }}>Quản lý đơn hàng</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <input
          type="number"
          placeholder="Tìm theo Mã đơn hàng (ID)"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', width: '250px' }}
        />
        <select
          value={selectedStatus}
          onChange={(e) => dispatch(setSelectedStatus(e.target.value))}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', width: '200px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING_CONFIRMATION">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="PACKED">Đã đóng gói</option>
          <option value="PICKED_UP">Shipper nhận đơn</option>
          <option value="SHIPPING">Đang vận chuyển</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Mã ĐH</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Khách hàng</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Điện thoại</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Sản phẩm</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Tổng tiền</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Trạng thái</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>Đang tải...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>Không có đơn hàng nào</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>#{order.id}</td>
                  <td style={{ padding: '12px' }}>
                    <div><strong>{order.receiverName}</strong></div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{order.deliveryAddress}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{order.receiverPhone}</td>
                  <td style={{ padding: '12px' }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ fontSize: '13px' }}>
                        {item.shoeName} (Size {item.size}) x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '12px', color: '#b91c1c', fontWeight: 'bold' }}>{order.totalAmount.toLocaleString('vi-VN')} đ</td>
                  <td style={{ padding: '12px' }}>{getStatusBadge(order.status)}</td>
                  <td style={{ padding: '12px' }}>
                    {order.status === 'PENDING_CONFIRMATION' && (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Xác nhận đơn hàng
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => dispatch(setCurrentPage(idx + 1))}
              style={{
                padding: '6px 12px',
                backgroundColor: currentPage === idx + 1 ? '#3b82f6' : '#fff',
                color: currentPage === idx + 1 ? '#fff' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
