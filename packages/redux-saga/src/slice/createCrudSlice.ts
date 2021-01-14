import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
  CaseReducers,
} from "@reduxjs/toolkit";
import { ConnectorCrud } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
  SetCurrentRecordAction,
  CreateAction,
  UpdateAction,
  GetRecordByIdAction,
  GetRecordByIdActionSuccess,
  DeleteAction,
  SelectRecordsAction,
  CreateSuccessAction,
  UpdateSuccessAction,
} from "../action/crudActionTypes";
import { EntityState } from "../types";
import { put, call, all, takeEvery } from "redux-saga/effects";

type NoInfer<T> = [T][T extends any ? 0 : never];

export const createCrudSlice = <
  PrimaryKey = any,
  Entity = any,
  CreateEntity = Entity,
  UpdateEntity = Entity,
  S extends EntityState<Entity> = EntityState<Entity>,
  Reducers extends SliceCaseReducers<S> = SliceCaseReducers<S>
>({
  name = "",
  initialState,
  reducers = {} as Reducers & ValidateSliceCaseReducers<S, Reducers>,
  extraReducers = {} as
    | CaseReducers<NoInfer<S>, any>
    | ((builder: ActionReducerMapBuilder<NoInfer<S>>) => void),
}: {
  name: string;
  initialState: S;
  reducers?: Reducers & ValidateSliceCaseReducers<S, Reducers>;
  extraReducers?:
    | CaseReducers<NoInfer<S>, any>
    | ((builder: ActionReducerMapBuilder<NoInfer<S>>) => void);
}) => {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setCurrentRecord(state: S, action: PayloadAction<SetCurrentRecordAction<Entity>>) {
        state.currentRecord = action.payload.currentRecord;
      },
      selectRecords(state: S, action: PayloadAction<SelectRecordsAction<Entity>>) {
        state.selectedRecords = action.payload.selectedRecords;
      },
      create(state: S, action: PayloadAction<CreateAction<CreateEntity>>) {
        state.isLoading = true;
      },
      createSuccess(state: S, action: PayloadAction<CreateSuccessAction<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
      },
      update(state: S, action: PayloadAction<UpdateAction<PrimaryKey, UpdateEntity>>) {
        state.isLoading = true;
      },
      updateSuccess(state: S, action: PayloadAction<UpdateSuccessAction<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
      },
      getRecordById(state: S, action: PayloadAction<GetRecordByIdAction<PrimaryKey, Entity>>) {
        state.isLoading = true;
      },
      getRecordByIdSuccess(state: S, action: PayloadAction<GetRecordByIdActionSuccess<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
        state.selectedRecords = [];
      },
      delete(state: S, action: PayloadAction<DeleteAction<PrimaryKey>>) {
        state.isLoading = true;
      },
      deleteSuccess(state: S) {
        state.isLoading = true;
        state.currentRecord = undefined;
        state.selectedRecords = [];
      },
      failure(state: S, action: PayloadAction<FailureAction<any>>) {
        state.isLoading = false;
        state.error = action.payload.error;
      },
      ...reducers,
    },
    extraReducers: {
      ...extraReducers,
    },
  });

  const actions = slice.actions as any; //cast to any, unknown TS issue

  const createSagaMiddleware = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    function* create(action: PayloadAction<CreateAction<CreateEntity>>) {
      try {
        const createdRecord = yield call(api.create, action.payload.values);
        yield put(actions.createSuccess({ record: createdRecord }));
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, createdRecord);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* update(action: PayloadAction<UpdateAction<PrimaryKey, UpdateEntity>>) {
      try {
        const updatedRecord = yield call(
          api.update,
          String(action.payload.primaryKey),
          action.payload.values,
        );
        yield put(actions.updateSuccess({ record: updatedRecord }));
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, updatedRecord);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* _delete(action: PayloadAction<DeleteAction<PrimaryKey>>) {
      try {
        yield all(
          action.payload.primaryKeys.map((primaryKey) => call(api.delete, String(primaryKey))),
        );
        yield put(actions.deleteSuccess());
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* getRecordById(action: PayloadAction<GetRecordByIdAction<PrimaryKey, Entity>>) {
      try {
        const record = yield call(api.getRecordById, String(action.payload.primaryKey));
        yield put(actions.getRecordByIdSuccess({ record }));
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, record);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* setCurrentRecord(action: PayloadAction<SetCurrentRecordAction<Entity>>) {
      if (action.payload.callback) {
        yield call(action.payload.callback, action.payload.currentRecord);
      }
    }

    function* selectRecords(action: PayloadAction<SelectRecordsAction<Entity>>) {
      if (action.payload.callback) {
        yield call(action.payload.callback, action.payload.selectedRecords);
      }
    }

    return function* saga() {
      yield all([
        yield takeEvery(actions.create.type, create),
        yield takeEvery(actions.update.type, update),
        yield takeEvery(actions.delete.type, _delete),
        yield takeEvery(actions.getRecordById.type, getRecordById),
        yield takeEvery(actions.setCurrentRecord.type, setCurrentRecord),
        yield takeEvery(actions.selectRecords.type, selectRecords),
      ]);
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    createSagaMiddleware,
  };
};
