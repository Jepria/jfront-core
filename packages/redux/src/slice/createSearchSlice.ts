import {
  Action,
  ActionReducerMapBuilder,
  CaseReducers,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ThunkAction,
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
      search(state: S, action: PayloadAction<SearchAction>) {
        state.isLoading = true;
      },
      searchSuccess(state: S, action: PayloadAction<SearchSuccessAction<Entity>>) {
        state.isLoading = false;
        state.records = action.payload.records;
        state.resultSetSize = action.payload.resultSetSize;
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

  const postSearchRequestThunk = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    return function (
      payload: PostSearchRequestAction<SearchTemplate>,
    ): ThunkAction<
      Promise<PostSearchRequestSuccessAction<SearchTemplate>>,
      S,
      unknown,
      Action<string>
    > {
      return async (dispatch) => {
        try {
          dispatch(actions.postSearchRequest(payload));
          const searchId = await api.postSearchRequest(payload.searchTemplate);
          const result = {
            searchTemplate: payload.searchTemplate,
            searchId,
          };
          dispatch(actions.postSearchRequestSuccess(result));
          return result;
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  const searchThunk = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    return function (
      payload: SearchAction,
    ): ThunkAction<Promise<SearchSuccessAction<Entity>>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.search(payload));
          const response = await api.search(
            String(payload.searchId),
            payload.pageSize,
            payload.page,
          );
          const resultSetSize = await api.getResultSetSize(String(payload.searchId));
          const result = {
            records: response,
            resultSetSize,
          };
          dispatch(actions.searchSuccess(result));
          return result;
        } catch (error) {
          dispatch(actions.failure({ error }));
          return Promise.reject(error);
        }
      };
    };
  };

  const postSearchThunk = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    return function (
      payload: PostSearchAction<SearchTemplate>,
    ): ThunkAction<Promise<SearchSuccessAction<Entity>>, S, unknown, Action<string>> {
      const postSearchRequest = postSearchRequestThunk(api);
      const search = searchThunk(api);
      return async (dispatch) => {
        return dispatch(
          postSearchRequest({
            searchTemplate: payload.searchTemplate,
          }),
        ).then((action) => {
          return dispatch(
            search({
              searchId: action.searchId,
              pageSize: payload.pageSize,
              page: payload.page,
            }),
          );
        });
      };
    };
  };

  const createSagaMiddleware = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    function* postSearchRequest(action: PayloadAction<PostSearchRequestAction<SearchTemplate>>) {
      try {
        const searchId = yield call(api.postSearchRequest, action.payload.searchTemplate);
        yield put(
          actions.postSearchRequestSuccess({
            searchId,
            searchTemplate: action.payload.searchTemplate,
          }),
        );
        if (action.payload.callback) {
          yield call(action.payload.callback, searchId);
        }
      } catch (error) {
        yield put(actions.failure({ error }));
      }
    }

    function* search(action: PayloadAction<SearchAction>) {
      try {
        const records = yield call(
          api.search,
          action.payload.searchId,
          action.payload.pageSize,
          action.payload.page,
        );
        const resultSetSize = yield call(api.getResultSetSize, action.payload.searchId);
        yield put(actions.searchSuccess({ records, resultSetSize }));
      } catch (error) {
        yield put(actions.failure({ error }));
      }
    }

    function* searchWatcher() {
      yield takeLatest(actions.postSearchRequest.type, postSearchRequest);
      yield takeLatest(actions.search.type, search);
    }

    return function* saga() {
      yield searchWatcher();
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    thunk: {
      postSearchRequestThunk,
      searchThunk,
      postSearchThunk,
    },
    createSagaMiddleware,
  };
};
