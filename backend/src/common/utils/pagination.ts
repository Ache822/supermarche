import { Model, Document } from "mongoose";
import { Request } from "express";

export interface PaginationResult<T> {
  data: T[];
  meta: {
    totalDocuments: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginationOptions {
  populate?: any;
  select?: string | string[];
  sort?: string | Record<string, any>;
  defaultSort?: string | Record<string, any>;
}

/**
 * Standard Production Utility for Mongoose Model Pagination
 * Calculates page/limit offsets, executes parallel queries, and returns formatted metadata.
 */
export const getPaginatedData = async <T extends Document>(
  req: Request,
  model: Model<T>,
  queryFilters: any = {},
  options: PaginationOptions = {},
): Promise<PaginationResult<T>> => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const rawLimit = parseInt(req.query.limit as string, 10) || 10;
  const limit = Math.min(100, Math.max(1, rawLimit)); // Cap limit between 1 and 100
  const skip = (page - 1) * limit;

  const sort =
    typeof req.query.sort === "string"
      ? req.query.sort
      : options.sort || options.defaultSort || "-createdAt";

  let data: any[] = [];
  let totalDocuments = 0;

  try {
    let query: any = model.find(queryFilters);
    if (options.populate) query = query.populate(options.populate);
    if (options.select) query = query.select(options.select);
    if (sort) query = query.sort(sort as any);

    const [dbData, count] = await Promise.all([
      query.skip(skip).limit(limit).lean(),
      model.countDocuments(queryFilters),
    ]);

    data = dbData;
    totalDocuments = count;
  } catch (error) {
    data = [];
    totalDocuments = 0;
  }

  const totalPages = Math.ceil(totalDocuments / limit) || 1;

  return {
    data: data as unknown as T[],
    meta: {
      totalDocuments,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
