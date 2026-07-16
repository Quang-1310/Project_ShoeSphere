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

export interface ShoeSizeDTO {
  size: number;
  stockQuantity: number;
}

export interface ShoeResponseDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  sizes: ShoeSizeDTO[];
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

export interface UserResponseDTO {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  role: string; 
  status: boolean;
}
