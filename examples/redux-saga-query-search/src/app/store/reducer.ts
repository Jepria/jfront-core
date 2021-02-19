import { EntityState, OptionState, SearchState } from "@jfront/core-redux-saga";
import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { initialEntityState, reducer as crudReducer } from "../../list/state/listCrudSlice";
import { initialOptionsState, reducer as optionsReducer } from "../../list/state/listOptionsSlice";
import {
  initialFilterOptionsState,
  reducer as filterOptionsReducer,
} from "../../list/state/listFilterOptionsSlice";
import { initialSearchState, reducer as searchReducer } from "../../list/state/listSearchSlice";
import { Item } from "../../list/types";
import { SearchTemplate } from "../../list/api/ListTypes";

export interface AppState {
  list: {
    listSearchSlice: SearchState<SearchTemplate, Item>;
    listCrudSlice: EntityState<Item>;
    listOptionsSlice: OptionState<string>;
    listFilterOptionsSlice: OptionState<string>;
  };
}

export const initialState: AppState = {
  list: {
    listSearchSlice: initialSearchState,
    listCrudSlice: initialEntityState,
    listOptionsSlice: initialOptionsState,
    listFilterOptionsSlice: initialFilterOptionsState,
  },
};

const listReducer = combineReducers({
  listSearchSlice: searchReducer,
  listCrudSlice: crudReducer,
  listOptionsSlice: optionsReducer,
  listFilterOptionsSlice: filterOptionsReducer,
});

export const reducer: Reducer<AppState> = combineReducers<AppState>({
  list: listReducer,
});
