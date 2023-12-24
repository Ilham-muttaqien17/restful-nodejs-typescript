import type { Request } from 'express';

/**
 * Create pagination params
 * @param req - Axios Request
 * @returns Object of pagination params - page, limit, col, direction, offset
 */
export const buildPaginationParams = (req: Request) => {
  const { query } = req;
  const limit = parseInt(query.per_page as string, 10) || 10;
  const page = parseInt(query.page as string, 10) || 1;
  const offset = limit * (page - 1);
  const col = (query.col as string) || 'id';
  const direction = (query.direction as string) || 'ASC';

  return { limit, page, col, direction, offset };
};
