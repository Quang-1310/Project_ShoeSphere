import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Header } from "../components/Header";
import { updateDeliveryInfo } from "../api/userAPI";
import { fetchProfileMe } from "../api/loginAPI";
import type { AppDispatch, RootState } from "../redux/store/store";

export const DeliveryProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.authSlice);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });

  useEffect(() => {
    if (!user) dispatch(fetchProfileMe());
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        fullName: user.fullName,
        phone: user.phone,
        address: user.address || "",
      });
      setIsEditing(!user.address);
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateDeliveryInfo(form);
      await dispatch(fetchProfileMe()).unwrap();
      setIsEditing(false);
      await Swal.fire({
        icon: "success",
        title: "Đã lưu thông tin giao hàng",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Không thể lưu",
        text: String(error),
      });
    }
  };

  if (loading || !user)
    return (
      <>
        <Header
          onAuthWarning={(action) =>
            Swal.fire({
              icon: "warning",
              title: "Cần đăng nhập",
              text: `Bạn cần đăng nhập để ${action}.`,
            })
          }
        />
        <p style={{ padding: "32px", textAlign: "center" }}>
          Đang tải thông tin...
        </p>
      </>
    );

  return (
    <>
      <Header
        onAuthWarning={(action) =>
          Swal.fire({
            icon: "warning",
            title: "Cần đăng nhập",
            text: `Bạn cần đăng nhập để ${action}.`,
          })
        }
      />
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          background: "#f8fafc",
          padding: "40px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "32px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            fontFamily: "sans-serif",
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              marginBottom: "28px",
              paddingBottom: "20px",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h2 style={{ margin: 0, color: "#0f172a" }}>Thông tin giao hàng</h2>
            <p
              style={{ margin: "8px 0 0", color: "#64748b", fontSize: "14px" }}
            >
              Thông tin này sẽ được sử dụng khi bạn đặt đơn hàng.
            </p>
          </div>
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              style={{ display: "grid", gap: "16px" }}
            >
              <label style={{ fontWeight: 600, color: "#334155" }}>
                Họ tên
                <input
                  required
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "11px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                />
              </label>
              <label style={{ fontWeight: 600, color: "#334155" }}>
                Số điện thoại
                <input
                  required
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "11px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                  }}
                />
              </label>
              <label style={{ fontWeight: 600, color: "#334155" }}>
                Địa chỉ
                <textarea
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "8px",
                    padding: "11px 12px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    minHeight: "100px",
                    resize: "vertical",
                  }}
                />
              </label>
              <div>
                <button
                  type="submit"
                  style={{
                    padding: "11px 20px",
                    background: "#2563eb",
                    color: "#fff",
                    border: 0,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Lưu thông tin
                </button>
                {user.address && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      marginLeft: "10px",
                      padding: "11px 20px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              <div
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <strong>Họ tên</strong>
                <div style={{ marginTop: "5px", color: "#475569" }}>
                  {user.fullName}
                </div>
              </div>
              <div
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <strong>Số điện thoại</strong>
                <div style={{ marginTop: "5px", color: "#475569" }}>
                  {user.phone}
                </div>
              </div>
              <div
                style={{
                  padding: "14px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <strong>Địa chỉ</strong>
                <div style={{ marginTop: "5px", color: "#475569" }}>
                  {user.address}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  justifySelf: "start",
                  marginTop: "8px",
                  padding: "11px 20px",
                  background: "#2563eb",
                  color: "#fff",
                  border: 0,
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
