export interface CreateAction<T> {
  values: T;
  onSuccess?: (record: any) => void;
  onFailure?: (error: any) => void;
}

export interface CreateSuccessAction<T> {
  record: T;
}

export interface UpdateAction<P, T> {
  primaryKey: P;
  values: T;
  onSuccess?: (record: any) => void;
  onFailure?: (error: any) => void;
}

export interface UpdateSuccessAction<T> {
  record: T;
}

export interface DeleteAction<P> {
  primaryKeys: P[];
  onSuccess?: () => void;
  onFailure?: (error: any) => void;
}

export interface GetRecordByIdAction<P, T> {
  primaryKey: P;
  onSuccess?: (record: T) => void;
  onFailure?: (error: any) => void;
}

export interface GetRecordByIdActionSuccess<T> {
  record: T;
}

export interface SetCurrentRecordAction<T> {
  currentRecord: T;
  callback?: (record: T) => void;
}

export interface SelectRecordsAction<T> {
  selectedRecords: T[];
  callback?: (selectedRecords: T[]) => void;
}
