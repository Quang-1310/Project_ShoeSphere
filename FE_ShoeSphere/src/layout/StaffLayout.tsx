import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { fetchProfileMe, logoutUserSession } from '../api/loginAPI';
import type { AppDispatch, RootState } from '../redux/store/store';
import Swal from 'sweetalert2';

const ROLE_CONFIG: Record<string, { title: string; emoji: string; color: string }> = {
    WAREHOUSE_MANAGEMENT: { title: 'Kho Hàng',  emoji: '📦', color: '#7c3aed' },
    SHIPPER:              { title: 'Giao Hàng', emoji: '🚚', color: '#2563eb' },
};

export const StaffLayout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const { user, loading } = useSelector((state: RootState) => state.authSlice);

    useEffect(() => {
        if (token && !user) dispatch(fetchProfileMe());
    }, [dispatch, token, user]);

    if (!token) return <Navigate to="/login" replace />;

    // Đang fetch user profile lần đầu - chờ
    if (loading || (!user && token)) {
        return <div style={{ padding: 32, color: '#64748b' }}>⏳ Đang xác thực...</div>;
    }

    // Không lấy được user sau khi fetch → token hết hạn
    if (!user) return <Navigate to="/login" replace />;

    const allowedRoles = ['WAREHOUSE_MANAGEMENT', 'SHIPPER'];
    if (!allowedRoles.includes(user.role)) {
        // ADMIN về trang admin, còn lại về trang chủ
        if (user.role === 'ADMIN') return <Navigate to="/admin/products" replace />;
        return <Navigate to="/" replace />;
    }

    const config = user ? ROLE_CONFIG[user.role] : null;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Đăng xuất?', icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Đăng xuất',
            cancelButtonText: 'Hủy', confirmButtonColor: '#ef4444',
        });
        if (!result.isConfirmed) return;
        try { await logoutUserSession(); } catch { /* silent */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: 220, background: '#1e293b', color: '#f8fafc',
                display: 'flex', flexDirection: 'column', height: '100vh',
                position: 'sticky', top: 0, boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
            }}>
                <div style={{
                    padding: '24px 16px', fontWeight: 700, fontSize: 18,
                    borderBottom: '1px solid #334155', color: config?.color ?? '#38bdf8',
                    textAlign: 'center', letterSpacing: '0.02em',
                }}>
                    {config?.emoji} SHOESPHERE<br />
                    <span style={{ fontSize: 13, fontWeight: 400, color: '#94a3b8' }}>{config?.title}</span>
                </div>

                <div style={{ flex: 1, padding: '16px 0' }}>
                    <div style={{
                        padding: '12px 20px', color: '#cbd5e1', fontSize: 14,
                        borderLeft: `4px solid ${config?.color ?? '#38bdf8'}`,
                        background: '#0f172a', fontWeight: 600,
                    }}>
                        {config?.emoji} Quản lý đơn hàng
                    </div>
                </div>

                <div style={{ padding: 16, borderTop: '1px solid #334155' }}>
                    <div style={{ marginBottom: 8, padding: '6px 12px', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                        👤 {user?.fullName ?? user?.email}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', padding: 10, background: '#ef4444', color: '#fff',
                            border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700,
                        }}
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, overflowX: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    );
};
