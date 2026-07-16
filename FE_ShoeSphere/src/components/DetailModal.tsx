import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store/store';
import { addCartItem, updateCartItem } from '../api/cartAPI';
import { createOrder } from '../api/orderAPI';
import type { ShoeResponseDTO } from "../pages/type";

interface DetailModalProps {
  shoe: ShoeResponseDTO;
  onClose: () => void;
  onAuthWarning: (actionName: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ shoe, onClose, onAuthWarning }) => {
  const user = useSelector((state: RootState) => state.authSlice.user);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const addToCart = async () => { 
    if (!user) return onAuthWarning('Thêm vào giỏ hàng'); 
    if (!selectedSize) return void import('sweetalert2').then(Swal => Swal.default.fire('Vui lòng chọn size'));
    await addCartItem(shoe.id, selectedSize); 
    import('sweetalert2').then(Swal => Swal.default.fire({ icon: 'success', title: 'Thêm thành công', timer: 1500, showConfirmButton: false }));
  };
  const buyNow = async () => { 
    if (!user) return onAuthWarning('Đặt mua hàng ngay'); 
    if (!selectedSize) return void import('sweetalert2').then(Swal => Swal.default.fire('Vui lòng chọn size'));
    
    import('sweetalert2').then(Swal => {
      Swal.default.fire({
        title: 'Xác nhận mua hàng',
        text: 'Bạn có chắc chắn muốn đặt mua sản phẩm này ngay lập tức?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý mua',
        cancelButtonText: 'Hủy'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
              const item = await addCartItem(shoe.id, selectedSize); 
              await updateCartItem(item.id, shoe.id, selectedSize, 1);
              await createOrder([item.id]); 
              navigate('/my-orders');
          } catch(err: any) {
              Swal.default.fire('Lỗi', err.response?.data?.message || String(err), 'error');
          }
        }
      });
    });
  };
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
              <div style={{ marginBottom: '8px' }}>
                <strong>Kích cỡ:</strong>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {shoe.sizes?.map(s => (
                    <button 
                      key={s.size} 
                      onClick={() => s.stockQuantity > 0 && setSelectedSize(s.size)}
                      disabled={s.stockQuantity <= 0}
                      style={{ 
                        padding: '6px 12px', 
                        border: selectedSize === s.size ? '2px solid #2563eb' : '1px solid #d1d5db',
                        borderRadius: '4px',
                        background: selectedSize === s.size ? '#eff6ff' : (s.stockQuantity > 0 ? '#fff' : '#f3f4f6'),
                        cursor: s.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                        color: s.stockQuantity > 0 ? '#111827' : '#9ca3af'
                      }}>
                      {s.size}
                    </button>
                  ))}
                  {(!shoe.sizes || shoe.sizes.length === 0) && <span>Tạm hết hàng</span>}
                </div>
              </div>
              {selectedSize && shoe.sizes?.find(s => s.size === selectedSize) && (
                <div style={{ marginTop: '8px', color: '#2563eb', fontWeight: 600 }}>
                  Còn lại: {shoe.sizes.find(s => s.size === selectedSize)?.stockQuantity} sản phẩm
                </div>
              )}
            </div>

            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <strong style={{ color: '#374151', display: 'block', marginBottom: '4px' }}>Mô tả sản phẩm:</strong>
              {shoe.description || "Chưa có mô tả chi tiết."}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button onClick={addToCart} style={{ padding: '10px 0', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Thêm vào giỏ</button>
            <button onClick={buyNow} style={{ padding: '10px 0', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Mua ngay</button>
          </div>
        </div>

      </div>
    </div>
  );
};
