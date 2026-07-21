import React from 'react';
import { Lock, Trash2, Unlock, UserCheck, UserX } from 'lucide-react';
import type { UserResponseDTO } from '../pages/type';

interface AdminUserTableProps {
  users: UserResponseDTO[];
  onToggleStatus: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({ users, onToggleStatus, onDelete }) => (
  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc', fontSize: '14px', minWidth: '720px' }}>
        <thead>
          <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
            <th style={{ padding: '16px 20px' }}>Thành viên</th>
            <th style={{ padding: '16px 20px' }}>Địa chỉ Email</th>
            <th style={{ padding: '16px 20px' }}>Số điện thoại</th>
            <th style={{ padding: '16px 20px' }}>Trạng thái</th>
            <th style={{ padding: '16px 20px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                Không tìm thấy tài khoản khách hàng nào!
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #334155', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0f172a', border: '1px solid #38bdf8', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' }}>
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#f8fafc' }}>{user.fullName}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: #{user.id}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{user.email}</td>
                
                <td style={{ padding: '16px 20px', color: '#cbd5e1' }}>{user.phone || '—'}</td>

                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: user.status ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)',
                    color: user.status ? '#34d399' : '#fbbf24',
                    border: user.status ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(245,158,11,0.3)'
                  }}>
                    {user.status ? '• Đang hoạt động' : '• Đã bị khóa'}
                  </span>
                </td>

                <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                      title={user.status ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      onClick={() => onToggleStatus(user)}
                      style={{
                        padding: '8px',
                        backgroundColor: user.status ? 'rgba(245,158,11,0.15)' : 'rgba(52,211,153,0.15)',
                        color: user.status ? '#fbbf24' : '#34d399',
                        border: user.status ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(52,211,153,0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {user.status ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>

                    <button
                      title="Xóa tài khoản"
                      onClick={() => onDelete(user)}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(239,68,68,0.15)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
