import React, { useState } from 'react';

interface SidebarFilterProps {
  onApplyFilters: (filters: { name: string; brand: string; minPrice: string; maxPrice: string }) => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({ onApplyFilters }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters({ name, brand, minPrice, maxPrice });
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    color: '#6b7280',
    marginBottom: '4px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    outline: 'none'
  };

  return (
    <aside style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #f3f4f6',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Bộ lọc tìm kiếm
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Tên sản phẩm</label>
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Air Force 1..." style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Hãng sản xuất</label>
          <input 
            type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
            placeholder="Ví dụ: Nike, Adidas..." style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Khoảng giá (VNĐ)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Từ" style={inputStyle}
            />
            <span style={{ color: '#9ca3af' }}>-</span>
            <input 
              type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Đến" style={inputStyle}
            />
          </div>
        </div>

        <button type="submit" style={{
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          Áp dụng bộ lọc
        </button>
      </form>
    </aside>
  );
};