import React from 'react';
import type { ShoeResponseDTO } from '../pages/type';

interface ShoeCardProps {
  shoe: ShoeResponseDTO;
  onSelect: (id: number) => void;
  onAuthWarning: (actionName: string) => void;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({ shoe, onSelect, onAuthWarning }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      {/* Khung Ảnh tỉ lệ 1:1 vuông vắn */}
      <div 
        onClick={() => onSelect(shoe.id)} 
        style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#f3f4f6', cursor: 'pointer' }}
      >
        <img 
          src={shoe.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
          alt={shoe.name}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '4px',
          textTransform: 'uppercase'
        }}>
          {shoe.brand}
        </span>
      </div>

      {/* Chi tiết nội dung */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 
          onClick={() => onSelect(shoe.id)} 
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#111827',
            cursor: 'pointer',
            margin: '0 0 4px 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {shoe.name}
        </h3>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444', marginBottom: '16px' }}>
          {shoe.price.toLocaleString('vi-VN')} đ
        </div>

        {/* Buttons */}
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button 
            onClick={() => onAuthWarning("Thêm sản phẩm vào giỏ hàng")}
            style={{
              padding: '8px 0',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid #2563eb',
              color: '#2563eb',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thêm giỏ
          </button>
          <button 
            onClick={() => onAuthWarning("Đặt mua hàng ngay")}
            style={{
              padding: '8px 0',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};