import React, { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import type { ShoeResponseDTO } from "../pages/type";

interface ModalProps {
  editingProduct: ShoeResponseDTO | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (formData: any, file: File | null) => void;
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
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, { size: 40, stockQuantity: 10 }] }));
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '28px', borderRadius: '20px', width: '560px', maxHeight: '90vh', overflowY: 'auto', color: '#f8fafc', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>
            {editingProduct ? '✏️ CẬP NHẬT SẢN PHẨM' : '➕ THÊM SẢN PHẨM MỚI'}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {fileError && <div style={{ color: '#f87171', marginBottom: '16px', fontSize: '14px', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>{fileError}</div>}

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Tên sản phẩm *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Thương hiệu *</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }} />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Trạng thái</label>
              <select name="status" value={formData.status.toString()} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#38bdf8', fontWeight: 'bold', fontSize: '14px', outline: 'none' }}>
                <option value="true" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Đang bán</option>
                <option value="false" style={{ backgroundColor: '#1e293b', color: '#fff' }}>Dừng bán</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Đơn giá (VNĐ) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#4ade80', fontWeight: 'bold', fontSize: '14px', outline: 'none' }} />
          </div>

          {/* Size management */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Kích cỡ & Tồn kho *</label>
              <button type="button" onClick={handleAddSize} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', backgroundColor: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                <Plus size={14} /> Thêm Size
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
              {formData.sizes.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="number" placeholder="Size (39-45)" value={s.size} onChange={(e) => handleSizeChange(idx, 'size', parseInt(e.target.value) || 0)} required style={{ flex: 1, padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px' }} />
                  <input type="number" placeholder="Tồn kho" value={s.stockQuantity} onChange={(e) => handleSizeChange(idx, 'stockQuantity', parseInt(e.target.value) || 0)} required style={{ flex: 1, padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px' }} />
                  <button type="button" onClick={() => handleRemoveSize(idx)} style={{ padding: '8px', backgroundColor: 'rgba(239,68,68,0.2)', color: '#f87171', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.sizes.length === 0 && <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', padding: '8px' }}>Chưa có size nào. Bấm "+ Thêm Size" để tạo.</div>}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Mô tả sản phẩm</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '14px', color: '#cbd5e1' }}>Hình ảnh sản phẩm (.png, .jpg)</label>
            <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} style={{ color: '#cbd5e1', fontSize: '13px' }} />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{ padding: '10px 18px', backgroundColor: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};