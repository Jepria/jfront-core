import { SearchRequest } from "@jfront/core-rest";

export interface SetSearchTemplateAction<V> {
  searchTemplate: SearchRequest<V>;
}

export interface PostSearchRequestAction<V> {
  searchTemplate: SearchRequest<V>;
}

export interface PostSearchRequestSuccessAction<V> {
  searchTemplate: SearchRequest<V>;
  searchId: string;
}

export interface SearchAction {
  searchId: string;
  pageSize: number;
  pageNumber: number;
}

export interface PostSearchAction<V> {
  searchTemplate: SearchRequest<V>;
  pageSize: number;
  pageNumber: number;
}

export interface SearchSuccessAction<T> {
  records: T[];
  resultSetSize: number;
}
