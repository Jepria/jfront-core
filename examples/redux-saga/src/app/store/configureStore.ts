import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
import { configureStore as configureStoreRedux, getDefaultMiddleware } from "@reduxjs/toolkit";
import { crudSaga } from "../../list/state/listCrudSlice";
import { searchSaga } from "../../list/state/listSearchSlice";
import { initialState, reducer } from "./reducer";
import logger from "redux-logger";

function* rootSaga() {
  yield all([crudSaga(), searchSaga()]);
}

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStoreRedux({
    reducer,
    middleware: [...getDefaultMiddleware().concat(logger), sagaMiddleware],
    preloadedState: initialState,
    devTools: process.env.NODE_ENV === "development",
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
