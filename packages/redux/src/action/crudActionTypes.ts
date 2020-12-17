export interface CreateAction<T> {
  values: T;
  callback?: (record: any) => void;
}

export interface CreateSuccessAction<T> {
  record: T;
}

export interface UpdateAction<P, T> {
  primaryKey: P;
  values: T;
  callback?: (record: any) => void;
}

export interface UpdateSuccessAction<T> {
  record: T;
}

export interface DeleteAction<P> {
  primaryKeys: P[];
  callback?: () => void;
}

export interface GetRecordByIdAction<P> {
  primaryKey: P;
  callback?: (record: any) => void;
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
