import {
  ActionReducerMapBuilder,
  CaseReducers,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { ConnectorSearch, SearchRequest } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
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
      [name + "/postSearchTemplateThunk/pending"]: (state) => {
        state.isLoading = true;
      },
      [name + "/postSearchTemplateThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.searchTemplate = action.payload.searchTemplate;
        state.searchId = action.payload.searchId;
      },
      [name + "/postSearchTemplateThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      },
      [name + "/searchThunk/pending"]: (state) => {
        state.isLoading = true;
      },
      [name + "/searchThunk/fulfilled"]: (state, action) => {
        state.isLoading = false;
        state.records = action.payload.records;
        state.resultSetSize = action.payload.resultSetSize;
      },
      [name + "/searchThunk/rejected"]: (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      },
      ...extraReducers,
    },
  });

  const postSearchTemplateThunk = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    return createAsyncThunk<
      PostSearchRequestSuccessAction<SearchTemplate>,
      PostSearchRequestAction<SearchTemplate>
    >(name + "/postSearchTemplateThunk", async (payload, { rejectWithValue }) => {
      try {
        const searchId = await api.postSearchRequest(payload.searchTemplate);
        return {
          searchTemplate: payload.searchTemplate,
          searchId,
        };
      } catch (error) {
        return rejectWithValue(error);
      }
    });
  };

  const searchThunk = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    return createAsyncThunk<SearchSuccessAction<Entity>, SearchAction>(
      name + "/searchThunk",
      async (payload, { rejectWithValue }) => {
        try {
          const response = await api.search(
            String(payload.searchId),
            payload.pageSize,
            payload.page,
          );
          const resultSetSize = await api.getResultSetSize(String(payload.searchId));
          return {
            records: response,
            resultSetSize,
          };
        } catch (error) {
          return rejectWithValue(error);
        }
      },
    );
  };

  const createSagaMiddleware = (api: ConnectorSearch<Entity, SearchTemplate>) => {
    const actions = slice.actions as any;

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
      postSearchTemplateThunk,
      searchThunk,
    },
    createSagaMiddleware,
  };
};
