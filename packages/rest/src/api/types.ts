export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const AUTHORIZATION_FAILED = 401;
export const ACCESS_DENIED = 403;
export const SERVER_ERROR = 500;
export const UNKNOWN_ERROR = 1;

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
  error?: UnhandledError;
}

export interface UnknownError {
  type: typeof UNKNOWN_ERROR;
  errorCode?: number;
  message?: string;
  content?: any;
}

export type NetworkError = BadRequest |
  NotFound |
  AuthorizationFailed |
  AccessDenied |
  ServerError |
  UnknownError;

export type ConstraintViolation = {
  propertyPath: string;
  violationDescription: string;
}

export type UnhandledError = {
  errorCode?: number;
  errorId?: string;
  errorMessage?: string;
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