import { configureStore } from "@reduxjs/toolkit";
import { createOptionsSlice, OptionState } from "./createOptionsSlice";

const initialState = {
  error: "",
  isLoading: false,
  options: [],
};

const optionsSlice = createOptionsSlice<string>({
  name: "options",
  initialState: initialState,
  reducers: {},
});

const getOptions = optionsSlice.thunk.getOptions(() => {
  return ["test"];
});
describe("test", () => {
  const store = configureStore({
    reducer: {
      options: optionsSlice.reducer,
    },
  });
  it("should", () => {
    // optionsSlice.reducer(initialState, {
    //   type: optionsSlice.actions.getOptionsStart,
    //   payload: {
    //   }
    // })
    // store.dispatch(getOptions());
    // expect().toEqual("test");
  });
});
