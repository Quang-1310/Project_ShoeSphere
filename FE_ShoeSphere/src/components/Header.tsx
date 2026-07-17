import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logoutUserSession } from '../api/loginAPI';
import { logout } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store/store';
import { getCart } from '../api/cartAPI';
import { ClipboardList } from 'lucide-react';

interface HeaderProps {
  onAuthWarning: (actionName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthWarning }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCart = () => {
      getCart()
        .then((items) => setCartCount(items.length))
        .catch(() => setCartCount(0));
    };

    fetchCart();

    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, [user]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận đăng xuất?',
      text: 'Bạn sẽ cần đăng nhập lại để tiếp tục mua sắm.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await logoutUserSession();
    } catch (error) {
      console.error('Không thể thông báo đăng xuất đến máy chủ:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };
  return (
    <header className="glass-effect" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <div className="text-gradient" style={{
          fontSize: '28px',
          fontWeight: 900,
          letterSpacing: '0.05em',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          SHOESPHERE
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user && <button className="btn-hover" onClick={() => navigate('/my-orders')} title="Đơn hàng của tôi" style={{ padding: '8px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}><ClipboardList size={24} /></button>}
          <button 
            className="btn-hover"
            onClick={() => user ? navigate('/cart') : onAuthWarning("Xem giỏ hàng")}
            style={{
              position: 'relative',
              padding: '8px',
              color: '#4b5563',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '12px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{cartCount}</span>
          </button>
          {!user ? (
            <>
          <button className="btn-hover" onClick={() => navigate('/register')} style={{
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            color: '#374151'
          }}>
            Đăng ký
          </button>
          <button className="btn-hover" onClick={() => navigate('/login')} style={{
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Đăng nhập
          </button>
          </>
          ) : (
            /* NẾU ĐÃ ĐĂNG NHẬP THÀNH CÔNG -> HIỂN THỊ TÊN VÀ NÚT ĐĂNG XUẤT */
            <>
              <span>👋 Xin chào, <strong>{user.fullName}</strong></span>
              <button className="btn-hover" onClick={() => navigate('/delivery-profile')} style={{
                padding: '8px 20px', fontSize: '14px', fontWeight: 600,
                border: '1px solid #2563eb', borderRadius: '8px', backgroundColor: '#ffffff', color: '#2563eb', cursor: 'pointer'
              }}>
                Thông tin giao hàng
              </button>
              <button className="btn-hover" onClick={handleLogout} style={{
                padding: '8px 20px',
                fontSize: '14px',
                fontWeight: 600,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
