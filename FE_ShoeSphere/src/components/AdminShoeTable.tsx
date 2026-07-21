import React from 'react';
import { Edit3, Trash2, ShoppingBag } from 'lucide-react';
import type { ShoeResponseDTO } from "../pages/type";

interface TableProps {
  products: ShoeResponseDTO[];
  onEdit: (product: ShoeResponseDTO) => void;
  onDelete: (id: number, name: string) => void;
}

export const AdminShoeTable: React.FC<TableProps> = ({ products, onEdit, onDelete }) => {
  const formatImageUrl = (url?: string) => {
    if (!url || url.trim() === '') return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://res.cloudinary.com/dq3ocm9yl/image/upload/${url}`;
  };

  return (
    <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#f8fafc', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>
              <th style={{ padding: '16px 20px' }}>ID</th>
              <th style={{ padding: '16px 20px' }}>Hình ảnh</th>
              <th style={{ padding: '16px 20px' }}>Tên sản phẩm</th>
              <th style={{ padding: '16px 20px' }}>Thương hiệu</th>
              <th style={{ padding: '16px 20px' }}>Đơn giá</th>
              <th style={{ padding: '16px 20px' }}>Size & Tồn kho</th>
              <th style={{ padding: '16px 20px' }}>Trạng thái</th>
              <th style={{ padding: '16px 20px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #334155', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 600 }}>#{p.id}</td>
                  
                  {/* Product Image */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '10px', backgroundColor: '#0f172a', overflow: 'hidden', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={formatImageUrl(p.imageUrl)} 
                        alt={p.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#f8fafc' }}>
                    {p.name}
                  </td>

                  {/* Brand */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '6px', border: '1px solid #334155', color: '#38bdf8', fontSize: '13px', fontWeight: 500 }}>
                      {p.brand || 'Khác'}
                    </span>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '16px 20px', color: '#4ade80', fontWeight: '800' }}>
                    {p.price.toLocaleString('vi-VN')} ₫
                  </td>

                  {/* Sizes & Stock */}
                  <td style={{ padding: '16px 20px' }}>
                    {p.sizes && p.sizes.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '220px' }}>
                        {p.sizes.map(s => (
                          <span key={s.size} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            Size {s.size}: <strong style={{ color: '#fb923c' }}>{s.stockQuantity}</strong>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#64748b' }}>Chưa có size</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: p.status ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)',
                      color: p.status ? '#34d399' : '#f87171',
                      border: p.status ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(239,68,68,0.3)'
                    }}>
                      {p.status ? '• Đang bán' : '• Dừng bán'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button
                        onClick={() => onEdit(p)}
                        title="Chỉnh sửa sản phẩm"
                        style={{ padding: '8px', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id, p.name)}
                        title="Xóa mềm"
                        style={{ padding: '8px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                  Không tìm thấy sản phẩm nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};