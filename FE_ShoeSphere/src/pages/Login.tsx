import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetLoginState } from '../redux/slices/loginSlice';
import LoginForm from '../components/LoginForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser, type LoginRequest } from '../api/loginAPI';
import type { AppDispatch, RootState } from '../redux/store/store';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Đọc dữ liệu từ kho lưu trữ redux
  const { status, successMessage, error } = useSelector((state: RootState) => state.loginSlice);

  useEffect(() => {
    // 🌟 Xử lý kịch bản khi Spring Boot trả dữ liệu thành công (Mã 200)
    if (status === 'fulfilled' && successMessage) {
      toast.success(successMessage); // "Đăng nhập hệ thống thành công!"
      dispatch(resetLoginState());
      navigate('/home'); // Điều hướng về Trang chủ
    }

    // 🌟 Xử lý kịch bản khi Spring Boot quăng lỗi (Trùng mật khẩu, khóa tài khoản...)
    if (status === 'rejected' && error) {
      toast.error(error); // Hiển thị lời dịch lỗi chi tiết từ Spring Boot
      dispatch(resetLoginState());
    }
  }, [status, successMessage, error, dispatch, navigate]);

  const handleLoginSubmit = (data: LoginRequest) => {
    dispatch(loginUser(data));
  };

  return (
<div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

    <header style={{ height: '70px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px', borderBottom: '1px solid #e2e8f0', }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', cursor: 'pointer' }}>ShoeSphere</span>
        </div>
        
    </header>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        margin: 'auto',
        backgroundColor: '#f8fafc',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: '550px',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
            Chào mừng trở lại!
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Đăng nhập hệ thống ShopZone để tiếp tục mua sắm tuyệt vời!
          </p>
        </div>

        {/* Nhúng form vào */}
        <LoginForm onSubmit={handleLoginSubmit} isLoading={status === 'loading'} />

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Chưa có tài khoản?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#2563eb', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Đăng ký ngay
          </span>
        </div>
      </div>
    </div>

    <ToastContainer position="top-right" autoClose={3000} />
</div>
  );
};

export default Login;