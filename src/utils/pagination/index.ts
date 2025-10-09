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
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
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
  totalArg: number,
  pageArg: number,
  limitArg: number
): PaginationMeta {
  const totalPages = Math.max(Math.ceil(totalArg / limitArg), 1);
  return {
    page: pageArg,
    limit: limitArg,
    total: totalArg,
    total_pages: totalPages,
    has_next_page: pageArg < totalPages,
    has_prev_page: pageArg > 1,
  };
}

export const Pagination = { getPaginationParams, buildPaginationMeta };
