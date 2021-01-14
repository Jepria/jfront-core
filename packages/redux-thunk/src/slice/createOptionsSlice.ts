import {
  Action,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
  ThunkAction,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

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
      getOptionsStart(state) {
        state.isLoading = true;
        state.error = "";
      },
      getOptionsSuccess(state, action) {
        state.options = action.payload;
        state.error = "";
        state.isLoading = false;
      },
      getOptionsFailure(state: OptionState<T>, action: PayloadAction<any>) {
        state.error = action.payload;
        state.options = [];
        state.isLoading = false;
      },
      ...reducers,
    },
  });

  const actions = slice.actions as any;

  const getOptions = (apiGetOptions: (...parameters: any) => T[]) => {
    return function (
      ...parameters: any
    ): ThunkAction<Promise<any>, OptionState<T>, unknown, Action<string>> {
      return async (dispatch) => {
        try {
          dispatch(actions.getOptionsStart());
          const options = await apiGetOptions(parameters);
          dispatch(actions.getOptionsSuccess(options));
        } catch (error) {
          return dispatch(actions.getOptionsFailure(error));
        }
      };
    };
  };

  return {
    name: slice.name,
    actions: slice.actions,
    reducer: slice.reducer,
    caseReducers: slice.caseReducers,
    thunk: {
      getOptions,
    },
  };
};
