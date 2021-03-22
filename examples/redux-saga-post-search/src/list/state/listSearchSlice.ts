import { createSessionSearchSlice, SessionSearchState } from "@jfront/core-redux-saga";
import { ListSearchApi } from "../api/ListApi";
import { SearchTemplate } from "../api/ListTypes";
import { Item } from "../types";

export const initialSearchState: SessionSearchState<SearchTemplate, Item> = {
  isLoading: false,
  pageNumber: 1,
  pageSize: 25,
  records: [],
};

const api = new ListSearchApi("");

const slice = createSessionSearchSlice<SearchTemplate, Item>({
  name: "listSlice",
  initialState: initialSearchState,
});

export const { name, actions, reducer } = slice;

export const searchSaga = slice.createSagaMiddleware(api);
