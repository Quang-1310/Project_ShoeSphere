import React from 'react';
import type { ShoeResponseDTO } from "../pages/type";

interface DetailModalProps {
  shoe: ShoeResponseDTO;
  onClose: () => void;
  onAuthWarning: (actionName: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ shoe, onClose, onAuthWarning }) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '672px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'window.innerWidth > 640 ? "1fr 1fr" : "1fr"',
        gap: '24px'
      }} className="responsive-modal-grid">
        
        {/* Nút đóng X */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '24px'
        }}>&times;</button>

        {/* Khung Ảnh */}
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={shoe.imageUrl || "https://placehold.co/400x400?text=No+Image"} alt={shoe.name} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
        </div>

        {/* Thông tin */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              {shoe.brand}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginTop: '8px', marginBottom: '4px' }}>{shoe.name}</h2>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#ef4444', marginBottom: '16px' }}>
              {shoe.price.toLocaleString('vi-VN')} đ
            </div>
            <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '12px 0', margin: '12px 0', fontSize: '14px', color: '#4b5563' }}>
              <strong>Tình trạng:</strong> {shoe.stockQuantity > 0 ? `Còn hàng (${shoe.stockQuantity})` : "Tạm hết hàng"}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <strong style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Mô tả sản phẩm:</strong>
              {shoe.description || "Chưa có mô tả chi tiết."}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => onAuthWarning("Thêm vào giỏ hàng")} style={{ padding: '10px 0', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Thêm vào giỏ</button>
            <button onClick={() => onAuthWarning("Đặt mua hàng ngay")} style={{ padding: '10px 0', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Mua ngay</button>
          </div>
        </div>

      </div>
    </div>
  );
};