import {
  ActionReducerMapBuilder,
  CaseReducers,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { ConnectorSessionSearch } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
  GetResultSetAction,
  PostSearchAction,
  PostSearchRequestAction,
  PostSearchRequestSuccessAction,
  SearchAction,
  SearchSuccessAction,
  SetSearchTemplateAction,
} from "../action/searchActionTypes";
import { SessionSearchState } from "../types";
import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";

type NoInfer<T> = [T][T extends any ? 0 : never];

export const createSessionSearchSlice = <
  SearchTemplate = any,
  Entity = any,
  S extends SessionSearchState<SearchTemplate, Entity> = SessionSearchState<SearchTemplate, Entity>,
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
        state.searchId = undefined;
      },
      postSearchRequest(state: S, action: PayloadAction<PostSearchRequestAction<SearchTemplate>>) {
        state.isLoading = true;
        state.searchId = undefined;
      },
      postSearchRequestSuccess(
        state: S,
        action: PayloadAction<PostSearchRequestSuccessAction<SearchTemplate>>,
      ) {
        state.isLoading = false;
        state.searchRequest = action.payload.searchTemplate;
        state.searchId = action.payload.searchId;
      },
      getResultSet(state: S, action: PayloadAction<GetResultSetAction<Entity>>) {
        state.isLoading = true;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.records = [];
      },
      searchSuccess(state: S, action: PayloadAction<SearchSuccessAction<Entity>>) {
        state.isLoading = false;
        state.records = action.payload.records;
        state.resultSetSize = action.payload.resultSetSize;
      },
      postSearch(state: S, action: PayloadAction<PostSearchAction<SearchTemplate, Entity>>) {
        state.isLoading = true;
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

  const createSagaMiddleware = (api: ConnectorSessionSearch<Entity, SearchTemplate>) => {
    function* setSearchTemplate(action: PayloadAction<SetSearchTemplateAction<SearchTemplate>>) {
      if (action.payload.callback) {
        yield call(action.payload.callback, action.payload.searchTemplate);
      }
    }

    function* postSearchRequest(action: PayloadAction<PostSearchRequestAction<SearchTemplate>>) {
      try {
        const searchId = yield call(api.postSearchRequest, action.payload.searchTemplate);
        const result = {
          searchId,
          searchTemplate: action.payload.searchTemplate,
        };
        yield put(actions.postSearchRequestSuccess(result));
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, result);
        }
        return result;
      } catch (error) {
        yield put(actions.failure({ error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* getResultSet(action: PayloadAction<GetResultSetAction<Entity>>) {
      try {
        const records = yield call(
          api.getResultSet,
          action.payload.searchId,
          action.payload.pageSize,
          action.payload.pageNumber,
        );
        const resultSetSize = yield call(api.getResultSetSize, action.payload.searchId);
        yield put(actions.searchSuccess({ records, resultSetSize }));
        if (action.payload.onSuccess) {
          yield call(action.payload.onSuccess, { records, resultSetSize });
        }
      } catch (error) {
        yield put(actions.failure({ error }));
        if (action.payload.onFailure) {
          yield call(action.payload.onFailure, error);
        }
      }
    }

    function* postSearch(action: PayloadAction<PostSearchAction<SearchTemplate, Entity>>) {
      const payload = yield call(postSearchRequest, {
        type: actions.postSearchRequest.type,
        payload: {
          searchTemplate: action.payload.searchTemplate,
          onFailure: action.payload.onFailure,
        },
      });
      yield put(
        actions.getResultSet({
          searchId: payload.searchId,
          pageSize: action.payload.pageSize,
          page: action.payload.pageNumber,
          onSuccess: action.payload.onSuccess,
          onFailure: action.payload.onFailure,
        }),
      );
    }

    return function* saga() {
      yield all([
        yield takeEvery(actions.setSearchTemplate.type, setSearchTemplate),
        yield takeLatest(actions.postSearchRequest.type, postSearchRequest),
        yield takeLatest(actions.getResultSet.type, getResultSet),
        yield takeLatest(actions.postSearch.type, postSearch),
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
