import React from 'react';

import type { ShoeResponseDTO } from "../pages/type";

interface TableProps {
  products: ShoeResponseDTO[];
  onEdit: (product: ShoeResponseDTO) => void;
  onDelete: (id: number, name: string) => void;
}

export const AdminShoeTable: React.FC<TableProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#e5e7eb', color: '#374151', fontWeight: 'bold' }}>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>ID</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Hình ảnh</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Tên sản phẩm</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Thương hiệu</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Giá bán</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Kích cỡ (Size)</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Tồn kho</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db' }}>Trạng thái</th>
            <th style={{ padding: '12px 16px', borderBottom: '1px solid #d1d5db', textAlign: 'center' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 16px' }}>{p.id}</td>
                <td style={{ padding: '12px 16px' }}>
                  <img 
                    src={p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `https://res.cloudinary.com/dq3ocm9yl/image/upload/${p.imageUrl}`) : 'https://via.placeholder.com/60'} 
                    alt={p.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                  />
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#111827' }}>{p.name}</td>
                <td style={{ padding: '12px 16px' }}>{p.brand}</td>
                <td style={{ padding: '12px 16px', color: '#b91c1c', fontWeight: 'bold' }}>{p.price.toLocaleString('vi-VN')} đ</td>
                <td style={{ padding: '12px 16px' }}>
                  {p.sizes && p.sizes.length > 0 ? p.sizes.map(s => <div key={s.size} style={{ padding: '2px 0' }}>Size {s.size}</div>) : <span style={{ color: '#9ca3af' }}>N/A</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {p.sizes && p.sizes.length > 0 ? p.sizes.map(s => <div key={s.size} style={{ padding: '2px 0' }}>{s.stockQuantity} đôi</div>) : <span style={{ color: '#9ca3af' }}>N/A</span>}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: p.status ? '#d1fae5' : '#fee2e2', color: p.status ? '#065f46' : '#991b1b' }}>
                    {p.status ? 'Đang bán' : 'Dừng bán'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button onClick={() => onEdit(p)} style={{ marginRight: '8px', padding: '6px 12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => onDelete(p.id, p.name)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa mềm</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>Không tìm thấy sản phẩm nào!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};