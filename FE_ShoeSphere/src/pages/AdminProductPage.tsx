import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store/store";
import {
  getAdminShoesThunk,
  createAdminShoeThunk,
  updateAdminShoeThunk,
  deleteAdminShoeThunk,
} from "../api/adminShoeAPI";
import { setCurrentPage, setSearchTerm } from "../redux/slices/adminShoeSlice";
import { AdminShoeTable } from "../components/AdminShoeTable";
import { AdminShoeModal } from "../components/AdminShoeModal";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

export const AdminProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shoes, currentPage, totalPages, searchTerm, loading } = useSelector(
    (state: RootState) => state.adminShoeSlice
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(
      getAdminShoesThunk({
        page: currentPage,
        size: 8,
        name: searchTerm || undefined,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handleSearchSubmit = () => {
    dispatch(setCurrentPage(1));
    dispatch(setSearchTerm(localSearch));
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    Swal.fire({
      title: "Xác nhận xóa mềm sản phẩm?",
      text: `Sản phẩm "${name}" sẽ bị chuyển trạng thái thành đã xóa.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Xóa sản phẩm",
      cancelButtonText: "Hủy",
      background: "#1e293b",
      color: "#f8fafc",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAdminShoeThunk(id))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Đã xóa!",
              text: "Sản phẩm đã được xóa mềm thành công.",
              icon: "success",
              background: "#1e293b",
              color: "#f8fafc",
            });
            dispatch(getAdminShoesThunk({ page: currentPage, size: 8 }));
          })
          .catch((err) => {
            Swal.fire({
              title: "Lỗi!",
              text: err || "Không thể xóa sản phẩm này.",
              icon: "error",
              background: "#1e293b",
              color: "#f8fafc",
            });
          });
      }
    });
  };

  const handleFormSubmit = (fields, file: File | null) => {
    setIsSubmitting(true);
    const multipartData = new FormData();
    const shoeRequestDTO = {
      name: fields.name,
      brand: fields.brand,
      price: parseFloat(fields.price),
      sizes: fields.sizes.map((s) => ({ size: parseInt(s.size), stockQuantity: parseInt(s.stockQuantity) })),
      description: fields.description,
      status: fields.status,
    };

    multipartData.append(
      "shoe",
      new Blob([JSON.stringify(shoeRequestDTO)], { type: "application/json" })
    );
    if (file) multipartData.append("image", file);

    if (selectedProduct === null) {
      // Create (POST)
      dispatch(createAdminShoeThunk(multipartData))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Thành công!",
            text: "Thêm mới sản phẩm thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "#1e293b",
            color: "#f8fafc",
          });
          setIsModalOpen(false);
          dispatch(getAdminShoesThunk({ page: currentPage, size: 8 }));
        })
        .catch((err) => {
          Swal.fire({
            title: "Lỗi thêm mới!",
            text: err || "Đã xảy ra lỗi trong quá trình thêm mới.",
            icon: "error",
            background: "#1e293b",
            color: "#f8fafc",
          });
        })
        .finally(() => setIsSubmitting(false));
    } else {
      // Update (PUT)
      dispatch(updateAdminShoeThunk({ id: selectedProduct.id, multipartData }))
        .unwrap()
        .then(() => {
          Swal.fire({
            title: "Thành công!",
            text: "Cập nhật sản phẩm thành công!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            background: "#1e293b",
            color: "#f8fafc",
          });
          setIsModalOpen(false);
          dispatch(getAdminShoesThunk({ page: currentPage, size: 8 }));
        })
        .catch((err) => {
          Swal.fire({
            title: "Lỗi cập nhật!",
            text: err || "Đã xảy ra lỗi trong quá trình cập nhật.",
            icon: "error",
            background: "#1e293b",
            color: "#f8fafc",
          });
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  return (
    <div style={{ padding: "32px", backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px", background: "linear-gradient(90deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            👟 Quản Lý Danh Sách Sản Phẩm
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "14px" }}>
            Quản lý kho hàng, cập nhật thông tin sản phẩm, đơn giá và danh mục giày ShoeSphere
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 22px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Plus size={20} />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "20px", marginBottom: "28px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm giày..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
              color: "#f8fafc",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <button
          onClick={handleSearchSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          Tìm kiếm
        </button>

        {searchTerm && (
          <button
            onClick={() => {
              setLocalSearch("");
              dispatch(setSearchTerm(""));
            }}
            style={{
              padding: "10px 16px",
              backgroundColor: "#334155",
              color: "#cbd5e1",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Product Table Container */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
          <div style={{ display: "inline-block", width: "40px", height: "40px", border: "4px solid #334155", borderTopColor: "#38bdf8", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <p style={{ marginTop: "16px" }}>Đang tải danh sách sản phẩm...</p>
        </div>
      ) : (
        <AdminShoeTable
          products={shoes}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "28px", gap: "10px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 14px",
              backgroundColor: currentPage === 1 ? "#1e293b" : "#334155",
              color: currentPage === 1 ? "#64748b" : "#f8fafc",
              border: "1px solid #334155",
              borderRadius: "8px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer"
            }}
          >
            <ChevronLeft size={18} /> Trước
          </button>
          
          <span style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: 600, padding: "0 10px" }}>
            Trang {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 14px",
              backgroundColor: currentPage === totalPages ? "#1e293b" : "#334155",
              color: currentPage === totalPages ? "#64748b" : "#f8fafc",
              border: "1px solid #334155",
              borderRadius: "8px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer"
            }}
          >
            Sau <ChevronRight size={18} />
          </button>
        </div>
      )}

      {isModalOpen && (
        <AdminShoeModal
          editingProduct={selectedProduct}
          isSubmitting={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};