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
import { ConnectorSessionSearch, SearchRequest } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
  PostSearchRequestAction,
  PostSearchRequestSuccessAction,
  SearchAction,
  SearchSuccessAction,
  SetSearchTemplateAction,
} from "../action/searchActionTypes";
import { SessionSearchState } from "../types";

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
      search(state: S, action: PayloadAction<SearchAction<SearchTemplate>>) {
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

  const postSearchRequestThunk = (api: ConnectorSessionSearch<Entity, SearchTemplate>) => {
    return function (
      searchTemplate: SearchRequest<SearchTemplate>,
    ): ThunkAction<
      Promise<PostSearchRequestSuccessAction<SearchTemplate>>,
      S,
      unknown,
      Action<string>
    > {
      return async (dispatch) => {
        try {
          dispatch(
            actions.postSearchRequest({
              searchTemplate,
            }),
          );
          const searchId = await api.postSearchRequest(searchTemplate);
          const result = {
            searchTemplate: searchTemplate,
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

  const getResultSetThunk = (api: ConnectorSessionSearch<Entity, SearchTemplate>) => {
    return function (
      searchId: string,
      pageSize: number,
      pageNumber: number,
    ): ThunkAction<Promise<SearchSuccessAction<Entity>>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(
            actions.search({
              searchId,
              searchTemplate: null,
              pageSize,
              pageNumber,
            }),
          );
          const response = await api.getResultSet(String(searchId), pageSize, pageNumber);
          const resultSetSize = await api.getResultSetSize(String(searchId));
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

  const postSearchThunk = (api: ConnectorSessionSearch<Entity, SearchTemplate>) => {
    return function (
      searchTemplate: SearchRequest<SearchTemplate>,
      pageSize: number,
      pageNumber: number,
    ): ThunkAction<Promise<SearchSuccessAction<Entity>>, S, unknown, Action<string>> {
      const postSearchRequest = postSearchRequestThunk(api);
      const search = getResultSetThunk(api);
      return async (dispatch) => {
        return dispatch(postSearchRequest(searchTemplate)).then((action) => {
          return dispatch(search(action.searchId, pageSize, pageNumber));
        });
      };
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    thunk: {
      postSearchRequestThunk,
      getResultSetThunk,
      postSearchThunk,
    },
  };
};
