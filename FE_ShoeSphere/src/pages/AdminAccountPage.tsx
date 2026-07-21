import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { AdminUserTable } from '../components/AdminUserTable';
import { deleteAdminUserThunk, getAdminUsersThunk, toggleAdminUserStatusThunk } from '../api/adminUserAPI';
import { setAdminUserCurrentPage, setAdminUserSearchTerm } from '../redux/slices/adminUserSlice';
import type { AppDispatch, RootState } from '../redux/store/store';
import type { UserResponseDTO } from './type';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminAccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, currentPage, totalPages, searchTerm, loading } = useSelector((state: RootState) => state.adminUserSlice);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    dispatch(getAdminUsersThunk({ page: currentPage, size: 8, email: searchTerm || undefined }));
  }, [currentPage, dispatch, searchTerm]);

  const handleSearchSubmit = () => {
    dispatch(setAdminUserCurrentPage(1));
    dispatch(setAdminUserSearchTerm(localSearch));
  };

  const handleToggleStatus = async (user: UserResponseDTO) => {
    const action = user.status ? 'khóa' : 'mở khóa';
    const result = await Swal.fire({
      title: `Xác nhận ${action} tài khoản?`,
      text: user.status ? `Tài khoản ${user.email} sẽ không thể đăng nhập vào hệ thống.` : `Tài khoản ${user.email} có thể khôi phục đăng nhập.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Đồng ý ${action}`,
      cancelButtonText: 'Hủy',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: user.status ? '#f59e0b' : '#10b981',
    });
    if (!result.isConfirmed || user.id === undefined) return;

    try {
      await dispatch(toggleAdminUserStatusThunk(user.id)).unwrap();
      await Swal.fire({ icon: 'success', title: 'Đã cập nhật trạng thái', timer: 1400, showConfirmButton: false, background: '#1e293b', color: '#f8fafc' });
      dispatch(getAdminUsersThunk({ page: currentPage, size: 8, email: searchTerm || undefined }));
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Không thể cập nhật', text: String(error), background: '#1e293b', color: '#f8fafc' });
    }
  };

  const handleDelete = async (user: UserResponseDTO) => {
    const result = await Swal.fire({
      title: 'Xóa tài khoản khách hàng?',
      text: `Tài khoản ${user.email} sẽ bị xóa mềm và không thể khôi phục.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa tài khoản',
      cancelButtonText: 'Hủy',
      background: '#1e293b',
      color: '#f8fafc',
      confirmButtonColor: '#ef4444',
    });
    if (!result.isConfirmed || user.id === undefined) return;

    try {
      await dispatch(deleteAdminUserThunk(user.id)).unwrap();
      await Swal.fire({ icon: 'success', title: 'Đã xóa tài khoản thành công', timer: 1400, showConfirmButton: false, background: '#1e293b', color: '#f8fafc' });
      dispatch(getAdminUsersThunk({ page: currentPage, size: 8, email: searchTerm || undefined }));
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Không thể xóa', text: String(error), background: '#1e293b', color: '#f8fafc' });
    }
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            👥 Quản Lý Tài Khoản Khách Hàng
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Danh sách tài khoản thành viên, kiểm tra quyền hạn và thao tác khóa / xóa tài khoản
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '20px', marginBottom: '28px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            placeholder="Tìm theo địa chỉ email khách hàng..."
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

        <button
          onClick={handleSearchSubmit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Tìm kiếm
        </button>

        {searchTerm && (
          <button
            onClick={() => {
              setLocalSearch('');
              dispatch(setAdminUserSearchTerm(''));
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: '#334155',
              color: '#cbd5e1',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* User Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #334155', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '16px' }}>Đang tải danh sách tài khoản...</p>
        </div>
      ) : (
        <AdminUserTable users={users} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '28px', gap: '10px' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => dispatch(setAdminUserCurrentPage(currentPage - 1))}
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
            onClick={() => dispatch(setAdminUserCurrentPage(currentPage + 1))}
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
