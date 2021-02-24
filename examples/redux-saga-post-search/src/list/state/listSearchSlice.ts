import { createSearchSlice, SearchState } from "@jfront/core-redux-saga";
import { ListSearchApi } from "../api/ListApi";
import { SearchTemplate } from "../api/ListTypes";
import { Item } from "../types";

export const initialSearchState: SearchState<SearchTemplate, Item> = {
  isLoading: false,
  pageNumber: 1,
  pageSize: 25,
  records: [],
};

const api = new ListSearchApi("");

const slice = createSearchSlice<SearchTemplate, Item>({
  name: "listSlice",
  initialState: initialSearchState,
});

export const { name, actions, reducer } = slice;

export const searchSaga = slice.createSagaMiddleware(api);
