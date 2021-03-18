import { SearchRequest } from "@jfront/core-rest";

export interface SetSearchTemplateAction<V> {
  searchTemplate: SearchRequest<V>;
  callback?: (searchTemplate?: SearchRequest<V>) => void;
}

export interface PostSearchRequestAction<V> {
  searchTemplate: SearchRequest<V>;
  onSuccess?: (payload: PostSearchRequestSuccessAction<V>) => void;
  onFailure?: (error: any) => void;
}

export interface PostSearchRequestSuccessAction<V> {
  searchTemplate: SearchRequest<V>;
  searchId: string;
}

export interface GetResultSetAction<T> {
  searchId: string;
  pageSize: number;
  pageNumber: number;
  onSuccess?: (payload: SearchSuccessAction<T>) => void;
  onFailure?: (error: any) => void;
}

export interface SearchAction<V, T> {
  searchTemplate: SearchRequest<V>;
  pageSize: number;
  pageNumber: number;
  onSuccess?: (payload: SearchSuccessAction<T>) => void;
  onFailure?: (error: any) => void;
}

export interface SearchSuccessAction<T> {
  records: T[];
  resultSetSize: number;
}

export interface PostSearchAction<V, T> {
  searchTemplate: SearchRequest<V>;
  pageSize: number;
  pageNumber: number;
  onSuccess?: (payload: SearchSuccessAction<T>) => void;
  onFailure?: (error: any) => void;
}
