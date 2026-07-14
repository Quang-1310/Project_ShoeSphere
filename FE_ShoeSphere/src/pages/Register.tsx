import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUser, type RegisterRequest } from '../api/registerAPI';
import type { AppDispatch, RootState } from '../redux/store/store';
import RegisterForm from '../components/RegisterForm';

import { resetRegisterState } from '../redux/slices/registerSlice';


const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { status, successMessage, error } = useSelector(
    (state: RootState) => state.registerSlice
  );

  const isLoading = status === 'pending';

  useEffect(() => {
    if (status === 'fulfilled' && successMessage) {
      toast.success(successMessage);
      dispatch(resetRegisterState());
      setTimeout(() => { navigate('/login'); }, 1500);
    }
    if (status === 'rejected' && error) {
      toast.error(error);
      dispatch(resetRegisterState());
    }
  }, [status, successMessage, error, navigate, dispatch]);

  const handleRegisterSubmit = (registerData: RegisterRequest) => {
    dispatch(addUser(registerData));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. THANH HEADER DỰA THEO ẢNH MẪU */}
      <header style={{ height: '70px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 60px', borderBottom: '1px solid #e2e8f0', }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', cursor: 'pointer' }}>ShoeSphere</span>
        </div>
        
      </header>

      {/* 2. KHU VỰC FORM ĐĂNG KÝ CHÍNH */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '640px', padding: '40px 45px', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Tạo tài khoản</h1>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>Đăng ký để trải nghiệm mua sắm tuyệt vời!</p>
          </div>

          {/* Nhúng form đã thiết kế lại */}
          <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />

          <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '15px', color: '#64748b' }}>
            Đã có tài khoản?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>
              Đăng nhập ngay
            </span>
          </div>
        </div>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;

