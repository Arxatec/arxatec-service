// src/utils/pagination.ts
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export type PaginationParams = {
  page: number;
  limit: number;
  skip: number;
};

export type PaginationMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

function toInt(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) {
    return parseInt(v, 10);
  }
  return undefined;
}

function getPaginationParams(query: {
  page?: unknown;
  limit?: unknown;
}): PaginationParams {
  const pageParsed = toInt(query.page);
  const limitParsed = toInt(query.limit);

  const page = Math.max(pageParsed ?? DEFAULT_PAGE, 1);
  const rawLimit = limitParsed ?? DEFAULT_LIMIT;
  const limit = rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    totalItems: total,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export const Pagination = { getPaginationParams, buildPaginationMeta };
