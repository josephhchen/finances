export * from './financial';
export * from './ui';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SortOrder = 'asc' | 'desc';

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  accounts?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
}