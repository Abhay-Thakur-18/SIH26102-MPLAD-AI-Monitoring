export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export const normalizePagination = (query: PaginationQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginationMeta = (total: number, page: number, limit: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 1
});
