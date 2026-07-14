export type User = {
    id?: number;
    fullName: string;
    email: string;
    password: string
}

export interface ApiDataResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
  status: string;
}

export interface ShoeResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  stockQuantity: number;
  imageUrl: string;
  status: boolean;
}

export interface PageResponseDTO<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}