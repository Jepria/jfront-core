import { createSearchSlice, SearchState } from "@jfront/core-redux";
import { ListSearchApi } from "../api/ListApi";
import { Item } from "../types";

export const initialSearchState: SearchState<string, Item> = {
  isLoading: false,
  records: [],
};

const api = new ListSearchApi("");

const slice = createSearchSlice<string, Item>({
  name: "listSlice",
  initialState: initialSearchState,
});

export const { name, actions, reducer } = slice;

export const searchSaga = slice.createSagaMiddleware(api);