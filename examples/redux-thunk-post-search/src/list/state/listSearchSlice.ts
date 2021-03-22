import { createSessionSearchSlice, SessionSearchState } from "@jfront/core-redux-thunk";
import { ListSearchApi } from "../api/ListApi";
import { SearchTemplate } from "../api/ListTypes";
import { Item } from "../types";

export const initialSearchState: SessionSearchState<SearchTemplate, Item> = {
  isLoading: false,
  pageSize: 25,
  pageNumber: 1,
  records: [],
};

const api = new ListSearchApi("");

const slice = createSessionSearchSlice<SearchTemplate, Item>({
  name: "listSlice",
  initialState: initialSearchState,
});

const thunkCreators = slice.thunk;

export const getResultSet = thunkCreators.getResultSetThunk(api);
export const postSearch = thunkCreators.postSearchThunk(api);

export const { name, actions, reducer } = slice;
