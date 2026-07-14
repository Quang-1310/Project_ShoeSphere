import type { ApiDataResponse, PageResponseDTO, ShoeResponseDTO } from '../pages/type';

const BASE_URL = 'http://localhost:8080/api/v1/shoes';

// 1. Hàm lấy danh sách sản phẩm (Có kèm bộ lọc và phân trang)
export const fetchShoes = async (
  filters: { name?: string; brand?: string; minPrice?: string; maxPrice?: string },
  page: number = 1,
  size: number = 9
): Promise<PageResponseDTO<ShoeResponseDTO>> => {
  const params = new URLSearchParams();
  
  if (filters.name) params.append('name', filters.name);
  if (filters.brand) params.append('brand', filters.brand);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  
  params.append('page', (page ?? 1).toString());
  params.append('size', (size ?? 9).toString());
  params.append('sortBy', 'id');
  params.append('direction', 'desc');

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');

  // Đóng gói ép kiểu dữ liệu trả về từ API và trả ra cục data phân trang (.data)
  const result: ApiDataResponse<PageResponseDTO<ShoeResponseDTO>> = await response.json();
  return result.data;
};

// 2. Hàm lấy chi tiết một đôi giày theo ID
export const fetchShoeDetail = async (id: number): Promise<ShoeResponseDTO> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error('Không thể tải chi tiết sản phẩm');

  const result: ApiDataResponse<ShoeResponseDTO> = await response.json();
  return result.data;
};