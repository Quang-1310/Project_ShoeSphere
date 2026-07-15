import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { AdminUserTable } from '../components/AdminUserTable';
import { deleteAdminUserThunk, getAdminUsersThunk, toggleAdminUserStatusThunk } from '../api/adminUserAPI';
import { setAdminUserCurrentPage, setAdminUserSearchTerm } from '../redux/slices/adminUserSlice';
import type { AppDispatch, RootState } from '../redux/store/store';
import type { UserResponseDTO } from './type';

export const AdminAccountPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, currentPage, totalPages, searchTerm, loading } = useSelector((state: RootState) => state.adminUserSlice);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    dispatch(getAdminUsersThunk({ page: currentPage, size: 10, email: searchTerm || undefined }));
  }, [currentPage, dispatch, searchTerm]);

  const handleToggleStatus = async (user: UserResponseDTO) => {
    const action = user.status ? 'khóa' : 'mở khóa';
    const result = await Swal.fire({
      title: `Xác nhận ${action} tài khoản?`,
      text: user.status ? 'Khách hàng sẽ không thể đăng nhập hoặc làm mới phiên.' : 'Khách hàng có thể đăng nhập trở lại.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Đồng ý ${action}`,
      cancelButtonText: 'Hủy',
      confirmButtonColor: user.status ? '#d97706' : '#059669',
    });
    if (!result.isConfirmed || user.id === undefined) return;

    try {
      await dispatch(toggleAdminUserStatusThunk(user.id)).unwrap();
      await Swal.fire({ icon: 'success', title: 'Đã cập nhật', timer: 1400, showConfirmButton: false });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Không thể cập nhật', text: String(error) });
    }
  };

  const handleDelete = async (user: UserResponseDTO) => {
    const result = await Swal.fire({
      title: 'Xóa tài khoản khách hàng?',
      text: 'Tài khoản sẽ bị xóa mềm và không thể đăng nhập lại.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa tài khoản',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed || user.id === undefined) return;

    try {
      await dispatch(deleteAdminUserThunk(user.id)).unwrap();
      await Swal.fire({ icon: 'success', title: 'Đã xóa tài khoản', timer: 1400, showConfirmButton: false });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Không thể xóa', text: String(error) });
    }
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif' }}>
      <h2 style={{ margin: '0 0 24px', color: '#0f172a' }}>QUẢN LÝ TÀI KHOẢN KHÁCH HÀNG</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input value={localSearch} onChange={(event) => setLocalSearch(event.target.value)} placeholder="Tìm theo email..." style={{ width: '280px', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
        <button onClick={() => dispatch(setAdminUserSearchTerm(localSearch))} style={{ padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Tìm kiếm</button>
      </div>
      {loading ? <p>Đang tải danh sách tài khoản...</p> : <AdminUserTable users={users} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
        <button disabled={currentPage === 1} onClick={() => dispatch(setAdminUserCurrentPage(currentPage - 1))}>Trước</button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => dispatch(setAdminUserCurrentPage(currentPage + 1))}>Sau</button>
      </div>
    </div>
  );
};
