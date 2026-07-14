import React, { useState } from 'react';
import type { LoginRequest } from '../api/loginAPI';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  isLoading: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa chữ báo lỗi đỏ khi người dùng bắt đầu nhập lại
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Kiểm tra Email (Khớp hoàn toàn validation ở LoginRequestDTO.java)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
    }

    // 2. Kiểm tra Mật khẩu
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // Các thuộc tính Style đồng bộ giao diện
  const rowContainerStyle = { marginBottom: '20px' };
  const rowStyle = { display: 'flex', alignItems: 'center' };
  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b',
  };
  const inputContainerStyle = { position: 'relative' as const, flex: 1 };
  const errorTextStyle = {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '6px',
    marginLeft: '100px',
    display: 'block',
    fontWeight: '500',
  };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      {/* Ô nhập Email */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}><Mail size={18} color="#64748b" /> Email</label>
          <div style={inputContainerStyle}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                border: errors.email ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </div>
        {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
      </div>

      {/* Ô nhập Mật khẩu */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}><Lock size={18} color="#64748b" /> Mật khẩu</label>
          <div style={inputContainerStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '40px',
                fontSize: '14px',
                border: errors.password ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '8px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#64748b',
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>
        {errors.password && <span style={errorTextStyle}>{errors.password}</span>}
      </div>

      {/* Nút bấm Đăng nhập */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
          marginTop: '10px',
        }}
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
};

export default LoginForm;