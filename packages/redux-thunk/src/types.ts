import { SearchRequest } from "@jfront/core-rest";

export type EntityState<T> = {
  isLoading: boolean;
  currentRecord?: T;
  selectedRecords: T[];
  error?: any;
};

export type SessionSearchState<V, T> = {
  isLoading: boolean;
  searchId?: string;
  searchRequest?: SearchRequest<V>;
  pageSize: number;
  pageNumber: number;
  resultSetSize?: number;
  records: T[];
  error?: any;
};

export type SearchState<V, T> = {
  isLoading: boolean;
  searchRequest?: SearchRequest<V>;
  pageSize: number;
  pageNumber: number;
  resultSetSize?: number;
  records: T[];
  error?: any;
};
