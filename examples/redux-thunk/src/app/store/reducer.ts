import { EntityState, OptionState, SearchState } from "@jfront/core-redux-thunk";
import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { initialEntityState, reducer as crudReducer } from "../../list/state/listCrudSlice";
import { initialSearchState, reducer as searchReducer } from "../../list/state/listSearchSlice";
import { initialOptionsState, reducer as optionsReducer } from "../../list/state/listOptionsSlice";
import { Item } from "../../list/types";

export interface AppState {
  list: {
    listSearchSlice: SearchState<string, Item>;
    listCrudSlice: EntityState<Item>;
    listOptionsSlice: OptionState<string>;
  };
}

export const initialState: AppState = {
  list: {
    listSearchSlice: initialSearchState,
    listCrudSlice: initialEntityState,
    listOptionsSlice: initialOptionsState,
  },
};

const listReducer = combineReducers({
  listSearchSlice: searchReducer,
  listCrudSlice: crudReducer,
  listOptionsSlice: optionsReducer,
});

export const reducer: Reducer<AppState> = combineReducers<AppState>({
  list: listReducer,
});
