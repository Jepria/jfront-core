import {
  ActionReducerMapBuilder,
  CaseReducers,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { ConnectorSearch } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
  SearchAction,
  SearchSuccessAction,
  SetSearchTemplateAction,
} from "../action/searchActionTypes";
import { SearchState } from "../types";
import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";

type NoInfer<T> = [T][T extends any ? 0 : never];

export const createSearchSlice = <
  SearchTemplate = any,
  Entity = any,
  S extends SearchState<SearchTemplate, Entity> = SearchState<SearchTemplate, Entity>,
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
      setSearchTemplate(state: S, action: PayloadAction<SetSearchTemplateAction<SearchTemplate>>) {
        state.searchRequest = action.payload.searchTemplate;
      },
      search(state: S, action: PayloadAction<SearchAction<SearchTemplate, Entity>>) {
        state.isLoading = true;
        if (action.payload.searchTemplate != null) {
          state.searchRequest = action.payload.searchTemplate;
        }
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.records = [];
      },
      searchSuccess(state: S, action: PayloadAction<SearchSuccessAction<Entity>>) {
        state.isLoading = false;
        state.records = action.payload.records;
        state.resultSetSize = action.payload.resultSetSize;
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

  const createSagaMiddleware = (api: ConnectorSearch<Entity>) => {
    function* setSearchTemplate(action: PayloadAction<SetSearchTemplateAction<SearchTemplate>>) {
      if (action.payload.callback) {
        yield call(action.payload.callback, action.payload.searchTemplate);
      }
    }

    function* search(action: PayloadAction<SearchAction<SearchTemplate, Entity>>) {
      try {
        const template = { ...action.payload.searchTemplate.template };
        for (const param in template) {
          if (template[param] === undefined || template[param] === null) {
            delete template[param];
          }
        }
        const query = new URLSearchParams({
          ...template,
          page: String(action.payload.pageNumber),
          pageSize: String(action.payload.pageSize),
        });
        action.payload.searchTemplate.listSortConfiguration?.forEach((sortConfig) =>
          query.append("sort", `${sortConfig.columnName},${sortConfig.sortOrder}`),
        );
        const result = yield call(api.search, query.toString());
        yield put(
          actions.searchSuccess({
            records: result.resultsetSize > 0 ? result.data : [],
            resultSetSize: result.resultsetSize,
          }),
        );
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, {
            records: result.data,
            resultSetSize: result.resultsetSize,
          });
        }
      } catch (error) {
        yield put(actions.failure({ error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    return function* saga() {
      yield all([
        yield takeEvery(actions.setSearchTemplate.type, setSearchTemplate),
        yield takeLatest(actions.search.type, search),
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
