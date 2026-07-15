import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';
import { fetchProfileMe } from '../api/loginAPI';
import type { AppDispatch, RootState } from '../redux/store/store';

export const AdminLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('accessToken');
  
  // Lấy trạng thái user và trạng thái loading từ Redux Store (auth slice)
  const { user, loading } = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    // Nếu có token ở localStorage nhưng Redux chưa có user (do vừa F5 trang) -> Tải lại ngay
    if (token && !user) {
      dispatch(fetchProfileMe());
    }
  }, [dispatch, token, user]);

  // 1. Khách vãng lai chưa đăng nhập -> Chuyển hướng sang trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Đang trong quá trình chờ API /auth/me trả về dữ liệu người dùng
  if (loading) {
    return (
      <div style={{ padding: '32px', fontFamily: 'sans-serif', color: '#64748b' }}>
        ⏳ Đang xác thực thông tin quyền quản trị...
      </div>
    );
  }

  // 3. Đã có dữ liệu user nhưng quyền (role) KHÔNG PHẢI "ADMIN" -> Đá về trang chủ Client
  if (user && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // 4. Hợp lệ -> Hiển thị Sidebar bên trái và nội dung trang Admin bên phải
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Thanh Navbar bên trái dùng chung */}
      <AdminSidebar />

      {/* Vùng hiển thị nội dung động của từng trang Admin con */}
      <main style={{ flex: 1, overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};