import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
  CaseReducers,
  ThunkAction,
  Action,
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

type NoInfer<T> = [T][T extends any ? 0 : never];

export const createCrudSlice = <
  PrimaryKey = string,
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
      create(state: S) {
        state.isLoading = true;
      },
      createSuccess(state: S, action: PayloadAction<CreateSuccessAction<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
        state.selectedRecords = [action.payload.record];
      },
      update(state: S) {
        state.isLoading = true;
      },
      updateSuccess(state: S, action: PayloadAction<UpdateSuccessAction<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
      },
      getRecordById(state: S) {
        state.isLoading = true;
      },
      getRecordByIdSuccess(state: S, action: PayloadAction<GetRecordByIdActionSuccess<Entity>>) {
        state.isLoading = false;
        state.currentRecord = action.payload.record;
        state.selectedRecords = [action.payload.record];
      },
      delete(state: S) {
        state.isLoading = true;
      },
      deleteSuccess(state: S) {
        state.isLoading = false;
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

  const getRecordByIdThunk = (
    api: ConnectorCrud<Entity, PrimaryKey, CreateEntity, UpdateEntity>,
  ) => {
    return function (
      payload: GetRecordByIdAction<PrimaryKey>,
    ): ThunkAction<Promise<Entity>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.getRecordById(payload));
          const record = await api.getRecordById(payload.primaryKey);
          dispatch(actions.getRecordByIdSuccess({ record }));
          return record;
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  const createThunk = (api: ConnectorCrud<Entity, PrimaryKey, CreateEntity, UpdateEntity>) => {
    return function (
      payload: CreateAction<CreateEntity>,
    ): ThunkAction<Promise<Entity>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.create(payload));
          const record = await api.create(payload.values);
          dispatch(actions.createSuccess({ record }));
          return record as Entity;
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  const updateThunk = (api: ConnectorCrud<Entity, PrimaryKey, CreateEntity, UpdateEntity>) => {
    return function (
      payload: UpdateAction<PrimaryKey, UpdateEntity>,
    ): ThunkAction<Promise<Entity>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.update(payload));
          const record = await api.update(payload.primaryKey, payload.values);
          dispatch(actions.updateSuccess({ record }));
          return record as Entity;
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  const deleteThunk = (api: ConnectorCrud<Entity, PrimaryKey, CreateEntity, UpdateEntity>) => {
    return function (
      payload: DeleteAction<PrimaryKey>,
    ): ThunkAction<Promise<void>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.delete(payload));
          // build promise array
          const promises = payload.primaryKeys.map((primaryKey) => api.delete(primaryKey));
          // wait for all finish
          await Promise.all(promises);
          dispatch(actions.deleteSuccess());
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    thunk: {
      deleteThunk,
      updateThunk,
      createThunk,
      getRecordByIdThunk,
    },
  };
};
