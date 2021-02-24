import { OptionState, createOptionsSlice } from "@jfront/core-redux-thunk";

export const initialOptionsState: OptionState<string> = {
  error: "",
  isLoading: false,
  options: [],
};

const ListOptionsSlice = createOptionsSlice({
  name: "listOptionsSlice",
  initialState: initialOptionsState,
  reducers: {},
});

export const getListOptions = ListOptionsSlice.thunk.getOptions(() => {
  return new Promise((resolve) => resolve(["test1", "test2"]));
});

export const { name, actions, reducer } = ListOptionsSlice;
