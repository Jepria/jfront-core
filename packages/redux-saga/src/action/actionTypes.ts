export interface FailureAction<T> {
  error: T;
}

export interface GetOptionsAction {
  params?: any;
}
export interface GetOptionsActionSuccess<T> {
  options: Array<T>;
}
