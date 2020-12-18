import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { configureStore as configureStoreRedux } from "@reduxjs/toolkit";
import { crudSaga } from "../../list/state/listCrudSlice";
import { searchSaga } from "../../list/state/listSearchSlice";
import { initialState, reducer } from "./reducer";
import logger from "redux-logger";
import { useDispatch } from "react-redux";

function* rootSaga() {
  yield all([crudSaga(), searchSaga()]);
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const middleware = [sagaMiddleware, logger];

  const store = configureStoreRedux({
    reducer,
    middleware: middleware,
    preloadedState: initialState,
    devTools: process.env.NODE_ENV === "development",
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

export const store = configureStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
