import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetLoginState } from "../redux/slices/loginSlice";
import LoginForm from "../components/LoginForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser, fetchProfileMe, type LoginRequest } from "../api/loginAPI";
import type { AppDispatch, RootState } from "../redux/store/store";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Đọc dữ liệu từ kho lưu trữ redux
  const { status } = useSelector((state: RootState) => state.loginSlice);

  const handleLoginSubmit = (data: LoginRequest) => {
    // 1. Thực hiện gửi yêu cầu đăng nhập lấy Token
    dispatch(loginUser(data))
      .then(() => {
        // 2. Lấy Token thành công, gọi tiếp API /auth/me để lấy Profile người dùng
        dispatch(fetchProfileMe())
          .unwrap()
          .then((userProfile) => {
            toast.success("Đăng nhập hệ thống thành công!");

            // 3. Điều hướng dựa theo chuỗi Role duy nhất trả về từ Backend
            if (userProfile.role === "ADMIN") {
              navigate("/admin/products");
            } else {
              navigate("/");
            }
          })
          .catch((profileErr) => {
            toast.error(
              profileErr || "Không thể xác thực thông tin tài khoản!"
            );
          });
      })
      .catch((loginErr) => {
        toast.error(loginErr || "Đăng nhập hệ thống thất bại!");
      });
  };

  useEffect(() => {
    // Dọn dẹp trạng thái lỗi cũ nếu có khi vào trang
    dispatch(resetLoginState());
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "sans-serif",
      }}
    >
      <ToastContainer />
      <div
        style={{
          width: "550px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1e293b",
              margin: "0 0 8px 0",
            }}
          >
            Chào mừng trở lại!
          </h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Đăng nhập hệ thống ShoeSphere để tiếp tục mua sắm tuyệt vời!
          </p>
        </div>

        {/* Nhúng form vào */}
        <LoginForm
          onSubmit={handleLoginSubmit}
          isLoading={status === "loading"}
        />

        <div
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#2563eb", fontWeight: "600", cursor: "pointer" }}
          >
            Đăng ký ngay
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
