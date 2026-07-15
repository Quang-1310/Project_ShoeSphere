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

  useEffect(() => {
    dispatch(
      getAdminShoesThunk({
        page: currentPage,
        size: 5,
        name: searchTerm || undefined,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const handleSearchSubmit = () => {
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

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này sẽ thực hiện xóa mềm sản phẩm này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý, xóa!",
      cancelButtonText: "Hủy"
    }).then((result) => {
      // Sửa lỗi: Thêm bọc ngoặc nhọn {} để gom nhóm logic khi nhấn Confirm
      if (result.isConfirmed) {
        dispatch(deleteAdminShoeThunk(id))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Đã xóa!",
              text: "Sản phẩm đã được xóa mềm thành công.",
              icon: "success",
            });
          })
          .catch((err) => {
            Swal.fire({
              title: "Lỗi!",
              text: err || "Không thể xóa sản phẩm này.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleFormSubmit = (fields, file: File | null) => {
    const multipartData = new FormData();
    const shoeRequestDTO = {
      name: fields.name,
      brand: fields.brand,
      price: parseFloat(fields.price),
      stockQuantity: parseInt(fields.stockQuantity),
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
            showConfirmButton: false
          });
          setIsModalOpen(false);
          dispatch(getAdminShoesThunk({ page: currentPage, size: 5 }));
        })
        .catch((err) => {
          Swal.fire({
            title: "Lỗi thêm mới!",
            text: err || "Đã xảy ra lỗi trong quá trình thêm mới.",
            icon: "error",
          });
        });
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
            showConfirmButton: false
          });
          setIsModalOpen(false);
          dispatch(getAdminShoesThunk({ page: currentPage, size: 5 }));
        })
        .catch((err) => {
          Swal.fire({
            title: "Lỗi cập nhật!",
            text: err || "Đã xảy ra lỗi trong quá trình cập nhật.",
            icon: "error",
          });
        });
    }
  };

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0, color: "#0f172a" }}>
          QUẢN LÝ DANH SÁCH SẢN PHẨM
        </h2>
        <button
          onClick={handleOpenAdd}
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Tìm tên giày..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearchSubmit}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Tìm
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <AdminShoeTable
          products={shoes}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "8px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setCurrentPage(currentPage - 1))}
          style={{ padding: "6px 12px" }}
        >
          Trước
        </button>
        <span style={{ alignSelf: "center" }}>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setCurrentPage(currentPage + 1))}
          style={{ padding: "6px 12px" }}
        >
          Sau
        </button>
      </div>

      {isModalOpen && (
        <AdminShoeModal
          editingProduct={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};