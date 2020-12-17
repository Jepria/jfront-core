import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../app/store/reducer";
import { ListPage } from "./page/ListPage";
import { actions as crudActions } from "./state/listCrudSlice";
import { actions as searchActions } from "./state/listSearchSlice";
import { useFormik } from "formik";
import namor from "namor";

export const List = () => {
  const { searchTemplate, searchId } = useSelector((state: AppState) => state.list.listSearchSlice);
  const { selectedRecords, currentRecord } = useSelector(
    (state: AppState) => state.list.listCrudSlice,
  );
  const dispatch = useDispatch();
  const formik = useFormik<{ name: string }>({
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      dispatch(
        searchActions.postSearchRequest({
          searchTemplate: {
            template: values.name,
          },
          callback: (searchId) => {
            dispatch(
              searchActions.search({
                searchId,
                pageSize: 0,
                page: 0,
              }),
            );
          },
        }),
      );
    },
  });

  const dispatchSearch = () => {
    if (searchId) {
      dispatch(
        searchActions.search({
          searchId: searchId,
          pageSize: 0,
          page: 0,
        }),
      );
    } else if (searchTemplate) {
      dispatch(
        searchActions.postSearchRequest({
          searchTemplate,
          callback: (searchId) => {
            dispatch(
              searchActions.search({
                searchId,
                pageSize: 0,
                page: 0,
              }),
            );
          },
        }),
      );
    } else {
      dispatch(
        searchActions.postSearchRequest({
          searchTemplate: {
            template: "",
          },
          callback: (searchId) => {
            dispatch(
              searchActions.search({
                searchId,
                pageSize: 0,
                page: 0,
              }),
            );
          },
        }),
      );
    }
  };

  return (
    <section>
      <nav>
        <form
          onSubmit={formik.handleSubmit}
          style={{ padding: 0, margin: 0, display: "inline-flex", flexDirection: "row" }}
        >
          <label>
            name: <input name="name" value={formik.values.name} onChange={formik.handleChange} />
          </label>
          <button type="submit" style={{ margin: "5px" }}>
            Filter
          </button>
          <button
            type="button"
            style={{ margin: "5px" }}
            onClick={() => {
              dispatch(
                crudActions.create({
                  values: {
                    name: namor.generate({ words: 1, numbers: 0 }),
                    value: namor.generate({ words: 1, numbers: 0 }),
                  },
                  callback: () => {
                    dispatchSearch();
                  },
                }),
              );
            }}
          >
            Add
          </button>
          <button
            type="button"
            style={{ margin: "5px" }}
            disabled={!currentRecord && selectedRecords.length === 0}
            onClick={() => {
              const primaryKeys = currentRecord
                ? [currentRecord.value]
                : selectedRecords.map((record) => record.value);
              dispatch(
                crudActions.remove({
                  primaryKeys,
                  callback: () => {
                    dispatchSearch();
                  },
                }),
              );
            }}
          >
            Remove
          </button>
        </form>
      </nav>
      <ListPage />
    </section>
  );
};
