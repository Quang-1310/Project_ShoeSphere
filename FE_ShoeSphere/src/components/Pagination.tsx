import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLast: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, isLast, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '16px' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          padding: '8px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.4 : 1
        }}
      >
        Trước
      </button>
      
      {Array.from({ length: totalPages }, (_, idx) => {
        const pageNum = idx + 1;
        const isActive = currentPage === pageNum;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isActive ? '#2563eb' : '#d1d5db',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: isActive ? '#2563eb' : '#ffffff',
              color: isActive ? '#ffffff' : '#374151',
              cursor: 'pointer'
            }}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          padding: '8px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: isLast ? 'not-allowed' : 'pointer',
          opacity: isLast ? 0.4 : 1
        }}
      >
        Sau
      </button>
    </div>
  );
};