import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store/store';
import { getShoesThunk, getShoeDetailThunk} from '../api/homeAPI';
import { setFilters, setCurrentPage, clearSelectedShoe } from '../redux/slices/shoeSlice';

import { Header } from '../components/Header';
import { SidebarFilter } from '../components/SidebarFilter';
import { ShoeCard } from '../components/ShoeCard';
import { Pagination } from '../components/Pagination';
import { DetailModal } from '../components/DetailModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ShoeStorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shoesPage, selectedShoe, currentPage, filters, loading } = useSelector((state: RootState) => state.shoeSlice);

  useEffect(() => {
    dispatch(getShoesThunk());
  }, [dispatch, currentPage, filters]);

  const handleAuthWarning = (actionText: string) => {
    toast.warn(`Bạn cần đăng nhập để thực hiện hành động: "${actionText}"!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', color: '#1f2937', fontFamily: 'sans-serif' }}>
      <Header onAuthWarning={handleAuthWarning} />

      {/* Main Layout container */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px',
        display: 'flex',
        flexDirection: 'row',
        gap: '32px'
      }} className="main-content-layout">
        
        {/* Cột Trái Sidebar Lọc */}
        <div style={{ width: '280px', flexShrink: 0 }} className="sidebar-container">
          <SidebarFilter onApplyFilters={(f) => dispatch(setFilters(f))} />
        </div>

        {/* Cột Phải Danh Sách */}
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b7280', fontWeight: 500 }}>
              Đang tải danh sách giày từ hệ thống ShoesSphere...
            </div>
          ) : shoesPage && shoesPage.content.length > 0 ? (
            <>
              {/* Layout Grid chứa các thẻ giày đơn lẻ */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
              }}>
                {shoesPage.content.map((shoe) => (
                  <ShoeCard
                    key={shoe.id}
                    shoe={shoe}
                    onSelect={(id) => dispatch(getShoeDetailThunk(id))}
                    onAuthWarning={handleAuthWarning}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={shoesPage.totalPages}
                isLast={shoesPage.isLast}
                onPageChange={(p) => dispatch(setCurrentPage(p))}
              />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#6b7280' }}>
              Không tìm thấy đôi giày nào khớp với bộ lọc tìm kiếm của bạn!
            </div>
          )}
        </main>
      </div>

      {selectedShoe && (
        <DetailModal
          shoe={selectedShoe}
          onClose={() => dispatch(clearSelectedShoe())}
          onAuthWarning={handleAuthWarning}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
  
};