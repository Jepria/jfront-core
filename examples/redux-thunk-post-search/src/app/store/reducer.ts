import { EntityState, OptionState, SessionSearchState } from "@jfront/core-redux-thunk";
import { combineReducers, Reducer } from "@reduxjs/toolkit";
import { initialEntityState, reducer as crudReducer } from "../../list/state/listCrudSlice";
import { initialSearchState, reducer as searchReducer } from "../../list/state/listSearchSlice";
import { initialOptionsState, reducer as optionsReducer } from "../../list/state/listOptionsSlice";
import {
  initialFilterOptionsState,
  reducer as filterOptionsReducer,
} from "../../list/state/listFilterOptionsSlice";
import { Item } from "../../list/types";
import { SearchTemplate } from "../../list/api/ListTypes";

export interface AppState {
  list: {
    listSearchSlice: SessionSearchState<SearchTemplate, Item>;
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
