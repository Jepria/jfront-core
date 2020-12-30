import { createCrudSlice, EntityState } from "@jfront/core-redux-saga";
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

export const { name, actions, reducer } = slice;

export const crudSaga = slice.createSagaMiddleware(api);
