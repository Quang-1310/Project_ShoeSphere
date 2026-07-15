import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logoutUserSession } from '../api/loginAPI';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Định nghĩa danh sách các menu
  const menuItems = [
    {
      text: '👟 Quản lý sản phẩm',
      path: '/admin/products',
    },
    {
      text: '👥 Quản lý tài khoản',
      path: '/admin/accounts', // Tính năng mở/khóa tài khoản làm sau
    },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận đăng xuất?',
      text: 'Bạn sẽ kết thúc phiên quản trị hiện tại.',
      icon: 'warning',
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1e293b', // Màu slate đen đậm chuẩn Admin
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
    }}>
      {/* Logo thương hiệu Admin */}
      <div style={{
        padding: '24px',
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        borderBottom: '1px solid #334155',
        color: '#38bdf8',
        textAlign: 'center'
      }}>
        SHOESPHERE ADMIN
      </div>

      {/* Danh sách điều hướng Menu điều khiển */}
      <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: '14px 24px',
                textAlign: 'left',
                backgroundColor: isActive ? '#0f172a' : 'transparent', // Đổi màu nền nếu active
                color: isActive ? '#38bdf8' : '#cbd5e1',
                border: 'none',
                borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent', // Thanh màu xanh bên trái khi chọn
                fontSize: '15px',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#334155';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.text}
            </button>
          );
        })}
      </nav>

      {/* Nút Đăng xuất ở dưới cùng Sidebar */}
      <div style={{ padding: '16px', borderTop: '1px solid #334155' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          🚪 Đăng xuất
        </button>
      </div>
    </aside>
  );
};
