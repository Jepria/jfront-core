import { createSearchSlice, SearchState } from "@jfront/core-redux-thunk";
import { ListSearchApi } from "../api/ListApi";
import { SearchTemplate } from "../api/ListTypes";
import { Item } from "../types";

export const initialSearchState: SearchState<SearchTemplate, Item> = {
  isLoading: false,
  pageSize: 25,
  pageNumber: 1,
  records: [],
};

const api = new ListSearchApi("");

const slice = createSearchSlice<SearchTemplate, Item>({
  name: "listSlice",
  initialState: initialSearchState,
});

const thunkCreators = slice.thunk;

export const search = thunkCreators.searchThunk(api);

export const { name, actions, reducer } = slice;
