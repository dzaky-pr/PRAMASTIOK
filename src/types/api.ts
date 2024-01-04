import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    toastify?: boolean;
    loadingMessage?: string;
  }
}

export type ApiResponse<TData> = {
  status: boolean;
  message: string;
  data: TData;
};

export type ApiError = {
  status: boolean;
  message: string;
  error: string;
};

export interface ApiReturn<T> {
  data: T;
  message: string;
}

export type UninterceptedApiError = {
  message: string | Record<string, string[]>;
};

type PaginateData<Data> = {
  content: Data;
};

export interface PaginatedApiResponse<DataType> {
  code: number;
  success: string;
  data: PaginateData<DataType>;
}
