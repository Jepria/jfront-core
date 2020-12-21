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
  PostSearchAction,
  PostSearchRequestAction,
  PostSearchRequestSuccessAction,
  SearchAction,
  SearchSuccessAction,
  SetSearchTemplateAction,
} from "../action/searchActionTypes";
import { SearchState } from "../types";
import { call, put, takeLatest } from "redux-saga/effects";

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
        state.searchTemplate = action.payload.searchTemplate;
      },
      postSearchRequest(state: S, action: PayloadAction<PostSearchRequestAction<SearchTemplate>>) {
        state.isLoading = true;
      },
      postSearchRequestSuccess(
        state: S,
        action: PayloadAction<PostSearchRequestSuccessAction<SearchTemplate>>,
      ) {
        state.isLoading = false;
        state.searchTemplate = action.payload.searchTemplate;
        state.searchId = action.payload.searchId;
      },
      search(state: S, action: PayloadAction<SearchAction<Entity>>) {
        state.isLoading = true;
      },
      searchSuccess(state: S, action: PayloadAction<SearchSuccessAction<Entity>>) {
        state.isLoading = false;
        state.records = action.payload.records;
        state.resultSetSize = action.payload.resultSetSize;
      },
      postSearch(state: S, action: PayloadAction<PostSearchAction<SearchTemplate, Entity>>) {
        state.isLoading = true;
      },
      failure(state: S, action: FailureAction<any>) {
        state.error = action.error;
      },
      ...reducers,
    },
    extraReducers: {
      ...extraReducers,
    },
  });

  const actions = slice.actions as any; //cast to any, unknown TS issue

  const createSagaMiddleware = (api: ConnectorSearch<Entity, SearchTemplate>) => {
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

    function* search(action: PayloadAction<SearchAction<Entity>>) {
      try {
        const records = yield call(
          api.search,
          action.payload.searchId,
          action.payload.pageSize,
          action.payload.page,
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
        actions.search({
          searchId: payload.searchId,
          pageSize: action.payload.pageSize,
          page: action.payload.page,
          onSuccess: action.payload.onSuccess,
          onFailure: action.payload.onFailure,
        }),
      );
    }

    function* searchWatcher() {
      yield takeLatest(actions.postSearchRequest.type, postSearchRequest);
      yield takeLatest(actions.search.type, search);
      yield takeLatest(actions.postSearch.type, postSearch);
    }

    return function* saga() {
      yield searchWatcher();
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    createSagaMiddleware,
  };
};
