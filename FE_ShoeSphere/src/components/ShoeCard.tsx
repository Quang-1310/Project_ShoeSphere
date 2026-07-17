import React from 'react';
// import { useSelector } from 'react-redux';
import type { ShoeResponseDTO } from '../pages/type';
// import type { RootState } from '../redux/store/store';
// import { addCartItem } from '../api/cartAPI';
// import { createOrder } from '../api/orderAPI';
// import { useNavigate } from 'react-router-dom';

interface ShoeCardProps {
  shoe: ShoeResponseDTO;
  onSelect: (id: number) => void;
  onAuthWarning: (actionName: string) => void;
}

interface ShoeCardProps {
  shoe: ShoeResponseDTO;
  onSelect: (id: number) => void;
  onAuthWarning: (actionName: string) => void;
}

export const ShoeCard: React.FC<ShoeCardProps> = ({ shoe, onSelect }) => {
  // const { user } = useSelector((state: RootState) => state.authSlice);
  // const navigate = useNavigate();

  // const handleProtectedAction = (actionName: string) => {
  //   if (!user) {
  //     onAuthWarning(actionName);
  //   }
  // };

  return (
    <div className="hover-lift fade-in-up" style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Khung Ảnh tỉ lệ 1:1 vuông vắn */}
      <div 
        onClick={() => onSelect(shoe.id)} 
        style={{ position: 'relative', width: '100%', paddingTop: '100%', backgroundColor: '#f3f4f6', cursor: 'pointer' }}
      >
        <img 
          className="img-zoom"
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
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          <button 
            className="btn-hover"
            onClick={() => onSelect(shoe.id)}
            style={{
              padding: '8px 0',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};
