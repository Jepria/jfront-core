export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const AUTHORIZATION_FAILED = 401;
export const ACCESS_DENIED = 403;
export const SERVER_ERROR = 500;

export interface BadRequest {
  type: typeof BAD_REQUEST;
  constraintViolations: Array<ConstraintViolation>;
}

export interface NotFound {
  type: typeof NOT_FOUND;
  url?: string;
}

export interface AuthorizationFailed {
  type: typeof AUTHORIZATION_FAILED;
  message?: string;
}

export interface AccessDenied {
  type: typeof ACCESS_DENIED;
  message?: string;
}

export interface ServerError {
  type: typeof SERVER_ERROR;
  errorCode?: number;
  errorId?: string;
  errorMessage?: string;
}

export type NetworkError = BadRequest |
  NotFound |
  AuthorizationFailed |
  AccessDenied |
  ServerError;

export type ConstraintViolation = {
  propertyPath: string;
  violationDescription: string;
}
export interface SearchRequest<Template> {
  template: Template;
  listSortConfiguration?: Array<ColumnSortConfiguration>;
}

export interface ColumnSortConfiguration {
  columnName: string;
  sortOrder: string;
}

export type Option<Value> = {
  name: string;
  value: Value;
}