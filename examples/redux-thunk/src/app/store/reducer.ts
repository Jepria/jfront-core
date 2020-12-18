import { EntityState, SearchState } from "@jfront/core-redux-thunk";
import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { initialEntityState, reducer as crudReducer } from "../../list/state/listCrudSlice";
import { initialSearchState, reducer as searchReducer } from "../../list/state/listSearchSlice";
import { Item } from "../../list/types";

export interface AppState {
  list: {
    listSearchSlice: SearchState<string, Item>;
    listCrudSlice: EntityState<Item>;
  };
}

export const initialState: AppState = {
  list: {
    listSearchSlice: initialSearchState,
    listCrudSlice: initialEntityState,
  },
};

const listReducer = combineReducers({
  listSearchSlice: searchReducer,
  listCrudSlice: crudReducer,
});

export const reducer: Reducer<AppState> = combineReducers<AppState>({
  list: listReducer,
});
