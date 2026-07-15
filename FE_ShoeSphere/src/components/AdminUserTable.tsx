import { Lock, Trash2, Unlock } from 'lucide-react';
import type { UserResponseDTO } from '../pages/type';

interface AdminUserTableProps {
  users: UserResponseDTO[];
  onToggleStatus: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
}

export const AdminUserTable = ({ users, onToggleStatus, onDelete }: AdminUserTableProps) => (
  <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8fafc', color: '#475569', textAlign: 'left' }}>
          <th style={{ padding: '14px 16px' }}>Họ tên</th>
          <th style={{ padding: '14px 16px' }}>Email</th>
          <th style={{ padding: '14px 16px' }}>Số điện thoại</th>
          <th style={{ padding: '14px 16px' }}>Trạng thái</th>
          <th style={{ padding: '14px 16px', textAlign: 'center' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Không có tài khoản khách hàng.</td></tr>
        ) : users.map((user) => (
          <tr key={user.id} style={{ borderTop: '1px solid #e2e8f0' }}>
            <td style={{ padding: '14px 16px', fontWeight: 600 }}>{user.fullName}</td>
            <td style={{ padding: '14px 16px' }}>{user.email}</td>
            <td style={{ padding: '14px 16px' }}>{user.phone}</td>
            <td style={{ padding: '14px 16px' }}>
              <span style={{ color: user.status ? '#059669' : '#dc2626', fontWeight: 600 }}>
                {user.status ? 'Đang hoạt động' : 'Đã khóa'}
              </span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
              <button title={user.status ? 'Khóa tài khoản' : 'Mở khóa tài khoản'} onClick={() => onToggleStatus(user)} style={{ color: user.status ? '#d97706' : '#059669', border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '12px', verticalAlign: 'middle' }}>
                {user.status ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
              <button title="Xóa tài khoản" onClick={() => onDelete(user)} style={{ color: '#dc2626', border: 'none', background: 'transparent', cursor: 'pointer', verticalAlign: 'middle' }}>
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
