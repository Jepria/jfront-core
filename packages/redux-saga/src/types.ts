import { SearchRequest } from "@jfront/core-rest";

export type EntityState<T> = {
  isLoading: boolean;
  currentRecord?: T;
  selectedRecords: T[];
  error?: any;
};

export type SearchState<V, T> = {
  isLoading: boolean;
  searchId?: string;
  searchTemplate?: SearchRequest<V>;
  resultSetSize?: number;
  records: T[];
  error?: any;
};
