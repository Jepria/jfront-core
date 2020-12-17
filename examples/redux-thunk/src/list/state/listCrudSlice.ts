import { createCrudSlice, EntityState } from "@jfront/core-redux";
import { ListCrudApi } from "../api/ListApi";
import { Item } from "../types";

export const initialEntityState: EntityState<Item> = {
  isLoading: false,
  selectedRecords: [],
};

const api = new ListCrudApi("");

const slice = createCrudSlice<string, Item>({
  name: "listSlice",
  initialState: initialEntityState,
});

const thunkCreators = slice.thunk;

export const getRecordById = thunkCreators.getRecordByIdThunk(api);
export const createRecord = thunkCreators.createThunk(api);
export const deleteRecord = thunkCreators.deleteThunk(api);

export const { name, actions, reducer } = slice;
