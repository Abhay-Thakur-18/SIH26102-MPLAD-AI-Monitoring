import { v4 as uuid } from "uuid";

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  requestId?: string;
};

export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  meta: ApiMeta | null;
  errors: unknown;
  timestamp: string;

  constructor(params: {
    success: boolean;
    message: string;
    data?: T | null;
    meta?: ApiMeta | null;
    errors?: unknown;
  }) {
    this.success = params.success;
    this.message = params.message;
    this.data = params.data ?? null;
    this.meta = params.meta ?? null;
    this.errors = params.errors ?? null;
    this.timestamp = new Date().toISOString();
  }
}

export const ok = <T>(message: string, data?: T, meta?: ApiMeta) =>
  new ApiResponse({ success: true, message, data: data ?? null, meta: meta ?? null });

export const fail = (message: string, errors?: unknown, meta?: ApiMeta) =>
  new ApiResponse({ success: false, message, data: null, errors: errors ?? null, meta: meta ?? null });

export const newRequestId = (): string => uuid();
