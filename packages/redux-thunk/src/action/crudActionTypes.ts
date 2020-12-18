export interface CreateAction<T> {
  values: T;
}

export interface CreateSuccessAction<T> {
  record: T;
}

export interface UpdateAction<P, T> {
  primaryKey: P;
  values: T;
}

export interface UpdateSuccessAction<T> {
  record: T;
}

export interface DeleteAction<P> {
  primaryKeys: P[];
}

export interface GetRecordByIdAction<P> {
  primaryKey: P;
}

export interface GetRecordByIdActionSuccess<T> {
  record: T;
}

export interface SetCurrentRecordAction<T> {
  currentRecord: T;
}

export interface SelectRecordsAction<T> {
  selectedRecords: T[];
}
