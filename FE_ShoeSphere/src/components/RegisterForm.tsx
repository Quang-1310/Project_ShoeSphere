import React, { useState } from "react";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import type { RegisterRequest } from "../api/registerAPI";

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  isLoading: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Trạng thái ẩn/hiện mật khẩu
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Validate Họ và tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = "Họ và tên không vượt quá 50 ký tự";
    }

    // 2. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    // 3. Validate Số điện thoại (Regex chuẩn Việt Nam tương tự Backend)
    const phoneRegex =
      /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng Việt Nam";
    }

    // 4. Validate Mật khẩu
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
    }

    // 5. Validate Xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
    }

    setErrors(newErrors);

    // Nếu object newErrors không có thuộc tính nào => Form hoàn toàn hợp lệ
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!agreeTerms) {
      toast.error(
        "Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật!"
      );
      return;
    }

    const submitData: RegisterRequest = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    onSubmit(submitData);
  };

  // Style chung cho các hàng nhập liệu

  const rowContainerStyle = {
    marginBottom: "20px",
  };

  const rowStyle = {
    display: "flex",
    alignItems: "center",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "140px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#1e293b",
  };

  const inputContainerStyle = {
    position: "relative" as const,
    flex: 1,
  };

  // const inputStyle = {
  //   width: '100%',
  //   padding: '12px 16px',
  //   fontSize: '14px',
  //   border: '1px solid #e2e8f0',
  //   borderRadius: '8px',
  //   boxSizing: 'border-box' as const,
  //   outline: 'none',
  //   backgroundColor: '#fff',
  //   color: '#334155',
  // };

  const errorTextStyle = {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
    marginLeft: "140px", // Đẩy lùi sang phải bằng đúng độ rộng của nhãn Label cho thẳng hàng
    display: "block",
    fontWeight: "500",
  };

  // const eyeIconStyle = {
  //   position: 'absolute' as const,
  //   right: '12px',
  //   top: '50%',
  //   transform: 'translateY(-50%)',
  //   cursor: 'pointer',
  //   color: '#64748b',
  // };

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      {" "}
      {/* Thêm noValidate để tắt tooltip mặc định của Chrome */}
      {/* Họ và tên */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>
            <User size={18} color="#64748b" /> Họ và tên
          </label>
          <div style={inputContainerStyle}>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: errors.fullName
                  ? "1px solid #ef4444"
                  : "1px solid #e2e8f0",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
        </div>
        {errors.fullName && (
          <span style={errorTextStyle}>{errors.fullName}</span>
        )}
      </div>
      {/* Email */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>
            <Mail size={18} color="#64748b" /> Email
          </label>
          <div style={inputContainerStyle}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: errors.email
                  ? "1px solid #ef4444"
                  : "1px solid #e2e8f0",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
        </div>
        {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
      </div>
      {/* Số điện thoại */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>
            <Phone size={18} color="#64748b" /> Số điện thoại
          </label>
          <div style={inputContainerStyle}>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại của bạn"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                border: errors.phone
                  ? "1px solid #ef4444"
                  : "1px solid #e2e8f0",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
        </div>
        {errors.phone && <span style={errorTextStyle}>{errors.phone}</span>}
      </div>
      {/* Mật khẩu */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>
            <Lock size={18} color="#64748b" /> Mật khẩu
          </label>
          <div style={inputContainerStyle}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px 16px",
                paddingRight: "40px",
                fontSize: "14px",
                border: errors.password
                  ? "1px solid #ef4444"
                  : "1px solid #e2e8f0",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#64748b",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>
        {errors.password && (
          <span style={errorTextStyle}>{errors.password}</span>
        )}
      </div>
      {/* Xác nhận mật khẩu */}
      <div style={rowContainerStyle}>
        <div style={rowStyle}>
          <label style={labelStyle}>
            <Lock size={18} color="#64748b" /> Xác nhận MK
          </label>
          <div style={inputContainerStyle}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                paddingRight: "40px",
                fontSize: "14px",
                border: errors.confirmPassword
                  ? "1px solid #ef4444"
                  : "1px solid #e2e8f0",
                borderRadius: "8px",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#64748b",
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>
        {errors.confirmPassword && (
          <span style={errorTextStyle}>{errors.confirmPassword}</span>
        )}
      </div>
      {/* Checkbox Điều khoản */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "24px",
          fontSize: "14px",
          color: "#334155",
          marginTop: "10px",
        }}
      >
        <input
          type="checkbox"
          id="terms"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          style={{ width: "16px", height: "16px", cursor: "pointer" }}
        />
        <label htmlFor="terms" style={{ cursor: "pointer" }}>
          Tôi đồng ý với{" "}
          <span style={{ color: "#2563eb", fontWeight: "500" }}>
            Điều khoản sử dụng
          </span>
        </label>
      </div>
      {/* Button Submit */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: isLoading ? "#93c5fd" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: isLoading ? "not-allowed" : "pointer",
          boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
        }}
      >
        {isLoading ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </form>
  );
};

export default RegisterForm;
