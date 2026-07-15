import React, { useState } from 'react';

interface ShoeResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  stockQuantity: number;
  imageUrl: string;
  status: boolean;
}

interface ModalProps {
  editingProduct: ShoeResponseDTO | null;
  onClose: () => void;
  onSubmit: (formData, file: File | null) => void;
}

export const AdminShoeModal: React.FC<ModalProps> = ({ editingProduct, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    brand: editingProduct?.brand || '',
    price: editingProduct?.price.toString() || '',
    stockQuantity: editingProduct?.stockQuantity.toString() || '',
    description: editingProduct?.description || '',
    status: editingProduct ? editingProduct.status : true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'status' ? value === 'true' : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension || '')) {
        setFileError('⚠️ File phải có định dạng .png, .jpg hoặc .jpeg');
        setSelectedFile(null);
        return;
      }
      setFileError('');
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    onSubmit(formData, selectedFile);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
          {editingProduct ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM SẢN PHẨM MỚI'}
        </h3>
        {fileError && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px' }}>{fileError}</div>}
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tên sản phẩm *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Thương hiệu *</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Trạng thái</label>
              <select name="status" value={formData.status.toString()} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <option value="true">Đang bán</option>
                <option value="false">Dừng bán</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Giá bán *</label>
              <input type="number" name="price" required value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Tồn kho *</label>
              <input type="number" name="stockQuantity" required value={formData.stockQuantity} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Mô tả</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Hình ảnh (.png, .jpg)</label>
            <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '4px' }}>Hủy</button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};