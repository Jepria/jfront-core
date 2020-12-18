import { SearchRequest } from "@jfront/core-rest";

export interface SetSearchTemplateAction<V> {
  searchTemplate: SearchRequest<V>;
}

export interface PostSearchRequestAction<V> {
  searchTemplate: SearchRequest<V>;
  callback?: (searchId: string) => void;
}

export interface PostSearchRequestSuccessAction<V> {
  searchTemplate: SearchRequest<V>;
  searchId: string;
}

export interface SearchAction {
  searchId: string;
  pageSize: number;
  page: number;
}

export interface PostSearchAction<V> {
  searchTemplate: SearchRequest<V>;
  pageSize: number;
  page: number;
}

export interface SearchSuccessAction<T> {
  records: T[];
  resultSetSize: number;
}
