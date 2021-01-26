import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { FailureAction, GetOptionsAction, GetOptionsActionSuccess } from "../action/actionTypes";

export interface OptionState<T> {
  options: T[];
  isLoading: boolean;
  error: string;
}

export const createOptionsSlice = <
  T = any,
  Reducers extends SliceCaseReducers<OptionState<T>> = SliceCaseReducers<OptionState<T>>
>({
  name = "",
  initialState,
  reducers,
}: {
  name: string;
  initialState: OptionState<T>;
  reducers: ValidateSliceCaseReducers<OptionState<T>, Reducers>;
}) => {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      getOptionsStart(state, action: PayloadAction<GetOptionsAction>) {
        state.isLoading = true;
        state.error = "";
      },
      getOptionsSuccess(state: OptionState<T>, action: PayloadAction<GetOptionsActionSuccess<T>>) {
        state.options = action.payload.options;
        state.error = "";
        state.isLoading = false;
      },
      getOptionsFailure(state: OptionState<T>, action: PayloadAction<FailureAction<any>>) {
        state.error = action.payload.error;
        state.options = [];
        state.isLoading = false;
      },
      ...reducers,
    },
  });

  const actions = slice.actions as any; //cast to any, unknown TS issue

  const createSagaMiddleware = (apiGetOptions: (...parameters: any) => Promise<T[]>) => {
    function* getOptions(action: PayloadAction<GetOptionsAction>) {
      try {
        let result;
        if (Array.isArray(action.payload.params)) {
          result = yield call(apiGetOptions, ...action.payload.params);
        } else {
          result = yield call(apiGetOptions, action.payload.params);
        }
        yield put(actions.getOptionsSuccess({ options: result }));
      } catch (error) {
        yield put(actions.getOptionsFailure({ error: error }));
      }
    }

    return function* saga() {
      yield takeLatest(actions.getOptionsStart.type, getOptions);
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    caseReducers: slice.caseReducers,
    createSagaMiddleware,
  };
};
