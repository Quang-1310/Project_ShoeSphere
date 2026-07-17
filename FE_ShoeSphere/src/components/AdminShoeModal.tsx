import React, { useState } from 'react';

import type { ShoeResponseDTO } from "../pages/type";

interface ModalProps {
  editingProduct: ShoeResponseDTO | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (formData, file: File | null) => void;
}

export const AdminShoeModal: React.FC<ModalProps> = ({ editingProduct, isSubmitting = false, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    brand: editingProduct?.brand || '',
    price: editingProduct?.price.toString() || '',
    sizes: editingProduct?.sizes || [],
    description: editingProduct?.description || '',
    status: editingProduct ? editingProduct.status : true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'status' ? value === 'true' : value }));
  };

  const handleAddSize = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, { size: 39, stockQuantity: 0 }] }));
  };

  const handleSizeChange = (index: number, field: 'size' | 'stockQuantity', value: number) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData(prev => ({ ...prev, sizes: newSizes }));
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
    if (formData.sizes.length === 0) {
      alert("Vui lòng thêm ít nhất một kích cỡ (size) cho sản phẩm!");
      return;
    }
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
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontWeight: 'bold' }}>
              Danh sách Kích cỡ (Size) *
              <button type="button" onClick={handleAddSize} style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>+ Thêm Size</button>
            </label>
            {formData.sizes.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input type="number" placeholder="Size (vd: 40)" value={s.size} onChange={(e) => handleSizeChange(idx, 'size', parseInt(e.target.value))} required style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <input type="number" placeholder="Số lượng" value={s.stockQuantity} onChange={(e) => handleSizeChange(idx, 'stockQuantity', parseInt(e.target.value))} required style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                <button type="button" onClick={() => handleRemoveSize(idx)} style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
              </div>
            ))}
            {formData.sizes.length === 0 && <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>Chưa có size nào. Vui lòng bấm "+ Thêm Size".</div>}
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
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '8px 16px', backgroundColor: '#9ca3af', color: '#fff', border: 'none', borderRadius: '4px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>Hủy</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};