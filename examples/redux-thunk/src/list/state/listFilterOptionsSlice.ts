import { OptionState, createOptionsSlice } from "@jfront/core-redux-thunk";

export const initialFilterOptionsState: OptionState<string> = {
  error: "",
  isLoading: false,
  options: [],
};

const ListOptionsSlice = createOptionsSlice({
  name: "listFilterOptionsSlice",
  initialState: initialFilterOptionsState,
  reducers: {},
});

export const getListFilterOptions = ListOptionsSlice.thunk.getOptions((name: string) => {
  // setTimeout(() => {
  //   return ["test1", "test2"];
  // }, 1000)
  return ["test1", "test2", "test3", "test4", "test5"].filter((text) => text.startsWith(name));
});

export const { name, actions, reducer } = ListOptionsSlice;
