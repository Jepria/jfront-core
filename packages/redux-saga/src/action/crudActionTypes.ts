export interface CreateAction<T> {
  values: T;
  successCb?: (record: any) => void;
  failureCb?: (error: any) => void;
}

export interface CreateSuccessAction<T> {
  record: T;
}

export interface UpdateAction<P, T> {
  primaryKey: P;
  values: T;
  successCb?: (record: any) => void;
  failureCb?: (error: any) => void;
}

export interface UpdateSuccessAction<T> {
  record: T;
}

export interface DeleteAction<P> {
  primaryKeys: P[];
  successCb?: () => void;
  failureCb?: (error: any) => void;
}

export interface GetRecordByIdAction<P, T> {
  primaryKey: P;
  successCb?: (record: T) => void;
  failureCb?: (error: any) => void;
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
