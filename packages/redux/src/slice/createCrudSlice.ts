import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
  CaseReducers,
  createAsyncThunk,
  AsyncThunk,
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
import { put, call, all, takeEvery, takeLatest } from "redux-saga/effects";

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
      getRecordById(state: S, action: PayloadAction<GetRecordByIdAction<PrimaryKey>>) {
        state.isLoading = true;
      },
      getRecordByIdSuccess(state: S, action: PayloadAction<GetRecordByIdActionSuccess<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
        state.selectedRecords = [];
      },
      remove(state: S, action: PayloadAction<DeleteAction<PrimaryKey>>) {
        state.isLoading = true;
      },
      removeSuccess(state: S) {
        state.isLoading = true;
        state.currentRecord = undefined;
        state.selectedRecords = [];
      },
      failure(state: S, action: FailureAction<any>) {
        state.isLoading = false;
        state.error = action.error;
      },
      ...reducers,
    },
    extraReducers: {
      [name + "/getRecordByIdThunk/pending"]: (state) => {
        state.isLoading = true;
      },
      [name + "/getRecordByIdThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.selectedRecords = [];
      },
      [name + "/getRecordByIdThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      },
      [name + "/createThunk/pending"]: (state, action) => {
        state.isLoading = true;
      },
      [name + "/createThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.selectedRecords = [];
      },
      [name + "/createThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      },
      [name + "/updateThunk/pending"]: (state, action) => {
        state.isLoading = true;
      },
      [name + "/updateThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.selectedRecords = [];
      },
      [name + "/updateThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      },
      [name + "/removeThunk/pending"]: (state, action) => {
        state.isLoading = true;
      },
      [name + "/removeThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.currentRecord = undefined;
        state.selectedRecords = [];
      },
      [name + "/removeThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      },
      ...extraReducers,
    },
  });

  const getRecordByIdThunk = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    return createAsyncThunk<Entity, GetRecordByIdAction<PrimaryKey>>(
      name + "/getRecordByIdThunk",
      async (payload, { rejectWithValue }) => {
        try {
          const response = await api.getRecordById(String(payload.primaryKey));
          return response;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
    );
  };

  const createThunk = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    return createAsyncThunk<Entity, CreateAction<CreateEntity>>(
      name + "/createThunk",
      async (payload, { rejectWithValue }) => {
        try {
          const response = await api.create(payload.values);
          return response as Entity;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
    );
  };

  const updateThunk = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    return createAsyncThunk<Entity, UpdateAction<PrimaryKey, UpdateEntity>>(
      name + "/updateThunk",
      async (payload, { rejectWithValue }) => {
        try {
          const response = await api.update(String(payload.primaryKey), payload.values);
          return response as Entity;
        } catch (error) {
          return rejectWithValue(error);
        }
      },
    );
  };

  const removeThunk = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    return createAsyncThunk<void, DeleteAction<PrimaryKey>>(
      name + "/removeThunk",
      async (payload, { rejectWithValue }) => {
        try {
          // build promise array
          const promises = payload.primaryKeys.map((primaryKey) => api.delete(String(primaryKey)));
          // wait for all finish
          await Promise.all(promises);
        } catch (error) {
          return rejectWithValue(error);
        }
      },
    );
  };

  const createSagaMiddleware = (api: ConnectorCrud<Entity, CreateEntity, UpdateEntity>) => {
    const actions = slice.actions as any;

    function* create(action: PayloadAction<CreateAction<CreateEntity>>) {
      try {
        const createdRecord = yield call(api.create, action.payload.values);
        yield put(actions.createSuccess({ record: createdRecord }));
        if (action.payload.callback) {
          yield call(action.payload.callback, createdRecord);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
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
        if (action.payload.callback) {
          yield call(action.payload.callback, updatedRecord);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
      }
    }

    function* remove(action: PayloadAction<DeleteAction<PrimaryKey>>) {
      try {
        yield all(
          action.payload.primaryKeys.map((primaryKey) => call(api.delete, String(primaryKey))),
        );
        yield put(actions.removeSuccess());
        if (action.payload.callback) {
          yield call(action.payload.callback);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
      }
    }

    function* getRecordById(action: PayloadAction<GetRecordByIdAction<PrimaryKey>>) {
      try {
        const record = yield call(api.getRecordById, String(action.payload.primaryKey));
        yield put(actions.getRecordByIdSuccess({ record }));
        if (action.payload.callback) {
          yield call(action.payload.callback, record);
        }
      } catch (error) {
        yield put(actions.failure({ error: error }));
      }
    }

    function* entityWatcher() {
      yield takeEvery(actions.create.type, create);
      yield takeEvery(actions.update.type, update);
      yield takeEvery(actions.remove.type, remove);
      yield takeEvery(actions.getRecordById, getRecordById);
    }

    return function* saga() {
      yield entityWatcher();
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    thunk: {
      removeThunk,
      updateThunk,
      createThunk,
      getRecordByIdThunk,
    },
    createSagaMiddleware,
  };
};
