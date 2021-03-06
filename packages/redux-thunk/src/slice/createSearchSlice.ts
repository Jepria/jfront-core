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
import queryString from "query-string";
import { ConnectorSearch, SearchRequest } from "@jfront/core-rest";
import { FailureAction } from "../action/actionTypes";
import {
  SearchAction,
  SearchSuccessAction,
  SetSearchTemplateAction,
} from "../action/searchActionTypes";
import { SearchState } from "../types";

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

  const searchThunk = (api: ConnectorSearch<Entity>) => {
    return function (
      searchRequest: SearchRequest<SearchTemplate>,
      pageSize: number,
      pageNumber: number,
    ): ThunkAction<Promise<SearchSuccessAction<Entity>>, S, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(
            actions.search({
              searchTemplate: searchRequest,
              pageSize,
              pageNumber,
            }),
          );
          const template = { ...searchRequest.template };
          for (const param in template) {
            if (template[param] === undefined || template[param] === null) {
              delete template[param];
            }
          }

          const sort = {};
          searchRequest.listSortConfiguration?.forEach((sortConfig) => {
            if (sort["sort"]) {
              (sort["sort"] as Array<string>).push(
                `${sortConfig.columnName},${sortConfig.sortOrder}`,
              );
            } else {
              sort["sort"] = [`${sortConfig.columnName},${sortConfig.sortOrder}`];
            }
          });
          const query = queryString.stringify({
            ...template,
            ...sort,
            page: String(pageNumber),
            pageSize: String(pageSize),
          });

          const response = await api.search(query.toString());
          const result = {
            records: response.resultsetSize > 0 ? response.data : [],
            resultSetSize: response.resultsetSize,
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

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    thunk: {
      searchThunk,
    },
  };
};
